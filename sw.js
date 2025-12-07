const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/veiculos.html',
  '/manutencao.html',
  '/analise.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/veiculos.js',
  '/js/manutencao.js',
  '/js/analise.js',
  '/js/idb-helper.js',
  '/manifest.json',
  '/offline.html'
  // ícones serão buscados quando necessário
];

// Install: pré-cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => console.error('Falha no pre-cache', err))
  );
});

// Activate: limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch: estratégias
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Navegação -> responder com cache ou fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(resp => {
          // atualiza cache estático com a versão mais recente da página navegada
          const copy = resp.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Imagens / fontes / assets estáticos -> cache-first
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then(cachedResp => {
        if (cachedResp) return cachedResp;
        return fetch(request).then(networkResp => {
          return caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, networkResp.clone());
            return networkResp;
          });
        }).catch(() => {
          // se for imagem, retornar um placeholder (se existir em cache)
          return caches.match('/icons/icon-192.png');
        });
      })
    );
    return;
  }

  // Default: tentar rede, senão cache
  event.respondWith(
    fetch(request)
      .then(resp => resp)
      .catch(() => caches.match(request))
  );
});
