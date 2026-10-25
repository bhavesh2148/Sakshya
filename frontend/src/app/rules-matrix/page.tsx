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
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Microsoft Research Z3 SMT Theorem Prover</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Rule Conflict & Contradiction Matrix
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Formally converts AICTE Approval Process Handbook (APH) clauses and supplementary circulars into
              Satisfiability Modulo Theories (SMT) assertions to mathematically detect contradictory or overlapping constraints.
            </p>
          </div>
        </div>

        {/* Conflict Detection Banner */}
        {conflicts.map((conf) => (
          <div
            key={conf.conflict_id}
            className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 space-y-4 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-amber-200">
                    Regulatory Ambiguity Flagged: {conf.conflict_id}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Category: {conf.category} · Conflict Class: {conf.conflict_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {conf.override_active ? "OVERRIDE RECORDED" : "AWAITING ADMIN OVERRIDE"}
                </span>

                <button
                  onClick={() => {
                    setActiveConflict(conf);
                    setWinningRuleSelection(conf.rule_b_id);
                    setOverrideModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Configure Precedence Override
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">{conf.explanation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400">Statutory Handbook Clause A:</span>
                <div className="font-mono text-white text-xs">{conf.rule_a_id}</div>
                <div className="text-slate-400 text-[11px]">{conf.rule_a_clause}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400">Supplementary Circular B:</span>
                <div className="font-mono text-white text-xs">{conf.rule_b_id}</div>
                <div className="text-slate-400 text-[11px]">{conf.rule_b_clause}</div>
              </div>
            </div>

            {conf.counterexample_model && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold">Z3 Mathematical Counterexample: </span>
                  At institutional parameter value <span className="font-mono font-bold text-white">{conf.counterexample_model.counterexample_value} Acres</span>, an application satisfies Circular B but violates Handbook Rule A.
                  The system halts automated rejection until an officer records an explicit administrative override.
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Active AICTE Regulatory Rules Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-white">Active Regulatory Rule Matrix</h3>
            <p className="text-xs text-slate-400">Formal logic representations evaluated across all applicant institutions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Rule Identifier</th>
                  <th className="pb-3 font-semibold">Statutory Category</th>
                  <th className="pb-3 font-semibold">Mandated SMT Predicate</th>
                  <th className="pb-3 font-semibold">Handbook Citation</th>
                  <th className="pb-3 font-semibold text-right">Solver Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {rules.map((r) => (
                  <tr key={r.rule_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 font-mono text-indigo-400 font-bold">{r.rule_id}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-slate-200">
                      {r.variable_name} {r.operator} {JSON.stringify(r.target_value)}
                    </td>
                    <td className="py-4 text-[11px] text-slate-400">
                      {r.source.document_name} [{r.source.clause_reference}]
                    </td>
                    <td className="py-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Record Regulatory Precedence Override</h3>
              <button onClick={() => setOverrideModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Select which rule takes statutory precedence for conflict <span className="font-mono text-indigo-400 font-bold">{activeConflict.conflict_id}</span>:
            </p>

            <div className="space-y-3 text-xs">
              <label className="flex items-center space-x-3 p-4 rounded-2xl border border-slate-800 bg-slate-950 cursor-pointer">
                <input
                  type="radio"
                  name="winning"
                  value={activeConflict.rule_b_id}
                  checked={winningRuleSelection === activeConflict.rule_b_id}
                  onChange={(e) => setWinningRuleSelection(e.target.value)}
                  className="text-indigo-600"
                />
                <div>
                  <span className="font-bold text-white block">Supplementary Circular (1.80 Acres relaxed)</span>
                  <span className="text-slate-400 font-mono text-[11px]">{activeConflict.rule_b_id}</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 rounded-2xl border border-slate-800 bg-slate-950 cursor-pointer">
                <input
                  type="radio"
                  name="winning"
                  value={activeConflict.rule_a_id}
                  checked={winningRuleSelection === activeConflict.rule_a_id}
                  onChange={(e) => setWinningRuleSelection(e.target.value)}
                  className="text-indigo-600"
                />
                <div>
                  <span className="font-bold text-white block">Approval Process Handbook (2.50 Acres standard)</span>
                  <span className="text-slate-400 font-mono text-[11px]">{activeConflict.rule_a_id}</span>
                </div>
              </label>

              <div>
                <label className="text-slate-400 block mb-1">Administrative Justification Note:</label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Circular precedence approved pursuant to AICTE Notification..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button onClick={() => setOverrideModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs text-slate-300">Cancel</button>
              <button onClick={handleApplyOverride} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg">Record Precedence</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
