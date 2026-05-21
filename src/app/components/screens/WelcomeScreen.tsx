import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PremiumIcon } from '../ui/PremiumIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <Motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 left-10 opacity-10"
      >
        <PremiumIcon emoji="💰" showBackground={false} size={60} />
      </Motion.div>
      <Motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-32 right-10 opacity-10"
      >
        <PremiumIcon emoji="📊" showBackground={false} size={60} />
      </Motion.div>
      <Motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        className="absolute top-40 right-20 opacity-10"
      >
        <PremiumIcon emoji="🎯" showBackground={false} size={48} />
      </Motion.div>

      <Motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="mb-6 relative"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
          <Trophy className="w-20 h-20 text-purple-600" />
        </div>
      </Motion.div>

      <Motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-white text-center mb-3 px-4"
      >
        Olimpiadas Financieras
      </Motion.h1>

      <Motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-white/90 text-center mb-8 max-w-sm px-6"
      >
        Aprende sobre finanzas de forma divertida y clasifica para representar a tu colegio
      </Motion.p>

      <Motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 max-w-sm mx-auto"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <PremiumIcon emoji="📚" size={20} />
            </div>
            <p className="text-white/90 text-xs font-medium">5 Módulos</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <PremiumIcon emoji="🎮" size={20} />
            </div>
            <p className="text-white/90 text-xs font-medium">Retos Diarios</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <PremiumIcon emoji="🏆" size={20} />
            </div>
            <p className="text-white/90 text-xs font-medium">Olimpiadas</p>
          </div>
        </div>
      </Motion.div>

      <Motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          onStart();
        }}
        className="bg-white text-purple-600 px-12 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-2"
      >
        Comenzar
        <ArrowRight className="w-5 h-5" />
      </Motion.button>
    </Motion.div>
  );
};
