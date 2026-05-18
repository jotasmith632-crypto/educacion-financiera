
import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../shared/CustomButtons';
import { loginWithEmail, loginWithGoogle } from '../../services/authService';

interface LoginScreenProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
}

export const LoginScreen = ({ onSuccess, onNavigateToRegister, onBack }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      onSuccess();
    } catch (err: any) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(typeof err === 'string' ? err : 'Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8">
        <button
          onClick={onBack}
          className="text-white/80 mb-4"
        >
          ← Atrás
        </button>
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-white/80 text-sm mt-1">Continúa tu ruta financiera</p>
      </div>

      <div className="p-6 -mt-4 max-w-md mx-auto space-y-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="button" className="text-sm" style={{ color: '#6C4CF1' }}>
            ¿Olvidaste tu contraseña?
          </button>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#F8F9FC] text-gray-500">O también</span>
          </div>
        </div>

        <SecondaryButton onClick={handleGoogleLogin} disabled={loading}>
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </SecondaryButton>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-bold"
            style={{ color: '#6C4CF1' }}
          >
            Regístrate
          </button>
        </p>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.setItem('isTestMode', 'true');
              window.location.reload();
            }}
            className="w-full py-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
          >
            🚀 Activar Modo Test (Temporal)
          </button>
        </div>
      </div>
    </div>
  );
};
