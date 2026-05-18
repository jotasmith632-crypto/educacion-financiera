
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { guardarUsuario } from "../../db";
import { toast } from "sonner";

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    throw error.message;
  }
};

export const registerWithEmail = async (email: string, password: string, name: string, extraData: any = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardar en Firestore con los datos demográficos (Colegio, Grado, Distrito)
    const isTest = localStorage.getItem('isTestMode') === 'true';
    await guardarUsuario(user.uid, name, email, isTest, extraData);
    
    return user;
  } catch (error: any) {
    toast.error("Error al crear la cuenta. Intenta con otro correo.");
    throw error.message;
  }
};

export const loginWithGoogle = async () => {
  try {
    // Forzamos la selección de cuenta para evitar que use una sesión previa automáticamente
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Guardar/Actualizar en Firestore
    const isTest = localStorage.getItem('isTestMode') === 'true';
    await guardarUsuario(user.uid, user.displayName || 'Usuario Google', user.email || '', isTest);
    
    return user;
  } catch (error: any) {
    console.error("Error detallado de Google Auth:", error);
    // Si el error es que se cerró la ventana manualmente, no lanzamos error crítico
    if (error.code === 'auth/popup-closed-by-user') {
      toast.info("El proceso fue cancelado.");
      throw "El proceso fue cancelado.";
    }
    toast.error("Error al conectar con Google.");
    throw error.message || "Error al conectar con Google.";
  }
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
