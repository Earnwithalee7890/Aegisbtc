"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandCoins, ArrowDownUp, ShieldCheck, Zap, Activity } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { toast } from 'react-hot-toast';

export default function Borrow() {
    const {
        balances,
        isLoadingBalances,
        refreshBalances,
        stacksNetwork,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        isContractMissing,
    } = useWallet();

    const walletSbtc  = balances.sbtc;
    const walletUsdcx = balances.usdcx;
    const vaultSbtc   = balances.vaultSbtc;
    const vaultStx    = balances.vaultStx;

    const [borrowAmount, setBorrowAmount] = useState("");
    const [repayAmount, setRepayAmount]   = useState("");
    const sBtcPrice = 65000;
    const stxPrice  = 2.5;

    const [isBorrowing, setIsBorrowing] = useState(false);
    const [isRepaying, setIsRepaying] = useState(false);

    // Max Borrow based on ON-CHAIN deposits (80% LTV)
    const maxBorrow = (Number(vaultSbtc) * sBtcPrice + Number(vaultStx) * stxPrice) * 0.8;

    const handleContractCheck = () => {
        if (isContractMissing) {
            toast.error("Protocol not deployed on Mainnet. Please switch to Testnet in the Navbar to use Borrow/Repay.", {
                duration: 6000,
                icon: '⚠️'
            });
            return true;
        }
        return false;
    };

    const handleBorrow = async () => {
        if (handleContractCheck()) return;
        if (!borrowAmount || isNaN(Number(borrowAmount))) return;
        setIsBorrowing(true);
        const microUsdcxAmount = Math.floor(Number(borrowAmount) * 1000000);

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'borrow-usdcx',
            functionArgs: [uintCV(microUsdcxAmount)],
            appDetails: { name: 'AegisBTC Real Borrow', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`USDCx Borrow Broadcasted!`, { icon: '💰' });
                setIsBorrowing(false);
                setBorrowAmount("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsBorrowing(false)
        });
    };

    const handleRepay = async () => {
        if (handleContractCheck()) return;
        if (!repayAmount || isNaN(Number(repayAmount))) return;
        setIsRepaying(true);
        const microUsdcxAmount = Math.floor(Number(repayAmount) * 1000000);

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'repay-usdcx',
            functionArgs: [uintCV(microUsdcxAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'AegisBTC Real Borrow', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`Repayment Broadcasted!`, { icon: '🤝' });
                setIsRepaying(false);
                setRepayAmount("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsRepaying(false)
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Bitcoin-Backed Lending</h1>
                    <p className="text-surface-400 max-w-2xl">Lock your sBTC as collateral and borrow USDCx instantly. Your collateral continues to generate yield via PoX, paying down your loan automatically!</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl border-primary-500/20">
                        <p className="text-sm text-surface-400 mb-1">Current Borrow APY</p>
                        <p className="text-2xl font-bold text-primary-400">3.2%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Borrow Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <HandCoins className="w-6 h-6 text-primary-400" />
                        Manage USDCx Loan
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-surface-400 font-medium tracking-wide">DEPOSITED COLLATERAL</span>
                                <span className="text-surface-400">Total Value: <span className="text-white font-mono">${(Number(vaultSbtc) * sBtcPrice + Number(vaultStx) * stxPrice).toFixed(0)}</span></span>
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between items-center p-3 bg-surface-900 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs text-white font-bold">B</div>
                                        <span className="text-white font-medium">sBTC Vault</span>
                                    </div>
                                    <span className="text-white font-mono font-bold">{vaultSbtc} sBTC</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-surface-900 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs text-white font-bold">S</div>
                                        <span className="text-white font-medium">STX Vault</span>
                                    </div>
                                    <span className="text-white font-mono font-bold">{vaultStx} STX</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center -my-2 relative z-10">
                            <div className="p-3 glass-panel rounded-full border border-white/10 shadow-xl">
                                <ArrowDownUp className="w-5 h-5 text-primary-400" />
                            </div>
                        </div>

                        <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-surface-400 font-medium">Borrow Amount (USDCx)</span>
                                <span className="text-surface-400">Borrow Limit: <span className="text-primary-400">${Math.floor(maxBorrow || 0).toLocaleString()}</span></span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={borrowAmount}
                                    onChange={(e) => setBorrowAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none placeholder:text-surface-700"
                                />
                                <button
                                    onClick={() => setBorrowAmount(Math.floor(maxBorrow).toString())}
                                    className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-xl text-sm font-medium transition-colors"
                                >
                                    MAX
                                </button>
                                <div className="px-4 py-2 bg-surface-800 rounded-xl text-white font-medium shrink-0">
                                    USDCx
                                </div>
                            </div>
                        </div>

                        {/* Repay Input */}
                        <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-surface-400 font-medium">Repay Amount (USDCx)</span>
                                <span className="text-surface-400">Wallet: {walletUsdcx} USDCx</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={repayAmount}
                                    onChange={(e) => setRepayAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none placeholder:text-surface-700"
                                />
                                <button
                                    onClick={() => setRepayAmount(walletUsdcx)}
                                    className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    MAX
                                </button>
                                <div className="px-4 py-2 bg-surface-800 rounded-xl text-white font-medium shrink-0">
                                    USDCx
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button
                                onClick={handleBorrow}
                                disabled={isBorrowing || !borrowAmount || Number(borrowAmount) <= 0}
                                className="py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {isBorrowing ? <Activity className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5" />}
                                {isBorrowing ? "Borrowing..." : "Borrow USDCx"}
                            </button>
                            <button
                                onClick={handleRepay}
                                disabled={isRepaying || !repayAmount || Number(repayAmount) <= 0}
                                className="py-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-lg border border-white/5 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {isRepaying ? <Activity className="w-5 h-5 animate-pulse" /> : <ArrowDownUp className="w-5 h-5" />}
                                {isRepaying ? "Repaying..." : "Repay USDCx"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Loan Stats & Liquidation Logic */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-6">Self-Repaying Loan Logic</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between p-4 bg-surface-800/50 rounded-xl border border-white/5">
                                <span className="text-surface-400">Collateral Yield (PoX)</span>
                                <span className="text-green-400 font-medium">~7.5% APY</span>
                            </div>
                            <div className="flex justify-between p-4 bg-surface-800/50 rounded-xl border border-white/5">
                                <span className="text-surface-400">Borrow Rate</span>
                                <span className="text-red-400 font-medium">3.2% APY</span>
                            </div>
                            <div className="flex justify-between p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
                                <span className="text-primary-400 font-semibold">Net Auto-Repayment</span>
                                <span className="text-primary-400 font-bold">+4.3% APY</span>
                            </div>

                            <p className="text-xs text-surface-500 leading-relaxed mt-4 italic">
                                * Aegis automatically harvests yield from the Stacks Proof-of-Transfer (PoX) cycle. This yield is swapped for USDCx on Bitflow and credited to your loan balance every 24 hours, effectively making your debt self-liquidating while you hold Bitcoin.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex-grow">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary-400" />
                            Liquidation Protection
                        </h3>
                        <p className="text-surface-400 text-sm leading-relaxed mb-4">
                            Our Clarity smart contracts utilize Stacks Oracle data to monitor the sBTC/USDCx price feed. If the Loan-to-Value (LTV) exceeds 85%, a partial liquidation is triggered.
                        </p>
                        <div className="bg-surface-950 p-4 rounded-xl border border-red-500/20">
                            <div className="text-sm font-medium text-red-400 mb-1">Liquidation Penalty: 5%</div>
                            <div className="w-full bg-surface-800 rounded-full h-2 mt-2">
                                <div className="bg-gradient-to-r from-primary-500 via-amber-500 to-red-500 w-[60%] h-2 rounded-full"></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-surface-500">
                                <span>Safe</span>
                                <span className="text-red-400">Danger (85%)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
