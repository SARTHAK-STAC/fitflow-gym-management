import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  planId: z.string().min(1, "Please select a membership plan"),
  trainerId: z.string().optional().nullable(),
  startDate: z.string().optional(),
  durationDays: z.number().optional().default(30),
  paymentAmount: z.number().optional(),
  paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER"]).optional().default("UPI"),
});

// GET all members with filtering, search, pagination
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const planId = searchParams.get("planId") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (status !== "ALL") {
      where.status = status;
    }

    if (planId !== "ALL") {
      where.planId = planId;
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        plan: true,
        trainer: true,
        payments: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { [sortBy]: order },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Fetch members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST create new member with plan and automatic first payment
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = memberSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.member.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "A member with this email already exists" }, { status: 400 });
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: validated.planId },
    });
    if (!plan) {
      return NextResponse.json({ error: "Selected plan does not exist" }, { status: 400 });
    }

    const startDate = validated.startDate ? new Date(validated.startDate) : new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + (validated.durationDays || plan.duration));

    // Create member
    const newMember = await prisma.member.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone.trim(),
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        gender: validated.gender || null,
        address: validated.address || null,
        emergencyContact: validated.emergencyContact || null,
        status: "ACTIVE",
        startDate,
        expiryDate,
        planId: plan.id,
        trainerId: validated.trainerId || null,
      },
    });

    // Create initial payment record
    const paymentAmount = validated.paymentAmount ?? plan.price;
    const payment = await prisma.payment.create({
      data: {
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        memberId: newMember.id,
        planId: plan.id,
        amount: paymentAmount,
        method: validated.paymentMethod || "UPI",
        status: "PAID",
        notes: `Initial registration fee for ${plan.name} plan`,
      },
    });

    // Create invoice
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-FF-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentId: payment.id,
        memberId: newMember.id,
        amount: paymentAmount,
        status: "PAID",
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        title: "New Member Registered",
        message: `${newMember.name} joined the ${plan.name} Plan.`,
        type: "NEW_MEMBER",
        link: `/admin/members/${newMember.id}`,
      },
    });

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error: any) {
    console.error("Create member error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create member" }, { status: 500 });
  }
}
