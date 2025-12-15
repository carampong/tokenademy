import React, { useState, useEffect } from 'react';
import { TokenDetails, Network } from '../types.ts';
import { NETWORKS } from '../constants.ts';
import { generateTokenContent } from '../services/geminiService.ts';
import { Sparkles, Loader2, ArrowRight, ArrowLeft, Upload, Eye } from 'lucide-react';

interface TokenFormProps {
  data: TokenDetails;
  network: Network;
  onChange: (data: TokenDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ data, network, onChange, onNext, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'meme' | 'serious'>('serious');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const networkConfig = NETWORKS[network];

  useEffect(() => {
    if (data.logo) {
      const objectUrl = URL.createObjectURL(data.logo);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLogoPreview(null);
    }
  }, [data.logo]);

  const handleInputChange = (field: keyof TokenDetails, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAiGenerate = async () => {
    if (!data.name || !data.symbol) {
        alert("Please enter a name and symbol first.");
        return;
    }
    setIsGenerating(true);
    const description = await generateTokenContent(data.name, data.symbol, generationType);
    handleInputChange('description', description);
    setIsGenerating(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Token Details</h2>
        <p className="text-gray-400">Configure your asset on the {networkConfig.name} network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Form Inputs */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Token Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Bitcoin"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Symbol (Ticker)</label>
                <input
                  type="text"
                  value={data.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                  placeholder="e.g. BTC"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Supply</label>
                <input
                  type="number"
                  value={data.supply}
                  onChange={(e) => handleInputChange('supply', parseInt(e.target.value))}
                  placeholder="1000000000"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Decimals</label>
                <input
                  type="number"
                  value={data.decimals}
                  onChange={(e) => handleInputChange('decimals', parseInt(e.target.value))}
                  placeholder="Usually 9 or 18"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
               <div className="flex justify-between items-end mb-1">
                 <label className="block text-sm font-medium text-gray-400">Description</label>
                 <div className="flex items-center gap-2 bg-gray-800 rounded-md p-1">
                    <button 
                        onClick={() => setGenerationType('serious')}
                        className={`text-xs px-2 py-1 rounded ${generationType === 'serious' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Pro
                    </button>
                    <button 
                        onClick={() => setGenerationType('meme')}
                        className={`text-xs px-2 py-1 rounded ${generationType === 'meme' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Meme
                    </button>
                 </div>
               </div>
               
               <div className="relative">
                 <textarea
                   rows={4}
                   value={data.description}
                   onChange={(e) => handleInputChange('description', e.target.value)}
                   className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-12 resize-none"
                   placeholder="Describe your token's utility or meme potential..."
                 />
                 <button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !data.name}
                    className="absolute right-3 top-3 text-brand-500 hover:text-brand-400 disabled:opacity-50 transition-colors"
                    title="Generate with Gemini AI"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                 </button>
               </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Token Logo (Optional)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer bg-gray-900/30 group">
                    <div className="relative">
                         <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm">Click to upload image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleInputChange('logo', e.target.files?.[0])} />
                </div>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={16} className="text-brand-500" />
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Live Preview</h3>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-brand-500/30 transition-all flex-grow flex flex-col items-center justify-center text-center">
                    {/* Background effects */}
                    <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br ${networkConfig.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-all`}></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all"></div>
                    
                    <div className="relative z-10 w-full flex flex-col items-center h-full">
                        {/* Logo Preview */}
                        <div className="relative mb-6">
                            <div className="w-28 h-28 rounded-full bg-gray-800 border-4 border-gray-900 shadow-xl flex items-center justify-center overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Token Logo" className="w-full h-full object-cover" />
                                ) : (
                                     <span className="text-4xl font-bold text-gray-700">
                                        {data.name ? data.name[0].toUpperCase() : '?'}
                                     </span>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-gray-900 rounded-full p-1.5 border border-gray-800 shadow-sm" title={networkConfig.name}>
                                 <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${networkConfig.color}`}></div>
                            </div>
                        </div>

                        {/* Token Name & Symbol */}
                        <h3 className="text-2xl font-bold text-white break-all max-w-full">
                            {data.name || 'Token Name'}
                        </h3>
                        <p className="text-brand-500 font-mono font-bold text-lg mb-8">
                            ${data.symbol || 'TICKER'}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="bg-black/40 p-3 rounded-lg border border-gray-800 backdrop-blur-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Supply</p>
                                <p className="text-sm font-mono text-gray-200 truncate" title={data.supply.toString()}>{data.supply.toLocaleString()}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-gray-800 backdrop-blur-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Decimals</p>
                                <p className="text-sm font-mono text-gray-200">{data.decimals}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="w-full bg-black/20 rounded-xl p-4 border border-gray-800/50 flex-grow text-left">
                             <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">About Asset</p>
                             <div className="text-sm text-gray-400 leading-relaxed break-words h-full overflow-hidden text-ellipsis line-clamp-4">
                                {data.description || <span className="italic opacity-50">Token description will appear here...</span>}
                             </div>
                        </div>
                    </div>
                </div>
          </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.name || !data.symbol || !data.supply}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${data.name && data.symbol 
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
        >
          Proceed to Payment <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TokenForm;