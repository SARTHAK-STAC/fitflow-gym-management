import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing records to ensure idempotency
  await prisma.attendance.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.member.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  // 1. Seed Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@fitflow.com",
      password: hashedPassword,
      name: "Vikram Malhotra",
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created:", admin.email);

  // 2. Seed Membership Plans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: "Basic",
      price: 999,
      duration: 30,
      description: "Essential fitness facilities for consistent gym-goers.",
      features: JSON.stringify([
        "Full gym floor access",
        "Modern cardio equipment zone",
        "Clean locker room & shower access",
        "Free Wi-Fi",
        "Open 6:00 AM - 10:00 PM",
      ]),
      isPopular: false,
      isActive: true,
    },
  });

  const proPlan = await prisma.membershipPlan.create({
    data: {
      name: "Pro",
      price: 1999,
      duration: 30,
      description: "Our most popular comprehensive fitness and body conditioning tier.",
      features: JSON.stringify([
        "Everything in Basic plan",
        "2 Personal Training sessions / month",
        "Quarterly Nutrition & Diet consultation",
        "Steam & Sauna bath access",
        "Access to weekend group yoga & HIIT",
        "Smoothie bar discount (10%)",
      ]),
      isPopular: true,
      isActive: true,
    },
  });

  const elitePlan = await prisma.membershipPlan.create({
    data: {
      name: "Elite",
      price: 3499,
      duration: 30,
      description: "The VIP athletic experience with dedicated coaches and personalized regimen.",
      features: JSON.stringify([
        "Everything in Pro plan",
        "Unlimited 1-on-1 Personal Training",
        "Customized Bi-weekly Diet Plan & InBody scans",
        "Dedicated VIP locker with laundry kit",
        "Priority slot booking for peak hours",
        "Complimentary recovery zone & ice baths",
        "24/7 Concierge & trainer WhatsApp support",
      ]),
      isPopular: false,
      isActive: true,
    },
  });
  console.log("✓ Membership plans seeded: Basic, Pro, Elite");

  // 3. Seed Trainers
  const trainersData = [
    {
      name: "Kabir Mehra",
      email: "kabir.mehra@fitflow.com",
      phone: "+91 98201 54321",
      specialization: "Hypertrophy & Strength Coach",
      experience: "7+ years",
      bio: "Certified CSCS trainer specializing in bodybuilding, heavy compound lifts, and progressive overload.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sneha Nair",
      email: "sneha.nair@fitflow.com",
      phone: "+91 97112 87654",
      specialization: "Functional Fitness & Pilates",
      experience: "5+ years",
      bio: "Former state gymnast focusing on core conditioning, mobility, flexibility, and post-injury rehab.",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rohan Kapoor",
      email: "rohan.kapoor@fitflow.com",
      phone: "+91 99887 65432",
      specialization: "Fat Loss & Metabolic Conditioning",
      experience: "6+ years",
      bio: "High-energy coach dedicated to high-intensity circuit training, endurance, and transformation diets.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pooja Hegde",
      email: "pooja.hegde@fitflow.com",
      phone: "+91 96543 21098",
      specialization: "Yoga & Mind-Body Wellness",
      experience: "8+ years",
      bio: "Master of Ashtanga Yoga, breathing techniques, and posture correction for desk professionals.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Devendra Singhania",
      email: "devendra.s@fitflow.com",
      phone: "+91 98190 12345",
      specialization: "Powerlifting & Olympic Lifting",
      experience: "9+ years",
      bio: "National bench press medalist coaching powerlifters and athletes looking to max out safely.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const trainers = [];
  for (const t of trainersData) {
    const trainer = await prisma.trainer.create({ data: t });
    trainers.push(trainer);
  }
  console.log(`✓ ${trainers.length} Trainers created.`);

  // 4. Seed Members (20+ realistic Indian members)
  const now = new Date();
  const membersData = [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 12001",
      gender: "Male",
      address: "B-204, Green Glen Layout, Bellandur, Bengaluru",
      emergencyContact: "+91 98765 99001 (Father)",
      plan: proPlan,
      daysToExpiry: 3, // EXPIRING SOON
      trainer: trainers[0],
    },
    {
      name: "Aman Verma",
      email: "aman.verma@example.com",
      phone: "+91 98765 12002",
      gender: "Male",
      address: "Flat 12, Sunrise Residency, Koramangala 4th Block",
      emergencyContact: "+91 98765 99002 (Brother)",
      plan: basicPlan,
      daysToExpiry: 1, // EXPIRING SOON
      trainer: null,
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 12003",
      gender: "Female",
      address: "Villa 8, Palm Meadows, Whitefield, Bengaluru",
      emergencyContact: "+91 98765 99003 (Spouse)",
      plan: elitePlan,
      daysToExpiry: 24, // ACTIVE
      trainer: trainers[1],
    },
    {
      name: "Rohit Singh",
      email: "rohit.singh@example.com",
      phone: "+91 98765 12004",
      gender: "Male",
      address: "102, Shanti Niketan, Indiranagar, Bengaluru",
      emergencyContact: "+91 98765 99004 (Mother)",
      plan: proPlan,
      daysToExpiry: 18, // ACTIVE
      trainer: trainers[2],
    },
    {
      name: "Ananya Gupta",
      email: "ananya.gupta@example.com",
      phone: "+91 98765 12005",
      gender: "Female",
      address: "405, Prestige Oasis, HSR Sector 1, Bengaluru",
      emergencyContact: "+91 98765 99005 (Sister)",
      plan: elitePlan,
      daysToExpiry: 27, // ACTIVE
      trainer: trainers[3],
    },
    {
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      phone: "+91 98765 12006",
      gender: "Male",
      address: "7th Cross, JP Nagar Phase 2, Bengaluru",
      emergencyContact: "+91 98765 99006 (Father)",
      plan: basicPlan,
      daysToExpiry: 6, // EXPIRING SOON
      trainer: null,
    },
    {
      name: "Neha Patel",
      email: "neha.patel@example.com",
      phone: "+91 98765 12007",
      gender: "Female",
      address: "Flat 303, Brigade Millennium, Jayanagar",
      emergencyContact: "+91 98765 99007 (Spouse)",
      plan: proPlan,
      daysToExpiry: -4, // EXPIRED
      trainer: trainers[1],
    },
    {
      name: "Karan Johar",
      email: "karan.johar@example.com",
      phone: "+91 98765 12008",
      gender: "Male",
      address: "55, Lavelle Road, Central Bengaluru",
      emergencyContact: "+91 98765 99008 (Colleague)",
      plan: elitePlan,
      daysToExpiry: 29, // ACTIVE
      trainer: trainers[4],
    },
    {
      name: "Deepika Padukone",
      email: "deepika.p@example.com",
      phone: "+91 98765 12009",
      gender: "Female",
      address: "801, Windmills of Your Mind, Whitefield",
      emergencyContact: "+91 98765 99009 (Manager)",
      plan: elitePlan,
      daysToExpiry: 21, // ACTIVE
      trainer: trainers[1],
    },
    {
      name: "Siddharth Rao",
      email: "siddharth.rao@example.com",
      phone: "+91 98765 12010",
      gender: "Male",
      address: "42, 14th Main, HSR Layout Sector 4",
      emergencyContact: "+91 98765 99010 (Mother)",
      plan: basicPlan,
      daysToExpiry: 12, // ACTIVE
      trainer: null,
    },
    {
      name: "Tanvi Kulkarni",
      email: "tanvi.k@example.com",
      phone: "+91 98765 12011",
      gender: "Female",
      address: "Flat 210, Salarpuria Sattva, Marathahalli",
      emergencyContact: "+91 98765 99011 (Father)",
      plan: proPlan,
      daysToExpiry: 5, // EXPIRING SOON
      trainer: trainers[2],
    },
    {
      name: "Varun Dhawan",
      email: "varun.d@example.com",
      phone: "+91 98765 12012",
      gender: "Male",
      address: "B-12, Embassy Golf Links, Domlur",
      emergencyContact: "+91 98765 99012 (Friend)",
      plan: elitePlan,
      daysToExpiry: 26, // ACTIVE
      trainer: trainers[0],
    },
    {
      name: "Kavita Krishnan",
      email: "kavita.k@example.com",
      phone: "+91 98765 12013",
      gender: "Female",
      address: "House 3, Defence Colony, Indiranagar",
      emergencyContact: "+91 98765 99013 (Spouse)",
      plan: basicPlan,
      daysToExpiry: -10, // EXPIRED
      trainer: null,
    },
    {
      name: "Manish Malhotra",
      email: "manish.m@example.com",
      phone: "+91 98765 12014",
      gender: "Male",
      address: "19, Cunningham Road, Vasanth Nagar",
      emergencyContact: "+91 98765 99014 (Partner)",
      plan: proPlan,
      daysToExpiry: 15, // ACTIVE
      trainer: trainers[3],
    },
    {
      name: "Ritu Sengupta",
      email: "ritu.s@example.com",
      phone: "+91 98765 12015",
      gender: "Female",
      address: "Flat 502, Sobha Morzaria, Bannerghatta Road",
      emergencyContact: "+91 98765 99015 (Mother)",
      plan: proPlan,
      daysToExpiry: 4, // EXPIRING SOON
      trainer: trainers[1],
    },
    {
      name: "Aditya Roy",
      email: "aditya.roy@example.com",
      phone: "+91 98765 12016",
      gender: "Male",
      address: "Green Glen Heights, Sarjapur Road",
      emergencyContact: "+91 98765 99016 (Brother)",
      plan: basicPlan,
      daysToExpiry: 19, // ACTIVE
      trainer: null,
    },
    {
      name: "Ishita Banerjee",
      email: "ishita.b@example.com",
      phone: "+91 98765 12017",
      gender: "Female",
      address: "Skyline Villa, Electronic City Phase 1",
      emergencyContact: "+91 98765 99017 (Father)",
      plan: elitePlan,
      daysToExpiry: 25, // ACTIVE
      trainer: trainers[3],
    },
    {
      name: "Gaurav Chopra",
      email: "gaurav.c@example.com",
      phone: "+91 98765 12018",
      gender: "Male",
      address: "Silver Oak Enclave, BTM Layout 2nd Stage",
      emergencyContact: "+91 98765 99018 (Spouse)",
      plan: proPlan,
      daysToExpiry: 2, // EXPIRING SOON
      trainer: trainers[4],
    },
    {
      name: "Shreya Ghoshal",
      email: "shreya.g@example.com",
      phone: "+91 98765 12019",
      gender: "Female",
      address: "Penthouse 10, Prestige Tech Vista, Kadubeesanahalli",
      emergencyContact: "+91 98765 99019 (Manager)",
      plan: elitePlan,
      daysToExpiry: 28, // ACTIVE
      trainer: trainers[3],
    },
    {
      name: "Kunal Nayyar",
      email: "kunal.n@example.com",
      phone: "+91 98765 12020",
      gender: "Male",
      address: "Flat 101, Ferns Paradise, Outer Ring Road",
      emergencyContact: "+91 98765 99020 (Brother)",
      plan: basicPlan,
      daysToExpiry: -2, // EXPIRED
      trainer: null,
    },
    {
      name: "Simran Kaur",
      email: "simran.kaur@example.com",
      phone: "+91 98765 12021",
      gender: "Female",
      address: "Rosewood Apartments, Malleshwaram 18th Cross",
      emergencyContact: "+91 98765 99021 (Mother)",
      plan: proPlan,
      daysToExpiry: 22, // ACTIVE
      trainer: trainers[1],
    },
    {
      name: "Vikrant Massey",
      email: "vikrant.m@example.com",
      phone: "+91 98765 12022",
      gender: "Male",
      address: "44, Sadashivanagar 3rd Main, Bengaluru",
      emergencyContact: "+91 98765 99022 (Spouse)",
      plan: elitePlan,
      daysToExpiry: 14, // ACTIVE
      trainer: trainers[0],
    },
  ];

  const paymentMethods = ["UPI", "CARD", "CASH", "BANK_TRANSFER"];
  let paymentCounter = 1001;
  let invoiceCounter = 5001;

  for (let i = 0; i < membersData.length; i++) {
    const item = membersData[i];

    // Determine status
    let status = "ACTIVE";
    if (item.daysToExpiry < 0) {
      status = "EXPIRED";
    } else if (item.daysToExpiry <= 7) {
      status = "EXPIRING_SOON";
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (30 - item.daysToExpiry));

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + item.daysToExpiry);

    // Create user account for first member (Rahul) so we can log in as a member!
    let userId: string | undefined = undefined;
    if (i === 0) {
      const memberUser = await prisma.user.create({
        data: {
          email: item.email,
          password: memberPassword,
          name: item.name,
          role: "MEMBER",
        },
      });
      userId = memberUser.id;
      console.log("✓ Created demo member account:", item.email, "(password: member123)");
    }

    const member = await prisma.member.create({
      data: {
        userId,
        name: item.name,
        email: item.email,
        phone: item.phone,
        gender: item.gender,
        address: item.address,
        emergencyContact: item.emergencyContact,
        status,
        startDate,
        expiryDate,
        planId: item.plan.id,
        trainerId: item.trainer ? item.trainer.id : null,
      },
    });

    // Create Payment for this member
    const method = paymentMethods[i % paymentMethods.length];
    const isPending = i === 1; // Aman Verma pending
    const paymentStatus = isPending ? "PENDING" : "PAID";

    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - (20 - (i % 15)));

    const payment = await prisma.payment.create({
      data: {
        transactionId: `TXN-2026-${paymentCounter++}`,
        memberId: member.id,
        planId: item.plan.id,
        amount: item.plan.price,
        method,
        status: paymentStatus,
        date: paymentDate,
        notes: `Monthly fee renewal for ${item.plan.name} tier`,
      },
    });

    // Generate Invoice if PAID
    if (paymentStatus === "PAID") {
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-FF-${invoiceCounter++}`,
          paymentId: payment.id,
          memberId: member.id,
          amount: payment.amount,
          issueDate: payment.date,
          status: "PAID",
        },
      });
    }

    // Add Attendance records for active members (past 7 days check-ins)
    if (status !== "EXPIRED") {
      const attendanceDays = [0, 1, 3, 4, 6];
      for (const dayOffset of attendanceDays) {
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() - dayOffset);
        checkInDate.setHours(7 + (i % 3), 15 + (i * 2) % 40, 0);

        const checkOutDate = new Date(checkInDate);
        checkOutDate.setHours(checkInDate.getHours() + 1, checkInDate.getMinutes() + 25);

        await prisma.attendance.create({
          data: {
            memberId: member.id,
            date: checkInDate,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            status: "PRESENT",
          },
        });
      }
    }
  }

  console.log(`✓ ${membersData.length} Members, Payments, Invoices, and Attendance created.`);

  // 5. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: "Membership Expiring Soon",
        message: "Rahul Sharma's Pro Plan expires in 3 days. Send renewal reminder.",
        type: "EXPIRY",
        isRead: false,
        link: "/admin/members",
      },
      {
        title: "Payment Pending",
        message: "Aman Verma's Basic Plan payment of ₹999 is pending verification.",
        type: "PAYMENT",
        isRead: false,
        link: "/admin/payments",
      },
      {
        title: "Membership Expiring Soon",
        message: "Aman Verma's Basic Plan expires tomorrow.",
        type: "EXPIRY",
        isRead: false,
        link: "/admin/members",
      },
      {
        title: "New Member Registered",
        message: "Vikrant Massey joined on Elite Plan with Coach Kabir Mehra.",
        type: "NEW_MEMBER",
        isRead: true,
        link: "/admin/members",
      },
      {
        title: "Monthly Target Reached",
        message: "Congratulations! FitFlow has crossed ₹1,80,000 in monthly revenue.",
        type: "SYSTEM",
        isRead: true,
        link: "/admin/reports",
      },
    ],
  });

  console.log("✓ Admin notifications seeded.");
  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
