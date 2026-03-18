"use client";

import { openContractDeploy } from '@stacks/connect';
import { PostConditionMode } from '@stacks/transactions';
import { useWallet } from '@/context/WalletContext';
import { toast } from 'react-hot-toast';

export default function DeployClient({ contractCode }: { contractCode: string }) {
  const { stacksNetwork, network } = useWallet();

  // Determine the sBTC contract ID based on the network
  // This assumes the contractCode might contain a placeholder or needs dynamic insertion
  // For this specific instruction, the Clarity code snippet is inserted directly
  // into the contractCode if it's meant to be part of the deployed contract.
  // However, the provided snippet places it outside the contractCode variable.
  // Given the instruction, I will interpret this as a modification to the contractCode
  // that is being deployed, making it network-aware for sBTC calls.
  // The snippet provided seems to be Clarity code, which should be part of the `codeBody`.
  // I will assume the user wants to modify the `contractCode` prop itself.

  const sbtcContractId = network === "Mainnet"
    ? 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9HQJ02R.sbtc' // Mainnet sBTC
    : 'ST3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VBAB0EAF.sbtc'; // Testnet sBTC

  // This is a placeholder for how you might make the contractCode network-aware.
  // The actual implementation depends on the structure of your `contractCode`.
  // For example, if `contractCode` contains a placeholder like `{{sbtc-contract-id}}`:
  const modifiedContractCode = contractCode.replace(/SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9HQJ02R\.sbtc/g, sbtcContractId);


  const handleDeploy = () => {
    openContractDeploy({
      contractName: 'aegis-protocol-v1',
      codeBody: modifiedContractCode, // Use the modified contract code
      network: stacksNetwork,
      postConditionMode: PostConditionMode.Allow,
      appDetails: {
        name: 'Aegis Protocol Deployer',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: data => {
        console.log('Deploy success data:', data);
        toast.success(`Successfully broadcasted to ${network}!! Check explorer!`, { duration: 10000 });
      },
      onCancel: () => {
        toast.error('Deployment cancelled.');
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center glass-panel">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">Protocol Deployment</h1>
      <p className="max-w-md text-surface-400 mb-8">
        Deploy the <span className="text-white font-mono">aegis-unified-protocol</span> contract to your selected network. 
        Current target: <span className="text-primary-400 font-bold underline">{network}</span>
      </p>
      <button 
        onClick={handleDeploy}
        className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold text-white shadow-xl hover:shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2"
      >
        Deploy to {network} 🚀
      </button>

      {network === "Mainnet" && (
        <p className="mt-6 text-xs text-red-400/80 max-w-xs italic">
          ⚠️ Warning: Deploying to Mainnet will use real STX for transaction fees.
        </p>
      )}
    </div>
  );
}
