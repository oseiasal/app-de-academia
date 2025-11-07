import { Exercise } from '@/lib/types';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-agachamento-livre',
    nome: 'Agachamento Livre',
    gruposMusculares: ['quadríceps', 'glúteos', 'posteriores'],
    equipamento: 'barra',
    nivel: 'intermediario',
    instrucoes: [
      'Posicione a barra nos ombros, com os pés na largura dos ombros.',
      'Agache até que as coxas fiquem paralelas ao chão, mantendo a coluna reta.',
      'Retorne à posição inicial, estendendo os joelhos e o quadril.'
    ],
    tags: ['força', 'hipertrofia', 'pernas'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-supino-reto',
    nome: 'Supino Reto',
    gruposMusculares: ['peitoral', 'tríceps', 'ombros'],
    equipamento: 'barra',
    nivel: 'intermediario',
    instrucoes: [
      'Deite-se no banco com os pés no chão e a barra na altura dos olhos.',
      'Pegue a barra com as mãos um pouco mais afastadas que a largura dos ombros.',
      'Desça a barra até o peito e empurre de volta à posição inicial.'
    ],
    tags: ['força', 'hipertrofia', 'peito'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-terra',
    nome: 'Levantamento Terra',
    gruposMusculares: ['posteriores', 'glúteos', 'costas', 'lombar'],
    equipamento: 'barra',
    nivel: 'avancado',
    instrucoes: [
      'Posicione a barra no chão, com os pés por baixo dela.',
      'Agache e pegue a barra com as mãos na largura dos ombros.',
      'Levante a barra, estendendo os joelhos e o quadril, mantendo as costas retas.',
      'Desça a barra de volta ao chão de forma controlada.'
    ],
    tags: ['força', 'powerlifting', 'costas'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-flexao',
    nome: 'Flexão de Braço',
    gruposMusculares: ['peitoral', 'tríceps', 'ombros'],
    equipamento: 'peso corporal',
    nivel: 'iniciante',
    instrucoes: [
      'Comece em posição de prancha, com as mãos na largura dos ombros.',
      'Desça o corpo até que o peito quase toque o chão.',
      'Empurre de volta à posição inicial.'
    ],
    tags: ['calistenia', 'peito', 'iniciante'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-polichinelo',
    nome: 'Polichinelo',
    gruposMusculares: ['cardio', 'corpo todo'],
    equipamento: 'peso corporal',
    nivel: 'iniciante',
    instrucoes: [
      'Comece em pé, com os pés juntos e os braços ao lado do corpo.',
      'Salte, afastando as pernas e levantando os braços acima da cabeça.',
      'Retorne à posição inicial.'
    ],
    tags: ['cardio', 'aquecimento'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-burpee',
    nome: 'Burpee',
    gruposMusculares: ['cardio', 'corpo todo'],
    equipamento: 'peso corporal',
    nivel: 'intermediario',
    instrucoes: [
      'Comece em pé, agache e coloque as mãos no chão.',
      'Salte para a posição de prancha, faça uma flexão.',
      'Salte de volta para a posição agachada e, em seguida, salte para o ar.'
    ],
    tags: ['cardio', 'hiit', 'corpo todo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-prancha',
    nome: 'Prancha',
    gruposMusculares: ['core', 'abdômen'],
    equipamento: 'peso corporal',
    nivel: 'iniciante',
    instrucoes: [
      'Mantenha o corpo em linha reta, apoiado nos antebraços e nos dedos dos pés.',
      'Contraia o abdômen e os glúteos.'
    ],
    tags: ['core', 'isometria', 'abdômen'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
