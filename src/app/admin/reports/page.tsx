"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  FileBarChart2,
  Download,
  IndianRupee,
  Users,
  CreditCard,
  TrendingUp,
  FileSpreadsheet,
  Receipt,
  Target,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const summary = report?.summary || {
    totalRevenue: 184500,
    totalExpenses: 58000,
    netProfit: 126500,
    profitMargin: "68.6%",
    totalTransactions: 22,
    activeMembers: 19,
    expiredMembers: 3,
    expiringSoon: 5,
    totalLeads: 12,
    trialsBooked: 8,
    convertedLeads: 4,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileBarChart2 size={24} className="text-emerald-400" />
              Financial & Operational Reports
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Download audit-ready CSV spreadsheets, analyze revenue versus overhead costs, and verify cashflow.
            </p>
          </div>
        </div>

        {/* Financial Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <h3 className="text-2xl font-black text-white mt-1.5">
              {formatCurrency(summary.totalRevenue)}
            </h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight size={13} /> {summary.totalTransactions} paid transactions
            </p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
              Operating Expenses
            </span>
            <h3 className="text-2xl font-black text-rose-400 mt-1.5">
              {formatCurrency(summary.totalExpenses)}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Rent, trainers, utilities, maintenance
            </p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Net Profit
            </span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1.5">
              {formatCurrency(summary.netProfit)}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Pre-tax operational margin
            </p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Net Profit Margin
            </span>
            <h3 className="text-2xl font-black text-cyan-300 mt-1.5">
              {summary.profitMargin}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {summary.activeMembers} active subscriptions
            </p>
          </Card>
        </div>

        {/* 5 Export Cards Grid (Revenue, Expenses, Members, Leads, Attendance) */}
        <div>
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4">
            Download Audit Spreadsheets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Revenue CSV */}
            <Card className="border-neutral-800 bg-neutral-900/70 p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <IndianRupee size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Revenue & Sales Log</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Every member transaction ID, billing amount, UPI/Card method, date, and tax invoice status.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <a href="/api/reports?type=revenue&format=csv">
                  <Button variant="primary" className="w-full text-xs" size="sm">
                    <Download size={14} className="mr-1.5" />
                    Download Revenue CSV
                  </Button>
                </a>
              </div>
            </Card>

            {/* 2. Expenses CSV */}
            <Card className="border-neutral-800 bg-neutral-900/70 p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                  <Receipt size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Commercial Expenses Log</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Line items for facility lease, trainer salaries, electricity, equipment upkeep, and marketing spend.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <a href="/api/reports?type=expenses&format=csv">
                  <Button variant="outline" className="w-full text-xs border-rose-900/60 text-rose-300 hover:bg-rose-950/40" size="sm">
                    <Download size={14} className="mr-1.5" />
                    Download Expenses CSV
                  </Button>
                </a>
              </div>
            </Card>

            {/* 3. Members CSV */}
            <Card className="border-neutral-800 bg-neutral-900/70 p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <Users size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Membership Audit Log</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Full roster of active athletes, phone numbers, assigned tier, subscription dates, and expiry status.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <a href="/api/reports?type=members&format=csv">
                  <Button variant="secondary" className="w-full text-xs" size="sm">
                    <Download size={14} className="mr-1.5" />
                    Download Members CSV
                  </Button>
                </a>
              </div>
            </Card>

            {/* 4. Leads CSV */}
            <Card className="border-neutral-800 bg-neutral-900/70 p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Target size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Lead Acquisition Report</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Website trial submissions, walk-ins, Instagram inquiries, stage progression, and conversion rates.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <a href="/api/reports?type=leads&format=csv">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    <Download size={14} className="mr-1.5" />
                    Download Leads CSV
                  </Button>
                </a>
              </div>
            </Card>

            {/* 5. Attendance CSV */}
            <Card className="border-neutral-800 bg-neutral-900/70 p-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <FileSpreadsheet size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Turnstile Attendance Log</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Complete timestamped check-in records, QR terminal scan sessions, and facility utilization history.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <a href="/api/reports?type=attendance&format=csv">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    <Download size={14} className="mr-1.5" />
                    Download Attendance CSV
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Breakdown */}
        <Card className="border-neutral-800">
          <CardHeader>
            <CardTitle>Plan Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Plan Name</th>
                    <th className="px-4 py-3.5">Price / mo</th>
                    <th className="px-4 py-3.5">Subscribed Members</th>
                    <th className="px-4 py-3.5">Total Sales Count</th>
                    <th className="px-4 py-3.5 text-right">Estimated Monthly Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(report?.plansBreakdown || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-neutral-900/40">
                      <td className="px-5 py-3.5 font-bold text-white">{p.name}</td>
                      <td className="px-4 py-3.5 text-neutral-300">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-400">
                        {p.memberCount} members
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">{p.salesCount} payments</td>
                      <td className="px-4 py-3.5 text-right font-bold text-white">
                        {formatCurrency(p.price * p.memberCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
