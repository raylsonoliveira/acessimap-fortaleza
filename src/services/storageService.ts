import AsyncStorage from '@react-native-async-storage/async-storage';
import { PontoAcessibilidade, Ocorrencia } from '../types';
import { PONTOS_INICIAIS, OCORRENCIAS_INICIAIS } from '../data/mockData';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PONTOS: '@acessimap:pontos_v1',
  OCORRENCIAS: '@acessimap:ocorrencias_v1',
};

export const StorageService = {
  // ==========================================
  // CRUD 1: PONTOS DE ACESSIBILIDADE (RF16)
  // ==========================================
  async getPontos(): Promise<PontoAcessibilidade[]> {
    try {
      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'pontos'));
          if (!snapshot.empty) {
            const firestorePontos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PontoAcessibilidade));
            await AsyncStorage.setItem(STORAGE_KEYS.PONTOS, JSON.stringify(firestorePontos));
            return firestorePontos;
          }
        } catch (e) {
          console.warn('[Storage] Erro ao buscar do Firestore, fallback para AsyncStorage:', e);
        }
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEYS.PONTOS);
      if (raw) {
        return JSON.parse(raw);
      }

      // Inicializa com dados sementes de Fortaleza
      await AsyncStorage.setItem(STORAGE_KEYS.PONTOS, JSON.stringify(PONTOS_INICIAIS));
      return PONTOS_INICIAIS;
    } catch (error) {
      console.error('[Storage] Erro ao carregar pontos:', error);
      return PONTOS_INICIAIS;
    }
  },

  async savePonto(ponto: PontoAcessibilidade): Promise<void> {
    try {
      const pontos = await this.getPontos();
      const index = pontos.findIndex(p => p.id === ponto.id);
      let updated: PontoAcessibilidade[];

      if (index >= 0) {
        // Atualizar
        updated = [...pontos];
        updated[index] = ponto;
      } else {
        // Criar novo
        updated = [ponto, ...pontos];
      }

      await AsyncStorage.setItem(STORAGE_KEYS.PONTOS, JSON.stringify(updated));

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'pontos', ponto.id), ponto);
        } catch (e) {
          console.warn('[Firestore] Falha ao sincronizar ponto em nuvem:', e);
        }
      }
    } catch (error) {
      console.error('[Storage] Erro ao salvar ponto:', error);
      throw error;
    }
  },

  async deletePonto(id: string): Promise<void> {
    try {
      const pontos = await this.getPontos();
      const updated = pontos.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PONTOS, JSON.stringify(updated));

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, 'pontos', id));
        } catch (e) {
          console.warn('[Firestore] Falha ao excluir ponto da nuvem:', e);
        }
      }
    } catch (error) {
      console.error('[Storage] Erro ao excluir ponto:', error);
      throw error;
    }
  },

  // ==========================================
  // CRUD 2: OCORRÊNCIAS URBANAS (RF17)
  // ==========================================
  async getOcorrencias(): Promise<Ocorrencia[]> {
    try {
      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'ocorrencias'));
          if (!snapshot.empty) {
            const firestoreOcorrencias = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ocorrencia));
            await AsyncStorage.setItem(STORAGE_KEYS.OCORRENCIAS, JSON.stringify(firestoreOcorrencias));
            return firestoreOcorrencias;
          }
        } catch (e) {
          console.warn('[Storage] Erro ao buscar ocorrências do Firestore:', e);
        }
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEYS.OCORRENCIAS);
      if (raw) {
        return JSON.parse(raw);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.OCORRENCIAS, JSON.stringify(OCORRENCIAS_INICIAIS));
      return OCORRENCIAS_INICIAIS;
    } catch (error) {
      console.error('[Storage] Erro ao carregar ocorrências:', error);
      return OCORRENCIAS_INICIAIS;
    }
  },

  async saveOcorrencia(ocorrencia: Ocorrencia): Promise<void> {
    try {
      const ocorrencias = await this.getOcorrencias();
      const index = ocorrencias.findIndex(o => o.id === ocorrencia.id);
      let updated: Ocorrencia[];

      if (index >= 0) {
        updated = [...ocorrencias];
        updated[index] = ocorrencia;
      } else {
        updated = [ocorrencia, ...ocorrencias];
      }

      await AsyncStorage.setItem(STORAGE_KEYS.OCORRENCIAS, JSON.stringify(updated));

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'ocorrencias', ocorrencia.id), ocorrencia);
        } catch (e) {
          console.warn('[Firestore] Falha ao sincronizar ocorrência em nuvem:', e);
        }
      }
    } catch (error) {
      console.error('[Storage] Erro ao salvar ocorrência:', error);
      throw error;
    }
  },

  async deleteOcorrencia(id: string): Promise<void> {
    try {
      const ocorrencias = await this.getOcorrencias();
      const updated = ocorrencias.filter(o => o.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.OCORRENCIAS, JSON.stringify(updated));

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, 'ocorrencias', id));
        } catch (e) {
          console.warn('[Firestore] Falha ao deletar ocorrência da nuvem:', e);
        }
      }
    } catch (error) {
      console.error('[Storage] Erro ao excluir ocorrência:', error);
      throw error;
    }
  },
};
