import React from 'react';
import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import { Trophy, Target, Rocket, TrendingUp, ShoppingCart, CreditCard, PiggyBank, Flame, Award, Star, Lock, ChevronRight, Info, User as UserIcon, Bell, BellOff, Sparkles, Home, BookOpen, Zap, Medal, Users, ArrowRight, Check, X, TrendingDown, Calendar, BarChart3, Lightbulb, DollarSign, HelpCircle, AlertCircle, Clock, Tag, LogOut } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import * as Dialog from '@radix-ui/react-dialog';
import confetti from 'canvas-confetti';
import { Toaster } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Auth Imports
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { BottomNav } from './components/shared/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { ParentsScreen } from './components/screens/ParentsScreen';
import { OlympicsScreen } from './components/screens/OlympicsScreen';
import { AvatarScreen } from './components/screens/AvatarScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { ModulesScreen } from './components/screens/ModulesScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { subscribeToAuthChanges, logout } from './services/authService';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { obtenerDatosUsuario, actualizarDatosUsuario, guardarResultadoJuego } from '../db';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, arrayUnion } from 'firebase/firestore';
import { PrimaryButton, SecondaryButton, BackButton } from './components/shared/CustomButtons';
import { ModuleLevel1 } from './components/modules/ModuleLevel1';
import { ModuleLevel2 } from './components/modules/ModuleLevel2';
import { ModuleLevel3 } from './components/modules/ModuleLevel3';
import { ModuleLevel4 } from './components/modules/ModuleLevel4';
import { ModuleLevel5 } from './components/modules/ModuleLevel5';
import { ModuleLevel6 } from './components/modules/ModuleLevel6';
import { ModuleLevel7 } from './components/modules/ModuleLevel7';

type Screen =
  | 'onboarding-1' | 'onboarding-2' | 'onboarding-3'
  | 'register' | 'login'
  | 'payment' | 'payment-success'
  | 'welcome' | 'home' | 'modules' | 'challenge' | 'achievements' | 'olympics' | 'parents' | 'avatar'
  | 'module-main' | 'module-level-1' | 'module-level-2' | 'module-level-3' | 'module-level-4' | 'module-level-5' | 'module-level-6' | 'module-level-7'
  | 'module-intro' | 'module-why' | 'module-need-vs-want' | 'module-goal' | 'module-simulator' | 'module-expenses' | 'module-challenge-task' | 'module-progress' | 'module-quiz' | 'module-complete';

type ModuleStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  level: number;
  maxLevel: number;
  progress: number;
  locked: boolean;
  status: 'locked' | 'in-progress' | 'completed';
}

interface Avatar {
  id: string;
  face: string;
  skin: string;
  hair: string;
  accessory: string;
}

type ChallengeType = 'quiz' | 'dragdrop' | 'matching' | 'simulator';

interface DragItem {
  id: string;
  text: string;
  type: string;
}

export default function App() {
  const isTestMode = false;
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding-1');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Función para resetear todo el progreso local (para cambios de cuenta o logout)
  const resetGameState = () => {
    setModulePoints(0);
    setSessionPoints(0);
    setSavingsGoal('');
    setGoalAmount(0);
    setCurrentSavings(0);
    setTargetDate('');
    setWeeklyAmount(10);
    setModuleStep(1);
    setScore(0);
    setDroppedItems({});
    setMatchedPairs([]);
    setAvatar({
      id: '1',
      face: '😊',
      skin: '#FFD1A0',
      hair: '🦱',
      accessory: '🎓'
    });
  };

    useEffect(() => {
      const unsubscribe = subscribeToAuthChanges(async (user) => {
        setCurrentUser(user);
        if (user) {
          const data = await obtenerDatosUsuario(user.uid);
          setUserData(data);
          
          // Sincronizar puntos y avatar si existen
          if (data) {
            if (data.points !== undefined) setModulePoints(data.points);
            if (data.avatar) setAvatar(data.avatar);
          }

          if (['login', 'register', 'onboarding-1', 'onboarding-2', 'onboarding-3'].includes(currentScreen)) {
            setCurrentScreen('home');
          }
        } else {
          setUserData(null);
          resetGameState(); // LIMPIAR ESTADO SI NO HAY USUARIO
        }
        setAuthLoading(false);
      });
      return () => unsubscribe();
    }, [currentScreen]); // Re-subscribirse si cambia la pantalla actual

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showOlympicsInfo, setShowOlympicsInfo] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeType, setChallengeType] = useState<ChallengeType>('quiz');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastVisit, setLastVisit] = useState<Date>(new Date());
  const [avatar, setAvatar] = useState<Avatar>({
    id: '1',
    face: '😊',
    skin: '#FFD1A0',
    hair: '🦱',
    accessory: '🎓'
  });
  const [savingsAmount, setSavingsAmount] = useState(500);
  const [monthlyIncome, setMonthlyIncome] = useState(1000);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>({});
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Module States
  const [moduleStep, setModuleStep] = useState<ModuleStep>(1);
  const [savingsGoal, setSavingsGoal] = useState<string>('');
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<string>('');
  const [weeklyAmount, setWeeklyAmount] = useState<number>(10);
  const [modulePoints, setModulePoints] = useState<number>(0);
  const [sessionPoints, setSessionPoints] = useState<number>(0);
  const [needVsWantCorrect, setNeedVsWantCorrect] = useState<number>(0);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

    const saveUserProgress = async (newPoints: number, moduleId?: string, metaFinanciera?: string) => {
      if (!currentUser) return;
      
      const totalPoints = modulePoints + newPoints;
      
      // Mapear moduleId a nivelX para el panel de padres
      let levelKey = '';
      if (moduleId?.startsWith('module-level-')) {
        levelKey = moduleId.replace('module-level-', 'nivel');
      }

      // 1. Log para la tesis (transacción individual)
      if (moduleId) {
        await guardarResultadoJuego(currentUser.uid, moduleId, newPoints);
      }
      
      // 2. Actualizar perfil global del usuario
      const updates: any = {
        points: totalPoints,
      };
      
      if (metaFinanciera) {
        updates.metaFinanciera = metaFinanciera;
      }
      
      if (levelKey) {
        updates.completedLevels = arrayUnion(levelKey);
      }
      
      await actualizarDatosUsuario(currentUser.uid, updates);
      
      setModulePoints(totalPoints);
      setSessionPoints(prev => prev + newPoints);
    };
  useEffect(() => {
    // Check if user hasn't visited today
    const today = new Date().toDateString();
    const lastVisitDate = lastVisit.toDateString();

    if (today !== lastVisitDate && !notificationsEnabled) {
      setTimeout(() => {
        setShowNotificationDialog(true);
      }, 3000);
    }
  }, []);

  const avatarOptions = {
    faces: ['😊', '😎', '🤓', '😄', '🤗', '😇'],
    skins: ['#FFD1A0', '#F1C27D', '#D4A574', '#A97C5D', '#8D5524', '#6B3410'],
    hairs: ['🦱', '👨', '👱', '🧑‍🦰', '🧑‍🦱', '💇'],
    accessories: ['🎓', '👑', '🎯', '⚡', '🌟', '🏆']
  };

  const userProgress = {
    totalPoints: modulePoints,
    streak: userData?.streak || 0,
    level: Math.floor(modulePoints / 500),
    badges: userData?.completedLevels?.length || 0,
    modulesCompleted: userData?.completedLevels?.filter((l: string) => l === 'nivel7').length ? 1 : 0,
    totalModules: 5,
    pointsToNextLevel: 500 - (modulePoints % 500),
    olimpicsProgress: Math.min(100, Math.round((modulePoints / 5000) * 100)), // Percentage to qualify
    rankTitle: modulePoints >= 5000 ? 'Campeón Financiero' : modulePoints >= 2000 ? 'Competidor Financiero' : 'Explorador Novato', 
    nextRankTitle: modulePoints >= 5000 ? 'Leyenda' : modulePoints >= 2000 ? 'Campeón Financiero' : 'Competidor Financiero',
    olimpicsReady: modulePoints >= 5000
  };

  const badges = [
    { id: 1, name: 'Primer Ahorro', emoji: '🏆', unlocked: (userData?.completedLevels?.length > 0), color: 'from-yellow-400 to-orange-500' },
    { id: 2, name: 'Analista de Gastos', emoji: '🛒', unlocked: userData?.completedLevels?.includes('nivel2'), color: 'from-green-400 to-emerald-500' },
    { id: 3, name: 'Planificador', emoji: '💳', unlocked: userData?.completedLevels?.includes('nivel3'), color: 'from-blue-400 to-cyan-500' },
    { id: 4, name: 'Inversor', emoji: '📈', unlocked: userData?.completedLevels?.includes('nivel6'), color: 'from-red-400 to-orange-500' },
    { id: 5, name: 'Graduado M1', emoji: '🎓', unlocked: userData?.completedLevels?.includes('nivel7'), color: 'from-purple-400 to-pink-500' },
    { id: 6, name: 'Emprendedor', emoji: '🚀', unlocked: false, color: 'from-indigo-400 to-purple-500' },
    { id: 7, name: 'Campeón Financiero', emoji: '👑', unlocked: modulePoints >= 5000, color: 'from-yellow-500 to-red-500' },
    { id: 8, name: 'Olimpiadas Ready', emoji: '🥇', unlocked: modulePoints >= 5000, color: 'from-amber-400 to-yellow-500' }
  ];

  const modules: Module[] = [
    {
      id: 'ahorro-inversion',
      title: 'Ahorro e inversión inteligente',
      description: 'Ahorro, inversión y uso responsable del dinero',
      icon: PiggyBank,
      color: '#10B981',
      bgColor: '#D1FAE5',
      level: userData?.completedLevels?.length || 0,
      maxLevel: 7,
      progress: Math.round(((userData?.completedLevels?.length || 0) / 7) * 100),
      locked: false,
      status: userData?.completedLevels?.includes('nivel7') ? 'completed' : 'in-progress'
    },
    {
      id: 'dinero-decisiones',
      title: 'Mi dinero, mis decisiones',
      description: 'Recursos, necesidades y costo de oportunidad',
      icon: DollarSign,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      level: 0,
      maxLevel: 7,
      progress: 0,
      locked: !userData?.completedLevels?.includes('nivel7'),
      status: 'locked'
    },
    {
      id: 'consumo-publicidad',
      title: 'Consumo responsable y publicidad',
      description: 'Consumo responsable y rol de la publicidad',
      icon: ShoppingCart,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      level: 0,
      maxLevel: 7,
      progress: 0,
      locked: true,
      status: 'locked'
    },
    {
      id: 'presupuesto-derechos',
      title: 'Presupuesto y derechos del consumidor',
      description: 'Presupuestos y derechos del consumidor',
      icon: BarChart3,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      level: 0,
      maxLevel: 7,
      progress: 0,
      locked: true,
      status: 'locked'
    },
    {
      id: 'riesgos-estado',
      title: 'Riesgos financieros, Estado e impuestos',
      description: 'Prácticas financieras, rol del Estado e impuestos',
      icon: TrendingDown,
      color: '#EC4899',
      bgColor: '#FCE7F3',
      level: 0,
      maxLevel: 7,
      progress: 0,
      locked: true,
      status: 'locked'
    }
  ];

  const challengeQuestions = [
    {
      question: '¿Cuál es el porcentaje recomendado de ahorro mensual?',
      options: ['5%', '10-20%', '50%', '100%'],
      correct: 1,
      type: 'quiz' as ChallengeType
    },
    {
      question: '¿Qué significa "necesidad" vs "deseo"?',
      options: [
        'Son lo mismo',
        'Necesidad es esencial, deseo es opcional',
        'Deseo es más importante',
        'Ninguna es importante'
      ],
      correct: 1,
      type: 'quiz' as ChallengeType
    },
    {
      question: 'Arrastra los conceptos a su categoría correcta',
      type: 'dragdrop' as ChallengeType,
      items: [
        { id: '1', text: 'Comida', category: 'Necesidad' },
        { id: '2', text: 'Netflix', category: 'Deseo' },
        { id: '3', text: 'Ropa básica', category: 'Necesidad' },
        { id: '4', text: 'Videojuegos', category: 'Deseo' },
        { id: '5', text: 'Transporte', category: 'Necesidad' }
      ]
    },
    {
      question: 'Relaciona cada término con su definición',
      type: 'matching' as ChallengeType,
      pairs: [
        { id: '1', term: 'Ahorro', definition: 'Guardar dinero para el futuro' },
        { id: '2', term: 'Inversión', definition: 'Usar dinero para generar más dinero' },
        { id: '3', term: 'Presupuesto', definition: 'Plan de gastos e ingresos' }
      ]
    }
  ];

  const handleStartChallenge = (moduleId: string) => {
    setSelectedModule(moduleId);

    // If it's the savings module, start the module flow
    if (moduleId === 'ahorro-inversion') {
      setModuleStep(1);
      setSessionPoints(0);
      setCurrentScreen('module-main');
      return;
    }

    // Otherwise, use the old challenge flow
    setCurrentQuestion(0);
    setScore(0);
    setDroppedItems({});
    setMatchedPairs([]);
    const currentChallenge = challengeQuestions[0];
    setChallengeType(currentChallenge.type || 'quiz');
    setCurrentScreen('challenge');
  };

  const handleAnswer = (answerIndex: number) => {
    const currentChallenge = challengeQuestions[currentQuestion];
    if (currentChallenge.type === 'quiz') {
      const isCorrect = answerIndex === currentChallenge.correct;

      if (isCorrect) {
        setScore(score + 100);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < challengeQuestions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setChallengeType(challengeQuestions[nextQuestion].type || 'quiz');
      setDroppedItems({});
      setMatchedPairs([]);
    } else {
      setCurrentScreen('home');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Drag and Drop Components
  const DraggableItem = ({ id, text }: { id: string; text: string }) => {
    const [{ isDragging }, drag] = useDrag<{ id: string; text: string }, unknown, { isDragging: boolean }>(() => ({
      type: 'item',
      item: { id, text },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }));

    return (
      <Motion.div
        ref={(instance) => { drag(instance); }}    
        whileHover={{ scale: 1.05, rotate: 3 }}
        className={`bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg cursor-move text-center font-medium border-2 border-purple-200 ${
          isDragging ? 'opacity-50 scale-95' : 'opacity-100'
        }`}
      >
        <span className="text-2xl mb-2 block">📝</span>
        {text}
      </Motion.div>
    );
  };

  const DropZone = ({ category }: { category: string }) => {
    // Keeping this declaration and removing the duplicate

const [{ isOver }, drop] = useDrop(() => ({

      accept: 'item',
      drop: (item: DragItem) => {
        setDroppedItems(prev => ({ ...prev, [item.id]: category }));
        setScore(score + 50);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 }
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const dropRef = React.useRef<HTMLDivElement>(null);

    // Create a combined ref function
    const combinedRef = (node: HTMLDivElement | null) => {
      drop(node); // Call the drop function
      dropRef.current = node; // Assign to the ref
    };
    
    const itemsInZone = Object.entries(droppedItems)
      .filter(([_, cat]) => cat === category)
      .map(([id, _]) => {
        const challenge = challengeQuestions[currentQuestion];
        if (challenge.type === 'dragdrop' && challenge.items) {
          return challenge.items.find(item => item.id === id);
        }
        return null;
      })
      .filter(Boolean);

    const isNeed = category === 'Necesidad';

    return (
      <Motion.div
        ref={combinedRef}
        whileHover={{ scale: 1.02 }}
        className={`border-3 border-dashed rounded-3xl p-5 min-h-[180px] transition-all shadow-lg ${
          isOver
            ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-pink-100 scale-105'
            : isNeed
            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
            : 'border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">{isNeed ? '✅' : '🎮'}</span>
          <h4 className="font-bold text-gray-800 text-lg">{category}</h4>
        </div>
        <div className="space-y-2">
          {itemsInZone.map((item) => (
            <Motion.div
              key={item!.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`${
                isNeed
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : 'bg-gradient-to-r from-pink-400 to-rose-500'
              } text-white p-3 rounded-xl text-center font-medium shadow-lg`}
            >
              ✓ {item!.text}
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    );
  };

  const handleSaveAvatar = async () => {
    if (currentUser) {
      await actualizarDatosUsuario(currentUser.uid, { avatar });
    }
    setCurrentScreen('home');
  };

  const ChallengeScreen = () => {
    const currentChallenge = challengeQuestions[currentQuestion];
    const module = modules.find(m => m.id === selectedModule);

    const renderQuizChallenge = () => {
      if (currentChallenge.type !== 'quiz') return null;

      return (
        <div className="space-y-3">
          {currentChallenge.options!.map((option, index) => (
            <Motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(index)}
              className="w-full bg-gray-50 hover:bg-purple-50 p-4 rounded-xl text-left font-medium text-gray-700 hover:text-purple-700 transition-all border-2 border-gray-200 hover:border-purple-400"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: module?.color }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-sm">{option}</span>
              </div>
            </Motion.button>
          ))}
        </div>
      );
    };

    const renderDragDropChallenge = () => {
      if (currentChallenge.type !== 'dragdrop') return null;

      const availableItems = currentChallenge.items!.filter(
        item => !droppedItems[item.id]
      );

      const allDropped = currentChallenge.items!.length === Object.keys(droppedItems).length;

      return (
        <div className="space-y-6">
          {/* Available Items */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-5 shadow-lg border-2 border-purple-200">
            <h4 className="font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-2xl">👆</span>
              Arrastra los conceptos
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {availableItems.map((item) => (
                <DraggableItem key={item.id} id={item.id} text={item.text} />
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-2 gap-4">
            <DropZone category="Necesidad" />
            <DropZone category="Deseo" />
          </div>

          {allDropped && (
            <Motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                moveToNextQuestion();
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl font-bold shadow-2xl text-lg flex items-center justify-center gap-2"
            >
              ¡Excelente! Continuar
              <ChevronRight className="w-6 h-6" />
            </Motion.button>
          )}
        </div>
      );
    };

    const renderMatchingChallenge = () => {
      if (currentChallenge.type !== 'matching') return null;

      const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

      const handleTermClick = (termId: string) => {
        if (matchedPairs.includes(termId)) return;
        setSelectedTerm(selectedTerm === termId ? null : termId);
      };

      const handleDefinitionClick = (defId: string) => {
        if (!selectedTerm || matchedPairs.includes(defId)) return;

        if (selectedTerm === defId) {
          setMatchedPairs([...matchedPairs, selectedTerm, defId]);
          setScore(score + 100);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
          setSelectedTerm(null);

          if (matchedPairs.length + 2 >= currentChallenge.pairs!.length * 2) {
            setTimeout(() => moveToNextQuestion(), 1000);
          }
        } else {
          setSelectedTerm(null);
        }
      };

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Terms Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 text-center bg-purple-100 py-2 rounded-xl">Términos</h4>
              {currentChallenge.pairs!.map((pair) => (
                <Motion.button
                  key={pair.id}
                  whileHover={{ scale: matchedPairs.includes(pair.id) ? 1 : 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTermClick(pair.id)}
                  disabled={matchedPairs.includes(pair.id)}
                  className={`w-full p-4 rounded-2xl font-medium transition-all shadow-lg ${
                    matchedPairs.includes(pair.id)
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                      : selectedTerm === pair.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl scale-105'
                      : 'bg-white text-gray-700 hover:shadow-xl'
                  }`}
                >
                  {pair.term}
                  {matchedPairs.includes(pair.id) && (
                    <span className="ml-2 text-xl">✓</span>
                  )}
                </Motion.button>
              ))}
            </div>

            {/* Definitions Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 text-center bg-pink-100 py-2 rounded-xl">Definiciones</h4>
              {currentChallenge.pairs!.map((pair) => (
                <Motion.button
                  key={`def-${pair.id}`}
                  whileHover={{ scale: matchedPairs.includes(pair.id) ? 1 : 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDefinitionClick(pair.id)}
                  disabled={matchedPairs.includes(pair.id)}
                  className={`w-full p-4 rounded-2xl text-sm transition-all shadow-lg ${
                    matchedPairs.includes(pair.id)
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                      : 'bg-white text-gray-700 hover:shadow-xl'
                  }`}
                >
                  {pair.definition}
                  {matchedPairs.includes(pair.id) && (
                    <span className="ml-2 text-xl">✓</span>
                  )}
                </Motion.button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('modules')}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-sm font-medium">Volver</span>
            </Motion.button>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Star className="w-5 h-5" fill="currentColor" />
              <span className="font-bold">{score}</span>
            </div>
          </div>

          {module && (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: module.bgColor }}
              >
                <module.icon className="w-6 h-6" style={{ color: module.color }} />
              </div>
              <div>
                <p className="text-sm text-white/80">Módulo</p>
                <h2 className="text-xl font-bold">{module.title}</h2>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 -mt-4 space-y-6 max-w-md mx-auto">
          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">
                Pregunta {currentQuestion + 1} de {challengeQuestions.length}
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round(((currentQuestion + 1) / challengeQuestions.length) * 100)}%
              </span>
            </div>
            <Progress.Root
              className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3"
              value={(currentQuestion + 1) / challengeQuestions.length * 100}
            >
              <Progress.Indicator
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${module?.color}, ${module?.color}dd)`,
                  transform: `translateX(-${100 - ((currentQuestion + 1) / challengeQuestions.length * 100)}%)`
                }}
              />
            </Progress.Root>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentQuestion}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 text-center mb-6">
                {currentChallenge.question}
              </h3>

              {currentChallenge.type === 'quiz' && renderQuizChallenge()}
              {currentChallenge.type === 'dragdrop' && renderDragDropChallenge()}
              {currentChallenge.type === 'matching' && renderMatchingChallenge()}
            </Motion.div>
          </AnimatePresence>

          {/* Motivational Message */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center border border-purple-200">
            <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-2">
              <span className="text-xl">💪</span>
              Cada respuesta correcta suma puntos
              <span className="text-xl">⭐</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Module Header Component
  const ModuleHeader = ({
    step,
    totalSteps = 10,
    onBack
  }: {
    step: number;
    totalSteps?: number;
    onBack: () => void
  }) => (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <BackButton onClick={onBack} />

        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <Star className="w-4 h-4" fill="currentColor" />
          <span className="font-bold text-sm">{modulePoints} pts</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <PiggyBank className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-white/80">Módulo 1</p>
          <h2 className="text-xl font-bold">Misión: ahorrar</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
        <div className="flex items-center justify-between px-3 py-1 mb-2">
          <span className="text-xs font-medium">Paso {step} de {totalSteps}</span>
          <span className="text-xs font-medium">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <Progress.Root className="relative overflow-hidden bg-white/30 rounded-full w-full h-2" value={(step / totalSteps) * 100}>
          <Progress.Indicator
            className="h-full transition-all duration-500 bg-white rounded-full"
            style={{ transform: `translateX(-${100 - ((step / totalSteps) * 100)}%)` }}
          />
        </Progress.Root>
      </div>
    </div>
  );

  // Onboarding Screens
  const Onboarding1 = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="text-8xl mb-8"
      >
        💰
      </Motion.div>

      <Motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Aprende a manejar tu dinero
      </Motion.h1>

      <Motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        De forma divertida y práctica
      </Motion.p>

      <Motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <PrimaryButton onClick={() => setCurrentScreen('onboarding-2')}>
          Siguiente
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>

        <button
          onClick={() => setCurrentScreen('login')}
          className="w-full text-center text-white/80 py-3 mt-3 text-sm"
        >
          Ya tengo cuenta
        </button>
      </Motion.div>
    </div>
  );

  const Onboarding2 = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="flex gap-6 mb-8"
      >
        <Motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🎯
        </Motion.div>
        <Motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="text-6xl"
        >
          ⭐
        </Motion.div>
        <Motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="text-6xl"
        >
          🏆
        </Motion.div>
      </Motion.div>

      <Motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Completa módulos
      </Motion.h1>

      <Motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        Gana puntos, insignias y sube de nivel mientras aprendes
      </Motion.p>

      <Motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <PrimaryButton onClick={() => setCurrentScreen('onboarding-3')}>
          Siguiente
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>

        <button
          onClick={() => setCurrentScreen('onboarding-1')}
          className="w-full text-center text-white/80 py-3 mt-3 text-sm"
        >
          ← Atrás
        </button>
      </Motion.div>
    </div>
  );

  const Onboarding3 = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8"
      >
        <Trophy className="w-20 h-20 text-yellow-500" />
      </Motion.div>

      <Motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Olimpiadas Financieras
      </Motion.h1>

      <Motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        Clasifica y representa a tu colegio en el evento presencial más importante
      </Motion.p>

      <Motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <PrimaryButton onClick={() => setCurrentScreen('register')}>
          Comenzar
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>

        <button
          onClick={() => setCurrentScreen('login')}
          className="w-full text-center text-white/80 py-3 mt-3 text-sm"
        >
          Ya tengo cuenta
        </button>
      </Motion.div>
    </div>
  );

  // Payment Screen
  const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | 'plin'>('card');

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8">
          <button
            onClick={() => setCurrentScreen('register')}
            className="text-white/80 mb-4"
          >
            ← Atrás
          </button>
          <h1 className="text-2xl font-bold">Completar inscripción</h1>
          <p className="text-white/80 text-sm mt-1">Último paso para comenzar</p>
        </div>

        <div className="p-6 -mt-4 max-w-md mx-auto space-y-4">
          {/* Resumen de compra */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Resumen de compra</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Suscripción a la app</span>
                <span className="font-bold text-gray-800">S/ 60</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Olimpiadas Financieras</span>
                <span className="font-bold text-gray-800">S/ 39</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-lg">Total</span>
                  <span className="font-bold text-2xl" style={{ color: '#6C4CF1' }}>S/ 99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Método de pago</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === 'card' ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Tarjeta de crédito/débito</span>
                  </div>
                  {paymentMethod === 'card' && <Check className="w-5 h-5 text-purple-600" />}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('yape')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === 'yape' ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Yape</span>
                  </div>
                  {paymentMethod === 'yape' && <Check className="w-5 h-5 text-purple-600" />}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('plin')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === 'plin' ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Plin</span>
                  </div>
                  {paymentMethod === 'plin' && <Check className="w-5 h-5 text-purple-600" />}
                </div>
              </button>
            </div>
          </div>

          <PrimaryButton
            onClick={() => {
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
              });
              setCurrentScreen('payment-success');
            }}
          >
            Pagar ahora
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>

          <SecondaryButton onClick={() => setCurrentScreen('register')}>
            Volver
          </SecondaryButton>
        </div>
      </div>
    );
  };

  // Payment Success Screen
  const PaymentSuccessScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="max-w-md w-full">
        <Motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6"
        >
          <Motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 3 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-600" />
          </Motion.div>

          <h1 className="text-3xl font-bold mb-3" style={{ color: '#6C4CF1' }}>
            ¡Inscripción completada!
          </h1>

          <p className="text-gray-600 mb-6">
            Ya puedes comenzar tu ruta financiera y clasificar a las Olimpiadas
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border-2" style={{ borderColor: '#CFC3FF' }}>
            <p className="text-sm font-medium text-gray-800">
              Hemos enviado la confirmación a tu correo electrónico
            </p>
          </div>
        </Motion.div>

        <PrimaryButton onClick={() => setCurrentScreen('home')}>
          Comenzar ahora
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );

  // ===== MODULE 1: AHORRO E INVERSIÓN INTELIGENTE (7 NIVELES) =====

  const ModuleMain = () => {
    const moduleLevels = [
      {
        level: 1,
        title: 'Mi meta financiera',
        description: 'Elige tu objetivo y calcula cuánto necesitas ahorrar',
        icon: Target,
        color: '#10B981',
        bgColor: '#D1FAE5',
        completed: userData?.completedLevels?.includes('nivel1'),
        locked: false,
        points: 100
      },
      {
        level: 2,
        title: 'Gastos hormiga',
        description: 'Identifica los pequeños gastos innecesarios',
        icon: ShoppingCart,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        completed: userData?.completedLevels?.includes('nivel2'),
        locked: !userData?.completedLevels?.includes('nivel1'),
        points: 150
      },
      {
        level: 3,
        title: 'Plan de ahorro',
        description: 'Organiza tus ingresos, gastos y ahorros',
        icon: BarChart3,
        color: '#3B82F6',
        bgColor: '#DBEAFE',
        completed: userData?.completedLevels?.includes('nivel3'),
        locked: !userData?.completedLevels?.includes('nivel2'),
        points: 150
      },
      {
        level: 4,
        title: 'Ahorro vs. inversión',
        description: 'Decide entre guardar o hacer crecer tu dinero',
        icon: TrendingUp,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        completed: userData?.completedLevels?.includes('nivel4'),
        locked: !userData?.completedLevels?.includes('nivel3'),
        points: 200
      },
      {
        level: 5,
        title: 'El banco y sus opciones',
        description: 'Compara planes de ahorro bancarios',
        icon: CreditCard,
        color: '#EC4899',
        bgColor: '#FCE7F3',
        completed: userData?.completedLevels?.includes('nivel5'),
        locked: !userData?.completedLevels?.includes('nivel4'),
        points: 200
      },
      {
        level: 6,
        title: 'Mini bolsa de valores',
        description: 'Invierte tus monedas virtuales',
        icon: TrendingUp,
        color: '#EF4444',
        bgColor: '#FEE2E2',
        completed: userData?.completedLevels?.includes('nivel6'),
        locked: !userData?.completedLevels?.includes('nivel5'),
        points: 250
      },
      {
        level: 7,
        title: 'Decisión final',
        description: 'Completa tu estrategia financiera',
        icon: Trophy,
        color: '#FBBF24',
        bgColor: '#FEF3C7',
        completed: userData?.completedLevels?.includes('nivel7'),
        locked: !userData?.completedLevels?.includes('nivel6'),
        points: 300
      }
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-12 pb-24 px-6 relative overflow-hidden">
          <BackButton onClick={() => setCurrentScreen('modules')} />

          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl mb-4">
              <PiggyBank className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ahorro e inversión inteligente
            </h1>
            <p className="text-emerald-50 text-lg mb-4">
              Aprende a ahorrar e invertir responsablemente
            </p>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="font-bold">7 niveles</span>
              </div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="flex items-center gap-1">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">1,350 puntos</span>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Progress Summary */}
        <div className="px-6 -mt-16 mb-6">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Progreso del módulo</span>
              <span className="text-2xl font-bold" style={{ color: '#10B981' }}>0%</span>
            </div>
            <Progress.Root
              className="relative overflow-hidden bg-gray-100 rounded-full w-full h-3"
              style={{ transform: 'translateZ(0)' }}
              value={0}
            >
              <Progress.Indicator
                className="bg-gradient-to-r from-emerald-500 to-teal-500 w-full h-full transition-transform duration-500 rounded-full"
                style={{ transform: `translateX(-${100 - 0}%)` }}
              />
            </Progress.Root>
            <p className="text-sm text-gray-500 mt-2">Completa los 7 niveles para dominar este módulo</p>
          </Motion.div>
        </div>

        {/* Levels List */}
        <div className="px-6 pb-8 space-y-4">
          {moduleLevels.map((levelData, index) => {
            const IconComponent = levelData.icon;
            const isLocked = levelData.locked;
            const isCompleted = levelData.completed;

            return (
              <Motion.div
                key={levelData.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentScreen(`module-level-${levelData.level}` as Screen);
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full bg-white rounded-3xl p-5 shadow-lg transition-all ${
                    isLocked ? 'opacity-60' : 'hover:shadow-xl active:scale-98'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center relative"
                      style={{ backgroundColor: levelData.bgColor }}
                    >
                      {isLocked ? (
                        <Lock className="w-7 h-7" style={{ color: levelData.color }} />
                      ) : isCompleted ? (
                        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <IconComponent className="w-7 h-7" style={{ color: levelData.color }} />
                      )}

                      {/* Level number badge */}
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: levelData.color }}
                      >
                        {levelData.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg mb-1" style={{ color: '#1F2937' }}>
                        {levelData.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{levelData.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-gray-700">+{levelData.points} pts</span>
                        </div>
                        {isCompleted && (
                          <span className="text-xs font-bold text-green-600">✓ Completado</span>
                        )}
                        {isLocked && (
                          <span className="text-xs font-bold text-gray-400">Bloqueado</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    {!isLocked && (
                      <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              </Motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // ===== OLD MODULE SCREENS =====

  // Module Screen 1: Welcome
  const ModuleIntro = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <ModuleHeader step={1} onBack={() => setCurrentScreen('modules')} />

      <div className="p-6 max-w-md mx-auto -mt-4 space-y-6">
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-lg text-center"
        >
          <Motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            🎯
          </Motion.div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#6C4CF1' }}>
            ¡Bienvenido a tu misión!
          </h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Ahorrar es <span className="font-bold" style={{ color: '#6C4CF1' }}>separar dinero hoy</span> para lograr algo importante mañana.
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4">
            <p className="text-sm text-gray-700">
              <span className="text-xl mr-2">💡</span>
              En este módulo aprenderás a ahorrar para alcanzar una meta que realmente te importa
            </p>
          </div>
        </Motion.div>

        <PrimaryButton onClick={() => setCurrentScreen('module-why')}>
          Empezar módulo
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );

  // Module Screen 2: Why Save
  const ModuleWhy = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <ModuleHeader step={2} onBack={() => setCurrentScreen('module-intro')} />

      <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#6C4CF1' }}>
            ¿Por qué ahorrar?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFEAFE' }}>
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Logra metas grandes</h3>
                <p className="text-sm text-gray-600">
                  Ese videojuego, zapatillas o salida que quieres no aparecerán solos. El ahorro te ayuda a conseguirlos.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFEAFE' }}>
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Evita quedarte sin nada</h3>
                <p className="text-sm text-gray-600">
                  Si gastas todo en cosas pequeñas, no te quedará para lo que realmente importa.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFEAFE' }}>
                <span className="text-2xl">💪</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Tomas el control</h3>
                <p className="text-sm text-gray-600">
                  Tú decides en qué gastar tu dinero, en lugar de gastarlo sin pensar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-5 border-2" style={{ borderColor: '#CFC3FF' }}>
          <p className="text-sm font-medium text-gray-800 text-center">
            <span className="text-xl mr-2">✨</span>
            El ahorro no es guardar lo que sobra, es <span className="font-bold" style={{ color: '#6C4CF1' }}>separar antes de gastar</span>
          </p>
        </div>

        <PrimaryButton
          onClick={() => {
            saveUserProgress(20, 'module-intro');
            setCurrentScreen('module-need-vs-want');
          }}
        >          Continuar
          <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );

  // Module Screen 3: Need vs Want
  const ModuleNeedVsWant = () => {
    const totalItems = 6;
    const [items] = useState([
      { id: 1, name: 'Cuaderno', emoji: '📓', type: 'need', placed: false, userChoice: null as 'need' | 'want' | null },
      { id: 2, name: 'Snack', emoji: '🍫', type: 'want', placed: false, userChoice: null as 'need' | 'want' | null },
      { id: 3, name: 'Medicina', emoji: '💊', type: 'need', placed: false, userChoice: null as 'need' | 'want' | null },
      { id: 4, name: 'Skin de juego', emoji: '🎮', type: 'want', placed: false, userChoice: null as 'need' | 'want' | null },
      { id: 5, name: 'Transporte', emoji: '🚌', type: 'need', placed: false, userChoice: null as 'need' | 'want' | null },
      { id: 6, name: 'Zapatillas de marca', emoji: '👟', type: 'want', placed: false, userChoice: null as 'need' | 'want' | null }
    ]);
    const [itemsState, setItemsState] = useState(items);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const handleClassify = (itemId: number, classification: 'need' | 'want') => {
      const item = itemsState.find(i => i.id === itemId);
      if (!item || item.placed || answeredCount >= totalItems) return;

      const isCorrect = item.type === classification;

      setItemsState(itemsState.map(i =>
        i.id === itemId ? { ...i, placed: true, userChoice: classification } : i
      ));

      setAnsweredCount(prev => prev + 1);

      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
        setFeedback({ correct: true, message: '¡Correcto! 🎉' });
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 }
        });
      } else {
        setFeedback({ correct: false, message: 'No exactamente 💭' });
      }

      setTimeout(() => {
        setFeedback(null);
        setSelectedItem(null);
      }, 800);
    };

    const allCompleted = answeredCount === totalItems;
    const score = correctCount;

    const handleCheckAnswers = () => {
      setShowResults(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    if (showResults) {
      return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
          <ModuleHeader step={3} onBack={() => setCurrentScreen('module-why')} />

          <div className="p-6 max-w-md mx-auto -mt-4 space-y-6">
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-8xl mb-6"
              >
                {score >= 5 ? '🎉' : score >= 3 ? '👍' : '💪'}
              </Motion.div>

              <h2 className="text-3xl font-bold mb-3" style={{ color: '#6C4CF1' }}>
                {score >= 5 ? '¡Excelente trabajo!' : score >= 3 ? '¡Bien hecho!' : '¡Buen intento!'}
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                Acertaste <span className="font-bold text-2xl" style={{ color: '#6C4CF1' }}>{score} de {totalItems}</span> respuestas
              </p>

              {/* Points earned prominently */}
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white"
              >
                <p className="text-sm mb-2 opacity-90">Has ganado</p>
                <p className="text-5xl font-bold mb-2">+{score * 10}</p>
                <p className="text-sm opacity-90">puntos</p>
              </Motion.div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border-2" style={{ borderColor: '#CFC3FF' }}>
                <p className="text-sm text-gray-700">
                  💡 Diferenciar necesidades de deseos te ayuda a tomar mejores decisiones de ahorro
                </p>
              </div>
            </Motion.div>

            <PrimaryButton
              onClick={() => {
                saveUserProgress(score * 10, 'module-need-vs-want');
                setCurrentScreen('module-goal');
              }}
            >              Continuar
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={3} onBack={() => setCurrentScreen('module-why')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-6">
          {/* Progress Counter - Prominent */}
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white text-center"
          >
            <p className="text-sm mb-2 opacity-90">Tu progreso</p>
            <Motion.p
              key={answeredCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold mb-2"
            >
              {answeredCount}
            </Motion.p>
            <p className="text-2xl font-bold">de {totalItems}</p>
            <p className="text-sm mt-3 opacity-90">elementos clasificados</p>
          </Motion.div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
              Antes de gastar, piensa
            </h2>
            <p className="text-sm text-gray-600">
              Clasifica los 6 elementos para continuar
            </p>
          </div>

          {/* Main Activity Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Remaining Items to Classify */}
            {itemsState.filter(i => !i.placed).length > 0 ? (
              <>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Elementos por clasificar:
                </p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {itemsState.filter(i => !i.placed).map((item) => (
                    <Motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => answeredCount < totalItems && setSelectedItem(item.id)}
                      disabled={answeredCount >= totalItems}
                      className="rounded-xl p-3 text-center transition-all"
                      style={{
                        backgroundColor: selectedItem === item.id ? '#EFEAFE' : '#F8F9FC',
                        border: selectedItem === item.id ? '3px solid #6C4CF1' : '2px solid #E5E7EB'
                      }}
                    >
                      <div className="text-3xl mb-1">{item.emoji}</div>
                      <p className="text-xs font-medium text-gray-700">{item.name}</p>
                    </Motion.button>
                  ))}
                </div>
              </>
            ) : (
              <div className="mb-5 text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-5xl mb-3">✓</div>
                <p className="font-bold text-green-700 text-lg">
                  ¡Todos los elementos clasificados!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Presiona "Comprobar" para ver tus resultados
                </p>
              </div>
            )}

            {/* Classification Buttons */}
            {selectedItem !== null && answeredCount < totalItems ? (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs font-medium text-gray-500 text-center mb-2">
                  ¿Qué tipo de elemento es?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClassify(selectedItem, 'need')}
                    className="py-4 px-4 rounded-2xl font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                  >
                    <div className="text-2xl mb-1">✅</div>
                    Necesidad
                  </Motion.button>
                  <Motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClassify(selectedItem, 'want')}
                    className="py-4 px-4 rounded-2xl font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                  >
                    <div className="text-2xl mb-1">💭</div>
                    Deseo
                  </Motion.button>
                </div>
              </Motion.div>
            ) : answeredCount < totalItems && (
              <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <p className="text-sm font-medium text-gray-700">
                  👆 Selecciona un elemento de arriba
                </p>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mt-4 p-3 rounded-xl text-center font-bold ${
                  feedback.correct ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {feedback.message}
              </Motion.div>
            )}

            {/* Already Classified Items */}
            {answeredCount > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Ya clasificados: {answeredCount}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {itemsState.filter(i => i.placed).map((item) => (
                    <Motion.div
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-lg p-2 text-center bg-gray-50 border border-gray-200"
                    >
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <p className="text-xs text-gray-600">{item.userChoice === 'need' ? '✅' : '💭'}</p>
                    </Motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Definition Box */}
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-5 border-2" style={{ borderColor: '#CFC3FF' }}>
            <p className="text-sm text-gray-800 text-center">
              <span className="font-bold">Necesidad:</span> lo que realmente necesitas para vivir bien
              <br />
              <span className="font-bold">Deseo:</span> lo que quieres pero puedes esperar
            </p>
          </div>

          {/* Check Button */}
          <PrimaryButton
            onClick={handleCheckAnswers}
            disabled={!allCompleted}
          >
            {allCompleted ? (
              <>
                Comprobar
                <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                Completa {totalItems - answeredCount} más
                <Lock className="w-5 h-5" />
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Module Screen 4: Choose Goal
  const ModuleGoal = () => {
    const goals = [
      { id: 'shoes', name: 'Zapatillas', emoji: '👟', estimatedPrice: 150 },
      { id: 'headphones', name: 'Audífonos', emoji: '🎧', estimatedPrice: 200 },
      { id: 'game', name: 'Videojuego', emoji: '🎮', estimatedPrice: 120 },
      { id: 'outing', name: 'Salida con amigos', emoji: '🎉', estimatedPrice: 80 },
      { id: 'gift', name: 'Regalo especial', emoji: '🎁', estimatedPrice: 100 },
      { id: 'other', name: 'Otra meta', emoji: '✨', estimatedPrice: 0 }
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={4} onBack={() => setCurrentScreen('module-need-vs-want')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
              ¿Para qué quieres ahorrar?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Elige una meta que realmente te motive
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {goals.map((goal) => (
                <Motion.button
                  key={goal.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSavingsGoal(goal.id);
                    setGoalAmount(goal.estimatedPrice);
                  }}
                  className="rounded-2xl p-4 text-center transition-all"
                  style={{
                    backgroundColor: savingsGoal === goal.id ? '#EFEAFE' : '#F8F9FC',
                    border: savingsGoal === goal.id ? '2px solid #6C4CF1' : '2px solid #E5E7EB'
                  }}
                >
                  <div className="text-4xl mb-2">{goal.emoji}</div>
                  <p className="text-sm font-bold text-gray-800">{goal.name}</p>
                  {goal.estimatedPrice > 0 && (
                    <p className="text-xs text-gray-500 mt-1">~S/ {goal.estimatedPrice}</p>
                  )}
                </Motion.button>
              ))}
            </div>

            {savingsGoal && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuánto cuesta?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={goalAmount || ''}
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                      placeholder="150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuánto tienes ahorrado?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={currentSavings || ''}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Para cuándo lo quieres?
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  />
                </div>
              </Motion.div>
            )}
          </div>

          {savingsGoal && goalAmount > 0 && currentSavings >= 0 && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  saveUserProgress(30, 'module-goal');
                  setCurrentScreen('module-simulator');
                }}
              >                Ver mi plan
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </Motion.div>
          )}
        </div>
      </div>
    );
  };

  // Module Screen 5: Savings Simulator
  const ModuleSimulator = () => {
    const remaining = goalAmount - currentSavings;

    const scenarios = [
      { amount: 5, weeks: Math.ceil(remaining / 5) },
      { amount: 10, weeks: Math.ceil(remaining / 10) },
      { amount: 15, weeks: Math.ceil(remaining / 15) },
      { amount: 20, weeks: Math.ceil(remaining / 20) }
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={5} onBack={() => setCurrentScreen('module-goal')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
              Tu plan de ahorro
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Elige cuánto ahorrar por semana
            </p>

            {/* Goal Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Meta total</span>
                <span className="font-bold text-gray-800">S/ {goalAmount}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ya tienes</span>
                <span className="font-bold text-green-600">S/ {currentSavings}</span>
              </div>
              <div className="border-t border-purple-200 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Te falta ahorrar</span>
                  <span className="font-bold" style={{ color: '#6C4CF1' }}>S/ {remaining}</span>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <Motion.button
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWeeklyAmount(scenario.amount)}
                  className="w-full p-4 rounded-xl transition-all text-left"
                  style={{
                    backgroundColor: weeklyAmount === scenario.amount ? '#EFEAFE' : '#F8F9FC',
                    border: weeklyAmount === scenario.amount ? '2px solid #6C4CF1' : '2px solid #E5E7EB'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">S/ {scenario.amount} por semana</p>
                      <p className="text-sm text-gray-600">Lograrás tu meta en {scenario.weeks} semanas</p>
                    </div>
                    <div className="text-2xl">
                      {scenario.weeks <= 8 ? '🚀' : scenario.weeks <= 16 ? '⚡' : '🐢'}
                    </div>
                  </div>
                </Motion.button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
            <p className="text-sm font-medium text-gray-800 text-center">
              <span className="text-xl mr-2">💡</span>
              Mientras más ahorres por semana, más rápido alcanzarás tu meta
            </p>
          </div>

          <PrimaryButton
            onClick={() => {
              saveUserProgress(25, 'module-simulator');
              setCurrentScreen('module-expenses');
            }}
          >            Continuar
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Module Screen 6: Ant Expenses
  const ModuleExpenses = () => {
    const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

    const expenses = [
      { id: 'snacks', name: 'Snacks diarios', emoji: '🍿', amount: 5 },
      { id: 'soda', name: 'Gaseosas', emoji: '🥤', amount: 3 },
      { id: 'mobile', name: 'Recargas innecesarias', emoji: '📱', amount: 10 },
      { id: 'candy', name: 'Dulces', emoji: '🍬', amount: 2 },
      { id: 'games', name: 'Compras en juegos', emoji: '🎮', amount: 15 },
      { id: 'extra', name: 'Compras impulsivas', emoji: '🛒', amount: 8 }
    ];

    const totalSaved = expenses
      .filter(e => selectedExpenses.includes(e.id))
      .reduce((sum, e) => sum + e.amount, 0);

    const toggleExpense = (id: string) => {
      if (selectedExpenses.includes(id)) {
        setSelectedExpenses(selectedExpenses.filter(e => e !== id));
      } else {
        setSelectedExpenses([...selectedExpenses, id]);
      }
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={6} onBack={() => setCurrentScreen('module-simulator')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
              El enemigo de tu meta
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Los "gastos hormiga" son pequeños gastos que parecen poco, pero suman mucho
            </p>

            <div className="space-y-3">
              {expenses.map((expense) => (
                <Motion.button
                  key={expense.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleExpense(expense.id)}
                  className="w-full p-4 rounded-xl transition-all flex items-center justify-between"
                  style={{
                    backgroundColor: selectedExpenses.includes(expense.id) ? '#FEE2E2' : '#F8F9FC',
                    border: selectedExpenses.includes(expense.id) ? '2px solid #EF4444' : '2px solid #E5E7EB'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{expense.emoji}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{expense.name}</p>
                      <p className="text-xs text-gray-500">~S/ {expense.amount} por semana</p>
                    </div>
                  </div>
                  {selectedExpenses.includes(expense.id) && (
                    <Check className="w-5 h-5 text-red-600" />
                  )}
                </Motion.button>
              ))}
            </div>

            {selectedExpenses.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl"
                style={{ backgroundColor: '#EFEAFE' }}
              >
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Si evitas estos gastos:
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Ahorrarás por semana:</span>
                  <span className="text-2xl font-bold" style={{ color: '#6C4CF1' }}>
                    S/ {totalSaved}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  En {totalSaved > 0 ? Math.ceil((goalAmount - currentSavings) / totalSaved) : '—'} semanas alcanzarías tu meta 🎯
                </p>
              </Motion.div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border-2 border-orange-200">
            <p className="text-sm font-medium text-gray-800">
              <span className="text-xl mr-2">⚠️</span>
              No se trata de no gastar nunca, sino de <span className="font-bold">elegir conscientemente</span> en qué gastar
            </p>
          </div>

          <PrimaryButton
            onClick={() => {
              saveUserProgress(35, 'module-expenses');
              setCurrentScreen('module-challenge-task');
            }}
          >            Continuar
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Module Screen 7: Challenge Task
  const ModuleChallengeTask = () => {
    const [taskCompleted, setTaskCompleted] = useState(false);

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={7} onBack={() => setCurrentScreen('module-expenses')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <Motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎯
              </Motion.div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
                Reto de ahorro
              </h2>
              <p className="text-gray-600">
                Tu primera misión práctica
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2" style={{ borderColor: '#CFC3FF' }}>
                <h3 className="font-bold text-gray-800 mb-3">Esta semana, elige UNA de estas acciones:</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6C4CF1' }}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <p className="text-sm text-gray-700 pt-1">
                      Evita un gasto hormiga que normalmente harías (snack, gaseosa, recarga innecesaria)
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6C4CF1' }}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <p className="text-sm text-gray-700 pt-1">
                      Guarda S/ 5 o más esta semana (aunque sea en una alcancía o sobre)
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6C4CF1' }}>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <p className="text-sm text-gray-700 pt-1">
                      Antes de comprar algo, pregúntate: ¿es una necesidad o un deseo?
                    </p>
                  </div>
                </div>
              </div>

              <Motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTaskCompleted(!taskCompleted);
                  if (!taskCompleted) {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 }
                    });
                  }
                }}
                className="w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{
                  backgroundColor: taskCompleted ? '#10B981' : 'white',
                  color: taskCompleted ? 'white' : '#6C4CF1',
                  border: taskCompleted ? '2px solid #10B981' : '2px solid #6C4CF1'
                }}
              >
                {taskCompleted ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Reto aceptado!
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Acepto el reto
                  </>
                )}
              </Motion.button>

              {taskCompleted && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: '#EFEAFE' }}
                >
                  <p className="font-bold mb-1" style={{ color: '#6C4CF1' }}>+50 puntos</p>
                  <p className="text-sm text-gray-700">
                    Completarás el reto cuando practiques en la vida real 💪
                  </p>
                </Motion.div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200">
            <p className="text-sm font-medium text-gray-800 text-center">
              <span className="text-xl mr-2">💡</span>
              Pequeñas acciones diarias crean grandes resultados
            </p>
          </div>

          {taskCompleted && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  saveUserProgress(50, 'module-challenge-task');
                  setCurrentScreen('module-progress');
                }}
              >                Continuar
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </Motion.div>
          )}
        </div>
      </div>
    );
  };

  // Module Screen 8: Progress Tracking
  const ModuleProgress = () => {
    const progressPercentage = Math.min((currentSavings / goalAmount) * 100, 100);

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={8} onBack={() => setCurrentScreen('module-challenge-task')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6C4CF1' }}>
              Así vas avanzando
            </h2>

            {/* Progress Circle */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  <Motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#6C4CF1"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - progressPercentage / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute">
                  <p className="text-3xl font-bold" style={{ color: '#6C4CF1' }}>
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-gray-500">completado</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Has ahorrado</p>
                <p className="text-2xl font-bold text-green-600">S/ {currentSavings}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 text-center border-2" style={{ borderColor: '#CFC3FF' }}>
                <p className="text-sm text-gray-600 mb-1">Te falta</p>
                <p className="text-2xl font-bold" style={{ color: '#6C4CF1' }}>S/ {goalAmount - currentSavings}</p>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Progreso semanal</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((week) => {
                  const saved = week <= 2;
                  return (
                    <div key={week} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          saved ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        {saved ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs text-gray-500">{week}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <Motion.div
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: saved ? '100%' : '0%' }}
                            transition={{ delay: week * 0.1 }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {saved ? `S/ ${weeklyAmount}` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-md">
              <p className="text-2xl mb-1">⭐</p>
              <p className="text-lg font-bold" style={{ color: '#6C4CF1' }}>{modulePoints}</p>
              <p className="text-xs text-gray-600">Puntos</p>
            </div>

            <div className="bg-white rounded-xl p-3 text-center shadow-md">
              <p className="text-2xl mb-1">🔥</p>
              <p className="text-lg font-bold" style={{ color: '#F59E0B' }}>2</p>
              <p className="text-xs text-gray-600">Semanas</p>
            </div>

            <div className="bg-white rounded-xl p-3 text-center shadow-md">
              <p className="text-2xl mb-1">🎯</p>
              <p className="text-lg font-bold" style={{ color: '#10B981' }}>80%</p>
              <p className="text-xs text-gray-600">Módulo</p>
            </div>
          </div>

          <PrimaryButton
            onClick={() => {
              saveUserProgress(20, 'module-progress');
              setCurrentScreen('module-quiz');
            }}
          >            Continuar
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Module Screen 9: Mini Quiz
  const ModuleQuiz = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const question = {
      text: '¿Cuál es la mejor estrategia para alcanzar una meta de ahorro?',
      options: [
        'Ahorrar solo lo que me sobra al final del mes',
        'Separar dinero ANTES de gastar y evitar gastos hormiga',
        'Comprar todo lo que quiero y ahorrar después',
        'Esperar a tener más dinero para empezar a ahorrar'
      ],
      correct: 1
    };

    const handleAnswer = (index: number) => {
      setSelectedAnswer(index);
      setShowResult(true);
      if (index === question.correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    const isCorrect = selectedAnswer === question.correct;

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <ModuleHeader step={9} onBack={() => setCurrentScreen('module-progress')} />

        <div className="p-6 max-w-md mx-auto -mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🧠</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#6C4CF1' }}>
                Demuestra lo aprendido
              </h2>
              <p className="text-sm text-gray-600">Responde esta pregunta</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border-2" style={{ borderColor: '#CFC3FF' }}>
              <p className="font-medium text-gray-800 text-center">
                {question.text}
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Motion.button
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    showResult
                      ? index === question.correct
                        ? 'bg-green-100 border-2 border-green-500'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                      : selectedAnswer === index
                      ? 'bg-purple-100 border-2 border-purple-400'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold"
                      style={{ backgroundColor: showResult && index === question.correct ? '#10B981' : '#6C4CF1' }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm">{option}</span>
                    {showResult && index === question.correct && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && selectedAnswer === index && index !== question.correct && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </Motion.button>
              ))}
            </div>

            {showResult && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl ${
                  isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
                }`}
              >
                <p className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {isCorrect ? '¡Correcto! 🎉' : '¡Casi! 💭'}
                </p>
                <p className="text-sm text-gray-700">
                  {isCorrect
                    ? 'Excelente, entendiste la clave del ahorro: separar dinero ANTES de gastar.'
                    : 'Recuerda: el ahorro funciona cuando separas dinero ANTES de gastar, no después.'}
                </p>
                <p className="text-sm font-bold mt-2" style={{ color: '#6C4CF1' }}>
                  +{isCorrect ? 40 : 20} puntos
                </p>
              </Motion.div>
            )}
          </div>

          {showResult && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  saveUserProgress(isCorrect ? 40 : 20, 'module-quiz');
                  setCurrentScreen('module-complete');
                }}
              >                Finalizar módulo
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </Motion.div>
          )}
        </div>
      </div>
    );
  };

  // Module Screen 10: Module Complete
  const ModuleComplete = () => {
    useEffect(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 }
      });
    }, []);

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="p-6 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
          <Motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-6 w-full"
          >
            <Motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </Motion.div>

            <h1 className="text-3xl font-bold mb-3" style={{ color: '#6C4CF1' }}>
              ¡Módulo completado!
            </h1>

            <p className="text-gray-600 mb-6">
              Has completado exitosamente el módulo de ahorro
            </p>

            {/* Badge */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 mb-6">
              <p className="text-white font-bold mb-2">Insignia desbloqueada</p>
              <div className="text-6xl mb-2">🏆</div>
              <p className="text-white text-lg font-bold">Ahorrador Inicial</p>
            </div>

            {/* Points */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border-2" style={{ borderColor: '#CFC3FF' }}>
              <p className="text-sm text-gray-600 mb-2">Puntos obtenidos</p>
              <p className="text-4xl font-bold" style={{ color: '#6C4CF1' }}>
                +{sessionPoints}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 text-left">
              <h3 className="font-bold text-gray-800 mb-3 text-center">Lo que aprendiste</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Diferenciar necesidades y deseos</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Identificar gastos hormiga</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Crear un plan de ahorro para tu meta</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Ahorrar ANTES de gastar</p>
                </div>
              </div>
            </div>
          </Motion.div>

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <PrimaryButton onClick={() => setCurrentScreen('modules')}>
              Ir al siguiente módulo
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>

            <SecondaryButton onClick={() => setCurrentScreen('achievements')}>
              Ver mis logros
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-center" richColors />
      <div className="font-sans min-h-screen relative">
        <div>
          {/* Onboarding Screens */}
        {currentScreen === 'onboarding-1' && <Onboarding1 />}
        {currentScreen === 'onboarding-2' && <Onboarding2 />}
        {currentScreen === 'onboarding-3' && <Onboarding3 />}

        {/* Auth Screens */}
        {currentScreen === 'register' && (
          <RegisterScreen 
            onSuccess={() => setCurrentScreen('home')} 
            onNavigateToLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('onboarding-3')}
          />
        )}
        {currentScreen === 'login' && (
          <LoginScreen 
            onSuccess={() => setCurrentScreen('home')} 
            onNavigateToRegister={() => setCurrentScreen('register')}
            onBack={() => setCurrentScreen('onboarding-1')}
          />
        )}

        {/* Payment Screens */}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'payment-success' && <PaymentSuccessScreen />}

        {/* Main Screens */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen
            avatar={avatar}
            userData={userData}
            currentUser={currentUser}
            userProgress={userProgress}
            modules={modules}
            onNavigate={setCurrentScreen}
            handleStartChallenge={handleStartChallenge}
            onLogout={async () => {
              await logout();
              setCurrentScreen('login');
            }}
          />
        )}
        {currentScreen === 'modules' && (
          <ModulesScreen
            modules={modules}
            handleStartChallenge={handleStartChallenge}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'challenge' && <ChallengeScreen />}
        {currentScreen === 'achievements' && (
          <AchievementsScreen
            userProgress={userProgress}
            badges={badges}
            modules={modules}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'olympics' && (
          <OlympicsScreen
            userProgress={userProgress}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'parents' && (
          <ParentsScreen
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'avatar' && (
          <AvatarScreen
            avatar={avatar}
            setAvatar={setAvatar}
            onSave={handleSaveAvatar}
          />
        )}

        {/* Module 1: New 7-level structure */}
        {currentScreen === 'module-main' && <ModuleMain />}
        {currentScreen === 'module-level-1' && (
          <ModuleLevel1 
            onComplete={(points: number, metaFinanciera?: string) => {
              saveUserProgress(points, 'module-level-1', metaFinanciera);
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-2' && (
          <ModuleLevel2 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-2');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-3' && (
          <ModuleLevel3 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-3');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-4' && (
          <ModuleLevel4 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-4');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-5' && (
          <ModuleLevel5 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-5');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-6' && (
          <ModuleLevel6 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-6');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}
        {currentScreen === 'module-level-7' && (
          <ModuleLevel7 
            onComplete={(points: number) => {
              saveUserProgress(points, 'module-level-7');
              setCurrentScreen('module-main');
            }}
            onBack={() => setCurrentScreen('module-main')}
          />
        )}

        {/* Module Screens (Old) */}
        {currentScreen === 'module-intro' && <ModuleIntro />}
        {currentScreen === 'module-why' && <ModuleWhy />}
        {currentScreen === 'module-need-vs-want' && <ModuleNeedVsWant />}
        {currentScreen === 'module-goal' && <ModuleGoal />}
        {currentScreen === 'module-simulator' && <ModuleSimulator />}
        {currentScreen === 'module-expenses' && <ModuleExpenses />}
        {currentScreen === 'module-challenge-task' && <ModuleChallengeTask />}
        {currentScreen === 'module-progress' && <ModuleProgress />}
        {currentScreen === 'module-quiz' && <ModuleQuiz />}
        {currentScreen === 'module-complete' && <ModuleComplete />}
      </div>
    </div>
  </DndProvider>
);
}

