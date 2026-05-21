
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  Trophy,
  Award,
  Medal,
  Rocket,
  ShieldCheck,
  Target,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, BackButton } from '../shared/CustomButtons';

interface ModuleLevel7Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel7 = ({ onComplete, onBack }: ModuleLevel7Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Estado para las respuestas del examen
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  
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
    const score = Object.keys(answers).length * 100;
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 }
    });
    onComplete(score + 300); // Bono final
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-md border border-yellow-50"
            >
              <h3 className="font-bold text-3xl mb-4 text-gray-800">¡La Gran Decisión!</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Has llegado al final del camino. Es hora de demostrar que eres un <strong>Maestro del Dinero</strong>. 
                Resuelve los casos finales para obtener tu certificación.
              </p>
            </Motion.div>
            <div className="flex justify-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800">Caso 1: El Regalo Inesperado</h3>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-6 italic">"Ganas un premio de S/ 200 en un concurso de talentos. ¿Qué es lo más inteligente que puedes hacer?"</p>
              
              <div className="space-y-3">
                {[
                  'Gastarlo todo hoy en dulces y juegos.',
                  'Separar el 20% para tu meta, cubrir tus necesidades y el resto para un deseo.',
                  'Guardarlo todo bajo el colchón para siempre.'
                ].map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setAnswers({...answers, 2: i})}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all border-2 ${answers[2] === i ? 'border-yellow-500 bg-yellow-50 font-bold' : 'border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800">Caso 2: Inversión vs Ahorro</h3>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-6 italic">"Tienes ahorrado dinero para tu universidad (en 6 años). ¿Dónde conviene ponerlo?"</p>
              
              <div className="space-y-3">
                {[
                  'En una cuenta de ahorros que puedes sacar mañana.',
                  'En una inversión a largo plazo (Bolsa o Plazo Fijo) para que crezca.',
                  'Prestarlo a un amigo sin cobrar intereses.'
                ].map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setAnswers({...answers, 3: i})}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all border-2 ${answers[3] === i ? 'border-yellow-500 bg-yellow-50 font-bold' : 'border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800">Caso 3: Seguridad Bancaria</h3>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-6 italic">"¿Por qué es mejor usar un banco que guardar el dinero en casa?"</p>
              
              <div className="space-y-3">
                {[
                  'Porque el banco me regala dulces.',
                  'Porque está protegido por el Estado, gano intereses y no se pierde.',
                  'No es mejor, en casa es más seguro siempre.'
                ].map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setAnswers({...answers, 4: i})}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all border-2 ${answers[4] === i ? 'border-yellow-500 bg-yellow-50 font-bold' : 'border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <h3 className="font-bold text-2xl text-gray-800">Resumen de tu Perfil</h3>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20 -mr-10 -mt-10">
                <Award className="w-40 h-40" />
              </div>
              
              <div className="relative z-10">
                <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Certificación</p>
                <h4 className="text-3xl font-black mb-6">EXPERTO EN AHORRO</h4>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] uppercase font-bold">Módulos</p>
                    <p className="text-xl font-black">7 / 7</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] uppercase font-bold">Rango</p>
                    <p className="text-xl font-black">Diamante</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic mt-4">"El conocimiento es la mejor inversión que puedes hacer."</p>
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
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white">
                <Award className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-black text-3xl text-gray-800 mb-2">¡MÓDULO COMPLETADO!</h3>
              <p className="text-gray-500">Has desbloqueado el acceso a las Olimpiadas Financieras.</p>
            </Motion.div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Logros obtenidos:</h4>
              <ul className="space-y-3">
                {[
                  'Dominio de Metas Financieras.',
                  'Control de Gastos Hormiga.',
                  'Experto en Presupuesto 50/30/20.',
                  'Conocimiento de Inversión y Bolsa.',
                  'Uso inteligente de Bancos.'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="bg-yellow-100 p-1 rounded-full">
                      <Sparkles className="w-3 h-3 text-yellow-600" />
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
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2">
            <Star className="w-4 h-4 text-white" fill="currentColor" />
            <span className="text-sm font-bold">EXAMEN FINAL</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-yellow-100 uppercase tracking-wider">Módulo 1: Graduación</span>
              <span className="text-xs text-yellow-100">{step} de {totalSteps}</span>
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
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <PrimaryButton 
          onClick={handleNext}
          disabled={(step === 2 && answers[2] === undefined) || (step === 3 && answers[3] === undefined) || (step === 4 && answers[4] === undefined)}
        >
          {step === totalSteps ? '¡Obtener mi Trofeo!' : 'Continuar'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );
};
