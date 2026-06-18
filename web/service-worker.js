/* AOS Ability Tracker — service worker.
 *
 * Runtime caching only (no precache manifest), so hashed bundle filenames are
 * handled automatically. Strategy:
 *   - Navigations: network-first (online users always get the latest build),
 *     falling back to a cached shell when offline.
 *   - Same-origin GET assets: stale-while-revalidate (instant from cache, then
 *     refreshed in the background).
 *   - Everything else (cross-origin Supabase/Resend, POST, etc.): passed
 *     straight through — never cached.
 *
 * skipWaiting + clients.claim mean a new service worker takes over promptly,
 * so the app never gets stuck on a stale version.
 */
const CACHE = 'aos-pwa-v1';
const SHELL_KEY = 'app-shell';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GETs. Cross-origin (Supabase REST/Realtime, Resend)
  // and non-GET (POST/PATCH) requests are left entirely alone.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, cache the shell, fall back offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(SHELL_KEY, res.clone());
          return res;
        } catch {
          const cached = await caches.match(SHELL_KEY);
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })()
  );
});
