/*
  # Premium AI Trading Platform Database Schema

  ## Overview
  This migration creates the complete database schema for a high-end cryptocurrency futures trading platform with AI-powered chart analysis and trade signal generation.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `subscription_tier` (text: 'free', 'premium', 'elite')
  - `risk_tolerance` (text: 'low', 'medium', 'high', 'aggressive')
  - `max_leverage` (integer, default 10)
  - `preferred_assets` (text array)
  - `daily_exposure_limit` (numeric, default 1000)
  - `notification_preferences` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `trade_signals`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `asset` (text, e.g., 'BTC/USDT')
  - `timeframe` (text, e.g., '1h', '4h', '1d')
  - `signal_type` (text: 'long', 'short')
  - `entry_price` (numeric)
  - `stop_loss` (numeric)
  - `take_profit_1` (numeric)
  - `take_profit_2` (numeric)
  - `take_profit_3` (numeric)
  - `take_profit_4` (numeric)
  - `suggested_leverage` (integer)
  - `confidence_score` (numeric, 0-100)
  - `risk_reward_ratio` (numeric)
  - `position_size` (numeric)
  - `patterns_detected` (text array)
  - `ai_reasoning` (text)
  - `chart_image_url` (text)
  - `status` (text: 'active', 'closed', 'stopped_out', 'completed')
  - `created_at` (timestamptz)
  - `closed_at` (timestamptz)

  ### `trade_performance`
  - `id` (uuid, primary key)
  - `signal_id` (uuid, references trade_signals)
  - `user_id` (uuid, references profiles)
  - `entry_executed_price` (numeric)
  - `exit_price` (numeric)
  - `profit_loss` (numeric)
  - `profit_loss_percentage` (numeric)
  - `targets_hit` (integer array)
  - `execution_notes` (text)
  - `closed_at` (timestamptz)

  ### `chart_analyses`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `uploaded_image_url` (text)
  - `asset_detected` (text)
  - `timeframe_detected` (text)
  - `patterns_found` (jsonb)
  - `support_levels` (numeric array)
  - `resistance_levels` (numeric array)
  - `trend_direction` (text: 'bullish', 'bearish', 'neutral')
  - `volatility_score` (numeric)
  - `volume_analysis` (jsonb)
  - `ai_insights` (text)
  - `created_at` (timestamptz)

  ### `user_analytics`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, unique)
  - `total_signals` (integer, default 0)
  - `successful_trades` (integer, default 0)
  - `failed_trades` (integer, default 0)
  - `total_profit_loss` (numeric, default 0)
  - `win_rate` (numeric, default 0)
  - `average_risk_reward` (numeric, default 0)
  - `best_performing_asset` (text)
  - `total_roi` (numeric, default 0)
  - `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Admin role can access all data for management purposes
  - Public read access for market data where appropriate

  ## 3. Important Notes
  - All monetary values stored as numeric for precision
  - Confidence scores and percentages stored as numeric (0-100)
  - JSONB used for flexible data structures (patterns, preferences, etc.)
  - Timestamps include timezone information
  - Arrays used for multiple values (targets, levels, patterns)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'elite')),
  risk_tolerance text DEFAULT 'medium' CHECK (risk_tolerance IN ('low', 'medium', 'high', 'aggressive')),
  max_leverage integer DEFAULT 10,
  preferred_assets text[] DEFAULT ARRAY[]::text[],
  daily_exposure_limit numeric DEFAULT 1000,
  notification_preferences jsonb DEFAULT '{"email": true, "push": false, "dashboard": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trade_signals table
CREATE TABLE IF NOT EXISTS trade_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  asset text NOT NULL,
  timeframe text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('long', 'short')),
  entry_price numeric NOT NULL,
  stop_loss numeric NOT NULL,
  take_profit_1 numeric NOT NULL,
  take_profit_2 numeric NOT NULL,
  take_profit_3 numeric NOT NULL,
  take_profit_4 numeric NOT NULL,
  suggested_leverage integer DEFAULT 5,
  confidence_score numeric NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  risk_reward_ratio numeric NOT NULL,
  position_size numeric NOT NULL,
  patterns_detected text[] DEFAULT ARRAY[]::text[],
  ai_reasoning text NOT NULL,
  chart_image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'stopped_out', 'completed')),
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Create trade_performance table
CREATE TABLE IF NOT EXISTS trade_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid REFERENCES trade_signals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_executed_price numeric NOT NULL,
  exit_price numeric NOT NULL,
  profit_loss numeric NOT NULL,
  profit_loss_percentage numeric NOT NULL,
  targets_hit integer[] DEFAULT ARRAY[]::integer[],
  execution_notes text,
  closed_at timestamptz DEFAULT now()
);

-- Create chart_analyses table
CREATE TABLE IF NOT EXISTS chart_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  uploaded_image_url text NOT NULL,
  asset_detected text,
  timeframe_detected text,
  patterns_found jsonb DEFAULT '{}'::jsonb,
  support_levels numeric[] DEFAULT ARRAY[]::numeric[],
  resistance_levels numeric[] DEFAULT ARRAY[]::numeric[],
  trend_direction text CHECK (trend_direction IN ('bullish', 'bearish', 'neutral')),
  volatility_score numeric,
  volume_analysis jsonb DEFAULT '{}'::jsonb,
  ai_insights text,
  created_at timestamptz DEFAULT now()
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_signals integer DEFAULT 0,
  successful_trades integer DEFAULT 0,
  failed_trades integer DEFAULT 0,
  total_profit_loss numeric DEFAULT 0,
  win_rate numeric DEFAULT 0,
  average_risk_reward numeric DEFAULT 0,
  best_performing_asset text,
  total_roi numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trade signals policies
CREATE POLICY "Users can view own trade signals"
  ON trade_signals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trade signals"
  ON trade_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trade signals"
  ON trade_signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trade signals"
  ON trade_signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trade performance policies
CREATE POLICY "Users can view own trade performance"
  ON trade_performance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trade performance"
  ON trade_performance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chart analyses policies
CREATE POLICY "Users can view own chart analyses"
  ON chart_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chart analyses"
  ON chart_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chart analyses"
  ON chart_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User analytics policies
CREATE POLICY "Users can view own analytics"
  ON user_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON user_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON user_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trade_signals_user_id ON trade_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_signals_status ON trade_signals(status);
CREATE INDEX IF NOT EXISTS idx_trade_signals_created_at ON trade_signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trade_performance_user_id ON trade_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_chart_analyses_user_id ON chart_analyses(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_analytics_updated_at
  BEFORE UPDATE ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
