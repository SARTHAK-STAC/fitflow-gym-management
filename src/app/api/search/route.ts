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
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: { members: [], leads: [], payments: [], trainers: [] } });
    }

    const [members, leads, payments, trainers] = await Promise.all([
      prisma.member.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 5,
        include: { plan: true },
      }),
      prisma.lead.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 5,
        include: { plan: true },
      }),
      prisma.payment.findMany({
        where: {
          OR: [
            { transactionId: { contains: q } },
            { member: { name: { contains: q } } },
          ],
        },
        take: 5,
        include: { member: true, plan: true, invoice: true },
      }),
      prisma.trainer.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { specialization: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        take: 4,
      }),
    ]);

    return NextResponse.json({
      results: {
        members,
        leads,
        payments,
        trainers,
      },
    });
  } catch (error) {
    console.error("Global search error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
