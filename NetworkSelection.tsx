import React from 'react';
import { Network, NetworkConfig } from './types.ts';
import { NETWORKS } from './constants.ts';
import { Check, ArrowRight } from 'lucide-react';

interface NetworkSelectionProps {
  selectedNetwork: Network | null;
  onSelect: (network: Network) => void;
  onNext: () => void;
}

const NetworkSelection: React.FC<NetworkSelectionProps> = ({ selectedNetwork, onSelect, onNext }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Network</h2>
        <p className="text-gray-400">Select the blockchain where you want to deploy your token.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.values(NETWORKS) as NetworkConfig[]).map((network) => (
          <button
            key={network.id}
            onClick={() => onSelect(network.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 group
              ${selectedNetwork === network.id 
                ? 'border-brand-500 bg-brand-950/30 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
                : 'border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50'}
            `}
          >
            {selectedNetwork === network.id && (
              <div className="absolute top-3 right-3 text-brand-500">
                <Check size={20} />
              </div>
            )}
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${network.color}`}>
               {/* Using ticker text as fallback for actual images if they fail, but styling handles the circle */}
               <span className="text-xl font-bold text-white">{network.ticker[0]}</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{network.name}</h3>
              <p className="text-xs text-gray-400 mt-1">Fee: {network.fee} {network.ticker}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-8">
        <button
          onClick={onNext}
          disabled={!selectedNetwork}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${selectedNetwork 
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
        >
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default NetworkSelection;