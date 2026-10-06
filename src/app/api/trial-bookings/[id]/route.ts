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
    const { status, message } = body;

    const booking = await prisma.trialBooking.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Trial booking not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (message !== undefined) updateData.message = message;

    const updated = await prisma.trialBooking.update({
      where: { id },
      data: updateData,
    });

    // If associated with a Lead, keep lead status in sync
    if (booking.leadId && status) {
      let leadStatus = undefined;
      if (status === "CONFIRMED") leadStatus = "TRIAL_BOOKED";
      else if (status === "COMPLETED") leadStatus = "TRIAL_COMPLETED";
      else if (status === "CONVERTED") leadStatus = "CONVERTED";
      else if (status === "CANCELLED") leadStatus = "LOST";

      if (leadStatus) {
        await prisma.lead.update({
          where: { id: booking.leadId },
          data: { status: leadStatus },
        });
      }
    }

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error: any) {
    console.error("Update trial booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update trial booking" },
      { status: 500 }
    );
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
    await prisma.trialBooking.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Booking removed" });
  } catch (error: any) {
    console.error("Delete trial booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete trial booking" },
      { status: 500 }
    );
  }
}
