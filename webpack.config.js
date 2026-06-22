// Customizes the default Expo webpack config (SDK 48).
//
// Two things this file does on top of the default:
//
// 1. publicPath for GitHub Pages
//    The app is served from a custom domain (abilitytracker.co.uk) so assets
//    live at the root '/'. Dev also uses '/'.
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

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Load .env into process.env (no-op if .env doesn't exist, which is the
// case in CI where vars come from the workflow's `env:` block instead).
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Custom domain — assets always live at the root.
  const publicUrl = '/';

  config.output.publicPath = '/';

  // Copy the PWA static files (manifest, icons, service worker) to the build
  // root so they sit alongside index.html and are served at the app's base.
  // We copy the whole web/ directory, so adding an asset there (e.g. a new
  // icon size) ships automatically without touching this config.
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, 'web'), to: '.' }],
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
