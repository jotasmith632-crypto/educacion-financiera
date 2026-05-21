
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../shared/CustomButtons';
import { registerWithEmail, loginWithGoogle } from '../../services/authService';

interface RegisterScreenProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export const RegisterScreen = ({ onSuccess, onNavigateToLogin, onBack }: RegisterScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
    grade: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerWithEmail(formData.email, formData.password, formData.name, {
        school: formData.school,
        grade: formData.grade,
        district: formData.district
      });
      onSuccess();
    } catch (err: any) {
      setError('Error al crear la cuenta. Intenta con otro correo.');
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
      console.error("Google Register Error:", err);
      setError(typeof err === 'string' ? err : 'Error al registrarse con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="text-white/80 mb-4 hover:text-white transition-colors"
        >
          ← Atrás
        </button>
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-white/80 text-sm mt-1">Únete a Olimpiadas Financieras</p>
      </div>

      <div className="p-6 -mt-4 max-w-md mx-auto space-y-4">
        <form onSubmit={handleRegister} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 space-y-4">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-3 rounded-xl text-sm border border-red-100/50">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colegio</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                placeholder="Nombre de tu colegio"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grado</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                >
                  <option value="">Selecciona</option>
                  <option value="1">1° Sec</option>
                  <option value="2">2° Sec</option>
                  <option value="3">3° Sec</option>
                  <option value="4">4° Sec</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-white/40 focus:border-purple-400 outline-none transition-all"
                  placeholder="Tu distrito"
                />
              </div>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white/25 backdrop-blur-md border border-white/40 rounded-full text-gray-600 font-medium">O también</span>
          </div>
        </div>

        <SecondaryButton onClick={handleGoogleLogin} disabled={loading} className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/60">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Registrarse con Google
        </SecondaryButton>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-bold hover:underline"
            style={{ color: '#6C4CF1' }}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};
