"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";
import { Vault, ArrowUpRight, ArrowDownRight, Activity, Zap, Sparkles, Calculator, TrendingUp, Coins } from "lucide-react";
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { toast } from 'react-hot-toast';

export default function Vaults() {
    const {
        isConnected,
        address,
        balances,
        isLoadingBalances,
        refreshBalances,
        stacksNetwork,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        isContractMissing,
        supportedFeatures
    } = useWallet();

    const [depositAmountStx, setDepositAmountStx] = useState("");
    const [depositAmountSbtc, setDepositAmountSbtc] = useState("");
    const [isDepositingStx, setIsDepositingStx] = useState(false);
    const [isDepositingSbtc, setIsDepositingSbtc] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isWithdrawingStx, setIsWithdrawingStx] = useState(false);
    const [calcAmount, setCalcAmount] = useState("");

    const avgApy = 0.084;
    const estDaily = (parseFloat(calcAmount) || 0) * (avgApy / 365);
    const estYearly = (parseFloat(calcAmount) || 0) * avgApy;

    const walletStx = balances.stx;
    const walletSbtc = balances.sbtc;
    const vaultStx = balances.vaultStx;
    const vaultSbtc = balances.vaultSbtc;

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

    const handleDepositStx = async () => {
        if (handleContractCheck()) return;
        if (!depositAmountStx || isNaN(Number(depositAmountStx))) return;
        setIsDepositingStx(true);

        const microStxAmount = Math.floor(Number(depositAmountStx) * 1000000);

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'deposit-stx',
            functionArgs: [uintCV(microStxAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'Aegis Vaults', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`STX Deposit Broadcasted!`, { icon: '🚀' });
                setIsDepositingStx(false);
                setDepositAmountStx("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsDepositingStx(false)
        });
    };

    const handleDepositSbtc = async () => {
        if (handleContractCheck()) return;
        if (!depositAmountSbtc || isNaN(Number(depositAmountSbtc))) return;
        setIsDepositingSbtc(true);

        const microSbtcAmount = Math.floor(Number(depositAmountSbtc) * 100000000);

        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'deposit-sbtc',
            functionArgs: [uintCV(microSbtcAmount)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'Aegis Vaults', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`sBTC Deposit Broadcasted!`, { icon: '🧡' });
                setIsDepositingSbtc(false);
                setDepositAmountSbtc("");
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsDepositingSbtc(false)
        });
    };

    const handleFaucet = async () => {
        if (handleContractCheck()) return;
        setIsMinting(true);
        openContractCall({
            network: stacksNetwork,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'faucet-mock-sbtc',
            functionArgs: [],
            postConditionMode: PostConditionMode.Allow,
            appDetails: { name: 'Aegis Faucet', icon: window.location.origin + '/favicon.ico' },
            onFinish: () => {
                toast.success(`Faucet Broadcasted!`, { icon: '🎁' });
                setIsMinting(false);
                setTimeout(() => refreshBalances(), 4000);
            },
            onCancel: () => setIsMinting(false)
        });
    };

    const handleWithdrawStx = async () => {
        toast.error("Withdrawals coming in Aegis v3.2!");
    };

    const handleWithdrawSbtc = async () => {
        toast.error("Withdrawals coming in Aegis v3.2!");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Aegis Vaults</h1>
                    <p className="text-surface-400">Lock your assets to generate yield through automated strategies.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl border border-white/10">
                        <p className="text-sm text-surface-400 mb-1">Platform TVL</p>
                        <p className="text-xl font-bold text-primary-400">$12.4M</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* STX Vault */}
                    {supportedFeatures.stxVault ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors" />
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary-500/20 rounded-2xl">
                                        <Zap className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">STX Vault</h3>
                                        <p className="text-sm text-surface-400">Lock native STX for yield</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-surface-500 mb-1">Staked</p>
                                    <p className="text-2xl font-bold text-white font-mono">{vaultStx} STX</p>
                                </div>
                            </div>

                            <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6 mb-8">
                                <div className="flex justify-between text-xs text-surface-400 mb-4 uppercase tracking-wider">
                                    <span>Amount</span>
                                    <span>Wallet: {isLoadingBalances ? "..." : `${walletStx} STX`}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={depositAmountStx}
                                        onChange={(e) => setDepositAmountStx(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none placeholder:text-surface-700 font-mono"
                                    />
                                    <button 
                                        onClick={() => setDepositAmountStx(walletStx)}
                                        className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleDepositStx}
                                    disabled={isDepositingStx || !depositAmountStx}
                                    className="py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {isDepositingStx ? <Activity className="w-5 h-5 animate-pulse" /> : <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    Deposit
                                </button>
                                <button
                                    onClick={handleWithdrawStx}
                                    className="py-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold transition-all"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 opacity-50 relative group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-surface-800 rounded-2xl">
                                    <Zap className="w-6 h-6 text-surface-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-surface-400">STX Vault</h3>
                                        <span className="text-[10px] bg-surface-800 text-surface-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Coming Soon</span>
                                    </div>
                                    <p className="text-sm text-surface-500">Not supported by current protocol version</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* sBTC Vault */}
                    {supportedFeatures.sbtcVault ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-orange-500/20"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-colors" />
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/20 rounded-2xl">
                                        <Coins className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">sBTC Vault</h3>
                                        <p className="text-sm text-surface-400">Bitcoin-backed yield strategy</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-surface-500 mb-1">Staked</p>
                                    <p className="text-2xl font-bold text-white font-mono">{vaultSbtc} sBTC</p>
                                </div>
                            </div>

                            <div className="bg-surface-950/50 border border-white/5 rounded-2xl p-6 mb-8">
                                <div className="flex justify-between text-xs text-surface-400 mb-4 uppercase tracking-wider">
                                    <span>Amount</span>
                                    <span>Wallet: {isLoadingBalances ? "..." : `${walletSbtc} sBTC`}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={depositAmountSbtc}
                                        onChange={(e) => setDepositAmountSbtc(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none placeholder:text-surface-700 font-mono"
                                    />
                                    <button 
                                        onClick={() => setDepositAmountSbtc(walletSbtc)}
                                        className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleDepositSbtc}
                                    disabled={isDepositingSbtc || !depositAmountSbtc}
                                    className="py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {isDepositingSbtc ? <Activity className="w-5 h-5 animate-pulse" /> : <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    Deposit
                                </button>
                                <button
                                    onClick={handleWithdrawSbtc}
                                    className="py-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold transition-all"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 opacity-50 relative group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-surface-800 rounded-2xl">
                                    <Coins className="w-6 h-6 text-surface-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-surface-400">sBTC Vault</h3>
                                        <span className="text-[10px] bg-surface-800 text-surface-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Unavailable</span>
                                    </div>
                                    <p className="text-sm text-surface-500">Feature not indexed in current deployment</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Faucet Box (Only for Testnet) */}
                    {stacksNetwork.chainId === 2147483648 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 bg-gradient-to-r from-primary-500/10 to-transparent border border-white/5 rounded-3xl flex items-center justify-between gap-6"
                        >
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary-400" />
                                    Testnet Faucet
                                </h4>
                                <p className="text-xs text-surface-500">Need mock sBTC for testing? Use our instant faucet.</p>
                            </div>
                            <button
                                onClick={handleFaucet}
                                disabled={isMinting}
                                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                            >
                                {isMinting ? "Minting..." : "Mint sBTC"}
                            </button>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary-400" />
                            Reward Distribution
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-surface-400">Next Payout</span>
                                <span className="text-white font-mono">2h 14m</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-surface-400">Estimated Yield</span>
                                <span className="text-primary-400 font-bold font-mono">+8.42% APY</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/10">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-accent-400" />
                            Yield Estimator
                        </h4>
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={calcAmount}
                                    onChange={(e) => setCalcAmount(e.target.value)}
                                    placeholder="Amount..."
                                    className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500/50"
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-surface-500 font-bold uppercase">USD</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-surface-900 rounded-lg">
                                    <p className="text-[10px] text-surface-500 uppercase">Daily</p>
                                    <p className="text-xs text-white font-bold">${estDaily.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-surface-900 rounded-lg">
                                    <p className="text-[10px] text-surface-500 uppercase">Yearly</p>
                                    <p className="text-xs text-white font-bold">${estYearly.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
