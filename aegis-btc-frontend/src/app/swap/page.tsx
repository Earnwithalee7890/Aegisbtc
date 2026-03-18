"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Zap, Activity, RefreshCw } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { toast } from 'react-hot-toast';

export default function Swap() {
    const {
        balances,
        isLoadingBalances,
        refreshBalances,
        stacksNetwork,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        isContractMissing,
    } = useWallet();

    const [fromToken, setFromToken] = useState("sBTC");
    const [toToken, setToToken] = useState("USDCx");
    const [amount, setAmount] = useState("");
    const [isSwapping, setIsSwapping] = useState(false);

    const sBtcPrice = 65000;
    const stxPrice = 2.5;

    const getEstimatedOut = () => {
        if (!amount || isNaN(Number(amount))) return "0";
        if (fromToken === "sBTC") return (Number(amount) * sBtcPrice).toFixed(2);
        if (fromToken === "STX") return (Number(amount) * stxPrice).toFixed(2);
        // USDCx to something
        if (toToken === "sBTC") return (Number(amount) / sBtcPrice).toFixed(6);
        return (Number(amount) / stxPrice).toFixed(2);
    };

    // Get live wallet balance based on what is selected
    const walletBalance = fromToken === "sBTC" ? balances.sbtc : fromToken === "STX" ? balances.stx : balances.usdcx;

    const handleContractCheck = () => {
        if (isContractMissing) {
            toast.error("Aegis Protocol connection error. Please ensure you are connected to Mainnet.", {
                duration: 5000,
                icon: '⚠️'
            });
            return true;
        }
        return false;
    };

    const handleSwap = async () => {
        if (handleContractCheck()) return;
        if (!amount || isNaN(Number(amount))) return;
        setIsSwapping(true);

        let functionName = "";
        let factor = 1000000; // default for 6 decimals

        if (fromToken === "sBTC") {
            functionName = "swap-sbtc-to-usdcx";
            factor = 100000000;
        } else if (fromToken === "STX") {
            functionName = "swap-stx-to-usdcx";
            factor = 1000000;
        } else {
            // USDCx to... (unsupported in v3.1 snippet)
            toast.error("Reverse swaps are coming in v3.2!");
            setIsSwapping(false);
            return;
        }

        const microAmount = Math.floor(Number(amount) * factor);

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs: [uintCV(microAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'Aegis Swap', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`Swap Broadcasted!`, { icon: '🔄' });
                setIsSwapping(false);
                setAmount("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsSwapping(false)
        });
    };

    const switchTokens = () => {
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500" />

                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-primary-400" />
                            Aegis Swap
                        </h1>
                        <div className="text-xs text-surface-500 font-mono">1 sBTC ≈ $65,000</div>
                    </div>

                    <div className="space-y-2">
                        {/* From Token */}
                        <div className="bg-surface-900 border border-white/5 p-4 rounded-2xl">
                            <div className="flex justify-between text-xs text-surface-400 mb-2">
                                <span>From</span>
                                <span>Balance: {isLoadingBalances ? "..." : walletBalance}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full placeholder:text-surface-700"
                                />
                                <button 
                                    onClick={() => {
                                        if (fromToken === "sBTC") setFromToken("STX");
                                        else if (fromToken === "STX") setFromToken("sBTC");
                                        else setFromToken("STX"); // from usdcx to stx
                                    }}
                                    className="bg-surface-800 hover:bg-surface-700 px-3 py-1.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors shrink-0"
                                >
                                    <div className={`w-4 h-4 rounded-full ${fromToken === "sBTC" ? "bg-orange-500" : fromToken === "STX" ? "bg-primary-500" : "bg-accent-500"}`} />
                                    {fromToken}
                                    <RefreshCw className="w-3 h-3 opacity-50" />
                                </button>
                            </div>
                        </div>

                        {/* Switch Button */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <button
                                onClick={switchTokens}
                                className="p-2 bg-surface-950 border border-white/10 rounded-xl hover:scale-110 transition-transform text-primary-400 shadow-lg"
                            >
                                <ArrowDownUp className="w-5 h-5" />
                            </button>
                        </div>

                        {/* To Token */}
                        <div className="bg-surface-900 border border-white/5 p-4 rounded-2xl">
                            <div className="flex justify-between text-xs text-surface-400 mb-2">
                                <span>To (Estimated)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold text-surface-300 w-full">
                                    {getEstimatedOut()}
                                </div>
                                <div className="bg-surface-800 px-3 py-1.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 text-primary-400">
                                    <div className={`w-4 h-4 rounded-full ${toToken === "sBTC" ? "bg-orange-500" : "bg-primary-500"}`} />
                                    {toToken}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSwap}
                        disabled={isSwapping || !amount || Number(amount) <= 0}
                        className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-primary-500/10"
                    >
                        {isSwapping ? <Activity className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        {isSwapping ? "Confirming..." : "Swap Tokens"}
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-surface-500 px-2">
                    <span>Slippage Tolerance: 0.5%</span>
                    <span>Route: Aegis DEX Protocol</span>
                </div>
            </motion.div>
        </div>
    );
}
