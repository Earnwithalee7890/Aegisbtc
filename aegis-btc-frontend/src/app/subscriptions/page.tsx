"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, User, Wallet, Copy, CheckCircle2, RotateCw, Trash2 } from "lucide-react";
import { userSession } from "@/components/layout/Navbar";
import { openContractCall } from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';
import { principalCV, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { toast } from "react-hot-toast";

const CONTRACT_ADDRESS = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";
const CONTRACT_NAME = "aegis-unified-protocol";
const NETWORK = STACKS_MAINNET;

export default function Subscriptions() {
    const [recipient, setRecipient] = useState("");
    const [percentage, setPercentage] = useState("100");
    const [isCopied, setIsCopied] = useState(false);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [activeSub, setActiveSub] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSubscription = async () => {
        if (userSession.isUserSignedIn()) {
            setIsLoading(true);
            try {
                const userData = userSession.loadUserData();
                const address = userData.profile.stxAddress.testnet;

                const res = await fetchCallReadOnlyFunction({
                    network: NETWORK,
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-subscription',
                    functionArgs: [principalCV(address)],
                    senderAddress: address
                });

                const result = cvToJSON(res).value;
                if (result && result.value) {
                    setActiveSub(result.value);
                } else {
                    setActiveSub(null);
                }
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const handleAuthorizeStream = async () => {
        if (!recipient) return;
        setIsAuthorizing(true);

        openContractCall({
            network: NETWORK,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'set-subscription',
            functionArgs: [principalCV(recipient)],
            appDetails: { name: 'AegisBTC Subscriptions', icon: window.location.origin + '/favicon.ico' },
            onFinish: data => {
                toast.success(`Yield Stream Authorized!`, { icon: '🌊' });
                setIsAuthorizing(false);
                setRecipient("");
                setTimeout(fetchSubscription, 5000);
            },
            onCancel: () => setIsAuthorizing(false)
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Yield Payroll & Subscriptions</h1>
                <p className="text-surface-400 max-w-2xl">Use your generated Bitcoin yield to seamlessly pay remote team freelancers (escrowed) or fund recurring SaaS subscriptions, without ever touching your principal Stacks/Bitcoin holding.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Stream Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 rounded-3xl relative overflow-hidden h-fit"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <RotateCw className="w-5 h-5 text-accent-400" />
                        Create Yield Stream / Escrow
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-surface-400 mb-2">Recipient Address (STX/sBTC)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-surface-500" />
                                </div>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-surface-950/50 text-surface-300 placeholder-surface-600 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500/50 transition-all font-mono text-sm"
                                    placeholder="SP..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-400 mb-2">Yield Percentage to Stream</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => setPercentage(e.target.value)}
                                    className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-[var(--accent-500)]"
                                />
                                <span className="text-xl font-bold text-white min-w-[3rem] text-right">{percentage}%</span>
                            </div>
                            <p className="text-xs text-surface-500 mt-2">
                                This percentage of your daily generated yield will be automatically forwarded to the recipient.
                            </p>
                        </div>

                        <button
                            onClick={handleAuthorizeStream}
                            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white font-bold text-lg box-glow-accent transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                            disabled={!recipient || isAuthorizing}
                        >
                            {isAuthorizing ? <RotateCw className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
                            {isAuthorizing ? "Authorizing on Stacks..." : "Authorize Stream"}
                        </button>
                    </div>
                </motion.div>

                {/* Active Streams */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Active Streams</h3>
                        <span className="text-sm px-3 py-1 bg-surface-800 text-surface-300 rounded-full font-medium">Auto-executing on Stacks</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeSub ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary-500/20 bg-primary-500/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-surface-800 rounded-xl relative">
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full animate-ping" />
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full" />
                                        <Wallet className="w-6 h-6 text-surface-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-surface-300">{activeSub.slice(0, 8)}...{activeSub.slice(-4)}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(activeSub);
                                                    setIsCopied(true);
                                                    toast.success("Address copied!");
                                                    setTimeout(() => setIsCopied(false), 2000)
                                                }}
                                                className="text-surface-500 hover:text-white transition-colors"
                                            >
                                                {isCopied ? <CheckCircle2 className="w-4 h-4 text-primary-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="text-xs text-surface-500">Flow rate: <span className="text-accent-400 font-medium">{percentage}% of yield</span></div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-white font-bold">ACTIVE</div>
                                    <div className="text-[10px] text-surface-500 uppercase tracking-tighter">Settling in sBTC</div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 border-white/5"
                            >
                                <div className="p-4 bg-surface-900 rounded-full mb-4">
                                    <RotateCw className="w-8 h-8 text-surface-700" />
                                </div>
                                <h4 className="text-white font-medium mb-1">No Active Streams</h4>
                                <p className="text-surface-500 text-sm">Create your first yield stream above</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Educational Callout */}
                    <div className="mt-4 p-6 bg-accent-500/5 rounded-2xl border border-accent-500/10">
                        <h4 className="text-sm font-semibold text-accent-400 mb-2">How it works</h4>
                        <p className="text-sm text-surface-400 leading-relaxed">
                            Because your sBTC in the Aegis Vault generates yield via Proof of Transfer, you have an endless stream of incoming value. Yield Streaming allows you to assign this incoming value to a third party automatically on-chain—without you spending your underlying assets.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
