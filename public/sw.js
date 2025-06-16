const CACHE_NAME = 'portfolio-cache-v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon/android-chrome-192x192.png',
  '/favicon/android-chrome-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          const cacheTime = new Date(response.headers.get('sw-cache-timestamp'));
          const now = new Date();
          if (now - cacheTime < CACHE_DURATION) {
            return response;
          }
          caches.delete(event.request);
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.append('sw-cache-timestamp', new Date().toISOString());
            const modifiedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers
            });
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, modifiedResponse);
              });
            return response;
          });
      })
  );
});

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
}); 