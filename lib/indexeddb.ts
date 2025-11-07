import { Exercise, Workout, LogEntry } from './types';

const DB_NAME = 'AcademiaAppDB';
const DB_VERSION = 1;

interface ExportData {
  version: string;
  exportedAt: string;
  catalog?: Exercise[];
  workouts?: Workout[];
  logs?: LogEntry[];
}

class IndexedDBRepository {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para exercícios
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
          exerciseStore.createIndex('nome', 'nome', { unique: false });
          exerciseStore.createIndex('nivel', 'nivel', { unique: false });
          exerciseStore.createIndex('equipamento', 'equipamento', { unique: false });
        }

        // Store para treinos
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
          workoutStore.createIndex('nome', 'nome', { unique: false });
          workoutStore.createIndex('dataPlanejada', 'dataPlanejada', { unique: false });
        }

        // Store para logs
        if (!db.objectStoreNames.contains('logs')) {
          const logStore = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
          logStore.createIndex('workoutId', 'workoutId', { unique: false });
          logStore.createIndex('dataRealizada', 'dataRealizada', { unique: false });
        }

        // Store para usuários
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
      };
    });
  }

  // Exercícios
  async getAllExercises(): Promise<Exercise[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['exercises'], 'readonly');
      const store = transaction.objectStore('exercises');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getExerciseById(id: string): Promise<Exercise | undefined> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['exercises'], 'readonly');
      const store = transaction.objectStore('exercises');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createExercise(exercise: Omit<Exercise, 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const newExercise: Exercise = {
      ...exercise,
      createdAt: now,
      updatedAt: now
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['exercises'], 'readwrite');
      const store = transaction.objectStore('exercises');
      const request = store.add(newExercise);

      request.onsuccess = () => resolve(newExercise);
      request.onerror = () => reject(request.error);
    });
  }

  async searchExercises(filters: {
    muscle?: string;
    equipment?: string;
    level?: string;
    query?: string;
  }): Promise<Exercise[]> {
    const allExercises = await this.getAllExercises();
    
    return allExercises.filter(exercise => {
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
  async getAllWorkouts(): Promise<Workout[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['workouts'], 'readonly');
      const store = transaction.objectStore('workouts');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkoutById(id: string): Promise<Workout | undefined> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['workouts'], 'readonly');
      const store = transaction.objectStore('workouts');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createWorkout(workout: Omit<Workout, 'createdAt' | 'updatedAt'>): Promise<Workout> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const newWorkout: Workout = {
      ...workout,
      createdAt: now,
      updatedAt: now
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['workouts'], 'readwrite');
      const store = transaction.objectStore('workouts');
      const request = store.add(newWorkout);

      request.onsuccess = () => resolve(newWorkout);
      request.onerror = () => reject(request.error);
    });
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      const transaction = this.db!.transaction(['workouts'], 'readwrite');
      const store = transaction.objectStore('workouts');
      
      const getRequest = store.get(id);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const existingWorkout = getRequest.result;
        if (!existingWorkout) {
          return reject(new Error(`Treino com id ${id} não encontrado`));
        }

        const updatedWorkout = {
          ...existingWorkout,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const putRequest = store.put(updatedWorkout);
        putRequest.onsuccess = () => resolve(updatedWorkout);
        putRequest.onerror = () => reject(putRequest.error);
      };
    });
  }

  // Logs
  async getAllLogs(): Promise<LogEntry[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['logs'], 'readonly');
      const store = transaction.objectStore('logs');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createLog(log: Omit<LogEntry, 'createdAt'>): Promise<LogEntry> {
    if (!this.db) await this.init();
    
    const newLog: LogEntry = {
      ...log,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['logs'], 'readwrite');
      const store = transaction.objectStore('logs');
      const request = store.add(newLog);

      request.onsuccess = () => resolve(newLog);
      request.onerror = () => reject(request.error);
    });
  }

  // Export/Import
  async exportData(scope: 'all' | 'catalog' | 'workouts' | 'logs' = 'all'): Promise<ExportData> {
    const data: ExportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString()
    };

    if (scope === 'all' || scope === 'catalog') {
      data.catalog = await this.getAllExercises();
    }
    if (scope === 'all' || scope === 'workouts') {
      data.workouts = await this.getAllWorkouts();
    }
    if (scope === 'all' || scope === 'logs') {
      data.logs = await this.getAllLogs();
    }

    return data;
  }

  async importData(data: ExportData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      if (data.catalog && Array.isArray(data.catalog)) {
        for (const exercise of data.catalog) {
          try {
            if (!exercise.id || !exercise.nome || !exercise.gruposMusculares) {
              errors.push(`Exercício inválido: campos obrigatórios ausentes`);
              continue;
            }

            const existing = await this.getExerciseById(exercise.id);
            if (!existing) {
              await this.createExercise(exercise);
            }
          } catch (err) {
            errors.push(`Erro no exercício ${exercise.nome}: ${err}`);
          }
        }
      }

      if (data.workouts && Array.isArray(data.workouts)) {
        for (const workout of data.workouts) {
          try {
            if (!workout.id || !workout.blocos) {
              errors.push(`Treino inválido: campos obrigatórios ausentes`);
              continue;
            }

            const existing = await this.getWorkoutById(workout.id);
            if (!existing) {
              await this.createWorkout(workout);
            }
          } catch (err) {
            errors.push(`Erro no treino ${workout.nome}: ${err}`);
          }
        }
      }

      if (data.logs && Array.isArray(data.logs)) {
        for (const log of data.logs) {
          try {
            if (!log.workoutId || !log.dataRealizada) {
              errors.push(`Log inválido: campos obrigatórios ausentes`);
              continue;
            }

            await this.createLog(log);
          } catch (err) {
            errors.push(`Erro no log: ${err}`);
          }
        }
      }

      return { success: errors.length === 0, errors };
    } catch (error) {
      console.error('Erro na importação:', error);
      errors.push(`Erro na importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return { success: false, errors };
    }
  }

  // Seed data
  async seedData() {
    const exercises = await this.getAllExercises();
    if (exercises.length > 0) return; // Já tem dados

    const exerciciosBasicos = [
      {
        id: "ex-supino-reto",
        nome: "Supino Reto",
        gruposMusculares: ["peito", "tríceps", "ombros"],
        equipamento: "barra",
        nivel: "intermediario" as const,
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
        nivel: "intermediario" as const,
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
        nivel: "iniciante" as const,
        tags: ["força", "hipertrofia", "cardio"],
        instrucoes: [
          "Apoie as mãos no chão na largura dos ombros",
          "Mantenha o corpo reto",
          "Desça até quase tocar o peito no chão",
          "Empurre para cima até estender os braços"
        ]
      },
      {
        id: "ex-rosca-biceps",
        nome: "Rosca Bíceps",
        gruposMusculares: ["bíceps"],
        equipamento: "halteres",
        nivel: "iniciante" as const,
        tags: ["hipertrofia"],
        instrucoes: [
          "Fique em pé com um halter em cada mão",
          "Mantenha os cotovelos próximos ao corpo",
          "Flexione os braços controladamente",
          "Desça lentamente até a posição inicial"
        ]
      },
      {
        id: "ex-terra",
        nome: "Levantamento Terra",
        gruposMusculares: ["lombar", "glúteos", "isquiotibiais"],
        equipamento: "barra",
        nivel: "avancado" as const,
        tags: ["força"],
        instrucoes: [
          "Posicione a barra no chão",
          "Pés na largura dos quadris",
          "Segure a barra com pegada pronada",
          "Levante mantendo as costas retas"
        ]
      },
      {
        id: "ex-prancha",
        nome: "Prancha",
        gruposMusculares: ["core"],
        equipamento: "peso corporal",
        nivel: "iniciante" as const,
        tags: ["resistência", "mobilidade"],
        instrucoes: [
          "Apoie antebraços e pontas dos pés no chão",
          "Mantenha o corpo em linha reta",
          "Contraia o abdômen",
          "Respire normalmente"
        ]
      },
      {
        id: "ex-burpee",
        nome: "Burpee",
        gruposMusculares: ["peito", "ombros", "quadríceps", "core"],
        equipamento: "peso corporal",
        nivel: "intermediario" as const,
        tags: ["cardio", "explosão"],
        instrucoes: [
          "Agache e apoie as mãos no chão",
          "Estenda as pernas para trás em prancha",
          "Faça uma flexão",
          "Puxe as pernas e salte para cima"
        ]
      },
      {
        id: "ex-polichinelo",
        nome: "Polichinelo",
        gruposMusculares: ["panturrilha", "quadríceps", "ombros"],
        equipamento: "peso corporal",
        nivel: "iniciante" as const,
        tags: ["cardio"],
        instrucoes: [
          "Fique em pé com pés juntos e braços ao lado",
          "Salte abrindo pernas e levantando braços",
          "Retorne à posição inicial",
          "Mantenha ritmo constante"
        ]
      }
    ];

    for (const exercise of exerciciosBasicos) {
      await this.createExercise(exercise);
    }
  }
}

// Instância singleton
let repository: IndexedDBRepository | null = null;

export async function getRepository(): Promise<IndexedDBRepository> {
  if (!repository) {
    repository = new IndexedDBRepository();
    await repository.init();
    await repository.seedData();
  }
  return repository;
}