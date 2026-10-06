"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import {
  Dumbbell,
  Plus,
  Mail,
  Phone,
  Award,
  Users,
  Trash2,
  X,
  Edit,
} from "lucide-react";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    bio: "",
    photoUrl: "",
  });

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trainers");
      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          specialization: "",
          experience: "",
          bio: "",
          photoUrl: "",
        });
        fetchTrainers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove coach "${name}"?`)) return;
    try {
      await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      fetchTrainers();
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
              <Dumbbell size={24} className="text-emerald-400" />
              Trainers & Coaches
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Manage certifications, athlete quotas, and personal training assignments.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Add New Trainer
          </Button>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <Card key={t.id} className="border-neutral-800 bg-neutral-900/80 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-5 pb-4 border-b border-neutral-800/80 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                    <img
                      src={t.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{t.specialization}</p>
                    <span className="inline-block mt-1 text-[11px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      Exp: {t.experience}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-xs text-neutral-300">
                  <p className="text-neutral-400 line-clamp-2 min-h-[32px]">
                    {t.bio || "Certified coach leading high performance transformation programs."}
                  </p>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail size={13} />
                    <span>{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Phone size={13} />
                    <span>{t.phone}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Assigned Members:</span>
                    <span className="font-bold text-white bg-neutral-800 px-2 py-0.5 rounded">
                      {t.members?.length || 0} members
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950/40 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-medium">Active Coach</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs"
                  onClick={() => handleDelete(t.id, t.name)}
                >
                  <Trash2 size={13} className="mr-1" />
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Trainer Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white">Add Certified Trainer</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTrainer} className="mt-4 space-y-4">
                <Input
                  label="Trainer Full Name *"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  placeholder="e.g. coach@fitflow.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone Number *"
                  required
                  placeholder="e.g. +91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Specialization *"
                    required
                    placeholder="e.g. Hypertrophy"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({ ...formData, specialization: e.target.value })
                    }
                  />
                  <Input
                    label="Experience *"
                    required
                    placeholder="e.g. 5+ years"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>
                <Input
                  label="Photo URL (Optional)"
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={submitting}>
                    Add Trainer
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
