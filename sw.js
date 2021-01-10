'use strict';

const cacheName = 'weather-forecast-pwa';
const filesToCache = [
  '/',
  '/index.html',
  '/main.css',
  '/main.js',
  '/icons/*',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
