"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, CheckCircle, CircleDashed } from "lucide-react";
import Link from "next/link";

import { toast } from "react-hot-toast";

export default function X402Page() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completedModules, setCompletedModules] = useState<number[]>([]);
    const [activeModule, setActiveModule] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8000/api/x402/modules")
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.warn("Backend not reachable, using fallback x402 modules");
                setData({
                    description: "Next-gen authentication and verifiable compute standard on Stacks.",
                    standard_version: "v1.0-RC",
                    modules: [
                        { name: "Basic Token Standards", reward: 100 },
                        { name: "ZK State Verification", reward: 250 },
                        { name: "x402 Full Integration", reward: 500 }
                    ]
                });
                setLoading(false);
            });
    }, []);

    const handleStartModule = (index: number) => {
        if (completedModules.includes(index)) {
            toast.success("Module already completed!");
            return;
        }

        setActiveModule(index);
        toast.loading(`Starting ${data.modules[index].name}...`, { id: 'module' });

        // Simulate learning progress
        setTimeout(() => {
            setCompletedModules(prev => [...prev, index]);
            setActiveModule(null);
            toast.success(`${data.modules[index].name} Completed! \n+${data.modules[index].reward} PTS earned.`, {
                id: 'module',
                duration: 5000,
                icon: '🎓'
            });
        }, 2000);
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-[20%] right-[30%] w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900/80 border border-purple-500/30 text-purple-400 text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <BookOpen className="w-5 h-5" />
                        <span>Interactive Learning Module</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                        Intro to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">x402</span> on Stacks
                    </h1>
                    <p className="text-surface-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Complete these modules to master the integration of x402 token standards and earn Aegis points for your decentralized reputation.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-2xl mb-8 flex justify-between items-center text-left">
                            <div>
                                <h3 className="text-white font-bold opacity-80 uppercase tracking-widest text-xs mb-1">Standard Info</h3>
                                <p className="text-surface-400 text-sm">{data?.description}</p>
                            </div>
                            <div className="px-4 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                {data?.standard_version}
                            </div>
                        </div>

                        {data?.modules.map((moduleItem: any, i: number) => {
                            const isCompleted = completedModules.includes(i);
                            const isActive = activeModule === i;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={`glass-panel p-6 rounded-2xl flex items-center justify-between group transition-all ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border transition-colors ${isCompleted ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface-800 border-white/5 text-surface-400'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : i + 1}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-1 transition-colors ${isCompleted ? 'text-green-400' : 'text-white group-hover:text-purple-300'}`}>
                                                {moduleItem.name}
                                            </h3>
                                            <p className="text-surface-400 text-sm">Reward: <strong className="text-purple-400">+{moduleItem.reward} PTS</strong></p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleStartModule(i)}
                                        disabled={isActive}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold ${isCompleted
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                                : isActive
                                                    ? 'bg-purple-600 text-white animate-pulse cursor-wait'
                                                    : 'bg-white text-surface-950 hover:bg-surface-200 shadow-lg'
                                            }`}
                                    >
                                        {isActive ? (
                                            <>
                                                <CircleDashed className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : isCompleted ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Done
                                            </>
                                        ) : (
                                            "Start Module"
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
