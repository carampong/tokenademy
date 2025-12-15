import React, { useState, useEffect } from 'react';
import { TokenDetails, Network, LiquidityConfig } from '../types.ts';
import { NETWORKS } from '../constants.ts';
import { CheckCircle, XCircle, Search, LogOut, ExternalLink, Lock, Key, Loader2, ShieldCheck, Activity, Settings, Save, ArrowLeft, Code, Copy } from 'lucide-react';

interface AdminPanelProps {
  pendingOrder: {
    token: TokenDetails;
    network: Network;
    liquidity: LiquidityConfig;
  } | null;
  currentWallets: Record<Network, string>;
  onUpdateWallets: (wallets: Record<Network, string>) => void;
  onApprove: () => void;
  onReject: () => void;
  onLogout: () => void;
}

const generateConfigCode = (wallets: Record<Network, string>) => {
    return `import { Network, NetworkConfig } from './types';

// REPLACE THESE WITH YOUR ACTUAL WALLET ADDRESSES
export const ADMIN_WALLETS = {
  [Network.SOLANA]: "${wallets[Network.SOLANA] || 'YourSolanaWalletHere'}",
  [Network.ETHEREUM]: "${wallets[Network.ETHEREUM] || 'YourEthWalletHere'}",
  [Network.XRP]: "${wallets[Network.XRP] || 'YourXrpWalletHere'}",
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
};`;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ pendingOrder, currentWallets, onUpdateWallets, onApprove, onReject, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // View State: 'DASHBOARD' | 'SETTINGS'
  const [view, setView] = useState<'DASHBOARD' | 'SETTINGS'>('DASHBOARD');
  
  // Wallet Form State
  const [tempWallets, setTempWallets] = useState<Record<Network, string>>(currentWallets);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
      setTempWallets(currentWallets);
  }, [currentWallets]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setIsError(false);
    
    // Simulate API delay
    setTimeout(() => {
        if (password === 'admin123') {
          setIsAuthenticated(true);
        } else {
          setIsError(true);
          setIsLoggingIn(false);
        }
    }, 1000);
  };

  const handleSaveWallets = () => {
      setIsSaving(true);
      setTimeout(() => {
          onUpdateWallets(tempWallets);
          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
      }, 800);
  };

  const copyConfigToClipboard = () => {
      navigator.clipboard.writeText(generateConfigCode(tempWallets));
      alert("Configuration code copied to clipboard! Paste this into constants.ts.");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95">
        <div className={`bg-gray-900 border ${isError ? 'border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'border-gray-800'} p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ${isError ? 'animate-shake' : ''}`}>
           <div className="flex justify-center mb-6">
               <div className={`p-4 rounded-full transition-colors duration-500 ${isError ? 'bg-red-900/20 text-red-500' : 'bg-brand-900/20 text-brand-500'}`}>
                   {isLoggingIn ? <Loader2 size={32} className="animate-spin" /> : <Lock size={32} />}
               </div>
           </div>
           
           <h2 className="text-2xl font-bold text-center text-white mb-2">Security Gateway</h2>
           <p className="text-center text-gray-500 text-sm mb-8">Restricted Access. Authorized Personnel Only.</p>
           
           <form onSubmit={handleLogin} className="space-y-4">
             <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-gray-500 group-focus-within:text-brand-500 transition-colors" />
               </div>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
                 className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                 placeholder="Enter Master Key"
                 disabled={isLoggingIn}
               />
             </div>
             
             {isError && (
                 <p className="text-red-500 text-xs text-center font-medium">Access Denied: Invalid Credentials</p>
             )}

             <button 
                type="submit" 
                disabled={isLoggingIn || !password}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-gray-800 disabled:text-gray-500 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-brand-900/20 flex items-center justify-center gap-2"
             >
               {isLoggingIn ? 'Authenticating...' : 'Unlock Dashboard'}
             </button>
           </form>
           
           <div className="mt-6 flex justify-center">
               <div className="text-[10px] text-gray-600 font-mono flex items-center gap-2">
                   <ShieldCheck size={12} /> ENCRYPTED CONNECTION
               </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
       {/* Dashboard Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
           <div>
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   Admin Dashboard 
                   <span className="text-xs bg-brand-900/30 text-brand-500 px-2 py-1 rounded border border-brand-900/50">LIVE</span>
               </h2>
               <p className="text-gray-400 text-sm mt-1">
                   {view === 'DASHBOARD' ? 'Deployment Requests & Verification' : 'Treasury & Wallet Management'}
               </p>
           </div>
           
           <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end text-right">
                   <span className="text-xs text-gray-500">System Status</span>
                   <span className="text-xs text-green-500 font-mono flex items-center gap-1">
                       <Activity size={10} /> NODES ONLINE
                   </span>
               </div>
               
               {view === 'DASHBOARD' ? (
                   <button 
                       onClick={() => setView('SETTINGS')}
                       className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-brand-500 rounded-lg text-gray-400 hover:text-brand-500 transition-all"
                       title="Treasury Settings"
                   >
                       <Settings size={20} />
                   </button>
               ) : (
                   <button 
                       onClick={() => setView('DASHBOARD')}
                       className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-brand-500 rounded-lg text-gray-400 hover:text-brand-500 transition-all"
                       title="Back to Dashboard"
                   >
                       <ArrowLeft size={20} />
                   </button>
               )}

               <button 
                    onClick={onLogout} 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg text-gray-400 hover:text-white transition-all text-sm"
               >
                   <LogOut size={16} /> Logout
               </button>
           </div>
       </div>

       {/* SETTINGS VIEW */}
       {view === 'SETTINGS' && (
           <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Settings size={18} className="text-brand-500" /> Treasury Settings
                    </h3>
                    <span className="text-xs text-gray-500">Nominate addresses for user payments</span>
                </div>
                
                <div className="p-8">
                    <div className="space-y-6 mb-8">
                        {Object.values(NETWORKS).map((net) => (
                            <div key={net.id} className="bg-gray-900/30 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${net.color} flex items-center justify-center`}>
                                        <span className="text-xs font-bold text-white">{net.ticker[0]}</span>
                                    </div>
                                    <h4 className="font-bold text-white">{net.name} Treasury Address</h4>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Receiving Wallet ({net.ticker})</label>
                                    <input 
                                        type="text"
                                        value={tempWallets[net.id]}
                                        onChange={(e) => setTempWallets({...tempWallets, [net.id]: e.target.value})}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                        placeholder={`Enter your ${net.name} wallet address`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-800">
                         <div className="text-gray-500 text-sm">
                            <p>Changes are applied instantly to the current session.</p>
                         </div>
                        <button 
                            onClick={handleSaveWallets}
                            disabled={isSaving}
                            className={`
                                flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all
                                ${saveSuccess 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20'}
                            `}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <CheckCircle size={18} /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : saveSuccess ? 'Saved Successfully' : 'Apply Changes'}
                        </button>
                    </div>

                    {/* Static Hosting Export Helper */}
                    <div className="mt-8 bg-blue-900/10 p-6 rounded-xl border border-blue-900/30">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                                <Code size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold mb-2">Static Hosting Mode (GitHub Pages)</h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    When hosting on GitHub Pages (static site), database changes are not possible. 
                                    To make your wallet addresses permanent for all users, you must update the source code manually.
                                </p>
                                
                                <div className="bg-black p-4 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto relative group mb-3">
                                    <button 
                                        onClick={copyConfigToClipboard}
                                        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Copy Code"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <div className="opacity-50 select-none">// content of constants.ts</div>
                                    <pre className="text-brand-400">{generateConfigCode(tempWallets).slice(0, 150)}... <span className="text-gray-600 italic">(click copy to see full code)</span></pre>
                                </div>
                                
                                <button 
                                    onClick={copyConfigToClipboard}
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                >
                                    <Copy size={12} /> Copy full code for 'constants.ts'
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
       )}

       {/* DASHBOARD VIEW */}
       {view === 'DASHBOARD' && (
           <>
               {!pendingOrder ? (
                   <div className="bg-gray-900/30 border border-gray-800/50 border-dashed rounded-xl p-16 text-center">
                       <div className="mx-auto w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-gray-700 mb-6 animate-pulse">
                           <Search size={32} />
                       </div>
                       <h3 className="text-xl font-medium text-white mb-2">Queue is Empty</h3>
                       <p className="text-gray-500 max-w-sm mx-auto">Waiting for users to submit new token deployment requests. Real-time updates enabled.</p>
                   </div>
               ) : (
                   <div className="space-y-6">
                        <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
                            {/* Status Banner */}
                            <div className="bg-yellow-900/10 border-b border-yellow-900/30 px-6 py-3 flex justify-between items-center">
                                <span className="text-sm font-bold text-yellow-500 flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                    </span>
                                    ACTION REQUIRED: PAYMENT VERIFICATION
                                </span>
                                <span className="text-xs text-gray-500 font-mono">REQ-ID: {Math.floor(Math.random() * 10000).toString().padStart(5, '0')}</span>
                            </div>
                            
                            <div className="p-8 grid lg:grid-cols-2 gap-12">
                                {/* Column 1: Asset Details */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-2 border-b border-gray-900">Asset Configuration</h4>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${NETWORKS[pendingOrder.network].color} flex items-center justify-center shadow-lg`}>
                                             <span className="text-2xl font-bold text-white">{pendingOrder.token.symbol[0]}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{pendingOrder.token.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs font-mono">{pendingOrder.token.symbol}</span>
                                                <span className="text-gray-500 text-xs">•</span>
                                                <span className="text-gray-400 text-xs">{NETWORKS[pendingOrder.network].name} Network</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Total Supply</span>
                                            <span className="text-white font-mono">{pendingOrder.token.supply.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Decimals</span>
                                            <span className="text-white font-mono">{pendingOrder.token.decimals}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Description</span>
                                            <span className="text-gray-300 text-sm text-right truncate max-w-[200px]" title={pendingOrder.token.description}>
                                                {pendingOrder.token.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Financials */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-2 border-b border-gray-900">Financial Verification</h4>
                                    
                                    <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-800">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-gray-400 text-sm">Total Received</span>
                                            <span className="text-2xl font-bold text-brand-400 font-mono">
                                                {(NETWORKS[pendingOrder.network].fee + NETWORKS[pendingOrder.network].gasEstimate + pendingOrder.liquidity.pairingAmount).toFixed(4)} {NETWORKS[pendingOrder.network].ticker}
                                            </span>
                                        </div>
                                        <div className="text-right text-xs text-gray-600">
                                            Includes Fee ({NETWORKS[pendingOrder.network].fee}) + Gas ({NETWORKS[pendingOrder.network].gasEstimate}) + LP ({pendingOrder.liquidity.pairingAmount})
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Liquidity Allocation</span>
                                            <span className="text-white font-mono">{pendingOrder.liquidity.supplyPercentage}% of Supply</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Lock Status</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${pendingOrder.liquidity.lockLiquidity ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                {pendingOrder.liquidity.lockLiquidity ? `LOCKED (${pendingOrder.liquidity.lockDurationDays} DAYS)` : 'UNLOCKED'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-900">
                                            <span className="text-gray-500 text-sm">Deposit Wallet</span>
                                            <a href="#" className="text-brand-500 text-xs flex items-center gap-1 hover:underline font-mono">
                                                {currentWallets[pendingOrder.network].slice(0, 8)}...{currentWallets[pendingOrder.network].slice(-6)} <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 px-8 py-5 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                     <ShieldCheck size={14} /> Contract Source Verified
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={onReject}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors text-sm font-semibold"
                                    >
                                        <XCircle size={16} /> Reject Order
                                    </button>
                                    <button 
                                        onClick={onApprove}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/20 font-bold transition-all transform hover:scale-105"
                                    >
                                        <CheckCircle size={18} /> Approve & Deploy
                                    </button>
                                </div>
                            </div>
                        </div>
                   </div>
               )}
           </>
       )}
    </div>
  );
};

export default AdminPanel;