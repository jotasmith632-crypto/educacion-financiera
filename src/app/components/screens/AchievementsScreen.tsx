import React, { useState } from 'react';
import { Star, Flame, Trophy, Check, Zap, Lock, Lightbulb, ArrowRight } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '../shared/BottomNav';
import { PremiumIcon } from '../ui/PremiumIcon';
import confetti from 'canvas-confetti';

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
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  const progressPercentage = Math.round((userProgress.modulesCompleted / userProgress.totalModules) * 100);
  const NextModuleIcon = modules && modules[0] ? modules[0].icon : null;

  const handleBadgeClick = (badge: Badge) => {
    if (!badge.unlocked) return;
    setSelectedBadge(badge);
    
    // Disparar confeti premium
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C4CF1', '#3B82F6', '#EC4899', '#F59E0B']
    });
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Mis Logros</h1>
        <p className="text-white/80 text-sm">Tu progreso y recompensas</p>
      </div>

      <div className="p-6 -mt-4 space-y-5 relative z-10">
        {/* 1. Bloque Superior de Resumen - PROTAGONISTA */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div>
              <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
              <h2 className="text-4xl font-bold">Nivel {userProgress.level}</h2>
              <p className="text-sm mt-1 opacity-90">{userProgress.rankTitle}</p>
            </div>
            <Motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <PremiumIcon
                emoji={userProgress.level >= 7 ? '👑' : userProgress.level >= 4 ? '⚡' : '🌟'}
                size={36}
                showBackground={true}
              />
            </Motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-300" fill="currentColor" />
              <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
              <p className="text-xs opacity-90">Puntos</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" fill="currentColor" />
              <p className="text-2xl font-bold">{userProgress.streak}</p>
              <p className="text-xs opacity-90">Días racha</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
              <p className="text-2xl font-bold">{progressPercentage}%</p>
              <p className="text-xs opacity-90">Progreso</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 relative z-10">
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
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/60">
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
                animate={badge.unlocked ? { 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -3, 0]
                } : { 
                  opacity: 0.45, 
                  scale: 0.95 
                }}
                transition={badge.unlocked ? {
                  y: {
                    repeat: Infinity,
                    duration: 3 + (index % 3) * 0.7,
                    ease: "easeInOut"
                  },
                  delay: index * 0.03
                } : { delay: index * 0.03 }}
                onClick={() => handleBadgeClick(badge)}
                className={`flex flex-col items-center ${badge.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div
                  className={`w-full aspect-square rounded-xl flex items-center justify-center border transition-all ${
                    badge.unlocked
                      ? 'bg-white border-purple-100 shadow-[0_4px_10px_rgba(108,76,241,0.06)] hover:shadow-[0_4px_16px_rgba(108,76,241,0.18)] hover:border-purple-300'
                      : 'bg-gray-50 border-gray-200 grayscale'
                  }`}
                >
                  <PremiumIcon
                    emoji={badge.emoji}
                    showBackground={badge.unlocked}
                    size={28}
                    className={badge.unlocked ? "" : "opacity-50"}
                  />
                </div>
                <p className="text-[9px] text-gray-600 mt-1.5 text-center leading-tight font-bold">
                  {badge.name}
                </p>
                {badge.unlocked && (
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center -mt-1 z-10 border-2 border-white shadow-sm">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </Motion.div>
            ))}
          </div>
        </div>

        {/* 3. Sección de Progreso por Módulos */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/60">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Módulos</h3>

          <div className="space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/40">
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
                      <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-100">
                        <Check className="w-3 h-3" />
                        Completado
                      </span>
                    )}
                    {module.status === 'in-progress' && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-blue-100">
                        <Zap className="w-3 h-3" />
                        En curso
                      </span>
                    )}
                    {module.status === 'locked' && (
                      <span className="bg-gray-50 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-gray-100">
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
        <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/70 backdrop-blur-md rounded-3xl p-5 border border-white/60">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-white/70 backdrop-blur-sm p-2.5 rounded-xl shadow-sm border border-white/40">
              <Lightbulb className="w-5 h-5" style={{ color: '#6C4CF1' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Tu siguiente paso</h3>
              <p className="text-sm text-gray-700">
                Continúa con el módulo de <span className="font-bold" style={{ color: '#6C4CF1' }}>Ahorro e inversión inteligente</span> para ganar más puntos
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
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
              <span className="text-gray-600 text-xs">Te faltan {userProgress.pointsToNextLevel} puntos para el próximo nivel</span>
            </div>

            <button
              onClick={() => onNavigate('modules')}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
            >
              Continuar módulo
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalle de Medalla */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <Motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-xs bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/60 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
              {/* Brillos de fondo */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />

              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center shadow-inner relative z-10">
                <PremiumIcon
                  emoji={selectedBadge.emoji}
                  showBackground={true}
                  size={54}
                />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-white shadow-md">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                  ¡Medalla Desbloqueada!
                </span>
                <h2 className="text-xl font-bold text-gray-800 pt-2">{selectedBadge.name}</h2>
                <p className="text-xs text-gray-600 px-2 leading-relaxed">
                  ¡Excelente trabajo! Has obtenido esta insignia por tu constancia en las Olimpiadas y desafíos de educación financiera. ¡Sigue ganando!
                </p>
              </div>

              <div className="w-full pt-2 relative z-10">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-purple-500/10 active:scale-95 transition-transform cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
                >
                  ¡Estupendo!
                </button>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav active="achievements" onNavigate={onNavigate} />
    </div>
  );
};
