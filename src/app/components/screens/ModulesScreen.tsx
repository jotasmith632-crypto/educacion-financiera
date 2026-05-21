import React from 'react';
import { Star, Check, Lock } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '../shared/BottomNav';

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

interface ModulesScreenProps {
  modules: Module[];
  handleStartChallenge: (moduleId: string) => void;
  onNavigate: (screen: any) => void;
}

export const ModulesScreen: React.FC<ModulesScreenProps> = ({
  modules,
  handleStartChallenge,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Módulos de Aprendizaje</h1>
        <p className="text-white/80 text-sm">Completa todos para clasificar a las Olimpiadas</p>
      </div>

      <div className="p-6 -mt-4 space-y-4 relative z-10">
        {modules.map((module, index) => (
          <Motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-8 h-8" style={{ color: module.color }} />
                  {module.status === 'completed' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border border-white">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {module.status === 'locked' && (
                    <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1 border border-white">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-800 text-base">{module.title}</h3>
                    {module.status === 'completed' && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        Completado
                      </span>
                    )}
                    {module.status === 'in-progress' && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        En curso
                      </span>
                    )}
                    {module.status === 'locked' && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Nivel {module.level} de {module.maxLevel}</span>
                    <div className="flex gap-0.5">
                      {[...Array(module.maxLevel)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < module.level ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill={i < module.level ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress.Root
                      className="relative overflow-hidden bg-gray-200 rounded-full flex-1 h-2"
                      value={module.progress}
                    >
                      <Progress.Indicator
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          backgroundColor: module.color,
                          transform: `translateX(-${100 - module.progress}%)`
                        }}
                      />
                    </Progress.Root>
                    <span className="text-sm font-bold text-gray-700">{module.progress}%</span>
                  </div>
                </div>
              </div>

              {module.status !== 'locked' && (
                <Motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartChallenge(module.id)}
                  className="w-full bg-gradient-to-r text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${module.color}, ${module.color}dd)`
                  }}
                >
                  {module.status === 'completed' ? 'Repasar Módulo' : 'Continuar Reto'}
                </Motion.button>
              )}
            </div>
          </Motion.div>
        ))}
      </div>

      <BottomNav active="modules" onNavigate={onNavigate} />
    </div>
  );
};
