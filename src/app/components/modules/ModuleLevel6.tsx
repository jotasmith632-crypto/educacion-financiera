
import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  LineChart,
  BarChart3,
  Briefcase,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Building,
  Coins,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, BackButton } from '../shared/CustomButtons';

interface ModuleLevel6Props {
  onComplete: (points: number) => void;
  onBack: () => void;
}

export const ModuleLevel6 = ({ onComplete, onBack }: ModuleLevel6Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Estado para el simulador de bolsa
  const [balance, setBalance] = useState(100);
  const [shares, setShares] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(20);
  const [history, setHistory] = useState([20]);
  const [day, setDay] = useState(1);
  
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
    onComplete(250);
  };

  const nextDay = () => {
    if (day >= 5) return;
    
    const volatility = Math.random() * 10 - 4; // -4 to +6 (tendencia al alza)
    const newPrice = Math.max(5, Math.round(currentPrice + volatility));
    
    setCurrentPrice(newPrice);
    setHistory([...history, newPrice]);
    setDay(day + 1);
  };

  const buyShare = () => {
    if (balance >= currentPrice) {
      setBalance(balance - currentPrice);
      setShares(shares + 1);
    }
  };

  const sellShare = () => {
    if (shares > 0) {
      setBalance(balance + currentPrice);
      setShares(shares - 1);
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
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center shadow-inner">
                <BarChart3 className="w-12 h-12 text-rose-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">La Bolsa de Valores</h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg">
                ¿Sabías que puedes ser "dueño" de una parte de tus empresas favoritas como Apple, Disney o Roblox? <br/>
                Eso es la Bolsa: un mercado donde se compran y venden <strong>acciones</strong>.
              </p>
            </Motion.div>
            <div className="bg-rose-50/80 backdrop-blur-md rounded-2xl p-4 border border-rose-200/50">
              <p className="text-rose-800 text-sm font-medium flex items-center gap-2">
                <Building className="w-5 h-5 flex-shrink-0" />
                Una acción es un "pedacito" de una empresa. Si a la empresa le va bien, tu acción vale más.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">¿Por qué cambia el precio?</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 border-l-4 border-l-green-500 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingUp className="text-green-600 w-5 h-5" />
                  <h4 className="font-bold text-gray-800">Sube si...</h4>
                </div>
                <p className="text-xs text-gray-500">Mucha gente quiere comprar (Alta demanda) o la empresa tiene buenas noticias.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 border-l-4 border-l-red-500 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingDown className="text-red-600 w-5 h-5" />
                  <h4 className="font-bold text-gray-800">Baja si...</h4>
                </div>
                <p className="text-xs text-gray-500">La gente tiene miedo y vende (Alta oferta) o la empresa tiene problemas.</p>
              </div>
            </div>
            <div className="bg-blue-50/80 backdrop-blur-md p-4 rounded-2xl border border-blue-200/50 text-center">
              <p className="text-blue-800 text-xs font-bold italic">
                "La clave es comprar barato y vender caro"
              </p>
            </div>
          </div>
        );

      case 3:
        const totalValue = balance + (shares * currentPrice);
        const profit = totalValue - 100;
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800 uppercase tracking-tight">Día {day} de 5</h3>
              <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                Balance: S/ {balance}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/60">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Precio Acción "EcoGames"</p>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-black text-gray-800">S/ {currentPrice}</span>
                    {day > 1 && (
                      <span className={`text-sm font-bold flex items-center ${currentPrice >= history[day-2] ? 'text-green-500' : 'text-red-500'}`}>
                        {currentPrice >= history[day-2] ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(currentPrice - history[day-2])}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Tienes</p>
                  <p className="text-2xl font-black text-rose-600">{shares} <span className="text-sm">acc.</span></p>
                </div>
              </div>

              {/* Mini gráfico simplificado */}
              <div className="h-24 flex items-end gap-2 mb-6 px-2">
                {history.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <Motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(h / 40) * 100}%` }}
                      className={`w-full rounded-t-md ${i === day - 1 ? 'bg-rose-500' : 'bg-gray-200'}`}
                    />
                    <span className="text-[8px] text-gray-400">D{i+1}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={buyShare}
                  disabled={balance < currentPrice || day === 5}
                  className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold shadow-md active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  Comprar
                </button>
                <button 
                  onClick={sellShare}
                  disabled={shares === 0 || day === 5}
                  className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold shadow-md active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  Vender
                </button>
              </div>
            </div>

            {day < 5 ? (
              <button 
                onClick={nextDay}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Siguiente Día <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl text-center font-bold ${profit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {profit >= 0 ? `¡Felicidades! Ganaste S/ ${profit}` : `Perdiste S/ ${Math.abs(profit)}. ¡Así es el riesgo!`}
              </Motion.div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">La clave es la paciencia</h3>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-md border border-white/60 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Clock className="w-32 h-32 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 relative z-10">
                En la bolsa, los precios suben y bajan todos los días. Si te asustas y vendes cuando baja, pierdes dinero real.
              </p>
              <p className="font-bold text-blue-800 relative z-10">
                Los mejores inversores esperan años. A largo plazo, las buenas empresas siempre crecen.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center">
                <p className="text-[10px] text-red-600 font-bold mb-1 uppercase">A corto plazo</p>
                <div className="text-lg font-black">🎢 Montaña Rusa</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center">
                <p className="text-[10px] text-green-600 font-bold mb-1 uppercase">A largo plazo</p>
                <div className="text-lg font-black">📈 Crecimiento</div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-800 text-center">No pongas todos los huevos...</h3>
            <div className="bg-amber-50/80 backdrop-blur-md p-6 rounded-3xl border border-amber-200/50 text-center">
              <div className="text-5xl mb-4">🧺🥚🥚🥚</div>
              <h4 className="font-black text-amber-800 mb-2">DIVERSIFICACIÓN</h4>
              <p className="text-gray-600 text-sm">
                Significa invertir en varias cosas distintas. Si una empresa cae, las otras pueden salvarte.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Check className="text-green-600 w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Ejemplo: Un poco en tecnología, un poco en energía y un poco en comida.</p>
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
              <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                <Coins className="w-16 h-16 text-rose-600" />
              </div>
              <h3 className="font-black text-3xl text-gray-800 mb-2">¡Nivel Completado!</h3>
              <p className="text-gray-500">¡Ya eres un mini inversor de la bolsa!</p>
            </Motion.div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Resumen de tu aprendizaje:</h4>
              <ul className="space-y-3">
                {[
                  'Entendiste qué es una acción.',
                  'Aprendiste por qué los precios cambian.',
                  'Experimentaste el riesgo en el simulador.',
                  'Descubriste el poder de la diversificación.'
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
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header Fijo */}
      <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <div 
            className="backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
            <span className="text-sm font-bold text-white">250 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-rose-100 uppercase tracking-wider">Nivel 6</span>
              <span className="text-xs text-rose-100">{step} de {totalSteps}</span>
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
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
        <PrimaryButton 
          onClick={handleNext}
          disabled={step === 3 && day < 5}
        >
          {step === totalSteps ? 'Finalizar Nivel' : 'Siguiente'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );
};
