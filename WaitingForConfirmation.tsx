
import React from 'react';
import { Loader2, ShieldCheck, Clock } from 'lucide-react';

const WaitingForConfirmation: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-center py-12">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative bg-gray-900 border-2 border-brand-500/50 p-6 rounded-full">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-gray-800 border border-gray-700 p-2 rounded-full">
            <Clock className="w-5 h-5 text-yellow-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">Payment Verification in Progress</h2>
      
      <div className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <p className="text-gray-300 mb-4">
            We have received your request. Our system is currently scanning the blockchain for your transaction.
        </p>
        <div className="flex items-center gap-3 text-sm text-yellow-500 bg-yellow-900/10 p-3 rounded-lg border border-yellow-900/30">
            <ShieldCheck size={18} className="shrink-0" />
            <span className="text-left">Manual verification may be required for large liquidity amounts. Do not close this tab.</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 animate-pulse">
        Status: Pending Admin Approval...
      </p>
    </div>
  );
};

export default WaitingForConfirmation;
