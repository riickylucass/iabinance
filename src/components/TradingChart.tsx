import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { TradeSignal } from '../lib/supabase';

type TradingChartProps = {
  signal: TradeSignal;
};

export function TradingChart({ signal }: TradingChartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const priceRange = Math.max(
    signal.take_profit_4 - signal.stop_loss,
    signal.entry_price * 0.1
  );

  const getPosition = (price: number) => {
    const min = signal.signal_type === 'long' ? signal.stop_loss : signal.take_profit_4;
    const max = signal.signal_type === 'long' ? signal.take_profit_4 : signal.stop_loss;
    return ((price - min) / (max - min)) * 100;
  };

  const currentPrice = signal.entry_price * (1 + (Math.random() - 0.5) * 0.02);
  const currentPosition = getPosition(currentPrice);

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${signal.signal_type === 'long' ? 'bg-[#00FF9D]/20' : 'bg-[#FF3B3B]/20'}`}>
            {signal.signal_type === 'long' ? (
              <TrendingUp className="w-6 h-6 text-[#00FF9D]" />
            ) : (
              <TrendingDown className="w-6 h-6 text-[#FF3B3B]" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{signal.asset}</h2>
            <p className="text-sm text-gray-400">
              {signal.signal_type.toUpperCase()} • {signal.timeframe} • {signal.suggested_leverage}x Leverage
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400">Confidence Score</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  signal.confidence_score >= 80
                    ? 'bg-[#00FF9D]'
                    : signal.confidence_score >= 60
                    ? 'bg-[#FFD700]'
                    : 'bg-[#FF3B3B]'
                }`}
                style={{ width: `${signal.confidence_score}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-white">{signal.confidence_score}%</span>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-[#0A0A0A] rounded-xl border border-[#00BFFF]/20 p-6">
        <div className="relative h-full flex items-end">
          {[...Array(20)].map((_, i) => {
            const height = 20 + Math.random() * 80;
            const isGreen = Math.random() > 0.5;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end px-0.5">
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    isGreen ? 'bg-[#00FF9D]/50' : 'bg-[#FF3B3B]/50'
                  }`}
                  style={{ height: `${height}%` }}
                >
                  <div
                    className={`w-0.5 mx-auto ${isGreen ? 'bg-[#00FF9D]' : 'bg-[#FF3B3B]'}`}
                    style={{ height: '20%' }}
                  ></div>
                </div>
              </div>
            );
          })}

          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-[#FF3B3B] z-10"
              style={{ bottom: `${getPosition(signal.stop_loss)}%` }}
            >
              <div className="absolute right-4 -top-3 flex items-center gap-2 bg-[#FF3B3B] text-white text-xs px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3" />
                <span>Stop Loss: {formatPrice(signal.stop_loss)}</span>
              </div>
            </div>

            <div
              className="absolute left-0 right-0 border-t-2 border-[#FFD700] z-10"
              style={{ bottom: `${getPosition(signal.entry_price)}%` }}
            >
              <div className="absolute left-4 -top-3 flex items-center gap-2 bg-[#FFD700] text-black text-xs px-2 py-1 rounded font-semibold">
                <Target className="w-3 h-3" />
                <span>Entry: {formatPrice(signal.entry_price)}</span>
              </div>
            </div>

            {[signal.take_profit_1, signal.take_profit_2, signal.take_profit_3, signal.take_profit_4].map((tp, idx) => (
              <div
                key={idx}
                className="absolute left-0 right-0 border-t border-dashed border-[#00FF9D]/50 z-10"
                style={{ bottom: `${getPosition(tp)}%` }}
              >
                <div className="absolute right-4 -top-2.5 text-[#00FF9D] text-xs px-2 py-0.5 bg-[#00FF9D]/10 rounded">
                  TP{idx + 1}: {formatPrice(tp)}
                </div>
              </div>
            ))}

            <div
              className="absolute left-0 right-0 z-20"
              style={{ bottom: `${currentPosition}%` }}
            >
              <div className="relative">
                <div className="absolute left-0 right-0 border-t-2 border-[#00BFFF] animate-pulse"></div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-black text-sm px-3 py-1.5 rounded-lg font-bold shadow-lg">
                  Current: {formatPrice(currentPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#00BFFF]/20">
          <div className="text-xs text-gray-400 mb-1">Risk/Reward</div>
          <div className="text-lg font-bold text-[#00BFFF]">{signal.risk_reward_ratio.toFixed(2)}:1</div>
        </div>

        <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#FFD700]/20">
          <div className="text-xs text-gray-400 mb-1">Position Size</div>
          <div className="text-lg font-bold text-[#FFD700]">${signal.position_size.toFixed(0)}</div>
        </div>

        <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#00FF9D]/20">
          <div className="text-xs text-gray-400 mb-1">Potential Profit</div>
          <div className="text-lg font-bold text-[#00FF9D]">
            +{((signal.take_profit_4 - signal.entry_price) / signal.entry_price * 100).toFixed(2)}%
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#FF3B3B]/20">
          <div className="text-xs text-gray-400 mb-1">Max Risk</div>
          <div className="text-lg font-bold text-[#FF3B3B]">
            -{Math.abs((signal.stop_loss - signal.entry_price) / signal.entry_price * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {signal.patterns_detected.length > 0 && (
        <div className="mt-4 p-4 bg-[#0A0A0A] rounded-lg border border-[#FFD700]/20">
          <div className="text-xs text-gray-400 mb-2">Detected Patterns</div>
          <div className="flex flex-wrap gap-2">
            {signal.patterns_detected.map((pattern, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-[#FFD700]/20 to-[#00BFFF]/20 border border-[#FFD700]/30 rounded-full text-sm text-[#FFD700]"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
