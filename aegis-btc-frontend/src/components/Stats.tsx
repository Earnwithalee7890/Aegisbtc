"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, FileCode, Users } from "lucide-react";

const stats = [
    {
        label: "Total Value Locked",
        value: "$14.2M",
        description: "Across sBTC Vaults",
        icon: Zap,
        color: "text-primary-400",
        bg: "bg-primary-500/10",
        border: "border-primary-500/20"
    },
    {
        label: "Active Builders",
        value: "2,840+",
        description: "Creating on Stacks",
        icon: Users,
        color: "text-accent-400",
        bg: "bg-accent-500/10",
        border: "border-accent-500/20"
    },
    {
        label: "AI Contracts Built",
        value: "18.5K",
        description: "Verified Clarity Code",
        icon: FileCode,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        label: "Avg. Yield APY",
        value: "6.8%",
        description: "Native sBTC Rewards",
        icon: ShieldCheck,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    }
];

export default function Stats() {
    return (
        <section className="py-20 relative overflow-hidden bg-surface-950/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            className={`glass-panel p-6 rounded-2xl border ${stat.border} hover:scale-[1.02] transition-all duration-300 group cursor-default`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-surface-400 font-medium">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-surface-500">{stat.description}</p>
                                <span className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text', 'bg')} animate-pulse`}></span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
