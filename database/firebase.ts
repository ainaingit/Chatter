// firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ta config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIG0oOq4LIPLlNXsVLfmQaWP-zpTPYtaM",
  authDomain: "chatter-95bca.firebaseapp.com",
  projectId: "chatter-95bca",
  storageBucket: "chatter-95bca.appspot.com",
  messagingSenderId: "185988679775",
  appId: "1:185988679775:web:43f1d8fae18d0dcf0c33ea",
  measurementId: "G-CEG2KTV63C"
};

// 1. Initialisation de l'app (uniquement si elle n'existe pas déjà)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialisation de l'auth avec persistance (une seule fois)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e: any) {
  if (e.code === 'auth/already-initialized' || /already-initialized/.test(e.message)) {
    // Si déjà initialisé, on récupère l'instance existante
    auth = getAuth(app);
  } else {
    throw e;
  }
}

// 3. Initialisation de Firestore
const db = getFirestore(app);

// 4. Export
export { auth, db };
