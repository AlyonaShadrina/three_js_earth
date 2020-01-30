const APP_PREFIX = 'THREE.js_';
const VERSION = 'v_02';
const CACHE_NAME = APP_PREFIX + VERSION;

const URLS = [                            // Add URL you want to cache in this list.
    '/three_js_earth/',                     // If you have separate JS/CSS files,
    '/three_js_earth/earth-small.html',            // add path to those files here
    '/three_js_earth/earthSmall.js',            // add path to those files here
];

// earth-small scripts + sw seemes to be slowing down everything very much when page loads

if (URLS) {
    // Cache resources
    self.addEventListener('install', (event) => {
        console.log('Cache resources into ', CACHE_NAME);
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(URLS);
            })
        );
    });
}

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                // if cache is available, respond with cache
                console.log('responding with cache')
                return request
            } else {
                // if there are no cache, try fetching request
                console.log('file is not cached, fetching')
                return fetch(e.request)
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    // console.log('activate', e);
    e.waitUntil(
        caches.keys().then(function (keyList) {
            // `keyList` contains all cache names under your username.github.io
            // filter out ones that has this app prefix to create white list
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            // add current cache name to white list
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache: ' + keyList[i] )
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})