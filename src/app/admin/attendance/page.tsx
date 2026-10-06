"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import {
  CalendarCheck,
  Search,
  UserCheck,
  Clock,
  CheckCircle,
  Plus,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayCheckIns: 42, avgAttendance: 68, totalCheckIns: 1420 });
  const [loading, setLoading] = useState(true);

  // Mark attendance state
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [marking, setMarking] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/attendance", window.location.origin);
      if (dateFilter) url.searchParams.set("date", dateFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.attendance || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        if (data.members?.[0]) setSelectedMemberId(data.members[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter]);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setMarking(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMemberId,
          status: "PRESENT",
        }),
      });
      if (res.ok) {
        fetchAttendance();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CalendarCheck size={24} className="text-emerald-400" />
              Attendance Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Check in members, monitor daily gym floor traffic, and view historical logs.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards (Section 13 requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-neutral-800 bg-neutral-900/70">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Today's Attendance
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white mt-3">{stats.todayCheckIns}</h3>
              <p className="text-[11px] text-neutral-500 mt-1">Members checked in today</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/70">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Average Attendance
                </p>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white mt-3">{stats.avgAttendance}</h3>
              <p className="text-[11px] text-neutral-500 mt-1">Daily average this month</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/70">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Total Check-ins
                </p>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white mt-3">
                {stats.totalCheckIns.toLocaleString()}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1">All-time recorded sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Check-In Bar & Date Filter */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-5">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Quick check-in form */}
            <form onSubmit={handleMarkAttendance} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              <div className="flex-1">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.plan?.name || "Basic"} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" size="sm" isLoading={marking}>
                <CheckCircle size={15} />
                Quick Check In Member
              </Button>
            </form>

            {/* Date filter */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <span className="text-xs text-neutral-400 whitespace-nowrap">Filter Date:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateFilter(new Date().toISOString().split("T")[0])}
              >
                Today
              </Button>
            </div>
          </div>
        </Card>

        {/* Attendance Records Table */}
        <Card className="border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Member Name</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Membership Plan</th>
                  <th className="px-4 py-3.5">Check-In Date</th>
                  <th className="px-4 py-3.5">Check-In Time</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-neutral-500">
                      Loading attendance check-ins...
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-neutral-500">
                      No check-ins recorded for this selected date.
                    </td>
                  </tr>
                ) : (
                  attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white">{a.member?.name}</td>
                      <td className="px-4 py-3.5 text-neutral-400">{a.member?.phone}</td>
                      <td className="px-4 py-3.5 text-neutral-300">
                        {a.member?.plan?.name || "Standard"}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">{formatDate(a.date)}</td>
                      <td className="px-4 py-3.5 text-neutral-200 font-mono">
                        {formatTime(a.checkIn)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
