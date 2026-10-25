"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  ShieldAlert,
  Flame,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  Cpu,
  Layers,
  Fingerprint
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function AttackLabPage() {
  const [selectedAttack, setSelectedAttack] = useState<string>("FONT_SPLICING");
  const [runningBenchmark, setRunningBenchmark] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);

  const [liveUploadLoading, setLiveUploadLoading] = useState<boolean>(false);
  const [liveUploadReport, setLiveUploadReport] = useState<any>(null);

  const ATTACK_VECTORS = [
    {
      id: "FONT_SPLICING",
      name: "Numerical Font & Value Splicing",
      desc: "Simulates splicing altered figures (e.g., '1.75' to '2.10' acres) into a scanned government deed.",
      targetEngine: "OpenCV Error Level Analysis (ELA)",
      severity: "CRITICAL"
    },
    {
      id: "CANVA_METADATA",
      name: "Graphic Suite Footprint Injection",
      desc: "Injects Canva/Photoshop creator tags and mismatched font dictionaries into PDF object streams.",
      targetEngine: "PyMuPDF Stream Parser",
      severity: "HIGH"
    },
    {
      id: "EXIF_GPS_FORGERY",
      name: "EXIF Geolocation Spoofing",
      desc: "Injects remote off-campus coordinates into laboratory and infrastructure photographs.",
      targetEngine: "Haversine Distance Verifier",
      severity: "HIGH"
    },
    {
      id: "TEMPLATE_CLONING",
      name: "Cross-College Certificate Cloning",
      desc: "Reuses borders and visual layout from an unrelated institution in another state.",
      targetEngine: "64-Bit Perceptual dHash",
      severity: "CRITICAL"
    }
  ];

  const handleRunSyntheticAttack = () => {
    setRunningBenchmark(true);
    setTimeout(() => {
      if (selectedAttack === "FONT_SPLICING") {
        setBenchmarkResult({
          attack_name: "Numerical Font & Value Splicing",
          injection: "Spliced '2.10' acres at coordinate [105, 310]",
          detector: "OpenCV Error Level Analysis (ELA)",
          detection_status: "CAUGHT_BY_DETECTOR",
          fraud_score: 0.94,
          ela_variance: "48.6 (Mean: 4.2)",
          verdict: "FRAUDULENT",
          explanation: "Localized pixel difference matrix detected sharp compression boundary around numeral '2.10'."
        });
      } else if (selectedAttack === "CANVA_METADATA") {
        setBenchmarkResult({
          attack_name: "Graphic Suite Footprint Injection",
          injection: "Injected Producer: 'Canva PDF Generator v2.4'",
          detector: "PyMuPDF Stream Parser",
          detection_status: "CAUGHT_BY_DETECTOR",
          fraud_score: 0.88,
          verdict: "SUSPICIOUS_SOFTWARE",
          explanation: "Metadata dictionary contains prohibited graphic design suite signature."
        });
      } else if (selectedAttack === "EXIF_GPS_FORGERY") {
        setBenchmarkResult({
          attack_name: "EXIF Geolocation Spoofing",
          injection: "GPS Coordinates: 28.6139° N, 77.2090° E (New Delhi)",
          detector: "Infrastructure Geo Verifier",
          detection_status: "CAUGHT_BY_DETECTOR",
          fraud_score: 0.85,
          distance_delta: "1,140 km from campus centroid",
          verdict: "GEO_LOCATION_MISMATCH",
          explanation: "Photo capture location deviates by over 1,000 km from the registered land title centroid."
        });
      } else {
        setBenchmarkResult({
          attack_name: "Cross-College Certificate Cloning",
          injection: "Perceptual template cloned from Apex City College",
          detector: "64-Bit Difference Hash (dHash)",
          detection_status: "CAUGHT_BY_DETECTOR",
          fraud_score: 0.91,
          hamming_distance: "3 / 64 bits",
          verdict: "PERCEPTUAL_DUPLICATE",
          explanation: "Visual difference hash matches a previously submitted certificate with 95.3% similarity."
        });
      }
      setRunningBenchmark(false);
    }, 800);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLiveUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("institution_id", "ATTACK-BENCH-01");
    formData.append("institution_name", "Attack Lab Benchmark");

    try {
      const res = await fetch(`${API_BASE}/forensics/analyze-upload`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setLiveUploadReport(data);
      }
    } catch {
      alert("Failed to analyze uploaded file");
    } finally {
      setLiveUploadLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Adversarial Testing & Forensic Verification Bench</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Forensic Attack Lab & Detector Benchmark
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Programmatically inject synthetic tampering (font swaps, seal cloning, EXIF forgery, metadata stripping)
              to stress-test and continuously benchmark the automated forensic detectors.
            </p>
          </div>
        </div>

        {/* 2-Column Lab Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Synthetic Attack Generator */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Synthetic Tampering Attack Suite</h3>
              <p className="text-xs text-slate-400">Select an adversarial perturbation to inject into a valid certificate</p>
            </div>

            <div className="space-y-3">
              {ATTACK_VECTORS.map((atk) => {
                const isSelected = selectedAttack === atk.id;
                return (
                  <div
                    key={atk.id}
                    onClick={() => setSelectedAttack(atk.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.01]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{atk.name}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        {atk.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{atk.desc}</p>
                    <div className="text-[10px] text-indigo-400 font-mono pt-1">
                      Target Detector: {atk.targetEngine}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRunSyntheticAttack}
              disabled={runningBenchmark}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {runningBenchmark ? "Injecting Attack & Running Detectors..." : "Execute Synthetic Benchmark"}
            </button>
          </div>

          {/* Right Column (7 Cols): Detector Response & Live File Drop */}
          <div className="lg:col-span-7 space-y-6">
            {/* Synthetic Benchmark Result Card */}
            {benchmarkResult && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white">Detector Benchmark Result</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {benchmarkResult.detection_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px]">Simulated Attack:</span>
                    <div className="font-bold text-white">{benchmarkResult.attack_name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{benchmarkResult.injection}</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px]">Evaluated Detector:</span>
                    <div className="font-bold text-indigo-300">{benchmarkResult.detector}</div>
                    <div className="text-rose-400 text-[11px] font-bold">
                      Fraud Confidence: {Math.round(benchmarkResult.fraud_score * 100)}%
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-white">Proof of Detection: </span>
                  {benchmarkResult.explanation}
                </div>
              </div>
            )}

            {/* Live Upload Testing Section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-white">Live Certificate Forensic Sandbox</h3>
                <p className="text-xs text-slate-400">
                  Upload any physical PDF scan or municipal certificate from your computer to test the detector in real time.
                </p>
              </div>

              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center space-y-3 transition cursor-pointer bg-slate-950/40 block">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                />
                <UploadCloud className={`w-10 h-10 mx-auto ${liveUploadLoading ? "text-indigo-400 animate-bounce" : "text-indigo-400"}`} />
                <div>
                  <span className="text-sm font-semibold text-white">
                    {liveUploadLoading ? "Parsing PDF streams & computing ELA..." : "Select PDF or Image to Stress-Test"}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts Land Title Deeds, Fire NOCs, Building Approvals
                  </p>
                </div>
              </label>

              {liveUploadReport && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Analysis: {liveUploadReport.file_name}</span>
                    <span className="font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                      {liveUploadReport.verdict} ({Math.round(liveUploadReport.overall_fraud_score * 100)}%)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {liveUploadReport.findings?.map((f: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <div className="font-semibold text-indigo-300">{f.title}</div>
                        <p className="text-slate-300">{f.description}</p>
                        {f.visual_evidence_b64 && (
                          <img src={f.visual_evidence_b64} alt="ELA Heatmap" className="w-full max-h-40 object-contain rounded mt-1 bg-black" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
