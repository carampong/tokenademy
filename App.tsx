import React, { useState } from 'react';
import { Step, Network, TokenDetails, LiquidityConfig } from './types';
import { NETWORKS, ADMIN_WALLETS } from './constants';
import NetworkSelection from '.NetworkSelection';
import TokenForm from '.TokenForm';
import LiquidityForm from '.LiquidityForm';
import PaymentGateway from '.PaymentGateway';
import DeploymentLog from '.DeploymentLog';
import WaitingForConfirmation from '.WaitingForConfirmation';
import AdminPanel from '.AdminPanel';
import { Rocket, ShieldCheck, Coins, Menu, X, Wallet, Mail, HelpCircle, LineChart, Lock, Github } from 'lucide-react';

type View = 'LAUNCHPAD' | 'HOW_IT_WORKS' | 'PRICING' | 'SUPPORT' | 'ADMIN';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECT_NETWORK);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [view, setView] = useState<View>('LAUNCHPAD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Admin Wallet State
  const [adminWallets, setAdminWallets] = useState(ADMIN_WALLETS);
  
  const [tokenData, setTokenData] = useState<TokenDetails>({
    name: '',
    symbol: '',
    supply: 1000000000,
    decimals: 9,
    description: '',
  });

  const [liquidityData, setLiquidityData] = useState<LiquidityConfig>({
      pairingAmount: 0,
      supplyPercentage: 100,
      lockLiquidity: true,
      lockDurationDays: 365
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const reset = () => {
    setCurrentStep(Step.SELECT_NETWORK);
    setSelectedNetwork(null);
    setTokenData({
        name: '',
        symbol: '',
        supply: 1000000000,
        decimals: 9,
        description: '',
    });
    setLiquidityData({
        pairingAmount: 0,
        supplyPercentage: 100,
        lockLiquidity: true,
        lockDurationDays: 365
    });
    setView('LAUNCHPAD');
  };

  const handleConnectWallet = () => {
    alert("Wallet connection is currently simulated for the deployment process in the main app flow.");
  };

  // Admin Actions
  const handleAdminApprove = () => {
      // Move flow from VERIFICATION to DEPLOYMENT
      setCurrentStep(Step.DEPLOYMENT);
      setView('LAUNCHPAD'); // Switch view back to main so user sees deployment
  };

  const handleAdminReject = () => {
      alert("Order rejected. The user would typically be refunded.");
      reset();
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.SELECT_NETWORK:
        return (
          <NetworkSelection 
            selectedNetwork={selectedNetwork} 
            onSelect={setSelectedNetwork} 
            onNext={nextStep} 
          />
        );
      case Step.TOKEN_DETAILS:
        return (
          <TokenForm 
            data={tokenData} 
            network={selectedNetwork!} 
            onChange={setTokenData} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case Step.LIQUIDITY:
          return (
            <LiquidityForm
                liquidityData={liquidityData}
                tokenData={tokenData}
                network={selectedNetwork!}
                onChange={setLiquidityData}
                onNext={nextStep}
                onBack={prevStep}
            />
          );
      case Step.PAYMENT:
        return (
          <PaymentGateway 
            network={selectedNetwork!} 
            liquidityConfig={liquidityData}
            adminWalletAddress={adminWallets[selectedNetwork!]}
            onPaymentConfirmed={nextStep} // Goes to PAYMENT_VERIFICATION
            onBack={prevStep}
          />
        );
      case Step.PAYMENT_VERIFICATION:
        return (
            <WaitingForConfirmation />
        );
      case Step.DEPLOYMENT:
        return (
          <DeploymentLog 
            data={tokenData} 
            network={selectedNetwork!}
            liquidityConfig={liquidityData} 
            onComplete={nextStep} 
          />
        );
      case Step.SUCCESS:
        const config = selectedNetwork ? NETWORKS[selectedNetwork] : null;
        return (
            <div className="text-center animate-in zoom-in-95 duration-700 py-10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="text-green-500" size={48} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Token Live!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    <strong>{tokenData.name} ({tokenData.symbol})</strong> has been deployed and listed on {config?.dexName}.
                </p>
                
                <div className="grid gap-4 max-w-md mx-auto mb-8">
                     <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                        <code className="text-brand-400 font-mono text-sm break-all">
                            0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                        </code>
                    </div>
                    
                    <a 
                        href={`https://dexscreener.com/${config?.name.toLowerCase()}/0x71C7656EC7ab88b098defB751B7401B5f6d8976F`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl border border-gray-700 hover:border-brand-500 transition-all group"
                    >
                         <LineChart size={24} className="text-brand-500 group-hover:scale-110 transition-transform" />
                         <span className="font-bold text-lg">View on DEX Screener</span>
                    </a>
                </div>

                <button 
                    onClick={reset}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    Create Another Token
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'LAUNCHPAD':
        return (
          <>
            {/* Step Indicator */}
            {currentStep < Step.SUCCESS && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500 hidden sm:block">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-900 -z-10"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 -z-10 transition-all duration-500" style={{ width: `${((currentStep - 1) / 5) * 100}%` }}></div>
                        
                        {[1, 2, 3, 4, 5, 6].map((step) => (
                            <div 
                                key={step} 
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300
                                    ${step <= currentStep 
                                        ? 'bg-brand-600 border-black text-white' 
                                        : 'bg-gray-900 border-black text-gray-600'}
                                `}
                            >
                                {step < currentStep ? <ShieldCheck size={18} /> : step}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className={currentStep >= 1 ? 'text-brand-500' : ''}>Network</span>
                        <span className={currentStep >= 2 ? 'text-brand-500' : ''}>Details</span>
                        <span className={currentStep >= 3 ? 'text-brand-500' : ''}>Liquidity</span>
                        <span className={currentStep >= 4 ? 'text-brand-500' : ''}>Payment</span>
                        <span className={currentStep >= 5 ? 'text-brand-500' : ''}>Verify</span>
                        <span className={currentStep >= 6 ? 'text-brand-500' : ''}>Deploy</span>
                    </div>
                </div>
            )}

            {/* Mobile Step Indicator (Simplified) */}
             {currentStep < Step.SUCCESS && (
                <div className="mb-8 sm:hidden text-center">
                    <span className="text-brand-500 font-bold">Step {currentStep}</span> <span className="text-gray-500">of 6</span>
                </div>
            )}

            {/* Wizard Card */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl ring-1 ring-white/5">
                {renderStep()}
            </div>
          </>
        );
        
      case 'ADMIN':
          return (
              <AdminPanel 
                // We pass the current state as "pending order" if step is verification
                pendingOrder={currentStep === Step.PAYMENT_VERIFICATION && selectedNetwork ? {
                    token: tokenData,
                    network: selectedNetwork,
                    liquidity: liquidityData
                } : null}
                currentWallets={adminWallets}
                onUpdateWallets={setAdminWallets}
                onApprove={handleAdminApprove}
                onReject={handleAdminReject}
                onLogout={() => setView('LAUNCHPAD')}
              />
          );

      case 'HOW_IT_WORKS':
        return (
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
             <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="bg-brand-900/30 w-12 h-12 rounded-lg flex items-center justify-center text-brand-500 mb-4 font-bold text-xl">1</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select Network</h3>
                    <p className="text-gray-400">Choose between Solana, Ethereum, or XRP. Each has different benefits in terms of speed and ecosystem.</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="bg-brand-900/30 w-12 h-12 rounded-lg flex items-center justify-center text-brand-500 mb-4 font-bold text-xl">2</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Configure Token</h3>
                    <p className="text-gray-400">Define your name, symbol, and supply. Use our AI assistant to generate professional descriptions automatically.</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="bg-brand-900/30 w-12 h-12 rounded-lg flex items-center justify-center text-brand-500 mb-4 font-bold text-xl">3</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Fund Deployment</h3>
                    <p className="text-gray-400">Pay a small one-time fee plus liquidity. Our admin team verifies the transaction on-chain for security.</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="bg-brand-900/30 w-12 h-12 rounded-lg flex items-center justify-center text-brand-500 mb-4 font-bold text-xl">4</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Launch</h3>
                    <p className="text-gray-400">Once confirmed, our system deploys the smart contract and adds liquidity to the DEX automatically.</p>
                </div>
             </div>
             <div className="mt-12 text-center">
                 <button onClick={() => setView('LAUNCHPAD')} className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg font-semibold">Start Building</button>
             </div>
          </div>
        );

      case 'PRICING':
        return (
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
             <h2 className="text-3xl font-bold text-white mb-4 text-center">Transparent Pricing</h2>
             <p className="text-center text-gray-400 mb-12">Pay per deployment. No recurring fees.</p>
             
             <div className="grid md:grid-cols-3 gap-6">
                {Object.values(NETWORKS).map((net) => (
                    <div key={net.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-brand-500/50 transition-colors relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${net.color}`}></div>
                        <h3 className="text-xl font-bold text-white mb-2">{net.name}</h3>
                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-3xl font-bold text-brand-400">{net.fee}</span>
                            <span className="text-sm font-bold text-gray-500 mb-1">{net.ticker}</span>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-400 mb-8">
                            <li className="flex items-center gap-2"><CheckCircleIcon /> Contract Deployment</li>
                            <li className="flex items-center gap-2"><CheckCircleIcon /> Source Code Verified</li>
                            <li className="flex items-center gap-2"><CheckCircleIcon /> Ownership Transfer</li>
                            <li className="flex items-center gap-2"><CheckCircleIcon /> Manual Verification</li>
                        </ul>
                        <button onClick={() => { setSelectedNetwork(net.id); setCurrentStep(Step.TOKEN_DETAILS); setView('LAUNCHPAD'); }} className="w-full bg-gray-800 hover:bg-brand-600 text-white py-2 rounded-lg font-medium transition-colors">
                            Launch on {net.name}
                        </button>
                    </div>
                ))}
             </div>
          </div>
        );

      case 'SUPPORT':
        return (
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Contact Support</h2>
                <p className="text-gray-400">Need help deploying? Our team is available 24/7.</p>
             </div>
             
             <div className="space-y-6">
                 <div className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4">
                     <div className="bg-blue-900/30 p-3 rounded-full text-blue-400"><Mail /></div>
                     <div>
                         <h4 className="font-semibold text-white">Email Us</h4>
                         <p className="text-gray-400 text-sm">support@tokenademy.io</p>
                     </div>
                 </div>
                 <div className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4">
                     <div className="bg-purple-900/30 p-3 rounded-full text-purple-400"><HelpCircle /></div>
                     <div>
                         <h4 className="font-semibold text-white">Documentation</h4>
                         <p className="text-gray-400 text-sm">Read our deployment guides</p>
                     </div>
                 </div>
             </div>

             <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                 <button onClick={() => setView('LAUNCHPAD')} className="text-gray-500 hover:text-white transition-colors">Back to Home</button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-500 selection:text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setView('LAUNCHPAD')}
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                 <Coins size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TOKENADEMY</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                <button 
                    onClick={() => setView('HOW_IT_WORKS')}
                    className={`hover:text-brand-500 transition-colors ${view === 'HOW_IT_WORKS' ? 'text-brand-500' : ''}`}
                >
                    How it Works
                </button>
                <button 
                    onClick={() => setView('PRICING')}
                    className={`hover:text-brand-500 transition-colors ${view === 'PRICING' ? 'text-brand-500' : ''}`}
                >
                    Pricing
                </button>
                <button 
                    onClick={() => setView('SUPPORT')}
                    className={`hover:text-brand-500 transition-colors ${view === 'SUPPORT' ? 'text-brand-500' : ''}`}
                >
                    Support
                </button>
                <button 
                    onClick={handleConnectWallet}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                    <Wallet size={16} /> Connect Wallet
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden text-gray-400">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
             <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 space-y-4">
                <button onClick={() => { setView('HOW_IT_WORKS'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-2">How it Works</button>
                <button onClick={() => { setView('PRICING'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-2">Pricing</button>
                <button onClick={() => { setView('SUPPORT'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-2">Support</button>
             </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
             <div className="flex justify-center items-center gap-4 mb-4">
                 <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                     <Github size={20} />
                 </a>
             </div>
             <p className="text-gray-600 text-sm">© 2024 TOKENADEMY. All rights reserved.</p>
             <p className="text-gray-700 text-xs mt-2 mb-4">Trusted by 10,000+ creators. Audited contracts.</p>
             
             {/* Admin Login Link (Hidden/Discrete) */}
             <button 
                onClick={() => setView('ADMIN')}
                className="text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-1 mx-auto text-[10px]"
             >
                <Lock size={10} /> Admin Login
             </button>
        </div>
      </footer>
    </div>
  );
};

// Helper for pricing icons
const CheckCircleIcon = () => (
    <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default App;
