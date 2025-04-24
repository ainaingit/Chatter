import Constants from "expo-constants"; // ✅ pas avec des { }
import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const extra = Constants?.expoConfig?.extra ?? {}; // ✅ Plus sûr que manifest

export const firebaseConfig = {
  apiKey: extra.apiKey,
  authDomain: extra.authDomain,
  projectId: extra.projectId,
  storageBucket: extra.storageBucket,
  messagingSenderId: extra.messagingSenderId,
  appId: extra.appId,
  databaseURL: extra.databaseURL,
  measurementId: extra.measurementId,
};

const app = initializeApp(firebaseConfig);

// Initialisation de l'auth sans persistance
const auth = initializeAuth(app);
export const db = getFirestore(app);
export { auth }; // Exporte auth
