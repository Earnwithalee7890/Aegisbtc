"use client";

import Link from "next/link";
import { ShieldAlert, Github, Twitter, Disc as Discord, ArrowUpRight, Activity, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [devStatus, setDevStatus] = useState<any>(null);
    const [selectedDevItem, setSelectedDevItem] = useState<{ title: string, data: any } | null>(null);

    useEffect(() => {
        // Dev status fetch disabled since it was pointing to localhost:8000
    }, []);

    return (
        <footer className="relative z-10 border-t border-white/5 bg-surface-950/80 backdrop-blur-lg pt-16 pb-8 overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 p-[1px]">
                                <div className="absolute inset-0 bg-primary-500/50 blur-sm group-hover:bg-primary-400/60 transition-colors" />
                                <div className="relative flex items-center justify-center w-full h-full bg-surface-950 rounded-[7px]">
                                    <ShieldAlert className="w-4 h-4 text-primary-400" />
                                </div>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary-100 transition-colors">
                                Aegis<span className="text-primary-500">BTC</span>
                            </span>
                        </Link>
                        <p className="text-surface-400 text-sm leading-relaxed mb-6">
                            The God-Mode DeFi Hub for Bitcoin. Yield streaming, sBTC Vaults, and AI-powered contract auditing built natively on Stacks.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-surface-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Twitter className="w-4 h-4" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-surface-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Github className="w-4 h-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-surface-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Discord className="w-4 h-4" />
                                <span className="sr-only">Discord</span>
                            </a>
                        </div>
                    </div>

                    {/* Core Products */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Products</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/vaults" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    sBTC Vaults
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/borrow" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    sBTC Lending
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/subscriptions" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    Yield Streaming & Payroll
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/reputation" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    On-chain Reputation
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/builder" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    No-Code Builder
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/risk-analyzer" className="text-surface-400 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                                    AI Risk Analyzer
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Developers</h3>
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={(e) => { e.preventDefault(); if (devStatus) setSelectedDevItem({ title: 'Documentation', data: devStatus.documentation }); }}
                                    className="w-full flex justify-between items-center text-surface-400 hover:text-white text-sm transition-colors group cursor-pointer"
                                >
                                    <span>Documentation</span>
                                    {devStatus ? (
                                        <span className="text-[10px] bg-surface-800 text-surface-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {devStatus.documentation.version}
                                        </span>
                                    ) : (
                                        <span className="w-8 h-4 bg-surface-800 rounded animate-pulse" />
                                    )}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => { e.preventDefault(); if (devStatus) setSelectedDevItem({ title: 'Clarity Smart Contracts', data: devStatus.clarity_contracts }); }}
                                    className="w-full flex justify-between items-center text-surface-400 hover:text-white text-sm transition-colors group cursor-pointer"
                                >
                                    <span>Clarity Smart Contracts</span>
                                    {devStatus ? (
                                        <span className="text-[10px] bg-surface-800 text-surface-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3 text-primary-400" /> {devStatus.clarity_contracts.count} {devStatus.clarity_contracts.status}
                                        </span>
                                    ) : (
                                        <span className="w-12 h-4 bg-surface-800 rounded animate-pulse" />
                                    )}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => { e.preventDefault(); if (devStatus) setSelectedDevItem({ title: 'Python API', data: devStatus.python_api }); }}
                                    className="w-full flex justify-between items-center text-surface-400 hover:text-white text-sm transition-colors group cursor-pointer"
                                >
                                    <span>Python API</span>
                                    {devStatus ? (
                                        <span className="text-[10px] bg-surface-800 text-surface-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <Activity className="w-3 h-3 text-accent-400" /> {devStatus.python_api.uptime}
                                        </span>
                                    ) : (
                                        <span className="w-10 h-4 bg-surface-800 rounded animate-pulse" />
                                    )}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => { e.preventDefault(); if (devStatus) setSelectedDevItem({ title: 'Stacks.js UI', data: devStatus.stacks_js }); }}
                                    className="w-full flex justify-between items-center text-surface-400 hover:text-white text-sm transition-colors group cursor-pointer"
                                >
                                    <span className="flex items-center gap-2">
                                        Stacks.js UI
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                            {devStatus ? devStatus.stacks_js.version : 'v1.2'}
                                        </span>
                                    </span>
                                    {devStatus ? (
                                        <span className="text-[10px] text-primary-400 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {devStatus.stacks_js.status}
                                        </span>
                                    ) : (
                                        <span className="w-8 h-4 bg-surface-800 rounded animate-pulse" />
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Ecosystem */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Built For BUIDL Battle</h3>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-surface-900 to-surface-900/50 border border-white/5 inline-block w-full">
                            <p className="text-sm text-surface-300 mb-3">
                                Proudly built for the Stacks ecosystem. Showcasing the power of sBTC, Proof of Transfer, and AI-driven smart contract safety.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-surface-500">
                                <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                Operational on Testnet
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-surface-500 text-sm">
                        © {currentYear} AegisBTC. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Audits</a>
                    </div>
                </div>
            </div>

            {/* Developer Item Modal Overlay */}
            <AnimatePresence>
                {selectedDevItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedDevItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500" />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary-400" />
                                        {selectedDevItem.title}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedDevItem(null)}
                                        className="text-surface-400 hover:text-white p-1 rounded-lg hover:bg-surface-800 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(selectedDevItem.data).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center bg-surface-950/50 p-3 rounded-xl border border-white/5">
                                            <span className="text-surface-400 capitalize text-sm font-medium">
                                                {key.replace('_', ' ')}
                                            </span>
                                            <span className="text-white font-mono text-sm bg-surface-800 px-2 py-1 rounded">
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-surface-800 text-center">
                                    <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                                        Live Backend Data
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}
