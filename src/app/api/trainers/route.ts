import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const trainerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone is required"),
  specialization: z.string().min(2, "Specialization is required"),
  experience: z.string().min(1, "Experience is required"),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            plan: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trainers });
  } catch (error) {
    console.error("Fetch trainers error:", error);
    return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = trainerSchema.parse(body);

    const existing = await prisma.trainer.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "Trainer with this email already exists" }, { status: 400 });
    }

    const trainer = await prisma.trainer.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone.trim(),
        specialization: validated.specialization.trim(),
        experience: validated.experience.trim(),
        bio: validated.bio || null,
        photoUrl: validated.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      },
    });

    return NextResponse.json({ success: true, trainer }, { status: 201 });
  } catch (error: any) {
    console.error("Create trainer error:", error);
    return NextResponse.json({ error: error.message || "Failed to create trainer" }, { status: 500 });
  }
}
