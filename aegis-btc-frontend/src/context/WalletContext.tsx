"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { userSession } from "@/components/layout/Navbar";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import { fetchCallReadOnlyFunction, principalCV, cvToJSON } from "@stacks/transactions";

// ─── Contract Config ────────────────────────────────────────────────────────
export const CONTRACT_ADDRESS = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";
export const CONTRACT_NAME    = "aegis-unified-protocol";

// Testnet contract (same deployer address pattern on testnet)
export const TESTNET_CONTRACT_ADDRESS = "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT";
export const TESTNET_CONTRACT_NAME    = "aegis-unified-protocol";

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
  network: "Testnet",
  setNetwork: () => {},
  address: "",
  mainnetAddress: "",
  testnetAddress: "",
  balances: DEFAULT_BALANCES,
  isLoadingBalances: false,
  refreshBalances: async () => {},
  stacksNetwork: STACKS_TESTNET,
  apiUrl: TESTNET_API,
  contractAddress: TESTNET_CONTRACT_ADDRESS,
  contractName: TESTNET_CONTRACT_NAME,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetworkState] = useState<NetworkType>("Testnet");
  const [mainnetAddress, setMainnetAddress] = useState("");
  const [testnetAddress, setTestnetAddress] = useState("");
  const [balances, setBalances] = useState<WalletBalances>(DEFAULT_BALANCES);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Derived values
  const address = network === "Mainnet" ? mainnetAddress : testnetAddress;
  const stacksNetwork = network === "Mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
  const apiUrl = network === "Mainnet" ? MAINNET_API : TESTNET_API;
  const contractAddress = network === "Mainnet" ? CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;
  const contractName = network === "Mainnet" ? CONTRACT_NAME : TESTNET_CONTRACT_NAME;

  // ─── Load addresses from session ─────────────────────────────────────────
  const loadAddressFromSession = useCallback(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const mnAddr = userData.profile.stxAddress?.mainnet ?? "";
      const tnAddr = userData.profile.stxAddress?.testnet ?? "";
      setMainnetAddress(typeof mnAddr === "string" ? mnAddr : "");
      setTestnetAddress(typeof tnAddr === "string" ? tnAddr : "");
      setIsConnected(true);
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
    const currentContract = network === "Mainnet" ? CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;
    const currentContractName = network === "Mainnet" ? CONTRACT_NAME : TESTNET_CONTRACT_NAME;

    try {
      // 1. Fetch wallet token balances from Hiro API
      const res = await fetch(`${currentApiUrl}/extended/v1/address/${currentAddress}/balances`);
      const data = await res.json();

      // STX balance
      const stxMicro = parseInt(data?.stx?.balance ?? "0");
      const stxVal = (stxMicro / 1_000_000).toFixed(2);

      // The token asset identifiers in Clarity use the ft name defined via define-fungible-token
      // In aegis-protocol.clar: (define-fungible-token mock-sbtc) and (define-fungible-token usdcx)
      const sbtcAssetId  = `${currentContract}.${currentContractName}::mock-sbtc`;
      const usdcxAssetId = `${currentContract}.${currentContractName}::usdcx`;

      const sbtcRaw  = parseInt(data?.fungible_tokens?.[sbtcAssetId]?.balance  ?? "0");
      const usdcxRaw = parseInt(data?.fungible_tokens?.[usdcxAssetId]?.balance ?? "0");

      const sbtcVal  = (sbtcRaw  / 1e8).toFixed(8);
      const usdcxVal = (usdcxRaw / 1e6).toFixed(2);

      // 2. Fetch on-chain vault deposits via read-only calls
      let vaultStxVal   = "0.00";
      let vaultSbtcVal  = "0.00000000";
      let usdcxDebtVal  = "0.00";

      try {
        const stxVaultRes = await fetchCallReadOnlyFunction({
          network: currentNetwork,
          contractAddress: currentContract,
          contractName: currentContractName,
          functionName: "get-stx-balance",
          functionArgs: [principalCV(currentAddress)],
          senderAddress: currentAddress,
        });
        vaultStxVal = (parseInt(cvToJSON(stxVaultRes).value ?? "0") / 1e6).toFixed(2);
      } catch { /* contract may not be live on testnet */ }

      try {
        const sbtcVaultRes = await fetchCallReadOnlyFunction({
          network: currentNetwork,
          contractAddress: currentContract,
          contractName: currentContractName,
          functionName: "get-sbtc-balance",
          functionArgs: [principalCV(currentAddress)],
          senderAddress: currentAddress,
        });
        vaultSbtcVal = (parseInt(cvToJSON(sbtcVaultRes).value ?? "0") / 1e8).toFixed(8);
      } catch { /* contract may not be live on testnet */ }

      try {
        const debtRes = await fetchCallReadOnlyFunction({
          network: currentNetwork,
          contractAddress: currentContract,
          contractName: currentContractName,
          functionName: "get-usdcx-debt",
          functionArgs: [principalCV(currentAddress)],
          senderAddress: currentAddress,
        });
        usdcxDebtVal = (parseInt(cvToJSON(debtRes).value ?? "0") / 1e6).toFixed(2);
      } catch { /* contract may not be live on testnet */ }

      setBalances({
        stx:       stxVal,
        sbtc:      sbtcVal,
        usdcx:     usdcxVal,
        vaultStx:  vaultStxVal,
        vaultSbtc: vaultSbtcVal,
        usdcxDebt: usdcxDebtVal,
      });

    } catch (err) {
      console.error("[WalletContext] Failed to fetch balances:", err);
      setBalances(DEFAULT_BALANCES);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [network, mainnetAddress, testnetAddress, isConnected]);

  // ─── Init on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    // Handle redirect back after Leather sign-in
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        loadAddressFromSession();
      });
    } else {
      loadAddressFromSession();
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

  const setNetwork = (n: NetworkType) => {
    setNetworkState(n);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        network,
        setNetwork,
        address,
        mainnetAddress,
        testnetAddress,
        balances,
        isLoadingBalances,
        refreshBalances,
        stacksNetwork,
        apiUrl,
        contractAddress,
        contractName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
