import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    const { days = 30, paymentMethod = "UPI" } = await request.json();

    const member = await prisma.member.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // New expiry date calculation: if current expiry is in future, add to it; else add to now
    const baseDate = new Date(member.expiryDate) > new Date() ? new Date(member.expiryDate) : new Date();
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + Number(days));

    // Update member
    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        expiryDate: newExpiry,
        status: "ACTIVE",
      },
    });

    // Create renewal payment
    const amount = member.plan?.price || 1999;
    const payment = await prisma.payment.create({
      data: {
        transactionId: `TXN-REN-${Date.now()}`,
        memberId: member.id,
        planId: member.planId,
        amount,
        method: paymentMethod,
        status: "PAID",
        notes: `Membership Renewal (+${days} days)`,
      },
    });

    // Create Invoice
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-FF-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentId: payment.id,
        memberId: member.id,
        amount,
        status: "PAID",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Membership successfully renewed until ${newExpiry.toLocaleDateString()}`,
      member: updatedMember,
    });
  } catch (error) {
    console.error("Renew membership error:", error);
    return NextResponse.json({ error: "Failed to renew membership" }, { status: 500 });
  }
}
