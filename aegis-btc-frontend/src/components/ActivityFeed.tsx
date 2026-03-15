"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, FileCode, ArrowUpRight } from "lucide-react";

const activities = [
    {
        type: "Contract",
        user: "SP2A...4J8",
        message: "Generated a Liquidity Pool contract",
        time: "2m ago",
        icon: FileCode,
        color: "text-amber-400"
    },
    {
        type: "Vault",
        user: "SP1F...9W2",
        message: "Deposited 0.5 sBTC into Shield Vault",
        time: "5m ago",
        icon: Zap,
        color: "text-primary-400"
    },
    {
        type: "Scan",
        user: "SP3G...1K4",
        message: "Audited 'TokenSwap.clar' for vulnerabilities",
        time: "12m ago",
        icon: ShieldCheck,
        color: "text-indigo-400"
    },
    {
        type: "Grant",
        user: "SP4H...7L9",
        message: "Unlocked 'Early Builder' reputation badge",
        time: "15m ago",
        icon: ArrowUpRight,
        color: "text-emerald-400"
    }
];

export default function ActivityFeed() {
    return (
        <section className="py-20 bg-surface-950/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Live Protocol Activity</h2>
                        <p className="text-surface-400 text-lg">Real-time interactions on the Aegis BTC network.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-emerald-400">Network Stable</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:border-white/20 transition-colors"
                        >
                            <div className={`p-2 rounded-lg bg-surface-900 border border-white/5`}>
                                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">
                                    <span className="text-surface-500">{activity.user}</span> {activity.message}
                                </p>
                            </div>
                            <div className="text-xs text-surface-500 whitespace-nowrap">
                                {activity.time}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
