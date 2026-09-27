// Shared building blocks for every generated profile SVG: theme tokens, text
// helpers and the animated card frame. Everything renders inside <img>, where
// GitHub keeps an SVG's own <style>, CSS keyframes and SMIL, but no script.

export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0d1117', panel: '#0f1520', panel2: '#151c28', border: '#263041', grid: '#1b2433',
    text: '#e6edf3', muted: '#8b949e', faint: '#4b5563',
    accent: '#a78bfa', cyan: '#22d3ee', green: '#34d399', amber: '#fbbf24', pink: '#f472b6', blue: '#60a5fa',
    glow: 0.55, blob: 0.35,
  },
  light: {
    name: 'light',
    bg: '#ffffff', panel: '#ffffff', panel2: '#f6f8fa', border: '#d0d7de', grid: '#eef1f5',
    text: '#1f2328', muted: '#57606a', faint: '#afb8c1',
    accent: '#6d28d9', cyan: '#0e7490', green: '#047857', amber: '#b45309', pink: '#be185d', blue: '#1d4ed8',
    glow: 0.35, blob: 0.16,
  },
};

export const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;
export const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace`;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Rough average advance widths, good enough to wrap text without a renderer.
export const textWidth = (s, size, mono = false) => [...String(s)].length * size * (mono ? 0.6 : 0.52);

export function wrap(text, maxWidth, size, mono = false) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (textWidth(next, size, mono) > maxWidth && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export const color = (t, key) => t[key] ?? key;

// Pill-shaped tech chips, laid out left to right with wrapping.
export function chips(t, items, x, y, maxWidth, { size = 13, colorKey = 'accent', gap = 8, h = 26 } = {}) {
  let cx = x, cy = y, out = '';
  for (const label of items) {
    const w = Math.round(textWidth(label, size, true) + 22);
    if (cx + w > x + maxWidth) { cx = x; cy += h + gap; }
    const c = color(t, colorKey);
    out += `<g><rect x="${cx}" y="${cy}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}" fill-opacity="${t.name === 'dark' ? 0.1 : 0.07}" stroke="${c}" stroke-opacity="0.45"/>` +
      `<text x="${cx + w / 2}" y="${cy + h / 2 + size * 0.36}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="600" fill="${c}">${esc(label)}</text></g>`;
    cx += w + gap;
  }
  return { svg: out, bottom: cy + h };
}

// The standard frame: rounded panel, soft drifting aurora blobs clipped to it,
// a dot grid, and a light that runs around the border.
export function frame(t, W, H, { id = 'f', hue = ['accent', 'cyan', 'green'], blobs = true, sweep = true, r = 18 } = {}) {
  const [a, b, c] = hue.map((k) => color(t, k));
  const blobSvg = blobs ? `
    <g clip-path="url(#${id}clip)" filter="url(#${id}blur)" opacity="${t.blob}">
      <circle class="blob b1" cx="${W * 0.18}" cy="${H * 0.2}" r="${Math.max(W, H) * 0.22}" fill="${a}"/>
      <circle class="blob b2" cx="${W * 0.85}" cy="${H * 0.35}" r="${Math.max(W, H) * 0.18}" fill="${b}"/>
      <circle class="blob b3" cx="${W * 0.55}" cy="${H * 1.05}" r="${Math.max(W, H) * 0.2}" fill="${c}"/>
    </g>` : '';
  const perim = 2 * (W + H);
  return {
    defs: `
    <clipPath id="${id}clip"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}"/></clipPath>
    <filter id="${id}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(Math.max(W, H) / 14)}"/></filter>
    <pattern id="${id}dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="${t.grid}"/></pattern>
    <linearGradient id="${id}edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}" stop-opacity="0"/><stop offset=".5" stop-color="${a}"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></linearGradient>`,
    css: `
    .blob{animation:drift 16s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
    .b2{animation-duration:19s;animation-direction:alternate-reverse}.b3{animation-duration:23s}
    @keyframes drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,8%) scale(1.15)}100%{transform:translate(-5%,-4%) scale(.9)}}
    .sweep{stroke-dasharray:${Math.round(perim * 0.12)} ${Math.round(perim * 0.88)};animation:sweep 9s linear infinite}
    @keyframes sweep{to{stroke-dashoffset:-${perim}}}`,
    back: `
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}" fill="${t.panel}"/>
    ${blobSvg}
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}" fill="url(#${id}dots)" opacity="${t.name === 'dark' ? 0.9 : 0.7}"/>
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}" fill="none" stroke="${t.border}" stroke-width="1.5"/>
    ${sweep ? `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" class="sweep" opacity="${t.glow + 0.2}"/>` : ''}`,
  };
}

export const REDUCED = `@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rm-show{opacity:1!important;transform:none!important}}`;

export function svg(W, H, { title, desc, defs = '', css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc ?? title)}</desc>
<defs>${defs}</defs>
<style>
  text{white-space:pre}
  .in{opacity:0;animation:rise .7s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .pulse{animation:pulse 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.5)}}
  ${css}
  ${REDUCED}
  @media (prefers-reduced-motion:reduce){.in,.px,.bdg{opacity:1!important}.tl{stroke-dashoffset:0!important}}
</style>
${body}
</svg>
`;
}

export const delay = (s) => `style="animation-delay:${s.toFixed(2)}s"`;
