# FitFlow — Modern Gym Management & Membership SaaS Platform

FitFlow is a full-stack commercial SaaS platform designed for gym owners, fitness club chains, and athletic studios in Bangalore and across India. It streamlines front-desk operations, lead pipelines, contactless QR check-ins, automated renewal reminders, commercial expense tracking, and athlete training protocols.

Built with a high-end club aesthetic, realistic Indian gym data, and operational workflows ready for client demonstrations to real gym founders.

---

## 🌟 Architecture & Core Experiences

FitFlow delivers three distinct, human-designed user experiences:

### 1. Public Marketing Website ("FitFlow Fitness Club")
- **72px Human-Designed Navbar:** Compact `[FF] FITFLOW FITNESS CLUB` monogram, comfortable padding, sticky blur, and separate primary action (`Book a Free Trial`) and secondary outline (`Member Login`).
- **Hero Headline:** *"Train Hard. Live Strong."* with immediate CTAs to view plans and claim VIP passes.
- **Interactive Free 1-Day Trial Booking:**
  - Full Name, Phone (+91 verification), Email, Preferred Date, Preferred Time Window, Interested Plan, and Fitness Goals.
  - Submits to `/api/trial-bookings`, generates database records, updates the owner pipeline, and offers an instant WhatsApp confirmation link.
- **Membership Plan Showcase:** Basic (₹999/mo), Pro (₹1,999/mo — *Recommended*), and Elite (₹3,499/mo) with 1-click plan selection linking into the trial reservation form.
- **Facility & Coach Profiles:** Showcases Olympic weight platforms, cardio loft, steam/cryotherapy suites, and CSCS certified coaches.
- **WhatsApp Reception Link:** Pre-fills messages for direct inquiries at `+91 98765 43210`.

---

### 2. Gym Owner & Admin Console (`/admin/*`)
A comprehensive SaaS command center built for multi-bench gym managers:

- **Executive Analytics Dashboard (`/admin/dashboard`):**
  - 8 real-time KPI metrics: Total Members (247), Active (211), Expiring Soon (18), Monthly Recurring Revenue (₹1,84,500), Overhead Expenses (₹58,000), Net Profit (₹1,26,500), Pre-Tax Margin (68.6%), and New Inquiries (12).
  - Cashflow Area Chart: 6-month Revenue collections vs Operating Expenses.
  - Plan distribution donut chart and monthly acquisition bar chart.
  - Priority Expiry Action Bar with one-click **WhatsApp Renewal Reminders**.
  - Global Search dropdown (live search across members, leads, payments, and coaches).
- **Lead & Free Trial Pipeline (`/admin/leads`):**
  - Pipeline stages: `NEW` → `CONTACTED` → `TRIAL_BOOKED` → `TRIAL_COMPLETED` → `CONVERTED` / `LOST`.
  - Dedicated **Website Trial Bookings Tab** listing trial passes, dates, time slots, and status selectors.
  - **One-Click Lead Conversion Engine:** Converts any trial or lead directly into an active paying member, sets their expiry date, logs the transaction, and generates a GST tax invoice in a single modal.
- **Turnstile QR Check-In Terminal (`/admin/attendance`):**
  - Simulates front-desk contactless turnstiles and barcode scanners.
  - Scans member codes (e.g., `MEMBER-FF-1001`), verifies active vs. expired subscriptions, prevents duplicate check-ins within 30 minutes, and logs entry timestamps.
- **Commercial Expense Ledger (`/admin/expenses`):**
  - Records operating overheads across Rent, Equipment, Trainer Payouts, Utilities, and Marketing.
  - Interactive category expenditure bar chart and deletion/logging tools.
- **Personal Training Appointments (`/admin/appointments`):**
  - Schedules 1-on-1 coaching sessions and diet consultations between coaches and athletes.
- **Member Directory & Detailed Profiles (`/admin/members`, `/admin/members/[id]`):**
  - 8-tab member dossier: Overview, Membership Tier, Payment History, Check-In Records, Assigned Coach, Workout Split, Diet Protocol, and Staff Notes.
  - One-click Renewal engine (+30 days extension, automated invoice generation).
- **Tax Invoices & Financials (`/admin/payments`, `/admin/invoices/[id]`):**
  - Printable, PDF-ready GST invoices with gym GSTIN (`29AAAAA0000A1Z5`), subtotal, and payment receipts.
- **5 Audit-Ready CSV Business Exports (`/admin/reports`):**
  - Download Revenue CSV, Operating Expenses CSV, Membership Directory CSV, Leads Pipeline CSV, and Turnstile Attendance CSV.

---

### 3. Athlete & Member Experience Hub (`/member/dashboard`)
Designed to maximize client retention and day-to-day engagement:
- **Digital Access QR Pass:**
  - High-contrast 2D QR modal for scanning at reception gates (`MEMBER-FF-XXXX`).
  - Active subscription verification badge and valid-until indicator.
- **Assigned Workout Routine Split:**
  - View current split (e.g., Hypertrophy Push-Pull-Legs) with exercise names, sets, reps, rest timers, and coach technique notes.
- **Personalized Diet & Macro Protocol:**
  - Daily calorie targets (e.g. 2,400 kcal) and macronutrient ratios (Protein, Carbs, Fats).
  - Detailed meal breakdown (Breakfast, Lunch, Pre-Workout, Dinner).
- **Attendance & Streak Tracker:**
  - Consistency streak counter and historical check-in audit table.
- **Direct Coach & Desk WhatsApp Connectors:**
  - One-tap links to chat directly with personal coaches or reception staff.
- **Payment & Invoice Archive:**
  - Access receipts and tax invoices directly.

---

## 🔑 Seeded Demo Credentials

The application is pre-populated with realistic Indian gym accounts ready for instant evaluation:

| Persona | Email | Password | Role / Access |
|---|---|---|---|
| **Gym Founder / Admin** | `admin@fitflow.com` | `admin123` | Full Owner Dashboard, Leads, Expenses, Invoices |
| **Active Gym Member** | `rahul.sharma@example.com` | `member123` | Member Hub, QR Badge, Workouts & Diets |

> **Tip:** On the `/login` screen, use the quick **Admin Demo** and **Member Demo** auto-fill buttons to test either role with zero typing.

---

## 🛠️ Tech Stack & Engineering Architecture

- **Framework:** Next.js 16.3.8 (App Router with Turbopack)
- **Language:** TypeScript 5.x
- **UI & Styling:** Tailwind CSS v4, Lucide React icons, and accessible modal components
- **Database & ORM:** SQLite / PostgreSQL with Prisma ORM
- **Authentication:** Edge-compatible JWT token management (`jose`), password hashing (`bcryptjs`), and Next.js middleware route protection
- **Data Visualizations:** Recharts (Revenue vs Expense cashflow, category breakdown, membership distribution)
- **WhatsApp Engine:** Custom URL serializer (`https://wa.me/91XXXXXXXXXX?text=...`) with Indian phone formatting and templated alerts for renewals, trials, and invoices
- **Validation:** Zod schemas for all API payloads

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="fitflow-super-secret-production-jwt-key-32chars"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="fitflow-jwt-super-secret-key-32chars-minimum-fitness"
```

### 3. Initialize & Seed Database
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed 22 members, 5 trainers, leads, expenses, workout routines & diet protocols
npx tsx prisma/seed.ts
```

### 4. Build & Start Server
```bash
# Verify production compilation
npm run build

# Start local server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Recommended Client Demonstration Flow

When showing FitFlow to a prospective gym owner, follow this 5-minute walkthrough:

1. **The Marketing Website (`/`)**: Show the clean, 72px navbar. Highlight how the Free Trial form lets a prospect pick their preferred date and time, creating a real lead in the database and triggering an instant WhatsApp pass.
2. **The Owner Dashboard (`/admin/dashboard`)**: Log in as `admin@fitflow.com`. Show the Net Profit calculation (Revenue minus Operating Expenses) and the priority expiry ticker with WhatsApp renewal alerts.
3. **Lead Pipeline & One-Click Conversion (`/admin/leads`)**: Show the Trial Bookings tab, change a status to `CONVERTED`, and demonstrate how the system converts the lead into an active member, logs their payment, and creates a tax invoice.
4. **Front-Desk QR Terminal (`/admin/attendance`)**: Demonstrate typing or scanning `MEMBER-FF-1001` (Rahul Sharma) to verify entry, and show the terminal rejecting duplicate check-ins or expired members.
5. **Expense Tracker & Reports (`/admin/expenses`, `/admin/reports`)**: Show commercial overhead logging and download a CSV report.
6. **The Member Experience (`/member/dashboard`)**: Log in as `rahul.sharma@example.com`. Open the digital QR Access Pass modal, review the assigned workout split (Push-Pull-Legs), and inspect the daily nutrition protocol.
