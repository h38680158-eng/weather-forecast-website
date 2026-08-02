// Skyward service worker — offline support via cache strategies.
const CACHE = "skyward-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Weather/geo APIs → network-first, fall back to cached last-known data.
  const isApi = /open-meteo\.com|windy\.com/.test(url.host);
  if (isApi) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // App shell & assets → cache-first.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
      return res;
    }).catch(() => caches.match("/index.html"))),
  );
});
