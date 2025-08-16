// Service Worker e cache para funcionalidade offline

export const CACHE_NAME = 'academia-app-v1';
export const OFFLINE_URL = '/offline';

// Recursos para cache estático
export const STATIC_RESOURCES = [
  '/',
  '/exercises',
  '/workouts', 
  '/calendar',
  '/progress',
  '/data',
  '/offline',
  '/manifest.json'
];

// Cache do repository para persistência offline
export class OfflineRepository {
  private static STORAGE_KEYS = {
    EXERCISES: 'academia_exercises',
    WORKOUTS: 'academia_workouts', 
    LOGS: 'academia_logs',
    USERS: 'academia_users',
    SYNC_QUEUE: 'academia_sync_queue'
  };

  // Salvar no localStorage
  static saveToLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Carregar do localStorage  
  static loadFromLocal(key: string) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  // Sincronizar dados quando voltar online
  static async syncWhenOnline() {
    if (!navigator.onLine) return;

    const syncQueue = this.loadFromLocal(this.STORAGE_KEYS.SYNC_QUEUE) || [];
    
    for (const item of syncQueue) {
      try {
        await fetch(item.endpoint, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
      } catch (error) {
        console.error('Erro na sincronização:', error);
      }
    }

    // Limpar fila após sincronização bem-sucedida
    this.saveToLocal(this.STORAGE_KEYS.SYNC_QUEUE, []);
  }

  // Adicionar à fila de sincronização
  static addToSyncQueue(endpoint: string, method: string, data: any) {
    const syncQueue = this.loadFromLocal(this.STORAGE_KEYS.SYNC_QUEUE) || [];
    syncQueue.push({
      id: Date.now(),
      endpoint,
      method,
      data,
      timestamp: new Date().toISOString()
    });
    this.saveToLocal(this.STORAGE_KEYS.SYNC_QUEUE, syncQueue);
  }

  // Verificar se está offline
  static isOffline(): boolean {
    return !navigator.onLine;
  }
}

// Registrar service worker
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registrado:', registration);
      } catch (error) {
        console.error('Erro ao registrar SW:', error);
      }
    });
  }
}

// Detectar mudanças no status de conexão
export function setupOfflineDetection() {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('Voltou online - sincronizando...');
      OfflineRepository.syncWhenOnline();
    });

    window.addEventListener('offline', () => {
      console.log('Ficou offline - usando cache local');
    });
  }
}