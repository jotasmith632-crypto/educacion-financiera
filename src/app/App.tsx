import { useState, useEffect } from 'react';
import { Trophy, Target, Rocket, TrendingUp, ShoppingCart, CreditCard, PiggyBank, Flame, Award, Star, Lock, ChevronRight, Info, User, Bell, BellOff, Sparkles, Home, BookOpen, Zap, Medal, Users, ArrowRight, Check, X, TrendingDown, Calendar, BarChart3, Lightbulb, DollarSign, HelpCircle, AlertCircle, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import * as Dialog from '@radix-ui/react-dialog';
import confetti from 'canvas-confetti';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding-1');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showOlympicsInfo, setShowOlympicsInfo] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
  const [needVsWantCorrect, setNeedVsWantCorrect] = useState<number>(0);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

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
    totalPoints: 2450,
    streak: 7,
    level: 5,
    badges: 8,
    modulesCompleted: 2,
    totalModules: 5,
    pointsToNextLevel: 550,
    olimpicsProgress: 48, // Percentage to qualify
    rankTitle: 'Competidor Financiero', // Explorador -> Competidor -> Campeón
    nextRankTitle: 'Campeón Financiero',
    olimpicsReady: false
  };

  const badges = [
    { id: 1, name: 'Primer Ahorro', emoji: '🏆', unlocked: true, color: 'from-yellow-400 to-orange-500' },
    { id: 2, name: 'Comprador Inteligente', emoji: '🛒', unlocked: true, color: 'from-green-400 to-emerald-500' },
    { id: 3, name: 'Maestro del Crédito', emoji: '💳', unlocked: true, color: 'from-blue-400 to-cyan-500' },
    { id: 4, name: 'Racha de 5 días', emoji: '🔥', unlocked: true, color: 'from-red-400 to-orange-500' },
    { id: 5, name: 'Inversor Novato', emoji: '📈', unlocked: false, color: 'from-purple-400 to-pink-500' },
    { id: 6, name: 'Emprendedor', emoji: '🚀', unlocked: false, color: 'from-indigo-400 to-purple-500' },
    { id: 7, name: 'Campeón Financiero', emoji: '👑', unlocked: false, color: 'from-yellow-500 to-red-500' },
    { id: 8, name: 'Olimpiadas Ready', emoji: '🥇', unlocked: false, color: 'from-amber-400 to-yellow-500' }
  ];

  const modules: Module[] = [
    {
      id: 'ahorro-inversion',
      title: 'Ahorro e inversión inteligente',
      description: 'Ahorro, inversión y uso responsable del dinero',
      icon: PiggyBank,
      color: '#10B981',
      bgColor: '#D1FAE5',
      level: 2,
      maxLevel: 7,
      progress: 30,
      locked: false,
      status: 'in-progress'
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
      locked: false,
      status: 'in-progress'
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
      setModulePoints(0);
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
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'item',
      item: { id, text },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }));

    return (
      <motion.div
        ref={drag}
        whileHover={{ scale: 1.05, rotate: 3 }}
        className={`bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg cursor-move text-center font-medium border-2 border-purple-200 ${
          isDragging ? 'opacity-50 scale-95' : 'opacity-100'
        }`}
      >
        <span className="text-2xl mb-2 block">📝</span>
        {text}
      </motion.div>
    );
  };

  const DropZone = ({ category }: { category: string }) => {
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
        isOver: monitor.isOver()
      })
    }));

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
      <motion.div
        ref={drop}
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
            <motion.div
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Avatar Customization Screen
  const AvatarScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Mi Avatar</h1>
              <p className="text-white/90 text-sm">Personaliza tu personaje</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('home')}
            className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium border border-white/30"
          >
            Volver
          </motion.button>
        </div>
      </div>

      <div className="p-6 -mt-4 max-w-md mx-auto space-y-6">

        {/* Avatar Preview */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
          <div
            className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl relative border-4 border-gray-100"
            style={{ backgroundColor: avatar.skin }}
          >
            <span className="absolute">{avatar.face}</span>
            <span className="absolute -top-2 text-5xl">{avatar.hair}</span>
            <span className="absolute -top-1 -right-1 text-3xl">{avatar.accessory}</span>
          </div>
          <p className="text-gray-600 font-medium">Tu personaje único</p>
        </div>

        {/* Customization Options */}
        <div className="space-y-5">
          {/* Face */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">😊</span>
              Cara
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.faces.map((face) => (
                <motion.button
                  key={face}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, face });
                  }}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    avatar.face === face
                      ? 'bg-purple-100 ring-2 ring-purple-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {face}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Skin Color */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">🎨</span>
              Color de piel
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.skins.map((skin) => (
                <motion.button
                  key={skin}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, skin });
                  }}
                  className={`w-12 h-12 rounded-xl transition-all ${
                    avatar.skin === skin ? 'ring-2 ring-purple-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: skin }}
                />
              ))}
            </div>
          </div>

          {/* Hair */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">💇</span>
              Cabello
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.hairs.map((hair) => (
                <motion.button
                  key={hair}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, hair });
                  }}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    avatar.hair === hair
                      ? 'bg-purple-100 ring-2 ring-purple-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {hair}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">👑</span>
              Accesorios
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.accessories.map((accessory) => (
                <motion.button
                  key={accessory}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, accessory });
                  }}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    avatar.accessory === accessory
                      ? 'bg-yellow-100 ring-2 ring-yellow-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {accessory}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 left-10 text-6xl opacity-10"
      >
        💰
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-32 right-10 text-6xl opacity-10"
      >
        📊
      </motion.div>
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        className="absolute top-40 right-20 text-5xl opacity-10"
      >
        🎯
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="mb-6 relative"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
          <Trophy className="w-20 h-20 text-purple-600" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-white text-center mb-3 px-4"
      >
        Olimpiadas Financieras
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-white/90 text-center mb-8 max-w-sm px-6"
      >
        Aprende sobre finanzas de forma divertida y clasifica para representar a tu colegio
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 max-w-sm mx-auto"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">📚</div>
            <p className="text-white/90 text-xs font-medium">5 Módulos</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-white/90 text-xs font-medium">Retos Diarios</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-white/90 text-xs font-medium">Olimpiadas</p>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          setCurrentScreen('home');
        }}
        className="bg-white text-purple-600 px-12 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-2"
      >
        Comenzar
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );

  // Bottom Navigation Component
  const BottomNav = ({ active }: { active: Screen }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center gap-1 ${active === 'home' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Inicio</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('modules')}
          className={`flex flex-col items-center gap-1 ${active === 'modules' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-medium">Módulos</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('achievements')}
          className={`flex flex-col items-center gap-1 ${active === 'achievements' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Medal className="w-6 h-6" />
          <span className="text-xs font-medium">Logros</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('olympics')}
          className={`flex flex-col items-center gap-1 ${active === 'olympics' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-medium">Olimpiadas</span>
        </motion.button>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Simplified Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('avatar')}
              className="relative"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl relative border-3 border-white/40 shadow-lg"
                style={{ backgroundColor: avatar.skin }}
              >
                <span className="absolute">{avatar.face}</span>
                <span className="absolute -top-1 text-xl">{avatar.hair}</span>
                <span className="absolute -top-0 -right-0 text-base">{avatar.accessory}</span>
              </div>
            </motion.button>
            <div>
              <p className="text-sm text-white/80">Hola de nuevo</p>
              <h2 className="text-xl font-bold">{userProgress.rankTitle}</h2>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('parents')}
            className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 border border-white/30"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Vista Padres</span>
          </motion.button>
        </div>

        {/* 3 Key Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Star className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
            <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
            <p className="text-xs text-white/80">Puntos</p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userProgress.level}</p>
            <p className="text-xs text-white/80">Nivel</p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userProgress.olimpicsProgress}%</p>
            <p className="text-xs text-white/80">Olimpiadas</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const nextModule = modules.find(m => m.status === 'in-progress');
            if (nextModule) handleStartChallenge(nextModule.id);
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Continuar mi reto</p>
              <p className="text-sm text-white/80">Módulo: Consumo Inteligente</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        {/* Next Goal Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Siguiente meta</p>
              <h3 className="font-bold text-gray-800 text-lg">Alcanzar {userProgress.nextRankTitle}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Nivel 5 alcanzado</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
              <span className="text-gray-600">Llegar a nivel 7</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
              <span className="text-gray-600">Completar 4 módulos</span>
            </div>
          </div>
          <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2" value={40}>
            <Progress.Indicator
              className="h-full transition-all duration-500 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              style={{ transform: `translateX(-${100 - 40}%)` }}
            />
          </Progress.Root>
          <p className="text-xs text-gray-500 mt-2">40% completado</p>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              🔥
            </div>
            <div>
              <p className="font-bold text-lg">{userProgress.streak} días consecutivos</p>
              <p className="text-sm text-white/90">¡Sigue así!</p>
            </div>
          </div>
        </div>

        {/* Quick Module Access */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Módulos Activos</h3>
            <button
              onClick={() => setCurrentScreen('modules')}
              className="text-sm text-purple-600 font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {modules.filter(m => m.status === 'in-progress').map((module) => (
              <motion.button
                key={module.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartChallenge(module.id)}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{module.title}</h4>
                <div className="flex items-center gap-2">
                  <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full flex-1 h-1.5" value={module.progress}>
                    <Progress.Indicator
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        backgroundColor: module.color,
                        transform: `translateX(-${100 - module.progress}%)`
                      }}
                    />
                  </Progress.Root>
                  <span className="text-xs font-medium text-gray-600">{module.progress}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );

  const ModulesScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Módulos de Aprendizaje</h1>
        <p className="text-white/80 text-sm">Completa todos para clasificar a las Olimpiadas</p>
      </div>

      <div className="p-6 -mt-4 space-y-4">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-8 h-8" style={{ color: module.color }} />
                  {module.status === 'completed' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {module.status === 'locked' && (
                    <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-800">{module.title}</h3>
                    {module.status === 'completed' && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        Completado
                      </span>
                    )}
                    {module.status === 'in-progress' && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        En curso
                      </span>
                    )}
                    {module.status === 'locked' && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Nivel {module.level} de {module.maxLevel}</span>
                    <div className="flex gap-0.5">
                      {[...Array(module.maxLevel)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < module.level ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill={i < module.level ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress.Root
                      className="relative overflow-hidden bg-gray-200 rounded-full flex-1 h-2"
                      value={module.progress}
                    >
                      <Progress.Indicator
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          backgroundColor: module.color,
                          transform: `translateX(-${100 - module.progress}%)`
                        }}
                      />
                    </Progress.Root>
                    <span className="text-sm font-bold text-gray-700">{module.progress}%</span>
                  </div>
                </div>
              </div>

              {module.status !== 'locked' && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartChallenge(module.id)}
                  className="w-full bg-gradient-to-r text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${module.color}, ${module.color}dd)`
                  }}
                >
                  {module.status === 'completed' ? 'Repasar módulo' : 'Continuar aprendiendo'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              {module.status === 'locked' && (
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Completa el módulo anterior para desbloquear</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav active="modules" />
    </div>
  );

  const ChallengeScreen = () => {
    const currentChallenge = challengeQuestions[currentQuestion];
    const module = modules.find(m => m.id === selectedModule);

    const renderQuizChallenge = () => {
      if (currentChallenge.type !== 'quiz') return null;

      return (
        <div className="space-y-3">
          {currentChallenge.options!.map((option, index) => (
            <motion.button
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
            </motion.button>
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
            <motion.button
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
            </motion.button>
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
                <motion.button
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
                </motion.button>
              ))}
            </div>

            {/* Definitions Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 text-center bg-pink-100 py-2 rounded-xl">Definiciones</h4>
              {currentChallenge.pairs!.map((pair) => (
                <motion.button
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
                </motion.button>
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('modules')}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-sm font-medium">Volver</span>
            </motion.button>

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
            <motion.div
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
            </motion.div>
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

  const AchievementsScreen = () => {
    const progressPercentage = Math.round((userProgress.modulesCompleted / userProgress.totalModules) * 100);
    const nextBadge = badges.find(b => !b.unlocked);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
          <h1 className="text-2xl font-bold mb-2">Mis Logros</h1>
          <p className="text-white/80 text-sm">Tu progreso y recompensas</p>
        </div>

        <div className="p-6 -mt-4 space-y-5">
          {/* 1. Bloque Superior de Resumen - PROTAGONISTA */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
                <h2 className="text-4xl font-bold">Nivel {userProgress.level}</h2>
                <p className="text-sm mt-1 opacity-90">{userProgress.rankTitle}</p>
              </div>
              <div className="text-6xl">
                {userProgress.level >= 7 ? '👑' : userProgress.level >= 4 ? '⚡' : '🌟'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <Star className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
                <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
                <p className="text-xs opacity-90">Puntos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <Flame className="w-5 h-5 mx-auto mb-1" fill="currentColor" />
                <p className="text-2xl font-bold">{userProgress.streak}</p>
                <p className="text-xs opacity-90">Días racha</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1" />
                <p className="text-2xl font-bold">{progressPercentage}%</p>
                <p className="text-xs opacity-90">Progreso</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Próximo nivel</span>
                <span className="text-xs font-bold">65%</span>
              </div>
              <Progress.Root className="relative overflow-hidden bg-white/30 rounded-full w-full h-2" value={65}>
                <Progress.Indicator
                  className="h-full transition-all duration-500 bg-white rounded-full"
                  style={{ transform: `translateX(-${100 - 65}%)` }}
                />
              </Progress.Root>
            </div>
          </div>

          {/* 2. Sección de Insignias - GRID COMPACTO */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Mis Insignias</h3>
              <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#EFEAFE', color: '#6C4CF1' }}>
                {badges.filter(b => b.unlocked).length}/{badges.length}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-3xl border-2 transition-all ${
                      badge.unlocked
                        ? 'bg-white border-purple-200 shadow-md'
                        : 'bg-gray-100 border-gray-300 grayscale opacity-40'
                    }`}
                  >
                    {badge.emoji}
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1.5 text-center leading-tight font-medium">
                    {badge.name}
                  </p>
                  {badge.unlocked && (
                    <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center -mt-0.5">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3. Sección de Progreso por Módulos */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Módulos</h3>

            <div className="space-y-2">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: module.bgColor }}
                  >
                    <module.icon className="w-5 h-5" style={{ color: module.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{module.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {module.status === 'completed' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Completado
                        </span>
                      )}
                      {module.status === 'in-progress' && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          En curso
                        </span>
                      )}
                      {module.status === 'locked' && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: module.color }}>{module.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Sección de Recomendación */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2" style={{ borderColor: '#CFC3FF' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm">
                <Lightbulb className="w-5 h-5" style={{ color: '#6C4CF1' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">Tu siguiente paso</h3>
                <p className="text-sm text-gray-700">
                  Continúa con el módulo de <span className="font-bold" style={{ color: '#6C4CF1' }}>Consumo Inteligente</span> para ganar más puntos
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: modules[1].bgColor }}
                >
                  <ShoppingCart className="w-6 h-6" style={{ color: modules[1].color }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Consumo Inteligente</p>
                  <p className="text-xs text-gray-600">60% completado</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Te faltan 400 puntos para el próximo nivel</span>
              </div>

              <button
                onClick={() => setCurrentScreen('modules')}
                className="w-full py-3 rounded-xl font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
              >
                Continuar módulo
              </button>
            </div>
          </div>
        </div>

        <BottomNav active="achievements" />
      </div>
    );
  };

  const OlympicsScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white p-6 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">🏆</div>
          <div>
            <h1 className="text-2xl font-bold">Olimpiadas Financieras</h1>
            <p className="text-white/90 text-sm">Evento presencial nacional</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Tu estado</h3>
            <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
              En proceso
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progreso de clasificación</span>
              <span className="text-sm font-bold text-gray-800">{userProgress.olimpicsProgress}%</span>
            </div>
            <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3" value={userProgress.olimpicsProgress}>
              <Progress.Indicator
                className="h-full transition-all duration-500 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ transform: `translateX(-${100 - userProgress.olimpicsProgress}%)` }}
              />
            </Progress.Root>
          </div>
          <p className="text-sm text-gray-600">
            Completa los requisitos para clasificar y representar a tu colegio en el evento presencial.
          </p>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Requisitos para clasificar</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.level >= 7 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.level >= 7 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Alcanzar nivel 7</p>
                <p className="text-xs text-gray-500">Nivel actual: {userProgress.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.modulesCompleted >= 4 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.modulesCompleted >= 4 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Completar 4 módulos</p>
                <p className="text-xs text-gray-500">Completados: {userProgress.modulesCompleted}/5</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProgress.totalPoints >= 5000 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {userProgress.totalPoints >= 5000 ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Obtener 5000 puntos</p>
                <p className="text-xs text-gray-500">Puntos actuales: {userProgress.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Ranking */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ranking por colegios</h3>
          <div className="space-y-3">
            {[
              { school: 'Colegio San Ignacio', points: 48500, students: 23 },
              { school: 'Instituto Nacional', points: 45200, students: 19 },
              { school: 'Colegio Santa María', points: 42800, students: 21 }
            ].map((school, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  'bg-orange-600 text-white'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{school.school}</p>
                  <p className="text-xs text-gray-500">{school.students} estudiantes · {school.points.toLocaleString()} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5 border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Próximo evento</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p><Calendar className="w-4 h-4 inline mr-1" /> 15 de Julio, 2026</p>
                <p>📍 Centro de Convenciones Nacional</p>
                <p>🎯 Competencia presencial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Premios</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-4xl mb-2">🥇</div>
              <p className="text-xs font-medium text-gray-700">1er lugar</p>
              <p className="text-xs text-gray-500">Beca completa</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <p className="text-xs font-medium text-gray-700">2do lugar</p>
              <p className="text-xs text-gray-500">Tablet</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <p className="text-xs font-medium text-gray-700">3er lugar</p>
              <p className="text-xs text-gray-500">Laptop</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="olympics" />
    </div>
  );

  const ParentsScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Reporte para Padres</h1>
              <p className="text-white/90 text-sm">Seguimiento mensual del progreso</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('home')}
            className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium border border-white/30"
          >
            Volver
          </motion.button>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-4">
        {/* Email Header Simulation */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">Reporte Mensual - Abril 2026</p>
              <p className="text-xs text-gray-500">Enviado automáticamente cada mes</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Estimado padre/madre de familia, este es el resumen del progreso de su hijo/a en el programa de educación financiera.
          </p>
        </div>

        {/* Student Overview Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Resumen del estudiante</h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-100">
              <p className="text-2xl font-bold text-blue-600">{userProgress.streak}</p>
              <p className="text-xs text-gray-600 mt-1">Días activo</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
              <p className="text-2xl font-bold text-green-600">{userProgress.level}</p>
              <p className="text-xs text-gray-600 mt-1">Nivel actual</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">{userProgress.totalPoints}</p>
              <p className="text-xs text-gray-600 mt-1">Puntos</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso general</span>
              <span className="text-sm font-bold text-purple-600">{Math.round((userProgress.modulesCompleted / userProgress.totalModules) * 100)}%</span>
            </div>
            <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2" value={(userProgress.modulesCompleted / userProgress.totalModules) * 100}>
              <Progress.Indicator
                className="h-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ transform: `translateX(-${100 - ((userProgress.modulesCompleted / userProgress.totalModules) * 100)}%)` }}
              />
            </Progress.Root>
            <p className="text-xs text-gray-500 mt-2">
              {userProgress.modulesCompleted} de {userProgress.totalModules} módulos completados
            </p>
          </div>
        </div>

        {/* Modules Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Módulos completados este mes</h3>
          <div className="space-y-3">
            {modules.slice(0, 3).map((module) => (
              <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <module.icon className="w-5 h-5" style={{ color: module.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{module.title}</p>
                  <p className="text-xs text-gray-500">{module.progress}% completado</p>
                </div>
                {module.status === 'completed' && (
                  <div className="bg-green-100 px-2 py-1 rounded-lg">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Logros desbloqueados</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.filter(b => b.unlocked).map((badge) => (
              <div key={badge.id} className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-md"
                  style={{ background: `linear-gradient(135deg, ${badge.color.split(' ')[1]} 0%, ${badge.color.split(' ')[3]} 100%)` }}
                >
                  {badge.emoji}
                </div>
                <p className="text-xs text-center mt-2 text-gray-600 w-16">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations for Parents */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Recomendaciones de acompañamiento
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Celebra su constancia</p>
                <p className="text-xs text-gray-600">Ha mantenido {userProgress.streak} días consecutivos de aprendizaje. Reconoce este logro.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Conversa sobre lo aprendido</p>
                <p className="text-xs text-gray-600">Pregúntale qué diferencia ve entre una necesidad y un deseo en su día a día.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Apoya su meta de ahorro</p>
                <p className="text-xs text-gray-600">Si tiene una meta definida, ayúdale a crear un espacio donde guarde su dinero.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Próximos pasos</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <DollarSign className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-sm text-gray-700">Completar módulo de Crédito Responsable</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-sm text-gray-700">Alcanzar nivel 7 para clasificar a las Olimpiadas</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-sm text-gray-700">Desbloquear 3 insignias adicionales</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3">
            Este reporte se envía automáticamente al correo registrado el primer día de cada mes
          </p>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-gray-700 py-3 rounded-xl text-sm font-medium border border-gray-200">
              Descargar PDF
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium">
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation Button Components
  const PrimaryButton = ({
    onClick,
    children,
    disabled = false
  }: {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean
  }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #3B82F6 100%)' }}
    >
      {children}
    </motion.button>
  );

  const SecondaryButton = ({
    onClick,
    children
  }: {
    onClick: () => void;
    children: React.ReactNode
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white text-gray-700 py-4 rounded-2xl font-medium shadow-md border-2 border-gray-200 flex items-center justify-center gap-2"
    >
      {children}
    </motion.button>
  );

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 text-white"
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      <span className="text-sm font-medium">Atrás</span>
    </motion.button>
  );

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
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="text-8xl mb-8"
      >
        💰
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Aprende a manejar tu dinero
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        De forma divertida y práctica
      </motion.p>

      <motion.div
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
      </motion.div>
    </div>
  );

  const Onboarding2 = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="flex gap-6 mb-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🎯
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="text-6xl"
        >
          🏆
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Completa módulos
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        Gana puntos, insignias y sube de nivel mientras aprendes
      </motion.p>

      <motion.div
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
      </motion.div>
    </div>
  );

  const Onboarding3 = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8"
      >
        <Trophy className="w-20 h-20 text-yellow-500" />
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white text-center mb-4 px-4"
      >
        Olimpiadas Financieras
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-white/90 text-center mb-12 max-w-md"
      >
        Clasifica y representa a tu colegio en el evento presencial más importante
      </motion.p>

      <motion.div
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
      </motion.div>
    </div>
  );

  // Register Screen
  const RegisterScreen = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      school: '',
      grade: '',
      district: ''
    });

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8">
          <button
            onClick={() => setCurrentScreen('onboarding-3')}
            className="text-white/80 mb-4"
          >
            ← Atrás
          </button>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-white/80 text-sm mt-1">Únete a Olimpiadas Financieras</p>
        </div>

        <div className="p-6 -mt-4 max-w-md mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colegio</label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="Nombre de tu colegio"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grado</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  >
                    <option value="">Selecciona</option>
                    <option value="1">1° Sec</option>
                    <option value="2">2° Sec</option>
                    <option value="3">3° Sec</option>
                    <option value="4">4° Sec</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                    placeholder="Tu distrito"
                  />
                </div>
              </div>
            </div>
          </div>

          <PrimaryButton onClick={() => setCurrentScreen('payment')}>
            Continuar
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => setCurrentScreen('login')}
              className="font-bold"
              style={{ color: '#6C4CF1' }}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Login Screen
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 pb-8">
          <button
            onClick={() => setCurrentScreen('onboarding-1')}
            className="text-white/80 mb-4"
          >
            ← Atrás
          </button>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-white/80 text-sm mt-1">Continúa tu ruta financiera</p>
        </div>

        <div className="p-6 -mt-4 max-w-md mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none"
                  placeholder="Tu contraseña"
                />
              </div>

              <button className="text-sm" style={{ color: '#6C4CF1' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <PrimaryButton onClick={() => setCurrentScreen('home')}>
            Iniciar sesión
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => setCurrentScreen('register')}
              className="font-bold"
              style={{ color: '#6C4CF1' }}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    );
  };

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
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 3 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-600" />
          </motion.div>

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
        </motion.div>

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
        completed: false,
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
        completed: false,
        locked: false,
        points: 150
      },
      {
        level: 3,
        title: 'Plan de ahorro',
        description: 'Organiza tus ingresos, gastos y ahorros',
        icon: BarChart3,
        color: '#3B82F6',
        bgColor: '#DBEAFE',
        completed: false,
        locked: true,
        points: 150
      },
      {
        level: 4,
        title: 'Ahorro vs. inversión',
        description: 'Decide entre guardar o hacer crecer tu dinero',
        icon: TrendingUp,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        completed: false,
        locked: true,
        points: 200
      },
      {
        level: 5,
        title: 'El banco y sus opciones',
        description: 'Compara planes de ahorro bancarios',
        icon: CreditCard,
        color: '#EC4899',
        bgColor: '#FCE7F3',
        completed: false,
        locked: true,
        points: 200
      },
      {
        level: 6,
        title: 'Mini bolsa de valores',
        description: 'Invierte tus monedas virtuales',
        icon: TrendingUp,
        color: '#EF4444',
        bgColor: '#FEE2E2',
        completed: false,
        locked: true,
        points: 250
      },
      {
        level: 7,
        title: 'Decisión final',
        description: 'Completa tu estrategia financiera',
        icon: Trophy,
        color: '#FBBF24',
        bgColor: '#FEF3C7',
        completed: false,
        locked: true,
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

          <motion.div
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
          </motion.div>
        </div>

        {/* Progress Summary */}
        <div className="px-6 -mt-16 mb-6">
          <motion.div
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
          </motion.div>
        </div>

        {/* Levels List */}
        <div className="px-6 pb-8 space-y-4">
          {moduleLevels.map((levelData, index) => {
            const IconComponent = levelData.icon;
            const isLocked = levelData.locked;
            const isCompleted = levelData.completed;

            return (
              <motion.div
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
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const ModuleLevel1 = () => {
    // Estado para el flujo pedagógico de 10 pantallas
    const [step, setStep] = useState<number>(1);

    // Pantalla 2: Clasificación de metas
    const [classifiedGoals, setClassifiedGoals] = useState<{ [key: string]: 'short' | 'long' | '' }>({
      headphones: '',
      bike: '',
      snack: '',
      laptop: ''
    });

    // Pantalla 5: Preguntas de análisis
    const [question1Answer, setQuestion1Answer] = useState<string>('');
    const [question2Answer, setQuestion2Answer] = useState<string>('');
    const [question3Answers, setQuestion3Answers] = useState<string[]>([]);

    // Pantalla 6: Decisión financiera
    const [weeklyDecision, setWeeklyDecision] = useState<string>('');

    // Pantalla 7: Ahorro vs crédito
    const [financingChoice, setFinancingChoice] = useState<string>('');

    // Pantalla 8: Tu propia meta
    const [myGoal, setMyGoal] = useState<string>('');
    const [myGoalCost, setMyGoalCost] = useState<number>(0);
    const [myGoalWeeks, setMyGoalWeeks] = useState<number>(4);
    const [myWeeklySaving, setMyWeeklySaving] = useState<number>(10);
    const [myExpenseToReduce, setMyExpenseToReduce] = useState<string>('');

    // Pantalla 9: Reflexión
    const [reflection1, setReflection1] = useState<string>('');
    const [reflection2, setReflection2] = useState<string>('');
    const [reflection3, setReflection3] = useState<string>('');

    const weeklyIncome = 25;

    const handleComplete = () => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setModulePoints(prev => prev + 100);
      setTimeout(() => {
        setCurrentScreen('module-main');
      }, 2500);
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 pt-12 pb-16 px-6 relative overflow-hidden">
          <BackButton onClick={() => setCurrentScreen('module-main')} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
              <Target className="w-5 h-5" />
              <span className="font-bold">Nivel 1 de 7 - Pantalla {step} de 10</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Mi meta financiera</h1>
            <p className="text-blue-50 text-base">
              {step === 1 && "¿Qué es una meta financiera?"}
              {step === 2 && "Clasifica las metas"}
              {step === 3 && "Tu meta necesita un plan"}
              {step === 4 && "Misión: ayudar a Valeria"}
              {step === 5 && "Analiza la situación"}
              {step === 6 && "Toma una decisión"}
              {step === 7 && "Ahorro vs. crédito"}
              {step === 8 && "Construye tu meta"}
              {step === 9 && "Reflexiona"}
              {step === 10 && "¡Nivel completado!"}
            </p>
          </motion.div>
        </div>

        <div className="px-6 -mt-8 pb-8 space-y-6">
          {/* PANTALLA 1: ¿QUÉ ES UNA META FINANCIERA? */}
          {step === 1 && (
            <>
              {/* Ícono central */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center -mb-2"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-5xl">🎯</span>
                </div>
              </motion.div>

              {/* Card de explicación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <h3 className="font-bold text-2xl mb-4 text-gray-800 text-center">¿Qué es una meta financiera?</h3>
                <p className="text-gray-700 leading-relaxed text-center mb-4">
                  Una meta financiera es algo que <strong>quieres lograr con tu dinero</strong> en un tiempo determinado.
                </p>
                <p className="text-gray-700 leading-relaxed text-center">
                  Puede ser algo pequeño que logres pronto o algo más grande que necesite más tiempo.
                </p>
              </motion.div>

              {/* Ejemplos visuales */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center border-2 border-green-200">
                  <div className="text-4xl mb-2">🎮</div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Meta pequeña</div>
                  <div className="text-xs text-gray-600">Comprar un videojuego en 1 mes</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-center border-2 border-purple-200">
                  <div className="text-4xl mb-2">💻</div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Meta grande</div>
                  <div className="text-xs text-gray-600">Ahorrar para una laptop en 1 año</div>
                </div>
              </motion.div>

              {/* Barra de progreso */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Progreso del nivel</span>
                  <span className="text-sm font-bold text-blue-600">Pantalla 1 de 10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '10%' }}
                  ></div>
                </div>
              </motion.div>

              {/* Botones */}
              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  Entendido
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>

                <button
                  onClick={() => setCurrentScreen('module-main')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 active:scale-98 transition-all"
                >
                  Atrás
                </button>
              </div>
            </>
          )}

          {/* PANTALLA 2: METAS DE CORTO Y LARGO PLAZO */}
          {step === 2 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Analiza la situación</h3>
                    <p className="text-sm text-gray-500">Responde las siguientes preguntas</p>
                  </div>
                </div>

                {/* Pregunta 1 */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <h4 className="font-bold text-gray-800">¿Cuál de estas metas es de corto plazo?</h4>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setQuestion1Answer('headphones')}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        question1Answer === 'headphones'
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🎧</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">Audífonos de S/ 80</div>
                        </div>
                        {question1Answer === 'headphones' && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => setQuestion1Answer('entrepreneurship')}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        question1Answer === 'entrepreneurship'
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💼</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">Materiales para emprendimiento escolar de S/ 100</div>
                        </div>
                        {question1Answer === 'entrepreneurship' && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Pregunta 2 */}
                <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <h4 className="font-bold text-gray-800">¿Cuál parece una meta de más largo plazo?</h4>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setQuestion2Answer('headphones')}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        question2Answer === 'headphones'
                          ? 'border-purple-500 bg-purple-100'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🎧</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">Audífonos de S/ 80</div>
                        </div>
                        {question2Answer === 'headphones' && (
                          <Check className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => setQuestion2Answer('entrepreneurship')}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        question2Answer === 'entrepreneurship'
                          ? 'border-purple-500 bg-purple-100'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💼</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">Materiales para emprendimiento escolar de S/ 100</div>
                        </div>
                        {question2Answer === 'entrepreneurship' && (
                          <Check className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Pregunta 3 */}
                <div className="mb-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <h4 className="font-bold text-gray-800">¿Qué gastos están alejando a Valeria de sus metas?</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Selecciona todas las que apliquen</p>
                  <div className="space-y-2">
                    {[
                      { id: 'snacks', label: 'Snacks', emoji: '🍫' },
                      { id: 'recharges', label: 'Recargas', emoji: '📱' },
                      { id: 'weeklySaving', label: 'Ahorro semanal', emoji: '🐷' },
                      { id: 'planning', label: 'Planificación', emoji: '📊' }
                    ].map(option => {
                      const isSelected = question3Answers.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            if (isSelected) {
                              setQuestion3Answers(question3Answers.filter(id => id !== option.id));
                            } else {
                              setQuestion3Answers([...question3Answers, option.id]);
                            }
                          }}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-orange-500 bg-orange-100'
                              : 'border-gray-200 bg-white hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{option.emoji}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{option.label}</div>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Validar respuestas y dar feedback
                    if (question1Answer && question2Answer && question3Answers.length > 0) {
                      setStep(3);
                    }
                  }}
                  disabled={!question1Answer || !question2Answer || question3Answers.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                    question1Answer && question2Answer && question3Answers.length > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-xl active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Comprobar
                  <ArrowRight className="w-6 h-6 inline ml-2" />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 active:scale-98 transition-all"
                >
                  Atrás
                </button>
              </div>
            </>
          )}

          {/* PASO 3: ¿QUÉ HARÍAS TÚ? - DECISIÓN FINANCIERA */}
          {step === 3 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">¿Qué harías tú?</h3>
                    <p className="text-sm text-gray-500">Elige la mejor decisión financiera</p>
                  </div>
                </div>

                {/* Avatar y contexto */}
                <div className="mb-5 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      👧
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">El caso de Valeria</div>
                      <div className="text-sm text-gray-500">Ingreso semanal: S/ 25</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Valeria recibe <strong className="text-emerald-600">S/ 25 por semana</strong>.
                    ¿Cuál de estas decisiones la acerca más a su meta?
                  </p>
                </div>

                {/* Opciones de decisión */}
                <div className="space-y-3">
                  {/* Opción 1: Gastar S/ 15 en antojos y ahorrar S/ 10 */}
                  <button
                    onClick={() => setWeeklyDecision('option1')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      weeklyDecision === 'option1'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🍕</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-2">Gastar S/ 15 en antojos y ahorrar S/ 10</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-lg p-2 border border-amber-200">
                            <div className="text-gray-500">Gastos</div>
                            <div className="font-bold text-red-600">S/ 15</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-amber-200">
                            <div className="text-gray-500">Ahorro</div>
                            <div className="font-bold text-green-600">S/ 10</div>
                          </div>
                        </div>
                      </div>
                      {weeklyDecision === 'option1' && (
                        <Check className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                  </button>

                  {/* Opción 2: Ahorrar S/ 20 y gastar S/ 5 */}
                  <button
                    onClick={() => setWeeklyDecision('option2')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      weeklyDecision === 'option2'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🐷</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-2">Ahorrar S/ 20 y gastar S/ 5</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-lg p-2 border border-emerald-200">
                            <div className="text-gray-500">Gastos</div>
                            <div className="font-bold text-red-600">S/ 5</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-emerald-200">
                            <div className="text-gray-500">Ahorro</div>
                            <div className="font-bold text-green-600">S/ 20</div>
                          </div>
                        </div>
                      </div>
                      {weeklyDecision === 'option2' && (
                        <Check className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                  </button>

                  {/* Opción 3: Gastar todo esta semana */}
                  <button
                    onClick={() => setWeeklyDecision('option3')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      weeklyDecision === 'option3'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">💸</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-2">Gastar todo esta semana</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-lg p-2 border border-red-200">
                            <div className="text-gray-500">Gastos</div>
                            <div className="font-bold text-red-600">S/ 25</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-red-200">
                            <div className="text-gray-500">Ahorro</div>
                            <div className="font-bold text-gray-400">S/ 0</div>
                          </div>
                        </div>
                      </div>
                      {weeklyDecision === 'option3' && (
                        <Check className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </button>

                  {/* Opción 4: Pedir prestado sin plan */}
                  <button
                    onClick={() => setWeeklyDecision('option4')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      weeklyDecision === 'option4'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">💳</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-2">Pedir prestado sin plan</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-lg p-2 border border-purple-200">
                            <div className="text-gray-500">Deuda</div>
                            <div className="font-bold text-purple-600">S/ ???</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-purple-200">
                            <div className="text-gray-500">Ahorro</div>
                            <div className="font-bold text-gray-400">S/ 0</div>
                          </div>
                        </div>
                      </div>
                      {weeklyDecision === 'option4' && (
                        <Check className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Info adicional sobre consumo presente vs futuro */}
              {weeklyDecision && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-5 border-2 ${
                    weeklyDecision === 'option2'
                      ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                      : weeklyDecision === 'option1'
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                      : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {weeklyDecision === 'option2' ? (
                      <>
                        <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-emerald-900 mb-1">¡Excelente decisión!</div>
                          <p className="text-sm text-emerald-800">
                            Ahorrar S/ 20 por semana permite alcanzar metas más rápido. Valeria podría comprar sus audífonos en 4 semanas.
                          </p>
                        </div>
                      </>
                    ) : weeklyDecision === 'option1' ? (
                      <>
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-amber-900 mb-1">Decisión moderada</div>
                          <p className="text-sm text-amber-800">
                            Ahorrar S/ 10 por semana es un inicio, pero tardaría 8 semanas en alcanzar su meta de audífonos.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-red-900 mb-1">¡Cuidado!</div>
                          <p className="text-sm text-red-800">
                            {weeklyDecision === 'option3'
                              ? 'Sin ahorro, Valeria nunca alcanzará sus metas. El consumo presente debe balancearse con el ahorro.'
                              : 'Pedir prestado sin plan genera deudas y dificulta alcanzar las metas. Es mejor ahorrar primero.'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={() => setStep(4)}
                  disabled={!weeklyDecision}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                    weeklyDecision
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Comprobar decisión
                  <ArrowRight className="w-6 h-6 inline ml-2" />
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 active:scale-98 transition-all"
                >
                  Atrás
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const ModuleLevel2 = () => {
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
      setModulePoints(prev => prev + 150);
      setTimeout(() => {
        setCurrentScreen('module-main');
      }, 2000);
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 pt-12 pb-16 px-6 relative overflow-hidden">
          <BackButton onClick={() => setCurrentScreen('module-main')} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold">Nivel 2 de 7</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Gastos hormiga</h1>
            <p className="text-orange-50 text-lg">Identifica pequeños gastos innecesarios</p>
          </motion.div>
        </div>

        <div className="px-6 -mt-8 pb-8 space-y-6">
          {!showResult ? (
            <>
              {/* Situation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
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
              </motion.div>

              {/* Expenses Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
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
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{expense.emoji}</div>
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
              </motion.div>

              {/* Current savings preview */}
              {identifiedExpenses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-5"
                >
                  <div className="text-center">
                    <div className="text-sm text-orange-700 mb-1">Podrías ahorrar</div>
                    <div className="text-4xl font-bold text-orange-600 mb-1">
                      S/ {totalWeeklySavings.toFixed(2)}
                    </div>
                    <div className="text-sm text-orange-700">por semana</div>
                  </div>
                </motion.div>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 shadow-xl text-white"
              >
                <div className="text-6xl mb-4">🐜💸</div>
                <h2 className="text-2xl font-bold mb-2">¡Gastos hormiga identificados!</h2>
                <p className="text-orange-50 mb-6">
                  Encontraste <strong>{identifiedExpenses.length}</strong> gastos que puedes reducir
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-orange-100 text-sm mb-1">Ahorro semanal</div>
                    <div className="text-3xl font-bold">S/ {totalWeeklySavings.toFixed(2)}</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-orange-100 text-sm mb-1">Ahorro mensual</div>
                    <div className="text-3xl font-bold">S/ {totalMonthlySavings.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-orange-100 text-sm mb-2">En un año ahorrarías</div>
                  <div className="text-5xl font-bold">S/ {(totalMonthlySavings * 12).toFixed(2)}</div>
                </div>
              </motion.div>

              {/* Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
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
              </motion.div>

              {/* Strategy Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-3xl p-6 shadow-lg"
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
              </motion.div>

              {/* Reward */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 shadow-lg text-center"
              >
                <Star className="w-12 h-12 text-white mx-auto mb-2 fill-white" />
                <div className="text-2xl font-bold text-white mb-1">+150 puntos</div>
                <div className="text-yellow-50">¡Nivel 2 completado!</div>
              </motion.div>

              <PrimaryButton onClick={handleComplete}>
                Continuar al siguiente nivel
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    );
  };

  // Placeholder screens for levels 3-7 (to be developed)
  const ModuleLevel3 = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nivel 3: Plan de ahorro</h2>
        <p className="text-gray-600">Próximamente</p>
        <button
          onClick={() => setCurrentScreen('module-main')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
        >
          Volver al módulo
        </button>
      </div>
    </div>
  );

  const ModuleLevel4 = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nivel 4: Ahorro vs. inversión</h2>
        <p className="text-gray-600">Próximamente</p>
        <button
          onClick={() => setCurrentScreen('module-main')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
        >
          Volver al módulo
        </button>
      </div>
    </div>
  );

  const ModuleLevel5 = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nivel 5: El banco y sus opciones</h2>
        <p className="text-gray-600">Próximamente</p>
        <button
          onClick={() => setCurrentScreen('module-main')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
        >
          Volver al módulo
        </button>
      </div>
    </div>
  );

  const ModuleLevel6 = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nivel 6: Mini bolsa de valores</h2>
        <p className="text-gray-600">Próximamente</p>
        <button
          onClick={() => setCurrentScreen('module-main')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
        >
          Volver al módulo
        </button>
      </div>
    </div>
  );

  const ModuleLevel7 = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nivel 7: Decisión final</h2>
        <p className="text-gray-600">Próximamente</p>
        <button
          onClick={() => setCurrentScreen('module-main')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
        >
          Volver al módulo
        </button>
      </div>
    </div>
  );

  // ===== OLD MODULE SCREENS =====

  // Module Screen 1: Welcome
  const ModuleIntro = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <ModuleHeader step={1} onBack={() => setCurrentScreen('modules')} />

      <div className="p-6 max-w-md mx-auto -mt-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-lg text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            🎯
          </motion.div>
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
        </motion.div>

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
            setModulePoints(modulePoints + 20);
            setCurrentScreen('module-need-vs-want');
          }}
        >
          Continuar
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-8xl mb-6"
              >
                {score >= 5 ? '🎉' : score >= 3 ? '👍' : '💪'}
              </motion.div>

              <h2 className="text-3xl font-bold mb-3" style={{ color: '#6C4CF1' }}>
                {score >= 5 ? '¡Excelente trabajo!' : score >= 3 ? '¡Bien hecho!' : '¡Buen intento!'}
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                Acertaste <span className="font-bold text-2xl" style={{ color: '#6C4CF1' }}>{score} de {totalItems}</span> respuestas
              </p>

              {/* Points earned prominently */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white"
              >
                <p className="text-sm mb-2 opacity-90">Has ganado</p>
                <p className="text-5xl font-bold mb-2">+{score * 10}</p>
                <p className="text-sm opacity-90">puntos</p>
              </motion.div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border-2" style={{ borderColor: '#CFC3FF' }}>
                <p className="text-sm text-gray-700">
                  💡 Diferenciar necesidades de deseos te ayuda a tomar mejores decisiones de ahorro
                </p>
              </div>
            </motion.div>

            <PrimaryButton
              onClick={() => {
                setModulePoints(modulePoints + score * 10);
                setCurrentScreen('module-goal');
              }}
            >
              Continuar
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white text-center"
          >
            <p className="text-sm mb-2 opacity-90">Tu progreso</p>
            <motion.p
              key={answeredCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold mb-2"
            >
              {answeredCount}
            </motion.p>
            <p className="text-2xl font-bold">de {totalItems}</p>
            <p className="text-sm mt-3 opacity-90">elementos clasificados</p>
          </motion.div>

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
                    <motion.button
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
                    </motion.button>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs font-medium text-gray-500 text-center mb-2">
                  ¿Qué tipo de elemento es?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClassify(selectedItem, 'need')}
                    className="py-4 px-4 rounded-2xl font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                  >
                    <div className="text-2xl mb-1">✅</div>
                    Necesidad
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClassify(selectedItem, 'want')}
                    className="py-4 px-4 rounded-2xl font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                  >
                    <div className="text-2xl mb-1">💭</div>
                    Deseo
                  </motion.button>
                </div>
              </motion.div>
            ) : answeredCount < totalItems && (
              <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <p className="text-sm font-medium text-gray-700">
                  👆 Selecciona un elemento de arriba
                </p>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mt-4 p-3 rounded-xl text-center font-bold ${
                  feedback.correct ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            {/* Already Classified Items */}
            {answeredCount > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Ya clasificados: {answeredCount}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {itemsState.filter(i => i.placed).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-lg p-2 text-center bg-gray-50 border border-gray-200"
                    >
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <p className="text-xs text-gray-600">{item.userChoice === 'need' ? '✅' : '💭'}</p>
                    </motion.div>
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
                <motion.button
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
                </motion.button>
              ))}
            </div>

            {savingsGoal && (
              <motion.div
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
              </motion.div>
            )}
          </div>

          {savingsGoal && goalAmount > 0 && currentSavings >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  setModulePoints(modulePoints + 30);
                  setCurrentScreen('module-simulator');
                }}
              >
                Ver mi plan
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </motion.div>
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
                <motion.button
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
                </motion.button>
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
              setModulePoints(modulePoints + 25);
              setCurrentScreen('module-expenses');
            }}
          >
            Continuar
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
                <motion.button
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
                </motion.button>
              ))}
            </div>

            {selectedExpenses.length > 0 && (
              <motion.div
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
                  En {Math.ceil((goalAmount - currentSavings) / totalSaved)} semanas alcanzarías tu meta 🎯
                </p>
              </motion.div>
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
              setModulePoints(modulePoints + 35);
              setCurrentScreen('module-challenge-task');
            }}
          >
            Continuar
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
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎯
              </motion.div>
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

              <motion.button
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
              </motion.button>

              {taskCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: '#EFEAFE' }}
                >
                  <p className="font-bold mb-1" style={{ color: '#6C4CF1' }}>+50 puntos</p>
                  <p className="text-sm text-gray-700">
                    Completarás el reto cuando practiques en la vida real 💪
                  </p>
                </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  setModulePoints(modulePoints + 50);
                  setCurrentScreen('module-progress');
                }}
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </motion.div>
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
                  <motion.circle
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
                          <motion.div
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
              setModulePoints(modulePoints + 20);
              setCurrentScreen('module-quiz');
            }}
          >
            Continuar
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
                <motion.button
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
                </motion.button>
              ))}
            </div>

            {showResult && (
              <motion.div
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
              </motion.div>
            )}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PrimaryButton
                onClick={() => {
                  setModulePoints(modulePoints + (isCorrect ? 40 : 20));
                  setCurrentScreen('module-complete');
                }}
              >
                Finalizar módulo
                <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </motion.div>
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
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-6 w-full"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>

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
                +{modulePoints}
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
          </motion.div>

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
      <div className="font-sans">
        {/* Onboarding Screens */}
        {currentScreen === 'onboarding-1' && <Onboarding1 />}
        {currentScreen === 'onboarding-2' && <Onboarding2 />}
        {currentScreen === 'onboarding-3' && <Onboarding3 />}

        {/* Auth Screens */}
        {currentScreen === 'register' && <RegisterScreen />}
        {currentScreen === 'login' && <LoginScreen />}

        {/* Payment Screens */}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'payment-success' && <PaymentSuccessScreen />}

        {/* Main Screens */}
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'modules' && <ModulesScreen />}
        {currentScreen === 'challenge' && <ChallengeScreen />}
        {currentScreen === 'achievements' && <AchievementsScreen />}
        {currentScreen === 'olympics' && <OlympicsScreen />}
        {currentScreen === 'parents' && <ParentsScreen />}
        {currentScreen === 'avatar' && <AvatarScreen />}

        {/* Module 1: New 7-level structure */}
        {currentScreen === 'module-main' && <ModuleMain />}
        {currentScreen === 'module-level-1' && <ModuleLevel1 />}
        {currentScreen === 'module-level-2' && <ModuleLevel2 />}
        {currentScreen === 'module-level-3' && <ModuleLevel3 />}
        {currentScreen === 'module-level-4' && <ModuleLevel4 />}
        {currentScreen === 'module-level-5' && <ModuleLevel5 />}
        {currentScreen === 'module-level-6' && <ModuleLevel6 />}
        {currentScreen === 'module-level-7' && <ModuleLevel7 />}

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
    </DndProvider>
  );
}
