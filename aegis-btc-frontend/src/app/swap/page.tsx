"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Zap, Activity, RefreshCw } from "lucide-react";
import { userSession } from "@/components/layout/Navbar";
import { openContractCall } from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';
import {
    uintCV,
    principalCV,
    PostConditionMode,
    fetchCallReadOnlyFunction,
    cvToJSON
} from '@stacks/transactions';
import { toast } from 'react-hot-toast';

const CONTRACT_ADDRESS = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";
const CONTRACT_NAME = "aegis-unified-protocol";
const NETWORK = STACKS_MAINNET;
const API_URL = "https://api.mainnet.hiro.so";

export default function Swap() {
    const [fromToken, setFromToken] = useState("sBTC");
    const [toToken, setToToken] = useState("USDCx");
    const [amount, setAmount] = useState("");
    const [walletBalance, setWalletBalance] = useState("0");
    const [isSwapping, setIsSwapping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sBtcPrice = 65000;

    const getEstimatedOut = () => {
        if (!amount || isNaN(Number(amount))) return "0";
        if (fromToken === "sBTC") return (Number(amount) * sBtcPrice).toFixed(2);
        return (Number(amount) / sBtcPrice).toFixed(6);
    };

    const fetchBalance = async () => {
        if (userSession.isUserSignedIn()) {
            setIsLoading(true);
            try {
                const userData = userSession.loadUserData();
                const address = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;
                const res = await fetch(`${API_URL}/extended/v1/address/${address}/balances`);
                const data = await res.json();

                if (fromToken === "sBTC") {
                    const sbtcData = data?.fungible_tokens?.[`${CONTRACT_ADDRESS}.${CONTRACT_NAME}::aegis-sbtc`];
                    setWalletBalance((parseInt(sbtcData?.balance || "0") / 100000000).toFixed(4));
                } else {
                    const usdcxData = data?.fungible_tokens?.[`${CONTRACT_ADDRESS}.${CONTRACT_NAME}::aegis-usdcx`];
                    setWalletBalance((parseInt(usdcxData?.balance || "0") / 1000000).toFixed(2));
                }
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [fromToken]);

    const handleSwap = async () => {
        if (!amount || isNaN(Number(amount))) return;
        setIsSwapping(true);

        const functionName = fromToken === "sBTC" ? "swap-sbtc-to-usdcx" : "swap-usdcx-to-sbtc";
        const factor = fromToken === "sBTC" ? 100000000 : 1000000;
        const microAmount = Math.floor(Number(amount) * factor);

        openContractCall({
            network: NETWORK,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs: [uintCV(microAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'Aegis Swap', icon: window.location.origin + '/favicon.ico' },
            onFinish: data => {
                toast.success(`Swap Broadcasted!`, { icon: '🔄' });
                setIsSwapping(false);
                setAmount("");
                setTimeout(fetchBalance, 5000);
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
                                <span>Balance: {isLoading ? "..." : walletBalance}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full placeholder:text-surface-700"
                                />
                                <div className="bg-surface-800 px-3 py-1.5 rounded-xl text-sm font-bold text-white flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${fromToken === "sBTC" ? "bg-orange-500" : "bg-primary-500"}`} />
                                    {fromToken}
                                </div>
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
