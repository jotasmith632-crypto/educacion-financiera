import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOeY_k-WI1mk9IsQ2-Rgj826DEI8uQtgg",
  authDomain: "educacion-financiera-57847.firebaseapp.com",
  projectId: "educacion-financiera-57847",
  storageBucket: "educacion-financiera-57847.firebasestorage.app",
  messagingSenderId: "198547967619",
  appId: "1:198547967619:web:5800ac7e4f4f0d0cf8d5b6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

import { getFirestore } from 'firebase/firestore';

const db = getFirestore(app);

export { auth, provider, db };