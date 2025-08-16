// Tipos baseados no modelo de dados do claude.md

export interface Exercise {
  id: string;
  nome: string;
  gruposMusculares: string[];
  equipamento?: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  midia?: {
    imagemUrl?: string;
    videoUrl?: string;
  };
  instrucoes?: string[];
  variacoes?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Set {
  tipoSerie: "padrão" | "amrap" | "emom" | "intervalado" | "drop" | "superset" | "pirâmide";
  reps?: number;
  repsMin?: number;
  repsMax?: number;
  cargaKg?: number;
  "%1rm"?: number;
  tempoSeg?: number;
  distanciaM?: number;
  rir?: number;
  rpe?: number;
  descansoSeg?: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  observacoes?: string;
  regrasProgressaoId?: string;
  series: Set[];
}

export interface WorkoutBlock {
  tipo: "aquecimento" | "principal" | "acessorio" | "mobilidade";
  exercicios: WorkoutExercise[];
}

export interface Workout {
  id: string;
  nome?: string;
  dataPlanejada?: string;
  blocos: WorkoutBlock[];
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogEntry {
  workoutId: string;
  dataRealizada: string;
  setsRealizados: {
    exerciseId: string;
    serieIndex: number;
    reps: number;
    cargaKg?: number;
    tempoSeg?: number;
    rpe?: number;
  }[];
  observacoes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  perfil: "aluno" | "pt" | "admin";
  preferencias?: object;
  fisiologia?: {
    altura?: number;
    peso?: number;
    medidas?: Record<string, number>;
  };
  prs?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}