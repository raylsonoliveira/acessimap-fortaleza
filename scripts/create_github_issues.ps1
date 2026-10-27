# Script para criação automática de Issues no GitHub para o projeto AcessiMap Fortaleza
# Uso: .\scripts\create_github_issues.ps1 -Repo "seu-usuario/acessimap-fortaleza" -Token "seu_github_token"

param(
    [Parameter(Mandatory=$false)]
    [string]$Repo = "",
    [Parameter(Mandatory=$false)]
    [string]$Token = ""
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   AcessiMap Fortaleza — Criador de Issues no GitHub     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $Repo) {
    $Repo = Read-Host "Informe o repositório no formato 'usuario/nome-do-repo' (ex: raylson/acessimap-fortaleza)"
}

if (-not $Token) {
    Write-Host "Caso possua o GitHub CLI (gh) configurado, o script usará sua sessão automaticamente." -ForegroundColor Yellow
}

$issues = @(
    @{ title = "[Etapa 1] Concepção da Ideia e Mapeamento Colaborativo"; labels = @("etapa", "documentação"); body = "Etapa 1 concluída: Definição do escopo colaborativo e público-alvo para Fortaleza-CE." },
    @{ title = "[Etapa 2] Definição de Requisitos e Prototipação no Figma"; labels = @("etapa", "requisitos", "design"); body = "Etapa 2 concluída: Especificação de 20 RFs, 10 RNFs e protótipo de baixa fidelidade no Figma." },
    @{ title = "[Etapa 3] Implementação da Interface e Navegação em React Native"; labels = @("etapa", "frontend"); body = "Etapa 3: Telas no React Native/Expo fiéis ao protótipo do Figma." },
    @{ title = "[Etapa 4] Implementação dos CRUDs de Pontos e Ocorrências"; labels = @("etapa", "crud"); body = "Etapa 4: Implementação dos dois CRUDs obrigatórios exigidos pela disciplina T197." },
    @{ title = "[Etapa 5] Integração com Firebase e Google Gemini API"; labels = @("etapa", "firebase", "ia"); body = "Etapa 5: Autenticação, banco em nuvem e IA para análise de acessibilidade e chat." },
    @{ title = "[RF01] Cadastro de Usuário"; labels = @("auth", "alta"); body = "Permitir que novos usuários criem uma conta informando nome, e-mail, telefone e senha." },
    @{ title = "[RF02] Autenticação e Login"; labels = @("auth", "alta"); body = "Autenticação segura via credenciais de acesso." },
    @{ title = "[RF03] Integração com Firebase Authentication"; labels = @("auth", "firebase", "alta"); body = "Gerenciamento de autenticação com Firebase Auth." },
    @{ title = "[RF04] Perfil do Usuário e Minhas Contribuições"; labels = @("perfil", "media"); body = "Exibição de dados do usuário e histórico de reportes." },
    @{ title = "[RF05] Mapa Colaborativo Interativo de Fortaleza"; labels = @("mapa", "alta"); body = "Exibição dos pontos de acessibilidade em mapa interativo." },
    @{ title = "[RF06] Cadastro de Ponto de Acessibilidade"; labels = @("pontos", "crud", "alta"); body = "Cadastro com tipo (rampa, calçada), coordenadas e estado." },
    @{ title = "[RF07] Edição de Ponto Cadastrado"; labels = @("pontos", "crud", "media"); body = "Edição de informações de pontos criados pelo usuário." },
    @{ title = "[RF08] Exclusão de Ponto pelo Usuário"; labels = @("pontos", "crud", "media"); body = "Remoção de ponto respeitando regras de permissão." },
    @{ title = "[RF09] Avaliação de Acessibilidade com Nota"; labels = @("avaliacao", "alta"); body = "Avaliação com nota de 1 a 5 estrelas e comentários." },
    @{ title = "[RF10] Registro de Ocorrências e Barreiras"; labels = @("ocorrencias", "crud", "alta"); body = "Reportar calçada danificada, rampa obstruída, etc." },
    @{ title = "[RF11] Anexo de Fotos aos Registros"; labels = @("camera", "media"); body = "Possibilidade de anexar fotos a pontos e ocorrências." },
    @{ title = "[RF12] Consulta de Detalhes e Status do Local"; labels = @("detalhes", "alta"); body = "Exibição de recursos disponíveis e histórico de avaliações." },
    @{ title = "[RF13] Classificação de Acessibilidade do Local"; labels = @("algoritmo", "media"); body = "Cálculo da classificação consolidada de acessibilidade." },
    @{ title = "[RF14] Módulo de Rotas Seguras"; labels = @("rotas", "alta"); body = "Visualização de trajetos mais acessíveis com contagem de rampas." },
    @{ title = "[RF15] Persistência de Dados com Firebase/Firestore"; labels = @("banco-de-dados", "alta"); body = "Armazenamento em nuvem com fallback resiliente." },
    @{ title = "[RF16] CRUD Completo de Pontos de Acessibilidade"; labels = @("crud", "alta"); body = "Operações Criar, Consultar, Atualizar e Excluir pontos." },
    @{ title = "[RF17] CRUD Completo de Ocorrências"; labels = @("crud", "alta"); body = "Operações Criar, Consultar, Atualizar e Excluir ocorrências." },
    @{ title = "[RF18] Recurso de Inteligência Artificial (Gemini)"; labels = @("ia", "gemini", "alta"); body = "Integração com Google AI Studio / Gemini API." },
    @{ title = "[RF19] Sugestão Inteligente por IA para Relatos"; labels = @("ia", "gemini", "media"); body = "Classificação automática de relato e gravidade pela IA." },
    @{ title = "[RF20] Sistema de Navegação Completo entre Telas"; labels = @("navegacao", "alta"); body = "Navegação fluida entre todas as telas do protótipo Figma." }
)

Write-Host "Criando $($issues.Count) issues no repositório $Repo..." -ForegroundColor Green

foreach ($issue in $issues) {
    Write-Host "Criando: $($issue.title)..." -NoNewline
    if ($Token) {
        $headers = @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "User-Agent" = "PowerShell-AcessiMap"
        }
        $bodyJson = @{
            title = $issue.title
            body = $issue.body
            labels = $issue.labels
        } | ConvertTo-Json -Compress

        try {
            $resp = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/issues" -Method Post -Headers $headers -Body $bodyJson -ContentType "application/json"
            Write-Host " [OK - #${resp.number}]" -ForegroundColor Green
        } catch {
            Write-Host " [FALHA: $_]" -ForegroundColor Red
        }
    } else {
        # Tenta usar gh CLI
        $labelsStr = ($issue.labels -join ",")
        $res = gh issue create --repo $Repo --title "$($issue.title)" --body "$($issue.body)" --label "$labelsStr" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [OK]" -ForegroundColor Green
        } else {
            Write-Host " [Necessário configurar Token ou gh auth]" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nProcesso finalizado!" -ForegroundColor Green
