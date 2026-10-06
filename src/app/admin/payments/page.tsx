"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Calendar,
  X,
  IndianRupee,
} from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  // New Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    planId: "",
    amount: 1999,
    method: "UPI",
    status: "PAID",
    notes: "Monthly membership fee",
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/payments", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (methodFilter !== "ALL") url.searchParams.set("method", methodFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [resM, resP] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/plans"),
      ]);
      if (resM.ok) {
        const d = await resM.json();
        setMembers(d.members || []);
        if (d.members?.[0] && !formData.memberId) {
          setFormData((prev) => ({ ...prev, memberId: d.members[0].id }));
        }
      }
      if (resP.ok) {
        const d = await resP.json();
        setPlans(d.plans || []);
        if (d.plans?.[0] && !formData.planId) {
          setFormData((prev) => ({
            ...prev,
            planId: d.plans[0].id,
            amount: d.plans[0].price,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CreditCard size={24} className="text-emerald-400" />
              Payment Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Track transactions, verify methods (UPI, Card, Cash), and generate compliant invoices.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Record Payment
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex gap-2">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by transaction ID, member..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Filter
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Method:</span>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <a href="/api/reports?type=revenue&format=csv">
                <Button variant="outline" size="sm">
                  <Download size={13} />
                  Export CSV
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Payments Table */}
        <Card className="border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-4 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Plan</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-neutral-500">
                      Loading payment transactions...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-neutral-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-neutral-300">
                        {p.transactionId}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/members/${p.member?.id}`}
                          className="font-medium text-white hover:text-emerald-400 hover:underline"
                        >
                          {p.member?.name}
                        </Link>
                        <p className="text-[11px] text-neutral-500">{p.member?.phone}</p>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">
                        {p.plan?.name || "Subscription"}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] font-medium">
                          {p.method}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400">{formatDate(p.date)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.invoice ? (
                          <Link href={`/admin/invoices/${p.invoice.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-emerald-400 border-emerald-900/50 hover:bg-emerald-950/30"
                            >
                              <FileText size={12} className="mr-1" />
                              Invoice
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Record Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">Record New Payment</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Select Member *
                  </label>
                  <select
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Plan
                  </label>
                  <select
                    value={formData.planId}
                    onChange={(e) => {
                      const sel = plans.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        planId: e.target.value,
                        amount: sel ? sel.price : formData.amount,
                      });
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Amount (₹ INR)"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Method
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PAID">Paid</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Notes"
                  placeholder="e.g. UPI Ref: 9812903182"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Record Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
