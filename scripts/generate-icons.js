/* Rasterize web/icon.svg into the PNG sizes the PWA needs.
 *
 * The SVG is the single source of truth for the app icon; these PNGs are
 * generated artifacts (committed, but reproducible). Run after editing the
 * SVG:  node scripts/generate-icons.js
 *
 * Why PNGs at all, when the manifest can reference the SVG directly?
 *   - iOS Safari's apple-touch-icon does NOT support SVG — without a PNG the
 *     "Add to Home Screen" icon is blank on iPhone/iPad.
 *   - Some Android launchers and older browsers want raster manifest icons.
 * The SVG entry stays in the manifest too (crisp where it's supported).
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const WEB_DIR = path.resolve(__dirname, '..', 'web');
const svg = fs.readFileSync(path.join(WEB_DIR, 'icon.svg'), 'utf8');

// width === height because the source viewBox is square (512x512).
const TARGETS = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 }, // iOS home-screen standard
];

for (const { file, size } of TARGETS) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
    .render()
    .asPng();
  const out = path.join(WEB_DIR, file);
  fs.writeFileSync(out, png);
  console.log(`wrote ${file} (${size}x${size}, ${png.length} bytes)`);
}
