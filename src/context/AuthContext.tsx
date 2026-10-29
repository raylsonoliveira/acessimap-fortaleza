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

interface RegisteredAccount extends Usuario {
  passwordHash: string;
}

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nome: string, email: string, telefone: string, pass: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Pick<Usuario, 'nome' | 'telefone' | 'handle'>>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_STORAGE_KEY = '@acessimap:auth_user_v2';
const ACCOUNTS_STORAGE_KEY = '@acessimap:registered_accounts_v2';

const DEFAULT_DEMO_ACCOUNT: RegisteredAccount = {
  id: 'raylson-2512902',
  nome: 'Raylson Soares de Oliveira',
  email: 'raylsonsoaresdeoliveira@gmail.com',
  telefone: '(85) 98888-7777',
  handle: '@raylson_unifor',
  passwordHash: '123456',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  async function getLocalAccounts(): Promise<RegisteredAccount[]> {
    try {
      const raw = await AsyncStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RegisteredAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const initial = [DEFAULT_DEMO_ACCOUNT];
      await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return [DEFAULT_DEMO_ACCOUNT];
    }
  }

  useEffect(() => {
    async function initializeAuthSession() {
      try {
        await getLocalAccounts();
        const storedSession = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedSession) {
          setUser(JSON.parse(storedSession));
        } else {
          // Inicia deslogado para apresentar a Tela 1 (Login) conforme fluxo do protótipo
          setUser(null);
        }
      } catch (e) {
        console.error('[Auth] Erro ao inicializar sessão:', e);
      } finally {
        setLoading(false);
      }
    }
    initializeAuthSession();
  }, []);

  async function login(email: string, pass: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !pass) {
      throw new Error('Preencha e-mail e senha.');
    }

    setLoading(true);
    try {
      // 1. Se o Firebase estiver configurado via .env, autentica estritamente no Firebase
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        const loggedUser: Usuario = {
          id: cred.user.uid,
          nome: cred.user.displayName || normalizedEmail.split('@')[0],
          email: cred.user.email || normalizedEmail,
          handle: `@${normalizedEmail.split('@')[0]}`,
        };
        setUser(loggedUser);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
        return;
      }

      // 2. Autenticação local com verificação real de credenciais cadastradas
      const accounts = await getLocalAccounts();
      const matched = accounts.find(
        acc =>
          acc.email.toLowerCase() === normalizedEmail ||
          acc.handle.toLowerCase() === normalizedEmail ||
          acc.handle.toLowerCase() === `@${normalizedEmail}`
      );

      if (!matched || matched.passwordHash !== pass) {
        throw new Error('E-mail ou senha incorretos. Verifique suas credenciais ou crie uma conta.');
      }

      const { passwordHash: _, ...safeUser } = matched;
      setUser(safeUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
    } finally {
      setLoading(false);
    }
  }

  async function register(nome: string, email: string, telefone: string, pass: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!nome.trim() || !normalizedEmail || !pass) {
      throw new Error('Preencha nome, e-mail e senha.');
    }
    if (pass.length < 6) {
      throw new Error('A senha deve possuir pelo menos 6 caracteres.');
    }

    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
        await updateProfile(cred.user, { displayName: nome.trim() });
        const newUser: Usuario = {
          id: cred.user.uid,
          nome: nome.trim(),
          email: normalizedEmail,
          telefone: telefone.trim(),
          handle: `@${normalizedEmail.split('@')[0]}`,
        };
        setUser(newUser);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        return;
      }

      const accounts = await getLocalAccounts();
      const exists = accounts.some(acc => acc.email.toLowerCase() === normalizedEmail);
      if (exists) {
        throw new Error('Já existe uma conta cadastrada com este e-mail.');
      }

      const newAccount: RegisteredAccount = {
        id: 'usr-' + Date.now(),
        nome: nome.trim(),
        email: normalizedEmail,
        telefone: telefone.trim(),
        handle: `@${nome.trim().toLowerCase().replace(/\s+/g, '_')}`,
        passwordHash: pass,
      };

      const updatedAccounts = [...accounts, newAccount];
      await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));

      const { passwordHash: _, ...safeUser } = newAccount;
      setUser(safeUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
    } finally {
      setLoading(false);
    }
  }

  async function updateUserProfile(updates: Partial<Pick<Usuario, 'nome' | 'telefone' | 'handle'>>) {
    if (!user) return;

    const updatedUser: Usuario = {
      ...user,
      nome: updates.nome !== undefined ? updates.nome.trim() : user.nome,
      telefone: updates.telefone !== undefined ? updates.telefone.trim() : user.telefone,
      handle: updates.handle !== undefined
        ? (updates.handle.startsWith('@') ? updates.handle.trim() : `@${updates.handle.trim()}`)
        : user.handle,
    };

    if (isFirebaseConfigured && auth?.currentUser && updates.nome) {
      try {
        await updateProfile(auth.currentUser, { displayName: updatedUser.nome });
      } catch (e) {
        console.warn('[Firebase Profile] Falha ao atualizar displayName online:', e);
      }
    }

    const accounts = await getLocalAccounts();
    const updatedAccounts = accounts.map(acc =>
      acc.id === user.id || acc.email.toLowerCase() === user.email.toLowerCase()
        ? { ...acc, ...updatedUser }
        : acc
    );
    await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
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
    <AuthContext.Provider value={{ user, loading, login, register, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
