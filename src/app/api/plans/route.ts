import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(2, "Plan name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.number().min(1, "Duration in days is required"),
  description: z.string().min(5, "Description is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { price: "asc" },
    });

    const parsedPlans = plans.map((p) => ({
      ...p,
      features: JSON.parse(p.features || "[]"),
      activeMemberCount: p._count.members,
    }));

    return NextResponse.json({ plans: parsedPlans });
  } catch (error) {
    console.error("Fetch plans error:", error);
    return NextResponse.json({ error: "Failed to load membership plans" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = planSchema.parse(body);

    const newPlan = await prisma.membershipPlan.create({
      data: {
        name: validated.name.trim(),
        price: validated.price,
        duration: validated.duration,
        description: validated.description.trim(),
        features: JSON.stringify(validated.features),
        isPopular: validated.isPopular,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({ success: true, plan: newPlan }, { status: 201 });
  } catch (error: any) {
    console.error("Create plan error:", error);
    return NextResponse.json({ error: error.message || "Failed to create plan" }, { status: 400 });
  }
}
