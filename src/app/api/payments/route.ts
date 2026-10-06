import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const paymentSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  planId: z.string().optional().nullable(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  method: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER"]),
  status: z.enum(["PAID", "PENDING", "FAILED"]).default("PAID"),
  notes: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const method = searchParams.get("method") || "ALL";
    const memberId = searchParams.get("memberId");

    const where: any = {};

    // Member constraint if member is logged in
    if (session.role === "MEMBER") {
      where.memberId = session.memberId;
    } else if (memberId) {
      where.memberId = memberId;
    }

    if (status !== "ALL") {
      where.status = status;
    }

    if (method !== "ALL") {
      where.method = method;
    }

    if (search) {
      where.OR = [
        { transactionId: { contains: search } },
        { member: { name: { contains: search } } },
        { member: { email: { contains: search } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, email: true, phone: true } },
        plan: { select: { id: true, name: true } },
        invoice: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = paymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        memberId: validated.memberId,
        planId: validated.planId || null,
        amount: validated.amount,
        method: validated.method,
        status: validated.status,
        notes: validated.notes || null,
      },
      include: { member: true, plan: true },
    });

    let invoice = null;
    if (validated.status === "PAID") {
      invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-FF-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentId: payment.id,
          memberId: validated.memberId,
          amount: validated.amount,
          status: "PAID",
        },
      });
    }

    return NextResponse.json({ success: true, payment, invoice }, { status: 201 });
  } catch (error: any) {
    console.error("Record payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to record payment" }, { status: 500 });
  }
}
