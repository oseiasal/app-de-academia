import { User } from '@/lib/types';

export const MOCK_USER: User = {
  id: 'user-1',
  perfil: 'aluno',
  preferencias: {},
  fisiologia: {
    altura: 180,
    peso: 80,
  },
  prs: {
    'ex-supino-reto': 100,
    'ex-agachamento-livre': 120,
    'ex-terra': 150,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
