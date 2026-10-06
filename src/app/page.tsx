"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Dumbbell,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  CalendarCheck,
  CreditCard,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [trialName, setTrialName] = useState("");
  const [trialPhone, setTrialPhone] = useState("");
  const [trialDate, setTrialDate] = useState("");

  const handleBookTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (trialName && trialPhone) {
      setBookingSuccess(true);
    }
  };

  const trainers = [
    {
      name: "Kabir Mehra",
      role: "Head Strength Coach",
      exp: "7+ Years Exp",
      spec: "Hypertrophy & Heavy Compound Lifts",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sneha Nair",
      role: "Mobility & Pilates Lead",
      exp: "5+ Years Exp",
      spec: "Core Conditioning & Rehab",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rohan Kapoor",
      role: "HIIT & Conditioning",
      exp: "6+ Years Exp",
      spec: "Fat Loss & Metabolic Conditioning",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pooja Hegde",
      role: "Mind-Body Specialist",
      exp: "8+ Years Exp",
      spec: "Ashtanga Yoga & Recovery",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const facilities = [
    {
      title: "Olympic Free Weights Zone",
      desc: "Eleiko bars, calibrated competition plates, and dedicated deadlift platforms.",
      icon: Dumbbell,
    },
    {
      title: "Biomechanical Cardio Deck",
      desc: "Curved treadmills, StairMasters, concept2 rowers, and assault air bikes.",
      icon: Zap,
    },
    {
      title: "Recovery & Hydrotherapy",
      desc: "Steam room, dry sauna bath, and post-workout cryotherapy ice baths.",
      icon: Sparkles,
    },
    {
      title: "Smart Turnstiles & Lockers",
      desc: "Keyless RFID lockers, private hot water shower suites, and blow dryers.",
      icon: ShieldCheck,
    },
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      caption: "Main Strength & Powerlifting Deck",
    },
    {
      url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      caption: "Cardio Loft with Floor-to-Ceiling Windows",
    },
    {
      url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      caption: "Group HIIT & Functional Movement Studio",
    },
    {
      url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      caption: "Specialized Free Weight Dumbbell Alley",
    },
  ];

  const testimonials = [
    {
      quote:
        "Switching from our clumsy Google Sheets to FitFlow transformed our Bangalore facility. Member renewal rates jumped by 32% in just two months.",
      author: "Vikram Malhotra",
      title: "Owner, IronCore Gym Bengaluru",
      avatar: "VM",
    },
    {
      quote:
        "The automated expiry alerts and instant WhatsApp invoice generation saved our front desk team 15 hours every single week.",
      author: "Kavita Reddy",
      title: "Operations Director, Pulse Fitness",
      avatar: "KR",
    },
    {
      quote:
        "As a gym member, being able to log into my own portal, see my attendance streak, and check my trainer’s workouts makes me never want to miss a session.",
      author: "Rahul Sharma",
      title: "FitFlow Member since 2024",
      avatar: "RS",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* 72px Human-Designed Premium Gym Navbar */}
      <Navbar />

      {/* 1. HERO SECTION (Specification exact text) */}
      <section id="home" className="relative pt-20 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Next-Generation Gym Management & Athlete Experience
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
            Train Hard. <span className="text-emerald-400">Live Strong.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Everything you need to manage your fitness journey — and everything gym owners need to manage their business.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#plans">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm px-8">
                View Memberships
              </Button>
            </a>
            <a href="#trial">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm px-8">
                Book a Free Trial
              </Button>
            </a>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>Questions? WhatsApp us at +91 98765 43210</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-b border-neutral-800/80 py-6 text-left">
            <div>
              <p className="text-2xl font-black text-white">12,000+ sq.ft</p>
              <p className="text-xs text-neutral-400">State-of-the-art facility</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">5 Star Coaches</p>
              <p className="text-xs text-neutral-400">Certified athletic staff</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">99.4% Uptime</p>
              <p className="text-xs text-neutral-400">Zero spreadsheet lag</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">4.9 / 5 Rating</p>
              <p className="text-xs text-neutral-400">Over 850 active reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* 23. LANDING PAGE FOR GYM OWNERS (Run Your Gym. Not Your Spreadsheets) */}
      <section id="features-saas" className="py-24 bg-neutral-900/40 border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Built for Modern Gym Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Run Your Gym. <span className="text-emerald-400">Not Your Spreadsheets.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-400">
              FitFlow helps gyms manage members, memberships, payments and attendance from one simple dashboard.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/admin/dashboard">
                <Button variant="primary" size="sm">
                  Explore Dashboard
                </Button>
              </Link>
              <a href="#contact">
                <Button variant="outline" size="sm">
                  Request a Demo
                </Button>
              </a>
            </div>
          </div>

          {/* Everything Your Gym Needs Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white text-center mb-8">
              Everything Your Gym Needs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Member Management",
                  desc: "Complete directory with contact info, emergency numbers, membership history, attendance tracking, and instant renewals.",
                  icon: Users,
                },
                {
                  title: "Payments & Financials",
                  desc: "Track UPI, Card, Cash, and Bank Transfers. Monitor cash flow, pending dues, and real-time revenue analytics.",
                  icon: CreditCard,
                },
                {
                  title: "Attendance & Check-Ins",
                  desc: "Fast front-desk check-in mechanism. Track peak gym hours, average visits, and member retention habits.",
                  icon: CalendarCheck,
                },
                {
                  title: "Memberships & Tiers",
                  desc: "Create flexible monthly, quarterly, or annual plans with custom amenities, trainer allowances, and pricing.",
                  icon: Sparkles,
                },
                {
                  title: "Reports & CSV Export",
                  desc: "Export audit-ready CSV logs of revenue collections, active member lists, and check-in logs in one click.",
                  icon: Award,
                },
                {
                  title: "Tax Compliant Invoices",
                  desc: "Instantly generate professional PDF-ready tax invoices with GSTIN, member details, and verified transaction receipts.",
                  icon: ShieldCheck,
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <Card key={i} className="border-neutral-800 bg-neutral-900/70 p-6 hover:border-neutral-700 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{c.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                About FitFlow Fitness
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Engineered for serious lifters, functional athletes, and health purists.
              </h2>
              <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                Founded in HSR Layout, Bengaluru, FitFlow Fitness redefines what an athletic facility can be. We bring together competition-grade strength gear, evidence-based nutrition science, and modern technology.
              </p>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Whether you are aiming to break your deadlift PR, trim body fat with metabolic HIIT, or recover with steam and sauna hydrotherapy, our certified coaching squad has your back every rep of the way.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xl font-black text-emerald-400">100%</span>
                  <p className="text-xs text-neutral-300 font-semibold mt-1">Calibrated Weights</p>
                  <p className="text-[11px] text-neutral-500">Zero bent barbells or faulty pins</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xl font-black text-cyan-400">1-on-1</span>
                  <p className="text-xs text-neutral-300 font-semibold mt-1">Dedicated Mentorship</p>
                  <p className="text-[11px] text-neutral-500">Bi-weekly InBody body scan tracking</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                  alt="FitFlow Fitness floor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEMBERSHIP PLANS SECTION (Section 3 requirement) */}
      <section id="plans" className="py-24 bg-neutral-900/30 border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Transparent Membership Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Choose Your Pathway To Greatness
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              No hidden initiation fees. Cancel or freeze anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Basic Plan */}
            <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Basic</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Essential fitness facilities for consistent gym-goers.
                </p>

                <div className="mt-6 pb-6 border-b border-neutral-800 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹999</span>
                  <span className="text-xs text-neutral-400 ml-1">/ month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Gym access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Cardio equipment</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Locker access</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-500">
                    <X size={15} className="shrink-0" />
                    <span>Personal training sessions</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-500">
                    <X size={15} className="shrink-0" />
                    <span>Diet consultation</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <a href="#trial">
                  <Button variant="outline" className="w-full text-xs">
                    Choose Basic
                  </Button>
                </a>
              </div>
            </div>

            {/* Pro Plan (RECOMMENDED) */}
            <div className="relative rounded-2xl bg-neutral-900 border-2 border-emerald-500 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-black font-extrabold text-[11px] uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Recommended
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Our most popular conditioning tier with coach mentorship.
                </p>

                <div className="mt-6 pb-6 border-b border-neutral-800 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹1,999</span>
                  <span className="text-xs text-neutral-400 ml-1">/ month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-2.5 font-medium text-white">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Everything in Basic</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Personal training sessions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Diet consultation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Steam & Sauna access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Weekend group HIIT workshops</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <a href="#trial">
                  <Button variant="primary" className="w-full text-xs">
                    Choose Pro Plan
                  </Button>
                </a>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Elite</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  The VIP athletic experience with dedicated coaches.
                </p>

                <div className="mt-6 pb-6 border-b border-neutral-800 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹3,499</span>
                  <span className="text-xs text-neutral-400 ml-1">/ month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-2.5 font-medium text-white">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Unlimited personal training</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Customized diet plan</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>VIP laundry locker & ice baths</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <a href="#trial">
                  <Button variant="outline" className="w-full text-xs">
                    Choose Elite
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRAINERS SECTION */}
      <section id="trainers" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Certified Coaches
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Learn From Elite Fitness Mentors
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              Every trainer is CSCS certified with national athletic pedigree.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden group hover:border-neutral-700 transition-colors"
              >
                <div className="aspect-[4/5] bg-neutral-800 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-emerald-400 font-semibold">{t.exp}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{t.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{t.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FACILITIES SECTION */}
      <section id="facilities" className="py-24 bg-neutral-900/30 border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              World Class Amenities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Designed For Optimal Performance
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              Clean air circulation, sanitized recovery rooms, and commercial power racks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Member & Owner Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Loved by Athletes & Gym Founders Alike
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.author}</h4>
                    <p className="text-[11px] text-neutral-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section className="py-24 bg-neutral-900/30 border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Club Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Inside FitFlow Fitness
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((g, idx) => (
              <div key={idx} className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-neutral-800">
                <img
                  src={g.url}
                  alt={g.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-medium text-white">{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREE TRIAL & CONTACT SECTION */}
      <section id="trial" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="contact">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Visit Us in HSR Layout or Request a Guided Demo
              </h2>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                Whether you want to try out our equipment or discuss licensing FitFlow for your multi-location fitness brand, we are here to help.
              </p>

              <div className="mt-8 space-y-4 text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                    <MapPin size={16} />
                  </div>
                  <span>Plot 42, HSR Layout, Sector 2, Bengaluru, Karnataka 560102</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                    <Phone size={16} />
                  </div>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                    <Mail size={16} />
                  </div>
                  <span>contact@fitflowfitness.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                    <Clock size={16} />
                  </div>
                  <span>Monday - Sunday: 06:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Free Trial Form */}
            <Card className="border-neutral-800 bg-neutral-900/90 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white">Book a Free 1-Day Trial Pass</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Experience the machines, steam bath, and a complimentary fitness test.
              </p>

              {bookingSuccess ? (
                <div className="mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                  <p className="font-bold text-sm text-white">Trial Pass Reserved!</p>
                  <p>
                    We have confirmed your pass for {trialName}. Show this confirmation at the front desk when you arrive.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookTrial} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Verma"
                      value={trialName}
                      onChange={(e) => setTrialName(e.target.value)}
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 00000"
                      value={trialPhone}
                      onChange={(e) => setTrialPhone(e.target.value)}
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={trialDate}
                      onChange={(e) => setTrialDate(e.target.value)}
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full text-xs mt-2">
                    Claim Free Pass
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800/80">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black">
                  FF
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  FITFLOW FITNESS
                </span>
              </div>
              <p className="mt-3 text-xs text-neutral-400 max-w-sm leading-relaxed">
                Modern gym management software and athletic club experience. Built for owners wanting to scale their fitness brand effortlessly.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <div className="space-y-2 text-xs text-neutral-400">
                <a href="#plans" className="block hover:text-white">
                  Memberships
                </a>
                <a href="#trainers" className="block hover:text-white">
                  Coaching Staff
                </a>
                <a href="#facilities" className="block hover:text-white">
                  Facilities
                </a>
                <Link href="/login" className="block text-emerald-400 hover:underline">
                  Portal Login
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Software Demo
              </h4>
              <div className="space-y-2 text-xs text-neutral-400">
                <Link href="/admin/dashboard" className="block hover:text-white">
                  Admin Console
                </Link>
                <Link href="/member/dashboard" className="block hover:text-white">
                  Member Hub
                </Link>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-emerald-400 font-semibold"
                >
                  WhatsApp: +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>© {new Date().getFullYear()} FitFlow Fitness & SaaS Platform. All rights reserved.</p>
            <p>Designed for portfolio demonstration with realistic Indian gym operational data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
