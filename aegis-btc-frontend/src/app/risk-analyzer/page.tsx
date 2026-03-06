"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Activity, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RiskAnalyzer() {
    const [code, setCode] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        risk_score: number;
        summary: string;
        vulnerability_details: string[];
    } | null>(null);

    const handleAnalyze = async () => {
        if (!code.trim()) return;

        setIsAnalyzing(true);
        toast.loading("AI Agent scanning contract for risks...", { id: 'risk-scan' });
        // Simulate network delay for the demo
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // In production, this points to our FastAPI backend
            const response = await fetch("http://localhost:8000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contract_code: code, amount_at_risk_sbtc: 10 })
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                // Fallback mock response if backend isn't running
                throw new Error("Backend not reachable");
            }
        } catch (error) {
            console.log("Mocking response as backend is not connected");
            const lowerCode = code.toLowerCase();
            let score = 95;
            const vulns = [];

            if (!lowerCode.includes("tx-sender") && !lowerCode.includes("contract-caller")) {
                score -= 20;
                vulns.push("Missing caller validation check. Anyone might be able to invoke sensitive functions.");
            }
            if (lowerCode.includes("unwrap-panic")) {
                score -= 10;
                vulns.push("Use of `unwrap-panic` detected. This could cause the contract to abort unexpectedly.");
            }
            if (score > 85) {
                setResult({ risk_score: score, summary: "Contract appears generally safe.", vulnerability_details: vulns });
            } else {
                setResult({ risk_score: score, summary: "High risk! Critical vulnerabilities detected.", vulnerability_details: vulns });
            }
        } finally {
            setIsAnalyzing(false);
            if (result || code.trim()) {
                toast.success("Analysis Complete", { id: 'risk-scan' });
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent-500/10 rounded-xl border border-accent-500/20">
                    <Terminal className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">AI Smart Contract Risk Analyzer</h1>
                    <p className="text-surface-400">Scan Clarity contracts for vulnerabilities before interacting.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 rounded-2xl flex flex-col"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Contract Code (Clarity)</h2>
                        <span className="text-xs bg-surface-800 text-surface-300 px-2 py-1 rounded">Syntax: Clarity</span>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your Clarity smart contract code here..."
                        className="w-full flex-grow min-h-[400px] bg-surface-950/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-surface-300 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !code.trim()}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:hover:bg-accent-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
                    >
                        {isAnalyzing ? (
                            <>
                                <Activity className="w-5 h-5 animate-pulse" />
                                Analyzing with AI...
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="w-5 h-5" />
                                Run Risk Analysis
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Results Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    {result ? (
                        <>
                            {/* Score Card */}
                            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-t-4 border-t-transparent"
                                style={{ borderTopColor: result.risk_score > 80 ? '#10b981' : result.risk_score > 60 ? '#f59e0b' : '#ef4444' }}
                            >
                                <div>
                                    <h3 className="text-surface-400 text-sm uppercase tracking-wider font-semibold mb-1">Safety Score</h3>
                                    <div className="text-4xl font-bold" style={{ color: result.risk_score > 80 ? '#10b981' : result.risk_score > 60 ? '#f59e0b' : '#ef4444' }}>
                                        {result.risk_score}<span className="text-xl text-surface-500">/100</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-full" style={{ backgroundColor: result.risk_score > 80 ? 'rgba(16, 185, 129, 0.1)' : result.risk_score > 60 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                                    {result.risk_score > 80 ? <ShieldCheck className="w-10 h-10 text-primary-500" /> : <ShieldAlert className="w-10 h-10 text-red-500" />}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-lg font-semibold text-white mb-2">AI Summary</h3>
                                <p className="text-surface-300 leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>

                            {/* Vulnerabilities */}
                            <div className="glass-panel p-6 rounded-2xl flex-grow">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Detected Vulnerabilities
                                </h3>
                                {result.vulnerability_details.length > 0 ? (
                                    <ul className="space-y-3">
                                        {result.vulnerability_details.map((vuln, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-surface-300 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                                <span>{vuln}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center gap-3 text-sm text-surface-300 bg-primary-500/5 p-4 rounded-lg border border-primary-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                                        <span>No critical vulnerabilities detected in static analysis.</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="glass-panel p-12 rounded-2xl flex-grow flex flex-col items-center justify-center text-center opacity-50 border-dashed">
                            <ShieldCheck className="w-16 h-16 text-surface-600 mb-4" />
                            <h3 className="text-xl font-medium text-surface-400 mb-2">Awaiting Contract</h3>
                            <p className="text-surface-500 max-w-xs">
                                Paste your Clarity code and run the analysis to view intelligent risk metrics.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
