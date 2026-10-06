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
    totalTransactions: 22,
    activeMembers: 19,
    expiredMembers: 3,
    expiringSoon: 5,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileBarChart2 size={24} className="text-emerald-400" />
              Business Reports & Exports
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Download clean audit spreadsheets and review key metrics.
            </p>
          </div>
        </div>

        {/* Export Cards Grid (Section 15 CSV export requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-neutral-800 bg-neutral-900/70 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Revenue & Sales Report</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Complete breakdown of all customer transaction IDs, payment methods (UPI/Card), amounts, dates and billing status.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <a href="/api/reports?type=revenue&format=csv">
                <Button variant="primary" className="w-full text-xs" size="sm">
                  <Download size={14} />
                  Download Revenue CSV
                </Button>
              </a>
            </div>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/70 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Membership Audit Report</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Full directory of gym members, contact details, assigned plans, subscription dates and expiry statuses.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <a href="/api/reports?type=members&format=csv">
                <Button variant="secondary" className="w-full text-xs" size="sm">
                  <Download size={14} />
                  Download Members CSV
                </Button>
              </a>
            </div>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/70 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Attendance Audit Log</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Historical record of all member check-ins, timestamps, and active facility utilization records.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <a href="/api/reports?type=attendance&format=csv">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <Download size={14} />
                  Download Attendance CSV
                </Button>
              </a>
            </div>
          </Card>
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
