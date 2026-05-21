import React from 'react';
import {
  Trophy,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  GraduationCap,
  Rocket,
  Crown,
  Award,
  BookOpen,
  Gamepad2,
  Bus,
  Footprints,
  Smartphone,
  Pizza,
  Car,
  PartyPopper,
  Gift,
  Sparkles,
  Wrench,
  Calendar,
  PiggyBank,
  DollarSign,
  Target,
  Star,
  Flame,
  FileText,
  Pill,
  IceCream,
  CupSoda,
  Briefcase,
  Zap
} from 'lucide-react';

interface PremiumIconProps {
  emoji: string;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export const PremiumIcon: React.FC<PremiumIconProps> = ({
  emoji,
  size = 24,
  className = '',
  showBackground = true
}) => {
  // Normalize string (trim or remove spaces if any)
  const key = emoji.trim();

  // Mapper function to get the Lucide component, colors, and gradients
  const getIconConfig = (emojiStr: string) => {
    switch (emojiStr) {
      // 1. Badges & Achievements
      case '🏆':
        return {
          Component: Trophy,
          gradient: 'from-amber-400 to-yellow-500',
          color: '#D97706',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.2)'
        };
      case '🛒':
        return {
          Component: ShoppingCart,
          gradient: 'from-green-400 to-emerald-500',
          color: '#059669',
          bgColor: '#D1FAE5',
          shadow: 'rgba(16, 185, 129, 0.2)'
        };
      case '💳':
        return {
          Component: CreditCard,
          gradient: 'from-blue-400 to-cyan-500',
          color: '#2563EB',
          bgColor: '#DBEAFE',
          shadow: 'rgba(59, 130, 246, 0.2)'
        };
      case '📈':
        return {
          Component: TrendingUp,
          gradient: 'from-rose-500 to-red-600',
          color: '#E11D48',
          bgColor: '#FFE4E6',
          shadow: 'rgba(244, 63, 94, 0.2)'
        };
      case '🎓':
        return {
          Component: GraduationCap,
          gradient: 'from-purple-500 to-pink-500',
          color: '#7C3AED',
          bgColor: '#F3E8FF',
          shadow: 'rgba(124, 58, 237, 0.2)'
        };
      case '🚀':
        return {
          Component: Rocket,
          gradient: 'from-indigo-500 to-purple-600',
          color: '#4F46E5',
          bgColor: '#E0E7FF',
          shadow: 'rgba(79, 70, 229, 0.2)'
        };
      case '👑':
        return {
          Component: Crown,
          gradient: 'from-yellow-400 to-orange-500',
          color: '#D97706',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.2)'
        };
      case '🥇':
        return {
          Component: Award,
          gradient: 'from-amber-400 to-yellow-500',
          color: '#B45309',
          bgColor: '#FEF3C7',
          shadow: 'rgba(217, 119, 6, 0.2)'
        };
      case '⚡':
        return {
          Component: Zap,
          gradient: 'from-yellow-400 to-amber-500',
          color: '#D97706',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.2)'
        };

      // 2. Needs vs Wants Items
      case '📓':
        return {
          Component: FileText,
          gradient: 'from-blue-400 to-blue-600',
          color: '#1D4ED8',
          bgColor: '#DBEAFE',
          shadow: 'rgba(37, 99, 235, 0.15)'
        };
      case '🍫':
        return {
          Component: Gift, // Gift as sweet box or we represent candy
          gradient: 'from-amber-700 to-amber-900',
          color: '#78350F',
          bgColor: '#FEF3C7',
          shadow: 'rgba(120, 53, 15, 0.15)'
        };
      case '💊':
        return {
          Component: Pill,
          gradient: 'from-red-400 to-rose-500',
          color: '#BE123C',
          bgColor: '#FFE4E6',
          shadow: 'rgba(225, 29, 72, 0.15)'
        };
      case '🎮':
        return {
          Component: Gamepad2,
          gradient: 'from-purple-500 to-indigo-600',
          color: '#6D28D9',
          bgColor: '#F3E8FF',
          shadow: 'rgba(109, 40, 217, 0.2)'
        };
      case '🚌':
        return {
          Component: Bus,
          gradient: 'from-emerald-400 to-teal-600',
          color: '#047857',
          bgColor: '#D1FAE5',
          shadow: 'rgba(16, 185, 129, 0.15)'
        };
      case '👟':
        return {
          Component: Footprints, // Or custom vector
          gradient: 'from-orange-400 to-red-500',
          color: '#C2410C',
          bgColor: '#FFEDD5',
          shadow: 'rgba(234, 88, 12, 0.15)'
        };

      // 3. Gastos Hormiga & Metas Selection
      case '🍿':
        return {
          Component: IceCream,
          gradient: 'from-amber-300 to-yellow-500',
          color: '#B45309',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.15)'
        };
      case '🥤':
        return {
          Component: CupSoda,
          gradient: 'from-cyan-400 to-blue-500',
          color: '#0369A1',
          bgColor: '#E0F2FE',
          shadow: 'rgba(14, 165, 233, 0.15)'
        };
      case '📱':
        return {
          Component: Smartphone,
          gradient: 'from-slate-600 to-slate-800',
          color: '#334155',
          bgColor: '#F1F5F9',
          shadow: 'rgba(71, 85, 105, 0.15)'
        };
      case '🍬':
      case '🍭':
        return {
          Component: Sparkles, // represents treats/candies
          gradient: 'from-pink-400 to-rose-500',
          color: '#BE123C',
          bgColor: '#FCE7F3',
          shadow: 'rgba(219, 39, 119, 0.15)'
        };
      case '🍕':
        return {
          Component: Pizza,
          gradient: 'from-orange-400 to-amber-500',
          color: '#C2410C',
          bgColor: '#FFEDD5',
          shadow: 'rgba(234, 88, 12, 0.15)'
        };
      case '🚖':
        return {
          Component: Car,
          gradient: 'from-yellow-400 to-yellow-600',
          color: '#A16207',
          bgColor: '#FEF3C7',
          shadow: 'rgba(202, 138, 4, 0.15)'
        };
      case '🎧':
        return {
          Component: Trophy, // headphone is mapped to gamer accessory
          gradient: 'from-indigo-400 to-blue-500',
          color: '#1D4ED8',
          bgColor: '#E0E7FF',
          shadow: 'rgba(99, 102, 241, 0.15)'
        };
      case '🎉':
        return {
          Component: PartyPopper,
          gradient: 'from-pink-500 to-purple-600',
          color: '#C2185B',
          bgColor: '#FCE7F3',
          shadow: 'rgba(236, 72, 153, 0.2)'
        };
      case '🎁':
        return {
          Component: Gift,
          gradient: 'from-teal-400 to-emerald-500',
          color: '#0F766E',
          bgColor: '#E6FFFA',
          shadow: 'rgba(20, 184, 166, 0.15)'
        };
      case '✨':
        return {
          Component: Sparkles,
          gradient: 'from-yellow-300 to-amber-400',
          color: '#B45309',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.15)'
        };

      // 4. Background Floating Elements & Generic Map
      case '💰':
        return {
          Component: DollarSign,
          gradient: 'from-emerald-400 to-green-500',
          color: '#047857',
          bgColor: '#D1FAE5',
          shadow: 'rgba(16, 185, 129, 0.2)'
        };
      case '📊':
        return {
          Component: TrendingUp,
          gradient: 'from-blue-400 to-indigo-500',
          color: '#1D4ED8',
          bgColor: '#DBEAFE',
          shadow: 'rgba(59, 130, 246, 0.15)'
        };
      case '🎯':
        return {
          Component: Target,
          gradient: 'from-rose-400 to-red-500',
          color: '#BE123C',
          bgColor: '#FFE4E6',
          shadow: 'rgba(244, 63, 94, 0.2)'
        };
      case '⭐':
      case '🌟':
        return {
          Component: Star,
          gradient: 'from-yellow-300 to-amber-400',
          color: '#D97706',
          bgColor: '#FEF3C7',
          shadow: 'rgba(245, 158, 11, 0.2)'
        };
      case '🔥':
        return {
          Component: Flame,
          gradient: 'from-orange-500 to-red-600',
          color: '#C2410C',
          bgColor: '#FFEDD5',
          shadow: 'rgba(234, 88, 12, 0.2)'
        };
      case '📚':
        return {
          Component: BookOpen,
          gradient: 'from-indigo-400 to-purple-500',
          color: '#4F46E5',
          bgColor: '#E0E7FF',
          shadow: 'rgba(99, 102, 241, 0.15)'
        };
      case '🛠️':
        return {
          Component: Wrench,
          gradient: 'from-gray-400 to-slate-500',
          color: '#374151',
          bgColor: '#F3F4F6',
          shadow: 'rgba(107, 114, 128, 0.15)'
        };
      case '📅':
        return {
          Component: Calendar,
          gradient: 'from-blue-400 to-indigo-500',
          color: '#1E40AF',
          bgColor: '#DBEAFE',
          shadow: 'rgba(59, 130, 246, 0.15)'
        };
      case '🍦':
        return {
          Component: IceCream,
          gradient: 'from-pink-400 to-rose-500',
          color: '#C2185B',
          bgColor: '#FCE7F3',
          shadow: 'rgba(236, 72, 153, 0.15)'
        };
      case '💻':
        return {
          Component: Smartphone, // Represents computer screen too
          gradient: 'from-indigo-500 to-blue-600',
          color: '#312E81',
          bgColor: '#EEF2F6',
          shadow: 'rgba(79, 70, 229, 0.15)'
        };
      case '✈️':
        return {
          Component: Rocket, // Rocket as airplane representation in gamification
          gradient: 'from-sky-400 to-cyan-500',
          color: '#0369A1',
          bgColor: '#E0F2FE',
          shadow: 'rgba(14, 165, 233, 0.15)'
        };
      case '💼':
        return {
          Component: Briefcase,
          gradient: 'from-amber-600 to-amber-800',
          color: '#78350F',
          bgColor: '#FEF3C7',
          shadow: 'rgba(180, 83, 9, 0.15)'
        };
      case '🐷':
        return {
          Component: PiggyBank,
          gradient: 'from-pink-400 to-rose-500',
          color: '#DB2777',
          bgColor: '#FCE7F3',
          shadow: 'rgba(219, 39, 119, 0.2)'
        };

      // Default fallback
      default:
        return null;
    }
  };

  const config = getIconConfig(key);

  // If the emoji is not mapped, fallback to rendering the text emoji inside a beautiful default circle
  if (!config) {
    if (!showBackground) {
      return <span style={{ fontSize: size }} className={className}>{emoji}</span>;
    }
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-sm border border-purple-200/50 ${className}`}
        style={{
          width: size * 1.8,
          height: size * 1.8
        }}
      >
        <span style={{ fontSize: size }}>{emoji}</span>
      </div>
    );
  }

  const { Component, gradient, color, bgColor, shadow } = config;

  if (!showBackground) {
    return (
      <Component
        size={size}
        style={{ color }}
        className={className}
      />
    );
  }

  // Double size for container
  const containerSize = size * 1.8;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} border border-white/20 transition-all hover:scale-105 duration-300 ${className}`}
      style={{
        width: containerSize,
        height: containerSize,
        boxShadow: `0 8px 16px -4px ${shadow}, inset 0 2px 4px rgba(255, 255, 255, 0.25)`
      }}
    >
      <Component
        size={size}
        className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        strokeWidth={2.2}
      />
    </div>
  );
};
