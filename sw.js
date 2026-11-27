/* Service worker: appen virker offline (unntatt talegjenkjenning, som i Chrome krever nett). */
const CACHE = 'govorushka-v13';
const FILES = ['./', 'index.html', 'css/style.css', 'css/hallmark.css', 'js/data/lessons.js', 'js/data/lessons-b1.js', 'js/data/readings.js', 'js/data/news.js', 'js/dict.js', 'data/dict.json', 'js/data/stress.js', 'js/data/audio.js', 'js/extra.js', 'js/core.js', 'js/speech.js', 'js/ui.js', 'js/app.js', 'manifest.webmanifest', 'icons/icon.svg'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Nett først (alltid ferskt innhold), cache som reserve offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
