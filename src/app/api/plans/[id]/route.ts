import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
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

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.price !== undefined) dataToUpdate.price = Number(body.price);
    if (body.duration !== undefined) dataToUpdate.duration = Number(body.duration);
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.features !== undefined) dataToUpdate.features = JSON.stringify(body.features);
    if (body.isPopular !== undefined) dataToUpdate.isPopular = body.isPopular;
    if (body.isActive !== undefined) dataToUpdate.isActive = body.isActive;

    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, plan: updated });
  } catch (error: any) {
    console.error("Update plan error:", error);
    return NextResponse.json({ error: error.message || "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.membershipPlan.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Plan deleted successfully" });
  } catch (error: any) {
    console.error("Delete plan error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete plan" }, { status: 500 });
  }
}
