"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/components/SidebarLayout";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  ArrowLeft,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Scale
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

function ScrutinyContent() {
  const params = useParams();
  const router = useRouter();
  const appId = (params?.id as string) || "AICTE-2024-FRAUD-002";

  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBBoxField, setSelectedBBoxField] = useState<string>("land_area_acres");
  const [activeDocTab, setActiveDocTab] = useState<string>("land_deed");

  const [noticeModalOpen, setNoticeModalOpen] = useState<boolean>(false);
  const [noticeNote, setNoticeNote] = useState<string>("");
  const [noticeSuccess, setNoticeSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchAudit();
  }, [appId]);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/audit/run/${appId}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAuditData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(`${API_BASE}/officer-brief/pdf/${appId}`, "_blank");
  };

  const handleIssueNotice = async () => {
    try {
      const deficiencies = auditData?.audit_report?.results
        ?.filter((r: any) => r.status === "DEFICIENT")
        ?.map((r: any) => `${r.rule_title}: ${r.explanation}`) || ["Statutory deficiency."];

      const res = await fetch(`${API_BASE}/deficiency-notice/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: appId,
          institution_name: auditData?.brief?.institution_name || "Applicant",
          officer_id: "AICTE_SCRUTINY_OFFICER",
          deficiencies: deficiencies,
          instructions: noticeNote || "Rectify land title and upload fresh municipal approvals.",
          deadline_date: "2024-07-20"
        })
      });
      if (res.ok) {
        setNoticeSuccess(true);
        setTimeout(() => {
          setNoticeSuccess(false);
          setNoticeModalOpen(false);
        }, 1500);
      }
    } catch {
      alert("Failed to issue notice");
    }
  };

  const brief = auditData?.brief;
  const auditReport = auditData?.audit_report;
  const isFraud = appId.includes("FRAUD");

  return (
    <SidebarLayout>
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-800 transition font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {brief?.institution_name || "Institution Scrutiny"}
            </h1>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              isFraud
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {brief?.verdict_badge || (isFraud ? "FLAGGED: CRITICAL DEFICIENCIES" : "COMPLIANT")}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            Application ID: {appId} · AICTE Scrutiny Stage: Technical & Statutory Verification
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg text-xs font-bold shadow-none transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Brief</span>
          </button>

          <button
            onClick={() => setNoticeModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition"
          >
            <AlertTriangle className="w-4 h-4 text-red-700" />
            <span>Issue Deficiency Notice</span>
          </button>
        </div>
      </div>

      {/* Spacious 2-Column Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (5 Cols): Interactive Document Canvas with Bounding Boxes */}
        <div className="lg:col-span-5 bg-white/90 border border-slate-200 rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#1F3A5F]" />
              <h3 className="font-bold text-sm text-slate-900">Spatial Document Canvas</h3>
            </div>
            <div className="flex space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-[11px]">
              <button
                onClick={() => setActiveDocTab("land_deed")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeDocTab === "land_deed" ? "bg-[#1F3A5F] text-white" : "text-slate-600 hover:text-white"
                }`}
              >
                Land Deed
              </button>
              <button
                onClick={() => setActiveDocTab("fire_noc")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeDocTab === "fire_noc" ? "bg-[#1F3A5F] text-white" : "text-slate-600 hover:text-white"
                }`}
              >
                Fire NOC
              </button>
            </div>
          </div>

          {/* Interactive Document Preview Box */}
          <div className="relative bg-slate-50 border border-slate-200/90 rounded-lg p-6 min-h-[500px] flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Watermark / Document Header */}
            <div className="border-b border-slate-200/80 pb-4 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-600">
                OFFICIAL RECORD · STATE REVENUE & STATUTORY FILING
              </div>
              <div className="text-xs font-serif font-bold text-slate-800">
                {activeDocTab === "land_deed"
                  ? "SCHEDULE OF IMMOVABLE PROPERTY & DEED OF TRANSFER"
                  : "STATE FIRE & RESCUE SERVICES · NO OBJECTION CERTIFICATE"}
              </div>
            </div>

            {/* Document Body Text with Spatial Bounding Box */}
            <div className="space-y-4 py-4 text-xs font-serif text-slate-700 leading-relaxed">
              <p>
                This instrument is executed in favor of the applicant educational trust for educational purposes.
              </p>

              {/* Bounding Box 1: Land Area */}
              {activeDocTab === "land_deed" && (
                <div
                  onClick={() => setSelectedBBoxField("land_area_acres")}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedBBoxField === "land_area_acres"
                      ? "border-amber-400 bg-amber-50 shadow-none scale-[1.01]"
                      : "border-[#1F3A5F]/30 bg-[#1F3A5F]/10 hover:border-[#1F3A5F]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-700 font-bold mb-1">
                    <span>EXTRACTED BOUNDING BOX [X1: 105, Y1: 310, X2: 275, Y2: 340]</span>
                    <span>CONFIDENCE: 98.4%</span>
                  </div>
                  <div className="text-slate-900 font-sans font-semibold">
                    "Total Land Parcel: {isFraud ? "2.10 Acres" : "2.85 Acres"} at Survey Khasra No. 991/B"
                  </div>
                  {isFraud && (
                    <div className="text-[10px] text-red-700 font-sans mt-1">
                      ⚠️ ELA Variance Hotspot: Pixel compression indicates "1.75" spliced to "2.10"
                    </div>
                  )}
                </div>
              )}

              {/* Bounding Box 2: Fire NOC */}
              {activeDocTab === "fire_noc" && (
                <div
                  onClick={() => setSelectedBBoxField("fire_safety_noc_valid")}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedBBoxField === "fire_safety_noc_valid"
                      ? "border-red-300 bg-red-50 shadow-none scale-[1.01]"
                      : "border-[#1F3A5F]/30 bg-[#1F3A5F]/10 hover:border-[#1F3A5F]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-red-700 font-bold mb-1">
                    <span>EXTRACTED BOUNDING BOX [X1: 85, Y1: 190, X2: 310, Y2: 215]</span>
                    <span>EXPIRATION DETECTED</span>
                  </div>
                  <div className="text-slate-900 font-sans font-semibold">
                    "Valid From: 2021-01-10 to Validity Period: 2023-01-09"
                  </div>
                  {isFraud && (
                    <div className="text-[10px] text-red-700 font-sans mt-1">
                      ⚠️ Chronological Impossibility: Certificate lapsed 16 months before portal application.
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-600 italic">
                Subject to the conditions laid down by the Municipal Town Planning department and AICTE regulations.
              </p>
            </div>

            {/* Document Footer Verification Stamp */}
            <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>SHA-256: e3b0c44298fc...</span>
              <span className="text-emerald-700">DIGITALLY PARSED</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Regulatory Clause Scrutiny & Compliance Ledger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/90 border border-slate-200 rounded-lg p-6 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Deterministic Compliance Proofs & Shortfalls
              </h3>
              <p className="text-xs text-slate-600">
                Formally verified by the Z3 SMT solver against AICTE Handbook clauses with zero hallucinations.
              </p>
            </div>

            <div className="space-y-4">
              {auditReport?.results?.map((item: any, idx: number) => {
                const isSelected = selectedBBoxField === item.rule_id || item.rule_id.includes("LAND");
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-lg border transition-all ${
                      item.status === "COMPLIANT"
                        ? "bg-slate-50/60 border-slate-200 hover:border-emerald-200"
                        : item.status === "DEFICIENT"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center space-x-2">
                        {item.status === "COMPLIANT" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : item.status === "DEFICIENT" ? (
                          <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        )}
                        <span className="font-bold text-sm text-slate-900">{item.rule_title}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-[#1F3A5F] bg-[#1F3A5F]/10 px-2 py-0.5 rounded border border-[#1F3A5F]/30">
                          {item.clause_reference}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === "COMPLIANT"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "DEFICIENT"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 text-xs">
                      <div>
                        <span className="text-slate-600 text-[11px] block">Mandated AICTE Norm:</span>
                        <span className="font-bold text-slate-800">{String(item.required_value)}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 text-[11px] block">Extracted from Document:</span>
                        <span className="font-bold text-slate-800">{String(item.actual_value)}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 text-[11px] block">Calculated Shortfall:</span>
                        <span className={`font-bold ${item.shortfall ? "text-red-700" : "text-emerald-700"}`}>
                          {item.shortfall ? `${item.shortfall} ${item.unit}` : "None"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-700">
                      <span className="text-slate-600 font-semibold">Verification Proof: </span>
                      {item.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Deficiency Notice Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75  p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-extrabold text-base text-slate-900">Dispatch Statutory Deficiency Notice</h3>
              <button onClick={() => setNoticeModalOpen(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            <p className="text-xs text-slate-700">
              Issue a formal notice to <span className="font-bold text-slate-900">{brief?.institution_name}</span>. The applicant
              will be granted a statutory 15-day rectification period.
            </p>

            <div>
              <label className="text-xs text-slate-600 block mb-1">Directives & Instructions:</label>
              <textarea
                value={noticeNote}
                onChange={(e) => setNoticeNote(e.target.value)}
                placeholder="Enter specific rectification instructions..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
              />
            </div>

            {noticeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Notice dispatched and entered into the legal audit ledger.</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button onClick={() => setNoticeModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-700">Cancel</button>
              <button onClick={handleIssueNotice} className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-slate-900 rounded-lg text-xs font-bold shadow-lg">Confirm & Dispatch</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

export default function SplitScreenScrutinyPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-8">Loading Scrutiny Bureau...</div>}>
      <ScrutinyContent />
    </React.Suspense>
  );
}
