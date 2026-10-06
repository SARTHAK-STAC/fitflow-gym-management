"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function MembershipsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 999,
    duration: 30,
    description: "",
    features: [""],
    isPopular: false,
    isActive: true,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      price: 999,
      duration: 30,
      description: "",
      features: ["Full gym access", "Locker room access"],
      isPopular: false,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingPlan(p);
    setFormData({
      name: p.name,
      price: p.price,
      duration: p.duration,
      description: p.description,
      features: Array.isArray(p.features) ? p.features : [],
      isPopular: p.isPopular,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formData.features];
    updated[index] = val;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeatureInput = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanFeatures = formData.features.filter((f) => f.trim() !== "");
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features: cleanFeatures,
      };

      if (editingPlan) {
        await fetch(`/api/plans/${editingPlan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete membership plan "${name}"?`)) return;
    try {
      await fetch(`/api/plans/${id}`, { method: "DELETE" });
      fetchPlans();
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
              <Sparkles size={24} className="text-emerald-400" />
              Membership Plans
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Configure subscription tiers, monthly rates, perks, and active member limits.
            </p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={16} />
            Create Plan
          </Button>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isRec = p.isPopular || p.name.toLowerCase() === "pro";
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                  isRec
                    ? "bg-neutral-900 border-emerald-500/70 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/40"
                    : "bg-neutral-900/60 border-neutral-800"
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-black font-extrabold text-[11px] uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                      Recommended
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <Badge variant={p.isActive ? "success" : "neutral"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">
                    {p.description}
                  </p>

                  <div className="mt-4 pb-4 border-b border-neutral-800 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="text-xs text-neutral-400">/ {p.duration} days</span>
                  </div>

                  {/* Active member counter */}
                  <div className="py-3 flex items-center gap-2 text-xs text-neutral-300">
                    <Users size={14} className="text-emerald-400" />
                    <span>
                      <strong className="text-white">{p.activeMemberCount || 0}</strong> active subscribers
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="mt-2 space-y-2.5">
                    {(p.features || []).map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-400 mt-0.5 shrink-0"
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(p)}
                  >
                    <Edit2 size={13} />
                    Edit Plan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Plan Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">
                  {editingPlan ? "Edit Membership Plan" : "Create New Membership Plan"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <Input
                  label="Plan Name"
                  required
                  placeholder="e.g. Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₹ INR)"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                  />
                  <Input
                    label="Duration (in days)"
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-neutral-300">
                      Features / Perks
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureInput}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feat, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(i, e.target.value)}
                          placeholder="e.g. 2 Personal training sessions"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeatureInput(i)}
                            className="text-neutral-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) =>
                        setFormData({ ...formData, isPopular: e.target.checked })
                      }
                      className="rounded bg-neutral-950 border-neutral-800 text-emerald-500 focus:ring-0"
                    />
                    Mark as Recommended Plan
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded bg-neutral-950 border-neutral-800 text-emerald-500 focus:ring-0"
                    />
                    Active Plan
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Plan
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
