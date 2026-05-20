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
    console.error("Auth Login Error Code:", error.code);
    toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    throw new Error("El correo electrónico o la contraseña son incorrectos.");
  }
};

export const registerWithEmail = async (email: string, password: string, name: string, extraData: any = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardar en Firestore con los datos demográficos (Colegio, Grado, Distrito) en Producción
    await guardarUsuario(user.uid, name, email, extraData);
    
    return user;
  } catch (error: any) {
    console.error("Auth Register Error Code:", error.code);
    toast.error("Error al crear la cuenta. Intenta con otro correo.");
    throw new Error("Error al crear la cuenta. Intenta con otro correo.");
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
    
    // Guardar/Actualizar en Firestore (Producción)
    await guardarUsuario(user.uid, user.displayName || 'Usuario Google', user.email || '');
    
    return user;
  } catch (error: any) {
    console.error("Error detallado de Google Auth:", error);
    // Si el error es que se cerró la ventana manualmente, no lanzamos error crítico
    if (error.code === 'auth/popup-closed-by-user') {
      toast.info("El proceso fue cancelado.");
      throw "El proceso fue cancelado.";
    }
    toast.error("Error al conectar con Google.");
    throw new Error("Error al conectar con Google.");
  }
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
