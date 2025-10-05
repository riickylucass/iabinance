import { Brain, Lightbulb, Shield, TrendingUp } from 'lucide-react';
import { TradeSignal } from '../lib/supabase';

type AIInsightsProps = {
  signal: TradeSignal;
};

export function AIInsights({ signal }: AIInsightsProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#00BFFF]/20 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#00BFFF]/20 to-[#FFD700]/20 rounded-lg">
          <Brain className="w-6 h-6 text-[#FFD700] animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">AI Analysis</h2>
          <p className="text-xs text-gray-400">Expert insights & reasoning</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#00BFFF]/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white mb-2">Trade Reasoning</div>
              <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {signal.ai_reasoning}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#00FF9D]/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
            <div className="text-2xl font-bold text-[#00FF9D]">
              {signal.confidence_score.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Based on pattern history</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#FFD700]/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#FFD700]" />
              <div className="text-xs text-gray-400">Risk Level</div>
            </div>
            <div className="text-2xl font-bold text-[#FFD700]">
              {signal.suggested_leverage <= 5 ? 'Low' : signal.suggested_leverage <= 10 ? 'Medium' : 'High'}
            </div>
            <div className="text-xs text-gray-500 mt-1">With proper stop-loss</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#00BFFF]/10 to-[#FFD700]/5 rounded-lg border border-[#00BFFF]/30">
          <div className="text-xs font-semibold text-[#00BFFF] mb-2 uppercase tracking-wider">
            AI Recommendation
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {signal.signal_type === 'long'
              ? `Strong bullish momentum detected. Consider entering at current levels with ${signal.suggested_leverage}x leverage. Scale out at each profit target to manage risk effectively.`
              : `Bearish pressure building. Entry recommended at current levels with ${signal.suggested_leverage}x leverage. Protect position with tight stop-loss and take profits systematically.`}
          </p>
        </div>

        <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#00BFFF]/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">AI Confidence</span>
            <span className={`font-semibold ${
              signal.confidence_score >= 80 ? 'text-[#00FF9D]' :
              signal.confidence_score >= 60 ? 'text-[#FFD700]' : 'text-[#FF3B3B]'
            }`}>
              {signal.confidence_score >= 80 ? 'Very High' :
               signal.confidence_score >= 70 ? 'High' :
               signal.confidence_score >= 60 ? 'Medium' : 'Moderate'}
            </span>
          </div>
          <div className="mt-2 w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                signal.confidence_score >= 80 ? 'bg-[#00FF9D]' :
                signal.confidence_score >= 60 ? 'bg-[#FFD700]' : 'bg-[#FF3B3B]'
              }`}
              style={{ width: `${signal.confidence_score}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
