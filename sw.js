self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("pwa-v1").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/veiculos.html",
        "/manutencao.html",
        "/analise.html",
        "/css/styles.css",
        "/js/app.js",
        "/js/veiculos.js",
        "/js/manutencao.js",
        "/js/analise.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
