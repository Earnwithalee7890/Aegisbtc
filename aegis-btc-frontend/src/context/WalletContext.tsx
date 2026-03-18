"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { userSession } from "@/components/layout/Navbar";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import { fetchCallReadOnlyFunction, principalCV, cvToJSON } from "@stacks/transactions";
import { toast } from "react-hot-toast";

// Aegis v3.1 Internal Tokens (Internal to your contract)
export const AEGIS_SBTC_SUFFIX = "::aegis-sbtc";
export const AEGIS_USDCX_SUFFIX = "::aegis-usdcx";

// Mainnet official validated assets (for wallet display)
export const MAINNET_SBTC_ASSET = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc";
export const MAINNET_USDCX_ASSET = "SP3Y2ZQC8H59DNM102N9J9H0X6S9E5S56T26EGBM8.usdc-token::usdc";

// Testnet legacy assets
export const TESTNET_SBTC_SUFFIX = "::mock-sbtc";
export const TESTNET_USDCX_SUFFIX = "::usdcx";

// Hiro API endpoints
const MAINNET_API = "https://api.mainnet.hiro.so";
const TESTNET_API = "https://api.testnet.hiro.so";

// ─── Types ───────────────────────────────────────────────────────────────────
export type NetworkType = "Mainnet" | "Testnet";

interface WalletBalances {
  stx: string;        // e.g. "12.50"
  sbtc: string;       // e.g. "0.0025"
  usdcx: string;      // e.g. "500.00"
  vaultStx: string;   // on-chain deposited
  vaultSbtc: string;  // on-chain deposited
  usdcxDebt: string;  // on-chain borrowed
}

interface WalletContextValue {
  isConnected: boolean;
  network: NetworkType;
  setNetwork: (n: NetworkType) => void;
  address: string;           // current network address
  mainnetAddress: string;
  testnetAddress: string;
  balances: WalletBalances;
  isLoadingBalances: boolean;
  refreshBalances: () => Promise<void>;
  stacksNetwork: typeof STACKS_MAINNET | typeof STACKS_TESTNET;
  apiUrl: string;
  contractAddress: string;
  contractName: string;
  isContractMissing: boolean;
}

const DEFAULT_BALANCES: WalletBalances = {
  stx: "0.00",
  sbtc: "0.00000000",
  usdcx: "0.00",
  vaultStx: "0.00",
  vaultSbtc: "0.00000000",
  usdcxDebt: "0.00",
};

const WalletContext = createContext<WalletContextValue>({
  isConnected: false,
  network: "Mainnet",
  setNetwork: () => {},
  address: "",
  mainnetAddress: "",
  testnetAddress: "",
  balances: DEFAULT_BALANCES,
  isLoadingBalances: false,
  refreshBalances: async () => {},
  stacksNetwork: STACKS_MAINNET,
  apiUrl: MAINNET_API,
  contractAddress: "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT",
  contractName: "aegis-protocol-v1",
  isContractMissing: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  
  // Use initializer function to prevent "Testnet" flash on refresh
  const [network, setNetworkState] = useState<NetworkType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aegis_network");
      if (saved === "Mainnet" || saved === "Testnet") return saved as NetworkType;
    }
    return "Mainnet";
  });

  const [mainnetAddress, setMainnetAddress] = useState("");
  const [testnetAddress, setTestnetAddress] = useState("");
  const [balances, setBalances] = useState<WalletBalances>(DEFAULT_BALANCES);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isContractMissing, setIsContractMissing] = useState(false);

  // Derived values
  const address = network === "Mainnet" ? mainnetAddress : testnetAddress;
  const stacksNetwork = network === "Mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
  const apiUrl = network === "Mainnet" ? MAINNET_API : TESTNET_API;

  // ON MAINNET: Hardcoded to the user's specific developer address
  // ON TESTNET: Fallback to ST version of the same address
  const contractAddress = network === "Mainnet" 
    ? "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT" 
    : "ST2F500B8DTRK1EANJQ054BRAB8DDKN6QCQG0J9MJ";
  const contractName = "aegis-unified-protocol";

  // ─── Load addresses from session ─────────────────────────────────────────
  const loadAddressFromSession = useCallback(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      
      // Attempt to get addresses from various possible locations in userData
      const userDataAny = userData as any;
      let mnAddr = userDataAny.profile?.stxAddress?.mainnet || userDataAny.stxAddress?.mainnet || "";
      let tnAddr = userDataAny.profile?.stxAddress?.testnet || userDataAny.stxAddress?.testnet || "";
      
      // Fallback for some wallet versions (Leather) where stxAddress is a direct string or in profile
      const rawAddress = userDataAny.profile?.stxAddress || userDataAny.stxAddress;
      
      if (typeof rawAddress === 'string') {
          if (rawAddress.startsWith('SP') || rawAddress.startsWith('sp')) {
              mnAddr = rawAddress;
          } else if (rawAddress.startsWith('ST') || rawAddress.startsWith('st')) {
              tnAddr = rawAddress;
          }
      }

      // Final attempt: check if we have either SP or ST and populate both if possible
      // (some wallets only provide one, but we can derive or at least identify)
      if (mnAddr && !tnAddr) {
          console.log("[WalletContext] Found Mainnet address but no Testnet address.");
      }
      if (tnAddr && !mnAddr) {
          console.log("[WalletContext] Found Testnet address but no Mainnet address.");
      }

      setMainnetAddress(mnAddr);
      setTestnetAddress(tnAddr);
      setIsConnected(true);
      
      console.log("[WalletContext] Addresses loaded:", { mainnet: mnAddr, testnet: tnAddr });
      
      // If we are on a network but don't have an address for it, but we DO have one for the other,
      // stay on the saved network but the UI will show disconnected or prompt.
      // We don't force a switch here because that's what the user complained about.
    } else {
      setIsConnected(false);
      setMainnetAddress("");
      setTestnetAddress("");
    }
  }, []);

  // ─── Fetch balances ───────────────────────────────────────────────────────
  const refreshBalances = useCallback(async () => {
    const currentAddress = network === "Mainnet" ? mainnetAddress : testnetAddress;
    
    if (!currentAddress || !isConnected) {
      setBalances(DEFAULT_BALANCES);
      return;
    }

    setIsLoadingBalances(true);
    const currentApiUrl = network === "Mainnet" ? MAINNET_API : TESTNET_API;
    const currentNetwork = network === "Mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
    const currentContract = contractAddress;
    const currentContractName = contractName;

    try {
      // 1. Fetch wallet token balances from Hiro API
      const stxRes = await fetch(`${currentApiUrl}/extended/v2/addresses/${currentAddress}/balances/stx`);
      const stxData = stxRes.ok ? await stxRes.json() : { balance: "0" };

      const ftRes = await fetch(`${currentApiUrl}/extended/v1/address/${currentAddress}/balances`);
      const ftData = ftRes.ok ? await ftRes.json() : { fungible_tokens: {} };

      const stxRaw = stxData?.balance || "0";
      const stxVal = (parseInt(stxRaw) / 1_000_000).toFixed(2);

      // Use Official Mainnet Assets for Wallet Balances
      const sbtcAssetId  = network === "Mainnet" ? MAINNET_SBTC_ASSET : `${currentContract}.${currentContractName}${AEGIS_SBTC_SUFFIX}`;
      const usdcxAssetId = network === "Mainnet" ? MAINNET_USDCX_ASSET : `${currentContract}.${currentContractName}${AEGIS_USDCX_SUFFIX}`;

      const sbtcRaw  = ftData?.fungible_tokens?.[sbtcAssetId]?.balance || "0";
      const usdcxRaw = ftData?.fungible_tokens?.[usdcxAssetId]?.balance || "0";

      const sbtcVal  = (Number(sbtcRaw)  / 1e8).toFixed(8);
      const usdcxVal = (Number(usdcxRaw) / 1e6).toFixed(2);

      // 2. Fetch on-chain vault deposits via read-only calls
      const fetchReadOnly = async (functionName: string) => {
        try {
          const response = await fetchCallReadOnlyFunction({
            network: currentNetwork,
            contractAddress: currentContract,
            contractName: currentContractName,
            functionName,
            functionArgs: [principalCV(currentAddress)],
            senderAddress: currentAddress,
          });
          const resJson = cvToJSON(response);
          return String(resJson?.value?.value || resJson?.value || "0");
        } catch (e: any) {
          // If the contract literally doesn't exist yet (not indexed), it often throws here
          if (e.message?.includes("not found") || e.status === 404) {
             throw e; // Pass up to refreshBalances to set isContractMissing
          }
          console.warn(`[WalletContext] Read-only ${functionName} failed: ${e.message}`);
          return "0";
        }
      };

      const [vStxRaw, vSbtcRaw, vDebtRaw] = await Promise.all([
        fetchReadOnly("get-stx-balance"),
        fetchReadOnly("get-sbtc-balance"),
        fetchReadOnly("get-usdcx-debt")
      ]);

      setBalances({
        stx: stxVal,
        sbtc: sbtcVal,
        usdcx: usdcxVal,
        vaultStx: (Number(vStxRaw) / 1e6).toFixed(2),
        vaultSbtc: (Number(vSbtcRaw) / 1e8).toFixed(8),
        usdcxDebt: (Number(vDebtRaw) / 1e6).toFixed(2)
      });
      
      // If we got here and all vault balances are 0, it MIGHT be missing, 
      // but we shouldn't be aggressive. We only set it if the read-only calls 
      // explicitly throw a "contract not found" style error (handled in fetchReadOnly).
      setIsContractMissing(false);

    } catch (err: any) {
      console.error("[WalletContext] refreshBalances error:", err);
      if (err.message?.includes("not found") || err.message?.includes("404")) {
        setIsContractMissing(true);
      }
    } finally {
      setIsLoadingBalances(false);
    }
  }, [network, mainnetAddress, testnetAddress, isConnected, contractAddress, contractName]);

  // ─── Init on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    // Initial sync
    loadAddressFromSession();

    // Handle redirect back after Leather sign-in
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        loadAddressFromSession();
      });
    }

    // Poll every 2 seconds until connected (handles async wallet popup finish)
    const interval = setInterval(() => {
      if (!isConnected && userSession.isUserSignedIn()) {
        loadAddressFromSession();
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Refresh balances when address or network changes ────────────────────
  useEffect(() => {
    if (isConnected && address) {
      refreshBalances();
    }
  }, [isConnected, address, network, refreshBalances]);

  // ─── Network Management ──────────────────────────────────────────────────
  const setNetwork = useCallback((newNetwork: NetworkType) => {
    setNetworkState(newNetwork);
    localStorage.setItem("aegis_network", newNetwork);
    
    // Toast notification for network switch
    toast.success(`Switched to ${newNetwork}`, {
        icon: newNetwork === "Mainnet" ? '💎' : '🧪',
        duration: 3000
    });
  }, []);

  // ─── Verification ────────────────────────────────────────────────────────
  


  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        network,
        setNetwork,
        mainnetAddress,
        testnetAddress,
        balances,
        refreshBalances,
        isLoadingBalances,
        stacksNetwork,
        apiUrl,
        contractAddress,
        contractName,
        isContractMissing,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
