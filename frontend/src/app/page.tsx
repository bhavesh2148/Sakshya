"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Layers,
  FileCheck2,
  AlertTriangle,
  Building2,
  ArrowRight,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Download,
  Filter
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function CommandCenterPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newAppForm, setNewAppForm] = useState({
    institution_id: "AICTE-2024-ENGG-003",
    institution_name: "Aryabhata Institute of Engineering & Technology",
    land_area_acres: 2.8,
    built_up_area_sqm: 13500,
    total_faculty: 85,
    location_type: "URBAN"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApp = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppForm)
      });
      if (res.ok) {
        setCreateModalOpen(false);
        await loadData();
      }
    } catch {
      alert("Failed to ingest application");
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution_id.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "FRAUD") return matchesSearch && app.institution_id.includes("FRAUD");
    if (statusFilter === "COMPLIANT") return matchesSearch && !app.institution_id.includes("FRAUD");
    return matchesSearch;
  });

  return (
    <SidebarLayout>
      {/* Hero Welcome & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#1F3A5F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>National Approval & Fraud Verification Bureau</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Scrutiny Command Center
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            AICTE explainable decision-support portal executing deterministic regulatory proofs via Z3 SMT solver
            coupled with non-deterministic computer vision & multi-layer document forensics.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg text-xs font-bold shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest New Application</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Spacious Executive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-lg bg-white/80 border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Applications In Queue</span>
            <Building2 className="w-4 h-4 text-[#1F3A5F]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{applications.length}</div>
          <div className="text-[11px] text-slate-600 flex items-center space-x-1">
            <span className="text-emerald-700 font-semibold">100%</span>
            <span>Intake checklists populated</span>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white/80 border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Critical Tampering Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-3xl font-extrabold text-red-700">1 Case</div>
          <div className="text-[11px] text-slate-600">
            ELA pixel splicing & inverted timeline
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white/80 border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Compliant Institutions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">1 Verified</div>
          <div className="text-[11px] text-slate-600">
            Zero shortfall across land & cadre norms
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white/80 border border-slate-200/80 space-y-2 hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Active Circular Conflicts</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">1 Contradiction</div>
          <div className="text-[11px] text-slate-600">
            Z3 theorem prover flagged APH vs Circular
          </div>
        </div>
      </div>

      {/* Applications Directory with Search & Filters */}
      <div className="bg-white/80 border border-slate-200/80 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900">Institutional Applications Directory</h2>
            <p className="text-xs text-slate-600">
              Select an institution to launch the deep split-screen document review and evidence graph analysis.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search college or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#1F3A5F] w-64 transition"
              />
            </div>

            {/* Filter Toggle */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#1F3A5F] font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="FRAUD">Fraud Flagged Only</option>
              <option value="COMPLIANT">Fully Compliant</option>
            </select>
          </div>
        </div>

        {/* Directory Table with Generous Padding */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Permanent AICTE ID</th>
                <th className="pb-3 font-semibold">Institution Name</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Land Holding</th>
                <th className="pb-3 font-semibold">Faculty Cadre</th>
                <th className="pb-3 font-semibold">Intake Checklist</th>
                <th className="pb-3 font-semibold text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-700">
              {filteredApps.map((app) => {
                const isFraud = app.institution_id.includes("FRAUD");
                return (
                  <tr key={app.institution_id} className="hover:bg-slate-100/30 transition-colors group">
                    <td className="py-4.5 font-mono text-[#1F3A5F] font-semibold">
                      {app.institution_id}
                    </td>
                    <td className="py-4.5">
                      <div className="font-bold text-slate-900 text-sm">{app.institution_name}</div>
                      <div className="text-[11px] text-slate-600">{app.program} · Enrolment: {app.enrolment}</div>
                    </td>
                    <td className="py-4.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-300/60 font-medium text-[11px]">
                        {app.location_type}
                      </span>
                    </td>
                    <td className="py-4.5 font-mono">
                      <span className={app.land_acres < 2.5 ? "text-amber-700 font-bold" : "text-slate-800"}>
                        {app.land_acres} Acres
                      </span>
                    </td>
                    <td className="py-4.5 font-mono text-slate-700">
                      {app.faculty_count} Members
                    </td>
                    <td className="py-4.5">
                      {app.missing_mandatory_documents && app.missing_mandatory_documents.length > 0 ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Missing {app.missing_mandatory_documents.length} Docs</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete (5/5)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 text-right">
                      <Link
                        href={`/scrutiny/${app.institution_id}`}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                          isFraud
                            ? "bg-red-50 hover:bg-red-50 text-red-700 border border-red-200"
                            : "bg-[#1F3A5F] hover:bg-[#162B47] text-white"
                        }`}
                      >
                        <span>{isFraud ? "Deep-Dive Scrutiny" : "Audit Review"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingest Application Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75  p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Ingest Institutional Application</h3>
                <p className="text-xs text-slate-600">Intake module creates profile & triggers Dual-Engine audit</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-600 hover:text-slate-900 text-base">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">AICTE Permanent ID:</label>
                <input
                  type="text"
                  value={newAppForm.institution_id}
                  onChange={(e) => setNewAppForm({ ...newAppForm, institution_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Institution Name:</label>
                <input
                  type="text"
                  value={newAppForm.institution_name}
                  onChange={(e) => setNewAppForm({ ...newAppForm, institution_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Land Area (Acres):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAppForm.land_area_acres}
                    onChange={(e) => setNewAppForm({ ...newAppForm, land_area_acres: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Total Faculty:</label>
                  <input
                    type="number"
                    value={newAppForm.total_faculty}
                    onChange={(e) => setNewAppForm({ ...newAppForm, total_faculty: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-700 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateApp}
                className="px-5 py-2.5 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg text-xs font-bold shadow-lg"
              >
                Confirm & Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
