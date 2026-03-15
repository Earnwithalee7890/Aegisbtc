export class WalletConnectionError extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = "WalletConnectionError";
    }
}

export const handleWalletError = (error: any) => {
    console.error("Wallet connection failed:", error);
    if (error.message.includes('No wallet found')) {
        return new WalletConnectionError('NO_WALLET', 'Please install Leather or Xverse wallet to continue.');
    }
    if (error.message.includes('User rejected')) {
        return new WalletConnectionError('USER_REJECTED', 'Connection request was denied by the user.');
    }
    return new WalletConnectionError('UNKNOWN', 'An unknown error occurred during wallet connection.');
};
