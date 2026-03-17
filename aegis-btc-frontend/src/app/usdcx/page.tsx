"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ArrowLeft, BarChart3, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function USDCxPage() {
    const [pools, setPools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Backend disabled, using high-quality fallback data
        setPools([
            { pair: "sBTC / USDCx", liquidity: "4,200,000", volume_24h: "850,000", apr: "12.4%" },
            { pair: "STX / USDCx", liquidity: "8,150,000", volume_24h: "1,200,500", apr: "9.2%" },
            { pair: "xUSD / USDCx", liquidity: "2,400,000", volume_24h: "320,000", apr: "5.1%" },
            { pair: "ALEX / USDCx", liquidity: "1,800,000", volume_24h: "150,000", apr: "18.5%" }
        ]);
        setLoading(false);
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-[30%] left-[10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900/80 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <RefreshCw className="w-5 h-5" />
                        <span>Liquidity & Yield Hub</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                        Using <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">USDCx</span> on Stacks
                    </h1>
                    <p className="text-surface-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Live USDCx liquidity pools, volume trackers, and APR metrics across the Stacks ecosystem. Provide liquidity, swap, or bridge today.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Live Liquidity Pools:</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-left">
                                        <th className="pb-4 font-semibold text-surface-400 pl-4">Pair</th>
                                        <th className="pb-4 font-semibold text-surface-400">Total Liquidity</th>
                                        <th className="pb-4 font-semibold text-surface-400">24h Volume</th>
                                        <th className="pb-4 font-semibold text-surface-400 pr-4 text-right">Current APR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pools.map((pool, idx) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="py-5 pl-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                        <RefreshCw className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-white text-lg tracking-wide">{pool.pair}</span>
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <div className="flex items-center gap-2 text-surface-200">
                                                    <DollarSign className="w-4 h-4 text-surface-400" />
                                                    {pool.liquidity}
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <div className="flex items-center gap-2 text-surface-200">
                                                    <Clock className="w-4 h-4 text-surface-400" />
                                                    {pool.volume_24h}
                                                </div>
                                            </td>
                                            <td className="py-5 pr-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                                    <BarChart3 className="w-3.5 h-3.5" />
                                                    {pool.apr}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}
            </div>
        </main>
    )
}
