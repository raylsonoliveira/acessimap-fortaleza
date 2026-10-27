# 🎨 AcessiMap Fortaleza — Protótipo Visual de Baixa Fidelidade

> **Projeto:** AcessiMap Fortaleza — Acessibilidade Urbana  
> **Disciplina:** T197 – Desenv. Plataforma Móvel (UNIFOR)  
> **Professora:** Lyndainês Santos  
> **Aluno:** Raylson Soares de Oliveira — 2512902  
> **Ferramenta de Design:** Figma  

---

## 📱 Visão Geral da Interface

O protótipo visual foi construído no Figma para orientar o desenvolvimento com foco na experiência do usuário e na acessibilidade digital. Ele adota uma paleta moderna inspirada no urbanismo sustentável:
- **Verde Primário:** `#00875F` (representa acessibilidade, aprovação e sustentabilidade)
- **Verde Secundário / Teal:** `#0D9488`
- **Azul Ação / Chat:** `#4F46E5` (botão superior "Visualizar chat")
- **Fundo / Superfícies:** `#FFFFFF` e `#F8FAFC`
- **Texto e Ícones:** Alto contraste em `#0F172A` e `#64748B`

---

## 🖼️ Especificação das Telas

### 1️⃣ Tela 1 — Login
- **Cabeçalho:** Ícone `[IA]`, título central `AcessiMap Fortaleza`, botão pill azul `Visualizar chat`.
- **Identidade:** Logotipo circular verde com ícone de cadeirante/acessibilidade e nome `AcessiMap Fortaleza`.
- **Campos de Entrada:**
  - Campo com ícone de e-mail: `E-mail ou usuário`
  - Campo com ícone de cadeado e alternador de visibilidade (olho): `Senha`
- **Ações:**
  - Botão principal verde: `Entrar`
  - Link de recuperação: `Esqueceu sua senha?`
  - Botão secundário vazado: `Criar uma conta`
  - Tag inferior: `Locais`

### 2️⃣ Tela 2 — Cadastro
- **Cabeçalho:** Seta de navegação para voltar (`←`) e título `Criar conta`.
- **Campos de Entrada:**
  - `Nome completo` (ícone de perfil)
  - `E-mail` (ícone de envelope)
  - `Telefone` (ícone de telefone)
  - `Senha` (ícone de cadeado com visualização)
  - `Confirmar senha` (ícone de cadeado com confirmação)
- **Ações:**
  - Botão principal verde: `Cadastrar`
  - Link de retorno: `Já tem uma conta? Entrar`

### 3️⃣ Tela 3 — Mapa Colaborativo
- **Cabeçalho:** Logotipo e botão de chat de IA.
- **Barra de Pesquisa:** Campo com ícone de lupa/prédio e texto `AcessiMap Fortaleza`.
- **Área do Mapa:** Renderização das ruas de Fortaleza com marcadores interativos:
  - 🟢 Marcador Verde: Ponto 100% Acessível
  - 🔵 Marcador Azul/Teal: Rampa de acesso
  - 🟡 Marcador Alerta: Calçada irregular ou obra
  - 🔴 Marcador Vermelho: Ponto crítico / inacessível
- **Filtros Rápidos:** Botões de alternância `Todos`, `Rampas`, `Calçadas`, `Locais`.
- **Botão Flutuante (FAB):** `+ Cadastrar Ponto`
- **Barra de Navegação Inferior (Bottom Tabs):**
  - `[Mapa]` (ícone de mapa)
  - `[Reportar]` (ícone de adição `+`)
  - `[Rotas]` (ícone de trajeto conectado)
  - `[Perfil]` (ícone de avatar)

### 4️⃣ Tela 4 — Cadastrar/Avaliar Ponto
- **Campos:**
  - Seletor de Tipo: `Rampa` | `Calçada` | `Acesso a Edifício` | `Prédio Público` | `Outro`
  - `Localização`: Endereço ou coordenadas GPS capturadas automaticamente em Fortaleza.
  - `Estado de Acessibilidade`: `Acessível` | `Parcial` | `Inacessível`
  - `Classificação/Nota`: Escala de 1 a 5 estrelas.
  - `Anexar Foto`: Botão interativo para seleção de imagem da câmera ou galeria.
  - `Comentário`: Caixa de texto para detalhar a infraestrutura.
- **Ações:**
  - Botão Verde: `Salvar Ponto`
  - Botão Assistente IA: `✨ Analisar com IA (Gemini)`

### 5️⃣ Tela 5 — Auxílio por IA (Gemini API)
- **Resumo do Relato:** Interpretação gerada pelo modelo da Google AI.
- **Categoria Sugerida:** Rampa fora de norma, calçada obstruída, etc.
- **Classificação Sugerida:** Nível de acessibilidade estimado e gravidade (Baixa, Média, Alta).
- **Ações:**
  - Botão verde: `Confirmar e Preencher`
  - Botão secundário: `Editar Manualmente`

### 6️⃣ Tela 6 — Detalhes e Status do Local
- **Nome do Local:** Ex: `Parque do Cocó - Entrada Sul`
- **Nota Média:** Ex: `⭐ 4.8 (24 avaliações)`
- **Recursos Disponíveis:** Chips com `Piso Tátil`, `Rampa com Corrimão`, `Vaga Reservada`, `Banheiro Adaptado`.
- **Status do Local:** Badge verde `Totalmente Acessível`.
- **Avaliações Recentes:** Comentários deixados por outros cidadãos de Fortaleza.
- **Fotos:** Galeria de fotos enviadas pela comunidade.
- **Ação:** Botão `Reportar Problema` (encaminha para a Tela 7).

### 7️⃣ Tela 7 — Reportar Ocorrência (CRUD 2)
- **Título:** `Reportar Ponto / Ocorrência`
- **Tipo de Ocorrência:** Seletores em grade (`Rampa Danificada`, `Calçada Obstruída`, `Prédio Inacessível`, `Outro`).
- **Foto do Local:** Área demarcada com ícone de câmera `Tirar foto ou anexar`.
- **Comentário Opcional:** `Descreva o que aconteceu...`
- **Ação:** Botão verde `Enviar Ocorrência`.

### 8️⃣ Tela 8 — Perfil do Usuário
- **Avatar:** Ícone circular grande e identificador `@usuario123`.
- **Itens de Menu:**
  - `⚠️ Meus reportes >` (consulta e exclusão de ocorrências do usuário)
  - `🔀 Minhas rotas >` (histórico de trajetos acessíveis)
  - `❤️ Favoritos >` (locais salvos)
  - `⚙️ Configurações >` (ajustes de acessibilidade e tema)
- **Ação:** Botão vermelho `Sair` (logout seguro do Firebase).

### 9️⃣ Tela 9 — Rota Segura
- **Card Principal:** `Trajeto Acessível — 1,2 km · 15 min`
- **Estatísticas de Acessibilidade:**
  - `✓ Rampas: 3`
  - `✓ Calçadas adaptadas: 5`
  - `✓ Sem obstáculos: 0`
- **Ação:** Botão verde grande `Iniciar Rota`.

### 🔟 Tela 10 — Chat de IA (Assistente Virtual AcessiMap)
- Botão superior `Visualizar chat` disponível em todas as telas.
- Janela de diálogo com o assistente Gemini pronto para responder dúvidas sobre mobilidade urbana, leis de acessibilidade e pontos de apoio em Fortaleza.
