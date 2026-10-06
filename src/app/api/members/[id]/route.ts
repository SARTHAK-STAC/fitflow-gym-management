import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  planId: z.string().optional(),
  trainerId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "EXPIRING_SOON", "EXPIRED", "INACTIVE"]).optional(),
  expiryDate: z.string().optional(),
});

// GET single member profile
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

    // If member is fetching, only allow fetching their own profile
    if (session.role === "MEMBER" && session.memberId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        plan: true,
        trainer: true,
        payments: {
          orderBy: { date: "desc" },
          include: { invoice: true },
        },
        attendance: {
          orderBy: { date: "desc" },
          take: 30,
        },
        invoices: {
          orderBy: { issueDate: "desc" },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Fetch single member error:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

// PUT update member
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateSchema.parse(body);

    const dataToUpdate: any = { ...validated };
    if (validated.expiryDate) {
      dataToUpdate.expiryDate = new Date(validated.expiryDate);
    }

    const updated = await prisma.member.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    console.error("Update member error:", error);
    return NextResponse.json({ error: error.message || "Failed to update member" }, { status: 500 });
  }
}

// DELETE member
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

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
