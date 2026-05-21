
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
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as Progress from '@radix-ui/react-progress';
import { PrimaryButton, SecondaryButton, BackButton } from '../shared/CustomButtons';
import { PremiumIcon } from '../ui/PremiumIcon';
import { AvatarRenderer } from '../ui/AvatarRenderer';

const valeriaAvatar = {
  id: 'valeria',
  face: 'happy',
  skin: '#FFD1A0',
  hair: 'bob',
  accessory: 'none'
};

interface ModuleLevel1Props {
  onComplete: (points: number, metaFinanciera?: string) => void;
  onBack: () => void;
}

export const ModuleLevel1 = ({ onComplete, onBack }: ModuleLevel1Props) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 10;

  // State for Screen 2: Classification
  const [classifiedGoals, setClassifiedGoals] = useState<{ [key: string]: 'short' | 'long' | '' }>({
    snack: '',
    laptop: '',
    headphones: '',
    travel: ''
  });

  // State for Screen 5: Analysis
  const [analysisAnswer1, setAnalysisAnswer1] = useState<string>('');
  const [analysisAnswer2, setAnalysisAnswer2] = useState<string>('');

  // State for Screen 6: Decision
  const [valeriaDecision, setValeriaDecision] = useState<string>('');

  // State for Screen 7: Choice
  const [financingChoice, setFinancingChoice] = useState<string>('');

  // State for Screen 8: My Goal
  const [myGoal, setMyGoal] = useState({
    title: '',
    cost: '',
    weeks: 4,
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete(100, myGoal.title);
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
                <Target className="w-12 h-12 text-blue-600" />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-blue-50"
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">¿Qué es una meta financiera?</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Es un <strong>objetivo específico</strong> que quieres lograr con tu dinero en un tiempo determinado. 
                Tener una meta te da un "norte" y te motiva a ahorrar.
              </p>
            </Motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                <span className="text-3xl mb-2 block">🍦</span>
                <p className="text-xs font-bold text-green-800">Cosas pequeñas</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                <span className="text-3xl mb-2 block">🎓</span>
                <p className="text-xs font-bold text-purple-800">Grandes sueños</p>
              </div>
            </div>
            <PrimaryButton onClick={handleNext}>
              Comenzar el reto
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Clasifica las metas</h3>
              <p className="text-sm text-gray-600 mb-6">
                ¿Cuánto tiempo crees que toma ahorrar para esto? Clasifícalas en <b>Corto plazo</b> (semanas/meses) o <b>Largo plazo</b> (años).
              </p>
              <div className="space-y-4">
                {[
                  { id: 'snack', label: 'Un helado hoy', icon: '🍦' },
                  { id: 'laptop', label: 'Una Laptop Gamer', icon: '💻' },
                  { id: 'headphones', label: 'Audífonos nuevos', icon: '🎧' },
                  { id: 'travel', label: 'Viaje de promoción', icon: '✈️' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setClassifiedGoals({...classifiedGoals, [item.id]: 'short'})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          classifiedGoals[item.id] === 'short' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-500 border border-gray-300'
                        }`}
                      >
                        Corto
                      </button>
                      <button
                        onClick={() => setClassifiedGoals({...classifiedGoals, [item.id]: 'long'})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          classifiedGoals[item.id] === 'long' 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-white text-gray-500 border border-gray-300'
                        }`}
                      >
                        Largo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PrimaryButton 
              onClick={handleNext} 
              disabled={Object.values(classifiedGoals).some(v => v === '')}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg"
            >
              <h3 className="font-bold text-2xl mb-4">Tu meta necesita un plan</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                No basta con querer algo. Para lograr una meta financiera necesitas saber:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                  <PremiumIcon emoji="💰" size={18} showBackground={true} className="rounded-lg shadow-none" />
                  <span className="text-sm font-medium">¿Cuánto cuesta? (El Monto)</span>
                </li>
                <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                  <PremiumIcon emoji="📅" size={18} showBackground={true} className="rounded-lg shadow-none" />
                  <span className="text-sm font-medium">¿Para cuándo lo quieres? (El Tiempo)</span>
                </li>
                <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                  <PremiumIcon emoji="🐷" size={18} showBackground={true} className="rounded-lg shadow-none" />
                  <span className="text-sm font-medium">¿Cuánto ahorrarás cada semana?</span>
                </li>
              </ul>
            </Motion.div>
            <div className="bg-blue-50 p-5 rounded-3xl border-2 border-dashed border-blue-200 text-center">
              <p className="text-blue-700 font-medium italic">
                "Un objetivo sin un plan es solo un deseo."
              </p>
            </div>
            <PrimaryButton onClick={handleNext}>
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center border border-pink-200 overflow-hidden">
                  <AvatarRenderer avatar={valeriaAvatar} size={64} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">Misión: Ayuda a Valeria</h3>
                  <p className="text-sm text-gray-500">Un caso de la vida real</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Valeria está en 4to de secundaria. Recibe <b>S/ 25 a la semana</b> de propina. 
                Ella quiere comprarse unos audífonos de <b>S/ 100</b> para sus clases y música.
              </p>
              <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ingreso semanal:</span>
                  <span className="font-bold text-gray-800">S/ 25</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta (Audífonos):</span>
                  <span className="font-bold text-blue-600">S/ 100</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    Valeria suele gastar casi todo en snacks y juegos apenas recibe su propina.
                  </p>
                </div>
              </div>
            </div>
            <PrimaryButton onClick={handleNext}>
              Ayudar a Valeria
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Analiza la situación</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    1. Si Valeria ahorra S/ 10 a la semana, ¿en cuántas semanas logrará su meta?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['4 semanas', '10 semanas'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnalysisAnswer1(opt)}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          analysisAnswer1 === opt 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    2. ¿Qué es lo primero que Valeria debería hacer al recibir sus S/ 25?
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'spend', label: 'Gastar y ver si sobra algo' },
                      { id: 'save', label: 'Separar su ahorro primero (S/ 10)' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAnalysisAnswer2(opt.id)}
                        className={`w-full p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${
                          analysisAnswer2 === opt.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <PrimaryButton 
              onClick={handleNext} 
              disabled={!analysisAnswer1 || !analysisAnswer2}
            >
              Confirmar análisis
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">Toma una decisión</h3>
                <p className="text-sm text-gray-500">¿Cómo debería Valeria organizar su semana?</p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setValeriaDecision('conservative')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    valeriaDecision === 'conservative' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-700">Plan "Paso a Paso"</span>
                    <Check className={`w-5 h-5 ${valeriaDecision === 'conservative' ? 'text-purple-600' : 'text-transparent'}`} />
                  </div>
                  <p className="text-xs text-gray-600">Ahorra S/ 5 semanales. Logra su meta en 20 semanas pero gasta más en snacks.</p>
                </button>
                <button
                  onClick={() => setValeriaDecision('fast')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    valeriaDecision === 'fast' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-700">Plan "Ahorrador Pro"</span>
                    <Check className={`w-5 h-5 ${valeriaDecision === 'fast' ? 'text-purple-600' : 'text-transparent'}`} />
                  </div>
                  <p className="text-xs text-gray-600">Ahorra S/ 15 semanales. Logra su meta en 7 semanas. Debe reducir snacks a la mitad.</p>
                </button>
              </div>
            </div>
            <PrimaryButton onClick={handleNext} disabled={!valeriaDecision}>
              Elegir este plan
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Ahorro vs. Crédito</h3>
              <p className="text-sm text-gray-600 mb-6">
                Valeria tiene una oferta: su hermano le presta los S/ 100 hoy, pero ella debe devolverle <b>S/ 120</b> en un mes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFinancingChoice('ahorro')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    financingChoice === 'ahorro' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <PiggyBank className="w-10 h-10 text-green-600" />
                  <span className="text-xs font-bold text-center">Esperar y ahorrar (Cuesta S/ 100)</span>
                </button>
                <button
                  onClick={() => setFinancingChoice('credito')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    financingChoice === 'credito' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-10 h-10 text-red-600" />
                  <span className="text-xs font-bold text-center">Pedir prestado (Cuesta S/ 120)</span>
                </button>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <p className="text-xs text-blue-800 leading-relaxed">
                  💡 <b>Tip Financiero:</b> El crédito te permite tener las cosas HOY, pero casi siempre terminas pagando MÁS por ellas debido a los intereses.
                </p>
              </div>
            </div>
            <PrimaryButton onClick={handleNext} disabled={!financingChoice}>
              Continuar
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Construye tu propia meta</h3>
              <p className="text-sm text-gray-600 mb-6">¡Es tu turno! Define una meta que quieras lograr.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">¿Qué quieres lograr?</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Zapatillas, un libro, ahorros..." 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                    value={myGoal.title}
                    onChange={(e) => setMyGoal({...myGoal, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Monto (S/)</label>
                    <input 
                      type="number" 
                      placeholder="Monto" 
                      className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                      value={myGoal.cost}
                      onChange={(e) => setMyGoal({...myGoal, cost: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tiempo (Semanas)</label>
                    <input 
                      type="number" 
                      placeholder="Semanas" 
                      className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                      value={myGoal.weeks}
                      onChange={(e) => setMyGoal({...myGoal, weeks: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <PrimaryButton onClick={handleNext} disabled={!myGoal.title || !myGoal.cost}>
              Crear mi meta
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                <h3 className="font-bold text-xl text-gray-800">Reflexión Final</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                ¿Qué aprendiste hoy sobre las metas financieras? Selecciona la idea más importante para ti:
              </p>
              <div className="space-y-3">
                {[
                  "Tener un plan hace que mis sueños sean posibles.",
                  "Ahorrar primero me ayuda a no gastar en cosas que no necesito.",
                  "Pedir prestado cuesta más dinero a largo plazo."
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    className="w-full p-4 text-left bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700"
                    onClick={handleNext}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
            <SecondaryButton onClick={() => setStep(step - 1)}>
              Volver a revisar
            </SecondaryButton>
          </div>
        );

      case 10:
        return (
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <Motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-full shadow-lg z-20"
              >
                <Star className="w-6 h-6" fill="currentColor" />
              </Motion.div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Nivel 1 Completado!</h2>
              <p className="text-gray-600">Has dado el primer paso para ser un maestro de tus finanzas.</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-yellow-100 max-w-xs mx-auto">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">Recompensa</p>
              <p className="text-4xl font-black text-yellow-500 mb-1">+100</p>
              <p className="text-sm font-bold text-gray-800">Puntos de Sabiduría</p>
            </div>
            <PrimaryButton onClick={handleNext}>
              Reclamar y salir
              <Rocket className="w-5 h-5" />
            </PrimaryButton>
          </Motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-12">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 pb-12 rounded-b-[40px] shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={onBack} />
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
            <span className="font-bold text-sm">Nivel 1</span>
          </div>
        </div>
        
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-black">Mi Meta Financiera</h1>
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs font-bold mb-2 opacity-80">
              <span>PROGRESO DEL NIVEL</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress.Root className="h-3 bg-white/20 rounded-full overflow-hidden" value={(step / totalSteps) * 100}>
              <Progress.Indicator 
                className="h-full bg-white rounded-full transition-transform duration-500"
                style={{ transform: `translateX(-${100 - (step / totalSteps) * 100}%)` }}
              />
            </Progress.Root>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 -mt-6 relative z-10">
        <AnimatePresence mode="wait">
          <Motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      {step < 10 && (
        <div className="mt-8 px-8 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Aprende · Ahorra · Crece
          </p>
        </div>
      )}
    </div>
  );
};
