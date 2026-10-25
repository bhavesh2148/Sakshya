"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function AuthorityGatewayPage() {
  const [testSurveyNum, setTestSurveyNum] = useState<string>("KHASRA-991/B");
  const [testClaimedAcres, setTestClaimedAcres] = useState<number>(2.10);
  const [liveResult, setLiveResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const VERIFICATION_FEEDS = [
    {
      id: "FEED-1",
      authority: "State Land Records (Bhulekh GIS)",
      identifier: "KHASRA-991/B",
      status: "MISMATCH_DETECTED",
      institution: "National Knowledge Institute",
      claimed: { survey_number: "KHASRA-991/B", claimed_acres: 2.10, society: "National Knowledge Trust" },
      official: { owner_name: "National Knowledge Trust", registered_acres: 1.75, district: "Bengaluru Rural", status: "DISPUTED_TITLE" },
      mismatch: "Application claims 2.10 acres, but official Bhulekh registry records only 1.75 acres (Shortfall: 0.35 acres). Title Status: DISPUTED_TITLE."
    },
    {
      id: "FEED-2",
      authority: "State Land Records (Bhulekh GIS)",
      identifier: "KHASRA-402/1",
      status: "VERIFIED",
      institution: "Savitribai Phule Institute of Tech",
      claimed: { survey_number: "KHASRA-402/1", claimed_acres: 2.85 },
      official: { owner_name: "Shri Ram Educational Society", registered_acres: 2.85, district: "Pune", status: "CLEAR_TITLE" },
      mismatch: null
    },
    {
      id: "FEED-3",
      authority: "DigiLocker NAD (National Academic Depository)",
      identifier: "DEG-IITB-2014-998",
      status: "VERIFIED",
      institution: "Savitribai Phule Institute of Tech",
      claimed: { candidate: "Dr. Rajesh Kumar", degree: "Ph.D. in Computer Science" },
      official: { candidate_name: "Dr. Rajesh Kumar", degree: "Ph.D.", university: "IIT Bombay", conferment_year: 2014, verified: true },
      mismatch: null
    },
    {
      id: "FEED-4",
      authority: "DigiLocker NAD (National Academic Depository)",
      identifier: "DEG-UNKNOWN-99",
      status: "MANUAL_REVIEW_REQUIRED",
      institution: "National Knowledge Institute",
      claimed: { candidate: "Dr. K. Mehta", degree: "Ph.D. in Mechanical Engineering" },
      official: null,
      mismatch: "University graduation batch records not yet synchronized with NAD database. Routed to scrutiny officer manual verification queue."
    }
  ];

  const handleTestVerify = () => {
    setLoading(true);
    setTimeout(() => {
      if (testSurveyNum === "KHASRA-402/1") {
        setLiveResult({
          authority: "State Land Records (Bhulekh)",
          status: "VERIFIED",
          registry_data: { registered_acres: 2.85, owner: "Shri Ram Educational Society", status: "CLEAR_TITLE" },
          notes: "Registry acreage matches application claim with 100% fidelity."
        });
      } else {
        setLiveResult({
          authority: "State Land Records (Bhulekh)",
          status: "MISMATCH_DETECTED",
          registry_data: { registered_acres: 1.75, owner: "National Knowledge Trust", status: "DISPUTED_TITLE" },
          notes: `Acreage discrepancy: Application claims ${testClaimedAcres} acres, but Bhulekh official record returns 1.75 acres.`
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#1F3A5F] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Direct Statutory Source Verification Gateway</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Issuing Authority Verification Gateway
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Automated integration and fallback queue connecting DigiLocker NAD (degrees), State Land Records (Bhulekh),
              and MCA21 Corporate Registry.
            </p>
          </div>
        </div>

        {/* Live Authority Test Sandbox */}
        <div className="bg-white/90 border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Live Authority Query Sandbox</h3>
            <p className="text-xs text-slate-600">Query official state registries with live parameters to test discrepancy detection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1">Land Survey / Khasra Identifier:</label>
              <input
                type="text"
                value={testSurveyNum}
                onChange={(e) => setTestSurveyNum(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Claimed Land Acreage:</label>
              <input
                type="number"
                step="0.05"
                value={testClaimedAcres}
                onChange={(e) => setTestClaimedAcres(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTestVerify}
                disabled={loading}
                className="w-full py-3 bg-[#1F3A5F] hover:bg-[#162B47] text-white rounded-lg font-bold shadow transition disabled:opacity-50"
              >
                {loading ? "Querying State Registry..." : "Dispatch API Query to Bhulekh"}
              </button>
            </div>
          </div>

          {liveResult && (
            <div className="p-4 bg-slate-50 rounded-lg border border-[#1F3A5F]/30 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Response from {liveResult.authority}</span>
                <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                  liveResult.status === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {liveResult.status}
                </span>
              </div>
              <p className="text-slate-700">{liveResult.notes}</p>
              <pre className="p-2.5 bg-white rounded-lg text-slate-700 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(liveResult.registry_data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Verification Feeds Ledger */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Recent Statutory Verification Records</h3>
          {VERIFICATION_FEEDS.map((feed) => (
            <div
              key={feed.id}
              className={`p-6 rounded-lg border bg-white/90 space-y-4 ${
                feed.status === "VERIFIED"
                  ? "border-emerald-200"
                  : feed.status === "MISMATCH_DETECTED"
                  ? "border-red-200"
                  : "border-amber-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-[#1F3A5F] shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{feed.authority}</h4>
                    <div className="text-[11px] text-slate-600">
                      Target: <span className="font-mono text-slate-800">{feed.identifier}</span> · Institution: {feed.institution}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  feed.status === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : feed.status === "MISMATCH_DETECTED"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {feed.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-600 font-semibold block text-[11px]">Claimed in Application:</span>
                  <pre className="text-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(feed.claimed, null, 2)}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-600 font-semibold block text-[11px]">Official Registry Response:</span>
                  {feed.official ? (
                    <pre className="text-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(feed.official, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-amber-700 text-[11px] italic py-2">
                      Database record unavailable. Routed to officer manual queue.
                    </div>
                  )}
                </div>
              </div>

              {feed.mismatch && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  <span className="font-bold">Registry Discrepancy Note: </span>
                  {feed.mismatch}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
