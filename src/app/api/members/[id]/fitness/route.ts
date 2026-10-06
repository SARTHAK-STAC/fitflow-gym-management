import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [workoutPlans, dietPlans, notes] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: { memberId: id },
        include: { exercises: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.dietPlan.findMany({
        where: { memberId: id },
        include: { meals: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.memberNote.findMany({
        where: { memberId: id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      workoutPlans,
      dietPlans,
      notes,
    });
  } catch (error) {
    console.error("Fetch fitness plans error:", error);
    return NextResponse.json({ error: "Failed to load fitness data" }, { status: 500 });
  }
}

// POST create workout plan or diet plan or note
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const type = body.type; // "workout" | "diet" | "note"

    if (type === "note") {
      const note = await prisma.memberNote.create({
        data: {
          memberId: id,
          author: session.name || "Admin",
          content: body.content,
        },
      });
      return NextResponse.json({ success: true, note }, { status: 201 });
    }

    if (type === "workout") {
      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          memberId: id,
          title: body.title,
          goal: body.goal || null,
          notes: body.notes || null,
          exercises: {
            create: (body.exercises || []).map((ex: any) => ({
              day: ex.day,
              name: ex.name,
              sets: Number(ex.sets) || 3,
              reps: String(ex.reps || "10"),
              weight: ex.weight || null,
              rest: ex.rest || null,
              notes: ex.notes || null,
            })),
          },
        },
        include: { exercises: true },
      });
      return NextResponse.json({ success: true, workoutPlan }, { status: 201 });
    }

    if (type === "diet") {
      const dietPlan = await prisma.dietPlan.create({
        data: {
          memberId: id,
          title: body.title,
          calories: Number(body.calories) || 2200,
          notes: body.notes || null,
          meals: {
            create: (body.meals || []).map((m: any) => ({
              name: m.name,
              time: m.time,
              foods: m.foods,
              calories: m.calories ? Number(m.calories) : null,
              protein: m.protein || null,
              carbs: m.carbs || null,
              fats: m.fats || null,
              notes: m.notes || null,
            })),
          },
        },
        include: { meals: true },
      });
      return NextResponse.json({ success: true, dietPlan }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type requested" }, { status: 400 });
  } catch (error: any) {
    console.error("Create fitness plan error:", error);
    return NextResponse.json({ error: error.message || "Failed to create" }, { status: 500 });
  }
}
