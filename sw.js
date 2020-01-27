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
    console.log('--1');
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                './three_js_earth/earth-small.html',
                './three_js_earth/earth-small.js',
            ]);
        })
    );
});