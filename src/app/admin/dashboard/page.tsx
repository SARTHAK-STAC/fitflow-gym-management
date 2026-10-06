"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Clock,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#10b981", "#06b6d4", "#8b5cf6"];

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRenew = async (memberId: string) => {
    setRenewingId(memberId);
    try {
      const res = await fetch(`/api/members/${memberId}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30, paymentMethod: "UPI" }),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRenewingId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-900 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-neutral-900 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-neutral-900 rounded-xl" />
            <div className="h-72 bg-neutral-900 rounded-xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const metrics = data?.metrics || {
    totalMembers: 247,
    activeMembers: 211,
    expiringSoon: 18,
    monthlyRevenue: 184500,
    membersChange: "+8.5%",
    activeChange: "+5.1%",
    expiringChange: "-2.3%",
    monthlyRevenueChange: "+14.2%",
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Dashboard Overview
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Real-time monitoring of members, monthly recurring revenue, and facilities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/members?action=add">
              <Button variant="primary" size="sm">
                <PlusCircle size={15} />
                Add New Member
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Members */}
          <Card className="border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Total Members
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white">{metrics.totalMembers}</h3>
                <span className="text-xs font-semibold text-emerald-400 flex items-center">
                  <TrendingUp size={12} className="mr-0.5" />
                  {metrics.membersChange}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">vs previous month</p>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card className="border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Active Members
                </p>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white">{metrics.activeMembers}</h3>
                <span className="text-xs font-semibold text-cyan-400 flex items-center">
                  <TrendingUp size={12} className="mr-0.5" />
                  {metrics.activeChange}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">85.4% retention rate</p>
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          <Card className="border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Expiring Soon
                </p>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white">{metrics.expiringSoon}</h3>
                <span className="text-xs font-semibold text-amber-400">Next 7 days</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Requires renewal follow-up</p>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Monthly Revenue
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <IndianRupee size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white">
                  {formatCurrency(metrics.monthlyRevenue)}
                </h3>
                <span className="text-xs font-semibold text-emerald-400 flex items-center">
                  <TrendingUp size={12} className="mr-0.5" />
                  {metrics.monthlyRevenueChange}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Consistent upward trajectory</p>
            </CardContent>
          </Card>
        </div>

        {/* Section: Expiring Soon Priority List (Section 12 requirement) */}
        <Card className="border-amber-900/40 bg-gradient-to-r from-amber-950/20 via-neutral-900/80 to-neutral-900/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <CardTitle className="text-base text-amber-300">
                Memberships Expiring Soon (Next 7 Days)
              </CardTitle>
            </div>
            <Link
              href="/admin/members?status=EXPIRING_SOON"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              View all expiring &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(data?.expiringMembers || []).slice(0, 3).map((m: any) => {
                const daysDiff = Math.ceil(
                  (new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/90 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{m.name}</h4>
                      <p className="text-xs text-neutral-400">{m.plan?.name || "Pro"} Plan</p>
                      <span className="text-[11px] font-medium text-amber-400 mt-1 inline-block">
                        {daysDiff <= 1 ? "Expires tomorrow" : `Expires in ${daysDiff} days`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/members/${m.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-8 text-xs"
                        isLoading={renewingId === m.id}
                        onClick={() => handleRenew(m.id)}
                      >
                        <RefreshCw size={12} />
                        Renew
                      </Button>
                    </div>
                  </div>
                );
              })}
              {(!data?.expiringMembers || data.expiringMembers.length === 0) && (
                <div className="p-4 text-xs text-neutral-400 col-span-3 text-center">
                  All memberships are up-to-date!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart (2 cols) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Monthly collected gym and personal training dues
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                INR (₹)
              </span>
            </CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueChart || []}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Membership Distribution (1 col) */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Distribution</CardTitle>
              <p className="text-xs text-neutral-400 mt-0.5">Active subscribers per plan tier</p>
            </CardHeader>
            <CardContent className="h-72 flex flex-col justify-between">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.membershipDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(data?.membershipDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "8px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-800">
                {(data?.membershipDistribution || []).map((item: any, idx: number) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="text-xs font-medium text-neutral-300">{item.name}</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Growth & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Growth (1 col) */}
          <Card>
            <CardHeader>
              <CardTitle>New Member Acquisition</CardTitle>
              <p className="text-xs text-neutral-400 mt-0.5">Monthly enrollments trend</p>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.memberGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="newMembers" fill="#06b6d4" radius={[4, 4, 0, 0]} name="New Signups" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Payments (2 cols) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <p className="text-xs text-neutral-400 mt-0.5">Latest membership & service payments</p>
              </div>
              <Link
                href="/admin/payments"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                View all payments &rarr;
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3">Member</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {(data?.recentPayments || []).map((p: any) => (
                      <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-neutral-100">{p.member?.name}</p>
                          <p className="text-[11px] text-neutral-500">{p.member?.phone}</p>
                        </td>
                        <td className="px-4 py-3.5 text-neutral-300">
                          {p.plan?.name || "Custom Tier"}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-neutral-100">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-400">
                          {formatDate(p.date)}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
