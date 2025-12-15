import React from 'react';
import { LiquidityConfig, Network, TokenDetails } from './types.ts';
import { NETWORKS } from './constants.ts';
import { ArrowLeft, ArrowRight, Lock, TrendingUp, Info } from 'lucide-react';

interface LiquidityFormProps {
  liquidityData: LiquidityConfig;
  tokenData: TokenDetails;
  network: Network;
  onChange: (data: LiquidityConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const LiquidityForm: React.FC<LiquidityFormProps> = ({ 
  liquidityData, 
  tokenData, 
  network, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const config = NETWORKS[network];
  
  // Simple calculation for display purposes
  const marketCapEstimate = liquidityData.pairingAmount > 0 
    ? (liquidityData.pairingAmount / (liquidityData.supplyPercentage / 100)) 
    : 0;

  const handleInputChange = (field: keyof LiquidityConfig, value: any) => {
    onChange({ ...liquidityData, [field]: value });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Liquidity & Listing</h2>
        <p className="text-gray-400">Control your listing on {config.dexName} and manage your pool.</p>
      </div>

      <div className="space-y-6">
        {/* Pairing Amount */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                Initial Liquidity ({config.ticker})
                <span className="text-xs text-brand-500 bg-brand-900/20 px-2 py-0.5 rounded-full">Required for Listing</span>
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={liquidityData.pairingAmount}
                    onChange={(e) => handleInputChange('pairingAmount', parseFloat(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-16"
                    placeholder="0.5"
                    step="0.1"
                />
                <div className="absolute right-3 top-3 text-gray-500 font-bold">{config.ticker}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                This amount will be paired with your tokens to create the initial trading pool.
            </p>
        </div>

        {/* Supply Percentage Slider */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Supply to Liquidity Pool</label>
                <span className="text-brand-400 font-bold">{liquidityData.supplyPercentage}%</span>
            </div>
            <input
                type="range"
                min="10"
                max="100"
                value={liquidityData.supplyPercentage}
                onChange={(e) => handleInputChange('supplyPercentage', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{(tokenData.supply * (liquidityData.supplyPercentage / 100)).toLocaleString()} {tokenData.symbol}</span>
                <span>Remaining: {(tokenData.supply * ((100 - liquidityData.supplyPercentage) / 100)).toLocaleString()} {tokenData.symbol}</span>
            </div>
        </div>

        {/* Market Stats Preview */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
            <div>
                <p className="text-xs text-indigo-300 mb-1">Est. Initial Market Cap</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                    {marketCapEstimate.toFixed(2)} {config.ticker}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-indigo-300 mb-1">Listing On</p>
                <p className="text-lg font-bold text-white flex items-center gap-1 justify-end">
                    <TrendingUp size={16} /> {config.dexName}
                </p>
            </div>
        </div>

        {/* Lock Settings */}
        <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${liquidityData.lockLiquidity ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                    <Lock size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-white">Lock Liquidity</h4>
                    <p className="text-xs text-gray-500">Prevents rug-pulls, increases trust.</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={liquidityData.lockLiquidity}
                    onChange={(e) => handleInputChange('lockLiquidity', e.target.checked)}
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={onNext}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${liquidityData.pairingAmount > 0
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
          disabled={liquidityData.pairingAmount <= 0}
        >
          Proceed to Payment <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LiquidityForm;