import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Check, X } from 'lucide-react';
import { supabase, TradeSignal } from '../lib/supabase';

type TradeHistoryProps = {
  userId: string;
};

export function TradeHistory({ userId }: TradeHistoryProps) {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    if (userId) {
      loadSignals();
    }
  }, [userId, filter]);

  const loadSignals = async () => {
    try {
      let query = supabase
        .from('trade_signals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        if (filter === 'active') {
          query = query.eq('status', 'active');
        } else {
          query = query.in('status', ['closed', 'stopped_out', 'completed']);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setSignals(data);
    } catch (error) {
      console.error('Error loading signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/30';
      case 'completed': return 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/30';
      case 'stopped_out': return 'bg-[#FF3B3B]/20 text-[#FF3B3B] border-[#FF3B3B]/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Trade History</h2>

        <div className="flex gap-2">
          {['all', 'active', 'closed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-black'
                  : 'bg-[#0A0A0A] text-gray-400 hover:text-white border border-[#00BFFF]/20'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No trades found</p>
          <p className="text-sm text-gray-600 mt-1">Upload a chart to generate your first signal</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00BFFF]/20">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Asset</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Entry</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Stop Loss</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Target</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Confidence</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal) => (
                <tr
                  key={signal.id}
                  className="border-b border-[#00BFFF]/10 hover:bg-[#00BFFF]/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{signal.asset}</span>
                      <span className="text-xs text-gray-500">{signal.timeframe}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {signal.signal_type === 'long' ? (
                        <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#FF3B3B]" />
                      )}
                      <span className={`text-sm font-medium ${
                        signal.signal_type === 'long' ? 'text-[#00FF9D]' : 'text-[#FF3B3B]'
                      }`}>
                        {signal.signal_type.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-white">{formatPrice(signal.entry_price)}</td>
                  <td className="py-4 px-4 text-sm text-[#FF3B3B]">{formatPrice(signal.stop_loss)}</td>
                  <td className="py-4 px-4 text-sm text-[#00FF9D]">{formatPrice(signal.take_profit_4)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            signal.confidence_score >= 80 ? 'bg-[#00FF9D]' :
                            signal.confidence_score >= 60 ? 'bg-[#FFD700]' : 'bg-[#FF3B3B]'
                          }`}
                          style={{ width: `${signal.confidence_score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{signal.confidence_score}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-400">{formatDate(signal.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
