
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const PrimaryButton = ({
  onClick,
  children,
  disabled = false,
  type = "button",
  className = ""
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    type={type}
    className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-opacity ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
  >
    {children}
  </motion.button>
);

export const SecondaryButton = ({
  onClick,
  children,
  disabled = false,
  type = "button",
  className = ""
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    type={type}
    className={`w-full bg-white text-gray-700 py-4 rounded-2xl font-medium shadow-md border-2 border-gray-200 flex items-center justify-center gap-2 transition-opacity ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </motion.button>
);

export const BackButton = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 text-white ${className}`}
  >
    <ChevronRight className="w-4 h-4 rotate-180" />
    <span className="text-sm font-medium">Atrás</span>
  </motion.button>
);
