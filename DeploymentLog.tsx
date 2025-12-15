import React, { useEffect, useState, useRef } from 'react';
import { TokenDetails, Network, LiquidityConfig } from '../types.ts';
import { NETWORKS } from '../constants.ts';
import { Terminal } from 'lucide-react';

interface DeploymentLogProps {
  data: TokenDetails;
  network: Network;
  liquidityConfig: LiquidityConfig;
  onComplete: () => void;
}

const DeploymentLog: React.FC<DeploymentLogProps> = ({ data, network, liquidityConfig, onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const config = NETWORKS[network];

  const steps = [
    `Initializing connection to ${network} Mainnet...`,
    `Validating wallet balance and gas fees...`,
    `Compiling smart contract bytecode...`,
    `Optimization pass 1/3 completed...`,
    `Optimization pass 2/3 completed...`,
    `Optimization pass 3/3 completed...`,
    `Generating Merkle tree for supply allocation...`,
    `Uploading metadata to IPFS...`,
    `Metadata Hash: QmXyZ...89sD`,
    `Broadcasting transaction to mempool...`,
    `Transaction confirmed in block #18293044`,
    `Minting initial supply of ${data.supply} ${data.symbol}...`,
    `Verifying contract source code...`,
    `Initializing Liquidity Pool on ${config.dexName}...`,
    `Pairing ${liquidityConfig.pairingAmount} ${config.ticker} with ${(data.supply * (liquidityConfig.supplyPercentage / 100)).toLocaleString()} ${data.symbol}...`,
    `Providing initial liquidity... Success`,
    liquidityConfig.lockLiquidity ? `Locking LP tokens for ${liquidityConfig.lockDurationDays} days... Confirmed` : `LP Tokens sent to owner wallet...`,
    `Indexing on DEX Screener...`,
    `Transferring ownership to user wallet...`,
    `Deployment Successful!`
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, `> ${steps[currentStep]}`]);
        setProgress(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
        
        // Auto scroll
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 800); // Speed of logs

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in zoom-in-95 duration-500">
       <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Deploying & Listing</h2>
        <p className="text-gray-400">Please do not close this window.</p>
      </div>

      <div className="bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl font-mono text-sm relative h-96 flex flex-col">
        {/* Terminal Header */}
        <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-2 text-gray-500 flex items-center gap-1">
                <Terminal size={14} /> tokenademy-cli — node
            </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 overflow-y-auto flex-1 text-green-400 space-y-2 scrollbar-hide">
            {logs.map((log, index) => (
                <div key={index} className="break-all opacity-90">
                    {log}
                </div>
            ))}
            <div ref={logsEndRef} />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800 w-full">
            <div 
                className="h-full bg-brand-500 transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-500 uppercase tracking-widest">
          <span>Status: {progress < 100 ? 'Running' : 'Completed'}</span>
          <span>{progress}%</span>
      </div>
    </div>
  );
};

export default DeploymentLog;