export interface StacksNetwork {
  version: number;
  chainId: number;
  coreApiUrl: string;
}

export interface ClarityValue {
  type: string;
  value: any;
}

export interface ContractCall {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
}
