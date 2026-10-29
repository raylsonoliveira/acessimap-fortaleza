export type CategoriaPonto = 'rampa' | 'calcada' | 'acesso' | 'predio' | 'outro';

export type StatusAcessibilidade = 'acessivel' | 'parcial' | 'inacessivel';

export type TipoOcorrencia = 'rampa' | 'calcada' | 'predio' | 'outro';

export type StatusOcorrencia = 'pendente' | 'em_analise' | 'resolvido';

export interface PontoAcessibilidade {
  id: string;
  titulo: string;
  categoria: CategoriaPonto;
  endereco: string;
  latitude: number;
  longitude: number;
  estado: StatusAcessibilidade;
  nota: number; // 1 a 5
  comentario: string;
  fotoUrl?: string;
  recursos: string[]; // ex: ['Piso Tátil', 'Rampa Suave', 'Corrimão']
  avaliacoesCount: number;
  criadoPor: string;
  criadoPorId?: string;
  criadoEm: string;
}

export interface Ocorrencia {
  id: string;
  tipo: TipoOcorrencia;
  descricao: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
  status: StatusOcorrencia;
  criadoPor: string;
  criadoPorId?: string;
  criadoEm: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  handle: string;
}

export interface RotaSeguraInfo {
  id: string;
  origem: string;
  destino: string;
  distanciaKm: string;
  tempoMin: string;
  rampas: number;
  calcadasAdaptadas: number;
  semObstaculos: number;
}

export interface MensagemChat {
  id: string;
  remetente: 'usuario' | 'ia';
  texto: string;
  horario: string;
}

export interface SugestaoIA {
  resumo: string;
  categoriaSugerida: CategoriaPonto | TipoOcorrencia;
  classificacaoSugerida: StatusAcessibilidade;
  gravidade: 'Baixa' | 'Média' | 'Alta';
  recomendacao: string;
  origem?: 'gemini_api' | 'heuristica_local';
}
