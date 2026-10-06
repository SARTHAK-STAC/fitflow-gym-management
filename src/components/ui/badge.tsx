import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral" | "info";
  className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  const styles = {
    success: "bg-emerald-950/70 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/70 text-amber-400 border-amber-800/60",
    danger: "bg-rose-950/70 text-rose-400 border-rose-800/60",
    neutral: "bg-neutral-800/80 text-neutral-300 border-neutral-700",
    info: "bg-cyan-950/70 text-cyan-400 border-cyan-800/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "PAID":
    case "PRESENT":
      return <Badge variant="success">{status}</Badge>;
    case "EXPIRING_SOON":
    case "PENDING":
      return <Badge variant="warning">{status.replace("_", " ")}</Badge>;
    case "EXPIRED":
    case "FAILED":
    case "ABSENT":
      return <Badge variant="danger">{status}</Badge>;
    default:
      return <Badge variant="neutral">{status || "Unknown"}</Badge>;
  }
}
