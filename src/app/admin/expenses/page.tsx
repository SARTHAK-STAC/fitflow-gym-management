"use client";

import React, { useEffect, useState, Suspense } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  IndianRupee,
  TrendingDown,
  PieChart as PieIcon,
  Download,
  Filter,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const CATEGORIES = [
  "Rent",
  "Electricity",
  "Equipment",
  "Maintenance",
  "Salary",
  "Marketing",
  "Cleaning",
  "Supplies",
  "Other",
];

const CATEGORY_COLORS: { [key: string]: string } = {
  Rent: "#f43f5e",
  Electricity: "#f97316",
  Salary: "#3b82f6",
  Marketing: "#8b5cf6",
  Maintenance: "#eab308",
  Equipment: "#06b6d4",
  Cleaning: "#10b981",
  Supplies: "#64748b",
  Other: "#a855f7",
};

function ExpensesContent() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Add Expense Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Maintenance",
    amount: 1500,
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Bank Transfer",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/expenses", window.location.origin);
      if (categoryFilter !== "ALL") url.searchParams.set("category", categoryFilter);
      if (startDate) url.searchParams.set("startDate", startDate);
      if (endDate) url.searchParams.set("endDate", endDate);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, startDate, endDate]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          category: "Maintenance",
          amount: 1500,
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "Bank Transfer",
          description: "",
        });
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) return;
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      fetchExpenses();
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
              <Receipt size={24} className="text-rose-400" />
              Expense & Facility Overhead Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Track rent, electric bills, equipment repairs, salaries, and marketing spends to calculate net operational profit.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Record Expense
          </Button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Expenses This Month
            </span>
            <h3 className="text-3xl font-black text-white mt-2">
              {formatCurrency(summary?.totalThisMonth || 0)}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">Direct operational burn</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Recorded Outflow
            </span>
            <h3 className="text-3xl font-black text-neutral-200 mt-2">
              {formatCurrency(summary?.totalAllTime || 0)}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">Across all logged categories</p>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Total Entries Logged
            </span>
            <h3 className="text-3xl font-black text-indigo-300 mt-2">{expenses.length}</h3>
            <p className="text-[11px] text-neutral-400 mt-1">Receipts & vendor vouchers</p>
          </Card>
        </div>

        {/* Category Breakdown Bar Chart */}
        <Card className="border-neutral-800">
          <CardHeader>
            <CardTitle>Overhead Breakdown by Category (Current Month)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.categoryBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="category" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#262626",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Spend"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {(summary?.categoryBreakdown || []).map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.category] || "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filter Bar */}
        <Card className="border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Date Range:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5"
              />
              <span className="text-neutral-500 text-xs">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategoryFilter("ALL");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Expenses Table */}
        <Card className="border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Expense Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      Loading expenses...
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">
                      No expenses match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">{e.title}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-medium border"
                          style={{
                            borderColor: `${CATEGORY_COLORS[e.category] || "#737373"}60`,
                            color: CATEGORY_COLORS[e.category] || "#ffffff",
                            backgroundColor: `${CATEGORY_COLORS[e.category] || "#737373"}15`,
                          }}
                        >
                          {e.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-rose-400">
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">{e.paymentMethod}</td>
                      <td className="px-4 py-3.5 text-neutral-400">{formatDate(e.date)}</td>
                      <td className="px-4 py-3.5 text-neutral-400 max-w-[240px] truncate">
                        {e.description || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-neutral-500 hover:text-rose-400"
                          onClick={() => handleDelete(e.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Record Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">Record New Expense</h3>
                <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="mt-4 space-y-3.5">
                <Input
                  label="Expense Title *"
                  required
                  placeholder="e.g. BESCOM Electricity Bill"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Amount (₹) *"
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Description / Vendor Notes
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Voucher Ref: 489190 for Technogym belt replacement"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Expense
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

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading expenses...</div>}>
      <ExpensesContent />
    </Suspense>
  );
}
