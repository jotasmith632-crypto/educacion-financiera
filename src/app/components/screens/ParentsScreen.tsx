import React from 'react';
import { obtenerDatosUsuario } from '../../../db';
import { PrimaryButton } from '../shared/CustomButtons';

interface ParentsScreenProps {
  userData?: any;
  currentUser?: any;
  onBack: () => void;
}

export const ParentsScreen: React.FC<ParentsScreenProps> = ({ userData: propUserData, currentUser, onBack }) => {
  const [userData, setUserData] = React.useState<any>(propUserData);
  const [loading, setLoading] = React.useState(!propUserData && !!currentUser);

  React.useEffect(() => {
    if (propUserData) {
      setUserData(propUserData);
      setLoading(false);
      return;
    }

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadDataFallback = async () => {
      try {
        const docSnap = await obtenerDatosUsuario(currentUser.uid);
        if (docSnap) {
          setUserData(docSnap);
        }
      } catch (error) {
        console.error("Error al obtener datos de Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDataFallback();
  }, [propUserData, currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-purple-800 font-medium">Cargando reporte de progreso...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-transparent min-h-screen pb-24">
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
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/60 text-center">
            <p className="text-gray-500">No hay datos registrados aún. ¡Invita a tu hijo a completar su primer nivel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Puntos */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60 flex items-center gap-4">
              <div className="text-4xl">🏅</div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Puntos Totales</p>
                <p className="text-3xl font-black text-yellow-600">{userData.points || 0}</p>
              </div>
            </div>

            {/* Meta Financiera */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Meta Actual</p>
              <p className="text-lg font-medium text-blue-900 italic">
                "{userData.metaFinanciera || "Aún no ha definido una meta en el Nivel 1"}"
              </p>
            </div>

            {/* Listado de Niveles */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/60 md:col-span-2">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Estado de los Niveles (Módulo 1)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const isCompleted = userData.completedLevels?.includes(`nivel${num}`);
                  return (
                    <div key={num} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isCompleted ? 'bg-green-50/60 border-green-200/50 text-green-950 backdrop-blur-sm' : 'bg-white/40 border-white/40 text-slate-700 backdrop-blur-sm'}`}>
                      <span className="font-semibold">Nivel {num}</span>
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
