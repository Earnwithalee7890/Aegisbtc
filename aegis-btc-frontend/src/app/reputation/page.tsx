"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ShieldAlert, History, Activity, Trophy, Award, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { userSession } from "@/components/layout/Navbar";
import { STACKS_MAINNET } from '@stacks/network';
import { principalCV, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import Leaderboard from "@/components/Leaderboard";

const CONTRACT_ADDRESS = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";
const CONTRACT_NAME = "aegis-unified-protocol";
const NETWORK = STACKS_MAINNET;

export default function Reputation() {
    const [score, setScore] = useState(500);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getDynamicScore = async () => {
            if (userSession.isUserSignedIn()) {
                setIsLoading(true);
                try {
                    const userData = userSession.loadUserData();
                    const profile = userData.profile as any;
                    const address = profile?.stxAddress?.mainnet || profile?.stxAddress?.testnet || profile?.stxAddress || "";
                    
                    if (!address) {
                        setIsLoading(false);
                        return;
                    }

                    let stxVal = 0;
                    let sbtcVal = 0;

                    try {
                        const stxRes = await fetchCallReadOnlyFunction({
                            network: NETWORK,
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: CONTRACT_NAME,
                            functionName: 'get-stx-balance',
                            functionArgs: [principalCV(address)],
                            senderAddress: address
                        });
                        const resJson = cvToJSON(stxRes);
                        const raw = resJson?.value?.value || resJson?.value || "0";
                        stxVal = parseInt(String(raw)) / 1000000;
                    } catch (e) {
                         console.warn("Reputation: stx-balance fetch skipped", e);
                    }

                    try {
                        const sbtcRes = await fetchCallReadOnlyFunction({
                            network: NETWORK,
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: CONTRACT_NAME,
                            functionName: 'get-sbtc-balance',
                            functionArgs: [principalCV(address)],
                            senderAddress: address
                        });
                        const resJson = cvToJSON(sbtcRes);
                        const raw = resJson?.value?.value || resJson?.value || "0";
                        sbtcVal = parseInt(String(raw)) / 100000000;
                    } catch (e) {
                        console.warn("Reputation: sbtc-balance fetch skipped", e);
                    }

                    // Base score 500 + pts for activity
                    let newScore = 500;
                    if (stxVal > 0) newScore += 150;
                    if (sbtcVal > 0) newScore += 200;
                    if (stxVal > 100 || sbtcVal > 1) newScore += 100;

                    setScore(newScore);
                } catch (e) {
                    console.error("Critical error in reputation calculation:", e);
                }
                setIsLoading(false);
            }
        };
        getDynamicScore();
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 800) return 'text-primary-400 bg-primary-400/10 border-primary-500/20';
        if (score >= 650) return 'text-primary-400 bg-primary-400/10 border-primary-500/20';
        if (score >= 500) return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
        return 'text-red-400 bg-red-400/10 border-red-500/20';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">DeFi Reputation</h1>
                    <p className="text-surface-400 max-w-2xl">On-chain credit scoring explicitly built for the Stacks ecosystem. Prove your trustworthiness using your transaction and PoX Stacking history.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Score UI */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-1 glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <h3 className="text-surface-400 uppercase tracking-widest text-xs font-bold mb-6">Your Aegis Score</h3>

                    <div className="relative w-48 h-48 mb-8 flex justify-center items-center">
                        {/* Fake SVG donut chart */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="96" cy="96" r="80"
                                className="text-surface-800 stroke-current"
                                strokeWidth="12" fill="transparent"
                            />
                            <circle
                                cx="96" cy="96" r="80"
                                className="text-primary-500 stroke-current transition-all duration-1000"
                                strokeWidth="12" fill="transparent"
                                strokeDasharray="502"
                                strokeDashoffset={502 - (502 * (score / 1000))}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white glow-text">{score}</span>
                            <span className="text-primary-400 text-sm font-semibold mt-1">
                                {score >= 800 ? "Excellent" : score >= 650 ? "Very Good" : score >= 500 ? "Good" : "Probation"}
                            </span>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getScoreColor(score)}`}>
                        <BadgeCheck className="w-4 h-4" />
                        <span className="text-sm font-bold">{score >= 650 ? "Eligible for Undercollateralized Loans" : "Standard Tier"}</span>
                    </div>
                </motion.div>

                {/* Data Points */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 flex flex-col gap-6"
                >
                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary-500/20 bg-primary-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-500/20 rounded-xl">
                                <History className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Stacks PoX History</h4>
                                <p className="text-sm text-surface-400">Consistent Stacking/Yield generation over 6+ cycles.</p>
                            </div>
                        </div>
                        <div className="text-primary-400 font-bold text-xl">+450 pts</div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-accent-500/20 bg-accent-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-accent-500/20 rounded-xl">
                                <Activity className="w-6 h-6 text-accent-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Repayment History</h4>
                                <p className="text-sm text-surface-400">0 liquidations on Aegis, Bitflow, or Zest accounts.</p>
                            </div>
                        </div>
                        <div className="text-accent-400 font-bold text-xl">+300 pts</div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary-500/20 bg-primary-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-500/20 rounded-xl">
                                <Trophy className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">On-chain Governance</h4>
                                <p className="text-sm text-surface-400">Voted in 4 major Stacks ecosystem proposals.</p>
                            </div>
                        </div>
                        <div className="text-primary-400 font-bold text-xl">+75 pts</div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-red-500/20 bg-red-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <ShieldAlert className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">High Degen Ratio</h4>
                                <p className="text-sm text-surface-400">Frequent interaction with high-risk/unverified smart contracts.</p>
                            </div>
                        </div>
                        <div className="text-red-400 font-bold text-xl">-25 pts</div>
                    </div>
                </motion.div>
            </div>

            {/* Trust Badges Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-primary-400" />
                    <h2 className="text-2xl font-bold text-white">Trust Badges</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { 
                            name: "Early Adopter", 
                            icon: <Zap className="w-6 h-6" />, 
                            description: "Identified as a pioneer in the Aegis ecosystem.", 
                            unlocked: true,
                            color: "text-amber-400 bg-amber-400/10 border-amber-500/20"
                        },
                        { 
                            name: "Stacks Guardian", 
                            icon: <ShieldCheck className="w-6 h-6" />, 
                            description: "Maintaining high security standards and STX balance.", 
                            unlocked: score >= 650,
                            color: "text-primary-400 bg-primary-400/10 border-primary-500/20"
                        },
                        { 
                            name: "Yield Master", 
                            icon: <Activity className="w-6 h-6" />, 
                            description: "Active participant in multiple sBTC vault strategies.", 
                            unlocked: score >= 500,
                            color: "text-accent-400 bg-accent-400/10 border-accent-500/20"
                        },
                        { 
                            name: "DAO Voter", 
                            icon: <Trophy className="w-6 h-6" />, 
                            description: "Engaged in on-chain governance and Stacks ecosystem votes.", 
                            unlocked: score >= 800,
                            color: "text-purple-400 bg-purple-400/10 border-purple-500/20"
                        }
                    ].map((badge, idx) => (
                        <div 
                            key={idx}
                            className={`glass-panel p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${badge.unlocked ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'}`}
                        >
                            <div className={`p-4 rounded-full mb-4 border ${badge.color}`}>
                                {badge.icon}
                            </div>
                            <h4 className="text-white font-bold mb-2">{badge.name}</h4>
                            <p className="text-xs text-surface-400 line-clamp-2">{badge.description}</p>
                            {!badge.unlocked && (
                                <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-surface-500">
                                    Locked
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
            <Leaderboard />
        </div>
    );
}
