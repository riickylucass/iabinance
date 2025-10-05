import { TrendingUp, Award, Target, DollarSign } from 'lucide-react';
import { UserAnalytics } from '../lib/supabase';

type PerformanceMetricsProps = {
  analytics: UserAnalytics | null;
};

export function PerformanceMetrics({ analytics }: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!analytics) {
    return (
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Performance Analytics</h2>
        <p className="text-sm text-gray-400">No trading data yet. Start by uploading a chart!</p>
      </div>
    );
  }

  const metrics = [
    {
      icon: Target,
      label: 'Win Rate',
      value: `${analytics.win_rate.toFixed(1)}%`,
      color: 'text-[#00FF9D]',
      bgColor: 'bg-[#00FF9D]/20',
      borderColor: 'border-[#00FF9D]/30'
    },
    {
      icon: DollarSign,
      label: 'Total P&L',
      value: formatCurrency(analytics.total_profit_loss),
      color: analytics.total_profit_loss >= 0 ? 'text-[#00FF9D]' : 'text-[#FF3B3B]',
      bgColor: analytics.total_profit_loss >= 0 ? 'bg-[#00FF9D]/20' : 'bg-[#FF3B3B]/20',
      borderColor: analytics.total_profit_loss >= 0 ? 'border-[#00FF9D]/30' : 'border-[#FF3B3B]/30'
    },
    {
      icon: Award,
      label: 'Total ROI',
      value: `${analytics.total_roi >= 0 ? '+' : ''}${analytics.total_roi.toFixed(2)}%`,
      color: analytics.total_roi >= 0 ? 'text-[#FFD700]' : 'text-[#FF3B3B]',
      bgColor: 'bg-[#FFD700]/20',
      borderColor: 'border-[#FFD700]/30'
    },
    {
      icon: TrendingUp,
      label: 'Avg R:R',
      value: `${analytics.average_risk_reward.toFixed(2)}:1`,
      color: 'text-[#00BFFF]',
      bgColor: 'bg-[#00BFFF]/20',
      borderColor: 'border-[#00BFFF]/30'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
      <h2 className="text-lg font-bold text-white mb-6">Performance Analytics</h2>

      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${metric.bgColor} ${metric.borderColor} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-sm text-gray-400">{metric.label}</span>
              </div>
              <span className={`text-xl font-bold ${metric.color}`}>{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[#00BFFF]/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{analytics.total_signals}</div>
            <div className="text-xs text-gray-400 mt-1">Total Signals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00FF9D]">{analytics.successful_trades}</div>
            <div className="text-xs text-gray-400 mt-1">Successful</div>
          </div>
        </div>
      </div>

      {analytics.best_performing_asset && (
        <div className="mt-4 p-3 bg-[#0A0A0A] rounded-lg border border-[#FFD700]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Best Asset</span>
            <span className="text-sm font-semibold text-[#FFD700]">
              {analytics.best_performing_asset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
