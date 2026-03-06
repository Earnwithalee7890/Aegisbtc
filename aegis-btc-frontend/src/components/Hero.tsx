"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Zap, Lightbulb, RefreshCw, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-screen flex flex-col items-center justify-center">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
            >
                <motion.div variants={item} className="mb-8 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-primary-300">
                            sBTC Protocol v1.0 Live on Stacks Testnet
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    variants={item}
                    className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 text-white max-w-4xl mx-auto leading-[1.1]"
                >
                    Bitcoin Yield, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-500 to-primary-600">
                        Intelligently Secured.
                    </span>
                </motion.h1>

                <motion.p
                    variants={item}
                    className="max-w-2xl mx-auto text-lg sm:text-xl text-surface-300 mb-12"
                >
                    Deposit sBTC, route yield to subscriptions without losing principal, and let our AI risk analyzer audit your smart contracts in real-time.
                </motion.p>

                <motion.div
                    variants={item}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/vaults" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-primary-600 rounded-xl overflow-hidden box-glow hover:bg-primary-500 transition-all duration-300">
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12" />
                        Launch App
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link href="/risk-analyzer" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white/80 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all duration-300">
                        Use AI Risk Analyzer
                        <ShieldCheck className="ml-2 w-5 h-5 opacity-70" />
                    </Link>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    variants={item}
                    className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left"
                >
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full group-hover:bg-primary-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 border border-primary-500/20">
                            <Zap className="w-6 h-6 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">1-Click sBTC Yield</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Automatically route your sBTC to the highest-yielding Stacks DeFi pools natively with zero complexity.
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-3xl rounded-full group-hover:bg-accent-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mb-4 border border-accent-500/20">
                            <Activity className="w-6 h-6 text-accent-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Yield Payroll</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Pay remote freelancers or recurring subscriptions using only your generated yield. Keep your principal Bitcoin safe.
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full group-hover:bg-primary-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 border border-primary-500/20">
                            <ShieldCheck className="w-6 h-6 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Bitcoin Lending Protocol</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Lock your sBTC as collateral to instantly borrow stablecoins like USDCx and generate self-repaying debt.
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-3xl rounded-full group-hover:bg-accent-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mb-4 border border-accent-500/20">
                            <Activity className="w-6 h-6 text-accent-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">DeFi Reputation</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Build your decentralized credit score natively on Stacks using your transaction and PoX Stacking history.
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20">
                            <Activity className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No-Code Clarity Builder</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Use our visual UI to automatically generate complex, verified Clarity contracts, no deep knowledge required!
                        </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group flex-grow lg:flex-grow-0 hover:border-indigo-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">AI Contract Audits</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Our bespoke AI backend automatically scans your target Clarity contracts for critical security vulnerabilities.
                        </p>
                    </div>

                    <Link href="/sbtc" className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors block cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                            <Lightbulb className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">Most Innovative Use of sBTC</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Interact with advanced sBTC features using Aegis protocols to demonstrate novel decentralized use-cases.
                        </p>
                    </Link>

                    <Link href="/usdcx" className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors block cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                            <RefreshCw className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Using USDCx on Stacks</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Bridge, swap, or provide liquidity natively with the USDCx stablecoin across the Stacks ecosystem.
                        </p>
                    </Link>

                    <Link href="/x402" className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-colors block cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors" />
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                            <BookOpen className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Intro to x402 on Stacks</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Complete the introductory module for integrating x402 token standards and next-gen smart contracts.
                        </p>
                    </Link>
                </motion.div>

                {/* Judge's Deep Dive - Criteria Alignment */}
                <motion.div
                    variants={item}
                    className="mt-32 pt-20 border-t border-white/5 text-left"
                >
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">The Aegis Blueprint: Built for Stacks</h2>
                        <p className="text-surface-400 max-w-2xl text-lg">A technical breakdown of how Aegis leverages the Stacks ecosystem to redefine Bitcoin DeFi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="p-4 bg-orange-500/10 rounded-2xl h-fit border border-orange-500/20">
                                    <Lightbulb className="w-6 h-6 text-primary-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-xl">Innovation & AI Intelligence</h4>
                                    <p className="text-surface-400 leading-relaxed text-sm">
                                        Unlike static dashboards, Aegis features a bespoke **AI Risk Analyzer** that performs real-time static analysis on Clarity code. It detects missing validation, "unwrap-panic" risks, and logic errors, protecting users from "Black Swan" events.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="p-4 bg-primary-500/10 rounded-2xl h-fit border border-primary-500/20">
                                    <Zap className="w-6 h-6 text-primary-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-xl">Stacks & sBTC Alignment</h4>
                                    <p className="text-surface-400 leading-relaxed text-sm">
                                        We leverage **sBTC** as the primary collateral for self-repaying loans. By utilizing **Proof of Transfer (PoX)** yield, Aegis automatically pays down USDCx debt without users ever needing to sell their Bitcoin principal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl h-fit border border-indigo-500/20">
                                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-xl">Technical Depth & Security</h4>
                                    <p className="text-surface-400 leading-relaxed text-sm">
                                        Our **No-Code Clarity Builder** simplifies decentralized development. Under the hood, we use **Stacks.js v8** and custom Clarity 2.0 traits to ensure that generated contracts are strictly audited and standard-compliant.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="p-4 bg-blue-500/10 rounded-2xl h-fit border border-blue-500/20">
                                    <Activity className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-xl">USDCx Ecosystem Integration</h4>
                                    <p className="text-surface-400 leading-relaxed text-sm">
                                        Aegis is deeply integrated with the **USDCx** stablecoin on Stacks, providing 1-click swaps via decentralized exchanges and liquidity monitoring for a unified DeFi experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
