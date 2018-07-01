// Create cache when Service Worker installs
const currencyCacheName = 'currency-api-v1';
const cacheName = 'cache-v1';

const filesToCache = [
  './index.html',
  './assets/css/styles.min.css',
  './public/css/styles.min.css.map',
  './public/js/app.min.js',
  './public/js/app.min.js.map',
];

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching');
      return cache.addAll(filesToCache);
    }),
  );
});

// Remove previous cache after activating the new cache

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

// Serve app from cache if there is a cached version

self.addEventListener('fetch', event => {
  const dataUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';

  // If contacting API, fetch and then cache the new data
  if (event.request.url.indexOf(dataUrl) === 0) {
    event.respondWith(
      fetch(event.request).then(response =>
        caches.open(currencyCacheName).then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        }),
      ),
    );
  } else {
    // Respond with cached content if they are matched
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request)),
    );
  }
});
