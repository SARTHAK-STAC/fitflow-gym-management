"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  FileBarChart2,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Memberships", href: "/admin/memberships", icon: Sparkles },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
    { name: "Trainers", href: "/admin/trainers", icon: Dumbbell },
    { name: "Reports", href: "/admin/reports", icon: FileBarChart2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white text-xs py-1 px-4 text-center font-medium shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>FitFlow Demo Mode Active — Pre-configured with realistic gym data & simulation</span>
        </div>
        <Link
          href="/"
          className="underline text-emerald-100 hover:text-white text-xs hidden sm:inline"
        >
          View Public Site &rarr;
        </Link>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden mt-6 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-6 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black">
            FF
          </div>
          <span className="font-bold tracking-tight text-white text-base">FitFlow</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18 z-40 bg-neutral-950/95 backdrop-blur-md p-4 flex flex-col">
          <div className="space-y-1 mb-6">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 mt-6 border-r border-neutral-800 bg-neutral-900/90 backdrop-blur-md fixed top-0 bottom-0 left-0 z-30">
        {/* Brand */}
        <div className="p-6 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black text-lg shadow-md shadow-emerald-500/10">
              FF
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white">FitFlow</h1>
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
                }`}
              >
                <Icon size={18} className={active ? "text-emerald-400" : "text-neutral-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[110px]">{user?.email || "admin@fitflow.com"}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 mt-6">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-6 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Quick search members, plans, transactions..."
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Notifications ({unreadCount})</span>
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800/60">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-neutral-500 text-center">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="p-3 hover:bg-neutral-800/50 transition-colors">
                          <p className="text-xs font-medium text-neutral-200">{n.title}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-neutral-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950">
              <UserIcon size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-neutral-200">{user?.name || "Vikram Malhotra"}</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
