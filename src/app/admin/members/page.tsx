"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function MembersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(searchParams.get("action") === "add");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    emergencyContact: "",
    planId: "",
    trainerId: "",
    startDate: new Date().toISOString().split("T")[0],
    durationDays: 30,
    paymentAmount: 1999,
    paymentMethod: "UPI",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/members", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (planFilter !== "ALL") url.searchParams.set("planId", planFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlansAndTrainers = async () => {
    try {
      const [resPlans, resTrainers] = await Promise.all([
        fetch("/api/plans"),
        fetch("/api/trainers"),
      ]);
      if (resPlans.ok) {
        const pData = await resPlans.json();
        setPlans(pData.plans || []);
        if (pData.plans?.[0] && !formData.planId) {
          setFormData((prev) => ({
            ...prev,
            planId: pData.plans[0].id,
            paymentAmount: pData.plans[0].price,
          }));
        }
      }
      if (resTrainers.ok) {
        const tData = await resTrainers.json();
        setTrainers(tData.trainers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlansAndTrainers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete member "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlanChange = (planId: string) => {
    const selected = plans.find((p) => p.id === planId);
    setFormData((prev) => ({
      ...prev,
      planId,
      paymentAmount: selected ? selected.price : prev.paymentAmount,
      durationDays: selected ? selected.duration : 30,
    }));
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationDays: Number(formData.durationDays),
          paymentAmount: Number(formData.paymentAmount),
          trainerId: formData.trainerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create member");
        return;
      }

      setShowAddModal(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "Male",
        address: "",
        emergencyContact: "",
        planId: plans[0]?.id || "",
        trainerId: "",
        startDate: new Date().toISOString().split("T")[0],
        durationDays: 30,
        paymentAmount: 1999,
        paymentMethod: "UPI",
      });
      fetchMembers();
    } catch (err) {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users size={24} className="text-emerald-400" />
              Member Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Browse, filter, register, and manage gym members & memberships.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setShowAddModal(true);
              setFormError("");
            }}
          >
            <Plus size={16} />
            Register New Member
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex gap-2">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRING_SOON">Expiring Soon</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              {/* Plan Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Plan:</span>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Plans</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPlanFilter("ALL");
                  fetchMembers();
                }}
              >
                <RefreshCw size={12} />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Members Table */}
        <Card className="border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Phone</th>
                  <th className="px-4 py-3.5">Membership</th>
                  <th className="px-4 py-3.5">Start Date</th>
                  <th className="px-4 py-3.5">Expiry Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      Loading gym members...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      No members match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                            {m.name.slice(0, 2)}
                          </div>
                          <div>
                            <Link
                              href={`/admin/members/${m.id}`}
                              className="font-medium text-white hover:text-emerald-400 transition-colors hover:underline"
                            >
                              {m.name}
                            </Link>
                            <p className="text-[11px] text-neutral-500">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">{m.phone}</td>
                      <td className="px-4 py-3.5 font-medium text-neutral-200">
                        {m.plan?.name || "No Plan"}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400">{formatDate(m.startDate)}</td>
                      <td className="px-4 py-3.5 text-neutral-400 font-medium">{formatDate(m.expiryDate)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/members/${m.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              title="View Profile"
                            >
                              <Eye size={14} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                            title="Delete"
                            onClick={() => handleDelete(m.id, m.name)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Member Modal (Section 8 implementation) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Add New Gym Member</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Register a new member, assign plan & generate initial invoice
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddMember} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="Phone Number *"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  <Input
                    label="Emergency Contact"
                    placeholder="e.g. +91 98765 99999 (Father)"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Flat / House number, Street, City"
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    Plan & Membership Enrollment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Membership Plan *
                      </label>
                      <select
                        value={formData.planId}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ₹{p.price}/mo
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Assign Trainer (Optional)
                      </label>
                      <select
                        value={formData.trainerId}
                        onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">No dedicated trainer</option>
                        {trainers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.specialization})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="UPI">UPI</option>
                        <option value="CARD">Debit / Credit Card</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={submitting}>
                    Register & Activate
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

export default function MembersManagementPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="p-8 text-neutral-400">Loading members...</div>
        </AdminLayout>
      }
    >
      <MembersContent />
    </Suspense>
  );
}
