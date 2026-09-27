// One-off: turns a headshot into the About card's halftone portrait.
// Writes scripts/profile/portrait.json (dot grid) and assets/photo/kashyap.jpg
// (small copy embedded in the card). Only this tool needs `sharp`; the profile
// build itself stays dependency-free.
//
//   npm i --no-save sharp && node scripts/tools/make-portrait.mjs path/to/photo
//
// Each dot stores [column, row, luminance 0–1]. The dark card sizes dots by
// brightness (they glow), the light card by darkness (they print like ink).
// The background is separated by hue: the studio backdrop is blue (b > r),
// while skin, hair, shirt and suit are not.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = process.argv[2];
if (!src) throw new Error('usage: make-portrait.mjs <photo>');

const N = 52;
const { data } = await sharp(src).resize(N, N, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const dots = [];
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 3, r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    if (b - r > 0.07) continue; // backdrop
    dots.push([x, y, 0.2126 * r + 0.7152 * g + 0.0722 * b]);
  }
}
// Contrast-stretch luminance across the subject (5th–95th percentile) so the
// face and the suit both span the full dot range.
const sorted = dots.map((d) => d[2]).sort((a, b) => a - b);
const lo = sorted[Math.floor(sorted.length * 0.05)], hi = sorted[Math.floor(sorted.length * 0.95)];
for (const d of dots) d[2] = +Math.min(1, Math.max(0, (d[2] - lo) / (hi - lo))).toFixed(2);
writeFileSync(join(root, 'scripts/profile/portrait.json'), JSON.stringify({ n: N, dots }) + '\n');

mkdirSync(join(root, 'assets/photo'), { recursive: true });
await sharp(src).resize(240, 240, { fit: 'cover' }).jpeg({ quality: 74, mozjpeg: true }).toFile(join(root, 'assets/photo/kashyap.jpg'));
console.log(`portrait: ${dots.length} dots on a ${N}×${N} grid; photo written`);
