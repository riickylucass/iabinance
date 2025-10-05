import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'premium' | 'elite';
  risk_tolerance: 'low' | 'medium' | 'high' | 'aggressive';
  max_leverage: number;
  preferred_assets: string[];
  daily_exposure_limit: number;
  notification_preferences: {
    email: boolean;
    push: boolean;
    dashboard: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type TradeSignal = {
  id: string;
  user_id: string;
  asset: string;
  timeframe: string;
  signal_type: 'long' | 'short';
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  take_profit_3: number;
  take_profit_4: number;
  suggested_leverage: number;
  confidence_score: number;
  risk_reward_ratio: number;
  position_size: number;
  patterns_detected: string[];
  ai_reasoning: string;
  chart_image_url?: string;
  status: 'active' | 'closed' | 'stopped_out' | 'completed';
  created_at: string;
  closed_at?: string;
};

export type UserAnalytics = {
  id: string;
  user_id: string;
  total_signals: number;
  successful_trades: number;
  failed_trades: number;
  total_profit_loss: number;
  win_rate: number;
  average_risk_reward: number;
  best_performing_asset?: string;
  total_roi: number;
  updated_at: string;
};
