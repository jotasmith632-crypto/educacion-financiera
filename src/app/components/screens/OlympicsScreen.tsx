import React from 'react';
import { Check, X, Calendar, Trophy } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '../shared/BottomNav';

interface OlympicsScreenProps {
  userProgress: {
    totalPoints: number;
    streak: number;
    level: number;
    badges: number;
    modulesCompleted: number;
    totalModules: number;
    pointsToNextLevel: number;
    olimpicsProgress: number;
    rankTitle: string;
    nextRankTitle: string;
    olimpicsReady: boolean;
  };
  onNavigate: (screen: any) => void;
}

export const OlympicsScreen: React.FC<OlympicsScreenProps> = ({ userProgress, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white p-6 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">🏆</div>
          <div>
            <h1 className="text-2xl font-bold">Olimpiadas Financieras</h1>
            <p className="text-white/90 text-sm">Evento presencial nacional</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Tu estado</h3>
            <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
              En proceso
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progreso de clasificación</span>
              <span className="text-sm font-bold text-gray-800">{userProgress.olimpicsProgress}%</span>
            </div>
            <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3" value={userProgress.olimpicsProgress}>
              <Progress.Indicator
                className="h-full transition-all duration-500 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ transform: `translateX(-${100 - userProgress.olimpicsProgress}%)` }}
              />
            </Progress.Root>
          </div>
          <p className="text-sm text-gray-600">
            Completa los requisitos para clasificar y representar a tu colegio en el evento presencial.
          </p>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Requisitos para clasificar</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.level >= 7 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.level >= 7 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Alcanzar nivel 7</p>
                <p className="text-xs text-gray-500">Nivel actual: {userProgress.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.modulesCompleted >= 4 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.modulesCompleted >= 4 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Completar 4 módulos</p>
                <p className="text-xs text-gray-500">Completados: {userProgress.modulesCompleted}/5</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.totalPoints >= 5000 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.totalPoints >= 5000 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Obtener 5000 puntos</p>
                <p className="text-xs text-gray-500">Puntos actuales: {userProgress.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Ranking */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ranking por colegios</h3>
          <div className="space-y-3">
            {[
              { school: 'Colegio San Ignacio', points: 48500, students: 23 },
              { school: 'Instituto Nacional', points: 45200, students: 19 },
              { school: 'Colegio Santa María', points: 42800, students: 21 }
            ].map((school, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  'bg-orange-600 text-white'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{school.school}</p>
                  <p className="text-xs text-gray-500">{school.students} estudiantes · {school.points.toLocaleString()} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5 border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Próximo evento</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p><Calendar className="w-4 h-4 inline mr-1" /> 15 de Julio, 2026</p>
                <p>📍 Centro de Convenciones Nacional</p>
                <p>🎯 Competencia presencial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Premios</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-4xl mb-2">🥇</div>
              <p className="text-xs font-medium text-gray-700">1er lugar</p>
              <p className="text-xs text-gray-500">Beca completa</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <p className="text-xs font-medium text-gray-700">2do lugar</p>
              <p className="text-xs text-gray-500">Tablet</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <p className="text-xs font-medium text-gray-700">3er lugar</p>
              <p className="text-xs text-gray-500">Laptop</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="olympics" onNavigate={onNavigate} />
    </div>
  );
};
