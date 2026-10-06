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
    const body = await request.json();

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Check if member with this email or phone already exists
    const existing = await prisma.member.findFirst({
      where: {
        OR: [
          { phone: lead.phone },
          ...(lead.email ? [{ email: lead.email }] : []),
        ],
      },
    });

    if (existing) {
      // Mark lead as converted even if already existing member
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: "CONVERTED" },
      });
      return NextResponse.json({
        success: true,
        message: "This individual is already an active member in the system.",
        member: existing,
      });
    }

    const planId = body.planId || lead.planId;
    const plan = planId ? await prisma.membershipPlan.findUnique({ where: { id: planId } }) : null;
    const durationDays = plan?.duration || 30;

    const startDate = body.startDate ? new Date(body.startDate) : new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const email = lead.email || `${lead.phone.replace(/[^0-9]/g, "")}@fitflow.internal`;

    // 1. Create Member
    const member = await prisma.member.create({
      data: {
        name: lead.name,
        phone: lead.phone,
        email,
        status: "ACTIVE",
        startDate,
        expiryDate,
        qrCode: `FITFLOW-MBR-${Date.now().toString().slice(-6)}`,
        planId: plan ? plan.id : null,
        trainerId: body.trainerId || null,
        address: body.address || null,
      },
      include: { plan: true },
    });

    // 2. Create Payment & Invoice if plan is selected
    if (plan) {
      const paymentAmount = body.paymentAmount !== undefined ? Number(body.paymentAmount) : plan.price;
      const payment = await prisma.payment.create({
        data: {
          transactionId: `TXN-CONV-${Date.now()}`,
          memberId: member.id,
          planId: plan.id,
          amount: paymentAmount,
          method: body.paymentMethod || "UPI",
          status: "PAID",
          notes: `Converted from lead (${lead.source}).`,
        },
      });

      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-FF-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentId: payment.id,
          memberId: member.id,
          amount: paymentAmount,
          discount: 0,
          status: "PAID",
        },
      });
    }

    // 3. Update lead status to CONVERTED
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "CONVERTED" },
    });

    // 4. Update trial booking if exists
    await prisma.trialBooking.updateMany({
      where: { leadId: lead.id },
      data: { status: "CONVERTED" },
    });

    // 5. Notify admin
    await prisma.notification.create({
      data: {
        title: "Lead Converted to Member 🎉",
        message: `${lead.name} has been enrolled into ${plan?.name || "Standard"} Membership!`,
        type: "NEW_MEMBER",
        link: `/admin/members/${member.id}`,
        targetRole: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Lead ${lead.name} successfully converted to an active member!`,
      member,
    });
  } catch (error: any) {
    console.error("Convert lead error:", error);
    return NextResponse.json({ error: error.message || "Failed to convert lead" }, { status: 500 });
  }
}
