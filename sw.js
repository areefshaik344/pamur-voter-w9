const CACHE_NAME = 'pamur-voter-w9-v3';
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['./', 'index.html']))
  );
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((res) => res || fetch(e.request).then((fRes) => {
      if (fRes.status === 200 && (e.request.url.includes('/photos/') || e.request.url.includes('.html') || e.request.url.includes('.json'))) {
        const clone = fRes.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
      }
      return fRes;
    })).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});