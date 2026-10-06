"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  User,
  CreditCard,
  History,
  RefreshCw,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function MemberProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/members/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data.member);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  const handleRenew = async () => {
    setRenewing(true);
    try {
      const res = await fetch(`/api/members/${id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30, paymentMethod: "UPI" }),
      });
      if (res.ok) {
        await fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRenewing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-900 w-32 rounded" />
          <div className="h-64 bg-neutral-900 rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  if (!member) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-neutral-400">Member not found.</p>
          <Link href="/admin/members">
            <Button variant="outline" className="mt-4">
              Back to Members
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to all members
        </Link>

        {/* Member Profile Banner */}
        <Card className="border-neutral-800 bg-neutral-900/90 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/10">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-white">{member.name}</h1>
                  <StatusBadge status={member.status} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-neutral-500" />
                    {member.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-neutral-500" />
                    {member.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-neutral-500" />
                    {member.address || "Bengaluru, India"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                isLoading={renewing}
                onClick={handleRenew}
              >
                <RefreshCw size={14} />
                Renew +30 Days
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-neutral-800/80 bg-neutral-950/40 text-center py-4">
            <div className="p-2">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Plan</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {member.plan?.name || "Basic"} Tier
              </p>
            </div>
            <div className="p-2">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Start Date</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatDate(member.startDate)}</p>
            </div>
            <div className="p-2">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Expiry Date</p>
              <p className="text-sm font-bold text-amber-400 mt-0.5">
                {formatDate(member.expiryDate)}
              </p>
            </div>
            <div className="p-2">
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Trainer</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {member.trainer?.name || "Self-guided"}
              </p>
            </div>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Gender</span>
                <span className="text-neutral-200 font-medium">{member.gender || "Male"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Date of Birth</span>
                <span className="text-neutral-200 font-medium">
                  {formatDate(member.dateOfBirth) || "12 Aug 1996"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Emergency Contact</span>
                <span className="text-neutral-200 font-medium">
                  {member.emergencyContact || "+91 98765 00000"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Joined Date</span>
                <span className="text-neutral-200 font-medium">{formatDate(member.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-400">Special Diet / Goal</span>
                <span className="text-neutral-200 font-medium">Strength & Hypertrophy</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <span className="text-xs text-neutral-400">
                {member.payments?.length || 0} recorded
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3">Txn ID</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {(member.payments || []).map((p: any) => (
                      <tr key={p.id} className="hover:bg-neutral-900/40">
                        <td className="px-5 py-3 text-neutral-300 font-mono text-[11px]">
                          {p.transactionId}
                        </td>
                        <td className="px-4 py-3 font-bold text-white">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-4 py-3 text-neutral-300">{p.method}</td>
                        <td className="px-4 py-3 text-neutral-400">{formatDate(p.date)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.invoice ? (
                            <Link href={`/admin/invoices/${p.invoice.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400">
                                <FileText size={12} className="mr-1" />
                                View
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Check-Ins</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-4 py-3">Check In Time</th>
                    <th className="px-4 py-3">Check Out Time</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(!member.attendance || member.attendance.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-neutral-500">
                        No check-ins recorded yet.
                      </td>
                    </tr>
                  ) : (
                    member.attendance.slice(0, 10).map((a: any) => (
                      <tr key={a.id} className="hover:bg-neutral-900/40">
                        <td className="px-5 py-3 text-neutral-200">{formatDate(a.date)}</td>
                        <td className="px-4 py-3 text-neutral-300">{formatTime(a.checkIn)}</td>
                        <td className="px-4 py-3 text-neutral-400">
                          {a.checkOut ? formatTime(a.checkOut) : "Active in gym"}
                        </td>
                        <td className="px-4 py-3">
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
    </AdminLayout>
  );
}
