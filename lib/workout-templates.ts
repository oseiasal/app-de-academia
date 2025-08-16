import { Workout } from './types';

export interface WorkoutTemplate {
  id: string;
  nome: string;
  objetivo: 'hipertrofia' | 'força' | 'resistência' | 'saúde' | 'rehab' | 'cardio';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracaoMinutos: number;
  frequenciaSemanal: number;
  descricao: string;
  workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'dataPlanejada'>;
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // HIPERTROFIA
  {
    id: 'template-hipertrofia-peito-triceps',
    nome: 'Peito e Tríceps - Hipertrofia',
    objetivo: 'hipertrofia',
    nivel: 'intermediario',
    duracaoMinutos: 60,
    frequenciaSemanal: 2,
    descricao: 'Treino focado em hipertrofia para peito e tríceps com volume moderado/alto',
    workout: {
      nome: 'Peito e Tríceps A',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              series: [
                { tipoSerie: 'padrão', reps: 15, descansoSeg: 30 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-supino-reto',
              observacoes: 'Foco na fase excêntrica',
              series: [
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 60, descansoSeg: 90 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 60, descansoSeg: 90 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 60, descansoSeg: 90 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 60, descansoSeg: 90 }
              ]
            }
          ]
        }
      ],
      notas: 'Treino de hipertrofia - foco em volume e time under tension'
    }
  },
  
  {
    id: 'template-hipertrofia-pernas',
    nome: 'Pernas - Hipertrofia',
    objetivo: 'hipertrofia',
    nivel: 'intermediario',
    duracaoMinutos: 75,
    frequenciaSemanal: 2,
    descricao: 'Treino completo de pernas focado em hipertrofia',
    workout: {
      nome: 'Pernas A',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Apenas peso corporal',
              series: [
                { tipoSerie: 'padrão', reps: 20, descansoSeg: 30 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              series: [
                { tipoSerie: 'padrão', repsMin: 10, repsMax: 15, cargaKg: 80, descansoSeg: 120 },
                { tipoSerie: 'padrão', repsMin: 10, repsMax: 15, cargaKg: 80, descansoSeg: 120 },
                { tipoSerie: 'padrão', repsMin: 10, repsMax: 15, cargaKg: 80, descansoSeg: 120 },
                { tipoSerie: 'padrão', repsMin: 10, repsMax: 15, cargaKg: 80, descansoSeg: 120 }
              ]
            },
            {
              exerciseId: 'ex-terra',
              observacoes: 'Progressão conservadora',
              series: [
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 100, descansoSeg: 120 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 100, descansoSeg: 120 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, cargaKg: 100, descansoSeg: 120 }
              ]
            }
          ]
        }
      ],
      notas: 'Treino de pernas - progressão semanal +2.5kg'
    }
  },

  // FORÇA
  {
    id: 'template-forca-powerlifting',
    nome: 'Powerlifting - Força',
    objetivo: 'força',
    nivel: 'avancado',
    duracaoMinutos: 90,
    frequenciaSemanal: 3,
    descricao: 'Treino de força focado nos três movimentos básicos do powerlifting',
    workout: {
      nome: 'Força A - Squat',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Aquecimento progressivo',
              series: [
                { tipoSerie: 'padrão', reps: 10, cargaKg: 40, descansoSeg: 60 },
                { tipoSerie: 'padrão', reps: 5, cargaKg: 60, descansoSeg: 90 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Trabalho pesado - 85-95% 1RM',
              series: [
                { tipoSerie: 'padrão', reps: 5, cargaKg: 100, descansoSeg: 180 },
                { tipoSerie: 'padrão', reps: 3, cargaKg: 110, descansoSeg: 180 },
                { tipoSerie: 'padrão', reps: 1, cargaKg: 120, descansoSeg: 300 }
              ]
            }
          ]
        }
      ],
      notas: 'Treino de força - foco em 1RM. Descanso completo entre séries.'
    }
  },

  // INICIANTE
  {
    id: 'template-iniciante-fullbody',
    nome: 'Full Body - Iniciante',
    objetivo: 'saúde',
    nivel: 'iniciante',
    duracaoMinutos: 45,
    frequenciaSemanal: 3,
    descricao: 'Treino completo para iniciantes trabalhando corpo todo',
    workout: {
      nome: 'Full Body A',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Pode ser feito nos joelhos se necessário',
              series: [
                { tipoSerie: 'padrão', repsMin: 5, repsMax: 10, descansoSeg: 60 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Foco na técnica - começar sem peso',
              series: [
                { tipoSerie: 'padrão', reps: 12, cargaKg: 20, descansoSeg: 90 },
                { tipoSerie: 'padrão', reps: 12, cargaKg: 20, descansoSeg: 90 }
              ]
            },
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Progressão gradual',
              series: [
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, descansoSeg: 90 },
                { tipoSerie: 'padrão', repsMin: 8, repsMax: 12, descansoSeg: 90 }
              ]
            }
          ]
        },
        {
          tipo: 'mobilidade',
          exercicios: []
        }
      ],
      notas: 'Treino para iniciantes - foco em aprender movimento e criar hábito'
    }
  },

  // CARDIO/RESISTÊNCIA
  {
    id: 'template-hiit-cardio',
    nome: 'HIIT - Cardio',
    objetivo: 'cardio',
    nivel: 'intermediario',
    duracaoMinutos: 30,
    frequenciaSemanal: 4,
    descricao: 'Treino intervalado de alta intensidade usando peso corporal',
    workout: {
      nome: 'HIIT Peso Corporal',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Aquecimento dinâmico',
              series: [
                { tipoSerie: 'padrão', reps: 10, descansoSeg: 30 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Máximo de repetições em 30 segundos',
              series: [
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 90 }
              ]
            },
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Explosivo na subida',
              series: [
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 30 },
                { tipoSerie: 'amrap', tempoSeg: 30, descansoSeg: 90 }
              ]
            }
          ]
        }
      ],
      notas: 'HIIT - 4 rounds de 30s work / 30s rest. Última série de cada exercício 90s rest.'
    }
  },

  // REABILITAÇÃO
  {
    id: 'template-rehab-lombar',
    nome: 'Reabilitação Lombar',
    objetivo: 'rehab',
    nivel: 'iniciante',
    duracaoMinutos: 30,
    frequenciaSemanal: 5,
    descricao: 'Exercícios de mobilidade e fortalecimento para região lombar',
    workout: {
      nome: 'Rehab Lombar',
      blocos: [
        {
          tipo: 'mobilidade',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Movimento lento e controlado - amplitude parcial',
              series: [
                { tipoSerie: 'padrão', reps: 15, descansoSeg: 45 },
                { tipoSerie: 'padrão', reps: 15, descansoSeg: 45 }
              ]
            }
          ]
        }
      ],
      notas: 'Reabilitação - NUNCA force amplitude ou carga. Pare se sentir dor.'
    }
  },

  // RESISTÊNCIA  
  {
    id: 'template-resistencia-circuito',
    nome: 'Circuito de Resistência',
    objetivo: 'resistência',
    nivel: 'intermediario',
    duracaoMinutos: 40,
    frequenciaSemanal: 3,
    descricao: 'Circuito funcional para melhorar resistência muscular e cardiovascular',
    workout: {
      nome: 'Circuito Funcional',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-polichinelo',
              series: [
                { tipoSerie: 'padrão', reps: 30, descansoSeg: 30 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-burpee',
              observacoes: 'Circuito - sem descanso entre exercícios',
              series: [
                { tipoSerie: 'padrão', reps: 10, descansoSeg: 0 }
              ]
            },
            {
              exerciseId: 'ex-flexao',
              series: [
                { tipoSerie: 'padrão', reps: 15, descansoSeg: 0 }
              ]
            },
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Peso corporal apenas',
              series: [
                { tipoSerie: 'padrão', reps: 20, descansoSeg: 0 }
              ]
            },
            {
              exerciseId: 'ex-prancha',
              series: [
                { tipoSerie: 'padrão', tempoSeg: 30, descansoSeg: 120 }
              ]
            }
          ]
        }
      ],
      notas: 'Circuito: 3-4 rounds completos. Descanso apenas após último exercício.'
    }
  },

  // SAÚDE GERAL
  {
    id: 'template-saude-55plus',
    nome: 'Saúde - 55+ Anos',
    objetivo: 'saúde',
    nivel: 'iniciante',
    duracaoMinutos: 35,
    frequenciaSemanal: 3,
    descricao: 'Treino suave para manutenção da saúde e mobilidade em pessoas 55+',
    workout: {
      nome: 'Saúde e Mobilidade',
      blocos: [
        {
          tipo: 'mobilidade',
          exercicios: [
            {
              exerciseId: 'ex-agachamento-livre',
              observacoes: 'Movimento lento - amplitude confortável',
              series: [
                { tipoSerie: 'padrão', reps: 10, descansoSeg: 45 },
                { tipoSerie: 'padrão', reps: 10, descansoSeg: 45 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Pode ser na parede ou inclinado',
              series: [
                { tipoSerie: 'padrão', repsMin: 5, repsMax: 10, descansoSeg: 90 },
                { tipoSerie: 'padrão', repsMin: 5, repsMax: 10, descansoSeg: 90 }
              ]
            },
            {
              exerciseId: 'ex-prancha',
              observacoes: 'Progredir gradualmente no tempo',
              series: [
                { tipoSerie: 'padrão', tempoSeg: 20, descansoSeg: 60 },
                { tipoSerie: 'padrão', tempoSeg: 20, descansoSeg: 60 }
              ]
            }
          ]
        }
      ],
      notas: 'Foco na qualidade do movimento e bem-estar. Adapte conforme necessário.'
    }
  },

  // FORÇA AVANÇADA
  {
    id: 'template-forca-powerlifting-bench',
    nome: 'Powerlifting - Supino',
    objetivo: 'força',
    nivel: 'avancado',
    duracaoMinutos: 75,
    frequenciaSemanal: 1,
    descricao: 'Sessão focada em força máxima no supino reto',
    workout: {
      nome: 'Força B - Supino',
      blocos: [
        {
          tipo: 'aquecimento',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Ativação do peitoral',
              series: [
                { tipoSerie: 'padrão', reps: 15, descansoSeg: 60 }
              ]
            },
            {
              exerciseId: 'ex-supino-reto',
              observacoes: 'Aquecimento progressivo',
              series: [
                { tipoSerie: 'padrão', reps: 10, cargaKg: 40, descansoSeg: 90 },
                { tipoSerie: 'padrão', reps: 5, cargaKg: 60, descansoSeg: 120 }
              ]
            }
          ]
        },
        {
          tipo: 'principal',
          exercicios: [
            {
              exerciseId: 'ex-supino-reto',
              observacoes: 'Trabalho pesado - 85-100% 1RM',
              series: [
                { tipoSerie: 'padrão', reps: 5, cargaKg: 85, descansoSeg: 180 },
                { tipoSerie: 'padrão', reps: 3, cargaKg: 95, descansoSeg: 240 },
                { tipoSerie: 'padrão', reps: 1, cargaKg: 105, descansoSeg: 300 },
                { tipoSerie: 'padrão', reps: 1, cargaKg: 110, descansoSeg: 300 }
              ]
            }
          ]
        },
        {
          tipo: 'acessorio',
          exercicios: [
            {
              exerciseId: 'ex-flexao',
              observacoes: 'Volume para hipertrofia',
              series: [
                { tipoSerie: 'amrap', reps: 15, descansoSeg: 60 },
                { tipoSerie: 'amrap', reps: 15, descansoSeg: 60 }
              ]
            }
          ]
        }
      ],
      notas: 'Treino de força máxima - focar em técnica perfeita e descanso completo.'
    }
  }
];

export function getTemplatesByObjective(objetivo: string): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter(template => template.objetivo === objetivo);
}

export function getTemplatesByLevel(nivel: string): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter(template => template.nivel === nivel);
}

export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return WORKOUT_TEMPLATES.find(template => template.id === id);
}