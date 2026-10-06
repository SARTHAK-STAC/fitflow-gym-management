"use client";

import React, { useEffect, useState, Suspense } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Plus,
  Dumbbell,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";

const APPOINTMENT_TYPES = [
  "Personal Training",
  "Consultation",
  "Fitness Assessment",
  "Diet Consultation",
];

const TIME_SLOTS = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:30 AM",
  "11:00 AM",
  "04:00 PM",
  "05:00 PM",
  "06:30 PM",
  "07:30 PM",
  "08:30 PM",
];

function AppointmentsContent() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [trainerFilter, setTrainerFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Schedule Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    trainerId: "",
    memberId: "",
    date: new Date().toISOString().split("T")[0],
    time: "07:00 AM",
    duration: 60,
    type: "Personal Training",
    status: "SCHEDULED",
    notes: "1-on-1 progressive training session",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/appointments", window.location.origin);
      if (trainerFilter !== "ALL") url.searchParams.set("trainerId", trainerFilter);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [resT, resM] = await Promise.all([
        fetch("/api/trainers"),
        fetch("/api/members"),
      ]);
      if (resT.ok) {
        const tData = await resT.json();
        setTrainers(tData.trainers || []);
        if (tData.trainers?.[0]) {
          setFormData((prev) => ({ ...prev, trainerId: tData.trainers[0].id }));
        }
      }
      if (resM.ok) {
        const mData = await resM.json();
        setMembers(mData.members || []);
        if (mData.members?.[0]) {
          setFormData((prev) => ({ ...prev, memberId: mData.members[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [trainerFilter, statusFilter]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: Number(formData.duration),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAppointments();
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
              <Calendar size={24} className="text-cyan-400" />
              Trainer Appointments & Session Scheduling
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Book personal training slots, fitness assessments, and diet consultations between coaches and members.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Book Trainer Session
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Coach:</span>
              <select
                value={trainerFilter}
                onChange={(e) => setTrainerFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Trainers</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTrainerFilter("ALL");
                  setStatusFilter("ALL");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card className="border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Assigned Coach</th>
                  <th className="px-4 py-3.5">Session Type</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Session Notes</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      Loading scheduled sessions...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      No appointments matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {a.member?.name}
                        <span className="block text-[11px] text-neutral-400 font-normal">
                          {a.member?.phone}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-neutral-300">
                        <span className="font-medium text-emerald-400">{a.trainer?.name}</span>
                        <span className="block text-[11px] text-neutral-400">
                          {a.trainer?.specialization}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-white">{a.type}</td>

                      <td className="px-4 py-3.5 text-neutral-300">
                        <span className="block font-semibold text-white">{formatDate(a.date)}</span>
                        <span className="text-[11px] text-neutral-400">
                          {a.time} ({a.duration} mins)
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <select
                          value={a.status}
                          onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                            a.status === "COMPLETED"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                              : a.status === "SCHEDULED"
                              ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                              : "bg-rose-950 text-rose-400 border-rose-800"
                          } bg-opacity-40 focus:outline-none cursor-pointer`}
                        >
                          <option value="SCHEDULED" className="bg-neutral-900 text-white">
                            Scheduled
                          </option>
                          <option value="COMPLETED" className="bg-neutral-900 text-white">
                            Completed
                          </option>
                          <option value="CANCELLED" className="bg-neutral-900 text-white">
                            Cancelled
                          </option>
                          <option value="NO_SHOW" className="bg-neutral-900 text-white">
                            No Show
                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 text-neutral-400 max-w-[200px] truncate">
                        {a.notes || "-"}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {a.status === "SCHEDULED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-emerald-400"
                            onClick={() => handleUpdateStatus(a.id, "COMPLETED")}
                          >
                            Mark Done
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Schedule Session Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">Schedule Trainer Session</h3>
                <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
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
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Assigned Coach *
                  </label>
                  <select
                    value={formData.trainerId}
                    onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Session Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      {APPOINTMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      {TIME_SLOTS.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Duration (mins)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: Number(e.target.value) })
                    }
                  />
                </div>

                <Input
                  label="Session Notes"
                  placeholder="e.g. Focus on squat form and mobility"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Confirm Appointment
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

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading appointments...</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
