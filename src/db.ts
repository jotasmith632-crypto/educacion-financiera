import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { toast } from "sonner";

// 1. Guarda al usuario en la base de datos cuando se registra
export const guardarUsuario = async (uid: string, nombre: string, email: string, extraData: any = {}) => {
  try {
    const userRef = doc(db, "usuarios", uid);
    
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // El usuario es nuevo, creamos toda la estructura inicial
      const { school, grade, district } = extraData || {};
      
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
        school: typeof school === 'string' ? school.trim() : "",
        grade: typeof grade === 'string' ? grade.trim() : "",
        district: typeof district === 'string' ? district.trim() : ""
      };

      await setDoc(userRef, userData);
      console.log("Nuevo usuario guardado correctamente en Producción");
    } else {
      // El usuario ya existe (ej. login recurrente con Google), solo actualizamos lastLogin y name
      const updateData: any = {
        name: nombre,
        lastLogin: new Date().toISOString()
      };
      
      await setDoc(userRef, updateData, { merge: true });
      console.log("Usuario existente actualizado en Producción (Login)");
    }
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    toast.error("Error al guardar tus datos. Revisa tu conexión.");
  }
};

// 2. Guarda el puntaje cada vez que terminan un juego/módulo (Para la tesis)
export const guardarResultadoJuego = async (userId: string, moduleId: string, score: number) => {
  try {
    const resultadosRef = collection(db, "resultados");
    
    const resultData: any = {
      userId: userId,
      moduleId: moduleId,
      score: score,
      timestamp: new Date().toISOString()
    };

    await addDoc(resultadosRef, resultData);
    console.log("Resultado del juego guardado con éxito en Producción");
  } catch (error) {
    console.error("Error al guardar el resultado:", error);
    toast.error("No se pudo guardar tu puntaje. Intenta de nuevo.");
  }
};

// 3. Lee los datos del usuario para mostrarlos en pantalla
export const obtenerDatosUsuario = async (uid: string) => {
  try {
    const userRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No se encontraron datos de este usuario en Producción");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    toast.error("Error al cargar tu perfil.");
    return null;
  }
};

// 4. Actualiza el progreso global del usuario (puntos, niveles, avatar, etc.)
export const actualizarDatosUsuario = async (uid: string, datos: any) => {
  try {
    const userRef = doc(db, "usuarios", uid);
    
    // Evitar actualización directa de campos confidenciales y sanitizar los campos permitidos (Mass Assignment Protection)
    const allowedKeys = ['avatar', 'metaFinanciera', 'points', 'completedLevels', 'streak'];
    const updates: any = {};
    for (const key of allowedKeys) {
      if (datos[key] !== undefined) {
        updates[key] = datos[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, updates, { merge: true });
      console.log("Datos del usuario actualizados correctamente en Producción");
    }
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    toast.error("Error al actualizar tu progreso.");
  }
};
