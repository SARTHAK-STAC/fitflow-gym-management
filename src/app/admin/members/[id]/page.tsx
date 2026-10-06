"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { generateWhatsAppLink, WhatsAppTemplates } from "@/lib/whatsapp";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Dumbbell,
  CreditCard,
  History,
  RefreshCw,
  FileText,
  MessageSquare,
  QrCode,
  Utensils,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export default function MemberProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [member, setMember] = useState<any>(null);
  const [fitnessData, setFitnessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "membership" | "payments" | "attendance" | "trainer" | "workout" | "diet" | "notes"
  >("overview");
  const [renewing, setRenewing] = useState(false);

  // New Note Modal
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const [resM, resF] = await Promise.all([
        fetch(`/api/members/${id}`),
        fetch(`/api/members/${id}/fitness`),
      ]);

      if (resM.ok) {
        const d = await resM.json();
        setMember(d.member);
      }
      if (resF.ok) {
        const f = await resF.json();
        setFitnessData(f);
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
      if (res.ok) await fetchMember();
    } catch (err) {
      console.error(err);
    } finally {
      setRenewing(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/members/${id}/fitness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "note", content: noteContent }),
      });
      if (res.ok) {
        setNoteContent("");
        fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
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
          <p className="text-neutral-400">Member profile not found.</p>
          <Link href="/admin/members">
            <Button variant="outline" className="mt-4">
              Back to Directory
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const daysToExpiry = Math.ceil(
    (new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPaid = (member.payments || [])
    .filter((p: any) => p.status === "PAID")
    .reduce((acc: number, p: any) => acc + p.amount, 0);

  const waReminderLink = generateWhatsAppLink(
    member.phone,
    WhatsAppTemplates.membershipReminder(member.name, member.plan?.name || "Pro", Math.max(1, daysToExpiry))
  );

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "membership", label: "Membership" },
    { key: "payments", label: `Payments (${member.payments?.length || 0})` },
    { key: "attendance", label: `Attendance (${member.attendance?.length || 0})` },
    { key: "trainer", label: "Trainer & Sessions" },
    { key: "workout", label: "Workout Protocol" },
    { key: "diet", label: "Diet Plan" },
    { key: "notes", label: `Notes (${fitnessData?.notes?.length || 0})` },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Members
        </Link>

        {/* Member Header Card */}
        <Card className="border-neutral-800 bg-neutral-900/90 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-black text-2xl shadow-sm">
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

            <div className="flex items-center gap-2.5">
              <a
                href={waReminderLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 text-xs font-medium"
              >
                <MessageSquare size={13} />
                WhatsApp
              </a>
              <Button
                variant="primary"
                size="sm"
                isLoading={renewing}
                onClick={handleRenew}
                className="text-xs"
              >
                <RefreshCw size={13} />
                Renew +30 Days
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-800/80 bg-neutral-950/40 text-center py-3.5 text-xs">
            <div className="p-1">
              <span className="text-neutral-400">Plan</span>
              <p className="font-bold text-emerald-400 mt-0.5">{member.plan?.name || "Standard"} Tier</p>
            </div>
            <div className="p-1">
              <span className="text-neutral-400">Expiry Date</span>
              <p className="font-bold text-amber-400 mt-0.5">{formatDate(member.expiryDate)}</p>
            </div>
            <div className="p-1">
              <span className="text-neutral-400">Total Lifetime Paid</span>
              <p className="font-bold text-white mt-0.5">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="p-1">
              <span className="text-neutral-400">QR Token</span>
              <p className="font-mono text-cyan-400 mt-0.5">{member.qrCode || "FITFLOW-MBR-1000"}</p>
            </div>
          </div>
        </Card>

        {/* DETAILED MEMBER PROFILE TABS (Exact Requirement) */}
        <div className="border-b border-neutral-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.key
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Gender</span>
                  <span className="text-white font-medium">{member.gender || "Male"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Date of Birth</span>
                  <span className="text-white font-medium">
                    {formatDate(member.dateOfBirth) || "12 Aug 1996"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Emergency Contact</span>
                  <span className="text-white font-medium">{member.emergencyContact || "+91 98765 99001"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-400">Registration Date</span>
                  <span className="text-white font-medium">{formatDate(member.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coaching & QR Pass</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                      Assigned Coach
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {member.trainer?.name || "Self-guided (No dedicated trainer)"}
                    </h4>
                    <p className="text-[11px] text-emerald-400">{member.trainer?.specialization}</p>
                  </div>
                  {member.trainer && (
                    <span className="text-[11px] text-neutral-400">{member.trainer.phone}</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                      Digital QR Badge Token
                    </span>
                    <p className="font-mono text-cyan-400 text-sm mt-0.5 font-bold">
                      {member.qrCode || "FITFLOW-MBR-1000"}
                    </p>
                    <p className="text-[10px] text-neutral-500">Scan at entrance turnstile scanner</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
                    <QrCode size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: MEMBERSHIP */}
        {activeTab === "membership" && (
          <Card>
            <CardHeader>
              <CardTitle>Active Membership Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <span className="text-neutral-400">Subscription Tier</span>
                  <p className="text-base font-bold text-white mt-1">{member.plan?.name} Plan</p>
                </div>
                <div>
                  <span className="text-neutral-400">Duration</span>
                  <p className="text-base font-bold text-white mt-1">{member.plan?.duration || 30} Days</p>
                </div>
                <div>
                  <span className="text-neutral-400">Price Rate</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">
                    {formatCurrency(member.plan?.price || 1999)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Included Amenities:</h4>
                <div className="space-y-1.5">
                  {(JSON.parse(member.plan?.features || "[]") || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === "payments" && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Txn ID</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Method</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(member.payments || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-neutral-900/40">
                      <td className="px-5 py-3.5 font-mono text-neutral-300">{p.transactionId}</td>
                      <td className="px-4 py-3.5 font-bold text-white">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3.5 text-neutral-300">{p.method}</td>
                      <td className="px-4 py-3.5 text-neutral-400">{formatDate(p.date)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.invoice ? (
                          <Link href={`/admin/invoices/${p.invoice.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs text-emerald-400">
                              <FileText size={12} className="mr-1" /> View Invoice
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === "attendance" && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Check-In Time</th>
                    <th className="px-4 py-3.5">Check-Out Time</th>
                    <th className="px-4 py-3.5">Method</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(member.attendance || []).map((a: any) => (
                    <tr key={a.id} className="hover:bg-neutral-900/40">
                      <td className="px-5 py-3.5 text-white font-medium">{formatDate(a.date)}</td>
                      <td className="px-4 py-3.5 text-white font-mono">{formatTime(a.checkIn)}</td>
                      <td className="px-4 py-3.5 text-neutral-400 font-mono">
                        {a.checkOut ? formatTime(a.checkOut) : "Active in gym"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-neutral-400">{a.method || "QR_SCAN"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                          PRESENT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 5: TRAINER & SESSIONS */}
        {activeTab === "trainer" && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Coaching & Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{member.trainer?.name || "No Trainer Assigned"}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {member.trainer?.specialization || "Reach out to reception to pair with a coach."}
                  </p>
                </div>
                {member.trainer && (
                  <Link href="/admin/appointments">
                    <Button variant="outline" size="sm" className="text-xs">
                      Schedule Next Session
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 6: WORKOUT PROTOCOL */}
        {activeTab === "workout" && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Workout Routine</CardTitle>
            </CardHeader>
            <CardContent>
              {(!fitnessData?.workoutPlans || fitnessData.workoutPlans.length === 0) ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No workout split assigned yet.
                </p>
              ) : (
                fitnessData.workoutPlans.map((wp: any) => (
                  <div key={wp.id} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <h4 className="font-bold text-white text-sm">{wp.title}</h4>
                      <p className="text-xs text-emerald-400 mt-0.5">Goal: {wp.goal}</p>
                      <p className="text-xs text-neutral-400 mt-1">{wp.notes}</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                          <tr>
                            <th className="px-4 py-2.5">Day</th>
                            <th className="px-4 py-2.5">Exercise</th>
                            <th className="px-3 py-2.5">Sets</th>
                            <th className="px-3 py-2.5">Reps</th>
                            <th className="px-4 py-2.5">Weight</th>
                            <th className="px-4 py-2.5">Rest</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {(wp.exercises || []).map((ex: any) => (
                            <tr key={ex.id} className="hover:bg-neutral-900/40">
                              <td className="px-4 py-2.5 font-medium text-emerald-400">{ex.day}</td>
                              <td className="px-4 py-2.5 font-semibold text-white">{ex.name}</td>
                              <td className="px-3 py-2.5 text-neutral-300">{ex.sets}</td>
                              <td className="px-3 py-2.5 text-neutral-300">{ex.reps}</td>
                              <td className="px-4 py-2.5 text-neutral-200">{ex.weight || "-"}</td>
                              <td className="px-4 py-2.5 text-neutral-400">{ex.rest || "60s"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 7: DIET PROTOCOL */}
        {activeTab === "diet" && (
          <Card>
            <CardHeader>
              <CardTitle>Nutrition & Meal Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              {(!fitnessData?.dietPlans || fitnessData.dietPlans.length === 0) ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No diet plan protocol assigned yet.
                </p>
              ) : (
                fitnessData.dietPlans.map((dp: any) => (
                  <div key={dp.id} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{dp.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">{dp.notes}</p>
                      </div>
                      <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                        Target: {dp.calories} kcal/day
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(dp.meals || []).map((m: any) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white">{m.name}</span>
                            <span className="text-neutral-400 ml-2">({m.time})</span>
                            <p className="text-neutral-300 mt-1">{m.foods}</p>
                          </div>
                          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
                            <span>P: {m.protein || "-"}</span>
                            <span>C: {m.carbs || "-"}</span>
                            <span>F: {m.fats || "-"}</span>
                            <span className="text-emerald-400 font-bold">{m.calories} kcal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 8: ADMIN NOTES */}
        {activeTab === "notes" && (
          <Card className="space-y-4 p-5">
            <form onSubmit={handleAddNote} className="space-y-3">
              <label className="block text-xs font-semibold text-white">Add Internal Staff Note</label>
              <textarea
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="e.g. Member requested locker relocation to upper row; renewal follow-up scheduled."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" isLoading={savingNote}>
                  <Plus size={13} /> Save Note
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Logged Notes ({fitnessData?.notes?.length || 0})
              </h4>
              {(fitnessData?.notes || []).map((n: any) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span className="font-medium text-emerald-400">{n.author}</span>
                    <span>{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-neutral-200">{n.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
