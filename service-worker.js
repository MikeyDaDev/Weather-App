 // Name of the cache
const CACHE_NAME = 'weather-app-v1';

// Files we want to cache (for offline use)
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/weatherLogo-192.png',
  '/icons/weatherLogo-512.png'
];

// This event runs when the service worker is first installed
self.addEventListener('install', event => {
  // Wait until files are cached before finishing install
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache); // Save these files in the cache
    })
  );
});

// Activated to clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          // If the cache is not the current one, delete it
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// This event intercepts every network request
self.addEventListener('fetch', event => {
  // Try to find the request in the cache first
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
      .then(response => response || caches.match('/index.html'))
    })
  );
});
