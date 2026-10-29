import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'MOCK_API_KEY_ACESSIMAP',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'acessimap-fortaleza.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'acessimap-fortaleza',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'acessimap-fortaleza.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

export const isFirebaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY !== 'MOCK_API_KEY_ACESSIMAP'
);

let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    try {
      const authModule = FirebaseAuth as unknown as {
        getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
      };
      if (typeof authModule.getReactNativePersistence === 'function') {
        auth = initializeAuth(app, {
          persistence: authModule.getReactNativePersistence(AsyncStorage),
        });
      } else {
        auth = getAuth(app);
      }
    } catch {
      auth = getAuth(app);
    }
  }

  db = getFirestore(app);
} catch (error) {
  console.warn('[Firebase] Inicializado em modo local resiliente.', error);
}

export { app, auth, db };
