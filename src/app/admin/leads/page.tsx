"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { generateWhatsAppLink, WhatsAppTemplates } from "@/lib/whatsapp";
import {
  Target,
  Plus,
  Search,
  RefreshCw,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";

const PIPELINE_STATUSES = [
  { key: "NEW", label: "New", color: "bg-blue-950 text-blue-400 border-blue-800" },
  { key: "CONTACTED", label: "Contacted", color: "bg-amber-950 text-amber-400 border-amber-800" },
  { key: "TRIAL_BOOKED", label: "Trial Booked", color: "bg-cyan-950 text-cyan-400 border-cyan-800" },
  { key: "TRIAL_COMPLETED", label: "Trial Completed", color: "bg-indigo-950 text-indigo-400 border-indigo-800" },
  { key: "CONVERTED", label: "Converted", color: "bg-emerald-950 text-emerald-400 border-emerald-800" },
  { key: "LOST", label: "Lost", color: "bg-rose-950 text-rose-400 border-rose-800" },
];

const TRIAL_STATUSES = [
  { key: "NEW", label: "NEW", color: "bg-blue-950 text-blue-400 border-blue-800" },
  { key: "CONFIRMED", label: "CONFIRMED", color: "bg-cyan-950 text-cyan-400 border-cyan-800" },
  { key: "COMPLETED", label: "COMPLETED", color: "bg-indigo-950 text-indigo-400 border-indigo-800" },
  { key: "CANCELLED", label: "CANCELLED", color: "bg-rose-950 text-rose-400 border-rose-800" },
  { key: "CONVERTED", label: "CONVERTED", color: "bg-emerald-950 text-emerald-400 border-emerald-800" },
];

function LeadsContent() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "trials">("pipeline");
  const [leads, setLeads] = useState<any[]>([]);
  const [trialBookings, setTrialBookings] = useState<any[]>([]);
  const [trialCounts, setTrialCounts] = useState<any>(null);
  const [trialLoading, setTrialLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  // Add Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Website",
    planId: "",
    status: "NEW",
    notes: "",
    followUpDate: "",
  });

  // Convert Lead Modal
  const [convertingLead, setConvertingLead] = useState<any | null>(null);
  const [convertForm, setConvertForm] = useState({
    planId: "",
    paymentAmount: 1999,
    paymentMethod: "UPI",
    address: "",
  });
  const [converting, setConverting] = useState(false);

  const fetchTrialBookings = async () => {
    try {
      setTrialLoading(true);
      const res = await fetch("/api/trial-bookings");
      if (res.ok) {
        const data = await res.json();
        setTrialBookings(data.bookings || []);
        setTrialCounts(data.counts || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTrialLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/leads", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (sourceFilter !== "ALL") url.searchParams.set("source", sourceFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
        if (data.plans?.[0]) {
          setNewLead((prev) => ({ ...prev, planId: data.plans[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchTrialBookings();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter]);

  const handleTrialStatusChange = async (booking: any, newStatus: string) => {
    try {
      const res = await fetch(`/api/trial-bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTrialBookings();
        fetchLeads();
        if (newStatus === "CONVERTED") {
          openConvertModal(booking.lead || {
            id: booking.leadId,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            planId: booking.planId,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrial = async (id: string, name: string) => {
    if (!confirm(`Delete trial pass booking for "${name}"?`)) return;
    try {
      await fetch(`/api/trial-bookings/${id}`, { method: "DELETE" });
      fetchTrialBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewLead({
          name: "",
          phone: "",
          email: "",
          source: "Website",
          planId: plans[0]?.id || "",
          status: "NEW",
          notes: "",
          followUpDate: "",
        });
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openConvertModal = (lead: any) => {
    setConvertingLead(lead);
    const selectedPlan = plans.find((p) => p.id === lead.planId) || plans[0];
    setConvertForm({
      planId: selectedPlan ? selectedPlan.id : "",
      paymentAmount: selectedPlan ? selectedPlan.price : 1999,
      paymentMethod: "UPI",
      address: "",
    });
  };

  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;
    setConverting(true);
    try {
      const res = await fetch(`/api/leads/${convertingLead.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convertForm),
      });
      if (res.ok) {
        setConvertingLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Delete lead "${name}"?`)) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      fetchLeads();
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
              <Target size={24} className="text-emerald-400" />
              Lead & Trial Pipeline Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Capture website free trials, track prospect status, trigger WhatsApp confirmations, and convert leads into active members.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add New Lead
          </Button>
        </div>

        {/* 5 Pipeline Metric Cards (Exact Specification Requirement) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card className="border-neutral-800 bg-neutral-900/80 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Total Inquiries
            </span>
            <h3 className="text-2xl font-black text-white mt-2">
              {metrics?.totalLeads ?? leads.length}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">All marketing channels</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Trials Booked
            </span>
            <h3 className="text-2xl font-black text-cyan-300 mt-2">
              {metrics?.trialsBooked ?? 0}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">1-day gym passes</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Trials Completed
            </span>
            <h3 className="text-2xl font-black text-indigo-300 mt-2">
              {metrics?.trialsCompleted ?? 0}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Attended facility</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Conversions
            </span>
            <h3 className="text-2xl font-black text-emerald-400 mt-2">
              {metrics?.convertedCount ?? 0}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Became paying members</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Conversion Rate
            </span>
            <h3 className="text-2xl font-black text-amber-300 mt-2">
              {metrics?.conversionRate ?? "0%"}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Inquiry to membership</p>
          </Card>
        </div>

        {/* Navigation Tabs: Pipeline vs Trial Bookings */}
        <div className="flex border-b border-neutral-800 gap-6">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "pipeline"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span>All Leads Pipeline</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-800 text-neutral-300">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("trials")}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "trials"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span>Website Trial Bookings</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800">
              {trialCounts?.total ?? trialBookings.length}
            </span>
            {trialCounts?.new > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500 text-black font-extrabold">
                {trialCounts.new} NEW
              </span>
            )}
          </button>
        </div>

        {/* Filter Bar (Only for pipeline or search) */}
        {activeTab === "pipeline" && (
          <Card className="border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchLeads()}
                  placeholder="Search leads by name, phone, email..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Stage:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Stages</option>
                    {PIPELINE_STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Source:</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Referral">Referral</option>
                    <option value="Google">Google</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setSourceFilter("ALL");
                    fetchLeads();
                  }}
                >
                  <RefreshCw size={12} />
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* View 1: Leads Pipeline Table */}
        {activeTab === "pipeline" && (
          <Card className="border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Lead / Contact</th>
                    <th className="px-4 py-3.5">Source</th>
                    <th className="px-4 py-3.5">Interested Tier</th>
                    <th className="px-4 py-3.5">Pipeline Status</th>
                    <th className="px-4 py-3.5">Notes</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-neutral-500">
                        Loading prospects and trial requests...
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-neutral-500">
                        No leads matching the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => {
                      const statusObj = PIPELINE_STATUSES.find((s) => s.key === l.status) || PIPELINE_STATUSES[0];
                      const trialDate = l.trialBooking?.preferredDate
                        ? formatDate(l.trialBooking.preferredDate)
                        : "Tomorrow";
                      const trialTime = l.trialBooking?.preferredTime || "Morning";

                      const waTrialConfirm = generateWhatsAppLink(
                        l.phone,
                        WhatsAppTemplates.trialConfirmation(l.name, trialDate, trialTime)
                      );

                      return (
                        <tr key={l.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-white">{l.name}</p>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone size={10} /> {l.phone}
                              </span>
                              {l.email && (
                                <span className="hidden sm:inline text-neutral-500 truncate max-w-[130px]">
                                  {l.email}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60 text-[11px] font-medium">
                              {l.source}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-neutral-300">
                            {l.plan?.name ? `${l.plan.name} Tier` : "General Inflow"}
                          </td>

                          <td className="px-4 py-3.5">
                            <select
                              value={l.status}
                              onChange={(e) => handleStatusChange(l.id, e.target.value)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${statusObj.color} bg-opacity-40 focus:outline-none cursor-pointer`}
                            >
                              {PIPELINE_STATUSES.map((s) => (
                                <option key={s.key} value={s.key} className="bg-neutral-900 text-white">
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>

                        <td className="px-4 py-3.5 text-neutral-400 max-w-[200px] truncate">
                          {l.notes || "No notes"}
                        </td>

                        <td className="px-4 py-3.5 text-neutral-400">{formatDate(l.createdAt)}</td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Direct Action */}
                            <a
                              href={waTrialConfirm}
                              target="_blank"
                              rel="noreferrer"
                              title="Send WhatsApp Confirmation"
                              className="p-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40"
                            >
                              <MessageSquare size={13} />
                            </a>

                            {/* Convert to Member Action */}
                            {l.status !== "CONVERTED" && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="h-7 text-xs px-2.5"
                                onClick={() => openConvertModal(l)}
                              >
                                <UserCheck size={12} className="mr-1" />
                                Convert
                              </Button>
                            )}

                            {l.status === "CONVERTED" && (
                              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={13} /> Member
                              </span>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-neutral-500 hover:text-rose-400"
                              onClick={() => handleDeleteLead(l.id, l.name)}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {/* View 2: Trial Bookings Table (Exact Specification Requirement) */}
        {activeTab === "trials" && (
          <Card className="border-neutral-800 overflow-hidden">
            <div className="p-4 bg-neutral-900/60 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-400" />
                  Website Trial Pass Requests
                </h3>
                <p className="text-xs text-neutral-400">
                  Prospective members who claimed free 1-day passes on the marketing website.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTrialBookings}
                className="text-xs"
              >
                <RefreshCw size={12} className="mr-1.5" />
                Refresh Passes
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Time</th>
                    <th className="px-4 py-3.5">Membership</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Created</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {trialLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-neutral-500">
                        Loading trial bookings...
                      </td>
                    </tr>
                  ) : trialBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-neutral-500">
                        No free trial passes booked yet.
                      </td>
                    </tr>
                  ) : (
                    trialBookings.map((b) => {
                      const statusObj = TRIAL_STATUSES.find((s) => s.key === b.status) || TRIAL_STATUSES[0];
                      const trialDate = formatDate(b.preferredDate);
                      const waTrialConfirm = generateWhatsAppLink(
                        b.phone,
                        WhatsAppTemplates.trialConfirmation(b.name, trialDate, b.preferredTime)
                      );

                      return (
                        <tr key={b.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-white">{b.name}</p>
                            {b.email && (
                              <p className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                                {b.email}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-300 font-mono text-[11px]">{b.phone}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-neutral-200 font-medium">
                            {trialDate}
                          </td>

                          <td className="px-4 py-3.5 text-neutral-300">
                            {b.preferredTime}
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] font-medium">
                              {b.plan?.name || "Pro Tier (Default)"}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => handleTrialStatusChange(b, e.target.value)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${statusObj.color} bg-opacity-40 focus:outline-none cursor-pointer`}
                            >
                              {TRIAL_STATUSES.map((s) => (
                                <option key={s.key} value={s.key} className="bg-neutral-900 text-white">
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-4 py-3.5 text-neutral-400">
                            {formatDate(b.createdAt)}
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* WhatsApp Direct Action */}
                              <a
                                href={waTrialConfirm}
                                target="_blank"
                                rel="noreferrer"
                                title="Send WhatsApp Trial Confirmation"
                                className="p-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40"
                              >
                                <MessageSquare size={13} />
                              </a>

                              {/* Convert to Member Action */}
                              {b.status !== "CONVERTED" ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="h-7 text-xs px-2.5"
                                  onClick={() =>
                                    openConvertModal(b.lead || {
                                      id: b.leadId,
                                      name: b.name,
                                      phone: b.phone,
                                      email: b.email,
                                      planId: b.planId,
                                    })
                                  }
                                >
                                  <UserCheck size={12} className="mr-1" />
                                  Convert
                                </Button>
                              ) : (
                                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 size={13} /> Member
                                </span>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-neutral-500 hover:text-rose-400"
                                onClick={() => handleDeleteTrial(b.id, b.name)}
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add Lead Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">Add Prospective Lead</h3>
                <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="mt-4 space-y-3.5">
                <Input
                  label="Prospect Name *"
                  required
                  placeholder="e.g. Varun Shenoy"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                />
                <Input
                  label="Phone Number *"
                  required
                  placeholder="e.g. +91 98860 11000"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="name@example.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Website">Website</option>
                      <option value="Instagram">Instagram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                      <option value="Google">Google</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Target Plan</label>
                    <select
                      value={newLead.planId}
                      onChange={(e) => setNewLead({ ...newLead, planId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">No preference</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Initial Notes"
                  placeholder="e.g. Interested in strength conditioning coaching"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Lead
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Convert Lead to Member Modal */}
        {convertingLead && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserCheck size={18} className="text-emerald-400" />
                    Convert Lead into Active Member
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Prospect: <strong className="text-white">{convertingLead.name}</strong> ({convertingLead.phone})
                  </p>
                </div>
                <button onClick={() => setConvertingLead(null)} className="text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConvertLead} className="mt-4 space-y-4">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-xs text-emerald-300">
                  Converting this lead will automatically:
                  <ul className="list-disc ml-4 mt-1 space-y-0.5 text-neutral-300">
                    <li>Create an active Member record with a unique QR check-in code</li>
                    <li>Record initial subscription payment and generate Tax Invoice</li>
                    <li>Advance lead status to <strong>CONVERTED</strong></li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Assign Membership Tier *
                  </label>
                  <select
                    value={convertForm.planId}
                    onChange={(e) => {
                      const sel = plans.find((p) => p.id === e.target.value);
                      setConvertForm({
                        ...convertForm,
                        planId: e.target.value,
                        paymentAmount: sel ? sel.price : convertForm.paymentAmount,
                      });
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price} / {p.duration} days
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Payment Amount (₹)"
                    type="number"
                    value={convertForm.paymentAmount}
                    onChange={(e) =>
                      setConvertForm({ ...convertForm, paymentAmount: Number(e.target.value) })
                    }
                  />
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Payment Mode
                    </label>
                    <select
                      value={convertForm.paymentMethod}
                      onChange={(e) =>
                        setConvertForm({ ...convertForm, paymentMethod: e.target.value })
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Residential Address"
                  placeholder="e.g. HSR Layout Sector 2, Bengaluru"
                  value={convertForm.address}
                  onChange={(e) => setConvertForm({ ...convertForm, address: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setConvertingLead(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={converting}>
                    Confirm & Activate Member
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

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading lead pipeline...</div>}>
      <LeadsContent />
    </Suspense>
  );
}
