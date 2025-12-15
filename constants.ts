import { Network, NetworkConfig } from './types.ts';

// REPLACE THESE WITH YOUR ACTUAL WALLET ADDRESSES
export const ADMIN_WALLETS = {
  [Network.SOLANA]: "8x5...YourSolanaWalletHere",
  [Network.ETHEREUM]: "0x123...YourEthWalletHere",
  [Network.XRP]: "r123...YourXrpWalletHere",
};

export const NETWORKS: Record<Network, NetworkConfig> = {
  [Network.SOLANA]: {
    id: Network.SOLANA,
    name: 'Solana',
    ticker: 'SOL',
    color: 'from-purple-600 to-indigo-600',
    fee: 0.01,
    gasEstimate: 0.002,
    walletAddress: ADMIN_WALLETS[Network.SOLANA],
    logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    dexName: 'Raydium'
  },
  [Network.ETHEREUM]: {
    id: Network.ETHEREUM,
    name: 'Ethereum',
    ticker: 'ETH',
    color: 'from-blue-600 to-indigo-800',
    fee: 0.005,
    gasEstimate: 0.02,
    walletAddress: ADMIN_WALLETS[Network.ETHEREUM],
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    dexName: 'Uniswap'
  },
  [Network.XRP]: {
    id: Network.XRP,
    name: 'XRP Ledger',
    ticker: 'XRP',
    color: 'from-gray-700 to-gray-900',
    fee: 10,
    gasEstimate: 2,
    walletAddress: ADMIN_WALLETS[Network.XRP],
    logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    dexName: 'First Ledger'
  }
};