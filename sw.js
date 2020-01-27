// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
//
// if (workbox) {
//     console.log(`Yay! Workbox is loaded 🎉`);
//
//     workbox.precaching.precacheAndRoute([]);
//
// } else {
//     console.log(`Boo! Workbox didn't load 😬`);
// }
//
console.log('self', self);
self.addEventListener('install', (event) => {
    console.log('install', event);

    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                './earth-small.html',
                './earth-small.js',
            ]);
        })
    );
});