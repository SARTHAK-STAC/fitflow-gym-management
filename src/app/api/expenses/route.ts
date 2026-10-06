import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const expenseSchema = z.object({
  title: z.string().min(2, "Expense title is required"),
  category: z.string().min(2, "Category is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  date: z.string().optional(),
  paymentMethod: z.string().optional().default("Bank Transfer"),
  description: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "ALL";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const where: any = {};
    if (category !== "ALL") {
      where.category = category;
    }

    if (startDateParam || endDateParam) {
      where.date = {};
      if (startDateParam) where.date.gte = new Date(startDateParam);
      if (endDateParam) where.date.lte = new Date(endDateParam);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Current month expenses total
    const thisMonthExpenses = await prisma.expense.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    // Category breakdown
    const categoryGroup = await prisma.expense.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where: { date: { gte: startOfMonth } },
    });

    const categoryBreakdown = categoryGroup.map((c) => ({
      category: c.category,
      amount: c._sum.amount || 0,
    }));

    return NextResponse.json({
      expenses,
      summary: {
        totalThisMonth: thisMonthExpenses._sum.amount || 0,
        totalAllTime: expenses.reduce((acc, e) => acc + e.amount, 0),
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Fetch expenses error:", error);
    return NextResponse.json({ error: "Failed to load expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = expenseSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        title: validated.title.trim(),
        category: validated.category.trim(),
        amount: validated.amount,
        date: validated.date ? new Date(validated.date) : new Date(),
        paymentMethod: validated.paymentMethod || "Bank Transfer",
        description: validated.description || null,
      },
    });

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error: any) {
    console.error("Create expense error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to record expense" }, { status: 500 });
  }
}
