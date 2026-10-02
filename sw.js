/**
 * Kakul Sarma Portfolio - Cache-First & Stale-While-Revalidate Service Worker
 * Optimizes repeat visitor performance, asset caching, and offline access.
 */

const CACHE_NAME = 'ks-portfolio-v4';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.min.css?v=7.1',
  './css/devicon-subset.min.css?v=7.0',
  './js/main.min.js?v=7.1',
  './assets/images/profile.webp',
  './assets/images/profile-thumb.webp',
  './assets/images/profile.jpg',
  './assets/favicon.svg',
  './assets/data/articles.json',
  './assets/data/recommendations.json'
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests and browser extension requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // HTML navigation requests: Network-First (always fresh content, fallback to cache)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((match) => match || caches.match('./index.html')))
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
