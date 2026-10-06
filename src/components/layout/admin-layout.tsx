"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Users,
  Target,
  Sparkles,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Calendar,
  Receipt,
  FileBarChart2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  User as UserIcon,
  ChevronRight,
  ArrowRight,
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

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Leads", href: "/admin/leads", icon: Target },
    { name: "Memberships", href: "/admin/memberships", icon: Sparkles },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
    { name: "Trainers", href: "/admin/trainers", icon: Dumbbell },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Expenses", href: "/admin/expenses", icon: Receipt },
    { name: "Reports", href: "/admin/reports", icon: FileBarChart2 },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
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

  // Global search execution with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results);
          setSearchOpen(true);
        }
      } catch {
        // ignore
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      {/* Demo Mode Strip */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b border-neutral-800 text-neutral-300 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-white">FitFlow SaaS Console</span>
          <span className="hidden sm:inline text-neutral-400">— Enterprise Gym Operating System</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Public Website &rarr;
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden mt-7 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-7 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-neutral-950 text-sm">
            FF
          </div>
          <div>
            <span className="font-bold text-white text-sm">FitFlow</span>
            <span className="block text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">
              Admin Console
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18 z-40 bg-neutral-950/98 backdrop-blur-lg p-5 flex flex-col overflow-y-auto">
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
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={active ? "text-emerald-400" : "text-neutral-400"} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400">{user?.name || "Admin"}</span>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (12 modules) */}
      <aside className="hidden md:flex flex-col w-64 mt-7 border-r border-neutral-800 bg-neutral-950 fixed top-0 bottom-0 left-0 z-30">
        {/* Brand */}
        <div className="p-5 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-neutral-950 text-base shadow-sm">
              FF
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight text-white leading-none">
                FITFLOW
              </h1>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mt-1">
                Management Console
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold shadow-sm"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon size={17} className={active ? "text-emerald-400" : "text-neutral-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {user?.name || "Vikram Malhotra"}
                </p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                  {user?.email || "admin@fitflow.com"}
                </p>
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
      <div className="flex-1 flex flex-col md:pl-64 mt-7">
        {/* Top Header with Global Search */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-7 z-20">
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global search: members, leads, transactions, trainers..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Global Search Dropdown Results */}
            {searchOpen && searchResults && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 max-h-96 overflow-y-auto p-3 space-y-3">
                {/* Members */}
                {searchResults.members?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 px-2">
                      Members ({searchResults.members.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.members.map((m: any) => (
                        <Link
                          key={m.id}
                          href={`/admin/members/${m.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/70 transition-colors text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white">{m.name}</span>
                            <span className="text-neutral-400 ml-2">{m.phone}</span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            {m.plan?.name || "Standard"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leads */}
                {searchResults.leads?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 px-2">
                      Leads ({searchResults.leads.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.leads.map((l: any) => (
                        <Link
                          key={l.id}
                          href="/admin/leads"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/70 transition-colors text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white">{l.name}</span>
                            <span className="text-neutral-400 ml-2">via {l.source}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-amber-400">
                            {l.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payments */}
                {searchResults.payments?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 px-2">
                      Payments ({searchResults.payments.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.payments.map((p: any) => (
                        <Link
                          key={p.id}
                          href="/admin/payments"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/70 transition-colors text-xs"
                        >
                          <div>
                            <span className="font-mono text-neutral-300">{p.transactionId}</span>
                            <span className="text-white ml-2">{p.member?.name}</span>
                          </div>
                          <span className="font-bold text-emerald-400">₹{p.amount}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trainers */}
                {searchResults.trainers?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 px-2">
                      Trainers
                    </span>
                    <div className="space-y-1">
                      {searchResults.trainers.map((t: any) => (
                        <Link
                          key={t.id}
                          href="/admin/trainers"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/70 transition-colors text-xs"
                        >
                          <span className="font-semibold text-white">{t.name}</span>
                          <span className="text-neutral-400">{t.specialization}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.members?.length === 0 &&
                  searchResults.leads?.length === 0 &&
                  searchResults.payments?.length === 0 &&
                  searchResults.trainers?.length === 0 && (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
                    <span className="text-xs font-semibold text-white">
                      Notifications ({unreadCount})
                    </span>
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
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-neutral-800 bg-neutral-950 text-center">
                    <Link
                      href="/admin/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-emerald-400 hover:underline font-medium"
                    >
                      View All Notifications &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900">
              <UserIcon size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-neutral-200">
                {user?.name || "Vikram Malhotra"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
