"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  FileText,
  Sparkles
} from "lucide-react";

interface TimelineEventNode {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
  doc: string;
  anomaly?: string;
}

export default function TimelineDAGPage() {
  const [activeTab, setActiveTab] = useState<"fraud" | "genuine">("fraud");

  const FRAUD_EVENTS: TimelineEventNode[] = [
    { id: "E1", name: "Society Registration", date: "2019-01-10", type: "STATUTORY", status: "VALID", doc: "Trust_Deed.pdf" },
    { id: "E2", name: "Architect Site Inspection & Carpet Area", date: "2019-03-25", type: "CONSTRUCTION", status: "FLAGGED", doc: "Architect_Cert_Forged.pdf", anomaly: "PARADOX: Inspection dated 5 months BEFORE land was legally purchased!" },
    { id: "E3", name: "Land Title Deed Registration", date: "2019-08-10", type: "LAND_TITLE", status: "FLAGGED", doc: "Land_Deed_Khasra_991B.pdf", anomaly: "Ownership transferred on 2019-08-10. Cannot inspect on 2019-03-25." },
    { id: "E4", name: "Building Plan Sanction Approval", date: "2020-02-14", type: "CONSTRUCTION", status: "VALID", doc: "Building_Approval.pdf" },
    { id: "E5", name: "Fire Safety NOC (Expired)", date: "2021-01-10 to 2023-01-09", type: "STATUTORY_NOC", status: "FLAGGED", doc: "Fire_NOC_2021.pdf", anomaly: "Expired 16 months before portal application submission date." },
    { id: "E6", name: "Appointment of Dr. K. Mehta as Professor", date: "2022-07-01", type: "FACULTY", status: "FLAGGED", doc: "Appointment_Letter.pdf", anomaly: "Appointed to senior cadre 16 months BEFORE Ph.D. was conferred!" },
    { id: "E7", name: "Ph.D. Degree Award for Dr. K. Mehta", date: "2023-11-20", type: "ACADEMIC", status: "FLAGGED", doc: "PhD_Provisional.pdf", anomaly: "Conferred on 2023-11-20. Chronological inversion against appointment." },
    { id: "E8", name: "AICTE Portal Application Submission", date: "2024-06-01", type: "STATUTORY", status: "VALID", doc: "Application_Form.pdf" }
  ];

  const GENUINE_EVENTS: TimelineEventNode[] = [
    { id: "G1", name: "Society Registration", date: "2018-04-12", type: "STATUTORY", status: "VALID", doc: "Society_Reg_Cert.pdf" },
    { id: "G2", name: "Land Title Registration", date: "2019-02-15", type: "LAND_TITLE", status: "VALID", doc: "Land_Title_Deed.pdf" },
    { id: "G3", name: "Municipal Building Plan Sanction", date: "2019-09-20", type: "CONSTRUCTION", status: "VALID", doc: "Building_Sanction.pdf" },
    { id: "G4", name: "Architect Carpet Area Certification", date: "2021-03-10", type: "CONSTRUCTION", status: "VALID", doc: "Architect_Cert.pdf" },
    { id: "G5", name: "Fire Safety NOC Issuance (3 Yrs)", date: "2024-01-10 to 2027-01-09", type: "STATUTORY_NOC", status: "VALID", doc: "Fire_NOC_2024.pdf" },
    { id: "G6", name: "AICTE Portal Application Submission", date: "2024-05-15", type: "STATUTORY", status: "VALID", doc: "AICTE_Application.pdf" }
  ];

  const events = activeTab === "fraud" ? FRAUD_EVENTS : GENUINE_EVENTS;

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#1F3A5F] text-xs font-bold uppercase tracking-wider">
              <GitBranch className="w-4 h-4" />
              <span>Allen's Temporal Interval Algebra & Consistency DAG</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Timeline Impossibility Engine
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Detects retro-dated approvals, physically impossible inspection sequences, and premature senior faculty
              appointments via chronological interval algebra.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab("fraud")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                activeTab === "fraud" ? "bg-red-50 text-red-700 border border-red-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tampered Application DAG (3 Paradoxes)
            </button>
            <button
              onClick={() => setActiveTab("genuine")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                activeTab === "genuine" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Genuine Compliant DAG (0 Anomalies)
            </button>
          </div>
        </div>

        {/* Status Callout */}
        {activeTab === "fraud" ? (
          <div className="p-5 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-red-700">
                CRITICAL CHRONOLOGICAL INVERSION DETECTED (DAG Cycle & Interval Violation)
              </h3>
              <p className="text-slate-700">
                The temporal constraint graph evaluated 8 milestones. <b>Allen's Interval Algebra</b> formally proves that
                architect certification occurred <i>prior</i> to legal land title ownership transfer, and faculty appointment
                preceded the mandatory Ph.D. graduation award.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start space-x-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-emerald-700">
                CHRONOLOGICALLY VALID TIMELINE DAG
              </h3>
              <p className="text-slate-700">
                All statutory sequence constraints adhere strictly to municipal and AICTE legal precedence (Society Reg &le; Land Deed &le; Building Sanction &le; Fire NOC &le; Submission).
              </p>
            </div>
          </div>
        )}

        {/* Visual Timeline Flowchart DAG */}
        <div className="bg-white/90 border border-slate-200 rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs">
            <span className="font-bold text-slate-900">Chronological Directed Acyclic Graph (DAG)</span>
            <span className="font-mono text-slate-600">{events.length} Statutory Milestones Evaluated</span>
          </div>

          <div className="relative space-y-6 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
            {events.map((evt, idx) => {
              const isFlagged = evt.status === "FLAGGED";
              return (
                <div key={evt.id} className="relative flex items-start space-x-6 group">
                  {/* Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 z-10 transition-transform shadow-lg ${
                      isFlagged
                        ? "bg-red-50 text-red-700 border-2 border-red-300 shadow-none scale-105"
                        : "bg-white text-emerald-700 border-2 border-emerald-500 shadow-none"
                    }`}
                  >
                    {isFlagged ? "FAIL" : "OK"}
                  </div>

                  {/* Node Body Card */}
                  <div
                    className={`flex-1 p-5 rounded-lg border transition-all ${
                      isFlagged
                        ? "bg-red-50 border-red-200 shadow-sm"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{evt.name}</span>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-600 mt-0.5">
                          <span className="font-mono text-[#1F3A5F] font-semibold">{evt.date}</span>
                          <span>·</span>
                          <span className="font-mono">{evt.doc}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isFlagged
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    {evt.anomaly && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                        <span className="font-bold">Allen Relation Paradox Proof: </span>
                        <div>{evt.anomaly}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
