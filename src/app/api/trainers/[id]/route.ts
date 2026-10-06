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

    const updated = await prisma.trainer.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        specialization: body.specialization,
        experience: body.experience,
        bio: body.bio,
        photoUrl: body.photoUrl,
      },
    });

    return NextResponse.json({ success: true, trainer: updated });
  } catch (error: any) {
    console.error("Update trainer error:", error);
    return NextResponse.json({ error: error.message || "Failed to update trainer" }, { status: 500 });
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
    await prisma.trainer.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Trainer deleted successfully" });
  } catch (error: any) {
    console.error("Delete trainer error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete trainer" }, { status: 500 });
  }
}
