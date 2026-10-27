import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types';
import { auth, isFirebaseConfigured } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nome: string, email: string, telefone: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_STORAGE_KEY = '@acessimap:auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredUser() {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Usuário padrão acadêmico inicial
          const defaultUser: Usuario = {
            id: 'raylson-2512902',
            nome: 'Raylson Soares de Oliveira',
            email: 'raylsonsoaresdeoliveira@gmail.com',
            telefone: '(85) 98888-7777',
            handle: '@raylson_unifor',
          };
          setUser(defaultUser);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
        }
      } catch (e) {
        console.error('[Auth] Erro ao carregar usuário salvo:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStoredUser();
  }, []);

  async function login(email: string, pass: string) {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          const loggedUser: Usuario = {
            id: cred.user.uid,
            nome: cred.user.displayName || email.split('@')[0],
            email: cred.user.email || email,
            handle: `@${email.split('@')[0]}`,
          };
          setUser(loggedUser);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
          return;
        } catch (firebaseErr) {
          console.warn('[Firebase Auth] Erro online, autenticando localmente:', firebaseErr);
        }
      }

      // Login local / resiliente
      const localUser: Usuario = {
        id: 'usr-' + Date.now(),
        nome: email.split('@')[0],
        email,
        handle: `@${email.split('@')[0]}`,
      };
      setUser(localUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
    } finally {
      setLoading(false);
    }
  }

  async function register(nome: string, email: string, telefone: string, pass: string) {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          await updateProfile(cred.user, { displayName: nome });
          const newUser: Usuario = {
            id: cred.user.uid,
            nome,
            email,
            telefone,
            handle: `@${email.split('@')[0]}`,
          };
          setUser(newUser);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
          return;
        } catch (firebaseErr) {
          console.warn('[Firebase Register] Erro online, registrando localmente:', firebaseErr);
        }
      }

      // Registro local
      const newUser: Usuario = {
        id: 'usr-' + Date.now(),
        nome,
        email,
        telefone,
        handle: `@${nome.toLowerCase().replace(/\s+/g, '')}`,
      };
      setUser(newUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (e) {
      console.error('[Auth] Erro ao deslogar:', e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
