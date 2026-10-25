"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Layers,
  FileSearch,
  Share2,
  GitBranch,
  ShieldAlert,
  Cpu,
  Building2,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const NAV_ITEMS = [
  { href: "/", label: "Command Center", icon: Layers, tag: "Mod 1 & 8", desc: "Applications & National Scrutiny Queue" },
  { href: "/scrutiny/AICTE-2024-FRAUD-002", label: "Split-Screen Scrutiny", icon: FileSearch, tag: "Mod 2 & 3", desc: "Spatial Bounding Boxes & Clause Diff" },
  { href: "/evidence-graph", label: "Evidence Knowledge Graph", icon: Share2, tag: "Mod 3", desc: "Multi-Hop Entity Links & Ghost Faculty Rings" },
  { href: "/timeline-dag", label: "Timeline Impossibility DAG", icon: GitBranch, tag: "Mod 3", desc: "Allen's Interval Algebra Paradoxes" },
  { href: "/attack-lab", label: "Forensic Attack Lab", icon: ShieldAlert, tag: "Mod 4", desc: "Synthetic Tampering & ELA Detectors" },
  { href: "/rules-matrix", label: "Z3 Rule Conflict Matrix", icon: Cpu, tag: "Mod 6", desc: "SMT Formal Logic & Circular Overrides" },
  { href: "/authority-gateway", label: "Issuing Authority Gateway", icon: Building2, tag: "Mod 5", desc: "DigiLocker, Bhulekh Land & MCA21 Sandbox" },
  { href: "/audit-ledger", label: "Legal Audit Ledger", icon: Clock, tag: "Mod 9", desc: "Event Sourcing & Statutory Notices" }
];

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Navigation Sidebar */}
      <aside className="w-72 bg-slate-900/90 border-r border-slate-800/80 flex flex-col shrink-0 sticky top-0 h-screen z-40 backdrop-blur-md">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                SAKSHYA
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                AICTE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Regulatory Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
            Regulatory Scrutiny Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) || (item.href.startsWith("/scrutiny") && pathname.startsWith("/scrutiny"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                  isActive ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200" : "bg-slate-800 border-slate-700 text-slate-400"
                }`}>
                  {item.tag}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Engine Telemetry Bottom Box */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 m-3 rounded-2xl border">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dual-Engine Telemetry</span>
          </div>
          <div className="space-y-1.5 text-[10px] font-medium text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Z3 SMT Solver</span>
              </span>
              <span className="text-emerald-400 font-mono">SAT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Timeline DAG</span>
              </span>
              <span className="text-cyan-400 font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>OpenCV ELA</span>
              </span>
              <span className="text-indigo-400 font-mono">READY</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Government of India</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Ministry of Education</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">AICTE Approval Bureau</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Session: <b>AICTE Senior Scrutiny Officer</b></span>
            </div>
            <Link
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 transition"
            >
              <span>API Gateway</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content Body with Ample Whitespace */}
        <div className="flex-1 p-8 xl:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
