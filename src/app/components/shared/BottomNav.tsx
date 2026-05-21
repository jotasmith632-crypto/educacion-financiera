import React from 'react';
import { Home, BookOpen, Medal, Trophy } from 'lucide-react';
import { motion as Motion } from 'motion/react';

interface BottomNavProps {
  active: string;
  onNavigate: (screen: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white/75 backdrop-blur-xl border border-white/60 p-3.5 rounded-3xl shadow-2xl z-40 max-w-md mx-auto transition-all duration-300">
      <div className="flex items-center justify-around">
        <Motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 ${active === 'home' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Inicio</span>
        </Motion.button>

        <Motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('modules')}
          className={`flex flex-col items-center gap-1 ${active === 'modules' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-medium">Módulos</span>
        </Motion.button>

        <Motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('achievements')}
          className={`flex flex-col items-center gap-1 ${active === 'achievements' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Medal className="w-6 h-6" />
          <span className="text-xs font-medium">Logros</span>
        </Motion.button>

        <Motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('olympics')}
          className={`flex flex-col items-center gap-1 ${active === 'olympics' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-medium">Olimpiadas</span>
        </Motion.button>
      </div>
    </div>
  );
};
