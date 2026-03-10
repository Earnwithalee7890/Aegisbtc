"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CircleDashed, Rocket, Wallet, Shield, Coins, Trophy, Lightbulb, RefreshCw, BookOpen } from "lucide-react";
import { userSession } from "@/components/layout/Navbar";
import { toast } from "react-hot-toast";

export default function TasksPage() {
    const [points, setPoints] = useState(0);
    const [tasks, setTasks] = useState([
        {
            id: 'connect_wallet',
            title: "Connect Stacks Wallet",
            description: "Link your Leather or Xverse wallet to the AegisBTC protocol.",
            points: 100,
            icon: Wallet,
            completed: false,
            verifying: false
        },
        {
            id: 'deposit_sbtc',
            title: "Deposit sBTC into Vault",
            description: "Interact with the smart contract to deposit Testnet sBTC collateral.",
            points: 250,
            icon: Shield,
            completed: false,
            verifying: false
        },
        {
            id: 'borrow_usdcx',
            title: "Borrow Stablecoin (USDCx)",
            description: "Take out a self-paying loan against your Stacks Bitcoin.",
            points: 500,
            icon: Coins,
            completed: false,
            verifying: false
        },
        {
            id: 'innovative_sbtc',
            title: "Most Innovative Use of sBTC",
            description: "Interact with advanced sBTC features using Aegis protocols to demonstrate novel use-cases.",
            points: 1000,
            icon: Lightbulb,
            completed: false,
            verifying: false
        },
        {
            id: 'usdcx_stacks',
            title: "Using USDCx on Stacks",
            description: "Bridge, swap, or provide liquidity with the USDCx stablecoin on Stacks.",
            points: 750,
            icon: RefreshCw,
            completed: false,
            verifying: false
        },
        {
            id: 'intro_x402',
            title: "Intro to x402 on Stacks",
            description: "Complete the introductory module for x402 token standards and smart contracts.",
            points: 600,
            icon: BookOpen,
            completed: false,
            verifying: false
        }
    ]);

    // Fast mock check if wallet is connected
    useEffect(() => {
        if (userSession.isUserSignedIn() && !tasks[0].completed) {
            setTasks(prev => prev.map(t => t.id === 'connect_wallet' ? { ...t, completed: true } : t));
            setPoints(prev => prev + 100);
        }
    }, []);

    const verifyTask = async (id: string, index: number) => {
        // Set verifying state
        setTasks(prev => {
            const newTasks = [...prev];
            newTasks[index].verifying = true;
            return newTasks;
        });

        // Genuine on-chain Stacks Testnet Validation via Hiro API
        try {
            if (id === 'connect_wallet') {
                if (!userSession.isUserSignedIn()) {
                    toast.error("Connect your wallet first!", { icon: '🔐' });
                    throw new Error("Wallet not connected");
                }
            } else {
                if (!userSession.isUserSignedIn()) {
                    toast.error("Wallet required for verification.");
                    throw new Error("Wallet not connected");
                }

                const userData = userSession.loadUserData();
                const address = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

                // Fetch the user's latest transactions from the Stacks Mainnet Node
                const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/transactions?limit=20`);
                const data = await res.json();
                const transactions = data.results || [];

                const aegisContractBase = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT"; // the core deployer matching our app
                let isTaskConfirmedOnChain = false;

                // Scan through real transactions to find matching contract interactions
                if (transactions.length > 0) {
                    for (const tx of transactions) {
                        if (tx.tx_status === "success" && tx.tx_type === "contract_call") {
                            const contract_id = tx.contract_call.contract_id;
                            const function_name = tx.contract_call.function_name;

                            // Make sure they are calling OUR Aegis protocols
                            if (contract_id.includes(aegisContractBase)) {
                                if (id === 'deposit_sbtc' && function_name === 'deposit-sbtc') {
                                    isTaskConfirmedOnChain = true;
                                } else if (id === 'borrow_usdcx' && function_name === 'borrow-usdcx') {
                                    isTaskConfirmedOnChain = true;
                                } else if (id === 'usdcx_stacks' && (function_name === 'deposit-stx' || function_name === 'repay-usdcx')) {
                                    isTaskConfirmedOnChain = true;
                                }
                            }
                        }
                    }
                }

                if (!isTaskConfirmedOnChain) {
                    toast.error("No on-chain activity found yet. Keep building!", {
                        duration: 5000,
                        id: `verify-fail-${id}`
                    });
                    throw new Error("No on-chain validation");
                }
            }

            // If we didn't throw an error, it passed genuine validation!
            setTasks(prev => {
                const newTasks = [...prev];
                newTasks[index].verifying = false;
                if (!newTasks[index].completed) {
                    newTasks[index].completed = true;
                    setPoints(p => p + newTasks[index].points);
                    toast.success(`Quest Completed! +${newTasks[index].points} PTS`, {
                        icon: '🏆',
                        duration: 4000
                    });
                }
                return newTasks;
            });

        } catch (error) {
            // Revert loading state on failure
            setTasks(prev => {
                const newTasks = [...prev];
                newTasks[index].verifying = false;
                return newTasks;
            });
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[10%] w-[25rem] h-[25rem] bg-accent-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-900/80 border border-primary-500/30 text-primary-400 text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                        <Rocket className="w-5 h-5 text-accent-400" />
                        <span className="tracking-wide uppercase text-xs">Buidl Battle Interactive Quests</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                        Ecosystem<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400"> Quests</span>
                    </h1>
                    <p className="text-surface-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Complete on-chain interactions on the Stacks network to earn Aegis points, build your decentralized reputation, and qualify for protocol rewards.
                    </p>
                </motion.div>

                {/* Scoreboard Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 glass-panel rounded-3xl p-6 bg-gradient-to-br from-surface-900/80 to-surface-950 flex flex-col md:flex-row items-center justify-between border border-white/5"
                >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center p-[1px] shadow-lg shadow-primary-500/20">
                            <div className="w-full h-full bg-surface-950 rounded-[15px] flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-primary-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Aegis Points</h2>
                            <p className="text-surface-400 text-sm">Convertible to Protocol Tokens at Mainnet launch</p>
                        </div>
                    </div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        {points.toLocaleString()}
                    </div>
                </motion.div>

                {/* Task List */}
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className={`glass-panel rounded-2xl p-5 border ${task.completed ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/5 hover:border-white/10'} transition-all`}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 sm:mt-0 p-3 rounded-xl flex-shrink-0 ${task.completed ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-800 text-surface-400'}`}>
                                        <task.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                            {task.title}
                                            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">
                                                +{task.points} PTS
                                            </span>
                                        </h3>
                                        <p className="text-surface-400 text-sm">{task.description}</p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex-shrink-0">
                                    <button
                                        onClick={() => verifyTask(task.id, index)}
                                        disabled={task.completed || task.verifying}
                                        className={`w-full sm:w-32 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${task.completed
                                            ? 'bg-primary-500/20 text-primary-400 cursor-not-allowed border border-primary-500/30'
                                            : task.verifying
                                                ? 'bg-surface-700 text-surface-300 cursor-wait'
                                                : 'bg-white/10 hover:bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                            }`}
                                    >
                                        {task.completed ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" /> Verified
                                            </>
                                        ) : task.verifying ? (
                                            <>
                                                <div className="w-4 h-4 rounded-full border-2 border-surface-400 border-t-white animate-spin" /> Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <CircleDashed className="w-4 h-4" /> Check Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
