/**
 * Generates OpenGraph images and PNG favicons from inline SVG using sharp.
 * Run with `pnpm og`. Output is committed so the build itself needs no step.
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public');

const PAPER = '#f2eee5';
const INK = '#17181a';
const INK3 = '#6f6e6a';
const ACCENT = '#d84a1b';
const COLORS = { arbor: '#2c6b4a', reroute: '#b0620e', cookiesweep: '#35568a' };

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Consolas, 'Courier New', monospace";

const anvil = (x, y, s, fill) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M2 12.5 L7 10 H26 L28 12.5 L26 15 H20 V23 H23 L25 27 H7 L9 23 H12 V15 H7 Z" fill="${fill}"/><circle cx="25" cy="6" r="2" fill="${ACCENT}"/></g>`;

const grid = `
  <defs>
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${INK}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <radialGradient id="fade" cx="0.75" cy="0.4" r="0.8">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="1200" height="630" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect width="1200" height="630" fill="url(#g)" mask="url(#m)"/>
`;

function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function brandCard() {
  const lines = wrap('The open-source workshop that rebuilds the browser tools Manifest V3 left behind.', 30);
  const text = lines
    .map((l, i) => `<text x="80" y="${300 + i * 74}" font-family="${SERIF}" font-size="66" fill="${INK}">${l}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    ${grid}
    ${anvil(80, 72, 2.2, INK)}
    <text x="160" y="118" font-family="${MONO}" font-size="26" letter-spacing="2" fill="${INK}">BROWSERFORGE</text>
    <text x="80" y="200" font-family="${MONO}" font-size="18" letter-spacing="3" fill="${INK3}">MANIFEST V3 / CHROME AND EDGE / MIT LICENCE</text>
    ${text}
    <line x1="80" y1="556" x2="1120" y2="556" stroke="${INK}" stroke-opacity="0.25"/>
    <text x="80" y="590" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${INK3}">ARBOR / REROUTE / COOKIESWEEP</text>
    <text x="1120" y="590" text-anchor="end" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${INK3}">SHANTANUOJHA.COM</text>
  </svg>`;
}

function productCard(slug, index, name, category, tagline) {
  const c = COLORS[slug];
  const lines = wrap(tagline, 34);
  const text = lines
    .map((l, i) => `<text x="80" y="${330 + i * 66}" font-family="${SERIF}" font-size="56" fill="${INK}">${l}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    ${grid}
    <rect x="0" y="0" width="14" height="630" fill="${c}"/>
    ${anvil(80, 72, 1.6, INK)}
    <text x="140" y="112" font-family="${MONO}" font-size="22" letter-spacing="2" fill="${INK3}">BROWSERFORGE /</text>
    <text x="80" y="215" font-family="${SERIF}" font-size="120" fill="${c}">${index}</text>
    <text x="250" y="215" font-family="${SERIF}" font-size="120" fill="${INK}">${name}</text>
    <text x="80" y="262" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${INK3}">${category.toUpperCase()}</text>
    ${text}
    <line x1="80" y1="556" x2="1120" y2="556" stroke="${INK}" stroke-opacity="0.25"/>
    <text x="80" y="590" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${INK3}">OPEN SOURCE / IN DEVELOPMENT</text>
    <text x="1120" y="590" text-anchor="end" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${INK3}">${slug.toUpperCase()}.SHANTANUOJHA.COM</text>
  </svg>`;
}

const cards = {
  browserforge: brandCard(),
  arbor: productCard('arbor', '01', 'Arbor', 'Tree-style tab and session manager', 'Your windows and tabs as a tree. Every branch saved, every session recoverable.'),
  reroute: productCard('reroute', '02', 'Reroute', 'URL rewrite rules', 'Rewrite URLs on the way in. Wildcards, regular expressions, and a rule tester that tells the truth.'),
  cookiesweep: productCard('cookiesweep', '03', 'CookieSweep', 'Automatic cookie and site-data cleanup', 'Leave a site, and its cookies leave with you.'),
};

await mkdir(path.join(out, 'og'), { recursive: true });
for (const [name, svg] of Object.entries(cards)) {
  const file = path.join(out, 'og', `${name}.png`);
  await sharp(Buffer.from(svg), { density: 96 }).png({ compressionLevel: 9 }).toFile(file);
  console.log('wrote', path.relative(root, file));
}

const favicon = await readFile(path.join(out, 'favicon.svg'));
for (const [file, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(favicon, { density: 96 * (size / 32) })
    .resize(size, size)
    .png()
    .toFile(path.join(out, file));
  console.log('wrote', path.join('public', file));
}
