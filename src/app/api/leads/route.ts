import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  source: z.string().optional().default("Website"),
  planId: z.string().optional().nullable(),
  status: z.enum(["NEW", "CONTACTED", "TRIAL_BOOKED", "TRIAL_COMPLETED", "CONVERTED", "LOST"]).default("NEW"),
  notes: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
});

// GET all leads with search and status filtering
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const source = searchParams.get("source") || "ALL";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status !== "ALL") {
      where.status = status;
    }

    if (source !== "ALL") {
      where.source = source;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        plan: true,
        trialBooking: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Pipeline metrics calculated directly from database records
    const totalLeads = await prisma.lead.count();
    const newLeads = await prisma.lead.count({ where: { status: "NEW" } });
    const trialsBooked = await prisma.lead.count({ where: { status: "TRIAL_BOOKED" } });
    const trialsCompleted = await prisma.lead.count({ where: { status: "TRIAL_COMPLETED" } });
    const convertedCount = await prisma.lead.count({ where: { status: "CONVERTED" } });
    const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      leads,
      metrics: {
        totalLeads,
        newLeads,
        trialsBooked,
        trialsCompleted,
        convertedCount,
        conversionRate: `${conversionRate}%`,
      },
    });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}

// POST create new lead manually
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        name: validated.name.trim(),
        phone: validated.phone.trim(),
        email: validated.email ? validated.email.trim() : null,
        source: validated.source || "Walk-in",
        planId: validated.planId || null,
        status: validated.status || "NEW",
        notes: validated.notes || null,
        followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
      },
      include: { plan: true },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    console.error("Create lead error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create lead" }, { status: 500 });
  }
}
