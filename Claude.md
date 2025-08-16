# Especificação do App de Academia ( Web)

## 1) Visão Geral

Aplicativo para praticantes, personal trainers e academias. Permite criar e gerenciar treinos personalizados, acompanhar evolução, prescrever programas, e importar/exportar dados em JSON. Funciona offline-first, sincroniza na nuvem e suporta múltiplas plataformas (iOS, Android, Web).

## 2) Personas & Casos de Uso

- **Aluno Iniciante**: quer um treino simples com instruções claras e lembretes.
    
- **Aluno Intermediário/Avançado**: quer progressão, métricas detalhadas, PRs e periodização.
    
- **Personal Trainer (PT)**: cria treinos para vários alunos, acompanha adesão e desempenho.
    
- **Gestor da Academia**: acessa catálogo padronizado, monitora engajamento, integra check-in.
    

### Histórias de Usuário (exemplos)

- Como aluno, quero **criar meus treinos** escolhendo exercícios do catálogo para executar na academia.
    
- Como aluno, quero **registrar séries, repetições, carga, tempo e RPE**, para acompanhar meu progresso.
    
- Como aluno, quero **importar/exportar meus treinos em JSON**, para backup ou migração.
    
- Como PT, quero **prescrever treinos por período (micro/meso/macro)** e acompanhar adesão.
    
- Como gestor, quero **padronizar o catálogo de exercícios** com imagens/vídeos e instruções.
    

## 3) Escopo Funcional

### 3.1 Catálogo de Exercícios

- Atributos: nome, grupos musculares, equipamento, nível, variações, instruções passo a passo, dicas de segurança, vídeo/imagem, tags (força, hipertrofia, mobilidade).
    
- Filtros de busca: por músculo, equipamento, nível, objetivo.
    
- Admin pode criar/editar/ar‑quivar exercícios e sugerir substituições equivalentes.
    
- Suporte a **exercícios customizados do usuário** (marcados como privados), com moderação opcional.
    

### 3.2 Construção de Treinos

- Estrutura: **Treino** (A/B/C…) → **Blocos/Partes** (aquecimento, principal, acessório, mobilidade) → **Exercícios** → **Séries**.
    
- Tipos de série: padrão (x rep / carga), **AMRAP**, **EMOM**, **tempo sob tensão**, **drop set**, **superset/tri-set/circuito**, **intervalado** (tempo), **piramidal**, **progressivo**.
    
- Parâmetros por série: reps mín/máx, %1RM, carga, tempo (seg/min), distância, cadência/tempo (tempo‑baixo/pausa etc.), RPE/RIR, descanso, notas.
    
- **Templates** prontos por objetivo (hipertrofia/força/resistência/saúde/rehab).
    
- **Progressão automática** configurável (ex.: +2,5 kg/semana, +1 rep, +5% carga, DUP).
    
- **Periodização**: microciclo/mesociclo/macrociclo; fases (acumulação/intensificação/pico/deload).
    
- **Substituições**: sugerir exercício alternativo por equipamento indisponível.
    

### 3.3 Execução & Registro do Treino

- Tela de treino com **timer de descanso** e controle de séries.
    
- Registro rápido: digitação assistida, duplicar última série, **auto‑preenchimento com PR anterior**.
    
- Marcação de **PR** (1RM estimado, rep PR, volume PR).
    
- **Offline-first**: registra tudo offline e sincroniza depois.
    
- **Modo cronômetro e intervalos** (Tabata/EMOM custom).
    

### 3.4 Planos & Agenda

- Calendário de treinos, metas semanais, lembretes push.
    
- **Auto‑reagendamento** se treino não concluído.
    
- Vistas: semanal, mensal, por fase do ciclo.
    

### 3.5 Métricas & Análises

- Volume por grupo muscular/semana, tonnage, densidade, tempo sob tensão, frequência.
    
- 1RM estimado (Epley/Brzycki), gráficos de carga/rep/volume.
    
- Adesão (treinos planejados vs concluídos), fadiga percebida, RPE médio.
    
- Exportação de relatórios em CSV/JSON, compartilhamento de link.
    

### 3.6 Integração com PT/Academia

- PT cria e atribui planos para alunos, recebe feedback, ajusta progressão.
    
- Chat/notas por exercício/treino.
    
- **Multicontas**: um usuário pode ser aluno e PT.
    
- Gestão de turma/box (Cross, HIIT), programação semanal.
    

### 3.7 Importação/Exportação JSON

- Importa **catálogo**, **planos**, **treinos**, **histórico**.
    
- Exporta **selecionados** (por período, por aluno) ou **backup completo**.
    
- Validação com **JSON Schema** e relatório de conflitos (ex.: exercícios inexistentes).
    

### 3.8 Gamificação (opcional)

- Badges, streaks, níveis, desafios da academia.
    

### 3.9 Acessibilidade & Localização

- Texto grande/alto contraste, VoiceOver/TalkBack, métricas em kg/lb, idioma pt‑BR/en/es.
    

## 4) Requisitos Não Funcionais

- **Segurança**: OAuth 2.1/OIDC, 2FA opcional, criptografia em trânsito (TLS 1.2+) e em repouso.
    
- **Privacidade**: LGPD (consentimento, portabilidade, eliminação, minimização), controles de compartilhamento.
    
- **Desempenho**: app responsivo <150ms ações comuns, sync em segundo plano eficiente.
    
- **Confiabilidade**: PWA + cache, fila de eventos offline, retries exponenciais, idempotência.
    
- **Escalabilidade**: microsserviços / serverless; particionamento por organização/usuário.
    
- **Observabilidade**: logs estruturados, métricas (p95), tracing distribuído.
    

## 5) Modelo de Dados (alto nível)

- **User**: id, perfil (aluno/PT/admin), preferências, fisiologia (altura, peso, medidas), PRs.
    
- **Exercise**: id, nome, gruposMusculares[], equipamento, nivel, midia, instrucoes[], variacoes[], tags[].
    
- **WorkoutTemplate**: id, nome, objetivo, blocos[], notas.
    
- **WorkoutPlan**: id, usuarioId/organizaçãoId, ciclos[], calendario (datas → workoutId).
    
- **Workout**: id, dataPlanejada, blocos[], notas.
    
- **Set**: reps, carga, tempo, distancia, rir, rpe, descanso, tipoSerie.
    
- **LogEntry**: workoutId, dataRealizada, setsRealizados[], observacoes, percepcaoEsforco.
    
- **ProgressionRule**: tipo, parametros (ex.: incrementoKg, alvoReps, limites).
    

### 5.1 JSON Schemas (resumo)

```json
{
  "$id": "Exercise.schema.json",
  "type": "object",
  "required": ["id", "nome", "gruposMusculares"],
  "properties": {
    "id": {"type": "string"},
    "nome": {"type": "string"},
    "gruposMusculares": {"type": "array", "items": {"type": "string"}},
    "equipamento": {"type": "string"},
    "nivel": {"type": "string", "enum": ["iniciante","intermediario","avancado"]},
    "midia": {"type": "object", "properties": {"imagemUrl": {"type": "string"}, "videoUrl": {"type": "string"}}},
    "instrucoes": {"type": "array", "items": {"type": "string"}},
    "variacoes": {"type": "array", "items": {"type": "string"}},
    "tags": {"type": "array", "items": {"type": "string"}}
  }
}
```

```json
{
  "$id": "Workout.schema.json",
  "type": "object",
  "required": ["id", "blocos"],
  "properties": {
    "id": {"type": "string"},
    "nome": {"type": "string"},
    "dataPlanejada": {"type": "string", "format": "date"},
    "blocos": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tipo","exercicios"],
        "properties": {
          "tipo": {"type": "string", "enum": ["aquecimento","principal","acessorio","mobilidade"]},
          "exercicios": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["exerciseId","series"],
              "properties": {
                "exerciseId": {"type": "string"},
                "observacoes": {"type": "string"},
                "regrasProgressaoId": {"type": "string"},
                "series": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "tipoSerie": {"type":"string","enum":["padrão","amrap","emom","intervalado","drop","superset","pirâmide"]},
                      "reps": {"type":"integer","minimum":0},
                      "repsMin": {"type":"integer"},
                      "repsMax": {"type":"integer"},
                      "cargaKg": {"type":"number"},
                      "%1rm": {"type":"number"},
                      "tempoSeg": {"type":"integer"},
                      "distanciaM": {"type":"integer"},
                      "rir": {"type":"number"},
                      "rpe": {"type":"number"},
                      "descansoSeg": {"type":"integer"}
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "notas": {"type": "string"}
  }
}
```

```json
{
  "$id": "LogEntry.schema.json",
  "type": "object",
  "required": ["workoutId","dataRealizada"],
  "properties": {
    "workoutId": {"type": "string"},
    "dataRealizada": {"type": "string", "format": "date-time"},
    "setsRealizados": {"type": "array", "items": {"type": "object", "properties": {
      "exerciseId": {"type": "string"},
      "serieIndex": {"type": "integer"},
      "reps": {"type": "integer"},
      "cargaKg": {"type": "number"},
      "tempoSeg": {"type": "integer"},
      "rpe": {"type": "number"}
    }}},
    "observacoes": {"type":"string"}
  }
}
```

### 5.2 Exemplo de Export JSON (treino + log)

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-08-15T00:00:00Z",
  "catalog": [{
    "id": "ex-supino-reto",
    "nome": "Supino Reto",
    "gruposMusculares": ["peito","tríceps","ombros"],
    "equipamento": "barra",
    "nivel": "intermediario",
    "tags": ["força","hipertrofia"]
  }],
  "workouts": [{
    "id": "wk-001",
    "nome": "Peito e Tríceps A",
    "dataPlanejada": "2025-08-16",
    "blocos": [{
      "tipo": "principal",
      "exercicios": [{
        "exerciseId": "ex-supino-reto",
        "series": [
          {"tipoSerie":"padrão","repsMin":6,"repsMax":8,"cargaKg":80,"descansoSeg":120},
          {"tipoSerie":"padrão","repsMin":6,"repsMax":8,"cargaKg":80,"descansoSeg":120}
        ]
      }]
    }],
    "notas": "Foco em técnica"
  }],
  "logs": [{
    "workoutId": "wk-001",
    "dataRealizada": "2025-08-16T12:30:00Z",
    "setsRealizados": [
      {"exerciseId":"ex-supino-reto","serieIndex":0,"reps":8,"cargaKg":80,"rpe":8},
      {"exerciseId":"ex-supino-reto","serieIndex":1,"reps":7,"cargaKg":80,"rpe":9}
    ]
  }]
}
```

## 6) API (REST/GraphQL) – Esboço

### 6.1 Autenticação & Contas

- `POST /auth/register` – cria conta (com verificação de e‑mail).
    
- `POST /auth/login` – retorna tokens (access/refresh), opção 2FA.
    
- `POST /auth/refresh` – renova tokens.
    
- `POST /auth/logout` – revoga sessão (server-side + device list).
    

### 6.2 Catálogo

- `GET /exercises?muscle=&equip=&level=&q=` – paginação e filtros.
    
- `POST /exercises` – cria (admin/PT); `PUT /exercises/{id}`, `DELETE /exercises/{id}` (arquivar).
    
- `POST /exercises/import` – JSON; `GET /exercises/export` – JSON.
    

### 6.3 Treinos & Planos

- `GET /workouts` / `POST /workouts` / `PUT /workouts/{id}` / `DELETE /workouts/{id}`.
    
- `GET /plans` / `POST /plans` … com **periodização** (ciclos, fases, metas).
    
- `POST /workouts/duplicate/{id}` – duplicar com data alvo.
    
- `POST /workouts/auto-progress` – aplica regras de progressão.
    

### 6.4 Execução & Logs

- `POST /logs` – registrar execução; `GET /logs?from&to&userId`.
    
- `GET /reports/volume?group=muscle&from&to` – métricas agregadas.
    

### 6.5 Import/Export

- `POST /import` (arquivo JSON único ou zip com múltiplos). Validação com schema e **dry-run** (`?validate=true`) retornando diffs.
    
- `GET /export?scope=(all|catalog|workouts|logs)&from&to`.
    

### 6.6 Admin/Org/PT

- `POST /orgs` / `GET /orgs/{id}` – gestão de academia.
    
- `POST /orgs/{id}/members` – convites, papéis: `aluno`, `pt`, `admin`.
    
- `GET /pt/clients` – lista alunos; `GET /pt/clients/{id}/adherence`.
    

## 7) Fluxos de Import/Export (detalhe)

1. **Export**: usuário escolhe escopo + período → gera arquivo JSON assinado com hash + versão do schema.
    
2. **Import**: upload → valida schema → mapeia IDs (dedup) → resolve conflitos (merge, sobrescrever, ignorar) → simulação (dry-run) → aplicar.
    
3. **Compatibilidade de Versão**: `version` + migrator (ex.: 1.0.0 → 1.1.0) com changelog.
    

## 8) UX/UI – Requisitos

- Navegação por **objetivo** (Força, Hipertrofia, Cardio, Mobilidade) e por **músculo**.
    
- Builder de treino com **drag‑and‑drop**, duplicar blocos, salvar como template.
    
- Execução: tela clara, botões grandes, timer e histórico na mesma tela.
    
- Metas: indicadores semanais e alertas de sobrecarga.
    
- Dark/Light mode, widgets home com treino do dia.
    

## 9) Integrações (opcional)

- Wearables (HealthKit/Google Fit) – FC, calorias, passos; smart scales (peso, %gordura).
    
- Check-in da academia via QR/NFC.
    

## 10) Arquitetura & Tech Stack (sugestão)

- **Front**: React Native (Expo) + Web (Next.js/PWA). State: Zustand/Redux + React Query. Offline: IndexedDB/SQLite.
    
- **Back**: Node.js (NestJS) / Python (FastAPI). Persistência: PostgreSQL + Redis (fila, cache). Armazenamento: S3.
    
- **Auth**: Keycloak/Cognito; Notificações: FCM/APNs.
    
- **Infra**: Serverless (AWS Lambda + API Gateway) ou k8s; CDN para mídia.
    
- **Observabilidade**: OpenTelemetry, Prometheus/Grafana, Sentry.
    

## 11) Segurança & LGPD

- Base legal (execução de contrato/consentimento), DPA, registro de tratamento.
    
- Controles de privacidade: anonimização em relatórios, exclusão/portabilidade.
    
- Logging com mascaramento de PII; **RBAC/ABAC** por organização.
    

## 12) Testes & Qualidade

- **Contrato**: JSON Schema + tests (AJV/fastjsonschema).
    
- **Unidade**: lógica de progressão, cálculos de 1RM/volume.
    
- **Integração**: import/export, sincronização offline, PT → aluno.
    
- **E2E**: criação de plano → execução → relatório.
    
- **Performance**: testes de carga (p95), battery profiling mobile.
    
- **Acessibilidade**: WCAG 2.2 AA.
    

## 13) Telemetria & Analytics

- Eventos: `WorkoutStarted`, `SetLogged`, `PRAchieved`, `PlanAssigned`, `ExportDone`, `ImportFailed`.
    
- Funil: Onboarding → Primeiro Treino → Semana 1 → Mês 1.
    
- KPIs: MAU/DAU, adesão, volume médio/semana, taxa de export/import, churn.
    

## 14) Roadmap (MVP → V2)

- **MVP (8–12 semanas)**: Catálogo, criação/execução de treino, logs, import/export JSON, progressão simples, calendário, notificações básicas, offline básico.
    
- **V1**: PT multi‑aluno, relatórios avançados, periodização completa, substituições inteligentes.
    
- **V2**: integrações wearables, gamificação, web completa, marketplace de templates.
    

## 15) Critérios de Aceite (exemplos)

- Usuário consegue **criar um treino** com 3 exercícios e 3 séries cada, salvar e executar.
    
- Consegue **exportar** o treino criado e o **importar** em outro dispositivo mantendo IDs.
    
- Registro de **PR** aparece em histórico e gráfico de 1RM estimado é atualizado.
    
- Modo offline permite executar e sincroniza ao reconectar sem perda de dados.
    

## 16) Considerações sobre Dados e Versões

- Todas as entidades carregam `createdAt`, `updatedAt`, `source` (app/web/import), `version`.
    
- Estratégia de **migração**: armazenar `schemaVersion`; rodar migrators no login/sync.
    

## 17) Tabelas de Referência (exemplos)

**Grupos Musculares (enum sugerido)**: peito, costas, ombros, bíceps, tríceps, quadríceps, isquiotibiais, glúteos, panturrilha, core, antebraço, lombar.

**Equipamentos (enum)**: peso livre (halteres, barra), máquinas guiadas, cabos, kettlebell, elásticos, peso corporal, cardio (esteira, bike, remo), acessórios (bola, rolo).

## 18) Política de Substituição de Exercícios

- Preferir substituições que mantenham **padrão de movimento** e **grupos musculares**.
    
- Listar equivalentes por ordem: mesmo equipamento → equipamento alternativo → peso corporal.
    

## 19) Fórmulas & Cálculos (referência)

- **1RM estimado (Epley)**: `1RM = carga * (1 + reps/30)`; **Brzycki**: `1RM = carga * 36 / (37 - reps)`.
    
- **Volume (tonnage)**: soma(carga * reps) por exercício/treino/semana.
    
- **Densidade**: volume / tempo total.
    

## 20) Observações Finais

- Garantir que import/export atenda **LGPD/portabilidade** (download pelo usuário, revogação).
    
- Documentar JSON Schemas e manter versionamento semântico.
    
- Prever migração de catálogo global × catálogo privado do usuário.