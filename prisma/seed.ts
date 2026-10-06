import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding with realistic Indian gym data...");

  // Clear existing records to ensure clean relational integrity
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.dietMeal.deleteMany();
  await prisma.dietPlan.deleteMany();
  await prisma.memberNote.deleteMany();
  await prisma.trainerSession.deleteMany();
  await prisma.trialBooking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.expense.deleteMany();
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
      availability: "Mon-Sat: 6:00 AM - 1:00 PM, 4:00 PM - 9:00 PM",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sneha Nair",
      email: "sneha.nair@fitflow.com",
      phone: "+91 97112 87654",
      specialization: "Functional Fitness & Pilates",
      experience: "5+ years",
      bio: "Former state gymnast focusing on core conditioning, mobility, flexibility, and post-injury rehab.",
      availability: "Mon-Fri: 7:00 AM - 12:00 PM, 5:00 PM - 8:30 PM",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rohan Kapoor",
      email: "rohan.kapoor@fitflow.com",
      phone: "+91 99887 65432",
      specialization: "Fat Loss & Metabolic Conditioning",
      experience: "6+ years",
      bio: "High-energy coach dedicated to high-intensity circuit training, endurance, and transformation diets.",
      availability: "Mon-Sat: 6:00 AM - 11:30 AM, 4:30 PM - 9:30 PM",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pooja Hegde",
      email: "pooja.hegde@fitflow.com",
      phone: "+91 96543 21098",
      specialization: "Yoga & Mind-Body Wellness",
      experience: "8+ years",
      bio: "Master of Ashtanga Yoga, breathing techniques, and posture correction for desk professionals.",
      availability: "Tue-Sun: 6:30 AM - 12:00 PM",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Devendra Singhania",
      email: "devendra.s@fitflow.com",
      phone: "+91 98190 12345",
      specialization: "Powerlifting & Olympic Lifting",
      experience: "9+ years",
      bio: "National bench press medalist coaching powerlifters and athletes looking to max out safely.",
      availability: "Mon-Sat: 5:00 PM - 10:00 PM",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const trainers = [];
  for (const t of trainersData) {
    const trainer = await prisma.trainer.create({ data: t });
    trainers.push(trainer);
  }
  console.log(`✓ ${trainers.length} Trainers created.`);

  // 4. Seed Members (22 members with realistic Indian profiles)
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
      status: "EXPIRING_SOON",
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
      status: "EXPIRING_SOON",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "EXPIRING_SOON",
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
      status: "EXPIRED",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "EXPIRING_SOON",
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
      status: "ACTIVE",
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
      status: "EXPIRED",
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
      status: "ACTIVE",
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
      status: "EXPIRING_SOON",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
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
      status: "EXPIRING_SOON",
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
      status: "ACTIVE",
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
      status: "EXPIRED",
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
      status: "ACTIVE",
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
      status: "ACTIVE",
    },
  ];

  const createdMembers = [];
  const paymentMethods = ["UPI", "CARD", "CASH", "BANK_TRANSFER"];
  let paymentCounter = 2001;
  let invoiceCounter = 7001;

  for (let i = 0; i < membersData.length; i++) {
    const item = membersData[i];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (30 - item.daysToExpiry));

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + item.daysToExpiry);

    // Create user account for first member (Rahul Sharma)
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
      console.log("✓ Demo member user created: rahul.sharma@example.com / member123");
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
        status: item.status,
        startDate,
        expiryDate,
        qrCode: `FITFLOW-MBR-${1000 + i}`,
        planId: item.plan.id,
        trainerId: item.trainer ? item.trainer.id : null,
      },
    });

    createdMembers.push(member);

    // Add Member Notes
    await prisma.memberNote.create({
      data: {
        memberId: member.id,
        author: "Vikram Malhotra (Admin)",
        content: `Initial intake consultation completed. Goal: Athletic conditioning. Health clearance signed.`,
      },
    });

    // Create Payment & Invoice
    const method = paymentMethods[i % paymentMethods.length];
    const isPending = i === 1; // Aman Verma pending
    const paymentStatus = isPending ? "PENDING" : "PAID";

    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - (15 - (i % 10)));

    const payment = await prisma.payment.create({
      data: {
        transactionId: `TXN-2026-${paymentCounter++}`,
        memberId: member.id,
        planId: item.plan.id,
        amount: item.plan.price,
        method,
        status: paymentStatus,
        date: paymentDate,
        notes: `Subscription dues for ${item.plan.name} Tier`,
      },
    });

    if (paymentStatus === "PAID") {
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-FF-${invoiceCounter++}`,
          paymentId: payment.id,
          memberId: member.id,
          amount: payment.amount,
          issueDate: payment.date,
          discount: 0,
          status: "PAID",
        },
      });
    }

    // Add Attendance history (100+ total check-in records across all members)
    if (item.status !== "EXPIRED") {
      const pastDays = [0, 1, 2, 4, 5, 7, 8, 10, 11, 13];
      for (const dayOffset of pastDays) {
        const checkInTime = new Date();
        checkInTime.setDate(checkInTime.getDate() - dayOffset);
        checkInTime.setHours(6 + (i % 4), 10 + (i * 3) % 45, 0);

        const checkOutTime = new Date(checkInTime);
        checkOutTime.setHours(checkInTime.getHours() + 1, checkInTime.getMinutes() + 30);

        await prisma.attendance.create({
          data: {
            memberId: member.id,
            date: checkInTime,
            checkIn: checkInTime,
            checkOut: checkOutTime,
            status: "PRESENT",
            method: i % 2 === 0 ? "QR_SCAN" : "MANUAL",
          },
        });
      }
    }
  }

  console.log(`✓ ${createdMembers.length} Members and 100+ Attendance records created.`);

  // 5. Seed Workout Plans & Exercises for Rahul Sharma (and others)
  const rahul = createdMembers[0];
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      memberId: rahul.id,
      title: "4-Day Hypertrophy & Strength Split",
      goal: "Muscle Hypertrophy & Power",
      notes: "Progressive overload every 2 weeks. Maintain 90s rest between heavy compounds.",
    },
  });

  const exercises = [
    { day: "Monday — Chest & Triceps", name: "Barbell Bench Press", sets: 4, reps: "8-10", weight: "75 kg", rest: "90s", notes: "Control the eccentric descent" },
    { day: "Monday — Chest & Triceps", name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "26 kg each", rest: "60s", notes: "Full stretch at bottom" },
    { day: "Monday — Chest & Triceps", name: "Cable Chest Flyes", sets: 3, reps: "12-15", weight: "15 kg", rest: "45s", notes: "Squeeze for 1 sec at peak" },
    { day: "Monday — Chest & Triceps", name: "Rope Tricep Pushdown", sets: 4, reps: "12", weight: "22 kg", rest: "45s", notes: "Keep elbows locked in position" },
    { day: "Tuesday — Back & Biceps", name: "Barbell Deadlift", sets: 4, reps: "6", weight: "120 kg", rest: "120s", notes: "Brace core and drive through heels" },
    { day: "Tuesday — Back & Biceps", name: "Lat Pulldown (Wide Grip)", sets: 3, reps: "10-12", weight: "60 kg", rest: "60s", notes: "Retract scapulae fully" },
    { day: "Tuesday — Back & Biceps", name: "Seated Cable Row", sets: 3, reps: "10", weight: "55 kg", rest: "60s", notes: "Keep torso upright" },
    { day: "Tuesday — Back & Biceps", name: "Barbell Bicep Curl", sets: 4, reps: "10-12", weight: "30 kg", rest: "45s", notes: "Strict form, no swinging" },
    { day: "Thursday — Shoulders & Traps", name: "Overhead Military Press", sets: 4, reps: "8", weight: "50 kg", rest: "90s", notes: "Full lockout at overhead" },
    { day: "Thursday — Shoulders & Traps", name: "Dumbbell Lateral Raises", sets: 4, reps: "15", weight: "12 kg each", rest: "45s", notes: "Slight forward lean" },
    { day: "Friday — Legs & Core", name: "Barbell Back Squat", sets: 4, reps: "8-10", weight: "100 kg", rest: "120s", notes: "Depth below parallel" },
    { day: "Friday — Legs & Core", name: "Romanian Deadlift", sets: 3, reps: "10-12", weight: "70 kg", rest: "75s", notes: "Hinge at the hips" },
    { day: "Friday — Legs & Core", name: "Leg Press", sets: 3, reps: "12", weight: "160 kg", rest: "60s", notes: "Do not lock knees at top" },
    { day: "Friday — Legs & Core", name: "Hanging Leg Raises", sets: 3, reps: "15", weight: "Bodyweight", rest: "45s", notes: "Controlled slow descent" },
  ];

  for (const ex of exercises) {
    await prisma.workoutExercise.create({
      data: {
        workoutPlanId: workoutPlan.id,
        ...ex,
      },
    });
  }
  console.log("✓ Workout Plan and 14 Exercises created for Rahul Sharma.");

  // 6. Seed Diet Plan & Meals for Rahul Sharma
  const dietPlan = await prisma.dietPlan.create({
    data: {
      memberId: rahul.id,
      title: "Clean Hypertrophy Nutrition Protocol",
      calories: 2750,
      notes: "Stay hydrated with 3.5L water daily. Pre-workout meal 90 mins before training.",
    },
  });

  const meals = [
    {
      name: "Breakfast",
      time: "8:00 AM",
      foods: "80g Rolled Oats, 300ml Skimmed Milk, 1 Scoop Whey Protein, 1 Banana, 15g Almonds",
      calories: 620,
      protein: "42g",
      carbs: "82g",
      fats: "14g",
      notes: "Cook oats with milk and stir protein powder when warm.",
    },
    {
      name: "Mid-Morning Snack",
      time: "11:30 AM",
      foods: "4 Whole Boiled Eggs, 2 Slices Whole Grain Toast, 1 Apple",
      calories: 410,
      protein: "26g",
      carbs: "34g",
      fats: "18g",
      notes: "Quick nutrient boost before noon meetings.",
    },
    {
      name: "Lunch",
      time: "2:00 PM",
      foods: "180g Grilled Chicken Breast / Paneer, 1.5 Cups Brown Rice, Dal Tadka, Mixed Green Salad",
      calories: 720,
      protein: "48g",
      carbs: "78g",
      fats: "16g",
      notes: "Season with lemon, black pepper, and herbs.",
    },
    {
      name: "Pre-Workout Snack",
      time: "5:30 PM",
      foods: "1 Black Coffee (espresso), 2 Multigrain Toasts with 2 tbsp Peanut Butter",
      calories: 290,
      protein: "10g",
      carbs: "32g",
      fats: "15g",
      notes: "Take 45 mins before hitting the gym floor.",
    },
    {
      name: "Dinner",
      time: "8:45 PM",
      foods: "160g Soya Chunks Curry / Fish Fillet, 2 Phulkas (Roti), Steamed Broccoli & Beans",
      calories: 520,
      protein: "42g",
      carbs: "54g",
      fats: "12g",
      notes: "Light and easily digestible for deep sleep recovery.",
    },
  ];

  for (const m of meals) {
    await prisma.dietMeal.create({
      data: {
        dietPlanId: dietPlan.id,
        ...m,
      },
    });
  }
  console.log("✓ Diet Plan and 5 Meals created for Rahul Sharma.");

  // 7. Seed Trainer Sessions / Appointments
  const sessionTypes = ["Personal Training", "Consultation", "Fitness Assessment", "Diet Consultation"];
  const sessionTimes = ["07:00 AM", "08:30 AM", "10:00 AM", "05:00 PM", "06:30 PM", "07:30 PM"];

  for (let i = 0; i < 8; i++) {
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + (i - 3)); // some past, some today, some future
    await prisma.trainerSession.create({
      data: {
        trainerId: trainers[i % trainers.length].id,
        memberId: createdMembers[i % 5].id,
        date: sessionDate,
        time: sessionTimes[i % sessionTimes.length],
        duration: 60,
        type: sessionTypes[i % sessionTypes.length],
        status: i < 3 ? "COMPLETED" : i === 3 ? "SCHEDULED" : "SCHEDULED",
        notes: `Focus area: Progressive squat technique and lower body mobility work.`,
      },
    });
  }
  console.log("✓ 8 Trainer Sessions / Appointments created.");

  // 8. Seed Realistic Leads (12 leads across various Indian sources)
  const leadsData = [
    { name: "Varun Shenoy", phone: "+91 98860 11001", email: "varun.shenoy@gmail.com", source: "Instagram", plan: proPlan, status: "NEW", notes: "Saw our Instagram reel on HSR facility. Interested in 3-month Pro." },
    { name: "Divya Nair", phone: "+91 98860 11002", email: "divya.nair@gmail.com", source: "Website", plan: elitePlan, status: "TRIAL_BOOKED", notes: "Booked free trial pass via website. Wants morning slots." },
    { name: "Aditi Deshmukh", phone: "+91 98860 11003", email: "aditi.d@outlook.com", source: "WhatsApp", plan: proPlan, status: "CONTACTED", notes: "Chatted on WhatsApp. Looking for weight-loss coaching." },
    { name: "Karthik Iyer", phone: "+91 98860 11004", email: "karthik.iyer@yahoo.com", source: "Walk-in", plan: basicPlan, status: "TRIAL_COMPLETED", notes: "Visited gym yesterday. Loved cardio deck. Following up for signup." },
    { name: "Pooja Kulkarni", phone: "+91 98860 11005", email: "pooja.k@gmail.com", source: "Referral", plan: proPlan, status: "CONVERTED", notes: "Referred by Rahul Sharma. Successfully joined Pro Tier!" },
    { name: "Sameer Joshi", phone: "+91 98860 11006", email: "sameer.j@gmail.com", source: "Google", plan: basicPlan, status: "NEW", notes: "Found us on Google Maps (FitFlow HSR Layout). Inquiring about timings." },
    { name: "Meera Menon", phone: "+91 98860 11007", email: "meera.m@gmail.com", source: "Instagram", plan: proPlan, status: "CONTACTED", notes: "Requested price quote for couple membership." },
    { name: "Rajesh Chawla", phone: "+91 98860 11008", email: "rajesh.c@rediffmail.com", source: "Website", plan: elitePlan, status: "TRIAL_BOOKED", notes: "Trial pass booked for this weekend." },
    { name: "Sanya Mirza", phone: "+91 98860 11009", email: "sanya.mirza@gmail.com", source: "Walk-in", plan: basicPlan, status: "LOST", notes: "Moved to Koramangala. Decided distance is too far." },
    { name: "Naveen Jindal", phone: "+91 98860 11010", email: "naveen.j@gmail.com", source: "WhatsApp", plan: proPlan, status: "CONTACTED", notes: "Wants trainer Sneha Nair. Follow up on Monday." },
    { name: "Kritika Saini", phone: "+91 98860 11011", email: "kritika.s@gmail.com", source: "Instagram", plan: basicPlan, status: "NEW", notes: "Asked about locker and shower availability." },
    { name: "Harish Pillai", phone: "+91 98860 11012", email: "harish.p@gmail.com", source: "Referral", plan: elitePlan, status: "CONVERTED", notes: "Referred by Rohit Singh. Joined Elite tier with coach Kabir." },
  ];

  for (const ld of leadsData) {
    const lead = await prisma.lead.create({
      data: {
        name: ld.name,
        phone: ld.phone,
        email: ld.email,
        source: ld.source,
        planId: ld.plan.id,
        status: ld.status,
        notes: ld.notes,
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });

    // If trial booked, create TrialBooking record connected to lead
    if (ld.status === "TRIAL_BOOKED" || ld.status === "TRIAL_COMPLETED") {
      const trialDate = new Date();
      trialDate.setDate(trialDate.getDate() + 1);
      await prisma.trialBooking.create({
        data: {
          name: ld.name,
          phone: ld.phone,
          email: ld.email,
          preferredDate: trialDate,
          preferredTime: "Morning (07:00 AM - 10:00 AM)",
          planId: ld.plan.id,
          message: "Looking forward to trying out the strength equipment and steam room.",
          status: ld.status === "TRIAL_COMPLETED" ? "COMPLETED" : "CONFIRMED",
          leadId: lead.id,
        },
      });
    }
  }
  console.log("✓ 12 Leads and connected Trial Bookings created.");

  // 9. Seed 20+ Realistic Gym Expenses for Current and Past Month
  const expensesData = [
    { title: "Gym Floor Commercial Facility Rent", category: "Rent", amount: 45000, method: "Bank Transfer", description: "Monthly lease for 12,000 sq ft HSR Sector 2 property" },
    { title: "BESCOM High-Tension Electricity Bill", category: "Electricity", amount: 14200, method: "Bank Transfer", description: "AC chillers, steam generators, and commercial lighting" },
    { title: "Trainer Monthly Base Retainers", category: "Salary", amount: 42000, method: "Bank Transfer", description: "Monthly compensation for coaching staff (5 trainers)" },
    { title: "Front Desk & Reception Staff Wages", category: "Salary", amount: 18000, method: "Bank Transfer", description: "Two full-time desk and operations managers" },
    { title: "Instagram & Meta Local Ad Campaigns", category: "Marketing", amount: 8500, method: "Card", description: "Targeted HSR & Koramangala fitness demographic ads" },
    { title: "Google Ads Local Search Campaign", category: "Marketing", amount: 4500, method: "Card", description: "'Gym near me' and 'Personal training Bengaluru'" },
    { title: "Cable Cross & Pulley Cable Replacement", category: "Maintenance", amount: 3800, method: "UPI", description: "Heavy duty steel cables replacement for machine 3 and 4" },
    { title: "Treadmill Motor Servicing & Lubrication", category: "Maintenance", amount: 5200, method: "UPI", description: "Bi-monthly maintenance contract with Technogym technician" },
    { title: "Housekeeping & Facility Sanitisers", category: "Cleaning", amount: 4200, method: "Cash", description: "Hospital-grade disinfectant, microfiber towels, air fresheners" },
    { title: "Water Dispenser 20L Cans & RO Filter", category: "Supplies", amount: 2400, method: "UPI", description: "Bisleri RO drinking water cans for member stations" },
    { title: "Steam Bath Eucalyptus Aroma Oil", category: "Supplies", amount: 1800, method: "UPI", description: "Essential oils and spa consumables" },
    { title: "New Bumper Plates (2x 20kg, 2x 15kg)", category: "Equipment", amount: 16500, method: "Bank Transfer", description: "Competition grade urethane bumper plates" },
    { title: "Chalk Blocks & Weightlifting Straps", category: "Supplies", amount: 1400, method: "UPI", description: "Gym chalk replenishment for powerlifting platform" },
    { title: "High-Speed Commercial Fiber Internet", category: "Other", amount: 2200, method: "Card", description: "Airtel 300 Mbps fiber line for turnstiles and member Wi-Fi" },
    { title: "Facility First Aid & Ice Pack Replenish", category: "Supplies", amount: 950, method: "UPI", description: "Emergency medical cabinet restock" },
    { title: "Flyer Printing & Banner Standees", category: "Marketing", amount: 2600, method: "Cash", description: "Promotional flyers for local tech park drive" },
    { title: "Air Conditioning Duct Chemical Cleaning", category: "Maintenance", amount: 6400, method: "Bank Transfer", description: "HVAC cleaning for main lifting zone" },
    { title: "Music Streaming License & Sound System", category: "Other", amount: 1200, method: "Card", description: "Commercial audio license for gym floor playlists" },
    { title: "Member RFID Keycard Re-order (100 pcs)", category: "Supplies", amount: 3500, method: "UPI", description: "RFID keyfobs for locker rooms and check-in" },
    { title: "Commercial Pest Control Service", category: "Cleaning", amount: 2800, method: "UPI", description: "Monthly pest treatment for locker rooms and shower suites" },
    { title: "Protein Bar & Hydration Station Stock", category: "Supplies", amount: 6500, method: "Bank Transfer", description: "Inventory for front desk retail cooler" },
  ];

  for (let i = 0; i < expensesData.length; i++) {
    const exp = expensesData[i];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() - (i % 25)); // distributed over last 25 days
    await prisma.expense.create({
      data: {
        title: exp.title,
        category: exp.category,
        amount: exp.amount,
        date: expDate,
        paymentMethod: exp.method,
        description: exp.description,
      },
    });
  }
  console.log(`✓ ${expensesData.length} Expenses created.`);

  // 10. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: "Membership Expiring Soon",
        message: "Rahul Sharma's Pro Plan expires in 3 days. Send WhatsApp reminder.",
        type: "EXPIRY",
        isRead: false,
        link: "/admin/members",
        targetRole: "ADMIN",
      },
      {
        title: "New Free Trial Booking",
        message: "Divya Nair booked a trial pass for tomorrow morning.",
        type: "TRIAL_BOOKING",
        isRead: false,
        link: "/admin/leads",
        targetRole: "ADMIN",
      },
      {
        title: "New Website Lead",
        message: "Varun Shenoy inquired about the Pro Membership tier.",
        type: "NEW_LEAD",
        isRead: false,
        link: "/admin/leads",
        targetRole: "ADMIN",
      },
      {
        title: "Payment Pending",
        message: "Aman Verma's Basic Plan payment of ₹999 is pending verification.",
        type: "PAYMENT",
        isRead: false,
        link: "/admin/payments",
        targetRole: "ADMIN",
      },
      {
        title: "Upcoming Training Session",
        message: "Coach Kabir Mehra has a session scheduled with Rahul Sharma today at 07:00 AM.",
        type: "APPOINTMENT",
        isRead: true,
        link: "/admin/appointments",
        targetRole: "ADMIN",
      },
      {
        title: "Monthly Target Reached",
        message: "FitFlow crossed ₹1,80,000 in monthly collections. Net profit margin is healthy at 58%.",
        type: "SYSTEM",
        isRead: true,
        link: "/admin/reports",
        targetRole: "ADMIN",
      },
    ],
  });

  console.log("✓ Admin notifications seeded.");
  console.log("🚀 FitFlow database fully populated with realistic commercial gym records!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
