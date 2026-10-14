/* =====================================================
   SERVICE WORKER — GlitchGrid Cache Busting
   Her yeni deploy'da otomatik güncellenir
===================================================== */

/* Bu versiyonu her değişiklikte artır */
const VERSION = 'v' + Date.now();
const CACHE   = 'glitchgrid-' + VERSION;

/* Cache'lenecek dosyalar */
const PRECACHE = [
  './',
  './index.html',
  './menu.html',
  './cases.html',
  './football.html',
  './snake.html',
  './xox.html',
  './admin.html',
  './css/global.css',
  './css/auth.css',
  './css/menu.css',
  './css/cases.css',
  './css/football.css',
  './css/snake.css',
  './css/xox.css',
  './css/admin.css',
  './js/auth.js',
  './js/cases-bundle.js',
  './js/football.js',
  './js/snake.js',
  './js/xox.js',
  './js/music.js',
  './js/feedback.js',
  './js/admin.js',
];

/* ── Install: cache'i doldur ── */
self.addEventListener('install', e => {
  self.skipWaiting(); // hemen aktif ol, bekleme
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(() => {/* hata olursa atla */})
        )
      );
    })
  );
});

/* ── Activate: eski cache'leri sil ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // tüm sekmeleri al
  );
});

/* ── Fetch: Network-First strateji ── */
self.addEventListener('fetch', e => {
  /* Sadece GET isteklerini yakala */
  if (e.request.method !== 'GET') return;

  /* Chrome extension isteklerini atla */
  if (!e.request.url.startsWith('http')) return;

  /* CDN (fonts, FA icons) → stale-while-revalidate */
  if (
    e.request.url.includes('fonts.googleapis.com') ||
    e.request.url.includes('cdnjs.cloudflare.com') ||
    e.request.url.includes('fonts.gstatic.com')
  ) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const net = fetch(e.request).then(r => {
            cache.put(e.request, r.clone());
            return r;
          }).catch(() => cached);
          return cached || net;
        })
      )
    );
    return;
  }

  /* Yerel dosyalar → Network-First (her zaman yeniyi dene, düşerse cache) */
  e.respondWith(
    fetch(e.request)
      .then(response => {
        /* Geçerli response → cache'e kaydet */
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request)) // network yoksa cache
  );
});

/* ── Mesaj: zorla güncelle ── */
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
