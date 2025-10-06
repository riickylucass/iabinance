import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bitcoin, TrendingUp } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/5 via-transparent to-[#FFD700]/5"></div>

      <div className="absolute top-20 left-20 w-64 h-64 bg-[#00BFFF]/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="w-12 h-12 text-[#FFD700] animate-pulse" />
            <TrendingUp className="w-10 h-10 text-[#00BFFF]" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00BFFF] via-[#FFD700] to-[#00BFFF] bg-clip-text text-transparent mb-2">
            Trading IA Futuros
          </h1>
          <p className="text-gray-400 text-sm">Sinais premium de criptomoedas com inteligência artificial</p>
        </div>

        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-2xl border border-[#00BFFF]/20 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all"
                  required={!isLogin}
                  placeholder="Digite seu nome completo"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all"
                required
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#00BFFF]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all"
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 text-[#FF3B3B] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00BFFF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-[#00BFFF] hover:text-[#FFD700] transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Sinais de trading com inteligência artificial premium</p>
          <p className="mt-1">Análise de nível institucional • Insights em tempo real • Gestão de risco</p>
        </div>
      </div>
    </div>
  );
}
