"use client";

import { useState } from "react";
import { userSession } from "@/components/layout/Navbar";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";
import { Vault, ArrowUpRight, ArrowDownRight, Activity, Zap, Sparkles, Calculator } from "lucide-react";
import { openContractCall } from '@stacks/connect';
import {
    uintCV,
    PostConditionMode,
} from '@stacks/transactions';
import { toast } from 'react-hot-toast';

export default function Vaults() {
    const {
        balances,
        isLoadingBalances,
        refreshBalances,
        stacksNetwork,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
    } = useWallet();

    const [depositAmountStx, setDepositAmountStx] = useState("");
    const [depositAmountSbtc, setDepositAmountSbtc] = useState("");
    const [isDepositingStx, setIsDepositingStx] = useState(false);
    const [isDepositingSbtc, setIsDepositingSbtc] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isWithdrawingStx, setIsWithdrawingStx] = useState(false);
    const [isWithdrawingSbtc, setIsWithdrawingSbtc] = useState(false);
    const [calcAmount, setCalcAmount] = useState("");

    const avgApy = 0.084;
    const estDaily = (parseFloat(calcAmount) || 0) * (avgApy / 365);
    const estYearly = (parseFloat(calcAmount) || 0) * avgApy;

    // Convenience aliases from shared balances
    const walletStx   = balances.stx;
    const walletSbtc  = balances.sbtc;
    const vaultStx    = balances.vaultStx;
    const vaultSbtc   = balances.vaultSbtc;
    const isLoadingBalance = isLoadingBalances;

    const handleDepositStx = async () => {
        if (!depositAmountStx || isNaN(Number(depositAmountStx))) return;
        setIsDepositingStx(true);

        // Convert input (STX) to standard micro-STX format to pass into Clarity
        const microStxAmount = Math.floor(Number(depositAmountStx) * 1000000);

        if (!userSession.isUserSignedIn()) return;
        const userData = userSession.loadUserData();
        const address = userData.profile.stxAddress?.testnet || userData.profile.stxAddress?.mainnet || (typeof userData.profile.stxAddress === 'string' ? userData.profile.stxAddress : null);

        if (!address) {
            toast.error("Connect your wallet");
            return;
        }

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'deposit-stx',
            functionArgs: [uintCV(microStxAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: {
                name: 'AegisBTC Real Vaults',
                icon: window.location.origin + '/favicon.ico',
            },
            onFinish: data => {
                toast.success(`STX Deposit Broadcasted! TxID: ${data.txId.substring(0, 10)}...`, { duration: 5000, icon: '🚀' });
                setIsDepositingStx(false);
                setDepositAmountStx("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => { setIsDepositingStx(false); }
        });
    };

    const handleDepositSbtc = async () => {
        if (!depositAmountSbtc || isNaN(Number(depositAmountSbtc))) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!userSession.isUserSignedIn()) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            const userData = userSession.loadUserData();
            // Robust address retrieval for different wallet versions
            const address = userData.profile.stxAddress?.mainnet ||
                userData.profile.stxAddress?.testnet ||
                (typeof userData.profile.stxAddress === 'string' ? userData.profile.stxAddress : null);

            if (!address) {
                toast.error("Could not find Stacks address. Please re-sign in.");
                return;
            }

            setIsDepositingSbtc(true);
            const microSbtcAmount = Math.floor(Number(depositAmountSbtc) * 100000000);

            console.log("Initiating sBTC deposit:", { address, amount: microSbtcAmount });

            openContractCall({
                network: stacksNetwork,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'deposit-sbtc',
                functionArgs: [uintCV(microSbtcAmount)],
                postConditionMode: PostConditionMode.Allow,
                appDetails: { name: 'AegisBTC Real Vaults', icon: window.location.origin + '/favicon.ico' },
                onFinish: () => {
                    toast.success(`sBTC Deposit Broadcasted!`, { icon: '🧡' });
                    setIsDepositingSbtc(false);
                    setDepositAmountSbtc("");
                    setTimeout(() => refreshBalances(), 4000);
                },
                onCancel: () => { setIsDepositingSbtc(false); }
            });
        } catch (error: any) {
            console.error("sBTC Deposit Error:", error);
            toast.error(`Error: ${error.message || "Could not initiate transaction"}`);
            setIsDepositingSbtc(false);
        }
    };

    const handleFaucet = async () => {
        setIsMinting(true);
        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'faucet-mock-sbtc',
            functionArgs: [],
            appDetails: { name: 'AegisBTC Faucet', icon: window.location.origin + '/favicon.ico' },
            onFinish: data => {
                toast.success(`Faucet Broadcasted! 1000 Aegis sBTC incoming.`, { duration: 6000, icon: '🎁' });
                setIsMinting(false);
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => { setIsMinting(false); }
        });
    };

    const handleWithdrawStx = async () => {
        if (!depositAmountStx || isNaN(Number(depositAmountStx))) return;
        setIsWithdrawingStx(true);
        const microStxAmount = Math.floor(Number(depositAmountStx) * 1000000);
        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'withdraw-stx',
            functionArgs: [uintCV(microStxAmount)],
            appDetails: { name: 'AegisBTC Real Vaults', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => { toast.success(`STX Withdrawal Broadcasted!`, { icon: '💸' }); setIsWithdrawingStx(false); setDepositAmountStx(""); setTimeout(() => refreshBalances(), 4000); },
            onCancel: () => setIsWithdrawingStx(false)
        });
    };

    const handleWithdrawSbtc = async () => {
        if (!depositAmountSbtc || isNaN(Number(depositAmountSbtc))) return;
        setIsWithdrawingSbtc(true);
        const microSbtcAmount = Math.floor(Number(depositAmountSbtc) * 100000000);
        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'withdraw-sbtc',
            functionArgs: [uintCV(microSbtcAmount)],
            appDetails: { name: 'AegisBTC Real Vaults', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => { toast.success(`sBTC Withdrawal Broadcasted!`, { icon: '💸' }); setIsWithdrawingSbtc(false); setDepositAmountSbtc(""); setTimeout(() => refreshBalances(), 4000); },
            onCancel: () => setIsWithdrawingSbtc(false)
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">sBTC Vaults</h1>
                    <p className="text-surface-400">Lock your sBTC to automatically generate yield through Proof of Transfer.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl border-primary-500/20">
                        <p className="text-sm text-surface-400 mb-1">Total Platform TVL</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                            142.5 sBTC
                        </p>
                    </div>
                    <div className="glass-panel px-6 py-3 rounded-2xl border-accent-500/20">
                        <p className="text-sm text-surface-400 mb-1">Avg. APY</p>
                        <p className="text-2xl font-bold text-accent-400">
                            8.4%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vaults List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* STX Vault */}
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                                    <Vault className="w-7 h-7 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Aegis STX Vault</h2>
                                    <p className="text-primary-400 text-sm font-medium">Auto-compounding STX Yield</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-surface-400 mb-1">Your Staked Balance</p>
                                <p className="text-2xl font-bold text-white">{vaultStx} <span className="text-surface-500 text-lg">STX</span></p>
                            </div>
                        </div>

                        <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-surface-400 text-sm font-medium uppercase tracking-wider">Amount</span>
                                <span className="text-surface-400">Wallet: {isLoadingBalance ? <span className="text-white animate-pulse">Loading...</span> : <span className="text-white font-medium">{walletStx} STX</span>}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={depositAmountStx}
                                    onChange={(e) => setDepositAmountStx(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-4xl font-bold text-white focus:outline-none placeholder:text-surface-700 font-mono"
                                />
                                <button
                                    onClick={() => setDepositAmountStx(walletStx)}
                                    className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-xl text-sm font-medium transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleDepositStx}
                                disabled={isDepositingStx || !depositAmountStx}
                                className="py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-lg box-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDepositingStx ? <Activity className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5" />}
                                {isDepositingStx ? "Depositing..." : "Deposit STX"}
                            </button>
                            <button
                                onClick={handleWithdrawStx}
                                disabled={isWithdrawingStx || !depositAmountStx}
                                className="py-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-lg border border-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isWithdrawingStx ? <Activity className="w-5 h-5 animate-pulse" /> : <ArrowDownRight className="w-5 h-5" />}
                                {isWithdrawingStx ? "Withdrawing..." : "Withdraw"}
                            </button>
                        </div>
                    </div>

                    {/* sBTC Vault */}
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-accent-500/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 blur-[80px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-accent-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-accent-500/30">
                                    <Vault className="w-7 h-7 text-accent-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Aegis sBTC Vault</h2>
                                    <p className="text-accent-400 text-sm font-medium">Decentralized Bitcoin Yield</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-surface-400 mb-1">Your Vault Balance</p>
                                <p className="text-2xl font-bold text-white">{vaultSbtc} <span className="text-surface-500 text-lg">sBTC</span></p>
                            </div>
                        </div>

                        <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-surface-400 text-sm font-medium uppercase tracking-wider">Amount sBTC</span>
                                <span className="text-surface-400">Wallet: {isLoadingBalance ? <span className="text-white animate-pulse">Loading...</span> : <span className="text-white font-medium">{walletSbtc} sBTC</span>}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={depositAmountSbtc}
                                    onChange={(e) => setDepositAmountSbtc(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-4xl font-bold text-white focus:outline-none placeholder:text-surface-700 font-mono"
                                />
                                <button
                                    onClick={() => setDepositAmountSbtc(walletSbtc)}
                                    className="px-4 py-2 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 rounded-xl text-sm font-medium transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleDepositSbtc}
                                disabled={isDepositingSbtc || !depositAmountSbtc}
                                className="py-4 rounded-xl bg-gradient-to-r from-accent-600 to-orange-500 hover:from-accent-500 hover:to-orange-400 text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDepositingSbtc ? <Activity className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5" />}
                                {isDepositingSbtc ? "Depositing..." : "Deposit sBTC"}
                            </button>
                            <button
                                onClick={handleWithdrawSbtc}
                                disabled={isWithdrawingSbtc || !depositAmountSbtc}
                                className="py-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-lg border border-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isWithdrawingSbtc ? <Activity className="w-5 h-5 animate-pulse" /> : <ArrowDownRight className="w-5 h-5" />}
                                {isWithdrawingSbtc ? "Withdrawing..." : "Withdraw"}
                            </button>
                        </div>
                    </div>

                    {/* Aegis Faucet Vault */}
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                                    <Zap className="w-7 h-7 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Aegis Faucet</h2>
                                    <p className="text-primary-400 text-sm font-medium">Get Mock Assets for Testing</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-surface-950/50 border border-white/5 rounded-2xl">
                            <p className="text-surface-400 text-sm leading-relaxed">
                                Need assets to test the vaults? The Aegis Faucet mints <span className="text-white font-bold">1000 Aegis sBTC</span> directly to your testnet wallet instantly.
                            </p>
                        </div>

                        <button
                            onClick={handleFaucet}
                            disabled={isMinting}
                            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-lg box-glow transition-all flex items-center justify-center gap-2"
                        >
                            {isMinting ? <Activity className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isMinting ? "Minting Test Assets..." : "Mint 1000 Aegis sBTC"}
                        </button>
                    </div>
                </motion.div>

                {/* Stats Column */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 rounded-3xl"
                    >
                        <h3 className="text-lg font-semibold text-white mb-6">Vault Strategy</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                                    <ArrowUpRight className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-1">PoX Stacking</h4>
                                    <p className="text-xs text-surface-400 leading-relaxed">Your sBTC is routed to validators participating in Proof of Transfer, earning native STX yield.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-accent-500/10 rounded-lg shrink-0">
                                    <Activity className="w-5 h-5 text-accent-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-1">Auto-Compound</h4>
                                    <p className="text-xs text-surface-400 leading-relaxed">Yield is automatically converted back to sBTC and reinvested twice a day.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-surface-400">Risk Level</span>
                                    <span className="text-primary-400 bg-primary-400/10 px-2 py-1 rounded font-medium">Low</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 rounded-3xl border border-primary-500/20"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Calculator className="w-5 h-5 text-primary-400" />
                            <h3 className="text-lg font-semibold text-white">Yield Calculator</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-surface-400 uppercase tracking-wider font-bold mb-2 block">Investment Amount</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={calcAmount}
                                        onChange={(e) => setCalcAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-surface-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50 transition-colors"
                                    />
                                    <span className="absolute right-4 top-3 text-surface-500 font-bold">sBTC</span>
                                </div>
                            </div>

                            <div className="bg-primary-500/5 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-surface-400">Daily Est.</span>
                                    <span className="text-white font-mono">{estDaily.toFixed(6)} sBTC</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-surface-400">Yearly Est.</span>
                                    <span className="text-primary-400 font-bold font-mono">{estYearly.toFixed(4)} sBTC</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-surface-500 italic">
                                * Estimates based on current average APY of 8.4%. Actual yields may vary.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
