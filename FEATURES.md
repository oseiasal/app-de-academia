# Funcionalidades do App de Academia

## Visão Geral

O **App de Academia** é uma aplicação web Progressive Web App (PWA) focada em treinos personalizados e offline-first.

## Funcionalidades Principais

- **Funcionamento Offline**: O aplicativo funciona completamente sem conexão com a internet, armazenando todos os dados no dispositivo do usuário.
- **Progressive Web App (PWA)**: Pode ser instalado em dispositivos móveis e desktops para uma experiência de aplicativo nativo.
- **Templates de Treino**: Oferece um catálogo de treinos pré-definidos para diferentes objetivos e níveis de habilidade.
- **Acompanhamento de Progresso**: Fornece estatísticas detalhadas e gráficos para acompanhar a evolução do usuário.
- **Impressão de Fichas**: Permite gerar fichas de treino em formato PDF, otimizadas para impressão.
- **Importação e Exportação de Dados**: Oferece funcionalidades para backup e portabilidade dos dados do usuário.
- **Calendário de Treinos**: Apresenta uma visualização de treinos planejados e realizados.

## Detalhamento das Funcionalidades

### Dashboard
- Página inicial com acesso rápido às principais funcionalidades.
- Visão geral dos recursos disponíveis no aplicativo.

### Templates de Treino
- Catálogo de treinos criados por especialistas.
- Filtros por objetivo (hipertrofia, força, cardio), nível e outros.
- Templates para diversos tipos de treino, como hipertrofia, força, iniciante, HIIT, reabilitação e mais.

### Exercícios
- Catálogo completo de exercícios.
- Filtros por grupo muscular, equipamento e nível de dificuldade.
- Informações detalhadas sobre cada exercício, incluindo instruções e músculos trabalhados.

### Gestão de Treinos
- Criação de treinos personalizados.
- Organização de treinos em blocos (aquecimento, principal, etc.).
- Execução de treinos com cronômetro de descanso e registro de séries.
- Geração de PDF para impressão da ficha de treino.

### Acompanhamento de Progresso
- Estatísticas sobre treinos realizados, séries e volume total.
- Gráficos de frequência por grupo muscular.
- Análise da evolução do volume semanal.
- Filtros por período de tempo (7, 30, 90, 365 dias).

### Calendário
- Visualização mensal de treinos.
- Navegação entre meses.
- Estatísticas do mês atual.
- Indicadores visuais para treinos planejados e realizados.

### Importação e Exportação de Dados
- Exportação de dados em formato JSON.
- Opção de exportar todos os dados ou apenas partes específicas (catálogo, treinos, logs).
- Importação de dados com validação de arquivo.
- Arquivo de exemplo para referência.

#### Formato do JSON
```json
{
  "version": "1.0",
  "exportedAt": "2024-01-01T00:00:00Z",
  "catalog": [...exercises],
  "workouts": [...workouts],
  "logs": [...logEntries]
}
```


## Funcionalidades Técnicas

- **Offline-First**: Utiliza IndexedDB para armazenamento de dados no lado do cliente.
- **PWA**: Suporte a Service Workers para funcionamento offline e instalação.
- **Next.js com App Router**: Arquitetura moderna de renderização no servidor e no cliente.
- **TypeScript**: Tipagem estática para maior segurança e manutenibilidade do código.
- **Tailwind CSS**: Framework de estilização para um design responsivo e customizável.
- **Geração de PDF**: Funcionalidade para criar documentos PDF no lado do cliente.
