import { openContractDeploy } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { toast } from 'react-hot-toast';

export default function DeployClient({ contractCode }: { contractCode: string }) {
  const handleDeploy = () => {
    openContractDeploy({
      contractName: 'aegis-unified-protocol',
      codeBody: contractCode,
      network: STACKS_TESTNET, // Explicitly coerce it to TESTNET!
      appDetails: {
        name: 'Aegis Testnet Deployer',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: data => {
        console.log('Deploy success data:', data);
        toast.success('Successfully broadcasted to Testnet!! Check explorer!', { duration: 10000 });
      },
      onCancel: () => {
        toast.error('Deployment cancelled.');
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center glass-panel">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">Force Testnet Deployment</h1>
      <p className="max-w-md text-surface-400 mb-8">
        If the Hiro Sandbox is bugging out and sending you to Mainnet, use this button to force a transaction securely matching the Testnet Blockchain.
      </p>
      <button 
        onClick={handleDeploy}
        className="px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-white shadow-xl hover:scale-105 transition-all"
      >
        Deploy aegis-unified-protocol to Testnet 🚀
      </button>
    </div>
  );
}
