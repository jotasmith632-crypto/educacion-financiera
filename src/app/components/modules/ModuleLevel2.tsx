
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart,
  Check, 
  Lightbulb, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrimaryButton, BackButton } from '../shared/CustomButtons';
import { PremiumIcon } from '../ui/PremiumIcon';

interface ModuleLevel2Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel2 = ({ onComplete, onBack }: ModuleLevel2Props) => {
  const [identifiedExpenses, setIdentifiedExpenses] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const antExpenses = [
    { id: 'snack', name: 'Snack diario', cost: 3, emoji: '🍫', frequency: '5 veces/semana' },
    { id: 'drink', name: 'Bebida en kiosko', cost: 2.5, emoji: '🥤', frequency: '4 veces/semana' },
    { id: 'game', name: 'Recarga de juego', cost: 5, emoji: '🎮', frequency: '2 veces/semana' },
    { id: 'candy', name: 'Dulces', cost: 1.5, emoji: '🍭', frequency: '6 veces/semana' },
    { id: 'transport', name: 'Taxi innecesario', cost: 4, emoji: '🚖', frequency: '2 veces/semana' },
    { id: 'delivery', name: 'Delivery pequeño', cost: 8, emoji: '🍕', frequency: '1 vez/semana' }
  ];

  const toggleExpense = (id: string) => {
    if (identifiedExpenses.includes(id)) {
      setIdentifiedExpenses(identifiedExpenses.filter(e => e !== id));
    } else {
      setIdentifiedExpenses([...identifiedExpenses, id]);
    }
  };

  const selectedExpenses = antExpenses.filter(e => identifiedExpenses.includes(e.id));
  const totalWeeklySavings = selectedExpenses.reduce((sum, expense) => {
    const freq = parseInt(expense.frequency);
    return sum + (expense.cost * freq);
  }, 0);
  const totalMonthlySavings = totalWeeklySavings * 4;

  const handleComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete(150);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 pt-12 pb-16 px-6 relative overflow-hidden">
        <BackButton onClick={onBack} />

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div 
            className="inline-flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full mb-3 border border-white/30"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="font-bold text-white">Nivel 2 de 7</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Gastos hormiga</h1>
          <p className="text-orange-50 text-lg">Identifica pequeños gastos innecesarios</p>
        </Motion.div>
      </div>

      <div className="px-6 -mt-8 pb-8 space-y-6 relative z-10">
        {!showResult ? (
          <>
            {/* Situation Card */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Situación inicial</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Los <strong>"gastos hormiga"</strong> son pequeñas compras que parecen insignificantes,
                pero al sumarlas pueden afectar tus ahorros. ¡Identifícalos y elimínalos!
              </p>
            </Motion.div>

            {/* Expenses Grid */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <h3 className="font-bold text-lg mb-4">
                Selecciona los gastos que podrías reducir o eliminar
              </h3>
              <div className="space-y-3">
                {antExpenses.map(expense => {
                  const isSelected = identifiedExpenses.includes(expense.id);
                  const weeklyTotal = expense.cost * parseInt(expense.frequency);

                  return (
                    <button
                      key={expense.id}
                      onClick={() => toggleExpense(expense.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 backdrop-blur-sm'
                          : 'border-white/40 bg-white/40 hover:border-orange-300 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <PremiumIcon emoji={expense.emoji} size={24} showBackground={true} />
                        <div className="flex-1 text-left">
                          <div className="font-bold">{expense.name}</div>
                          <div className="text-sm text-gray-600">{expense.frequency}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">S/ {expense.cost}</div>
                          <div className="text-xs text-gray-500">S/ {weeklyTotal.toFixed(1)}/sem</div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Motion.div>

            {/* Current savings preview */}
            {identifiedExpenses.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-orange-100/80 to-amber-100/80 backdrop-blur-md rounded-2xl p-5 border border-white/40"
              >
                <div className="text-center">
                  <div className="text-sm text-orange-700 mb-1">Podrías ahorrar</div>
                  <div className="text-4xl font-bold text-orange-600 mb-1">
                    S/ {totalWeeklySavings.toFixed(2)}
                  </div>
                  <div className="text-sm text-orange-700">por semana</div>
                </div>
              </Motion.div>
            )}

            {/* Analyze Button */}
            <PrimaryButton
              onClick={() => setShowResult(true)}
              disabled={identifiedExpenses.length === 0}
            >
              Ver análisis completo
            </PrimaryButton>
          </>
        ) : (
          <>
            {/* Result Card */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 shadow-xl text-white"
            >
              <div className="mb-4">
                <PremiumIcon emoji="💰" size={32} showBackground={true} />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Gastos hormiga identificados!</h2>
              <p className="text-orange-50 mb-6">
                Encontraste <strong>{identifiedExpenses.length}</strong> gastos que puedes reducir
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-orange-200">
                  <div className="text-orange-700 text-xs font-bold uppercase tracking-wider mb-1">Ahorro semanal</div>
                  <div className="text-3xl font-black text-slate-800">S/ {totalWeeklySavings.toFixed(2)}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-orange-200">
                  <div className="text-orange-700 text-xs font-bold uppercase tracking-wider mb-1">Ahorro mensual</div>
                  <div className="text-3xl font-black text-slate-800">S/ {totalMonthlySavings.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-orange-200">
                <div className="text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 text-center">En un año ahorrarías</div>
                <div className="text-5xl font-black text-slate-800 text-center">S/ {(totalMonthlySavings * 12).toFixed(2)}</div>
              </div>
            </Motion.div>

            {/* Feedback */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg">Retroalimentación</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                ¡Excelente análisis! Los gastos hormiga suelen representar entre el 10-30% de nuestros gastos totales.
                Al identificarlos y reducirlos, puedes:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Alcanzar tus metas de ahorro más rápido</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Tener más control sobre tu dinero</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Desarrollar hábitos financieros saludables</span>
                </li>
              </ul>
            </Motion.div>

            {/* Strategy Tip */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-blue-200/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">Estrategia recomendada</h3>
              </div>
              <p className="text-gray-700">
                No tienes que eliminar todos estos gastos de inmediato. Empieza reduciendo
                <strong> {Math.min(2, identifiedExpenses.length)} gastos</strong> y ve los resultados.
                Luego podrás seguir optimizando.
              </p>
            </Motion.div>

            {/* Reward */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">¡Recompensa!</h3>
              <p className="text-gray-600 text-sm mb-6">Has ganado 150 puntos por completar este análisis</p>

              <PrimaryButton onClick={handleComplete}>
                Continuar al siguiente nivel
              </PrimaryButton>
            </Motion.div>
          </>
        )}
      </div>
    </div>
  );
};
