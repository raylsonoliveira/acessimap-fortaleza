# 📋 GitHub Issues & Milestones — AcessiMap Fortaleza

Este documento reúne todas as **Etapas** e **Requisitos Funcionais** formatados prontos para serem criados como **Issues** e **Milestones** no repositório GitHub do projeto.

---

## 🎯 Milestones (Marcos do Projeto)

### Milestone 1: Etapa 1 — Concepção & Ideação
- **Descrição:** Definição do escopo colaborativo e mapeamento urbano de acessibilidade em Fortaleza.
- **Status:** Concluído ✅

### Milestone 2: Etapa 2 — Requisitos & Prototipação
- **Descrição:** Formalização de 20 RFs, 10 RNFs e protótipo de baixa fidelidade no Figma.
- **Status:** Concluído ✅

### Milestone 3: Etapa 3 — Estruturação & Telas
- **Descrição:** Implementação da navegação e telas fiéis ao Figma em React Native com Expo.
- **Status:** Concluído ✅

### Milestone 4: Etapa 4 — CRUDs de Pontos e Ocorrências
- **Descrição:** Implementação completa das operações Create, Read, Update, Delete nos dois domínios.
- **Status:** Concluído ✅

### Milestone 5: Etapa 5 — Firebase & Inteligência Artificial
- **Descrição:** Autenticação, persistência de dados e integração com Gemini API para análise inteligente e chat.
- **Status:** Concluído ✅

---

## 🚀 Issues das Etapas Acadêmicas

### Issue E1: [Etapa 1] Concepção da Ideia e Mapeamento Colaborativo
**Labels:** `etapa`, `documentação`  
**Milestone:** Etapa 1 — Concepção & Ideação  
**Corpo:**
```markdown
### 🎯 Descrição
Definir a proposta de aplicativo colaborativo voltado ao monitoramento de acessibilidade urbana em Fortaleza - CE, atendendo PCDs motoras e visuais, idosos e pessoas com mobilidade reduzida.

### ✅ Tarefas
- [x] Pesquisa de barreiras arquitetônicas em Fortaleza
- [x] Definição de personas de usuários (cadeirantes, idosos, deficientes visuais)
- [x] Estruturação da proposta baseada em mapeamento colaborativo
```

---

### Issue E2: [Etapa 2] Definição de Requisitos e Prototipação no Figma
**Labels:** `etapa`, `requisitos`, `design`  
**Milestone:** Etapa 2 — Requisitos & Prototipação  
**Corpo:**
```markdown
### 🎯 Descrição
Documentar formalmente os requisitos funcionais e não funcionais do AcessiMap Fortaleza e desenhar os protótipos de baixa fidelidade das 8 telas principais no Figma.

### ✅ Tarefas
- [x] Especificação dos 20 Requisitos Funcionais (RF01 a RF20)
- [x] Especificação dos 10 Requisitos Não Funcionais (RNF01 a RNF10)
- [x] Desenho do fluxo de navegação no Figma
- [x] Criação das 8 telas: Login, Cadastro, Mapa, Cadastrar Ponto, Auxílio IA, Detalhes, Ocorrência e Perfil
```

---

### Issue E3: [Etapa 3] Implementação da Interface e Navegação em React Native
**Labels:** `etapa`, `frontend`, `react-native`  
**Milestone:** Etapa 3 — Estruturação & Telas  
**Corpo:**
```markdown
### 🎯 Descrição
Construir os componentes e telas no React Native utilizando Expo e TypeScript, replicando fielmente a proposta visual do Figma.

### ✅ Tarefas
- [x] Configuração da Stack e Bottom Tabs de navegação
- [x] Implementação da paleta de cores verde esmeralda (#00875F)
- [x] Criação dos componentes acessíveis: Header com botão de chat, Botões, Inputs, Cards
- [x] Responsividade para Android, iOS e Web
```

---

### Issue E4: [Etapa 4] Implementação dos CRUDs de Pontos e Ocorrências
**Labels:** `etapa`, `crud`, `backend`  
**Milestone:** Etapa 4 — CRUDs de Pontos e Ocorrências  
**Corpo:**
```markdown
### 🎯 Descrição
Implementar os dois CRUDs obrigatórios exigidos pela disciplina T197: Pontos de Acessibilidade e Ocorrências.

### ✅ Tarefas
- [x] CRUD 1: Criar, consultar, atualizar e excluir Pontos de Acessibilidade (RF16)
- [x] CRUD 2: Criar, consultar, atualizar e excluir Ocorrências de barreiras (RF17)
- [x] Cálculo automático de média de avaliações e status do local
```

---

### Issue E5: [Etapa 5] Integração com Firebase e Google Gemini API
**Labels:** `etapa`, `firebase`, `inteligencia-artificial`  
**Milestone:** Etapa 5 — Firebase & Inteligência Artificial  
**Corpo:**
```markdown
### 🎯 Descrição
Conectar a aplicação ao Firebase Authentication para autenticação segura e ao Google AI Studio / Gemini API para sugestão inteligente e chat virtual.

### ✅ Tarefas
- [x] Firebase Auth para Login e Registro
- [x] Persistência em nuvem e armazenamento local resiliente
- [x] Serviço de IA para análise automática de relatos de acessibilidade (RF19)
- [x] Chatbot assistente de mobilidade urbana acessível pelo cabeçalho
```

---

## 📌 Issues dos Requisitos Funcionais (RF01 a RF20)

| Código | Título da Issue | Labels |
| :--- | :--- | :--- |
| **RF01** | `[RF01] Cadastro de Usuário` | `auth`, `alta` |
| **RF02** | `[RF02] Autenticação / Login` | `auth`, `alta` |
| **RF03** | `[RF03] Integração com Firebase Authentication` | `auth`, `firebase`, `alta` |
| **RF04** | `[RF04] Tela de Perfil do Usuário e Minhas Contribuições` | `perfil`, `media` |
| **RF05** | `[RF05] Mapa Colaborativo Interativo de Fortaleza` | `mapa`, `alta` |
| **RF06** | `[RF06] Cadastro de Ponto de Acessibilidade` | `pontos`, `crud`, `alta` |
| **RF07** | `[RF07] Edição de Ponto Cadastrado` | `pontos`, `crud`, `media` |
| **RF08** | `[RF08] Exclusão de Ponto pelo Usuário` | `pontos`, `crud`, `media` |
| **RF09** | `[RF09] Avaliação e Classificação de Acessibilidade` | `avaliacao`, `alta` |
| **RF10** | `[RF10] Registro de Ocorrências e Barreiras Urbanas` | `ocorrencias`, `crud`, `alta` |
| **RF11** | `[RF11] Anexo de Fotografia no Registro de Pontos/Ocorrências` | `camera`, `media` |
| **RF12** | `[RF12] Consulta de Detalhes e Status do Local` | `detalhes`, `alta` |
| **RF13** | `[RF13] Cálculo e Classificação de Nível de Acessibilidade` | `algoritmo`, `media` |
| **RF14** | `[RF14] Módulo de Visualização de Rotas Seguras` | `rotas`, `alta` |
| **RF15** | `[RF15] Persistência com Firestore / Realtime DB` | `banco-de-dados`, `alta` |
| **RF16** | `[RF16] CRUD Completo de Pontos de Acessibilidade` | `crud`, `alta` |
| **RF17** | `[RF17] CRUD Completo de Ocorrências Urbanas` | `crud`, `alta` |
| **RF18** | `[RF18] Integração com Google AI Studio / Gemini API` | `ia`, `gemini`, `alta` |
| **RF19** | `[RF19] Sugestão Inteligente por IA para Relatos` | `ia`, `gemini`, `media` |
| **RF20** | `[RF20] Sistema de Navegação Fluida entre Telas` | `navegacao`, `alta` |
