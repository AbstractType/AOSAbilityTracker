// Customizes the default Expo webpack config (SDK 48).
//
// Production builds are served from GitHub Pages at
//   https://abstracttype.github.io/AOSAbilityTracker/
// which means every emitted asset URL has to be absolute under the
// `/AOSAbilityTracker/` subpath. Without overriding publicPath, the bundle
// requests `/static/js/main.<hash>.js` and Pages 404s because the file
// actually lives at `/AOSAbilityTracker/static/js/main.<hash>.js`.
//
// Development (`expo start --web`) keeps the default '/' so the dev server's
// root resolves correctly.
//
// If you fork this repo to a different owner/name, change GITHUB_PAGES_BASE
// to match `/your-repo-name/`.

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const GITHUB_PAGES_BASE = '/AOSAbilityTracker/';

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (env.mode === 'production') {
    config.output.publicPath = GITHUB_PAGES_BASE;
  }

  return config;
};
