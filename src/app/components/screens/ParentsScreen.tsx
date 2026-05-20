import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { obtenerDatosUsuario } from '../../../db';
import { PrimaryButton } from '../shared/CustomButtons';

interface ParentsScreenProps {
  onBack: () => void;
}

export const ParentsScreen: React.FC<ParentsScreenProps> = ({ onBack }) => {
  const [userData, setUserData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Escucha si hay un usuario logueado
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Buscamos el documento del niño en la colección "usuarios"
          const docSnap = await obtenerDatosUsuario(user.uid);

          if (docSnap) {
            setUserData(docSnap);
          }
        } catch (error) {
          console.error("Error al obtener datos de Firebase:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-blue-800 font-medium">Cargando reporte de progreso...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel para Padres</h1>
            <p className="text-slate-500">Seguimiento de aprendizaje de {userData?.name || userData?.displayName || 'el estudiante'}</p>
          </div>
          <PrimaryButton onClick={onBack} className="w-auto px-6 py-2 h-auto text-sm">
            Volver
          </PrimaryButton>
        </header>

        {!userData ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-500">No hay datos registrados aún. ¡Invita a tu hijo a completar su primer nivel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Puntos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 flex items-center gap-4">
              <div className="text-4xl">🏅</div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Puntos Totales</p>
                <p className="text-3xl font-black text-yellow-600">{userData.points || 0}</p>
              </div>
            </div>

            {/* Meta Financiera */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Meta Actual</p>
              <p className="text-lg font-medium text-blue-900 italic">
                "{userData.metaFinanciera || "Aún no ha definido una meta en el Nivel 1"}"
              </p>
            </div>

            {/* Listado de Niveles */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Estado de los Niveles (Módulo 1)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const isCompleted = userData.completedLevels?.includes(`nivel${num}`);
                  return (
                    <div key={num} className={`p-4 rounded-xl border flex justify-between items-center ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <span className="font-semibold text-slate-700">Nivel {num}</span>
                      <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        {isCompleted ? '✅ COMPLETADO' : '⏳ EN CURSO'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
