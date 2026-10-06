import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { qrCode } = await request.json();

    if (!qrCode || typeof qrCode !== "string") {
      return NextResponse.json({ error: "Invalid QR code" }, { status: 400 });
    }

    // Lookup member by qrCode
    const member = await prisma.member.findUnique({
      where: { qrCode: qrCode.trim() },
      include: { plan: true },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Unrecognized Member QR Code. Access denied.",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const isExpired = new Date(member.expiryDate) < now || member.status === "EXPIRED";

    if (isExpired) {
      return NextResponse.json({
        success: false,
        verified: true,
        expired: true,
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          plan: member.plan?.name,
          expiryDate: member.expiryDate,
        },
        message: `MEMBERSHIP EXPIRED on ${new Date(member.expiryDate).toLocaleDateString("en-IN")}. Please renew your membership.`,
      });
    }

    // Check if already checked in today within the last 60 minutes
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCheckIn = await prisma.attendance.findFirst({
      where: {
        memberId: member.id,
        checkIn: { gte: oneHourAgo },
      },
    });

    if (recentCheckIn) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        member: {
          id: member.id,
          name: member.name,
          plan: member.plan?.name,
          expiryDate: member.expiryDate,
        },
        message: `Member ${member.name} was already verified today at ${new Date(recentCheckIn.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
      });
    }

    // Record QR check-in
    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        date: now,
        checkIn: now,
        status: "PRESENT",
        method: "QR_SCAN",
      },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      expired: false,
      member: {
        id: member.id,
        name: member.name,
        plan: member.plan?.name || "Standard Membership",
        expiryDate: member.expiryDate,
        status: member.status,
      },
      attendance,
      message: `CHECK-IN SUCCESSFUL! Welcome ${member.name}.`,
    });
  } catch (error: any) {
    console.error("Scan attendance error:", error);
    return NextResponse.json({ error: error.message || "Failed to process QR scan" }, { status: 500 });
  }
}
