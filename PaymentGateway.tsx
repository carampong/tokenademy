import React, { useState, useEffect } from 'react';
import { Network, LiquidityConfig } from './types.ts';
import { NETWORKS } from './constants.ts';
import { Copy, CheckCircle, Wallet, Loader2, AlertTriangle, Plus } from 'lucide-react';

interface PaymentGatewayProps {
  network: Network;
  liquidityConfig: LiquidityConfig;
  adminWalletAddress: string;
  onPaymentConfirmed: () => void;
  onBack: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  network, 
  liquidityConfig, 
  adminWalletAddress, 
  onPaymentConfirmed, 
  onBack 
}) => {
  const config = NETWORKS[network];
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const totalAmount = config.fee + config.gasEstimate + (liquidityConfig.pairingAmount || 0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = () => {
    setIsVerifying(true);
    // Simulation of checking blockchain for transaction
    setTimeout(() => {
        setIsVerifying(false);
        onPaymentConfirmed();
    }, 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Fund Deployment & Liquidity</h2>
        <p className="text-gray-400">Send the total amount to the address below to deploy and list your token.</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
            <span className="text-gray-400">Platform Fee</span>
            <span className="text-white font-mono">{config.fee} {config.ticker}</span>
        </div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
            <span className="text-gray-400">Network Gas (Est.)</span>
            <span className="text-white font-mono">{config.gasEstimate} {config.ticker}</span>
        </div>
        {liquidityConfig.pairingAmount > 0 && (
             <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
                <span className="text-brand-400 flex items-center gap-2"><Plus size={14} /> Initial Liquidity</span>
                <span className="text-white font-mono">{liquidityConfig.pairingAmount} {config.ticker}</span>
            </div>
        )}
        <div className="flex items-center justify-between text-lg font-bold text-brand-500 pt-1">
            <span>Total to Send</span>
            <span>{totalAmount.toFixed(4)} {config.ticker}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 flex flex-col items-center gap-4 text-center">
        <div className="bg-white p-2 rounded-lg">
            {/* Placeholder QR Code */}
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-900 font-mono text-xs break-all p-2">
                QR_CODE_FOR_{adminWalletAddress.slice(0, 6)}
            </div>
        </div>
        
        <div className="w-full">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Deposit Address ({config.ticker})</label>
            <div 
                onClick={copyToClipboard}
                className="flex items-center justify-between bg-black/50 border border-gray-600 rounded-lg p-3 cursor-pointer hover:border-brand-500 transition-colors group"
            >
                <code className="text-sm text-gray-300 font-mono truncate mr-2">
                    {adminWalletAddress}
                </code>
                <div className="text-gray-500 group-hover:text-brand-500">
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
        <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
        <p className="text-xs text-yellow-200/80">
            Ensure you are sending on the <strong>{config.name} Mainnet</strong>. The liquidity portion will be automatically routed to the {config.dexName} contract.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
            onClick={handleVerifyPayment}
            disabled={isVerifying}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-wait text-white py-4 rounded-lg font-bold shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2 transition-all"
        >
            {isVerifying ? (
                <>
                    <Loader2 className="animate-spin" /> Verifying Transaction...
                </>
            ) : (
                <>
                    <Wallet size={20} /> I Have Sent The Payment
                </>
            )}
        </button>
        <button
          onClick={onBack}
          disabled={isVerifying}
          className="text-gray-500 hover:text-white text-sm py-2 transition-colors"
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;