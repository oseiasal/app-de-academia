// Service Worker para funcionalidade offline

const CACHE_NAME = 'academia-app-v1';
const OFFLINE_URL = '/offline';

const STATIC_RESOURCES = [
  '/',
  '/exercises',
  '/workouts',
  '/calendar', 
  '/progress',
  '/data',
  '/offline',
  '/manifest.json'
];

// Instalar SW e fazer cache dos recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Ativar SW e limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requests - estratégia Cache First para recursos estáticos
self.addEventListener('fetch', event => {
  // Apenas interceptar requests GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // Se encontrar no cache, retornar
      if (response) {
        return response;
      }

      // Tentar buscar da rede
      return fetch(event.request).then(response => {
        // Se não conseguir conectar, mostrar página offline
        if (!response || response.status !== 200) {
          return caches.match(OFFLINE_URL);
        }

        // Fazer cache de recursos importantes
        if (shouldCache(event.request.url)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // Se falhar completamente, retornar página offline
        return caches.match(OFFLINE_URL);
      });
    })
  );
});

// Determinar se deve fazer cache do recurso
function shouldCache(url) {
  // Cache de páginas principais
  if (STATIC_RESOURCES.some(resource => url.endsWith(resource))) {
    return true;
  }
  
  // Cache de API calls importantes
  if (url.includes('/api/')) {
    return true;
  }

  // Cache de imagens e assets
  if (url.match(/\.(png|jpg|jpeg|svg|css|js)$/)) {
    return true;
  }

  return false;
}

// Sincronização em background quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    // Implementar lógica de sincronização dos dados offline
    console.log('Sincronizando dados offline...');
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}