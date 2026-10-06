import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trialBookingSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Valid email address required").optional().or(z.literal("")),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().optional().default("Morning (07:00 AM - 10:00 AM)"),
  planId: z.string().optional().or(z.literal("")),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = trialBookingSchema.parse(body);

    const bookingDate = new Date(validated.preferredDate);

    // 1. Create or connect Lead
    let lead = await prisma.lead.findFirst({
      where: { phone: validated.phone.trim() },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: validated.name.trim(),
          phone: validated.phone.trim(),
          email: validated.email ? validated.email.trim() : null,
          source: "Website",
          planId: validated.planId || null,
          status: "TRIAL_BOOKED",
          notes: validated.message ? `Website Trial Form: "${validated.message}"` : "Booked 1-Day Trial Pass via website form.",
          followUpDate: bookingDate,
        },
      });
    } else {
      // Update existing lead status to TRIAL_BOOKED
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: "TRIAL_BOOKED",
          planId: validated.planId || lead.planId,
          followUpDate: bookingDate,
        },
      });
    }

    // 2. Create TrialBooking record
    const trialBooking = await prisma.trialBooking.create({
      data: {
        name: validated.name.trim(),
        phone: validated.phone.trim(),
        email: validated.email ? validated.email.trim() : null,
        preferredDate: bookingDate,
        preferredTime: validated.preferredTime || "Morning (07:00 AM - 10:00 AM)",
        planId: validated.planId || null,
        message: validated.message || null,
        status: "NEW",
        leadId: lead.id,
      },
    });

    // 3. Create Admin Notification
    await prisma.notification.create({
      data: {
        title: "New Free Trial Pass Booked",
        message: `${validated.name} booked a trial session for ${bookingDate.toLocaleDateString("en-IN")}. Contact: ${validated.phone}`,
        type: "TRIAL_BOOKING",
        link: "/admin/leads",
        targetRole: "ADMIN",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Free trial booked successfully! Present your confirmation at the reception desk.",
        booking: trialBooking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Trial booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to submit booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const bookings = await prisma.trialBooking.findMany({
      where,
      include: {
        plan: true,
        lead: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      total: await prisma.trialBooking.count(),
      new: await prisma.trialBooking.count({ where: { status: "NEW" } }),
      confirmed: await prisma.trialBooking.count({ where: { status: "CONFIRMED" } }),
      completed: await prisma.trialBooking.count({ where: { status: "COMPLETED" } }),
      cancelled: await prisma.trialBooking.count({ where: { status: "CANCELLED" } }),
      converted: await prisma.trialBooking.count({ where: { status: "CONVERTED" } }),
    };

    return NextResponse.json({ bookings, counts });
  } catch (error: any) {
    console.error("Failed to fetch trial bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch trial bookings" },
      { status: 500 }
    );
  }
}
