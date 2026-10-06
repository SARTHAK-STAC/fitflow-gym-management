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
    if (body.phone !== undefined) dataToUpdate.phone = body.phone;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.source !== undefined) dataToUpdate.source = body.source;
    if (body.planId !== undefined) dataToUpdate.planId = body.planId || null;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.notes !== undefined) dataToUpdate.notes = body.notes;
    if (body.followUpDate !== undefined) {
      dataToUpdate.followUpDate = body.followUpDate ? new Date(body.followUpDate) : null;
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: dataToUpdate,
      include: { plan: true },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: error.message || "Failed to update lead" }, { status: 500 });
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

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Lead removed" });
  } catch (error: any) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete lead" }, { status: 500 });
  }
}
