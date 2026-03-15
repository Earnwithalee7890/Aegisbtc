"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const leaders = [
    { rank: 1, address: "SP2A...4J8", score: 980, badges: 12, icon: Trophy, color: "text-amber-400" },
    { rank: 2, address: "SP1F...9W2", score: 945, badges: 10, icon: Medal, color: "text-surface-300" },
    { rank: 3, address: "SP3G...1K4", score: 912, badges: 9, icon: Award, color: "text-amber-700" },
    { rank: 4, address: "SP4H...7L9", score: 885, badges: 8, icon: null, color: "text-surface-500" },
    { rank: 5, address: "SP5J...2M1", score: 870, badges: 7, icon: null, color: "text-surface-500" },
];

export default function Leaderboard() {
    return (
        <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-widest">Rank</th>
                            <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-widest">Builder Address</th>
                            <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-widest text-right">Reputation Score</th>
                            <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-widest text-right">Badges</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leaders.map((leader, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 font-bold text-white">
                                        {leader.icon ? (
                                            <leader.icon className={`w-5 h-5 ${leader.color}`} />
                                        ) : (
                                            <span className="w-5 text-center text-surface-500">{leader.rank}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-surface-300 group-hover:text-white transition-colors">
                                    {leader.address}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-bold text-white">{leader.score}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="px-2 py-1 rounded-md bg-primary-500/10 text-primary-400 text-xs font-bold border border-primary-500/20">
                                        {leader.badges} Badges
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-center text-xs text-surface-500">
                Leaderboard updates every 100 Stacks blocks based on on-chain indexing.
            </p>
        </section>
    );
}
