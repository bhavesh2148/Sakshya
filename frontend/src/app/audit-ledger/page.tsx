"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Lock,
  UserCheck,
  Scale
} from "lucide-react";

export default function AuditLedgerPage() {
  const LOGS = [
    {
      id: "LOG-00001",
      timestamp: "2024-06-01 10:15:30 UTC",
      actor_name: "AICTE-SYSTEM",
      role: "AICTE_SCRUTINY_OFFICER",
      action: "FULL_APPLICATION_AUDIT_EXECUTED",
      target_entity: "APPLICATION:AICTE-2024-FRAUD-002",
      details: "Dual-Engine pipeline executed with Z3 theorem solver and OpenCV ELA. Verdict: REJECT_WITH_LEGAL_SHOW_CAUSE."
    },
    {
      id: "LOG-00002",
      timestamp: "2024-06-01 10:22:15 UTC",
      actor_name: "Officer R. K. Saxena",
      role: "AICTE_REGIONAL_DIRECTOR",
      action: "RULE_OVERRIDE_RECORDED",
      target_entity: "CONFLICT:AMBIG-APH-2024-LAND-URBAN",
      details: "Precedence granted to Circular 2024-C1 for dense urban greenfield campuses."
    },
    {
      id: "LOG-00003",
      timestamp: "2024-06-01 10:30:00 UTC",
      actor_name: "AICTE Scrutiny Officer",
      role: "AICTE_SCRUTINY_OFFICER",
      action: "DEFICIENCY_NOTICE_ISSUED",
      target_entity: "APPLICATION:AICTE-2024-FRAUD-002",
      details: "Notice DEF-NOTICE-AICTE-2024-FRAUD-002 dispatched with 15-day statutory rectification window."
    }
  ];

  const NOTICES = [
    {
      id: "DEF-NOTICE-AICTE-2024-FRAUD-002",
      institution: "National Knowledge Institute of Tech & Research",
      deadline: "2024-07-15",
      status: "PENDING_RECTIFICATION",
      deficiencies: [
        "Land holding deficit of 0.40 acres against Urban norm of 2.50 acres.",
        "Expired Fire Safety NOC (expired on 2023-01-09).",
        "Chronological inversion in architect site inspection certificate."
      ]
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Event-Sourced Regulatory Audit Trail</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Legal Audit Ledger & Statutory Notices
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Court-admissible, event-sourced audit log recording every automated verification check, officer override,
              and issued legal notice with cryptographic timestamps.
            </p>
          </div>
        </div>

        {/* Issued Deficiency Notices */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white">Issued Statutory Deficiency Notices</h3>
              <p className="text-xs text-slate-400">Formal legal notices requiring applicant rectification</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              1 Pending Response
            </span>
          </div>

          <div className="space-y-3">
            {NOTICES.map((n) => (
              <div key={n.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-mono text-indigo-400 font-bold">{n.id}</span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{n.institution}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Rectification Deadline:</span>
                    <span className="font-bold text-rose-400 font-mono">{n.deadline}</span>
                  </div>
                </div>

                <div className="space-y-1 text-slate-300">
                  <span className="font-semibold text-slate-400">Cited Statutory Deficiencies:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {n.deficiencies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Event Timeline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-white">Immutable Event-Sourced Log</h3>
            <p className="text-xs text-slate-400">Append-only audit trail capturing all system and human actor events</p>
          </div>

          <div className="space-y-3">
            {LOGS.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-400 font-bold">{log.id}</span>
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {log.role}
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{log.action}</div>
                  <div className="text-slate-400">{log.details}</div>
                </div>

                <div className="font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shrink-0">
                  {log.target_entity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
