import { Exercise, Workout, LogEntry, User } from './types';

// Repository in-memory para desenvolvimento
class InMemoryRepository {
  private exercises: Exercise[] = [];
  private workouts: Workout[] = [];
  private logs: LogEntry[] = [];
  private users: User[] = [];

  // Exercícios
  getAllExercises(): Exercise[] {
    return [...this.exercises];
  }

  getExerciseById(id: string): Exercise | undefined {
    return this.exercises.find(ex => ex.id === id);
  }

  createExercise(exercise: Omit<Exercise, 'createdAt' | 'updatedAt'>): Exercise {
    const now = new Date().toISOString();
    const newExercise: Exercise = {
      ...exercise,
      createdAt: now,
      updatedAt: now
    };
    this.exercises.push(newExercise);
    return newExercise;
  }

  updateExercise(id: string, updates: Partial<Exercise>): Exercise | null {
    const index = this.exercises.findIndex(ex => ex.id === id);
    if (index === -1) return null;
    
    this.exercises[index] = {
      ...this.exercises[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.exercises[index];
  }

  deleteExercise(id: string): boolean {
    const index = this.exercises.findIndex(ex => ex.id === id);
    if (index === -1) return false;
    this.exercises.splice(index, 1);
    return true;
  }

  searchExercises(filters: {
    muscle?: string;
    equipment?: string;
    level?: string;
    query?: string;
  }): Exercise[] {
    return this.exercises.filter(exercise => {
      if (filters.muscle && !exercise.gruposMusculares.includes(filters.muscle)) {
        return false;
      }
      if (filters.equipment && exercise.equipamento !== filters.equipment) {
        return false;
      }
      if (filters.level && exercise.nivel !== filters.level) {
        return false;
      }
      if (filters.query && !exercise.nome.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  // Treinos
  getAllWorkouts(): Workout[] {
    return [...this.workouts];
  }

  getWorkoutById(id: string): Workout | undefined {
    return this.workouts.find(w => w.id === id);
  }

  createWorkout(workout: Omit<Workout, 'createdAt' | 'updatedAt'>): Workout {
    const now = new Date().toISOString();
    const newWorkout: Workout = {
      ...workout,
      createdAt: now,
      updatedAt: now
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  updateWorkout(id: string, updates: Partial<Workout>): Workout | null {
    const index = this.workouts.findIndex(w => w.id === id);
    if (index === -1) return null;
    
    this.workouts[index] = {
      ...this.workouts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.workouts[index];
  }

  deleteWorkout(id: string): boolean {
    const index = this.workouts.findIndex(w => w.id === id);
    if (index === -1) return false;
    this.workouts.splice(index, 1);
    return true;
  }

  // Logs
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByWorkout(workoutId: string): LogEntry[] {
    return this.logs.filter(log => log.workoutId === workoutId);
  }

  createLog(log: Omit<LogEntry, 'createdAt'>): LogEntry {
    const newLog: LogEntry = {
      ...log,
      createdAt: new Date().toISOString()
    };
    this.logs.push(newLog);
    return newLog;
  }

  getLogsByDateRange(from: string, to: string): LogEntry[] {
    return this.logs.filter(log => 
      log.dataRealizada >= from && log.dataRealizada <= to
    );
  }

  // Usuários
  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  // Utilitários
  exportData(scope: 'all' | 'catalog' | 'workouts' | 'logs' = 'all') {
    const data: any = {
      version: "1.0.0",
      exportedAt: new Date().toISOString()
    };

    if (scope === 'all' || scope === 'catalog') {
      data.catalog = this.exercises;
    }
    if (scope === 'all' || scope === 'workouts') {
      data.workouts = this.workouts;
    }
    if (scope === 'all' || scope === 'logs') {
      data.logs = this.logs;
    }

    return data;
  }

  importData(data: any): { success: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      console.log('Importando dados:', data);
      
      if (data.catalog && Array.isArray(data.catalog)) {
        data.catalog.forEach((exercise: any, index: number) => {
          try {
            // Validar campos obrigatórios
            if (!exercise.id || !exercise.nome || !exercise.gruposMusculares) {
              errors.push(`Exercício ${index + 1}: campos obrigatórios ausentes (id, nome, gruposMusculares)`);
              return;
            }

            const existing = this.getExerciseById(exercise.id);
            if (!existing) {
              // Garantir que tem campos obrigatórios de timestamp
              const exerciseWithTimestamps = {
                ...exercise,
                createdAt: exercise.createdAt || new Date().toISOString(),
                updatedAt: exercise.updatedAt || new Date().toISOString()
              };
              this.exercises.push(exerciseWithTimestamps);
            }
          } catch (err) {
            errors.push(`Erro no exercício ${index + 1}: ${err}`);
          }
        });
      }

      if (data.workouts && Array.isArray(data.workouts)) {
        data.workouts.forEach((workout: any, index: number) => {
          try {
            if (!workout.id || !workout.blocos) {
              errors.push(`Treino ${index + 1}: campos obrigatórios ausentes (id, blocos)`);
              return;
            }

            const existing = this.getWorkoutById(workout.id);
            if (!existing) {
              const workoutWithTimestamps = {
                ...workout,
                createdAt: workout.createdAt || new Date().toISOString(),
                updatedAt: workout.updatedAt || new Date().toISOString()
              };
              this.workouts.push(workoutWithTimestamps);
            }
          } catch (err) {
            errors.push(`Erro no treino ${index + 1}: ${err}`);
          }
        });
      }

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((log: any, index: number) => {
          try {
            if (!log.workoutId || !log.dataRealizada) {
              errors.push(`Log ${index + 1}: campos obrigatórios ausentes (workoutId, dataRealizada)`);
              return;
            }

            const logWithTimestamp = {
              ...log,
              createdAt: log.createdAt || new Date().toISOString()
            };
            this.logs.push(logWithTimestamp);
          } catch (err) {
            errors.push(`Erro no log ${index + 1}: ${err}`);
          }
        });
      }

      return { success: errors.length === 0, errors };
    } catch (error) {
      console.error('Erro na importação:', error);
      errors.push(`Erro na importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return { success: false, errors };
    }
  }

  // Seed data para desenvolvimento
  seedData() {
    // Exercícios básicos
    const exerciciosBasicos: Omit<Exercise, 'createdAt' | 'updatedAt'>[] = [
      {
        id: "ex-supino-reto",
        nome: "Supino Reto",
        gruposMusculares: ["peito", "tríceps", "ombros"],
        equipamento: "barra",
        nivel: "intermediario",
        tags: ["força", "hipertrofia"],
        instrucoes: [
          "Deite no banco com os pés firmes no chão",
          "Segure a barra com pegada ligeiramente mais larga que os ombros",
          "Desça a barra controladamente até o peito",
          "Empurre a barra para cima explosivamente"
        ]
      },
      {
        id: "ex-agachamento-livre",
        nome: "Agachamento Livre",
        gruposMusculares: ["quadríceps", "glúteos", "core"],
        equipamento: "barra",
        nivel: "intermediario",
        tags: ["força", "hipertrofia"],
        instrucoes: [
          "Posicione a barra no trapézio",
          "Pés na largura dos ombros",
          "Desça até 90 graus nos joelhos",
          "Suba empurrando pelos calcanhares"
        ]
      },
      {
        id: "ex-flexao",
        nome: "Flexão de Braço",
        gruposMusculares: ["peito", "tríceps", "ombros"],
        equipamento: "peso corporal",
        nivel: "iniciante",
        tags: ["força", "hipertrofia"],
        instrucoes: [
          "Apoie as mãos no chão na largura dos ombros",
          "Mantenha o corpo reto",
          "Desça até quase tocar o peito no chão",
          "Empurre para cima até estender os braços"
        ]
      }
    ];

    exerciciosBasicos.forEach(ex => this.createExercise(ex));

    // Usuário exemplo
    this.createUser({
      id: "user-1",
      perfil: "aluno",
      fisiologia: {
        altura: 175,
        peso: 75
      }
    });
  }
}

// Instância singleton
export const repository = new InMemoryRepository();

// Inicializar com dados de exemplo
repository.seedData();