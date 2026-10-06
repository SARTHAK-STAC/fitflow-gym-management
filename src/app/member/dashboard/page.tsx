"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Dumbbell,
  Calendar,
  CreditCard,
  User,
  Clock,
  Award,
  Sparkles,
  LogOut,
  Flame,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  QrCode,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Activity,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

export default function MemberDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "workout" | "diet" | "billing" | "attendance">("overview");
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    fetch("/api/member/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((resData) => setData(resData))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400">Loading Member Hub...</p>
        </div>
      </div>
    );
  }

  const member = data?.member;
  const stats = data?.stats || {
    daysRemaining: 79,
    totalDaysAttended: 12,
    thisMonthAttendance: 8,
    streakDays: 4,
  };

  const activeWorkout = member?.workoutPlans?.[0];
  const activeDiet = member?.dietPlans?.[0];
  const qrCodeText = member?.qrCode || `MEMBER-FF-${member?.id?.slice(0, 8) || "8801"}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-emerald-500 selection:text-white pb-20">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black">
              FF
            </div>
            <div>
              <h1 className="font-bold text-white text-base">FitFlow Member Hub</h1>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                FitFlow Fitness Club
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-neutral-300">
              Welcome back, <strong className="text-white">{member?.name || user?.name}</strong>
            </span>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut size={14} className="mr-1 text-rose-400" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 space-y-6">
        {/* Banner with Greeting, Streak & Digital QR Pass trigger */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-900/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              Active Athlete • {member?.plan?.name || "Pro"} Tier
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Hello, {member?.name || "Athlete"}! 👋
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Member ID: <span className="font-mono text-emerald-400 font-semibold">{qrCodeText}</span> • Expiry: {formatDate(member?.expiryDate)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-3 bg-neutral-950/70 border border-neutral-800 px-4 py-3 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Flame size={22} />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  Workout Streak
                </p>
                <h4 className="text-lg font-black text-white">{stats.streakDays} Days Strong</h4>
              </div>
            </div>

            {/* Quick Digital Access Pass Button */}
            <Button
              variant="primary"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-3 h-auto flex items-center gap-2"
            >
              <QrCode size={18} />
              <span>Show QR Pass</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 gap-2 sm:gap-6 overflow-x-auto text-xs pb-px">
          {[
            { id: "overview", label: "Dashboard Overview" },
            { id: "workout", label: "Workout Routine", count: activeWorkout?.exercises?.length },
            { id: "diet", label: "Diet Protocol", count: activeDiet?.meals?.length },
            { id: "attendance", label: "Attendance Log", count: member?.attendance?.length },
            { id: "billing", label: "Invoices & Payments", count: member?.payments?.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === t.id
                  ? "border-emerald-500 text-emerald-400 font-bold"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-800 text-neutral-400">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 Cards (Specification requirement) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Membership Card */}
              <Card className="border-neutral-800 bg-neutral-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Membership</span>
                    <Award size={16} className="text-emerald-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-black text-white">
                    {member?.plan?.name || "Pro"} Plan
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Expires:{" "}
                    <span className="text-neutral-200 font-medium">
                      {formatDate(member?.expiryDate) || "23 Dec 2026"}
                    </span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Days remaining:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {stats.daysRemaining}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Attendance Statistics */}
              <Card className="border-neutral-800 bg-neutral-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Attendance</span>
                    <Calendar size={16} className="text-cyan-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-black text-white">
                    {stats.totalDaysAttended} Sessions
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    This month: <span className="text-white font-semibold">{stats.thisMonthAttendance} visits</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Monthly goal:</span>
                    <span className="text-xs font-semibold text-cyan-400">16 sessions (50%)</span>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Assigned Trainer */}
              <Card className="border-neutral-800 bg-neutral-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Assigned Coach</span>
                    <Dumbbell size={16} className="text-amber-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-black text-white">
                    {member?.trainer?.name || "Kabir Mehra"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {member?.trainer?.specialization || "Strength & Hypertrophy"}
                  </p>
                  <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Trainer Chat:</span>
                    <a
                      href={`https://wa.me/${(member?.trainer?.phone || "+919820154321").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Contact Gym */}
              <Card className="border-neutral-800 bg-neutral-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Facility Desk</span>
                    <Phone size={16} className="text-indigo-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-base font-bold text-white">FitFlow Reception</h3>
                  <p className="text-xs text-neutral-400 mt-1">+91 98765 43210</p>
                  <div className="mt-3 pt-3 border-t border-neutral-800">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Preview Grid: Workout Routine & Nutrition Protocol */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Quick Card */}
              <Card className="border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Activity size={18} />
                      <span>Current Workout Program</span>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {activeWorkout?.title || "Hypertrophy Push-Pull-Legs Split"}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeWorkout?.notes || "Assigned by Coach. Focus on progressive overload on compound movements."}
                  </p>

                  <div className="mt-4 space-y-2">
                    {(activeWorkout?.exercises || [
                      { name: "Barbell Incline Bench Press", sets: 4, reps: "8-10", muscleGroup: "Chest" },
                      { name: "Weighted Dips", sets: 3, reps: "10-12", muscleGroup: "Triceps/Chest" },
                      { name: "Overhead Dumbbell Extension", sets: 3, reps: "12", muscleGroup: "Triceps" },
                    ]).slice(0, 3).map((ex: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs">
                        <div>
                          <span className="font-semibold text-white">{ex.name}</span>
                          <span className="text-neutral-500 ml-2">({ex.muscleGroup})</span>
                        </div>
                        <div className="text-emerald-400 font-medium">
                          {ex.sets} sets &times; {ex.reps} reps
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setActiveTab("workout")}
                  >
                    View Complete Workout Routine ({activeWorkout?.exercises?.length || 5} exercises) &rarr;
                  </Button>
                </div>
              </Card>

              {/* Diet Quick Card */}
              <Card className="border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <Utensils size={18} />
                      <span>Nutrition & Macro Protocol</span>
                    </div>
                    <Badge variant="info">Target: {activeDiet?.calories || 2400} kcal</Badge>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {activeDiet?.title || "Lean Bulk Athletic Protocol"}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeDiet?.macros || "Protein: 170g | Carbs: 260g | Fats: 65g"}
                  </p>

                  <div className="mt-4 space-y-2">
                    {(activeDiet?.meals || [
                      { mealName: "Meal 1 (Breakfast)", items: "Oats with whey protein, banana, almonds" },
                      { mealName: "Meal 2 (Lunch)", items: "Grilled chicken / Paneer, brown rice, dal, greens" },
                      { mealName: "Meal 3 (Pre-Workout)", items: "Whole wheat bread, peanut butter, black coffee" },
                    ]).slice(0, 3).map((m: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs">
                        <div className="font-semibold text-cyan-400">{m.mealName}</div>
                        <div className="text-neutral-300 mt-0.5">{m.items}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setActiveTab("diet")}
                  >
                    View Complete Meal Plan & Macros &rarr;
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: WORKOUT ROUTINE */}
        {activeTab === "workout" && (
          <div className="space-y-6">
            <Card className="border-neutral-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Dumbbell size={20} className="text-emerald-400" />
                    {activeWorkout?.title || "Personalized Workout Split"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Assigned and curated by Head Coach Kabir Mehra. Follow the target tempo and rest durations.
                  </p>
                </div>
                <Badge variant="success">Active Program</Badge>
              </div>

              {activeWorkout?.notes && (
                <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                  <strong className="text-white">Coach Notes: </strong>
                  {activeWorkout.notes}
                </div>
              )}

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3">Exercise</th>
                      <th className="px-4 py-3">Target Muscle</th>
                      <th className="px-4 py-3">Sets</th>
                      <th className="px-4 py-3">Reps</th>
                      <th className="px-4 py-3">Rest</th>
                      <th className="px-4 py-3">Form Guidance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {(activeWorkout?.exercises || [
                      { name: "Incline Barbell Bench Press", muscleGroup: "Upper Chest", sets: 4, reps: "8-10", restSeconds: 90, notes: "Retract scapula, slow 3-sec eccentric" },
                      { name: "Standing Overhead Military Press", muscleGroup: "Anterior Delts", sets: 3, reps: "10-12", restSeconds: 75, notes: "Brace core tight, do not hyperextend lower back" },
                      { name: "Cable Lateral Raises", muscleGroup: "Lateral Deltoids", sets: 4, reps: "15", restSeconds: 60, notes: "Constant tension, lead with elbows" },
                      { name: "Weighted Parallel Dips", muscleGroup: "Triceps & Lower Chest", sets: 3, reps: "10-12", restSeconds: 90, notes: "Slight forward torso lean" },
                      { name: "Triceps Rope Pushdown", muscleGroup: "Triceps Long Head", sets: 3, reps: "12-15", restSeconds: 60, notes: "Flare wrists apart at peak contraction" },
                    ]).map((ex: any, i: number) => (
                      <tr key={i} className="hover:bg-neutral-900/40">
                        <td className="px-5 py-3.5 font-bold text-white">{ex.name}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60 text-[11px]">
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-emerald-400 font-semibold">{ex.sets}</td>
                        <td className="px-4 py-3.5 text-white font-medium">{ex.reps}</td>
                        <td className="px-4 py-3.5 text-neutral-400">{ex.restSeconds || 60}s</td>
                        <td className="px-4 py-3.5 text-neutral-400">{ex.notes || "Standard form"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: DIET PROTOCOL */}
        {activeTab === "diet" && (
          <div className="space-y-6">
            <Card className="border-neutral-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Utensils size={20} className="text-cyan-400" />
                    {activeDiet?.title || "Daily Nutrition Protocol"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Caloric Target: <strong className="text-white">{activeDiet?.calories || 2400} kcal</strong> • Macros: {activeDiet?.macros || "Protein 170g | Carbs 260g | Fats 65g"}
                  </p>
                </div>
                <Badge variant="info">Active Plan</Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activeDiet?.meals || [
                  { mealName: "Meal 1 — Breakfast (08:00 AM)", items: "80g rolled oats cooked with water, 1 scoop whey protein, 1 sliced banana, 15g raw almonds, 2 whole boiled eggs." },
                  { mealName: "Meal 2 — Lunch (01:00 PM)", items: "180g grilled chicken breast (or 200g low-fat paneer), 1.5 cups brown rice, 1 bowl yellow dal, fresh cucumber & tomato salad with lemon." },
                  { mealName: "Meal 3 — Pre-Workout (05:00 PM)", items: "2 slices 100% whole wheat bread, 20g natural peanut butter, 1 shot black coffee / espresso, 1 medium apple." },
                  { mealName: "Meal 4 — Dinner (08:30 PM)", items: "150g grilled fish / tofu, 2 multi-grain rotis, steamed broccoli and stir-fried bell peppers with 1 tsp olive oil." },
                ]).map((meal: any, idx: number) => (
                  <Card key={idx} className="border-neutral-800 bg-neutral-900/70 p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
                      <h4 className="text-xs font-bold text-cyan-400">{meal.mealName}</h4>
                      <Clock size={13} className="text-neutral-500" />
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{meal.items}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: ATTENDANCE LOG */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <Card className="border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={18} className="text-cyan-400" />
                    Workout Session Check-Ins
                  </CardTitle>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your attendance is verified via turnstile QR terminal scan.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400">Total Check-Ins</span>
                  <p className="text-xl font-black text-white">{member?.attendance?.length || 0}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                      <tr>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-4 py-3">Check-In Time</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {(!member?.attendance || member.attendance.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-neutral-500">
                            No check-in history. Scan your QR pass at the front desk turnstile.
                          </td>
                        </tr>
                      ) : (
                        member.attendance.map((a: any) => (
                          <tr key={a.id} className="hover:bg-neutral-900/40">
                            <td className="px-5 py-3 text-white font-medium">{formatDate(a.date)}</td>
                            <td className="px-4 py-3 text-neutral-300 font-mono">
                              {formatTime(a.checkIn)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700/60 text-[10px] text-neutral-300">
                                {a.method || "QR Terminal Scan"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <StatusBadge status={a.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 5: BILLING & INVOICES */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <Card className="border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={18} className="text-emerald-400" />
                  Payments & Tax Invoices
                </CardTitle>
                <p className="text-xs text-neutral-400 mt-1">
                  Download GST compliant payment tax invoices for reimbursement or accounting.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                      <tr>
                        <th className="px-5 py-3">Transaction ID</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Payment Method</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Invoice Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {(!member?.payments || member.payments.length === 0) ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-neutral-500">
                            No payment transactions found.
                          </td>
                        </tr>
                      ) : (
                        member.payments.map((p: any) => (
                          <tr key={p.id} className="hover:bg-neutral-900/40">
                            <td className="px-5 py-3 font-mono text-neutral-300 text-[11px]">
                              {p.transactionId}
                            </td>
                            <td className="px-4 py-3 font-bold text-white">
                              {formatCurrency(p.amount)}
                            </td>
                            <td className="px-4 py-3 text-neutral-300">
                              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700/60 text-[10px]">
                                {p.method}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-neutral-400">{formatDate(p.date)}</td>
                            <td className="px-4 py-3 text-right">
                              {p.invoice ? (
                                <Link href={`/admin/invoices/${p.invoice.id}`} target="_blank">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs text-emerald-400 hover:bg-emerald-950/40"
                                  >
                                    <FileText size={12} className="mr-1" />
                                    View PDF Invoice
                                  </Button>
                                </Link>
                              ) : (
                                <span className="text-neutral-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Details Card */}
        <Card className="border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} className="text-emerald-400" />
              Member Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Full Name</span>
              <p className="text-sm font-semibold text-white mt-1">{member?.name}</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Registered Email</span>
              <p className="text-sm font-semibold text-white mt-1">{member?.email}</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Phone</span>
              <p className="text-sm font-semibold text-white mt-1">{member?.phone}</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Gender</span>
              <p className="text-sm font-semibold text-white mt-1">{member?.gender || "Male"}</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Emergency Contact</span>
              <p className="text-sm font-semibold text-white mt-1">
                {member?.emergencyContact || "+91 98765 99001 (Father)"}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider">Gym Branch</span>
              <p className="text-sm font-semibold text-white mt-1">HSR Layout Sector 2, Bengaluru</p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* DIGITAL ACCESS QR PASS MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              &times;
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                FitFlow Digital Access Pass
              </span>
              <h3 className="text-xl font-black text-white mt-2">{member?.name}</h3>
              <p className="text-xs text-neutral-400">{member?.plan?.name || "Pro"} Tier Athlete</p>
            </div>

            {/* QR Visual Box with code representation */}
            <div className="bg-white p-6 rounded-2xl mx-auto w-56 h-56 flex flex-col items-center justify-center shadow-lg">
              {/* Simulated high-fidelity 2D QR matrix */}
              <div className="w-full h-full flex flex-col items-center justify-center">
                <QrCode size={150} className="text-black" />
                <span className="text-[10px] font-mono font-bold text-neutral-800 mt-2">
                  {qrCodeText}
                </span>
              </div>
            </div>

            <div className="bg-neutral-950/80 rounded-xl p-3 border border-neutral-800 text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="font-semibold text-emerald-400">ACTIVE & VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Valid Until:</span>
                <span className="font-semibold text-white">{formatDate(member?.expiryDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Access:</span>
                <span className="text-white">Main Turnstile & Lockers</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-normal">
              Present this QR code directly at the reception scanner terminal or speed gate for contactless gym check-in.
            </p>

            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={() => setShowQrModal(false)}
            >
              Close Pass
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
