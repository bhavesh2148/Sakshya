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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-[#1F3A5F] selection:text-white">
      {/* Left Navigation Sidebar */}
      <aside className="w-72 bg-white/90 border-r border-slate-200/80 flex flex-col shrink-0 sticky top-0 h-screen z-40 ">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200/80 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#1F3A5F] shrink-0">
            <div className="w-full h-full flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider   text-[#1F3A5F]">
                SAKSHYA
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1F3A5F]/10 border border-[#1F3A5F]/30 text-[#1F3A5F]">
                AICTE
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Regulatory Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase font-extrabold tracking-wider text-slate-600">
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
                className={`group flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#1F3A5F]/10 text-[#1F3A5F] border border-[#1F3A5F]/30 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#1F3A5F]" : "text-slate-600 group-hover:text-slate-800"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                  isActive ? "bg-[#1F3A5F]/10 border-[#1F3A5F]/30 text-[#1F3A5F]" : "bg-slate-100 border-slate-300 text-slate-600"
                }`}>
                  {item.tag}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Engine Telemetry Bottom Box */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/40 m-3 rounded-lg border">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1F3A5F]" />
            <span>System status</span>
          </div>
          <div className="space-y-1.5 text-[10px] font-medium text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Z3 SMT Solver</span>
              </span>
              <span className="text-emerald-700 font-mono">SAT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Timeline DAG</span>
              </span>
              <span className="text-[#1D5FA8] font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>OpenCV ELA</span>
              </span>
              <span className="text-[#1F3A5F] font-mono">READY</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/80 bg-white/60  px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-600">Government of India</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-600">Ministry of Education</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-800 font-semibold">AICTE Approval Bureau</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Session: <b>AICTE Senior Scrutiny Officer</b></span>
            </div>
            <Link
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              className="flex items-center space-x-1 text-xs text-[#1F3A5F] hover:text-[#1F3A5F] font-medium px-2.5 py-1.5 rounded-lg border border-[#1F3A5F]/30 bg-[#1F3A5F]/10 transition"
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
