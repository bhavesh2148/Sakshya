"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Cpu,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function RulesMatrixPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [overrideModalOpen, setOverrideModalOpen] = useState<boolean>(false);
  const [activeConflict, setActiveConflict] = useState<any>(null);
  const [winningRuleSelection, setWinningRuleSelection] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState<string>("");

  useEffect(() => {
    loadRulesAndConflicts();
  }, []);

  const loadRulesAndConflicts = async () => {
    setLoading(true);
    try {
      const [resRules, resConf] = await Promise.all([
        fetch(`${API_BASE}/rules`),
        fetch(`${API_BASE}/rules/conflicts`)
      ]);
      if (resRules.ok) setRules(await resRules.json());
      if (resConf.ok) setConflicts(await resConf.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOverride = async () => {
    if (!activeConflict || !winningRuleSelection) return;
    try {
      const res = await fetch(`${API_BASE}/rules/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conflict_id: activeConflict.conflict_id,
          winning_rule_id: winningRuleSelection,
          admin_officer_id: "AICTE_REGIONAL_DIRECTOR",
          justification_note: overrideReason || "Authorized regulatory circular precedence override."
        })
      });
      if (res.ok) {
        setOverrideModalOpen(false);
        await loadRulesAndConflicts();
      }
    } catch {
      alert("Override failed");
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#1F3A5F] text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Microsoft Research Z3 SMT Theorem Prover</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rule Conflict & Contradiction Matrix
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Formally converts AICTE Approval Process Handbook (APH) clauses and supplementary circulars into
              Satisfiability Modulo Theories (SMT) assertions to mathematically detect contradictory or overlapping constraints.
            </p>
          </div>
        </div>

        {/* Conflict Detection Banner */}
        {conflicts.map((conf) => (
          <div
            key={conf.conflict_id}
            className="p-6 rounded-lg bg-amber-50 border border-amber-200 space-y-4 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-3">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-amber-700">
                    Regulatory Ambiguity Flagged: {conf.conflict_id}
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Category: {conf.category} · Conflict Class: {conf.conflict_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {conf.override_active ? "OVERRIDE RECORDED" : "AWAITING ADMIN OVERRIDE"}
                </span>

                <button
                  onClick={() => {
                    setActiveConflict(conf);
                    setWinningRuleSelection(conf.rule_b_id);
                    setOverrideModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg text-xs font-bold shadow transition"
                >
                  Configure Precedence Override
                </button>
              </div>
            </div>

            <p className="text-slate-700 text-xs leading-relaxed">{conf.explanation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#1F3A5F]">Statutory Handbook Clause A:</span>
                <div className="font-mono text-slate-900 text-xs">{conf.rule_a_id}</div>
                <div className="text-slate-600 text-[11px]">{conf.rule_a_clause}</div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#1F3A5F]">Supplementary Circular B:</span>
                <div className="font-mono text-slate-900 text-xs">{conf.rule_b_id}</div>
                <div className="text-slate-600 text-[11px]">{conf.rule_b_clause}</div>
              </div>
            </div>

            {conf.counterexample_model && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold">Z3 Mathematical Counterexample: </span>
                  At institutional parameter value <span className="font-mono font-bold text-slate-900">{conf.counterexample_model.counterexample_value} Acres</span>, an application satisfies Circular B but violates Handbook Rule A.
                  The system halts automated rejection until an officer records an explicit administrative override.
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Active AICTE Regulatory Rules Table */}
        <div className="bg-white/90 border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Active Regulatory Rule Matrix</h3>
            <p className="text-xs text-slate-600">Formal logic representations evaluated across all applicant institutions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Rule Identifier</th>
                  <th className="pb-3 font-semibold">Statutory Category</th>
                  <th className="pb-3 font-semibold">Mandated SMT Predicate</th>
                  <th className="pb-3 font-semibold">Handbook Citation</th>
                  <th className="pb-3 font-semibold text-right">Solver Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-700">
                {rules.map((r) => (
                  <tr key={r.rule_id} className="hover:bg-slate-100/30 transition-colors">
                    <td className="py-4 font-mono text-[#1F3A5F] font-bold">{r.rule_id}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-slate-800">
                      {r.variable_name} {r.operator} {JSON.stringify(r.target_value)}
                    </td>
                    <td className="py-4 text-[11px] text-slate-600">
                      {r.source.document_name} [{r.source.clause_reference}]
                    </td>
                    <td className="py-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                        SATISFIABLE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Override Modal */}
      {overrideModalOpen && activeConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75  p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Record Regulatory Precedence Override</h3>
              <button onClick={() => setOverrideModalOpen(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            <p className="text-xs text-slate-700">
              Select which rule takes statutory precedence for conflict <span className="font-mono text-[#1F3A5F] font-bold">{activeConflict.conflict_id}</span>:
            </p>

            <div className="space-y-3 text-xs">
              <label className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="winning"
                  value={activeConflict.rule_b_id}
                  checked={winningRuleSelection === activeConflict.rule_b_id}
                  onChange={(e) => setWinningRuleSelection(e.target.value)}
                  className="text-indigo-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Supplementary Circular (1.80 Acres relaxed)</span>
                  <span className="text-slate-600 font-mono text-[11px]">{activeConflict.rule_b_id}</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="winning"
                  value={activeConflict.rule_a_id}
                  checked={winningRuleSelection === activeConflict.rule_a_id}
                  onChange={(e) => setWinningRuleSelection(e.target.value)}
                  className="text-indigo-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Approval Process Handbook (2.50 Acres standard)</span>
                  <span className="text-slate-600 font-mono text-[11px]">{activeConflict.rule_a_id}</span>
                </div>
              </label>

              <div>
                <label className="text-slate-600 block mb-1">Administrative Justification Note:</label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Circular precedence approved pursuant to AICTE Notification..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button onClick={() => setOverrideModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-700">Cancel</button>
              <button onClick={handleApplyOverride} className="px-5 py-2 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg text-xs font-bold shadow-lg">Record Precedence</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
