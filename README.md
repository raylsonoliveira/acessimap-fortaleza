# ♿ AcessiMap Fortaleza — Acessibilidade Urbana

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-51.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Studio-8E75C2?style=for-the-badge&logo=google&logoColor=white)

**Aplicativo móvel colaborativo para monitoramento e consulta de acessibilidade urbana em Fortaleza – CE.**

</div>

---

## 🎓 Informações Acadêmicas

- **Instituição:** Universidade de Fortaleza (UNIFOR)
- **Disciplina:** T197 – Desenvolvimento para Plataforma Móvel
- **Professora:** Lyndainês Santos
- **Aluno Desenvolvedor:** Raylson Soares de Oliveira
- **Matrícula:** 2512902
- **Documento de Referência:** *Etapa 2 — Definição de Requisitos e Prototipação*

---

## 🌟 1. Contextualização do Projeto

O **AcessiMap Fortaleza** é uma proposta de aplicativo colaborativo voltado ao mapeamento e monitoramento da acessibilidade urbana na cidade de Fortaleza - CE. 

O projeto atende pedestres com deficiência motora ou visual, idosos, gestantes e pessoas com mobilidade reduzida que transitam por espaços públicos e privados de Fortaleza. A aplicação permite registrar, consultar e avaliar condições de infraestrutura urbana, tais como rampas, calçadas adaptadas, guias rebaixadas, travessias seguras e acesso a edifícios públicos e privados.

---

## 🚀 2. Etapas do Projeto no GitHub

O projeto foi dividido em etapas cronológicas bem delimitadas, detalhadas em [docs/ETAPAS.md](docs/ETAPAS.md) e preparadas para acompanhamento via **GitHub Projects** e **Issues**:

| Etapa | Nome da Etapa | Status | Descrição |
| :---: | :--- | :---: | :--- |
| **01** | Concepção da Ideia e Mapeamento Colaborativo | Concluído ✅ | Levantamento do problema de acessibilidade urbana em Fortaleza e definição da solução colaborativa. |
| **02** | Definição de Requisitos e Prototipação | Concluído ✅ | Elaboração dos 20 RFs, 10 RNFs e protótipo de baixa fidelidade no Figma com 8 telas. |
| **03** | Interface e Navegação em React Native | Concluído ✅ | Construção da arquitetura modular, paleta de cores (#00875F), componentes acessíveis e navegação. |
| **04** | CRUD de Pontos e CRUD de Ocorrências | Concluído ✅ | Implementação das 4 operações (Create, Read, Update, Delete) nos dois domínios obrigatórios. |
| **05** | Integração com Firebase & Backend | Concluído ✅ | Autenticação por e-mail/senha via Firebase Auth e persistência Firestore com fallback resiliente. |
| **06** | Inteligência Artificial (Google Gemini API) | Concluído ✅ | Classificação técnica automática de relatos e chat assistente de mobilidade urbana em Fortaleza. |
| **07** | Módulo de Rotas Seguras & Testes | Concluído ✅ | Cálculo de rotas acessíveis com contagem de rampas, validação multiplataforma e entrega. |

---

## 📑 3. Requisitos Obrigatórios da Disciplina (Etapa 2)

O projeto atende rigorosamente a todos os critérios estabelecidos pela professora Lyndainês Santos:

| Exigência da Professora | Como o AcessiMap Fortaleza atende |
| :--- | :--- |
| **Android e iOS / React Native** | Desenvolvido com React Native e Expo SDK, compatível com Web, Android e iOS (RNF05). |
| **Firebase Authentication** | Gerenciamento de credenciais e autenticação via Firebase Auth (RF03). |
| **Firebase Realtime Database ou Firestore** | Persistência de dados em nuvem com sincronização contínua e fallback local (RF15). |
| **Tela de Login** | Tela 1 do Figma com e-mail, senha, botão "Entrar" e atalho para cadastro (RF02). |
| **Tela de Cadastro** | Tela 2 do Figma com nome completo, e-mail, telefone, senha e validações (RF01). |
| **Mínimo de 2 CRUDs além do cadastro** | **CRUD 1:** Pontos de Acessibilidade (RF16) <br/> **CRUD 2:** Ocorrências e Barreiras Urbanas (RF17). |
| **Inteligência Artificial** | Integração com Google AI Studio / Gemini API para sugestão técnica de relatos (RF18, RF19) e Chat Virtual. |
| **Protótipo de Baixa Fidelidade** | 8 telas prototipadas no Figma e implementadas no código com alto contraste e acessibilidade (RNF03, RNF04). |

> A especificação completa de todos os 20 Requisitos Funcionais e 10 Não Funcionais está documentada em [docs/REQUISITOS.md](docs/REQUISITOS.md).

---

## 🎨 4. Telas do Protótipo (Figma)

O design segue rigorosamente a identidade visual e navegação prototipada no Figma (especificado em [docs/PROTOTIPO_FIGMA.md](docs/PROTOTIPO_FIGMA.md)):

```
┌─────────────────────────────────────────────────────────────┐
│                       FLUXO DE TELAS                        │
├─────────────────────────────────────────────────────────────┤
│ 1. Tela 1 (Login) ──────────► 3. Tela 3 (Mapa Colaborativo) │
│      │                                ▲         ▲           │
│      ▼                                │         │           │
│ 2. Tela 2 (Cadastro)                  │         │           │
│                                       ▼         │           │
│ 4. Tela 4 (Cadastrar Ponto) ◄──► 5. Tela 5 (IA) │           │
│      │                                          │           │
│      ▼                                          │           │
│ 6. Tela 6 (Detalhes do Ponto) ──────► 7. Tela 7 (Ocorrência)│
│                                                             │
│ 8. Tela 8 (Perfil)  ◄────────────────► 9. Tela 9 (Rotas)    │
│                                                             │
│ [Header Top Bar] ───────────────► 10. Chat Assistente IA    │
└─────────────────────────────────────────────────────────────┘
```

1. **Tela 1 — Login:** Autenticação segura, logotipo centralizado do AcessiMap Fortaleza, link "Criar uma conta" e botão "Locais".
2. **Tela 2 — Cadastro:** Criação de conta com Nome, E-mail, Telefone, Senha e Confirmação.
3. **Tela 3 — Mapa Colaborativo:** Barra de busca em Fortaleza, marcadores interativos (Verde: acessível, Amarelo: parcial, Vermelho: barreira), filtros (`Todos`, `Rampas`, `Calçadas`, `Locais`) e botão flutuante `+ Novo Ponto`.
4. **Tela 4 — Cadastrar/Avaliar Ponto:** Formulário de cadastro com tipo, localização, nota de 1 a 5 estrelas, fotos e botão de análise com IA.
5. **Tela 5 — Auxílio por IA:** Modal de assistência com modelo Gemini para sugestão automática de categoria e gravidade segundo a NBR 9050.
6. **Tela 6 — Detalhes e Status:** Informações completas do local, notas, recursos disponíveis e histórico de avaliações comunitárias.
7. **Tela 7 — Reportar Ocorrência:** Registro ágil de calçadas obstruídas, rampas danificadas e obstáculos.
8. **Tela 8 — Perfil:** Dados do usuário, histórico de pontos, lista de reportes do usuário com opção de exclusão e logout.
9. **Tela 9 — Rota Segura:** Resumo de trajeto adaptado ("1,2 km · 15 min") com contagem de rampas, calçadas adaptadas e ausência de obstáculos.
10. **Chat de IA (Visualizar chat):** Assistente virtual disponível no cabeçalho pronto para tirar dúvidas sobre acessibilidade em Fortaleza e legislação.

---

## 📂 5. Estrutura do Código-Fonte

```text
acessimap-fortaleza/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── 01_etapa_milestone.md
│   │   ├── 02_requisito_funcional.md
│   │   └── 03_bug_report.md
│   ├── workflows/
│   │   └── ci.yml
│   └── GITHUB_PROJECT_ISSUES.md   # Todas as 20+ issues formatadas para o GitHub
├── docs/
│   ├── ETAPAS.md                  # Cronograma e detalhamento das 7 etapas
│   ├── REQUISITOS.md              # Matriz de 20 RFs e 10 RNFs
│   └── PROTOTIPO_FIGMA.md         # Documentação visual das telas do Figma
├── scripts/
│   └── create_github_issues.ps1   # Script PowerShell para criar issues no GitHub
├── src/
│   ├── components/                # Componentes reutilizáveis acessíveis
│   │   ├── Header.tsx             # Top bar com [IA] e botão [Visualizar chat]
│   │   ├── BottomNav.tsx          # Abas inferiores (Mapa, Reportar, Rotas, Perfil)
│   │   ├── Button.tsx             # Botões primários, outlines e acessíveis
│   │   ├── Input.tsx              # Campos de texto com ícones e label
│   │   ├── Badge.tsx              # Badges de acessibilidade (Verde, Amarelo, Vermelho)
│   │   └── Card.tsx               # Cards com sombra e elevação
│   ├── config/
│   │   ├── firebase.ts            # Conexão Firebase Auth/Firestore resiliente
│   │   └── gemini.ts              # Configuração da Google Gemini API
│   ├── context/
│   │   ├── AuthContext.tsx        # Gerenciamento de login, cadastro e sessão
│   │   └── DataContext.tsx        # Estado global dos 2 CRUDs e chat IA
│   ├── data/
│   │   └── mockData.ts            # Pontos reais de Fortaleza (UNIFOR, Beira-Mar, Cocó)
│   ├── screens/                   # Telas fiéis ao protótipo do Figma
│   │   ├── LoginScreen.tsx        # Tela 1: Login
│   │   ├── RegisterScreen.tsx     # Tela 2: Cadastro
│   │   ├── MapScreen.tsx          # Tela 3: Mapa Colaborativo
│   │   ├── NewPointScreen.tsx     # Tela 4: Cadastrar Ponto
│   │   ├── AiAnalysisModal.tsx    # Tela 5: Auxílio por IA (Gemini)
│   │   ├── PointDetailScreen.tsx  # Tela 6: Detalhes e Status
│   │   ├── ReportScreen.tsx       # Tela 7: Reportar Ocorrência (CRUD 2)
│   │   ├── ProfileScreen.tsx      # Tela 8: Perfil do Usuário
│   │   ├── SafeRouteScreen.tsx    # Tela 9: Rota Segura
│   │   └── AiChatModal.tsx        # Tela 10: Chat Assistente de IA
│   ├── services/
│   │   ├── geminiService.ts       # Integração com Gemini API / Análise NBR 9050
│   │   └── storageService.ts      # Persistência local AsyncStorage + Cloud Firestore
│   ├── theme/
│   │   └── index.ts               # Paleta de cores (#00875F), tipografia e espaçamentos
│   └── types/
│       └── index.ts               # Tipagens TypeScript (Ponto, Ocorrência, Usuário)
├── App.tsx                        # Ponto de entrada e fluxo de navegação
├── app.json                       # Configurações do Expo
├── package.json                   # Dependências do projeto
└── tsconfig.json                  # Configuração TypeScript
```

---

## ⚙️ 6. Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18+)
- Celular com o aplicativo **Expo Go** (Android/iOS) OU navegador web

### Passo a Passo

1. **Acessar a pasta do projeto:**
   ```bash
   cd acessimap-fortaleza
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor Expo:**
   ```bash
   npx expo start
   ```

4. **Visualizar o aplicativo:**
   - **No celular:** Abra o app **Expo Go** e escaneie o QR Code exibido no terminal.
   - **No navegador:** Pressione `w` no terminal para abrir no navegador web.
   - **No emulador Android:** Pressione `a`.

---

## 🌐 7. Como Testar no Expo Snack (Para Entrega no AVA UNIFOR)

O projeto foi arquitetado para funcionar de forma 100% autônoma no **Expo Snack**:

1. Acesse o [Expo Snack](https://snack.expo.dev).
2. Arraste a pasta `src/` e o arquivo `App.tsx` para o editor do Snack.
3. No painel de dependências do Snack, certifique-se de que os pacotes `@react-native-async-storage/async-storage` e `@expo/vector-icons` estejam listados.
4. Execute o app diretamente na aba do emulador web ou conecte seu celular via Expo Go.
5. Para gerar o pacote de entrega, clique em **"Download as zip"** no menu superior do Expo Snack e envie o arquivo `.zip` no Ambiente Virtual de Aprendizagem (AVA) da UNIFOR.

---

## 🐙 8. Como Publicar o Projeto no seu GitHub

Para enviar o projeto para o seu repositório pessoal no GitHub:

1. **Crie um novo repositório no seu GitHub** com o nome `acessimap-fortaleza` (ou o nome desejado).
2. **Execute os comandos no terminal dentro da pasta do projeto:**
   ```bash
   cd C:\Users\rayls\.gemini\antigravity\scratch\acessimap-fortaleza
   git remote add origin https://github.com/SEU_USUARIO/acessimap-fortaleza.git
   git branch -M main
   git push -u origin main
   ```

3. **Para criar automaticamente todas as etapas e requisitos como Issues no GitHub:**
   Abra o PowerShell na pasta do projeto e execute o script:
   ```powershell
   .\scripts\create_github_issues.ps1 -Repo "SEU_USUARIO/acessimap-fortaleza" -Token "SEU_GITHUB_PERSONAL_ACCESS_TOKEN"
   ```
   > Todas as 25 issues com etapas e requisitos funcionais serão criadas e categorizadas com tags apropriadas!

---

## 👨‍💻 Autor

- **Raylson Soares de Oliveira** — Matrícula: 2512902  
- **E-mail:** [raylsonsoaresdeoliveira@gmail.com](mailto:raylsonsoaresdeoliveira@gmail.com)  
- **Curso:** Bacharelado em Ciência da Computação / Informática  
- **Universidade:** Universidade de Fortaleza (UNIFOR)
