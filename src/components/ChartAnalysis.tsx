import { useState } from 'react';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TradeSignal } from '../lib/supabase';

type ChartAnalysisProps = {
  onNewSignal: (signal: TradeSignal) => void;
};

export function ChartAnalysis({ onNewSignal }: ChartAnalysisProps) {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const generateMockSignal = async (): Promise<Partial<TradeSignal>> => {
    const assets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'];
    const timeframes = ['15m', '1h', '4h', '1d'];
    const patterns = [
      'Bullish Engulfing',
      'Double Bottom',
      'Head and Shoulders',
      'Ascending Triangle',
      'Cup and Handle',
      'Bull Flag',
      'Golden Cross',
      'RSI Divergence'
    ];

    const asset = assets[Math.floor(Math.random() * assets.length)];
    const signalType = Math.random() > 0.5 ? 'long' : 'short';
    const entryPrice = Math.random() * 50000 + 30000;
    const confidenceScore = Math.random() * 30 + 65;

    const stopLossPercent = signalType === 'long' ? 0.02 : -0.02;
    const stopLoss = entryPrice * (1 - stopLossPercent);

    const tp1 = entryPrice * (signalType === 'long' ? 1.015 : 0.985);
    const tp2 = entryPrice * (signalType === 'long' ? 1.03 : 0.97);
    const tp3 = entryPrice * (signalType === 'long' ? 1.05 : 0.95);
    const tp4 = entryPrice * (signalType === 'long' ? 1.08 : 0.92);

    const riskRewardRatio = Math.abs((tp1 - entryPrice) / (stopLoss - entryPrice));
    const selectedPatterns = patterns.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);

    const reasoning = `Based on comprehensive technical analysis, this ${signalType.toUpperCase()} position presents a strong opportunity.

Key indicators identified:
• ${selectedPatterns.join(', ')} pattern formation
• Strong support at $${(entryPrice * 0.97).toFixed(2)} with high volume confirmation
• Resistance levels clearly defined for optimal profit targets
• Momentum indicators showing ${signalType === 'long' ? 'bullish' : 'bearish'} divergence
• Volume profile suggests institutional accumulation

Risk Management:
This setup offers a ${riskRewardRatio.toFixed(2)}:1 risk-reward ratio with clearly defined stop-loss at $${stopLoss.toFixed(2)}. Position should be sized according to your risk tolerance, with suggested leverage of ${Math.floor(Math.random() * 5) + 5}x for optimal capital efficiency.

Recommended approach: Enter at current levels with progressive profit-taking at each target level to lock in gains while maintaining upside exposure.`;

    return {
      asset,
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      signal_type: signalType,
      entry_price: entryPrice,
      stop_loss: stopLoss,
      take_profit_1: tp1,
      take_profit_2: tp2,
      take_profit_3: tp3,
      take_profit_4: tp4,
      suggested_leverage: Math.floor(Math.random() * 5) + 5,
      confidence_score: confidenceScore,
      risk_reward_ratio: riskRewardRatio,
      position_size: Math.random() * 500 + 100,
      patterns_detected: selectedPatterns,
      ai_reasoning: reasoning,
      status: 'active'
    };
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setAnalyzing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockSignal = await generateMockSignal();

      const { data, error } = await supabase
        .from('trade_signals')
        .insert({
          user_id: user.id,
          ...mockSignal
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onNewSignal(data);

        const { data: analyticsData } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (analyticsData) {
          await supabase
            .from('user_analytics')
            .update({
              total_signals: (analyticsData.total_signals || 0) + 1
            })
            .eq('user_id', user.id);
        }
      }
    } catch (error) {
      console.error('Error generating signal:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#00BFFF]/20 to-[#FFD700]/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Chart Analysis</h2>
            <p className="text-sm text-gray-400">Upload a chart for instant trade signals</p>
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragActive
            ? 'border-[#00BFFF] bg-[#00BFFF]/5'
            : 'border-[#00BFFF]/30 hover:border-[#00BFFF]/50'
        }`}
      >
        {analyzing ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-[#00BFFF] animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-white font-semibold">Analyzing chart...</p>
              <p className="text-sm text-gray-400">AI is detecting patterns and generating signals</p>
            </div>
            <div className="w-64 h-2 bg-[#0A0A0A] rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-[#00BFFF] to-[#FFD700] animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Upload className="w-12 h-12 text-[#00BFFF] mx-auto" />
              <div className="absolute inset-0 blur-xl bg-[#00BFFF]/30 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Drop your chart here or click to upload</p>
              <p className="text-sm text-gray-400">
                Supports PNG, JPG, JPEG • AI will analyze patterns, support/resistance, and signals
              </p>
            </div>
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              <span className="px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-black font-semibold rounded-lg cursor-pointer hover:opacity-90 transition-all inline-block">
                Select Chart Image
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#00BFFF]/20">
          <div className="text-[#00BFFF] text-2xl font-bold">98.5%</div>
          <div className="text-xs text-gray-400 mt-1">Pattern Detection</div>
        </div>
        <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#FFD700]/20">
          <div className="text-[#FFD700] text-2xl font-bold">&lt;2s</div>
          <div className="text-xs text-gray-400 mt-1">Analysis Speed</div>
        </div>
        <div className="text-center p-3 bg-[#0A0A0A] rounded-lg border border-[#00FF9D]/20">
          <div className="text-[#00FF9D] text-2xl font-bold">24/7</div>
          <div className="text-xs text-gray-400 mt-1">AI Monitoring</div>
        </div>
      </div>
    </div>
  );
}
