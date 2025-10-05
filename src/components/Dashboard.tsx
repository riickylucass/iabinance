import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChartAnalysis } from './ChartAnalysis';
import { TradingChart } from './TradingChart';
import { TradeHistory } from './TradeHistory';
import { PerformanceMetrics } from './PerformanceMetrics';
import { AIInsights } from './AIInsights';
import { Settings } from './Settings';
import { supabase, TradeSignal, UserAnalytics } from '../lib/supabase';

export function Dashboard() {
  const { user, profile } = useAuth();
  const [activeSignals, setActiveSignals] = useState<TradeSignal[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<TradeSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [signalsResult, analyticsResult] = await Promise.all([
        supabase
          .from('trade_signals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (signalsResult.data) {
        setActiveSignals(signalsResult.data);
        if (signalsResult.data.length > 0) {
          setSelectedSignal(signalsResult.data[0]);
        }
      }

      if (analyticsResult.data) {
        setAnalytics(analyticsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSignal = (signal: TradeSignal) => {
    setActiveSignals(prev => [signal, ...prev]);
    setSelectedSignal(signal);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/5 via-transparent to-[#FFD700]/5 pointer-events-none"></div>

      <div className="relative z-10 flex">
        <Sidebar
          activeSignals={activeSignals}
          onSelectSignal={setSelectedSignal}
          selectedSignal={selectedSignal}
        />

        <div className="flex-1 ml-72">
          <Header
            profile={profile}
            analytics={analytics}
            onOpenSettings={() => setShowSettings(true)}
          />

          <main className="p-6 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <ChartAnalysis onNewSignal={handleNewSignal} />

                {selectedSignal && (
                  <TradingChart signal={selectedSignal} />
                )}
              </div>

              <div className="space-y-6">
                {selectedSignal && (
                  <AIInsights signal={selectedSignal} />
                )}

                <PerformanceMetrics analytics={analytics} />
              </div>
            </div>

            <TradeHistory userId={user?.id || ''} />
          </main>
        </div>
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
