"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black text-2xl mx-auto mb-4 shadow-xl shadow-emerald-500/10">
            FF
          </div>
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-xs text-neutral-400 mt-1">
            We will send you a password recovery link to your inbox.
          </p>
        </div>

        <Card className="border-neutral-800 bg-neutral-900/80 p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Recovery Email Dispatched</h3>
              <p className="text-xs text-neutral-400">
                Instructions have been sent to <strong>{email}</strong>. For demo purposes, you can log in directly with the demo credentials.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="primary" size="sm">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
            >
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
