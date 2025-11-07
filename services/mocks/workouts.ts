import { Workout } from '@/lib/types';
import { WORKOUT_TEMPLATES } from '@/lib/workout-templates';

export const MOCK_WORKOUTS: Workout[] = WORKOUT_TEMPLATES.map((template, index) => ({
  id: `workout-${index + 1}`,
  nome: template.workout.nome,
  blocos: template.workout.blocos,
  notas: template.workout.notas,
  dataPlanejada: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
