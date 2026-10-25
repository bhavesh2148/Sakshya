"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Share2,
  Building2,
  FileText,
  UserCheck,
  MapPin,
  Scale,
  AlertTriangle,
  Sparkles,
  Info,
  Search,
  Filter
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: "INSTITUTION" | "DOCUMENT" | "FACULTY" | "LAND_PARCEL" | "REGULATION";
  subtext: string;
  isFlagged?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
  isAnomaly?: boolean;
}

export default function EvidenceGraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  const NODES: GraphNode[] = [
    { id: "INST_1", label: "National Knowledge Institute", type: "INSTITUTION", subtext: "Permanent ID: AICTE-2024-FRAUD-002", isFlagged: true },
    { id: "INST_2", label: "Apex City College of Engg", type: "INSTITUTION", subtext: "Permanent ID: AICTE-2023-APEX-101", isFlagged: true },
    { id: "DOC_1", label: "Land Deed Khasra 991/B", type: "DOCUMENT", subtext: "SHA: e3b0c44298fc...", isFlagged: true },
    { id: "LAND_1", label: "Parcel Khasra 991/B (1.75 Ac)", type: "LAND_PARCEL", subtext: "Survey District: Bengaluru Rural", isFlagged: true },
    { id: "FAC_1", label: "Dr. K. Mehta (Ph.D.)", type: "FACULTY", subtext: "Aadhaar UID: XXXX-8910", isFlagged: true },
    { id: "REG_1", label: "APH 2024 Clause 4.1", type: "REGULATION", subtext: "Min 2.50 Acres Urban Mandate" },
    { id: "REG_2", label: "AICTE Pay Reg 2019", type: "REGULATION", subtext: "Zero Concurrent Faculty Appointment" }
  ];

  const EDGES: GraphEdge[] = [
    { from: "INST_1", to: "DOC_1", relation: "SUBMITTED_AS_PROOF" },
    { from: "DOC_1", to: "LAND_1", relation: "CITES_PARCEL", isAnomaly: true },
    { from: "INST_2", to: "LAND_1", relation: "CONCURRENT_CLAIM", isAnomaly: true },
    { from: "INST_1", to: "FAC_1", relation: "CLAIMS_FULLTIME_PROFESSOR", isAnomaly: true },
    { from: "INST_2", to: "FAC_1", relation: "CLAIMS_FULLTIME_PROFESSOR", isAnomaly: true },
    { from: "LAND_1", to: "REG_1", relation: "GOVERNED_BY" },
    { from: "FAC_1", to: "REG_2", relation: "VIOLATES_REGULATION", isAnomaly: true }
  ];

  const filteredNodes = filterType === "ALL" ? NODES : NODES.filter((n) => n.type === filterType);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>Multi-Hop Entity Linkage & Regulatory Graph</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Evidence Knowledge Graph Explorer
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Neo4j graph representation connecting institutions, shared faculty appointments, duplicate land survey parcels,
              and governing AICTE handbook regulations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-medium"
            >
              <option value="ALL">Show All Entity Nodes</option>
              <option value="INSTITUTION">Institutions Only</option>
              <option value="FACULTY">Faculty Rings Only</option>
              <option value="LAND_PARCEL">Disputed Land Parcels</option>
            </select>
          </div>
        </div>

        {/* Multi-Hop Anomaly Alert Banner */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm text-rose-200">
              Ghost Faculty Ring & Cross-College Land Collision Detected (Multi-Hop Cypher Query)
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The graph traversal algorithm identified two major systemic fraud vectors:
              <br />
              <b>1. Ghost Faculty Ring:</b> <span className="text-rose-400 font-semibold">Dr. K. Mehta</span> is claimed as a full-time Professor at <i>National Knowledge Institute</i> and simultaneously at <i>Apex City College</i>.
              <br />
              <b>2. Disputed Land Parcel:</b> <span className="text-rose-400 font-semibold">Survey No. 991/B</span> is cited as primary ownership proof by both institutions.
            </p>
          </div>
        </div>

        {/* Visual Graph Canvas & Node Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Graph Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <span className="font-bold text-white">Entity Network Topology (Neo4j Cypher Traversal)</span>
              <span className="text-slate-400 font-mono text-[11px]">7 Nodes · 7 Directed Edges</span>
            </div>

            {/* Interactive Node Grid Canvas */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        node.isFlagged
                          ? isSelected
                            ? "border-rose-400 bg-rose-500/20 shadow-xl shadow-rose-500/10 scale-[1.02]"
                            : "border-rose-500/40 bg-rose-950/20 hover:border-rose-400"
                          : isSelected
                          ? "border-indigo-400 bg-indigo-500/20 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          node.type === "INSTITUTION"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : node.type === "FACULTY"
                            ? "bg-purple-500/20 text-purple-300"
                            : node.type === "LAND_PARCEL"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }`}>
                          {node.type}
                        </span>
                        {node.isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                      </div>

                      <div className="font-bold text-sm text-white">{node.label}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{node.subtext}</div>
                    </div>
                  );
                })}
              </div>

              {/* Edge Relationships Legend */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-0.5 bg-rose-500" />
                  <span>Fraudulent Anomaly Relation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-0.5 bg-indigo-500" />
                  <span>Statutory Governance Relation</span>
                </div>
                <span className="text-slate-500 font-mono">Click any node to inspect multi-hop metadata</span>
              </div>
            </div>
          </div>

          {/* Node Detail Inspector Pane (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Entity Multi-Hop Inspector</h3>
              <p className="text-xs text-slate-400">Select any graph entity to view forensic cross-references</p>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-indigo-400">Entity Metadata</div>
                  <div className="text-base font-bold text-white">{selectedNode.label}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{selectedNode.subtext}</div>
                  <div className="text-slate-300 pt-1">
                    Node Category: <span className="font-semibold text-white">{selectedNode.type}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-slate-400 font-semibold text-[11px]">Connected Graph Edges:</div>
                  {EDGES.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                        edge.isAnomaly
                          ? "bg-rose-950/20 border-rose-500/30 text-rose-300"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="font-mono font-bold">{edge.relation}</div>
                      <div className="text-slate-400">
                        {edge.from} ──&gt; {edge.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                Select any node on the left canvas to inspect its multi-hop connections and fraud traces.
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
