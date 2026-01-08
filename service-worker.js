/**
 * Service Worker - Magic Home Service PWA
 * 
 * Gère:
 * - Mise en cache des assets
 * - Fonctionnement hors ligne
 * - Synchronisation en arrière-plan
 */

const CACHE_NAME = 'mhs-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/prestation.html',
  '/contact.html',
  '/avis.html',
  '/css/style.css',
  '/css/carousel.css',
  '/css/prestation.css',
  '/js/script.js',
  '/js/carousel.js',
  '/js/avis-data.js',
  '/js/web-components/header/header-component.js',
  '/js/web-components/header/header-component.css',
  '/js/web-components/footer/footer-component.js',
  '/js/web-components/footer/footer-component.css',
  '/js/web-components/review/review-component.js',
  '/js/web-components/review/review-component.css',
  '/img/logo.svg',
];

/* ===========================
   INSTALLATION DU SERVICE WORKER
   =========================== */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors du cache', error);
      })
  );
  self.skipWaiting();
});

/* ===========================
   ACTIVATION DU SERVICE WORKER
   =========================== */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* ===========================
   STRATÉGIE DE CACHE
   Cache first, puis network fallback
   =========================== */

self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Stratégie: Cache First pour les assets statiques
  if (
    event.request.url.includes('/css/') ||
    event.request.url.includes('/js/') ||
    event.request.url.includes('/img/') ||
    event.request.url.includes('/video/') ||
    event.request.url.endsWith('.html')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          return fetch(event.request)
            .then((response) => {
              // Ne pas mettre en cache les réponses non-valides
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });

              return response;
            })
            .catch(() => {
              // Fallback page hors ligne si disponible
              return caches.match('/index.html');
            });
        })
    );
  } else {
    // Stratégie: Network First pour les autres requêtes (API, etc.)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
