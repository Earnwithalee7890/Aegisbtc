"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "What is sBTC?",
        answer: "sBTC is a 1:1 Bitcoin-backed asset on the Stacks layer, allowing you to use your Bitcoin in DeFi, smart contracts, and more while keeping it secured by the Bitcoin network."
    },
    {
        question: "How does the AI Risk Analyzer work?",
        answer: "Our AI model is trained specifically on Clarity smart contracts. It scans your code for common vulnerabilities like reentrancy, unhandled overflows, and logic flaws before you deploy."
    },
    {
        question: "Is Aegis BTC non-custodial?",
        answer: "Yes, Aegis is fully non-custodial. You maintain control of your private keys via Stacks-compatible wallets like Leather or Xverse."
    },
    {
        question: "How do self-repaying loans work?",
        answer: "When you deposit sBTC, it generates yield through Stacking. This yield is automatically used to pay back any USDCx you've borrowed, eventually clearing your debt automatically."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-surface-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-surface-400">Everything you need to know about the Aegis protocol.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass-panel rounded-2xl border border-white/5 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-semibold text-white">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="w-5 h-5 text-primary-400" />
                                ) : (
                                    <Plus className="w-5 h-5 text-surface-500" />
                                )}
                            </button>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="px-6 pb-6"
                                >
                                    <p className="text-surface-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
