"use client";

import Link from "next/link";
import { Wallet, ChevronDown, Activity, LogOut, Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { AppConfig, UserSession, authenticate } from '@stacks/connect';

import { usePathname } from "next/navigation";

// Initialize Stacks Session
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export default function Navbar() {
    const pathname = usePathname();
    const [isConnected, setIsConnected] = useState(false);
    const [network, setNetwork] = useState("Testnet");
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navigation Links Config
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Vaults", href: "/vaults" },
        { name: "Borrow", href: "/borrow" },
        { name: "Swap", href: "/swap" },
        { name: "Yield", href: "/subscriptions" },
        { name: "Reputation", href: "/reputation" },
        { name: "Builder", href: "/builder" },
        { name: "Risks", href: "/risk-analyzer", beta: true },
        { name: "Quests", href: "/tasks", special: true },
    ];

    // Read session on load
    useEffect(() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData: any) => {
                setIsConnected(true);
                const address = (network === "Mainnet"
                    ? userData.profile.stxAddress.mainnet || userData.profile.stxAddress
                    : userData.profile.stxAddress.testnet || userData.profile.stxAddress);
                setUserAddress(typeof address === 'string' ? address : "");
            });
        } else if (userSession.isUserSignedIn()) {
            setIsConnected(true);
            const userData = userSession.loadUserData();
            const address = (network === "Mainnet"
                ? userData.profile.stxAddress.mainnet || userData.profile.stxAddress
                : userData.profile.stxAddress.testnet || userData.profile.stxAddress);
            setUserAddress(typeof address === 'string' ? address : "");
        }
    }, [network]);

    const connectWallet = () => {
        authenticate({
            appDetails: {
                name: 'AegisBTC',
                icon: window.location.origin + '/favicon.ico',
            },
            onFinish: () => {
                setIsConnected(true);
                const userData = userSession.loadUserData();
                const address = (network === "Mainnet"
                    ? userData.profile.stxAddress.mainnet || userData.profile.stxAddress
                    : userData.profile.stxAddress.testnet || userData.profile.stxAddress);
                setUserAddress(typeof address === 'string' ? address : "");
            },
            userSession,
        }).catch((e) => {
            console.error("Wallet connection failed", e);
        });
    };

    const handleDisconnect = () => {
        userSession.signUserOut();
        setIsConnected(false);
        setUserAddress("");
    };

    const truncateAddress = (address: string) => {
        if (!address) return "";
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 bg-surface-950/60"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 p-0.5">
                            <div className="absolute inset-0 bg-primary-500/50 blur-md group-hover:bg-primary-400/60 transition-colors" />
                            <div className="relative flex items-center justify-center w-full h-full bg-surface-950 rounded-[10px]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500">
                                    <path d="M12 2L2 7H22L12 2Z" fill="currentColor" />
                                    <path d="M2 17L12 22L22 17H2Z" fill="currentColor" />
                                    <path d="M22 12L12 17L2 12V12L12 7L22 12V12Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-400 transition-colors">
                            Aegis<span className="text-primary-500">BTC</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 bg-surface-900/50 border border-white/5 p-1 rounded-2xl shadow-inner relative z-10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            if (link.special) {
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 flex items-center gap-1.5 ${isActive
                                            ? "bg-primary-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                            : "text-primary-400 hover:text-primary-300 hover:bg-primary-500/20 bg-primary-500/10 border border-primary-500/30"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-1 ${isActive
                                        ? "bg-white/10 text-white shadow-sm"
                                        : "text-surface-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {link.name}
                                    {link.beta && (
                                        <span className={`text-[9px] uppercase font-bold py-0.5 px-1 rounded-full ${isActive ? "bg-primary-500 text-white" : "bg-primary-500/20 text-primary-300"
                                            }`}>Beta</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Connect Wallet & Network Settings Section */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isConnected ? (
                            <>
                                {/* Network Switcher */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                        className="flex items-center gap-2 bg-surface-800/50 border border-white/5 hover:bg-surface-800 text-surface-300 hover:text-white py-2 px-3 rounded-xl transition-all h-[42px]"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${network === "Mainnet" ? "bg-primary-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-primary-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"}`}></div>
                                        <span className="text-sm font-medium">{network}</span>
                                        <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                                    </button>

                                    {/* Dropdown UI */}
                                    <AnimatePresence>
                                        {isNetworkDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-900 border border-white/10 shadow-xl overflow-hidden z-50"
                                            >
                                                <button
                                                    onClick={() => { setNetwork("Mainnet"); setIsNetworkDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${network === "Mainnet" ? "bg-white/5 text-white font-medium" : "text-surface-400 hover:bg-white/5 hover:text-white"}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-primary-500" />
                                                        Stacks Mainnet
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => { setNetwork("Testnet"); setIsNetworkDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${network === "Testnet" ? "bg-white/5 text-white font-medium border-t border-white/5" : "text-surface-400 hover:bg-white/5 hover:text-white border-t border-white/5"}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-primary-500" />
                                                        Stacks Testnet
                                                    </div>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Connected Address Box */}
                                <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 py-2 pl-4 pr-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.15)] group">
                                    <Wallet className="w-4 h-4 text-primary-400" />
                                    <span className="text-sm font-mono text-white font-medium pr-2 border-r border-white/10">
                                        {userAddress ? truncateAddress(userAddress) : "Connecting..."}
                                    </span>
                                    <button
                                        onClick={handleDisconnect}
                                        className="p-1.5 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Disconnect Wallet"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Unconnected Button */
                            <button
                                onClick={connectWallet}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                            >
                                <Wallet className="w-4 h-4 text-primary-400 group-hover:text-primary-300" />
                                <span className="text-sm">Connect Wallet</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="lg:hidden flex items-center z-50">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-surface-300 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-surface-800 bg-surface-950/95 backdrop-blur-xl absolute top-full left-0 right-0 w-full z-40"
                    >
                        <div className="flex flex-col gap-4 p-6 shadow-2xl">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-primary-400 transition-colors">Home</Link>
                            <Link href="/vaults" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-primary-400 transition-colors">Vaults</Link>
                            <Link href="/borrow" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-400 text-lg font-medium hover:text-primary-300 transition-colors">Borrow</Link>
                            <Link href="/subscriptions" onClick={() => setIsMobileMenuOpen(false)} className="text-accent-400 text-lg font-medium hover:text-accent-300 transition-colors">Yield</Link>
                            <Link href="/reputation" onClick={() => setIsMobileMenuOpen(false)} className="text-accent-400 text-lg font-medium hover:text-accent-300 transition-colors">Reputation</Link>
                            <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-400 text-lg font-medium hover:text-primary-300 transition-colors">Builder</Link>
                            <Link href="/risk-analyzer" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-primary-400 transition-colors flex items-center gap-2">Risks <span className="text-[10px] uppercase font-bold bg-primary-500/20 text-primary-300 py-0.5 px-1.5 rounded-full">Beta</span></Link>
                            <Link href="/tasks" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary-500/10 border border-primary-500/30 p-3 rounded-xl text-primary-400 text-lg font-bold flex items-center gap-2 hover:bg-primary-500/20 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                Quests
                            </Link>

                            <hr className="border-surface-800 my-2" />

                            {!isConnected ? (
                                <button
                                    onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}
                                    className="flex justify-center items-center gap-2 bg-primary-500/20 text-primary-400 border border-primary-500/50 py-3 rounded-xl w-full font-bold"
                                >
                                    <Wallet className="w-5 h-5" /> Connect Wallet
                                </button>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center bg-surface-900 border border-surface-800 px-4 py-3 rounded-xl">
                                        <span className="text-surface-400">Network:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                            <span className="text-white font-medium">{network}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleDisconnect(); setIsMobileMenuOpen(false); }}
                                        className="flex justify-center items-center gap-2 text-red-400 py-3 rounded-xl hover:bg-red-500/10 transition-colors border border-red-500/20 w-full"
                                    >
                                        <LogOut className="w-5 h-5" /> Disconnect
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
