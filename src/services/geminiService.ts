import { GEMINI_CONFIG, hasGeminiApiKey } from '../config/gemini';
import { SugestaoIA, CategoriaPonto, StatusAcessibilidade } from '../types';

export const GeminiService = {
  /**
   * RF19: Analisa relato/foto e sugere categoria, classificação e gravidade
   */
  async analisarRelato(relato: string): Promise<SugestaoIA> {
    if (hasGeminiApiKey) {
      try {
        const prompt = `
Você é um especialista em acessibilidade urbana e normas NBR 9050 para o aplicativo AcessiMap Fortaleza.
Analise a seguinte descrição de um ponto ou problema de acessibilidade:
"${relato}"

Responda ESTRITAMENTE em formato JSON com os campos:
{
  "resumo": "Breve síntese técnica da situação em até 1 frase",
  "categoriaSugerida": "rampa" | "calcada" | "acesso" | "predio" | "outro",
  "classificacaoSugerida": "acessivel" | "parcial" | "inacessivel",
  "gravidade": "Baixa" | "Média" | "Alta",
  "recomendacao": "Recomendação prática de adequação segundo a NBR 9050"
}
`;
        const response = await fetch(`${GEMINI_CONFIG.endpoint}?key=${GEMINI_CONFIG.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            return JSON.parse(rawText) as SugestaoIA;
          }
        }
      } catch (e) {
        console.warn('[Gemini API] Falha na chamada online, utilizando motor heurístico:', e);
      }
    }

    // Motor Heurístico Resiliente (Garante funcionamento offline / acadêmico)
    return this.classificacaoHeuristica(relato);
  },

  /**
   * Resposta do Chat Assistente Virtual de Acessibilidade ("Visualizar chat")
   */
  async responderChat(mensagem: string): Promise<string> {
    if (hasGeminiApiKey) {
      try {
        const prompt = `
Você é o Assistente Virtual do AcessiMap Fortaleza, um aplicativo colaborativo para monitoramento de acessibilidade urbana em Fortaleza - CE.
Você ajuda pedestres com deficiência motora ou visual, idosos, gestantes e pessoas com mobilidade reduzida.
Conhece leis brasileiras (Lei 13.146/2015 - LBI, NBR 9050) e os bairros e pontos turísticos de Fortaleza (Beira-Mar, Centro, Aldeota, Benfica, UNIFOR, Dragão do Mar).
Responda de forma empática, prestativa e objetiva em português.

Usuário: "${mensagem}"
`;
        const response = await fetch(`${GEMINI_CONFIG.endpoint}?key=${GEMINI_CONFIG.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const resposta = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resposta) return resposta.trim();
        }
      } catch (err) {
        console.warn('[Gemini Chat] Erro online, respondendo localmente:', err);
      }
    }

    // Respostas inteligentes baseadas em intenção para Fortaleza
    const lower = mensagem.toLowerCase();
    if (lower.includes('praia') || lower.includes('beira-mar') || lower.includes('beira mar')) {
      return 'O calçadão da Beira-Mar possui ótimas condições de acessibilidade com piso plano e o projeto "Praia Acessível", com esteiras especiais e cadeiras anfíbias para banho de mar assistido.';
    }
    if (lower.includes('unifor') || lower.includes('universidade')) {
      return 'O campus da UNIFOR no Edson Queiroz conta com ampla infraestrutura acessível: rampas padronizadas, elevadores nos blocos acadêmicos, piso tátil direcional e vagas especiais próximas às entradas.';
    }
    if (lower.includes('lei') || lower.includes('norma') || lower.includes('nbr') || lower.includes('9050')) {
      return 'A NBR 9050 da ABNT define critérios de inclinação máxima de rampas (ideal de até 8,33%), largura mínima de 1,20m para passeios e piso tátil de alerta e direcional para pessoas com deficiência visual.';
    }
    if (lower.includes('rota') || lower.includes('caminho') || lower.includes('segura')) {
      return 'No AcessiMap Fortaleza você pode consultar "Rotas Seguras" na aba inferior. O sistema calcula trajetos priorizando ruas com calçadas rebaixadas, rampas suaves e sem obstáculos cadastrados.';
    }
    return `Olá! Sou o Assistente de Acessibilidade de Fortaleza. Posso ajudar você a encontrar rotas acessíveis, verificar normas como a NBR 9050 ou analisar problemas em calçadas e rampas da cidade!`;
  },

  classificacaoHeuristica(relato: string): SugestaoIA {
    const texto = relato.toLowerCase();

    let categoria: CategoriaPonto = 'calcada';
    let estado: StatusAcessibilidade = 'parcial';
    let gravidade: 'Baixa' | 'Média' | 'Alta' = 'Média';
    let resumo = 'Registro de infraestrutura urbana analisado por IA.';
    let recomendacao = 'Verificar conformidade com a NBR 9050 e realizar manutenção no trecho.';

    if (texto.includes('rampa')) {
      categoria = 'rampa';
      if (texto.includes('quebrada') || texto.includes('danificada') || texto.includes('sem rampa') || texto.includes('alta') || texto.includes('íngreme')) {
        estado = 'inacessivel';
        gravidade = 'Alta';
        resumo = 'Problema grave em rampa de acesso, inviabilizando circulação segura de cadeirantes.';
        recomendacao = 'Adequar a inclinação da rampa para no máximo 8,33% e instalar guia de balizamento.';
      } else {
        estado = 'acessivel';
        gravidade = 'Baixa';
        resumo = 'Rampa de acesso em boas condições aparentes.';
        recomendacao = 'Garantir sinalização visual e piso tátil de alerta no início e fim do desnível.';
      }
    } else if (texto.includes('buraco') || texto.includes('obstruíd') || texto.includes('entulho') || texto.includes('poste')) {
      categoria = 'calcada';
      estado = 'inacessivel';
      gravidade = 'Alta';
      resumo = 'Obstáculo físico ou calçada esburacada impedindo passagem contínua.';
      recomendacao = 'Remover barreiras e reconstituir pavimento contínuo e antiderrapante.';
    } else if (texto.includes('elevador') || texto.includes('entrada') || texto.includes('porta') || texto.includes('degrau')) {
      categoria = 'acesso';
      if (texto.includes('degrau') || texto.includes('inacess')) {
        estado = 'inacessivel';
        gravidade = 'Alta';
        resumo = 'Barreira arquitetônica na entrada do edifício para pessoas com mobilidade reduzida.';
        recomendacao = 'Construir rampa de acesso com corrimão duplo ou plataforma elevatória.';
      } else {
        estado = 'acessivel';
        gravidade = 'Baixa';
        resumo = 'Acesso ao edifício com recursos de acessibilidade disponíveis.';
        recomendacao = 'Manter portas com largura mínima de 80cm e maçanetas tipo alavanca.';
      }
    }

    return {
      resumo,
      categoriaSugerida: categoria,
      classificacaoSugerida: estado,
      gravidade,
      recomendacao,
    };
  },
};
