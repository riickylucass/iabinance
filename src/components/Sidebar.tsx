import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';
import { TradeSignal } from '../lib/supabase';

type SidebarProps = {
  activeSignals: TradeSignal[];
  onSelectSignal: (signal: TradeSignal) => void;
  selectedSignal: TradeSignal | null;
};

export function Sidebar({ activeSignals, onSelectSignal, selectedSignal }: SidebarProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <aside className="w-72 h-screen bg-[#0f0f0f]/80 backdrop-blur-lg border-r border-[#00BFFF]/20 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Active Signals
          </h2>

          <div className="space-y-3">
            {activeSignals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No active signals</p>
                <p className="text-xs text-gray-600 mt-1">Upload a chart to get started</p>
              </div>
            ) : (
              activeSignals.map((signal) => (
                <button
                  key={signal.id}
                  onClick={() => onSelectSignal(signal)}
                  className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    selectedSignal?.id === signal.id
                      ? 'bg-gradient-to-br from-[#00BFFF]/20 to-[#FFD700]/10 border-[#00BFFF] shadow-lg shadow-[#00BFFF]/20'
                      : 'bg-[#1a1a1a] border-[#00BFFF]/10 hover:border-[#00BFFF]/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {signal.signal_type === 'long' ? (
                        <TrendingUp className="w-5 h-5 text-[#00FF9D]" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-[#FF3B3B]" />
                      )}
                      <span className="font-semibold text-white">{signal.asset}</span>
                    </div>
                    <span className="text-xs text-gray-400">{signal.timeframe}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Entry</span>
                      <span className="text-white font-medium">{formatPrice(signal.entry_price)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              signal.confidence_score >= 80
                                ? 'bg-[#00FF9D]'
                                : signal.confidence_score >= 60
                                ? 'bg-[#FFD700]'
                                : 'bg-[#FF3B3B]'
                            }`}
                            style={{ width: `${signal.confidence_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-white">
                          {signal.confidence_score}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(signal.created_at)}</span>
                      <span className="ml-auto px-2 py-0.5 rounded bg-[#00BFFF]/20 text-[#00BFFF]">
                        {signal.suggested_leverage}x
                      </span>
                    </div>
                  </div>

                  {signal.patterns_detected.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#00BFFF]/10">
                      <div className="flex flex-wrap gap-1">
                        {signal.patterns_detected.slice(0, 2).map((pattern, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
                          >
                            {pattern}
                          </span>
                        ))}
                        {signal.patterns_detected.length > 2 && (
                          <span className="text-xs px-2 py-0.5 text-gray-500">
                            +{signal.patterns_detected.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
