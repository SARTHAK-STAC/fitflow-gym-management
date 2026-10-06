"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@fitflow.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Invalid email or password");
      return;
    }

    if (email.toLowerCase().includes("admin")) {
      router.push(callbackUrl || "/admin/dashboard");
    } else {
      router.push(callbackUrl || "/member/dashboard");
    }
  };

  const setAdminDemo = () => {
    setEmail("admin@fitflow.com");
    setPassword("admin123");
  };

  const setMemberDemo = () => {
    setEmail("rahul.sharma@example.com");
    setPassword("member123");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Demo Credentials Quick Switcher Banner */}
      <div className="max-w-md w-full mb-6 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 text-emerald-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="font-bold flex items-center gap-1.5 text-white">
            <ShieldCheck size={16} className="text-emerald-400" />
            Quick Demo Auto-Fill:
          </span>
          <p className="text-[11px] text-emerald-400/80 mt-0.5">Click to populate credentials</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={setAdminDemo}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-white font-semibold text-xs border border-emerald-500/40 cursor-pointer transition-colors"
          >
            Admin Demo
          </button>
          <button
            type="button"
            onClick={setMemberDemo}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-white font-semibold text-xs border border-cyan-500/40 cursor-pointer transition-colors"
          >
            Member Demo
          </button>
        </div>
      </div>

      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-emerald-500/10">
              FF
            </div>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white">
            FitFlow Portal Login
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access the Admin Console or Member Experience Dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-md p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              Sign In to Account
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* Quick Creds Info Box */}
          <div className="mt-6 pt-5 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
            <p className="font-semibold text-neutral-300">Demo Accounts Available:</p>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1 font-mono text-[10px]">
              <div className="text-emerald-400">
                <strong>Admin:</strong> admin@fitflow.com / admin123
              </div>
              <div className="text-cyan-400">
                <strong>Member:</strong> rahul.sharma@example.com / member123
              </div>
            </div>
          </div>
        </Card>

        {/* Back to public site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            &larr; Back to FitFlow Fitness Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
