import React, { createContext, useContext, useState, useEffect } from 'react';
import { PontoAcessibilidade, Ocorrencia, MensagemChat, CategoriaPonto } from '../types';
import { StorageService } from '../services/storageService';

interface DataContextData {
  pontos: PontoAcessibilidade[];
  ocorrencias: Ocorrencia[];
  filtroCategoria: 'todos' | CategoriaPonto;
  setFiltroCategoria: (filtro: 'todos' | CategoriaPonto) => void;
  pontosFiltrados: PontoAcessibilidade[];
  pontoSelecionado: PontoAcessibilidade | null;
  setPontoSelecionado: (p: PontoAcessibilidade | null) => void;
  
  // CRUD 1: Pontos
  adicionarPonto: (ponto: Omit<PontoAcessibilidade, 'id' | 'avaliacoesCount' | 'criadoEm'>) => Promise<void>;
  editarPonto: (ponto: PontoAcessibilidade) => Promise<void>;
  excluirPonto: (id: string) => Promise<void>;

  // CRUD 2: Ocorrências
  adicionarOcorrencia: (oco: Omit<Ocorrencia, 'id' | 'criadoEm'>) => Promise<void>;
  editarOcorrencia: (oco: Ocorrencia) => Promise<void>;
  excluirOcorrencia: (id: string) => Promise<void>;

  // Chat com IA
  mensagensChat: MensagemChat[];
  adicionarMensagemChat: (msg: MensagemChat) => void;
  carregandoDados: boolean;
  recarregarDados: () => Promise<void>;
}

const DataContext = createContext<DataContextData>({} as DataContextData);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pontos, setPontos] = useState<PontoAcessibilidade[]>([]);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<'todos' | CategoriaPonto>('todos');
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoAcessibilidade | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [mensagensChat, setMensagensChat] = useState<MensagemChat[]>([
    {
      id: 'msg-init-1',
      remetente: 'ia',
      texto: 'Olá! Sou o Assistente Inteligente do AcessiMap Fortaleza. Posso esclarecer dúvidas sobre a NBR 9050, sugerir rotas seguras e analisar fotos de acessibilidade.',
      horario: 'Agora',
    },
  ]);

  async function carregarDados() {
    setCarregandoDados(true);
    try {
      const [pts, ocs] = await Promise.all([
        StorageService.getPontos(),
        StorageService.getOcorrencias(),
      ]);
      setPontos(pts);
      setOcorrencias(ocs);
      if (pts.length > 0 && !pontoSelecionado) {
        setPontoSelecionado(pts[0]);
      }
    } catch (e) {
      console.error('[DataContext] Erro ao carregar dados:', e);
    } finally {
      setCarregandoDados(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const pontosFiltrados = pontos.filter(p => {
    if (filtroCategoria === 'todos') return true;
    return p.categoria === filtroCategoria;
  });

  // Operações de CRUD 1: Pontos
  async function adicionarPonto(novo: Omit<PontoAcessibilidade, 'id' | 'avaliacoesCount' | 'criadoEm'>) {
    const pontoCompleto: PontoAcessibilidade = {
      ...novo,
      id: 'ponto-' + Date.now(),
      avaliacoesCount: 1,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    await StorageService.savePonto(pontoCompleto);
    setPontos(prev => [pontoCompleto, ...prev]);
  }

  async function editarPonto(ponto: PontoAcessibilidade) {
    await StorageService.savePonto(ponto);
    setPontos(prev => prev.map(p => (p.id === ponto.id ? ponto : p)));
    if (pontoSelecionado?.id === ponto.id) {
      setPontoSelecionado(ponto);
    }
  }

  async function excluirPonto(id: string) {
    await StorageService.deletePonto(id);
    setPontos(prev => prev.filter(p => p.id !== id));
    if (pontoSelecionado?.id === id) {
      setPontoSelecionado(null);
    }
  }

  // Operações de CRUD 2: Ocorrências
  async function adicionarOcorrencia(novo: Omit<Ocorrencia, 'id' | 'criadoEm'>) {
    const ocoCompleta: Ocorrencia = {
      ...novo,
      id: 'oco-' + Date.now(),
      criadoEm: new Date().toISOString().split('T')[0],
    };
    await StorageService.saveOcorrencia(ocoCompleta);
    setOcorrencias(prev => [ocoCompleta, ...prev]);
  }

  async function editarOcorrencia(oco: Ocorrencia) {
    await StorageService.saveOcorrencia(oco);
    setOcorrencias(prev => prev.map(o => (o.id === oco.id ? oco : o)));
  }

  async function excluirOcorrencia(id: string) {
    await StorageService.deleteOcorrencia(id);
    setOcorrencias(prev => prev.filter(o => o.id !== id));
  }

  function adicionarMensagemChat(msg: MensagemChat) {
    setMensagensChat(prev => [...prev, msg]);
  }

  return (
    <DataContext.Provider
      value={{
        pontos,
        ocorrencias,
        filtroCategoria,
        setFiltroCategoria,
        pontosFiltrados,
        pontoSelecionado,
        setPontoSelecionado,
        adicionarPonto,
        editarPonto,
        excluirPonto,
        adicionarOcorrencia,
        editarOcorrencia,
        excluirOcorrencia,
        mensagensChat,
        adicionarMensagemChat,
        carregandoDados,
        recarregarDados: carregarDados,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
