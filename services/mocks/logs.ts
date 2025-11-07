import { LogEntry } from '@/lib/types';

export const MOCK_LOGS: LogEntry[] = [
  {
    workoutId: 'workout-1',
    dataRealizada: new Date().toISOString(),
    setsRealizados: [
      {
        exerciseId: 'ex-supino-reto',
        serieIndex: 0,
        reps: 12,
        cargaKg: 60,
      },
      {
        exerciseId: 'ex-supino-reto',
        serieIndex: 1,
        reps: 10,
        cargaKg: 60,
      },
      {
        exerciseId: 'ex-supino-reto',
        serieIndex: 2,
        reps: 8,
        cargaKg: 60,
      },
    ],
    observacoes: 'Senti uma pequena dor no ombro.',
    createdAt: new Date().toISOString(),
  },
  {
    workoutId: 'workout-2',
    dataRealizada: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    setsRealizados: [
      {
        exerciseId: 'ex-agachamento-livre',
        serieIndex: 0,
        reps: 15,
        cargaKg: 80,
      },
      {
        exerciseId: 'ex-agachamento-livre',
        serieIndex: 1,
        reps: 12,
        cargaKg: 80,
      },
      {
        exerciseId: 'ex-terra',
        serieIndex: 0,
        reps: 10,
        cargaKg: 100,
      },
    ],
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
];
