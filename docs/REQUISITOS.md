# 📑 AcessiMap Fortaleza — Especificação de Requisitos

> **Projeto:** AcessiMap Fortaleza — Acessibilidade Urbana  
> **Disciplina:** T197 – Desenv. Plataforma Móvel  
> **Professora:** Lyndainês Santos  
> **Integrante:** Raylson Soares de Oliveira — Matrícula: 2512902  
> **Documento Base:** Etapa 2 — Definição de Requisitos e Prototipação  

---

## 1. Requisitos Funcionais (RF)

| Código | Requisito | Descrição Detalhada | Prioridade | Módulo / Tela |
| :--- | :--- | :--- | :---: | :--- |
| **RF01** | Cadastro de usuário | O sistema deve permitir que novos usuários criem uma conta informando nome completo, e-mail, telefone e senha. | **Alta** | Tela 2 (Cadastro) |
| **RF02** | Login | O sistema deve permitir que o usuário autenticado entre no aplicativo por meio de suas credenciais (e-mail e senha). | **Alta** | Tela 1 (Login) |
| **RF03** | Autenticação segura | O sistema deve utilizar o Firebase Authentication para gerenciar as credenciais, tokens e sessões dos usuários. | **Alta** | `AuthService` |
| **RF04** | Perfil do usuário | O sistema deve permitir consultar e atualizar dados de perfil, além de listar os pontos e ocorrências cadastrados pelo usuário. | **Média** | Tela 8 (Perfil) |
| **RF05** | Mapa colaborativo | O sistema deve exibir em um mapa interativo os pontos de acessibilidade e alertas registrados pela comunidade em Fortaleza. | **Alta** | Tela 3 (Mapa) |
| **RF06** | Cadastrar ponto de acessibilidade | O usuário deve poder cadastrar um ponto informando localização geográfica, tipo (rampa, calçada adaptada, acesso a edifício), estado e nota. | **Alta** | Tela 4 (Cadastrar Ponto) |
| **RF07** | Editar ponto | O usuário deve poder editar as informações de um ponto que tenha cadastrado previamente. | **Média** | Tela 4 / Detalhes |
| **RF08** | Excluir ponto | O sistema deve permitir a exclusão de um ponto cadastrado pelo próprio usuário, respeitando as regras de controle da aplicação. | **Média** | Tela Detalhes |
| **RF09** | Avaliar acessibilidade | O usuário deve poder avaliar as condições de acessibilidade de um local (nota de 1 a 5 estrelas e comentários). | **Alta** | Tela 4 & Tela 6 |
| **RF10** | Reportar ocorrência | O usuário deve poder registrar ocorrências como calçadas obstruídas, rampas danificadas, desníveis ou buracos na via pública. | **Alta** | Tela 7 (Ocorrência) |
| **RF11** | Anexar foto | O usuário deve poder anexar uma fotografia ou imagem ao registro de um local ou ocorrência para comprovação visual. | **Média** | Tela 4 & Tela 7 |
| **RF12** | Consultar detalhes | O sistema deve exibir detalhes completos do ponto, incluindo recursos disponíveis, histórico de avaliações e fotos. | **Alta** | Tela 6 (Detalhes) |
| **RF13** | Classificação de acessibilidade | O sistema deve calcular e apresentar a classificação consolidada do local com base na média das avaliações da comunidade. | **Média** | Tela 3 & Tela 6 |
| **RF14** | Rotas seguras | O sistema deve disponibilizar visualização de trajetos recomendados para pessoas com mobilidade reduzida, indicando rampas e calçadas adaptadas. | **Alta** | Tela 9 (Rota Segura) |
| **RF15** | Persistência de dados | O sistema deve utilizar Firebase Realtime Database ou Cloud Firestore para armazenamento e sincronização contínua dos dados. | **Alta** | `StorageService` |
| **RF16** | CRUD de pontos | Implementação completa das 4 operações (Create, Read, Update, Delete) no domínio de Pontos de Acessibilidade. | **Alta** | Domínio de Pontos |
| **RF17** | CRUD de ocorrências | Implementação completa das 4 operações (Create, Read, Update, Delete) no domínio de Ocorrências e Denúncias de Barreiras. | **Alta** | Domínio de Ocorrências |
| **RF18** | Recurso de Inteligência Artificial | O sistema deve integrar serviço de Inteligência Artificial via Google AI Studio / Gemini API para recursos avançados no app. | **Alta** | `GeminiService` |
| **RF19** | Sugestão por IA | A IA analisa o relato ou foto do usuário para sugerir automaticamente categoria, gravidade e classificação de acessibilidade para confirmação. | **Média** | Tela 5 (Auxílio IA) |
| **RF20** | Navegação entre telas | Navegação fluida e intuitiva entre autenticação, mapa, cadastro de ponto, registro de ocorrências, detalhes, perfil e chat. | **Alta** | `NavigationContainer` |

---

## 2. Requisitos Não Funcionais (RNF)

| Código | Categoria | Descrição |
| :--- | :--- | :--- |
| **RNF01** | **Desempenho** | Operações essenciais (login, renderização de marcadores no mapa e consulta de pontos) devem responder em menos de 2 segundos. |
| **RNF02** | **Segurança** | Autenticação gerenciada pelo Firebase com armazenamento seguro de tokens e credenciais criptografadas. |
| **RNF03** | **Usabilidade** | Interface simples, intuitiva e amigável para pessoas com diferentes graus de letramento digital. |
| **RNF04** | **Acessibilidade** | Alto contraste de cores, fontes legíveis e dimensionamento de alvos de toque com área mínima de 44x44 dp, aderente às diretrizes WCAG e NBR 9050. |
| **RNF05** | **Compatibilidade** | Aplicação multiplataforma desenvolvida em **React Native** com suporte total a **Android**, **iOS** e **Web (Expo)**. |
| **RNF06** | **Confiabilidade** | Preservação de dados locais em caso de queda de conexão, com alertas claros ao usuário sobre o status das transações. |
| **RNF07** | **Disponibilidade** | Dados armazenados em nuvem garantindo alta disponibilidade via Firebase Firestore / AsyncStorage. |
| **RNF08** | **Privacidade** | Coleta restrita aos dados indispensáveis para o serviço, em conformidade com a LGPD (Lei Geral de Proteção de Dados). |
| **RNF09** | **Consistência** | Informações exibidas no mapa e nas telas de detalhes devem refletir fielmente o estado da base de dados em tempo real. |
| **RNF10** | **Manutenibilidade** | Arquitetura modular desacoplada em componentes, serviços, hooks e telas, facilitando manutenções e extensibilidade futura. |

---

## 3. Matriz de Atendimento aos Requisitos Obrigatórios da Disciplina

| Exigência da Professora Lyndainês Santos | Requisito Correspondente | Como o Projeto Atende |
| :--- | :--- | :--- |
| **Android e iOS / React Native** | RNF05 | Desenvolvido com React Native e Expo SDK. |
| **Firebase Authentication** | RF03 | Autenticação por e-mail e senha integrada via Firebase Auth. |
| **Firebase Firestore / Realtime DB** | RF15 | Persistência cloud Firestore com fallback local resiliente. |
| **Tela de Login** | RF02 | Tela 1 do protótipo Figma implementada com validações. |
| **Tela de Cadastro** | RF01 | Tela 2 do protótipo Figma com criação de conta completa. |
| **Mínimo de 2 CRUDs além do cadastro** | RF16, RF17 | 1º CRUD: Pontos de Acessibilidade; 2º CRUD: Ocorrências Urbanas. |
| **Inteligência Artificial** | RF18, RF19 | Integração com Gemini API para análise de relatos e chat assistente. |
| **Protótipo de Baixa Fidelidade** | RNF03, RNF04 | 8 telas prototipadas no Figma e codificadas fielmente no app. |
