import React from 'react';
import { Star, Target, Trophy, Users, LogOut, Zap, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '../shared/BottomNav';
import { AvatarRenderer } from '../ui/AvatarRenderer';

interface Avatar {
  id: string;
  face: string;
  skin: string;
  hair: string;
  accessory: string;
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

interface HomeScreenProps {
  avatar: Avatar;
  userData: any;
  currentUser: any;
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
  modules: Module[];
  onNavigate: (screen: any) => void;
  handleStartChallenge: (moduleId: string) => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  avatar,
  userData,
  currentUser,
  userProgress,
  modules,
  onNavigate,
  handleStartChallenge,
  onLogout
}) => {
  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Simplified Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('avatar')}
              className="relative"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center relative border-3 border-white/40 shadow-lg bg-gradient-to-tr from-purple-50 to-pink-50 overflow-hidden">
                <AvatarRenderer avatar={avatar} size={50} />
              </div>
            </Motion.button>
            <div>
              <p className="text-sm text-white/80">Hola, {userData?.name || currentUser?.displayName || 'Explorador'}</p>
              <h2 className="text-xl font-bold">{userProgress.rankTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('parents')}
              className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 border border-white/30"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Vista Padres</span>
            </Motion.button>

            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full flex items-center justify-center border border-white/30"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </Motion.button>
          </div>
        </div>

        {/* 3 Key Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Star className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
            <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
            <p className="text-xs text-white/80">Puntos</p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userProgress.level}</p>
            <p className="text-xs text-white/80">Nivel</p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userProgress.olimpicsProgress}%</p>
            <p className="text-xs text-white/80">Olimpiadas</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main CTA Button */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const nextModule = modules.find(m => m.status === 'in-progress');
            if (nextModule) {
              handleStartChallenge(nextModule.id);
            } else {
              onNavigate('modules');
            }
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Continuar mi reto</p>
              <p className="text-sm text-white/80">Módulo: Ahorro e inversión</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </Motion.button>

        {/* Next Goal Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/60">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Siguiente meta</p>
              <h3 className="font-bold text-gray-800 text-lg">Alcanzar {userProgress.nextRankTitle}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${userProgress.level >= 1 ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                {userProgress.level >= 1 && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600">Nivel 1 completado</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${userProgress.level >= 4 ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                {userProgress.level >= 4 && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600">Llegar a nivel 4</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${userProgress.modulesCompleted >= 1 ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                {userProgress.modulesCompleted >= 1 && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600">Completar el Módulo 1</span>
            </div>
          </div>
          <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2" value={userProgress.olimpicsProgress}>
            <Progress.Indicator
              className="h-full transition-all duration-500 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              style={{ transform: `translateX(-${100 - userProgress.olimpicsProgress}%)` }}
            />
          </Progress.Root>
          <p className="text-xs text-gray-500 mt-2">{userProgress.olimpicsProgress}% para clasificar</p>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              🔥
            </div>
            <div>
              <p className="font-bold text-lg">{userProgress.streak} días consecutivos</p>
              <p className="text-sm text-white/90">¡Sigue así!</p>
            </div>
          </div>
        </div>

        {/* Quick Module Access */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Módulos Activos</h3>
            <button
              onClick={() => onNavigate('modules')}
              className="text-sm text-purple-600 font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {modules.filter(m => m.status === 'in-progress').map((module) => (
              <Motion.button
                key={module.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartChallenge(module.id)}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/60 text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{module.title}</h4>
                <div className="flex items-center gap-2">
                  <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full flex-1 h-1.5" value={module.progress}>
                    <Progress.Indicator
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        backgroundColor: module.color,
                        transform: `translateX(-${100 - module.progress}%)`
                      }}
                    />
                  </Progress.Root>
                  <span className="text-xs font-medium text-gray-600">{module.progress}%</span>
                </div>
              </Motion.button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
};
