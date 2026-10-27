/**
 * Script para criar todas as issues e etapas no repositório GitHub
 */
const https = require('https');

const REPO = process.env.GITHUB_REPO || 'raylsonoliveira/acessimap-fortaleza';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

const issues = [
  // Etapas Acadêmicas
  {
    title: '[Etapa 1] Concepção da Ideia e Mapeamento Colaborativo',
    labels: ['etapa', 'documentação'],
    body: '### Etapa 1 — Concepção & Mapeamento\n- Levantamento do problema de acessibilidade urbana em Fortaleza - CE.\n- Definição do escopo colaborativo atendendo pessoas com deficiência motora/visual, idosos e gestantes.\n- Alinhamento da solução tecnológica com React Native.',
  },
  {
    title: '[Etapa 2] Definição de Requisitos e Prototipação no Figma',
    labels: ['etapa', 'requisitos', 'design'],
    body: '### Etapa 2 — Requisitos & Figma\n- Especificação detalhada dos 20 Requisitos Funcionais (RF01 a RF20).\n- Especificação dos 10 Requisitos Não Funcionais (RNF01 a RNF10).\n- Prototipação de baixa fidelidade das 8 telas principais no Figma.',
  },
  {
    title: '[Etapa 3] Implementação da Interface e Navegação em React Native',
    labels: ['etapa', 'frontend', 'react-native'],
    body: '### Etapa 3 — Interface & Navegação\n- Componentes modulares: Header com botão de chat, BottomNav, Botões e Inputs acessíveis.\n- Paleta verde esmeralda (#00875F) do Figma.\n- Navegação por pilha e abas inferiores.',
  },
  {
    title: '[Etapa 4] Implementação dos CRUDs de Pontos e Ocorrências',
    labels: ['etapa', 'crud', 'backend'],
    body: '### Etapa 4 — CRUDs Obrigatórios\n- CRUD 1: Pontos de Acessibilidade (RF16) com Create, Read, Update e Delete.\n- CRUD 2: Ocorrências Urbanas (RF17) com registro de obstáculos e fotos.',
  },
  {
    title: '[Etapa 5] Integração com Firebase e Google Gemini API',
    labels: ['etapa', 'firebase', 'ia'],
    body: '### Etapa 5 — Firebase & Inteligência Artificial\n- Firebase Auth para autenticação segura (RF03).\n- Persistência Firestore e local resiliente (RF15).\n- Google Gemini API para análise técnica de relatos segundo a NBR 9050 (RF18, RF19) e Chat Virtual.',
  },
  {
    title: '[Etapa 6] Módulo de Rotas Seguras e Validação',
    labels: ['etapa', 'rotas', 'acessibilidade'],
    body: '### Etapa 6 — Rotas Seguras\n- Visualização de trajetos acessíveis calculando rampas e calçadas adaptadas (RF14).\n- Validação de contraste (WCAG) e leitor de tela (RNF04).',
  },
  {
    title: '[Etapa 7] Testes Finais, Expo Snack e Apresentação',
    labels: ['etapa', 'entrega', 'acadêmico'],
    body: '### Etapa 7 — Conclusão & Entrega\n- Homologação em Android, iOS e Web.\n- Empacotamento para Expo Snack e download do zip para o AVA da UNIFOR.',
  },

  // Requisitos Funcionais RF01 a RF20
  { title: '[RF01] Cadastro de Usuário', labels: ['auth', 'alta'], body: 'Permitir criação de conta com nome, e-mail, telefone e senha.' },
  { title: '[RF02] Autenticação e Login', labels: ['auth', 'alta'], body: 'Autenticação por credenciais com validação de campos.' },
  { title: '[RF03] Integração com Firebase Authentication', labels: ['auth', 'firebase', 'alta'], body: 'Gerenciamento seguro de usuários com Firebase Auth.' },
  { title: '[RF04] Perfil do Usuário e Contribuições', labels: ['perfil', 'media'], body: 'Consulta de dados cadastrais e histórico de ocorrências do usuário.' },
  { title: '[RF05] Mapa Colaborativo de Fortaleza', labels: ['mapa', 'alta'], body: 'Visualização interativa dos pontos acessíveis e críticos cadastrados.' },
  { title: '[RF06] Cadastrar Ponto de Acessibilidade', labels: ['pontos', 'crud', 'alta'], body: 'Registro com tipo de infraestrutura, localização e estado.' },
  { title: '[RF07] Editar Ponto Cadastrado', labels: ['pontos', 'crud', 'media'], body: 'Edição de informações de pontos criados pelo usuário.' },
  { title: '[RF08] Excluir Ponto', labels: ['pontos', 'crud', 'media'], body: 'Exclusão de ponto respeitando permissões.' },
  { title: '[RF09] Avaliar Acessibilidade', labels: ['avaliacao', 'alta'], body: 'Avaliação com notas de 1 a 5 estrelas e comentários da comunidade.' },
  { title: '[RF10] Reportar Ocorrência Urbana', labels: ['ocorrencias', 'crud', 'alta'], body: 'Registro de calçada quebrada, rampa obstruída e desníveis.' },
  { title: '[RF11] Anexar Foto aos Registros', labels: ['camera', 'media'], body: 'Upload de foto de comprovação do local ou ocorrência.' },
  { title: '[RF12] Consultar Detalhes e Recursos do Ponto', labels: ['detalhes', 'alta'], body: 'Visualização de recursos disponíveis, fotos e avaliações recentes.' },
  { title: '[RF13] Classificação de Acessibilidade Consolidada', labels: ['algoritmo', 'media'], body: 'Cálculo de índice de acessibilidade baseado nas avaliações.' },
  { title: '[RF14] Rotas Seguras para Mobilidade Reduzida', labels: ['rotas', 'alta'], body: 'Indicação de caminhos com rampas e calçadas adaptadas.' },
  { title: '[RF15] Persistência de Dados com Firebase/Firestore', labels: ['banco-de-dados', 'alta'], body: 'Armazenamento em nuvem com sincronização contínua.' },
  { title: '[RF16] CRUD Completo de Pontos de Acessibilidade', labels: ['crud', 'alta'], body: 'Implementação de Create, Read, Update e Delete para pontos.' },
  { title: '[RF17] CRUD Completo de Ocorrências', labels: ['crud', 'alta'], body: 'Implementação de Create, Read, Update e Delete para ocorrências.' },
  { title: '[RF18] Recurso de Inteligência Artificial (Gemini)', labels: ['ia', 'gemini', 'alta'], body: 'Integração com Google AI Studio / Gemini API.' },
  { title: '[RF19] Sugestão Inteligente por IA para Relatos', labels: ['ia', 'gemini', 'media'], body: 'Análise automática de relato e foto sugerindo categoria e gravidade.' },
  { title: '[RF20] Sistema de Navegação Fluida entre Telas', labels: ['navegacao', 'alta'], body: 'Navegação modular entre login, mapa, cadastro, ocorrências e perfil.' },
];

function createIssue(issue) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${REPO}/issues`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'Node-AcessiMap',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log(`\n🚀 Criando ${issues.length} issues no repositório ${REPO}...\n`);
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    process.stdout.write(`[${i + 1}/${issues.length}] Criando: ${issue.title}... `);
    try {
      const res = await createIssue(issue);
      console.log(`✅ OK (#${res.number})`);
      // Pequeno delay para respeitar o rate-limit da API do GitHub
      await new Promise(r => setTimeout(r, 600));
    } catch (e) {
      console.log(`❌ ERRO: ${e.message}`);
    }
  }
  console.log('\n✨ Todas as etapas e requisitos foram criados como issues com sucesso!\n');
}

run();
