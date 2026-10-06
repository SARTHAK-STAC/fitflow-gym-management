"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onBookTrialClick?: () => void;
}

export function Navbar({ onBookTrialClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Membership", href: "#plans" },
    { name: "Trainers", href: "#trainers" },
    { name: "Facilities", href: "#facilities" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? "h-16 bg-neutral-950/95 backdrop-blur-md border-neutral-800/90 shadow-lg shadow-black/40"
          : "h-[72px] bg-neutral-950/80 backdrop-blur-sm border-neutral-800/60"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-0.5"
        >
          {/* FF Monogram mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-black text-neutral-950 text-base tracking-tighter shadow-sm group-hover:brightness-110 transition-all duration-200">
            FF
          </div>
          {/* Brand Name Typography */}
          <div className="flex flex-col justify-center">
            <span className="text-[17px] font-black tracking-tight text-white leading-none group-hover:text-neutral-100">
              FITFLOW
            </span>
            <span className="text-[10px] font-medium tracking-[0.22em] text-neutral-400 uppercase leading-none mt-1">
              FITNESS CLUB
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION (max 6 links, 14px-15px font-medium, centered/left grouped) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[14px] xl:text-[15px] font-medium text-neutral-300 hover:text-white transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA ACTIONS (Right grouped) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#trial"
            onClick={onBookTrialClick}
            className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-neutral-950 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] rounded-lg shadow-sm transition-all duration-200 tracking-tight"
          >
            BOOK A FREE TRIAL
          </a>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-neutral-200 hover:text-white bg-transparent hover:bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 active:scale-[0.98] rounded-lg transition-all duration-200 tracking-tight"
          >
            MEMBER LOGIN
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* CLEAN FULL-WIDTH MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 backdrop-blur-xl border-b border-neutral-800 shadow-2xl px-6 py-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-emerald-400 py-1 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex flex-col gap-3">
            <a
              href="#trial"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onBookTrialClick) onBookTrialClick();
              }}
              className="w-full text-center py-2.5 px-4 text-sm font-semibold text-neutral-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-sm transition-all duration-200"
            >
              BOOK A FREE TRIAL
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 text-sm font-medium text-neutral-200 hover:text-white bg-neutral-900 border border-neutral-700/80 rounded-lg transition-all duration-200"
            >
              MEMBER LOGIN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
