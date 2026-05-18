import { doc, setDoc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { toast } from "sonner";

// Función auxiliar para obtener la próxima medianoche (TTL)
const getNextMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Establece a las 00:00:00 del día siguiente
  return Timestamp.fromDate(midnight);
};

// 1. Guarda al usuario en la base de datos cuando se registra
export const guardarUsuario = async (uid: string, nombre: string, email: string, isTest: boolean = false, extraData: any = {}) => {
  try {
    const collectionName = isTest ? "test_usuarios" : "usuarios";
    const userRef = doc(db, collectionName, uid);
    
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // El usuario es nuevo, creamos toda la estructura inicial
      const userData: any = {
        name: nombre,
        email: email,
        fecha_registro: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        points: 0,
        level: 0,
        completedLevels: [],
        metaFinanciera: "",
        unlockedModules: ['ahorro-inversion'],
        ...extraData
      };

      if (isTest) {
        userData.expireAt = getNextMidnight();
        userData.isTest = true;
      }

      await setDoc(userRef, userData);
      console.log(`${isTest ? "[TEST] " : ""}Nuevo usuario guardado correctamente`);
    } else {
      // El usuario ya existe (ej. login recurrente con Google), solo actualizamos lastLogin y protegemos los puntos
      const updateData: any = {
        name: nombre,
        lastLogin: new Date().toISOString(),
        ...extraData
      };
      
      if (isTest) {
        updateData.expireAt = getNextMidnight();
      }
      
      await setDoc(userRef, updateData, { merge: true });
      console.log(`${isTest ? "[TEST] " : ""}Usuario existente actualizado (Login)`);
    }
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    toast.error("Error al guardar tus datos. Revisa tu conexión.");
  }
};

// 2. Guarda el puntaje cada vez que terminan un juego/módulo (Para la tesis)
export const guardarResultadoJuego = async (userId: string, moduleId: string, score: number, isTest: boolean = false) => {
  try {
    const collectionName = isTest ? "test_resultados" : "resultados";
    const resultadosRef = collection(db, collectionName);
    
    const resultData: any = {
      userId: userId,
      moduleId: moduleId,
      score: score,
      timestamp: new Date().toISOString()
    };

    if (isTest) {
      resultData.expireAt = getNextMidnight();
    }

    await addDoc(resultadosRef, resultData);
    console.log(`${isTest ? "[TEST] " : ""}Resultado del juego guardado con éxito`);
  } catch (error) {
    console.error("Error al guardar el resultado:", error);
    toast.error("No se pudo guardar tu puntaje. Intenta de nuevo.");
  }
};

// 3. Lee los datos del usuario para mostrarlos en pantalla
export const obtenerDatosUsuario = async (uid: string, isTest: boolean = false) => {
  try {
    const collectionName = isTest ? "test_usuarios" : "usuarios";
    const userRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No se encontraron datos de este usuario en ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    toast.error("Error al cargar tu perfil.");
    return null;
  }
};

// 4. Actualiza el progreso global del usuario (puntos, niveles, avatar, etc.)
export const actualizarDatosUsuario = async (uid: string, datos: any, isTest: boolean = false) => {
  try {
    const collectionName = isTest ? "test_usuarios" : "usuarios";
    const userRef = doc(db, collectionName, uid);
    
    const updates = { ...datos };
    if (isTest) {
      updates.expireAt = getNextMidnight();
    }

    await setDoc(userRef, updates, { merge: true });
    console.log(`${isTest ? "[TEST] " : ""}Datos del usuario actualizados correctamente`);
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    toast.error("Error al actualizar tu progreso.");
  }
};
