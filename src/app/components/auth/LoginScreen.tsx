
import React, { useState } from 'react';
import { ArrowRight, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../shared/CustomButtons';
import { loginWithEmail, loginWithGoogle, sendPasswordReset } from '../../services/authService';
import { InteractiveParticlesBackground } from '../ui/InteractiveParticlesBackground';

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

  // Estados para recuperación de contraseña
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordReset(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo. Verifica tu dirección.');
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
    <div className="min-h-screen relative overflow-hidden bg-transparent">

      {/* Orbes flotantes difuminados en el fondo para estética premium */}
      <div className="absolute top-[20%] left-[-15%] w-[280px] h-[280px] rounded-full bg-purple-300/30 blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[15%] right-[-15%] w-[320px] h-[320px] rounded-full bg-pink-300/25 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[45%] right-[5%] w-[180px] h-[180px] rounded-full bg-blue-200/20 blur-[60px] pointer-events-none" />

      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8 relative z-10 shadow-lg">
        <button
          onClick={isResetMode ? () => { setIsResetMode(false); setError(null); } : onBack}
          className="text-white/80 mb-4 hover:text-white transition-colors"
        >
          ← Atrás
        </button>
        <h1 className="text-2xl font-bold animate-fade-in">
          {isResetMode ? 'Recuperar contraseña' : 'Iniciar sesión'}
        </h1>
        <p className="text-white/80 text-sm mt-1 animate-fade-in">
          {isResetMode ? 'Te ayudaremos a ingresar a tu cuenta' : 'Continúa tu ruta financiera'}
        </p>
      </div>

      <div className="p-6 -mt-4 max-w-md mx-auto space-y-4 relative z-10">
        {isResetMode && resetSuccess ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 text-center space-y-6 relative z-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800 animate-fade-in">¡Correo enviado!</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hemos enviado las instrucciones para restablecer tu contraseña al correo: <br />
                <span className="font-semibold text-gray-800 break-all">{resetEmail}</span>
              </p>
            </div>
            <div className="pt-2">
              <PrimaryButton onClick={() => { setIsResetMode(false); setResetSuccess(false); setResetEmail(''); }}>
                Volver a Iniciar sesión
              </PrimaryButton>
            </div>
          </div>
        ) : isResetMode ? (
          <form onSubmit={handleResetPassword} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-4 relative z-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(108,76,241,0.08)]">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div className="flex items-start space-x-3 text-purple-600 bg-purple-50 p-3 rounded-xl border border-purple-100">
              <KeyRound className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-800 leading-relaxed">
                Te enviaremos un correo electrónico con un enlace seguro para que elijas una nueva contraseña.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-all duration-250"
                  placeholder="tu@email.com"
                  required
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>

            <button
              type="button"
              onClick={() => { setIsResetMode(false); setError(null); }}
              className="w-full text-center text-sm font-semibold hover:underline transition-all pt-2 cursor-pointer"
              style={{ color: '#6C4CF1' }}
            >
              Volver a Iniciar sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-4 relative z-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(108,76,241,0.08)]">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-all duration-250"
                  placeholder="tu@email.com"
                  required
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-all duration-250"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button 
              type="button" 
              onClick={() => {
                setIsResetMode(true);
                setError(null);
                setResetSuccess(false);
                setResetEmail(email);
              }}
              className="text-sm text-left hover:underline transition-all w-fit cursor-pointer" 
              style={{ color: '#6C4CF1' }}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </form>
        )}

        {!isResetMode && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500 font-medium">O también</span>
              </div>
            </div>

            <SecondaryButton onClick={handleGoogleLogin} disabled={loading}>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continuar con Google
            </SecondaryButton>
          </>
        )}

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-bold cursor-pointer"
            style={{ color: '#6C4CF1' }}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};
