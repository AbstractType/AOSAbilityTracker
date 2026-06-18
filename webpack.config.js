// Customizes the default Expo webpack config (SDK 48).
//
// Two things this file does on top of the default:
//
// 1. publicPath for GitHub Pages
//    Production builds are served from https://abstracttype.github.io/AOSAbilityTracker/
//    which means every emitted asset URL has to be absolute under the
//    `/AOSAbilityTracker/` subpath. Without this, the bundle requests
//    `/static/js/main.<hash>.js` and Pages 404s because the file actually
//    lives at `/AOSAbilityTracker/static/js/main.<hash>.js`. Dev keeps '/'.
//
// 2. Supabase env var injection
//    Loads .env (gitignored) for local dev, and reads from process.env in CI
//    (where GitHub Actions secrets are injected as env vars). DefinePlugin
//    bakes the values into the bundle at build time so client code can
//    read `process.env.EXPO_PUBLIC_SUPABASE_URL` etc. at runtime.
//
//    Both keys are SAFE to embed in the client bundle — the anon key is
//    designed to be public, and RLS policies on the database enforce that
//    one user can never read another user's rows. Never embed `service_role`.
//
// If you fork this repo to a different owner/name, change GITHUB_PAGES_BASE
// to match `/your-repo-name/`.

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Load .env into process.env (no-op if .env doesn't exist, which is the
// case in CI where vars come from the workflow's `env:` block instead).
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const GITHUB_PAGES_BASE = '/AOSAbilityTracker/';

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // The app is served from the Pages subpath in production, root in dev. The
  // PWA layer reads this to register the service worker at the right scope.
  const publicUrl = env.mode === 'production' ? GITHUB_PAGES_BASE : '/';

  if (env.mode === 'production') {
    config.output.publicPath = GITHUB_PAGES_BASE;
  }

  // Copy the PWA static files (manifest, icon, service worker) to the build
  // root so they sit alongside index.html and are served at the app's base.
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'web/manifest.webmanifest'), to: 'manifest.webmanifest' },
        { from: path.resolve(__dirname, 'web/service-worker.js'), to: 'service-worker.js' },
        { from: path.resolve(__dirname, 'web/icon.svg'), to: 'icon.svg' },
      ],
    })
  );

  // Inject the Supabase vars as compile-time constants. We use empty-string
  // fallbacks (rather than `undefined`) so the client code can still import
  // and run — it will just fail loudly when it tries to make a request,
  // which surfaces "you forgot to set the env vars" faster than a crash
  // inside the Supabase SDK.
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.EXPO_PUBLIC_SUPABASE_URL': JSON.stringify(
        process.env.EXPO_PUBLIC_SUPABASE_URL || ''
      ),
      'process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
      ),
      // Base path the app is served from — used by the PWA service-worker
      // registration to scope correctly under the Pages subpath. Note: a
      // distinct name (NOT PUBLIC_URL) because Expo's base config already
      // defines process.env.PUBLIC_URL; reusing it makes DefinePlugin emit a
      // "conflicting values" warning and the resolution order is undefined.
      'process.env.APP_PUBLIC_URL': JSON.stringify(publicUrl),
    })
  );

  return config;
};
