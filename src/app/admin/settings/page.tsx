"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save, Bell, Shield, Building, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [gymSettings, setGymSettings] = useState({
    gymName: "FitFlow Fitness",
    tagline: "Train Hard. Live Strong.",
    phone: "+91 98765 43210",
    email: "contact@fitflowfitness.com",
    address: "Plot 42, HSR Layout, Sector 2, Bengaluru, Karnataka 560102",
    gstNumber: "29AAAAA0000A1Z5",
    currency: "INR (₹)",
    reminderDays: 7,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings size={24} className="text-emerald-400" />
            Gym & System Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure gym business details, tax invoice identifiers, and automated reminders.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={16} />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Gym Profile */}
          <Card className="border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={16} className="text-emerald-400" />
                Gym Branding & Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Gym Business Name"
                  value={gymSettings.gymName}
                  onChange={(e) => setGymSettings({ ...gymSettings, gymName: e.target.value })}
                />
                <Input
                  label="Tagline / Motto"
                  value={gymSettings.tagline}
                  onChange={(e) => setGymSettings({ ...gymSettings, tagline: e.target.value })}
                />
                <Input
                  label="Official Contact Phone"
                  value={gymSettings.phone}
                  onChange={(e) => setGymSettings({ ...gymSettings, phone: e.target.value })}
                />
                <Input
                  label="Support / Billing Email"
                  type="email"
                  value={gymSettings.email}
                  onChange={(e) => setGymSettings({ ...gymSettings, email: e.target.value })}
                />
              </div>

              <Input
                label="Physical Facility Address"
                value={gymSettings.address}
                onChange={(e) => setGymSettings({ ...gymSettings, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GSTIN / Tax ID"
                  value={gymSettings.gstNumber}
                  onChange={(e) => setGymSettings({ ...gymSettings, gstNumber: e.target.value })}
                />
                <Input
                  label="Default Currency Symbol"
                  value={gymSettings.currency}
                  readOnly
                  className="opacity-70 cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Expiry & Notifications */}
          <Card className="border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={16} className="text-amber-400" />
                Automated Expiry & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Renewal Warning Window (Days before expiry)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="w-full sm:w-48 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  value={gymSettings.reminderDays}
                  onChange={(e) =>
                    setGymSettings({ ...gymSettings, reminderDays: Number(e.target.value) })
                  }
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Members expiring within this window will be flagged as "Expiring Soon" on the dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              <Save size={15} />
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
