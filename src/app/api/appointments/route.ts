import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const appointmentSchema = z.object({
  trainerId: z.string().min(1, "Trainer is required"),
  memberId: z.string().min(1, "Member is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.number().default(60),
  type: z.string().default("Personal Training"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]).default("SCHEDULED"),
  notes: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("trainerId");
    const memberId = searchParams.get("memberId");
    const status = searchParams.get("status") || "ALL";

    const where: any = {};
    if (session.role === "MEMBER" && session.memberId) {
      where.memberId = session.memberId;
    } else if (memberId) {
      where.memberId = memberId;
    }

    if (trainerId && trainerId !== "ALL") where.trainerId = trainerId;
    if (status !== "ALL") where.status = status;

    const appointments = await prisma.trainerSession.findMany({
      where,
      include: {
        trainer: true,
        member: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json({ error: "Failed to load appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = appointmentSchema.parse(body);

    const appointment = await prisma.trainerSession.create({
      data: {
        trainerId: validated.trainerId,
        memberId: validated.memberId,
        date: new Date(validated.date),
        time: validated.time,
        duration: validated.duration,
        type: validated.type,
        status: validated.status,
        notes: validated.notes || null,
      },
      include: {
        trainer: true,
        member: true,
      },
    });

    // Notify trainer and admin
    await prisma.notification.create({
      data: {
        title: "Training Session Scheduled",
        message: `${appointment.type} with ${appointment.member.name} scheduled for ${validated.time} on ${new Date(validated.date).toLocaleDateString("en-IN")}.`,
        type: "APPOINTMENT",
        link: "/admin/appointments",
        targetRole: "ADMIN",
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    console.error("Create appointment error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 });
  }
}
