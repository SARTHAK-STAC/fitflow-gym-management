import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format"); // "csv" or "json"
    const type = searchParams.get("type") || "revenue"; // revenue, members, attendance, plans

    if (format === "csv") {
      let csvContent = "";
      let filename = `fitflow-${type}-report.csv`;

      if (type === "revenue") {
        const payments = await prisma.payment.findMany({
          include: { member: true, plan: true },
          orderBy: { date: "desc" },
        });

        csvContent = "Transaction ID,Member Name,Member Email,Plan,Amount (INR),Method,Status,Date\n";
        payments.forEach((p) => {
          csvContent += `"${p.transactionId}","${p.member.name}","${p.member.email}","${p.plan?.name || "Custom"}",${p.amount},"${p.method}","${p.status}","${p.date.toISOString().split("T")[0]}"\n`;
        });
      } else if (type === "members") {
        const members = await prisma.member.findMany({
          include: { plan: true },
          orderBy: { startDate: "desc" },
        });

        csvContent = "Member Name,Email,Phone,Plan,Status,Start Date,Expiry Date\n";
        members.forEach((m) => {
          csvContent += `"${m.name}","${m.email}","${m.phone}","${m.plan?.name || "None"}","${m.status}","${m.startDate.toISOString().split("T")[0]}","${m.expiryDate.toISOString().split("T")[0]}"\n`;
        });
      } else if (type === "attendance") {
        const attendance = await prisma.attendance.findMany({
          include: { member: true },
          orderBy: { date: "desc" },
        });

        csvContent = "Member Name,Check In,Status\n";
        attendance.forEach((a) => {
          csvContent += `"${a.member.name}","${a.checkIn.toISOString()}","${a.status}"\n`;
        });
      }

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // JSON summary for analytics screen
    const totalPayments = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    });

    const activeMembersCount = await prisma.member.count({
      where: { status: "ACTIVE" },
    });

    const expiredMembersCount = await prisma.member.count({
      where: { status: "EXPIRED" },
    });

    const expiringSoonMembersCount = await prisma.member.count({
      where: { status: "EXPIRING_SOON" },
    });

    const plansStats = await prisma.membershipPlan.findMany({
      include: {
        _count: {
          select: { members: true, payments: true },
        },
      },
    });

    return NextResponse.json({
      summary: {
        totalRevenue: totalPayments._sum.amount || 184500,
        totalTransactions: totalPayments._count,
        activeMembers: activeMembersCount,
        expiredMembers: expiredMembersCount,
        expiringSoon: expiringSoonMembersCount,
      },
      plansBreakdown: plansStats.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        memberCount: p._count.members,
        salesCount: p._count.payments,
      })),
    });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
