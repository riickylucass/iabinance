import { Bitcoin, LogOut, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Profile, UserAnalytics } from '../lib/supabase';

type HeaderProps = {
  profile: Profile | null;
  analytics: UserAnalytics | null;
  onOpenSettings: () => void;
};

export function Header({ profile, analytics, onOpenSettings }: HeaderProps) {
  const { signOut } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'elite': return 'from-[#FFD700] to-[#FFA500]';
      case 'premium': return 'from-[#00BFFF] to-[#0080FF]';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <header className="h-20 border-b border-[#00BFFF]/20 bg-[#0f0f0f]/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bitcoin className="w-8 h-8 text-[#FFD700] animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-[#FFD700]/30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#FFD700] bg-clip-text text-transparent">
                AI Futures Pro
              </h1>
              <p className="text-xs text-gray-500">Real-time market intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#00FF9D]/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">BTC/USDT</span>
                <span className="text-sm font-semibold text-[#00FF9D]">$67,432.10</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#00FF9D]/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">ETH/USDT</span>
                <span className="text-sm font-semibold text-[#00FF9D]">$3,245.67</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {analytics && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-400">Total P&L</div>
                <div className={`text-lg font-bold ${analytics.total_profit_loss >= 0 ? 'text-[#00FF9D]' : 'text-[#FF3B3B]'}`}>
                  {formatCurrency(analytics.total_profit_loss)}
                </div>
              </div>

              <div className="w-px h-10 bg-[#00BFFF]/20"></div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-lg font-bold text-[#FFD700]">
                  {analytics.win_rate.toFixed(1)}%
                </div>
              </div>

              <div className="w-px h-10 bg-[#00BFFF]/20"></div>

              <div className="text-right">
                <div className="text-xs text-gray-400">ROI</div>
                <div className={`text-lg font-bold ${analytics.total_roi >= 0 ? 'text-[#00FF9D]' : 'text-[#FF3B3B]'}`}>
                  {analytics.total_roi.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          <div className="w-px h-10 bg-[#00BFFF]/20"></div>

          <div className="flex items-center gap-3">
            {profile && (
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTierColor(profile.subscription_tier)} text-black text-xs font-bold uppercase`}>
                {profile.subscription_tier}
              </div>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-[#00BFFF]/10 rounded-lg transition-all"
            >
              <Settings className="w-5 h-5 text-gray-400 hover:text-[#00BFFF] transition-colors" />
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 hover:bg-[#FF3B3B]/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5 text-gray-400 hover:text-[#FF3B3B] transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
