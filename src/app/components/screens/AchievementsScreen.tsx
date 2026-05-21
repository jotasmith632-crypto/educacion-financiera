import React from 'react';
import { Star, Flame, Trophy, Check, Zap, Lock, Lightbulb, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '../shared/BottomNav';
import { PremiumIcon } from '../ui/PremiumIcon';

interface Badge {
  id: number;
  name: string;
  emoji: string;
  unlocked: boolean;
  color: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  level: number;
  maxLevel: number;
  progress: number;
  locked: boolean;
  status: 'locked' | 'in-progress' | 'completed';
}

interface AchievementsScreenProps {
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
  badges: Badge[];
  modules: Module[];
  onNavigate: (screen: any) => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  userProgress,
  badges,
  modules,
  onNavigate
}) => {
  const progressPercentage = Math.round((userProgress.modulesCompleted / userProgress.totalModules) * 100);
  const NextModuleIcon = modules && modules[0] ? modules[0].icon : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Mis Logros</h1>
        <p className="text-white/80 text-sm">Tu progreso y recompensas</p>
      </div>

      <div className="p-6 -mt-4 space-y-5 relative z-10">
        {/* 1. Bloque Superior de Resumen - PROTAGONISTA */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
              <h2 className="text-4xl font-bold">Nivel {userProgress.level}</h2>
              <p className="text-sm mt-1 opacity-90">{userProgress.rankTitle}</p>
            </div>
            <div>
              <PremiumIcon
                emoji={userProgress.level >= 7 ? '👑' : userProgress.level >= 4 ? '⚡' : '🌟'}
                size={36}
                showBackground={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
              <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
              <p className="text-xs opacity-90">Puntos</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
              <p className="text-2xl font-bold">{userProgress.streak}</p>
              <p className="text-xs opacity-90">Días racha</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1" />
              <p className="text-2xl font-bold">{progressPercentage}%</p>
              <p className="text-xs opacity-90">Progreso</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Próximo nivel</span>
              <span className="text-xs font-bold">{Math.round((userProgress.totalPoints % 500) / 5)}%</span>
            </div>
            <Progress.Root className="relative overflow-hidden bg-white/30 rounded-full w-full h-2" value={Math.round((userProgress.totalPoints % 500) / 5)}>
              <Progress.Indicator
                className="h-full transition-all duration-500 bg-white rounded-full"
                style={{ transform: `translateX(-${100 - Math.round((userProgress.totalPoints % 500) / 5)}%)` }}
              />
            </Progress.Root>
          </div>
        </div>

        {/* 2. Sección de Insignias - GRID COMPACTO */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Mis Insignias</h3>
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#EFEAFE', color: '#6C4CF1' }}>
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge, index) => (
              <Motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-full aspect-square rounded-xl flex items-center justify-center border transition-all ${
                    badge.unlocked
                      ? 'bg-white border-purple-100 shadow-sm'
                      : 'bg-gray-50 border-gray-200 grayscale opacity-40'
                  }`}
                >
                  <PremiumIcon
                    emoji={badge.emoji}
                    showBackground={badge.unlocked}
                    size={28}
                    className={badge.unlocked ? "" : "opacity-60"}
                  />
                </div>
                <p className="text-[9px] text-gray-600 mt-1.5 text-center leading-tight font-medium">
                  {badge.name}
                </p>
                {badge.unlocked && (
                  <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center -mt-0.5 z-10 border border-white">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </Motion.div>
            ))}
          </div>
        </div>

        {/* 3. Sección de Progreso por Módulos */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Módulos</h3>

          <div className="space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-5 h-5" style={{ color: module.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{module.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {module.status === 'completed' && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Completado
                      </span>
                    )}
                    {module.status === 'in-progress' && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        En curso
                      </span>
                    )}
                    {module.status === 'locked' && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: module.color }}>{module.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Sección de Recomendación */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2" style={{ borderColor: '#CFC3FF' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <Lightbulb className="w-5 h-5" style={{ color: '#6C4CF1' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Tu siguiente paso</h3>
              <p className="text-sm text-gray-700">
                Continúa con el módulo de <span className="font-bold" style={{ color: '#6C4CF1' }}>Ahorro e inversión inteligente</span> para ganar más puntos
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: modules[0]?.bgColor || '#EFEAFE' }}
              >
                {NextModuleIcon && <NextModuleIcon className="w-6 h-6" style={{ color: modules[0]?.color || '#6C4CF1' }} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{modules[0]?.title || 'Módulo Inicial'}</p>
                <p className="text-xs text-gray-600">{modules[0]?.progress ?? 0}% completado</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Te faltan {userProgress.pointsToNextLevel} puntos para el próximo nivel</span>
            </div>

            <button
              onClick={() => onNavigate('modules')}
              className="w-full py-3 rounded-xl font-bold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
            >
              Continuar módulo
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="achievements" onNavigate={onNavigate} />
    </div>
  );
};
