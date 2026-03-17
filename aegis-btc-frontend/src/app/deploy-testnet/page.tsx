import * as fs from 'fs';
import * as path from 'path';
import DeployClient from './DeployClient';

export default function DeployTestnetPage() {
  const contractPath = path.join(process.cwd(), '../aegis-btc-contracts/contracts/aegis-vault.clar');
  const codeBody = fs.readFileSync(contractPath, 'utf-8');

  return (
    <div className="pt-24 min-h-screen bg-surface-950 flex flex-col justify-center items-center">
      <DeployClient contractCode={codeBody} />
    </div>
  );
}
