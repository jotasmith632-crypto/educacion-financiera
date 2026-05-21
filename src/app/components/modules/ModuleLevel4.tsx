
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck,
  AlertTriangle,
  PiggyBank, 
  LineChart,
  Trophy,
  Rocket,
  Zap,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, BackButton } from '../shared/CustomButtons';

interface ModuleLevel4Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel4 = ({ onComplete, onBack }: ModuleLevel4Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Estado para la actividad de comparación
  const [years, setYears] = useState(1);
  
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
    onComplete(200);
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
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center shadow-inner">
                <TrendingUp className="w-12 h-12 text-purple-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-purple-50"
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">¿Ahorrar o Invertir?</h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg">
                Ambos son importantes, pero sirven para cosas distintas. <br/>
                <strong>Ahorrar</strong> es guardar para estar seguro. <br/>
                <strong>Invertir</strong> es arriesgar un poco para ganar más.
              </p>
            </Motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                <PiggyBank className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-green-800 uppercase">Ahorro</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                <Rocket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-blue-800 uppercase">Inversión</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">El Ahorro: Tu escudo 🛡️</h3>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-xl">
                  <ShieldCheck className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Seguridad Total</h4>
                  <p className="text-sm text-gray-500">Tu dinero siempre vale lo mismo y no se pierde.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Zap className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Disponibilidad</h4>
                  <p className="text-sm text-gray-500">Puedes usarlo hoy mismo si tienes una emergencia.</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Desventaja: Con el tiempo, las cosas suben de precio y tu ahorro compra menos cosas (Inflación).
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">La Inversión: Tu motor 🚀</h3>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Crecimiento</h4>
                  <p className="text-sm text-gray-500">Tu dinero genera intereses o ganancias y "crece" solo.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <AlertTriangle className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Riesgo</h4>
                  <p className="text-sm text-gray-500">Existe la posibilidad de que el valor baje por un tiempo.</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
              <p className="text-blue-800 text-sm font-bold">
                "Invertir es poner a tu dinero a trabajar para ti"
              </p>
            </div>
          </div>
        );

      case 4:
        const savingsValue = 100 + (years * 2); // 2% interés
        const investmentValue = 100 * Math.pow(1.10, years); // 10% interés estimado
        
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">Mira la diferencia</h3>
            <p className="text-gray-600 text-center text-sm">Si empiezas con <strong>S/ 100</strong>, así crecen en {years} años:</p>
            
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-green-600 uppercase">Solo Ahorro</span>
                  <span className="text-xl font-black text-green-700">S/ {savingsValue.toFixed(2)}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <Motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(savingsValue / (100 * Math.pow(1.1, 10))) * 100}%` }}
                    className="h-full bg-green-500"
                  />
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-dashed">
                  <span className="text-sm font-bold text-blue-600 uppercase">Inversión</span>
                  <span className="text-xl font-black text-blue-700">S/ {investmentValue.toFixed(2)}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <Motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(investmentValue / (100 * Math.pow(1.1, 10))) * 100}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-center text-xs text-gray-400 mb-2">Desliza para ver pasar el tiempo</p>
                <input 
                  type="range" min="1" max="10" value={years} 
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between mt-2 px-2 text-[10px] font-bold text-gray-400 uppercase">
                  <span>1 año</span>
                  <span>5 años</span>
                  <span>10 años</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">¿Qué elegirías tú?</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { q: 'Dinero para el almuerzo de mañana', a: 'Ahorro (Seguridad)', desc: 'Lo necesitas pronto y no puedes arriesgarlo.' },
                { q: 'Dinero para tu universidad en 5 años', a: 'Inversión (Crecimiento)', desc: 'Tienes tiempo para que crezca y supere los riesgos.' },
                { q: 'Tu primer sueldo de un trabajo extra', a: 'Ambos', desc: 'Una parte al escudo (ahorro) y otra al motor (inversión).' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                  <p className="text-sm font-bold text-gray-800 mb-2">{item.q}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-bold uppercase">
                      {item.a}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">{item.desc}</p>
                </div>
              ))}
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
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                <Trophy className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="font-black text-3xl text-gray-800 mb-2">¡Nivel Completado!</h3>
              <p className="text-gray-500">Has dominado la base de la libertad financiera.</p>
            </Motion.div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Resumen de tu aprendizaje:</h4>
              <ul className="space-y-3">
                {[
                  'Entendiste que el ahorro es seguridad.',
                  'Aprendiste que la inversión es crecimiento.',
                  'Viste cómo el tiempo hace crecer tu dinero.',
                  'Identificaste cuándo conviene cada opción.'
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
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <div 
            className="backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
            <span className="text-sm font-bold text-white">200 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Nivel 4</span>
              <span className="text-xs text-purple-100">{step} de {totalSteps}</span>
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
          <PrimaryButton onClick={handleNext}>
            {step === totalSteps ? 'Finalizar Nivel' : 'Siguiente'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
