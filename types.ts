
export enum Network {
  SOLANA = 'SOLANA',
  ETHEREUM = 'ETHEREUM',
  XRP = 'XRP'
}

export interface TokenDetails {
  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  description: string;
  website?: string;
  logo?: File | null;
}

export interface LiquidityConfig {
  pairingAmount: number; // Amount of native currency (SOL/ETH) to pair
  supplyPercentage: number; // Percentage of token supply to LP
  lockLiquidity: boolean;
  lockDurationDays: number;
}

export interface NetworkConfig {
  id: Network;
  name: string;
  ticker: string;
  color: string;
  fee: number; // Service fee in native currency
  gasEstimate: number; // Estimated gas in native currency
  walletAddress: string; // Your receiving wallet address
  logoUrl: string;
  dexName: string; // Name of the primary DEX
}

export enum Step {
  SELECT_NETWORK = 1,
  TOKEN_DETAILS = 2,
  LIQUIDITY = 3,
  PAYMENT = 4,
  PAYMENT_VERIFICATION = 5,
  DEPLOYMENT = 6,
  SUCCESS = 7
}
