/* JN Life — service worker
   Precaches the app shell, serves it offline, and keeps it fresh:
   - Navigations: network-first (so updates arrive), cache fallback (so offline works)
   - Assets (js/css/icons/fonts): stale-while-revalidate                     */

const CACHE_NAME = 'jn-life-v1';

const PRECACHE = [
    './',
    './JN_Life_APP.js',
    './JN_Life_APP.css',
    './manifest.json',
    './icon.png',
    './icon-512.png',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;

    // Page navigations: try network first so app updates land, fall back to cached shell offline
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put('./', copy));
                    return res;
                })
                .catch(() => caches.match('./'))
        );
        return;
    }

    // Everything else (js/css/icons + Google Fonts): serve cache, refresh in background
    e.respondWith(
        caches.match(req).then((cached) => {
            const fetchAndCache = fetch(req)
                .then((res) => {
                    if (res && (res.status === 200 || res.type === 'opaque')) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() => cached);
            return cached || fetchAndCache;
        })
    );
});
