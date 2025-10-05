import { useState, useEffect } from 'react';
import { X, Save, Shield, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile } from '../lib/supabase';

type SettingsProps = {
  onClose: () => void;
};

export function Settings({ onClose }: SettingsProps) {
  const { profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        risk_tolerance: profile.risk_tolerance,
        max_leverage: profile.max_leverage,
        daily_exposure_limit: profile.daily_exposure_limit,
        preferred_assets: profile.preferred_assets,
        notification_preferences: profile.notification_preferences
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setMessage('Settings saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cryptoAssets = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT',
    'XRP/USDT', 'ADA/USDT', 'AVAX/USDT', 'DOT/USDT'
  ];

  const toggleAsset = (asset: string) => {
    const current = formData.preferred_assets || [];
    if (current.includes(asset)) {
      setFormData({
        ...formData,
        preferred_assets: current.filter(a => a !== asset)
      });
    } else {
      setFormData({
        ...formData,
        preferred_assets: [...current, asset]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-lg border-b border-[#00BFFF]/20 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-sm text-gray-400 mt-1">Customize your trading preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FF3B3B]/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-[#FF3B3B]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#00BFFF]">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Risk Management</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Risk Tolerance</label>
              <select
                value={formData.risk_tolerance}
                onChange={(e) => setFormData({ ...formData, risk_tolerance: e.target.value as any })}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              >
                <option value="low">Low - Conservative trading</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="high">High - Aggressive trading</option>
                <option value="aggressive">Aggressive - Maximum risk</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Leverage</label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  value={formData.max_leverage}
                  onChange={(e) => setFormData({ ...formData, max_leverage: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Daily Exposure Limit ($)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={formData.daily_exposure_limit}
                  onChange={(e) => setFormData({ ...formData, daily_exposure_limit: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#FFD700]">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Preferred Assets</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cryptoAssets.map((asset) => (
                <button
                  key={asset}
                  onClick={() => toggleAsset(asset)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.preferred_assets?.includes(asset)
                      ? 'bg-gradient-to-r from-[#00BFFF]/20 to-[#FFD700]/20 border-[#00BFFF] text-white'
                      : 'bg-[#0A0A0A] border-[#00BFFF]/20 text-gray-400 hover:border-[#00BFFF]/50'
                  }`}
                >
                  {asset.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#00FF9D]">
              <Bell className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive trade signals via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'dashboard', label: 'Dashboard Alerts', description: 'In-app notification pop-ups' }
              ].map(({ key, label, description }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-[#00BFFF]/20 cursor-pointer hover:border-[#00BFFF]/40 transition-all"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-500 mt-1">{description}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notification_preferences?.[key as keyof typeof formData.notification_preferences]}
                    onChange={(e) => setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences!,
                        [key]: e.target.checked
                      }
                    })}
                    className="w-5 h-5 rounded border-[#00BFFF]/30 bg-[#0A0A0A] text-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]"
                  />
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg border ${
              message.includes('success')
                ? 'bg-[#00FF9D]/10 border-[#00FF9D]/30 text-[#00FF9D]'
                : 'bg-[#FF3B3B]/10 border-[#FF3B3B]/30 text-[#FF3B3B]'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#0A0A0A] border border-[#00BFFF]/20 text-white rounded-lg hover:border-[#00BFFF]/50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
