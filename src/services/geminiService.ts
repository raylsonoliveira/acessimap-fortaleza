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
            const parsed = JSON.parse(rawText) as SugestaoIA;
            return { ...parsed, origem: 'gemini_api' };
          }
        }
      } catch (e) {
        console.warn('[Gemini API] Falha na chamada online, utilizando motor heurístico NBR 9050:', e);
      }
    }

    // Motor Heurístico Resiliente (Garante funcionamento sem chave de API configurada)
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

    // Respostas inteligentes baseadas em intenção para Fortaleza (modo local sem API key)
    const lower = mensagem.toLowerCase();
    if (lower.includes('praia') || lower.includes('beira-mar') || lower.includes('beira mar')) {
      return 'O calçadão da Beira-Mar (Meireles) possui piso plano contínuo, faixas rebaixadas e o projeto "Praia Acessível" próximo ao Posto 4, com esteiras especiais e cadeiras anfíbias para banho de mar assistido.';
    }
    if (lower.includes('unifor') || lower.includes('universidade')) {
      return 'O campus da UNIFOR no bairro Edson Queiroz conta com ampla infraestrutura acessível: rampas padronizadas segundo a NBR 9050, elevadores nos blocos, piso tátil direcional contínuo e vagas exclusivas.';
    }
    if (lower.includes('lei') || lower.includes('norma') || lower.includes('nbr') || lower.includes('9050')) {
      return 'A NBR 9050 da ABNT e a Lei Brasileira de Inclusão (Lei 13.146/2015) estabelecem inclinação máxima de 8,33% para rampas, faixa livre mínima de 1,20m nas calçadas e piso tátil direcional e de alerta.';
    }
    if (lower.includes('rota') || lower.includes('caminho') || lower.includes('segura') || lower.includes('trajeto')) {
      return 'Na aba "Rotas" você pode selecionar qualquer ponto de partida e destino em Fortaleza para calcular a distância, o tempo estimado e verificar quantas rampas, calçadas adaptadas e ocorrências existem no trajeto.';
    }
    if (lower.includes('reportar') || lower.includes('problema') || lower.includes('calçada') || lower.includes('buraco')) {
      return 'Para reportar uma barreira urbana (calçada quebrada, rampa danificada ou prédio sem acesso), acesse a aba "Reportar" (+), escolha o tipo de problema, anexe uma foto e envie. Você pode editar ou resolver seus reportes depois na aba "Perfil".';
    }
    return 'Olá! Sou o Assistente de Acessibilidade de Fortaleza (modo local NBR 9050). Posso tirar dúvidas sobre a NBR 9050, acessibilidade na Beira-Mar e UNIFOR, cálculo de rotas seguras ou como cadastrar e editar pontos no mapa!';
  },

  classificacaoHeuristica(relato: string): SugestaoIA {
    const texto = relato.toLowerCase();

    let categoria: CategoriaPonto = 'calcada';
    let estado: StatusAcessibilidade = 'parcial';
    let gravidade: 'Baixa' | 'Média' | 'Alta' = 'Média';
    let resumo = 'Registro de infraestrutura urbana analisado segundo critérios da NBR 9050.';
    let recomendacao = 'Verificar largura mínima de 1,20m de faixa livre e regularidade do piso conforme NBR 9050.';

    if (texto.includes('rampa') || texto.includes('guia') || texto.includes('rebaixo')) {
      categoria = 'rampa';
      if (
        texto.includes('quebrada') ||
        texto.includes('danificada') ||
        texto.includes('sem rampa') ||
        texto.includes('alta') ||
        texto.includes('íngreme') ||
        texto.includes('inclinada') ||
        texto.includes('bloqueada')
      ) {
        estado = 'inacessivel';
        gravidade = 'Alta';
        resumo = 'Problema crítico em rampa de acesso, inviabilizando a circulação segura de cadeirantes.';
        recomendacao = 'Adequar a inclinação longitudinal da rampa para no máximo 8,33% e instalar piso tátil de alerta.';
      } else if (texto.includes('parcial') || texto.includes('desgastada') || texto.includes('sem corrimão')) {
        estado = 'parcial';
        gravidade = 'Média';
        resumo = 'Rampa existente porém com pendências de conservação ou sinalização.';
        recomendacao = 'Instalar corrimão em duas alturas (0,70m e 0,92m) e piso tátil de alerta.';
      } else {
        estado = 'acessivel';
        gravidade = 'Baixa';
        resumo = 'Rampa de acesso em boas condições de uso e inclinação adequada.';
        recomendacao = 'Manter conservação periódica e sinalização visual/tátil no início e término da rampa.';
      }
    } else if (
      texto.includes('buraco') ||
      texto.includes('obstruíd') ||
      texto.includes('entulho') ||
      texto.includes('poste') ||
      texto.includes('quebrad') ||
      texto.includes('irregular') ||
      texto.includes('desnível')
    ) {
      categoria = 'calcada';
      estado = 'inacessivel';
      gravidade = 'Alta';
      resumo = 'Barreira física ou pavimento danificado na calçada impedindo a passagem contínua.';
      recomendacao = 'Desobstruir a faixa livre de circulação (mínimo 1,20m) e recompor o piso regular e antiderrapante.';
    } else if (
      texto.includes('prédio') ||
      texto.includes('órgão') ||
      texto.includes('hospital') ||
      texto.includes('escola') ||
      texto.includes('museu') ||
      texto.includes('banco')
    ) {
      categoria = 'predio';
      if (texto.includes('escada') || texto.includes('inacess') || texto.includes('desligado') || texto.includes('sem ')) {
        estado = 'inacessivel';
        gravidade = 'Alta';
        resumo = 'Edificação pública/privada com barreira arquitetônica que impede o acesso autônomo.';
        recomendacao = 'Garantir rota acessível desde o passeio até o interior, com rampa ou plataforma elevatória e sanitário adaptado.';
      } else {
        estado = 'acessivel';
        gravidade = 'Baixa';
        resumo = 'Edificação com infraestrutura de acessibilidade relatada como funcional.';
        recomendacao = 'Manter sinalização internacional de acesso (SIA) e rotas internas livres de obstáculos.';
      }
    } else if (texto.includes('elevador') || texto.includes('entrada') || texto.includes('porta') || texto.includes('degrau')) {
      categoria = 'acesso';
      if (texto.includes('degrau') || texto.includes('inacess') || texto.includes('estreita')) {
        estado = 'inacessivel';
        gravidade = 'Alta';
        resumo = 'Barreira arquitetônica na entrada do local para pessoas com mobilidade reduzida.';
        recomendacao = 'Vencer o desnível com rampa suave ou plataforma elevatória e garantir vão livre mínimo de 0,80m nas portas.';
      } else {
        estado = 'acessivel';
        gravidade = 'Baixa';
        resumo = 'Acesso nivelado e adaptado com recursos de acessibilidade disponíveis.';
        recomendacao = 'Preservar piso tátil direcional até a recepção e portas com maçaneta tipo alavanca.';
      }
    } else if (texto.includes('piso tátil') || texto.includes('adaptad') || texto.includes('acessível') || texto.includes('amplo')) {
      categoria = 'calcada';
      estado = 'acessivel';
      gravidade = 'Baixa';
      resumo = 'Trecho urbano acessível com condições favoráveis para deslocamento autônomo.';
      recomendacao = 'Preservar a manutenção do piso tátil e a ausência de obstáculos aéreos ou no solo.';
    }

    return {
      resumo,
      categoriaSugerida: categoria,
      classificacaoSugerida: estado,
      gravidade,
      recomendacao,
      origem: 'heuristica_local',
    };
  },
};
