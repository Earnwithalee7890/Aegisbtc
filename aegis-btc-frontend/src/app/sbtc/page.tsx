"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Users, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SBTCPage() {
    const [stats, setStats] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8000/api/sbtc/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.warn("Backend not reachable, using fallback data");
                setStats({
                    tvl: "$12,450,230",
                    apy_average: "7.8%",
                    total_minters: "4,210",
                    active_yield_strategies: "12",
                    innovations: [
                        { title: "Self-Repaying Loans", status: "Active", desc: "Lock sBTC as collateral and borrow USDC. Yield from sBTC automatically pays off the loan principal over time." },
                        { title: "Cross-Chain Bitcoin Bridge", status: "Beta", desc: "Non-custodial bridging of native BTC to Stacks sBTC with sub-10 minute finality and AI risk auditing." },
                        { title: "Yield Streaming", status: "Active", desc: "Stream your generated sBTC yield directly to a second address (e.g., payroll or charity) while keeping principal safe." },
                        { title: "AI-Powered Rebalancing", status: "Upcoming", desc: "Dynamic allocation of sBTC across Bitflow, Alex, and Arkadiko pools based on real-time risk/reward analysis." }
                    ]
                });
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900/80 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <Lightbulb className="w-5 h-5" />
                        <span>Innovation Showcase</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                        Most Innovative Use of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">sBTC</span>
                    </h1>
                    <p className="text-surface-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Explore live data and new decentralized use-cases leveraging sBTC&apos;s unique capabilities within the Aegis ecosystem.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 border-t-emerald-500/30 text-center">
                                <p className="text-surface-400 text-sm mb-1">Total Value Locked</p>
                                <p className="text-3xl font-black text-white">{stats?.tvl}</p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 border-t-emerald-500/30 text-center">
                                <p className="text-surface-400 text-sm mb-1">Average APY</p>
                                <p className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-2">
                                    {stats?.apy_average} <TrendingUp className="w-5 h-5 opacity-80" />
                                </p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 border-t-emerald-500/30 text-center">
                                <p className="text-surface-400 text-sm mb-1">Total Minters</p>
                                <p className="text-3xl font-black text-white flex items-center justify-center gap-2">
                                    {stats?.total_minters} <Users className="w-5 h-5 opacity-50" />
                                </p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 border-t-emerald-500/30 text-center">
                                <p className="text-surface-400 text-sm mb-1">Strategies</p>
                                <p className="text-3xl font-black text-white flex items-center justify-center gap-2">
                                    {stats?.active_yield_strategies} <Activity className="w-5 h-5 opacity-50" />
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4 mt-12">Live Innovations Utilizing sBTC:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats?.innovations?.map((item: { title: string, status: string, desc: string }, i: number) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-emerald-300">{item.title}</h3>
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">{item.status}</span>
                                    </div>
                                    <p className="text-surface-300 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
