
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ArrowRight, 
  Check, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  PiggyBank, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Rocket,
  DollarSign,
  PieChart,
  ShoppingBag,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, SecondaryButton, BackButton } from '../shared/CustomButtons';
import { PremiumIcon } from '../ui/PremiumIcon';

interface ModuleLevel3Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel3 = ({ onComplete, onBack }: ModuleLevel3Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Estado para la actividad de distribución
  const [budget, setBudget] = useState({
    needs: 0,
    wants: 0,
    savings: 0
  });
  const totalBudget = 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete(150);
  };

  const updateBudget = (type: 'needs' | 'wants' | 'savings', value: number) => {
    const numericValue = Math.max(0, value);
    const otherTypes = Object.keys(budget).filter(k => k !== type) as Array<'needs' | 'wants' | 'savings'>;
    const currentOthersTotal = budget[otherTypes[0]] + budget[otherTypes[1]];
    
    if (numericValue + currentOthersTotal <= totalBudget) {
      setBudget({
        ...budget,
        [type]: numericValue
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
                <PieChart className="w-12 h-12 text-blue-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-blue-50"
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">¿Qué es un Plan de Ahorro?</h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg">
                Un plan de ahorro es como un <strong>mapa del tesoro</strong> para tu dinero. 
                Te ayuda a decidir cuánto gastar hoy y cuánto guardar para tus metas del futuro.
              </p>
            </Motion.div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-blue-800 text-sm font-medium flex items-center gap-2">
                <Lightbulb className="w-5 h-5 flex-shrink-0" />
                Sin un plan, el dinero tiende a "desaparecer" en pequeñas cosas sin que te des cuenta.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">Tus fuentes de ingreso</h3>
            <p className="text-gray-600 text-center">Antes de planear, debemos saber de dónde viene el dinero:</p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'Propinas', icon: '💰', desc: 'Regalos de abuelos o tíos' },
                { title: 'Mesada/Paga', icon: '📅', desc: 'Dinero fijo que te dan tus padres' },
                { title: 'Pequeños trabajos', icon: '🛠️', desc: 'Lavar el auto, ayudar en casa, etc.' },
                { title: 'Premios', icon: '🏆', desc: 'Dinero por buenas notas o concursos' }
              ].map((item, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <PremiumIcon emoji={item.icon} size={20} showBackground={true} />
                  <div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">La Regla de Oro: 50/30/20</h3>
            <p className="text-gray-600 text-center">Una forma experta de dividir tu dinero:</p>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-5 rounded-2xl border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <Check className="text-green-600 w-6 h-6" />
                  <h4 className="font-bold text-green-800">50% para Necesidades</h4>
                </div>
                <p className="text-sm text-green-700">Cosas que SIEMPRE necesitas (pasajes, merienda escolar, materiales).</p>
              </div>

              <div className="bg-yellow-50 p-5 rounded-2xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-yellow-600 w-6 h-6" />
                  <h4 className="font-bold text-yellow-800">30% para Deseos</h4>
                </div>
                <p className="text-sm text-yellow-700">Cosas que te gustan pero podrías vivir sin ellas (un dulce, un juguete, cine).</p>
              </div>

              <div className="bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <PiggyBank className="text-blue-600 w-6 h-6" />
                  <h4 className="font-bold text-blue-800">20% para Ahorro</h4>
                </div>
                <p className="text-sm text-blue-700">Dinero para tu meta del futuro (un nuevo celular, bicicleta, viaje).</p>
              </div>
            </div>
          </div>
        );

      case 4:
        const remaining = totalBudget - (budget.needs + budget.wants + budget.savings);
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">¡Haz tu propio plan!</h3>
            <p className="text-gray-600 text-center mb-4">Tienes <strong>S/ {totalBudget}</strong> imaginarios. Distribúyelos:</p>
            
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-6">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mb-4">
                <span className="font-bold text-gray-500">Por repartir:</span>
                <span className={`text-xl font-black ${remaining === 0 ? 'text-green-500' : 'text-blue-600'}`}>S/ {remaining}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700">Necesidades (S/ {budget.needs})</span>
                    <span className="text-gray-400">Recomendado: S/ 50</span>
                  </div>
                  <input 
                    type="range" min="0" max={budget.needs + remaining} value={budget.needs} 
                    onChange={(e) => updateBudget('needs', parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700">Deseos (S/ {budget.wants})</span>
                    <span className="text-gray-400">Recomendado: S/ 30</span>
                  </div>
                  <input 
                    type="range" min="0" max={budget.wants + remaining} value={budget.wants} 
                    onChange={(e) => updateBudget('wants', parseInt(e.target.value))}
                    className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700">Ahorro (S/ {budget.savings})</span>
                    <span className="text-gray-400">Recomendado: S/ 20</span>
                  </div>
                  <input 
                    type="range" min="0" max={budget.savings + remaining} value={budget.savings} 
                    onChange={(e) => updateBudget('savings', parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {remaining === 0 && (
                <Motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 text-green-700 p-3 rounded-xl text-center text-sm font-bold"
                >
                  ¡Plan balanceado! Has distribuido todo el dinero.
                </Motion.div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">El secreto del éxito</h3>
            <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-50">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-purple-800 text-center mb-2">¡Págate a ti primero!</h4>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                El error más común es ahorrar lo que "sobra" al final. <br/>
                <strong>El truco es separar el 20% apenas recibes tu dinero.</strong> <br/>
                Así aseguras tu futuro antes de que las tentaciones aparezcan.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500 mb-2">Sin Plan</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <PremiumIcon emoji="💰" size={14} showBackground={false} className="opacity-60 grayscale" />
                  <span className="text-xs text-gray-400">➔</span>
                  <PremiumIcon emoji="🛒" size={14} showBackground={false} className="opacity-60 grayscale" />
                  <span className="text-xs text-gray-400">➔</span>
                  <span className="text-xs font-black text-red-500 bg-red-50 px-1 rounded">❓</span>
                </div>
                <p className="text-[10px] text-gray-400">Gasto total</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-200 text-center ring-2 ring-purple-50 flex flex-col items-center justify-center">
                <p className="text-xs text-purple-600 font-bold mb-2">Con Plan</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <PremiumIcon emoji="💰" size={14} showBackground={false} />
                  <span className="text-xs text-purple-400">➔</span>
                  <PremiumIcon emoji="🐷" size={14} showBackground={false} />
                  <span className="text-xs text-purple-400">➔</span>
                  <PremiumIcon emoji="🛒" size={14} showBackground={false} />
                </div>
                <p className="text-[10px] text-purple-400 font-semibold">Ahorro asegurado</p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8 py-4">
            <Motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                <Trophy className="w-16 h-16 text-yellow-600" />
              </div>
              <h3 className="font-black text-3xl text-gray-800 mb-2">¡Nivel Completado!</h3>
              <p className="text-gray-500">Ahora sabes cómo crear un plan de ahorro sólido.</p>
            </Motion.div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Resumen de tu aprendizaje:</h4>
              <ul className="space-y-3">
                {[
                  'Identificaste tus fuentes de ingresos.',
                  'Aprendiste la regla 50/30/20.',
                  'Creaste tu primer presupuesto balanceado.',
                  'Entendiste por qué "pagarte a ti primero" es clave.'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Fijo */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <div 
            className="backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
            <span className="text-sm font-bold text-white">150 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Nivel 3</span>
              <span className="text-xs text-blue-100">{step} de {totalSteps}</span>
            </div>
            <Progress.Root className="relative overflow-hidden bg-white/20 rounded-full w-full h-2">
              <Progress.Indicator
                className="h-full bg-white transition-all duration-500 rounded-full"
                style={{ transform: `translateX(-${100 - (step / totalSteps) * 100}%)` }}
              />
            </Progress.Root>
          </div>
        </div>
      </div>

      {/* Contenido Deslizable */}
      <div className="flex-1 px-6 -mt-6 relative z-10">
        <AnimatePresence mode="wait">
          <Motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-24"
          >
            {renderStep()}
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* Footer con Botón Siguiente */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-20">
        <div className="w-full max-w-md p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pointer-events-auto">
          <PrimaryButton 
            onClick={handleNext}
            disabled={step === 4 && totalBudget - (budget.needs + budget.wants + budget.savings) > 0}
          >
            {step === totalSteps ? 'Finalizar Nivel' : 'Siguiente'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
