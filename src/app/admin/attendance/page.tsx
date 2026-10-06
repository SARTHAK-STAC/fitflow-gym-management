"use client";

import React, { useEffect, useState, Suspense } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import {
  CalendarCheck,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Users,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function AttendanceContent() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayCheckIns: 48, avgAttendance: 68, totalCheckIns: 1420 });
  const [loading, setLoading] = useState(true);

  // Manual Check-in State
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [marking, setMarking] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);

  // QR Scanner Simulator State
  const [qrInput, setQrInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

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
        if (data.members?.[0]) {
          setSelectedMemberId(data.members[0].id);
          // Pre-fill QR input with first member's token for instant testing
          setQrInput(data.members[0].qrCode || `FITFLOW-MBR-1000`);
        }
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
      if (res.ok) fetchAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const handleQrScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: qrInput.trim() }),
      });
      const data = await res.json();
      setScanResult(data);
      if (data.success) fetchAttendance();
    } catch (err) {
      setScanResult({ error: "Network error occurred during scan." });
    } finally {
      setScanning(false);
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
              Attendance & QR Turnstile Verification
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Verify member credentials via QR code scanning, validate expiry status, and view daily facility traffic.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Today's Attendance
            </span>
            <h3 className="text-3xl font-black text-white mt-2">{stats.todayCheckIns}</h3>
            <p className="text-[11px] text-neutral-400 mt-1">Checked in members</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Average Daily Visits
            </span>
            <h3 className="text-3xl font-black text-cyan-300 mt-2">{stats.avgAttendance}</h3>
            <p className="text-[11px] text-neutral-400 mt-1">Trailing 30 days</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Total Logged Check-ins
            </span>
            <h3 className="text-3xl font-black text-indigo-300 mt-2">
              {stats.totalCheckIns.toLocaleString()}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">All-time turnstile passes</p>
          </Card>
        </div>

        {/* QR ATTENDANCE SCANNER (Exact Specification Requirement) */}
        <Card className="border-emerald-900/50 bg-gradient-to-r from-emerald-950/20 via-neutral-900/90 to-neutral-900/90 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <QrCode size={13} />
                Front-Desk QR Scanner
              </div>
              <h3 className="text-lg font-bold text-white">Member Check-In Terminal</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Scan member mobile QR code or input member badge ID. The system checks active subscription validity, flags expired passes, and logs timestamps.
              </p>
            </div>

            <form onSubmit={handleQrScanSubmit} className="w-full md:w-auto flex-1 max-w-lg space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Scan or enter QR token (e.g. FITFLOW-MBR-1000)"
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <Button type="submit" variant="primary" isLoading={scanning} className="text-xs">
                  <QrCode size={14} /> Verify & Log
                </Button>
              </div>

              {/* Quick Preset Buttons for Testing */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span>Quick Test:</span>
                <button
                  type="button"
                  onClick={() => setQrInput("FITFLOW-MBR-1000")}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Active Member (Rahul)
                </button>
                <button
                  type="button"
                  onClick={() => setQrInput("FITFLOW-MBR-1006")}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-300"
                >
                  Expired Member (Neha)
                </button>
              </div>
            </form>
          </div>

          {/* SCANNER RESULT DISPLAY */}
          {scanResult && (
            <div className="mt-5 pt-4 border-t border-neutral-800">
              {scanResult.success && !scanResult.expired && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 text-white flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                      CHECK-IN SUCCESSFUL
                    </h4>
                    <p className="text-sm font-semibold text-white mt-1">
                      {scanResult.member?.name}
                    </p>
                    <p className="text-xs text-neutral-300">
                      Tier: <strong>{scanResult.member?.plan}</strong> • Expires:{" "}
                      <strong>{formatDate(scanResult.member?.expiryDate)}</strong>
                    </p>
                  </div>
                </div>
              )}

              {scanResult.expired && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-700 text-white flex items-start gap-3">
                  <XCircle size={24} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
                      MEMBERSHIP EXPIRED
                    </h4>
                    <p className="text-sm font-semibold text-white mt-1">
                      {scanResult.member?.name}
                    </p>
                    <p className="text-xs text-rose-200 mt-0.5">
                      {scanResult.message}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Contact front desk or direct member to renewal kiosk.
                    </p>
                  </div>
                </div>
              )}

              {scanResult.error && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{scanResult.error}</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Manual Check-in Bar & Date Filter */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Quick manual check-in form */}
            <form onSubmit={handleMarkAttendance} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              <div className="flex-1">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.plan?.name || "Basic"} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="secondary" size="sm" isLoading={marking}>
                Manual Log Entry
              </Button>
            </form>

            {/* Date filter */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <span className="text-xs text-neutral-400">Date:</span>
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
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      Loading attendance check-ins...
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      No check-ins recorded for this selected date.
                    </td>
                  </tr>
                ) : (
                  attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">{a.member?.name}</td>
                      <td className="px-4 py-3.5 text-neutral-400">{a.member?.phone}</td>
                      <td className="px-4 py-3.5 text-neutral-300">
                        {a.member?.plan?.name || "Standard Tier"}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">{formatDate(a.date)}</td>
                      <td className="px-4 py-3.5 text-white font-mono">{formatTime(a.checkIn)}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] text-neutral-300 font-mono">
                          {a.method || "MANUAL"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold">
                          PRESENT
                        </span>
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

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading attendance terminal...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}
