# App de Academia - Documentação

## Visão Geral

O **App de Academia** é uma aplicação web Progressive Web App (PWA) desenvolvida em Next.js com TypeScript, focada em treinos personalizados e offline-first. O sistema permite criar, executar e acompanhar treinos de forma completamente offline, com funcionalidades de import/export e geração de fichas em PDF.

## Características Principais

- ✅ **Offline First**: Funciona completamente sem internet usando IndexedDB
- 📱 **PWA**: Instalável em dispositivos móveis e desktop
- 🏃‍♂️ **Templates Prontos**: Catálogo de treinos por objetivo e nível
- 📊 **Acompanhamento**: Estatísticas e progresso detalhados
- 🖨️ **Impressão**: Geração de fichas compactas em PDF para academia 
- 📁 **Import/Export**: Backup e portabilidade de dados (LGPD compliant)
- 📅 **Calendário**: Visualização de treinos planejados e realizados

## Tecnologias Utilizadas

- **Framework**: Next.js 15+ com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: IndexedDB (client-side)
- **PWA**: Service Worker nativo
- **UI/UX**: Design responsivo e acessível

## Estrutura do Projeto

```
app/
├── calendar/           # Calendário de treinos
├── data/              # Import/export de dados
├── exercises/         # Catálogo de exercícios
├── offline/           # Página offline
├── progress/          # Estatísticas e progresso
├── templates/         # Templates de treinos prontos
├── workouts/          # Gestão de treinos
│   ├── [id]/         # Execução de treino específico
│   └── [id]/print/   # Ficha para impressão
├── page.tsx          # Dashboard principal
└── globals.css       # Estilos globais

lib/
├── constants.ts      # Constantes do sistema
├── indexeddb.ts      # Camada de dados IndexedDB
├── pdf-generator.ts  # Geração de PDFs
├── types.ts          # Tipos TypeScript
└── workout-templates.ts # Templates predefinidos
```

## Funcionalidades por Módulo

### 🏠 Dashboard (`app/page.tsx`)
- Página inicial com cards de navegação
- Overview dos recursos disponíveis
- Links rápidos para principais funcionalidades

### 🏃‍♂️ Templates (`app/templates/page.tsx`)
- **Catálogo pré-definido** de treinos por especialistas
- **Filtros** por objetivo (hipertrofia, força, cardio, etc.) e nível
- **Templates disponíveis**:
  - Hipertrofia (peito/tríceps, pernas)
  - Força (powerlifting)
  - Iniciante (full body)
  - HIIT/Cardio
  - Reabilitação
  - Resistência
  - Saúde (55+ anos)

### 💪 Exercícios (`app/exercises/page.tsx`)
- **Catálogo completo** de exercícios
- **Filtros avançados** por grupo muscular, equipamento, nível
- **Informações detalhadas**: instruções, músculos trabalhados, tags
- **Integração** com criação de treinos

### 🏋️‍♂️ Treinos (`app/workouts/page.tsx`)
- **Criação** de treinos personalizados
- **Gestão completa** de estrutura (blocos, exercícios, séries)
- **Execução** com timer de descanso e registro de séries
- **Geração de PDF** para impressão

### 📊 Progresso (`app/progress/page.tsx`)
- **Estatísticas gerais**: treinos realizados, séries, volume total
- **Frequência** por grupo muscular
- **Gráfico** de evolução do volume semanal
- **Filtros** por período (7, 30, 90, 365 dias)

### 📅 Calendário (`app/calendar/page.tsx`)
- **Visualização mensal** de treinos planejados e realizados
- **Navegação** entre meses
- **Estatísticas** do mês atual
- **Códigos visuais**: 📋 planejado, ✅ realizado

### 📁 Dados (`app/data/page.tsx`)
- **Export completo** ou por escopo (JSON)
- **Import** com validação
- **Compatibilidade LGPD** para portabilidade
- **Arquivo de exemplo** para referência

## Modelo de Dados

### Exercise (Exercício)
```typescript
interface Exercise {
  id: string;
  nome: string;
  gruposMusculares: string[];
  equipamento?: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  instrucoes?: string[];
  tags?: string[];
  // ... outros campos
}
```

### Workout (Treino)
```typescript
interface Workout {
  id: string;
  nome?: string;
  dataPlanejada?: string;
  blocos: WorkoutBlock[];
  notas?: string;
  // ... metadados
}

interface WorkoutBlock {
  tipo: "aquecimento" | "principal" | "acessorio" | "mobilidade";
  exercicios: WorkoutExercise[];
}
```

### LogEntry (Log de Execução)
```typescript
interface LogEntry {
  workoutId: string;
  dataRealizada: string;
  setsRealizados: {
    exerciseId: string;
    serieIndex: number;
    reps: number;
    cargaKg?: number;
    rpe?: number;
  }[];
  observacoes?: string;
}
```

## Execução de Treino

### Fluxo Completo
1. **Seleção** do treino no calendário ou lista
2. **Navegação** sequencial entre exercícios
3. **Timer automático** de descanso entre séries
4. **Registro** de repetições, carga e RPE
5. **Finalização** com salvamento automático do log

### Recursos de Execução
- ⏱️ **Timer de descanso** configurável por série
- 📝 **Registro detalhado** de cada série realizada
- 📋 **Instruções** de execução visíveis
- ⚡ **Navegação rápida** entre exercícios
- 🎯 **Tracking de progresso** em tempo real

## Impressão e PDF

### Ficha de Treino (`app/workouts/[id]/print/page.tsx`)
- **Layout otimizado** para impressão A4
- **Tabelas organizadas** por exercício e série
- **Campos para anotação** manual (carga, RPE, observações)
- **Instruções detalhadas** de cada exercício
- **Informações do aluno** (nome, peso, horários)

### Características da Ficha
- 📄 **Formato profissional** similar a academias
- ✅ **Checkboxes** para marcar séries concluídas
- 📝 **Espaço para observações** em cada série
- 🏷️ **Organização visual** por blocos de treino
- 🖨️ **Otimização** para impressão (cores, espaçamento)

## Offline e PWA

### Estratégia Offline-First
- **IndexedDB** como banco principal
- **Funcionamento completo** sem internet
- **Sincronização** automática quando online
- **Cache** de todos os recursos estáticos

### Recursos PWA
- **Instalação** em dispositivos
- **Ícones** e splash screens
- **Notificações** (futuro)
- **Background sync** (futuro)

## Templates de Treino

### Categorias Disponíveis
- **Hipertrofia**: Volume moderado/alto, 8-15 repetições
- **Força**: Cargas altas, 1-5 repetições, descanso longo
- **Cardio/HIIT**: Intervalos, alta intensidade, peso corporal
- **Iniciante**: Movimentos básicos, foco na técnica
- **Reabilitação**: Movimentos seguros, baixa intensidade
- **Resistência**: Circuitos, múltiplos exercícios
- **Saúde Geral**: Manutenção, 55+ anos

### Estrutura dos Templates
- **Metadados**: objetivo, nível, duração, frequência
- **Blocos organizados**: aquecimento, principal, acessório
- **Progressão sugerida**: cargas e repetições
- **Notas explicativas**: como executar e progredir

## Import/Export de Dados

### Formato JSON
```json
{
  "version": "1.0",
  "exportedAt": "2024-01-01T00:00:00Z",
  "catalog": [...exercises],
  "workouts": [...workouts],
  "logs": [...logEntries]
}
```

### Escopos de Export
- **Completo**: todos os dados
- **Catálogo**: apenas exercícios
- **Treinos**: apenas treinos criados
- **Logs**: apenas histórico de execução

### Validação de Import
- **Schema validation** do JSON
- **Verificação** de integridade
- **Relatório** de erros detalhado
- **Preview** antes da importação

## Próximos Passos e Melhorias

### Recursos Planejados
- 📱 **App mobile nativo** (React Native)
- ☁️ **Sincronização** entre dispositivos
- 👥 **Compartilhamento** de treinos
- 📈 **Análises avançadas** e insights
- 🔔 **Notificações** e lembretes
- 🎯 **Metas** e desafios personalizados

### Melhorias Técnicas
- **Testes automatizados** (Jest, Cypress)
- **CI/CD pipeline** com GitHub Actions
- **Monitoramento** de performance
- **Analytics** de uso
- **SEO** e acessibilidade aprimorados

## Como Contribuir

### Setup Local
```bash
npm install
npm run dev
```

### Padrões de Código
- **TypeScript strict** mode
- **ESLint** e **Prettier** configurados
- **Conventional commits** para mensagens
- **Components** pequenos e reutilizáveis

### Estrutura de Commits
- `feat:` novas funcionalidades
- `fix:` correções de bugs
- `docs:` documentação
- `style:` formatação
- `refactor:` reestruturação
- `test:` testes

## Licença e Uso

Este é um projeto de **código aberto** desenvolvido para fins educacionais e de demonstração. Sinta-se livre para utilizar, modificar e distribuir de acordo com suas necessidades.

---

**Desenvolvido com ❤️ para a comunidade fitness**