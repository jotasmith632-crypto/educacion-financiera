
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  Building2,
  Landmark,
  CreditCard,
  Lock,
  Trophy,
  ArrowUpRight,
  Info,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, BackButton } from '../shared/CustomButtons';

interface ModuleLevel5Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel5 = ({ onComplete, onBack }: ModuleLevel5Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Estado para la simulación
  const [selectedProduct, setSelectedProduct] = useState<'savings' | 'fixed' | null>(null);
  
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
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                <Building2 className="w-12 h-12 text-indigo-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-indigo-50"
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">Tu dinero en el Banco</h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg">
                Un banco es mucho más que un edificio. Es un lugar <strong>seguro</strong> para guardar tu dinero y hacerlo crecer.
              </p>
            </Motion.div>
            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
              <p className="text-indigo-800 text-sm font-medium flex items-center gap-2">
                <Lock className="w-5 h-5 flex-shrink-0" />
                Dato: El dinero en el banco está protegido por el Estado. Si guardas bajo el colchón, ¡está en riesgo!
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">Dos opciones comunes</h3>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <CreditCard className="text-green-600 w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-800">Cuenta de Ahorros</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-10">
                  <li>• Puedes retirar tu dinero cuando quieras.</li>
                  <li>• Te dan una tarjeta de débito.</li>
                  <li>• Gana pocos intereses.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Landmark className="text-amber-600 w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-800">Depósito a Plazo Fijo</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-10">
                  <li>• Debes dejar el dinero por un tiempo (ej. 1 año).</li>
                  <li>• No puedes usarlo hasta que termine el plazo.</li>
                  <li>• Gana <strong>muchos más intereses</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">¿Qué son los intereses? 📈</h3>
            <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
              <p className="text-gray-600 text-center mb-6">Es el "alquiler" que el banco te paga por dejar que usen tu dinero para préstamos.</p>
              
              <div className="relative pt-10 pb-4">
                <div className="flex justify-between items-end gap-2">
                  <div className="flex-1 flex flex-col items-center">
                    <Motion.div 
                      animate={{ height: [40, 50] }} 
                      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                      className="w-full bg-indigo-200 rounded-t-lg"
                    />
                    <span className="text-[10px] font-bold text-indigo-400 mt-2">DÍA 1</span>
                    <span className="text-xs font-bold text-gray-400">S/ 100</span>
                  </div>
                  <div className="flex items-center pb-8">
                    <ArrowRight className="text-gray-300" />
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <Motion.div 
                      animate={{ height: [40, 80] }} 
                      transition={{ duration: 2 }}
                      className="w-full bg-indigo-500 rounded-t-lg"
                    />
                    <span className="text-[10px] font-bold text-indigo-600 mt-2 uppercase tracking-wider">UN AÑO DESPUÉS</span>
                    <span className="text-xs font-bold text-indigo-700">S/ 108</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 italic mt-4">¡Ganaste S/ 8 sin hacer nada!</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">Simulador de Banco</h3>
            <p className="text-gray-600 text-center text-sm">Imagina que tienes <strong>S/ 500</strong>. Elige un producto:</p>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setSelectedProduct('savings')}
                className={`p-5 rounded-3xl text-left transition-all border-3 ${selectedProduct === 'savings' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">Cuenta Ahorro Libre</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">1% Interés</span>
                </div>
                <p className="text-xs text-gray-500">Puedes sacar el dinero mañana si quieres comprar un juego.</p>
              </button>

              <button 
                onClick={() => setSelectedProduct('fixed')}
                className={`p-5 rounded-3xl text-left transition-all border-3 ${selectedProduct === 'fixed' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">Depósito a 1 Año</span>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">8% Interés</span>
                </div>
                <p className="text-xs text-gray-500">No puedes tocarlo en 12 meses, ideal para tu meta de la Laptop.</p>
              </button>
            </div>

            {selectedProduct && (
              <Motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 text-white p-5 rounded-3xl shadow-lg"
              >
                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4" /> 
                  Resultado estimado:
                </h4>
                <div className="flex justify-between items-center">
                  <span>En 1 año tendrás:</span>
                  <span className="text-2xl font-black">S/ {selectedProduct === 'savings' ? '505' : '540'}</span>
                </div>
                <p className="text-[10px] opacity-80 mt-2">
                  {selectedProduct === 'savings' ? 'Ganas poco pero el dinero está listo.' : '¡Ganas S/ 40 extra por tu paciencia!'}
                </p>
              </Motion.div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">Reto: Elige bien</h3>
            <div className="space-y-4">
              {[
                { 
                  q: '¿Qué harías si quieres ahorrar para tus pasajes de la próxima semana?', 
                  options: ['Depósito a Plazo', 'Cuenta de Ahorros'],
                  correct: 1
                },
                { 
                  q: '¿Qué harías con el dinero de tu meta que lograrás en 2 años?', 
                  options: ['Cuenta de Ahorros', 'Depósito a Plazo'],
                  correct: 1
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                  <p className="text-sm font-bold text-gray-800 mb-3">{item.q}</p>
                  <div className="flex gap-2">
                    {item.options.map((opt, idx) => (
                      <button key={idx} className="flex-1 py-2 px-3 rounded-xl border-2 border-indigo-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50">
                        {opt}
                      </button>
                    ))}
                  </div>
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
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                <Building2 className="w-16 h-16 text-indigo-600" />
              </div>
              <h3 className="font-black text-3xl text-gray-800 mb-2">¡Nivel Completado!</h3>
              <p className="text-gray-500">Ahora sabes cómo usar los bancos a tu favor.</p>
            </Motion.div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Resumen de tu aprendizaje:</h4>
              <ul className="space-y-3">
                {[
                  'Aprendiste por qué el banco es seguro.',
                  'Diferenciaste entre cuenta de ahorros y plazo fijo.',
                  'Entendiste qué es la tasa de interés.',
                  'Viste cómo tu dinero crece con el tiempo.'
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
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
            <span className="text-sm font-bold">200 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Nivel 5</span>
              <span className="text-xs text-indigo-100">{step} de {totalSteps}</span>
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
      <div className="flex-1 px-6 -mt-6">
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
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <PrimaryButton 
          onClick={handleNext}
          disabled={step === 4 && !selectedProduct}
        >
          {step === totalSteps ? 'Finalizar Nivel' : 'Siguiente'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );
};
