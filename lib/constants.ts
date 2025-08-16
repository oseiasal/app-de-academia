// Constantes baseadas nas especificações do claude.md

export const GRUPOS_MUSCULARES = [
  "peito",
  "costas", 
  "ombros",
  "bíceps",
  "tríceps",
  "quadríceps",
  "isquiotibiais",
  "glúteos",
  "panturrilha",
  "core",
  "antebraço",
  "lombar"
] as const;

export const EQUIPAMENTOS = [
  "peso livre",
  "halteres",
  "barra",
  "máquinas guiadas",
  "cabos",
  "kettlebell",
  "elásticos",
  "peso corporal",
  "esteira",
  "bike",
  "remo",
  "bola",
  "rolo"
] as const;

export const NIVEIS = ["iniciante", "intermediario", "avancado"] as const;

export const TIPOS_SERIE = [
  "padrão",
  "amrap",
  "emom", 
  "intervalado",
  "drop",
  "superset",
  "pirâmide"
] as const;

export const TIPOS_BLOCO = [
  "aquecimento",
  "principal", 
  "acessorio",
  "mobilidade"
] as const;

export const PERFIS_USUARIO = ["aluno", "pt", "admin"] as const;

export const TAGS_EXERCICIO = [
  "força",
  "hipertrofia",
  "mobilidade",
  "cardio",
  "explosão",
  "resistência"
] as const;