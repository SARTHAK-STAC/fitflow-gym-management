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
} from "lucide-react";

export default function MemberDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        Loading member portal...
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-emerald-500 selection:text-white pb-16">
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 space-y-8">
        {/* Banner with Greeting & Streak */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-900/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              Active Member
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Hello, {member?.name || "Athlete"}! 👋
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Keep pushing your limits. Your training consistency is inspiring.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                Attendance Streak
              </p>
              <h4 className="text-xl font-black text-white">{stats.streakDays} Days Strong</h4>
            </div>
          </div>
        </div>

        {/* 4 Cards (Section 16 Specification requirements) */}
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
                  {formatDate(member?.expiryDate) || "23 December 2026"}
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
                <span className="text-xs text-neutral-400">Contact:</span>
                <span className="text-xs text-amber-400 font-medium">
                  {member?.trainer?.phone || "+91 98201 54321"}
                </span>
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

        {/* Payment History & Attendance Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History */}
          <Card className="border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-400" />
                Payment & Invoices History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3">Txn ID</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {(!member?.payments || member.payments.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-neutral-500">
                          No payment records.
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
                          <td className="px-4 py-3 text-neutral-400">{formatDate(p.date)}</td>
                          <td className="px-4 py-3 text-right">
                            {p.invoice ? (
                              <Link href={`/admin/invoices/${p.invoice.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs text-emerald-400"
                                >
                                  <FileText size={12} className="mr-1" />
                                  View
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

          {/* Attendance Log */}
          <Card className="border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" />
                Recent Check-Ins
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-4 py-3">Check-In</th>
                      <th className="px-4 py-3">Check-Out</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {(!member?.attendance || member.attendance.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-neutral-500">
                          No check-in history.
                        </td>
                      </tr>
                    ) : (
                      member.attendance.slice(0, 6).map((a: any) => (
                        <tr key={a.id} className="hover:bg-neutral-900/40">
                          <td className="px-5 py-3 text-white font-medium">{formatDate(a.date)}</td>
                          <td className="px-4 py-3 text-neutral-300 font-mono">
                            {formatTime(a.checkIn)}
                          </td>
                          <td className="px-4 py-3 text-neutral-400 font-mono">
                            {a.checkOut ? formatTime(a.checkOut) : "Logged"}
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
              <p className="text-sm font-semibold text-white mt-1">HSR Layout Sector 2</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
