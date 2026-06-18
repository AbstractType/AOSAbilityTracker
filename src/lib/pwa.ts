import { Platform } from 'react-native';

/**
 * Progressive Web App setup (web only).
 *
 * Adds the manifest link + theming meta tags at runtime and registers the
 * service worker, so the app is installable and works offline for content
 * already loaded. Doing it from JS (rather than editing Expo's HTML template)
 * keeps the build config to a simple file-copy — see webpack.config.js.
 *
 * Everything is scoped to the app's base path (the GitHub Pages subpath in
 * production, `/` in dev), injected as APP_PUBLIC_URL by webpack. (We avoid
 * the conventional PUBLIC_URL name because Expo's webpack config already
 * defines it, and a second definition collides in DefinePlugin.)
 */

const BASE = (process.env.APP_PUBLIC_URL || '/').replace(/\/?$/, '/');
const THEME = '#0B1220';

function addLinkOnce(rel: string, href: string, extra?: Record<string, string>) {
  if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (extra) for (const [k, v] of Object.entries(extra)) link.setAttribute(k, v);
  document.head.appendChild(link);
}

function addMetaOnce(name: string, content: string) {
  if (document.querySelector(`meta[name="${name}"]`)) return;
  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

/**
 * Wire up the PWA. Safe to call unconditionally — it no-ops off-web and is
 * idempotent (won't double-add tags or re-register).
 */
export function registerPwa(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  // Manifest + theming.
  addLinkOnce('manifest', `${BASE}manifest.webmanifest`);
  addLinkOnce('icon', `${BASE}icon.svg`, { type: 'image/svg+xml' });
  // iOS Safari does NOT support SVG for the home-screen icon — point it at a
  // PNG so "Add to Home Screen" renders something instead of a blank tile.
  addLinkOnce('apple-touch-icon', `${BASE}apple-touch-icon.png`);
  addMetaOnce('theme-color', THEME);
  addMetaOnce('apple-mobile-web-app-capable', 'yes');
  addMetaOnce('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMetaOnce('apple-mobile-web-app-title', 'AOS Tracker');

  // Service worker — registered after load so it never competes with first paint.
  if ('serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker
        .register(`${BASE}service-worker.js`, { scope: BASE })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('[pwa] service worker registration failed:', err);
        });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }
}
