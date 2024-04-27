// service-worker.js

const CACHE_NAME = 'todo-list-cache-v1';
// const urlsToCache = [
//   '/',
//   '/styles.css',
//   '/script.js'
// ];

// self.addEventListener('install', function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(response) {
//         // Check if we received a valid response
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response;
//         }

//         const responseToCache = response.clone();

//         caches.open(CACHE_NAME)
//           .then(function(cache) {
//             cache.put(event.request, responseToCache);
//           });

//         return response;
//       })
//       .catch(function() {
//         return caches.match(event.request);
//       })
//   );
// });
