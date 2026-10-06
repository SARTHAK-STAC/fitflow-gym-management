# FitFlow — Modern Gym Management & Membership Platform

FitFlow is a full-stack SaaS platform designed for gym owners, fitness club chains, and athletic studios to streamline their operations, member retention, subscription renewals, automated payments, and staff coaching assignments.

Built with a modern aesthetic, realistic Indian gym data, and operational features ready for freelance portfolio demonstrations.

---

## 🌟 Key Features

### 1. Public Marketing Website ("FitFlow Fitness")
- **Hero Section:** "Train Hard. Live Strong." headline with CTA to view memberships & book trials.
- **WhatsApp Integration:** Instant contact button linking to official club messaging (`+91 98765 43210`).
- **Plan Pricing Cards:** Basic (₹999/mo), Pro (₹1,999/mo - Recommended), and Elite (₹3,499/mo).
- **Certified Coaches Section:** Profiles with CSCS certifications and specializations.
- **Facilities Showcase:** Olympic weights deck, cardio loft, steam sauna recovery, and RFID lockers.
- **Free 1-Day Trial Reservation:** Interactive form for prospective gym members.
- **Gym Owner SaaS Section:** "Run Your Gym. Not Your Spreadsheets." with feature cards.

### 2. Role-Based Authentication & Route Protection
- **JWT HTTP-Only Session Security:** Handled via Edge-compatible Jose and Next.js middleware.
- **Admin & Member Protected Routes:** Restricts member portal from admin console and vice-versa.
- **One-Click Demo Credentials Switcher:** Instant auto-fill for testing both roles.

### 3. Executive Admin SaaS Dashboard
- **Real-time Metric Cards:**
  - Total Members: **247** (+8.5%)
  - Active Members: **211** (+5.1%)
  - Expiring Soon: **18** (-2.3%)
  - Monthly Recurring Revenue: **₹1,84,500** (+14.2%)
- **Expiring Members Priority Action Bar:** Highlights members expiring within 7 days with quick "Renew" and "View" buttons.
- **Interactive Recharts Visualizations:**
  - 6-month Revenue trend area chart
  - Membership plan distribution donut chart
  - Monthly new member acquisition bar chart
- **Recent Payments Ledger:** Real-time transaction feed with member details and status badges.

### 4. Member Management (`/admin/members`)
- Complete member directory with search (by name, phone, email) and multi-status filtering.
- **Add Member Modal:** Complete validation for personal details, gender, emergency contacts, plan selection, trainer assignment, and payment method.
- **Member Profile Details View:**
  - Emergency contact and address
  - Active plan tier and start/expiry calculation
  - Real-time Renewal engine (+30 days extension & transaction creation)
  - Historical payment logs with tax invoice links
  - Attendance check-in history

### 5. Membership Tier Management (`/admin/memberships`)
- Configure tiers (Basic, Pro, Elite), monthly rates (₹), durations, and dynamic perks list.
- Real-time subscriber count per tier.
- Create, Edit, and Delete plan capabilities.

### 6. Payment & Invoicing Engine (`/admin/payments`)
- Filter transactions by payment method (UPI, Card, Cash, Bank Transfer) and status (Paid, Pending, Failed).
- Record custom payments for walk-ins and merchandise.
- **Tax Invoice System (`/admin/invoices/[id]`):**
  - Clean printable and PDF-ready invoice styling
  - Official Gym tax information & GSTIN (`29AAAAA0000A1Z5`)
  - Subtotal and balance verification

### 7. Attendance Tracking (`/admin/attendance`)
- Quick single-click front-desk check-in mechanism.
- Daily check-in count, monthly average visits, and all-time total check-ins.
- Historical date filtering.

### 8. Certified Trainers Directory (`/admin/trainers`)
- Coach experience, bio, specializations, and assigned member quotas.
- Add and manage trainer profiles.

### 9. Audits & Business Reports (`/admin/reports`)
- One-click **CSV Exports** for:
  - Revenue & Sales transactions (`fitflow-revenue-report.csv`)
  - Active Membership Directory (`fitflow-members-report.csv`)
  - Attendance Check-In Logs (`fitflow-attendance-report.csv`)

### 10. Dedicated Member Experience Portal (`/member/dashboard`)
- Days remaining counter (e.g. 79 days) with expiration badges.
- Attendance statistics & consistency streak tracker.
- Dedicated coach information and reception WhatsApp button.
- Personal invoice records and transaction history.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4 (Dark Theme & Premium Fitness Aesthetic)
- **Database & ORM:** SQLite / PostgreSQL compatible with [Prisma ORM](https://www.prisma.io/)
- **Auth & Sessions:** JWT token handling (`jose`), `bcryptjs`, and Next.js middleware
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)

---

## 🔑 Demo Login Credentials

The application is seeded with demo credentials ready to test immediately:

| Role | Email | Password | Access |
|---|---|---|---|
| **Gym Admin / Owner** | `admin@fitflow.com` | `admin123` | Full Admin Console & Financials |
| **Gym Member** | `rahul.sharma@example.com` | `member123` | Member Dashboard & Portal |

*(On the `/login` screen, use the quick **Admin Demo** and **Member Demo** buttons to auto-populate credentials instantly.)*

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "Gym demo"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="fitflow-super-secret-production-jwt-key-32chars"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="fitflow-jwt-super-secret-key-32chars-minimum-fitness"
```

### 3. Initialize & Seed Database
```bash
# Push Prisma schema to SQLite database
npx prisma db push

# Populate with realistic Indian gym data (20+ members, 5 trainers, payments, attendances)
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment (Vercel / VPS)

### Deploying to Vercel
1. Push your repository to GitHub / GitLab.
2. In Vercel, import your repository.
3. Switch `DATABASE_URL` in project settings to a managed PostgreSQL database (e.g. Neon, Supabase, or AWS RDS).
4. Update `prisma/schema.prisma` datasource provider to `"postgresql"`.
5. Set `JWT_SECRET` and `NEXTAUTH_SECRET`.
6. Run build command `npx prisma generate && next build`.

---

## 📱 Mobile Responsiveness
- Desktop: Collapsible sidebar, multi-column analytics grid.
- Tablet / iPad: Responsive touch cards and flexible tables.
- Mobile: Smooth navigation drawer, horizontally scrolling data tables, and high-contrast fitness UI.
