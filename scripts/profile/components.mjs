// One function per profile section. Each returns a complete SVG string for a
// theme; build-profile.mjs writes a light and a dark copy of each.

import { SANS, MONO, esc, wrap, textWidth, chips, frame, svg, delay, color } from './kit.mjs';
import * as D from './data.mjs';

// ───────────────────────────── hero ─────────────────────────────
export function hero(t) {
  const W = 1200, H = 460;
  const f = frame(t, W, H, { id: 'h' });
  const CH = 9.6; // 16px mono advance, enforced with textLength
  const tx = 700, ty0 = 142, lh = 36, CYCLE = 16;
  const keyPad = Math.max(...D.terminal.map(([k]) => k.length));
  let css = '', lines = '';
  D.terminal.forEach(([k, v], i) => {
    const text = `› ${k.padEnd(keyPad)} :: ${v}`;
    const w = Math.round(text.length * CH);
    const s = ((0.9 + i * 1.15) / CYCLE) * 100, e = ((0.9 + i * 1.15 + 0.85) / CYCLE) * 100;
    css += `@keyframes ty${i}{0%,${s.toFixed(2)}%{transform:translateX(0);animation-timing-function:steps(${text.length},end)}${e.toFixed(2)}%,88%{transform:translateX(${w + 4}px)}92%,100%{transform:translateX(0)}}
    .ty${i}{animation:ty${i} ${CYCLE}s infinite}`;
    const y = ty0 + i * lh;
    const valColor = k === 'status' ? t.green : t.text;
    lines += `<text x="${tx}" y="${y}" font-family="${MONO}" font-size="16" textLength="${w}" lengthAdjust="spacingAndGlyphs">` +
      `<tspan fill="${t.accent}">› </tspan><tspan fill="${t.cyan}">${esc(k.padEnd(keyPad))}</tspan><tspan fill="${t.faint}"> :: </tspan><tspan fill="${valColor}">${esc(v)}</tspan></text>` +
      `<rect class="ty${i}" x="${tx - 2}" y="${y - 20}" width="${w + 8}" height="28" fill="${t.panel2}"/>`;
  });
  const cursorY = ty0 + D.terminal.length * lh;
  const pills = ['Gentell · since Jul 2025', 'VIT · CGPA 8.54', 'Patent #202541122226', 'IEEE ICCCNT-2025'];
  let px = 64, py = 318, pillSvg = '';
  pills.forEach((p, i) => {
    const w = Math.round(textWidth(p, 14, true) + 28);
    if (px + w > 660) { px = 64; py += 42; }
    pillSvg += `<g class="in" ${delay(0.9 + i * 0.12)}><rect x="${px}" y="${py}" width="${w}" height="32" rx="16" fill="${t.panel2}" stroke="${t.border}"/><text x="${px + w / 2}" y="${py + 21}" text-anchor="middle" font-family="${MONO}" font-size="14" fill="${t.text}">${esc(p)}</text></g>`;
    px += w + 10;
  });

  return svg(W, H, {
    title: `${D.person.name} — ${D.person.title}`,
    desc: `${D.person.tagline} ${D.terminal.map(([k, v]) => `${k}: ${v}`).join('; ')}.`,
    defs: f.defs + `
    <linearGradient id="nameG" gradientUnits="userSpaceOnUse" x1="64" y1="0" x2="620" y2="0" spreadMethod="reflect">
      <stop offset="0" stop-color="${t.text}"/><stop offset=".45" stop-color="${t.accent}"/><stop offset=".75" stop-color="${t.cyan}"/><stop offset="1" stop-color="${t.text}"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="1112 0" dur="7s" repeatCount="indefinite"/>
    </linearGradient>`,
    css: f.css + css + `
    .caret{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
    .ring{animation:ring 2.4s ease-out infinite;transform-box:fill-box;transform-origin:center}
    @keyframes ring{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}`,
    body: `${f.back}
    <g class="in" ${delay(0.1)}><text x="64" y="92" font-family="${MONO}" font-size="16" letter-spacing="3" fill="${t.accent}">// HELLO, WORLD — I'M</text></g>
    <g class="in" ${delay(0.25)}><text x="60" y="176" font-family="${SANS}" font-size="84" font-weight="800" letter-spacing="-2" fill="url(#nameG)">${esc(D.person.name)}</text></g>
    <g class="in" ${delay(0.45)}><text x="64" y="224" font-family="${SANS}" font-size="24" fill="${t.text}">${esc(D.person.title)}</text></g>
    <g class="in" ${delay(0.6)}><text x="64" y="266" font-family="${SANS}" font-size="20" font-style="italic" fill="${t.muted}">“${esc(D.person.tagline)}”</text></g>
    ${pillSvg}
    <g class="in" ${delay(0.75)}>
      <circle cx="76" cy="${py + 76}" r="6" fill="${t.green}"/><circle class="ring" cx="76" cy="${py + 76}" r="6" fill="none" stroke="${t.green}" stroke-width="2"/>
      <text x="92" y="${py + 81}" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${t.green}">AVAILABLE · ${esc(D.person.location.toUpperCase())}</text>
    </g>
    <g class="in" ${delay(0.3)}>
      <rect x="676" y="62" width="496" height="340" rx="14" fill="${t.panel2}" stroke="${t.border}"/>
      <path d="M676 96 h496" stroke="${t.border}"/>
      <clipPath id="term"><rect x="676" y="97" width="496" height="304"/></clipPath>
      <circle cx="698" cy="79" r="6" fill="#ff5f57"/><circle cx="718" cy="79" r="6" fill="#febc2e"/><circle cx="738" cy="79" r="6" fill="#28c840"/>
      <text x="924" y="84" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${t.muted}">kashyap@github: ~</text>
      <g clip-path="url(#term)">${lines}</g>
      <text x="${tx}" y="${cursorY}" font-family="${MONO}" font-size="16" fill="${t.accent}">›</text>
      <rect class="caret" x="${tx + 20}" y="${cursorY - 16}" width="10" height="20" rx="2" fill="${t.accent}"/>
    </g>`,
  });
}

// ───────────────────────── odometer counters ─────────────────────────
export function counters(t) {
  const W = 1200, H = 196, gap = 20, tw = (W - 2 * gap - 3 * gap) / 4;
  let body = '', css = '';
  const ROW = 64;
  D.headline.forEach((h, i) => {
    const x = gap + i * (tw + gap), y = 16, c = color(t, h.key);
    let cx = x + 26, cols = '';
    [...h.value].forEach((ch, j) => {
      const adv = /\d/.test(ch) ? 34 : ch === '%' ? 46 : ch === '+' ? 34 : 16;
      if (/\d/.test(ch)) {
        const d = +ch, seq = [...Array(10).keys(), ...Array.from({ length: d + 1 }, (_, k) => k)];
        const yEnd = -(seq.length - 1) * ROW;
        cols += `<g clip-path="url(#win${i})"><g class="roll" style="--y:${yEnd}px;animation-delay:${(0.2 + i * 0.15 + j * 0.09).toFixed(2)}s">` +
          seq.map((n, k) => `<text x="${cx + adv / 2}" y="${y + 92 + k * ROW}" text-anchor="middle" font-family="${SANS}" font-size="56" font-weight="800" fill="${c}">${n}</text>`).join('') + `</g></g>`;
      } else {
        cols += `<text x="${cx + adv / 2}" y="${y + 92}" text-anchor="middle" font-family="${SANS}" font-size="${ch === '%' || ch === '+' ? 44 : 56}" font-weight="800" fill="${c}">${esc(ch)}</text>`;
      }
      cx += adv;
    });
    body += `
    <defs><clipPath id="win${i}"><rect x="${x}" y="${y + 38}" width="${tw}" height="${ROW}"/></clipPath>
    <linearGradient id="top${i}" x1="0" x2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>
    <g class="in" ${delay(i * 0.12)}>
      <rect x="${x}" y="${y}" width="${tw}" height="${H - 2 * y}" rx="16" fill="${t.panel2}" stroke="${t.border}"/>
      <rect x="${x + 1}" y="${y + 1}" width="${tw - 2}" height="3" rx="1.5" fill="url(#top${i})"/>
      ${cols}
      <text x="${x + 26}" y="${y + 130}" font-family="${SANS}" font-size="18" font-weight="600" fill="${t.text}">${esc(h.label)}</text>
      <text x="${x + 26}" y="${y + 154}" font-family="${MONO}" font-size="13" fill="${t.muted}">${esc(h.sub)}</text>
    </g>`;
  });
  css += `.roll{transform:translateY(var(--y));animation:roll 1.8s cubic-bezier(.16,.84,.24,1) both}
  @keyframes roll{from{transform:translateY(0)}to{transform:translateY(var(--y))}}`;
  return svg(W, H, {
    title: 'Headline numbers',
    desc: D.headline.map((h) => `${h.value} ${h.label} (${h.sub})`).join('; '),
    css, body,
  });
}

// ─────────────────────────── section header ───────────────────────────
export function header(t, num, title, sub) {
  const W = 1200, H = 112;
  return svg(W, H, {
    title, desc: `${num} — ${sub}`,
    defs: `<linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset=".6" stop-color="${t.cyan}"/><stop offset="1" stop-color="${t.green}" stop-opacity="0"/></linearGradient>`,
    css: `.grow{transform-origin:0 0;animation:grow 1.2s cubic-bezier(.2,.8,.2,1) .2s both}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    .glint{animation:glint 5s ease-in-out 1.4s infinite}@keyframes glint{0%{transform:translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateX(1150px);opacity:0}}`,
    body: `
    <g class="in"><text x="4" y="34" font-family="${MONO}" font-size="15" font-weight="600" letter-spacing="4" fill="${t.accent}">${esc(num)} / ${esc(sub.toUpperCase())}</text></g>
    <g class="in" ${delay(0.1)}><text x="0" y="82" font-family="${SANS}" font-size="44" font-weight="800" letter-spacing="-1" fill="${t.text}">${esc(title)}</text></g>
    <rect x="0" y="100" width="${W}" height="2" fill="${t.border}"/>
    <rect class="grow" x="0" y="99" width="300" height="4" rx="2" fill="url(#bar)"/>
    <circle class="glint" cx="20" cy="101" r="3.5" fill="${t.cyan}"/>`,
  });
}

// ───────────────────────────── neofetch ─────────────────────────────
const ASCII = [
  '██    ██   ███████ ',
  '██   ██    ██    ██',
  '██  ██     ██    ██',
  '█████      ███████ ',
  '██  ██     ██      ',
  '██   ██    ██      ',
  '██    ██   ██      ',
];
export function neofetch(t) {
  const W = 1200, rowH = 31, top = 112;
  const H = top + D.neofetch.length * rowH + 110;
  const f = frame(t, W, H, { id: 'n', hue: ['cyan', 'accent', 'green'] });
  const ax = 56, ay = 200;
  const PX = 17, art = ASCII.flatMap((l, r) => [...l].map((ch, q) => ch === '█' ? `<rect class="px" style="animation-delay:${(0.2 + (q + r) * 0.03).toFixed(2)}s" x="${ax + q * PX}" y="${ay - 30 + r * PX}" width="${PX - 2}" height="${PX - 2}" rx="3" fill="url(#asc)"/>` : '')).join('');
  const kx = 470;
  const rows = D.neofetch.map(([k, v], i) => `<g class="in" ${delay(0.3 + i * 0.09)}><text x="${kx}" y="${top + 52 + i * rowH}" font-family="${MONO}" font-size="17"><tspan fill="${t.accent}" font-weight="700">${esc(k)}</tspan><tspan fill="${t.faint}">: </tspan><tspan fill="${t.text}">${esc(v)}</tspan></text></g>`).join('');
  const pal = [t.accent, t.cyan, t.green, t.amber, t.pink, t.blue, t.text, t.muted];
  const palY = top + 52 + D.neofetch.length * rowH;
  return svg(W, H, {
    title: 'About Kashyap', desc: D.neofetch.map(([k, v]) => `${k}: ${v}`).join('; '),
    defs: f.defs + `<linearGradient id="asc" gradientUnits="userSpaceOnUse" x1="${ax}" y1="${ay - 30}" x2="${ax + 340}" y2="${ay + 100}"><stop offset="0" stop-color="${t.accent}"/><stop offset=".5" stop-color="${t.cyan}"/><stop offset="1" stop-color="${t.green}"/></linearGradient>
    <clipPath id="artclip"><rect x="${ax - 10}" y="${ay - 34}" width="340" height="130"/></clipPath>`,
    css: f.css + `.px{opacity:0;animation:px .5s ease-out forwards}@keyframes px{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}.px{transform-box:fill-box;transform-origin:center}
    .scan{animation:scan 3.5s linear infinite}@keyframes scan{from{transform:translateY(0)}to{transform:translateY(130px)}}`,
    body: `${f.back}
    <g class="in">${art}</g>
    <g clip-path="url(#artclip)"><rect class="scan" x="${ax - 10}" y="${ay - 40}" width="340" height="6" fill="${t.cyan}" opacity=".35"/></g>
    <g class="in" ${delay(0.4)}>
      <text x="${ax}" y="${ay + 148}" font-family="${MONO}" font-size="15" fill="${t.muted}">Engineering systems that</text>
      <text x="${ax}" y="${ay + 172}" font-family="${MONO}" font-size="15" fill="${t.muted}">scale, survive, and ship.</text>
    </g>
    <g class="in" ${delay(0.15)}>
      <text x="${kx}" y="${top}" font-family="${MONO}" font-size="20" font-weight="700"><tspan fill="${t.accent}">kashyap</tspan><tspan fill="${t.text}">@</tspan><tspan fill="${t.cyan}">github</tspan></text>
      <text x="${kx}" y="${top + 22}" font-family="${MONO}" font-size="17" fill="${t.faint}">──────────────────</text>
    </g>
    ${rows}
    <g class="in" ${delay(1.4)}>${pal.map((c, i) => `<rect x="${kx + i * 38}" y="${palY}" width="30" height="22" rx="4" fill="${c}"/>`).join('')}</g>`,
  });
}

// ──────────────────────────── experience ────────────────────────────
export function experience(t) {
  const W = 1200, lx = 64, cx = 110, cw = W - cx - 40, pad = 26;
  let y = 40, cards = '', dots = [];
  D.experience.forEach((e, i) => {
    const bullets = e.impact.map((b) => wrap(b, cw - 2 * pad - 24, 17));
    const bH = bullets.reduce((s, l) => s + l.length * 25 + 8, 0);
    const chipRes = chips(t, e.stack, cx + pad, 0, cw - 2 * pad, { size: 12, h: 24, colorKey: 'cyan' });
    const chipH = chipRes.bottom;
    const h = pad + 118 + bH + chipH + pad;
    let by = y + pad + 118, bl = '';
    bullets.forEach((ls) => {
      bl += `<text x="${cx + pad}" y="${by}" font-family="${SANS}" font-size="17" fill="${t.accent}">▹</text>`;
      ls.forEach((l, k) => { bl += `<text x="${cx + pad + 24}" y="${by + k * 25}" font-family="${SANS}" font-size="17" fill="${t.text}">${esc(l)}</text>`; });
      by += ls.length * 25 + 8;
    });
    const chipsAt = chips(t, e.stack, cx + pad, by + 4, cw - 2 * pad, { size: 12, h: 24, colorKey: 'cyan' }).svg;
    cards += `<g class="in" ${delay(0.25 + i * 0.25)}>
      <rect x="${cx}" y="${y}" width="${cw}" height="${h}" rx="14" fill="${t.panel2}" stroke="${e.current ? t.accent : t.border}" stroke-opacity="${e.current ? 0.7 : 1}"/>
      <text x="${cx + pad}" y="${y + pad + 14}" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${t.accent}">${esc(e.period.toUpperCase())}</text>
      ${e.current ? `<g><rect x="${cx + cw - pad - 96}" y="${y + pad - 4}" width="96" height="26" rx="13" fill="${t.green}" fill-opacity=".12" stroke="${t.green}" stroke-opacity=".5"/><circle class="pulse" cx="${cx + cw - pad - 80}" cy="${y + pad + 9}" r="4" fill="${t.green}"/><text x="${cx + cw - pad - 68}" y="${y + pad + 14}" font-family="${MONO}" font-size="12" font-weight="700" fill="${t.green}">CURRENT</text></g>` : ''}
      <text x="${cx + pad}" y="${y + pad + 52}" font-family="${SANS}" font-size="27" font-weight="800" fill="${t.text}">${esc(e.role)}</text>
      <text x="${cx + pad}" y="${y + pad + 82}" font-family="${SANS}" font-size="18" fill="${t.muted}"><tspan fill="${t.cyan}" font-weight="700">${esc(e.company)}</tspan> · ${esc(e.place)}</text>
      ${bl}${chipsAt}
    </g>`;
    dots.push([y + pad + 10, e.current]);
    y += h + 28;
  });
  const H = y + 12;
  const f = frame(t, W, H, { id: 'x', sweep: true, blobs: true });
  const lineLen = dots.at(-1)[0] - dots[0][0];
  return svg(W, H, {
    title: 'Experience', desc: D.experience.map((e) => `${e.role}, ${e.company} (${e.period}): ${e.impact.join(' ')}`).join(' | '),
    defs: f.defs + `<linearGradient id="tl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.cyan}"/></linearGradient>`,
    css: f.css + `.tl{stroke-dasharray:${lineLen};stroke-dashoffset:${lineLen};animation:draw 1.6s ease-out .2s forwards}@keyframes draw{to{stroke-dashoffset:0}}
    .ring{animation:ring 2.4s ease-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ring{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.8)}}`,
    body: `${f.back}
    <line x1="${lx}" y1="${dots[0][0]}" x2="${lx}" y2="${dots.at(-1)[0]}" stroke="${t.border}" stroke-width="3"/>
    <line class="tl" x1="${lx}" y1="${dots[0][0]}" x2="${lx}" y2="${dots.at(-1)[0]}" stroke="url(#tl)" stroke-width="3"/>
    ${dots.map(([dy, cur], i) => `<g class="in" ${delay(0.2 + i * 0.25)}><circle cx="${lx}" cy="${dy}" r="9" fill="${t.panel}" stroke="${cur ? t.green : t.accent}" stroke-width="3"/>${cur ? `<circle class="ring" cx="${lx}" cy="${dy}" r="9" fill="none" stroke="${t.green}" stroke-width="2"/>` : ''}<line x1="${lx + 12}" y1="${dy}" x2="${cx}" y2="${dy}" stroke="${t.border}" stroke-width="2" stroke-dasharray="4 4"/></g>`).join('')}
    ${cards}`,
  });
}

// ─────────────────────────── flagship panel ───────────────────────────
const fmtNum = (n) => (n >= 1000 ? n.toLocaleString('en-US') : String(n));
function improvement(before, after, unit, label) {
  const verb = /CLS|shift/i.test(label) ? 'lower' : unit === 'kB' ? 'smaller' : unit === '' ? 'fewer' : 'faster';
  const x = before / after;
  return x >= 2 ? `${x >= 100 ? Math.round(x) : x.toFixed(x >= 10 ? 0 : 1)}× ${verb}` : `−${Math.round((1 - after / before) * 100)}%`;
}

export function flagship(t, p) {
  const W = 1200, pad = 48, c = color(t, p.key);
  const descLines = wrap(p.desc, W - 2 * pad, 19);
  let y = 150 + descLines.length * 29 + 18;
  let block = '', css = '';
  if (p.metrics) {
    block += `<text x="${pad}" y="${y}" font-family="${MONO}" font-size="13" letter-spacing="3" fill="${t.muted}">MEASURED · BEFORE → AFTER</text>`;
    y += 26;
    const bx = 380, bw = 400;
    p.metrics.forEach(([label, b, a, unit], i) => {
      const s = Math.max(a / b, 0.012);
      const u = unit ? ` ${unit}` : '';
      block += `<g class="in" ${delay(0.4 + i * 0.12)}>
        <text x="${pad}" y="${y + 22}" font-family="${SANS}" font-size="17" fill="${t.text}">${esc(label)}</text>
        <rect x="${bx}" y="${y + 8}" width="${bw}" height="16" rx="8" fill="${t.faint}" fill-opacity="${t.name === 'dark' ? 0.25 : 0.35}"/>
        <rect class="shrink" style="--s:${s.toFixed(4)};animation-delay:${(0.8 + i * 0.15).toFixed(2)}s" x="${bx}" y="${y + 8}" width="${bw}" height="16" rx="8" fill="${c}"/>
        <text x="${bx + bw + 20}" y="${y + 22}" font-family="${MONO}" font-size="15" fill="${t.muted}">${esc(fmtNum(b) + u)} → <tspan fill="${t.text}" font-weight="700">${esc(fmtNum(a) + u)}</tspan></text>
        <text x="${W - pad}" y="${y + 22}" text-anchor="end" font-family="${MONO}" font-size="15" font-weight="700" fill="${c}">${esc(improvement(b, a, unit, label))}</text>
      </g>`;
      y += 44;
    });
    css += `.shrink{transform-box:fill-box;transform-origin:left center;transform:scaleX(var(--s));animation:shrink 1.6s cubic-bezier(.3,.7,.2,1) both}
    @keyframes shrink{from{transform:scaleX(1)}to{transform:scaleX(var(--s))}}`;
  } else {
    const n = p.facts.length, gap = 16, tw = (W - 2 * pad - (n - 1) * gap) / n;
    p.facts.forEach(([v, l], i) => {
      const x = pad + i * (tw + gap);
      block += `<g class="in" ${delay(0.4 + i * 0.12)}>
        <rect x="${x}" y="${y}" width="${tw}" height="104" rx="14" fill="${t.panel2}" stroke="${t.border}"/>
        <rect x="${x + 16}" y="${y}" width="${tw - 32}" height="3" fill="${c}" opacity=".8"/>
        <text x="${x + 22}" y="${y + 56}" font-family="${SANS}" font-size="38" font-weight="800" fill="${c}">${esc(v)}</text>
        <text x="${x + 22}" y="${y + 84}" font-family="${SANS}" font-size="15" fill="${t.muted}">${esc(l)}</text>
      </g>`;
    });
    y += 104 + 10;
  }
  const ch = chips(t, p.stack, pad, y + 18, W - 2 * pad, { size: 13, colorKey: p.key });
  const H = ch.bottom + 40;
  const f = frame(t, W, H, { id: 'p', hue: [p.key, 'cyan', 'accent'] });
  return svg(W, H, {
    title: p.title, desc: `${p.tag}. ${p.desc}`,
    defs: f.defs, css: f.css + css,
    body: `${f.back}
    <g class="in"><text x="${pad}" y="58" font-family="${MONO}" font-size="14" font-weight="700" letter-spacing="3" fill="${c}">${esc(p.tag)}</text></g>
    ${p.live ? `<g class="in" ${delay(0.2)}><rect x="${W - pad - 118}" y="36" width="118" height="30" rx="15" fill="${t.green}" fill-opacity=".12" stroke="${t.green}" stroke-opacity=".55"/><circle class="pulse" cx="${W - pad - 98}" cy="51" r="5" fill="${t.green}"/><text x="${W - pad - 84}" y="56" font-family="${MONO}" font-size="13" font-weight="700" fill="${t.green}">LIVE APP</text></g>` : `<g class="in" ${delay(0.2)}><rect x="${W - pad - 150}" y="36" width="150" height="30" rx="15" fill="${t.amber}" fill-opacity=".12" stroke="${t.amber}" stroke-opacity=".55"/><text x="${W - pad - 75}" y="56" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" fill="${t.amber}">IEEE · PATENT</text></g>`}
    <g class="in" ${delay(0.1)}><text x="${pad}" y="110" font-family="${SANS}" font-size="42" font-weight="800" letter-spacing="-1" fill="${t.text}">${esc(p.title)}</text></g>
    <g class="in" ${delay(0.2)}>${descLines.map((l, i) => `<text x="${pad}" y="${150 + i * 29}" font-family="${SANS}" font-size="19" fill="${t.muted}">${esc(l)}</text>`).join('')}</g>
    ${block}
    <g class="in" ${delay(0.9)}>${ch.svg}</g>`,
  });
}

// ─────────────── animated art for the AI Interview Coach ───────────────
export function interviewArt(t) {
  const W = 1200, H = 400;
  const f = frame(t, W, H, { id: 'ia', hue: ['amber', 'accent', 'cyan'] });
  const fx = 800, fy = 196;
  // A face built from landmark points: jaw, brows, eyes, nose, mouth.
  const jaw = [];
  for (let k = 0; k <= 16; k++) { const a = Math.PI * (0.05 + (0.9 * k) / 16); jaw.push([fx - 118 * Math.cos(a), fy + 10 + 140 * Math.sin(a) * 0.95]); }
  const brow = (sx) => [0, 1, 2, 3, 4].map((k) => [fx + sx * (26 + k * 14), fy - 62 - Math.sin((k / 4) * Math.PI) * 10]);
  const eye = (sx) => [0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2; return [fx + sx * 52 + 20 * Math.cos(a), fy - 30 + 8 * Math.sin(a)]; });
  const nose = [[fx, fy - 20], [fx, fy], [fx, fy + 20], [fx - 14, fy + 34], [fx, fy + 38], [fx + 14, fy + 34]];
  const mouthTop = [0, 1, 2, 3, 4, 5, 6].map((k) => [fx - 42 + k * 14, fy + 78 - Math.sin((k / 6) * Math.PI) * 6]);
  const mouthBot = [1, 2, 3, 4, 5].map((k) => [fx - 42 + k * 14, fy + 82 + Math.sin((k / 6) * Math.PI) * 14]);
  const dot = (p, cls = '') => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.2" class="${cls}" fill="${t.cyan}"/>`;
  const poly = (ps) => `<polyline points="${ps.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${t.cyan}" stroke-opacity=".35" stroke-width="1.5"/>`;
  const bars = Array.from({ length: 14 }, (_, i) => {
    const x = 980 + i * 13, h = 24 + ((i * 37) % 50);
    return `<rect x="${x}" y="${fy + 30 - h / 2}" width="7" height="${h}" rx="3.5" fill="${t.amber}" class="wv" style="animation-delay:${(i * 0.07).toFixed(2)}s"/>`;
  }).join('');
  const badges = [['FACE MATCH', '98.7%', t.green], ['LIP-SYNC', 'VERIFIED', t.accent], ['VOICE', 'AUTHENTIC', t.amber]];
  return svg(W, H, {
    title: 'AI Interview Coach', desc: 'Animated illustration: facial landmarks tracked on a face, a scan line, mouth movement in sync with a voice waveform, and verification badges for face, lip-sync and voice.',
    defs: f.defs, css: f.css + `
    .sc{animation:sc 3s ease-in-out infinite alternate}@keyframes sc{from{transform:translateY(0)}to{transform:translateY(270px)}}
    .mouth{transform-box:fill-box;transform-origin:top center;animation:talk .9s ease-in-out infinite alternate}@keyframes talk{from{transform:scaleY(.4)}to{transform:scaleY(1.15)}}
    .wv{transform-box:fill-box;transform-origin:center;animation:wv .9s ease-in-out infinite alternate}@keyframes wv{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
    .blinkeye{transform-box:fill-box;transform-origin:center;animation:be 5s infinite}@keyframes be{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
    .corner{animation:cp 2s ease-in-out infinite}@keyframes cp{50%{opacity:.35}}
    .bdg{opacity:0;animation:bdg 9s infinite}@keyframes bdg{0%{opacity:0;transform:translateX(12px)}8%,80%{opacity:1;transform:none}90%,100%{opacity:0}}`,
    body: `${f.back}
    <g class="in"><text x="56" y="92" font-family="${MONO}" font-size="14" font-weight="700" letter-spacing="3" fill="${t.amber}">GEN AI · COMPUTER VISION</text></g>
    <g class="in" ${delay(0.1)}><text x="52" y="160" font-family="${SANS}" font-size="56" font-weight="800" letter-spacing="-1.5" fill="${t.text}">AI Interview</text><text x="52" y="222" font-family="${SANS}" font-size="56" font-weight="800" letter-spacing="-1.5" fill="${t.amber}">Coach</text></g>
    <g class="in" ${delay(0.25)}><text x="56" y="268" font-family="${SANS}" font-size="19" fill="${t.muted}">Lip-sync verification · gaze tracking · voice authentication</text></g>
    <g class="in" ${delay(0.4)}>${chips(t, ['IEEE ICCCNT-2025', 'Patent #202541122226'], 56, 300, 560, { size: 13, colorKey: 'amber' }).svg}</g>
    <g stroke="${t.amber}" stroke-width="3" fill="none" class="corner">
      <path d="M${fx - 150} ${fy - 110} v-26 h26"/><path d="M${fx + 150} ${fy - 110} v-26 h-26"/>
      <path d="M${fx - 150} ${fy + 150} v26 h26"/><path d="M${fx + 150} ${fy + 150} v26 h-26"/>
    </g>
    <text x="${fx - 150}" y="${fy - 146}" font-family="${MONO}" font-size="12" fill="${t.amber}">candidate · tracking</text>
    ${poly(jaw)}${poly(brow(-1))}${poly(brow(1))}${poly(nose)}
    ${jaw.map((p) => dot(p)).join('')}${brow(-1).map((p) => dot(p)).join('')}${brow(1).map((p) => dot(p)).join('')}${nose.map((p) => dot(p)).join('')}
    <g class="blinkeye">${poly([...eye(-1), eye(-1)[0]])}${eye(-1).map((p) => dot(p)).join('')}</g>
    <g class="blinkeye">${poly([...eye(1), eye(1)[0]])}${eye(1).map((p) => dot(p)).join('')}</g>
    ${poly(mouthTop)}${mouthTop.map((p) => dot(p)).join('')}
    <g class="mouth">${poly([mouthTop[0], ...mouthBot, mouthTop[6]])}${mouthBot.map((p) => dot(p)).join('')}</g>
    <rect class="sc" x="${fx - 150}" y="${fy - 122}" width="300" height="3" fill="${t.cyan}" opacity=".7"/>
    ${bars}
    <text x="980" y="${fy - 22}" font-family="${MONO}" font-size="12" fill="${t.muted}">voice · live</text>
    ${badges.map(([k, v, c], i) => `<g class="bdg" style="animation-delay:${(0.6 + i * 0.9).toFixed(1)}s"><rect x="980" y="${fy + 92 + i * 38 - 22}" width="180" height="32" rx="8" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-opacity=".6"/><text x="994" y="${fy + 92 + i * 38}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c}">✓ ${k}</text><text x="1148" y="${fy + 92 + i * 38}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${t.text}">${v}</text></g>`).join('')}`,
  });
}

// ─────────────────────────── project cards ───────────────────────────
function glyph(t, kind, cx, cy, c) {
  const st = (w = 3) => `stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const s = st();
  switch (kind) {
    case 'search': return `<circle cx="${cx - 6}" cy="${cy - 6}" r="18" ${s}/><path d="M${cx + 7} ${cy + 7} l14 14" ${s}/><rect class="gscan" x="${cx - 22}" y="${cy - 16}" width="32" height="2.5" fill="${c}"/>`;
    case 'pulse': { const d = `M${cx - 32} ${cy} h14 l6 -18 l10 34 l8 -26 l6 10 h20`; return `<path d="${d}" ${s} opacity=".3"/><path class="gdash" d="${d}" ${s}/>`; }
    case 'wave': return Array.from({ length: 7 }, (_, i) => `<rect class="gbar" style="animation-delay:${(i * 0.1).toFixed(1)}s" x="${cx - 30 + i * 9}" y="${cy - 18}" width="5" height="36" rx="2.5" fill="${c}"/>`).join('');
    case 'scan': return `<path d="M${cx - 26} ${cy - 14} v-12 h12 M${cx + 26} ${cy - 14} v-12 h-12 M${cx - 26} ${cy + 14} v12 h12 M${cx + 26} ${cy + 14} v12 h-12" ${s}/><circle cx="${cx}" cy="${cy - 4}" r="8" ${s}/><path d="M${cx - 12} ${cy + 16} q12 -12 24 0" ${s}/><rect class="gscan2" x="${cx - 26}" y="${cy - 26}" width="52" height="2.5" fill="${c}"/>`;
    case 'chat': return `<rect x="${cx - 30}" y="${cy - 22}" width="46" height="30" rx="9" ${s}/><path d="M${cx - 20} ${cy + 8} l-4 10 l12 -10" ${s}/>${[0, 1, 2].map((i) => `<circle class="gdot" style="animation-delay:${i * 0.15}s" cx="${cx - 18 + i * 11}" cy="${cy - 7}" r="3" fill="${c}"/>`).join('')}<rect x="${cx}" y="${cy + 4}" width="30" height="20" rx="7" ${s} opacity=".5"/>`;
    case 'graph': { const n = [[cx - 24, cy - 16], [cx + 22, cy - 22], [cx - 10, cy + 20], [cx + 26, cy + 16]]; return `<path d="M${n[0]} L${n[1]} L${n[3]} L${n[2]} Z M${n[0]} L${n[3]}" ${st(2)} opacity=".6"/>` + n.map((p, i) => `<circle class="gnode" style="animation-delay:${(i * 0.4).toFixed(1)}s" cx="${p[0]}" cy="${p[1]}" r="6" fill="${c}"/>`).join(''); }
    case 'orbit': return `<circle cx="${cx}" cy="${cy}" r="7" fill="${c}"/><ellipse cx="${cx}" cy="${cy}" rx="30" ry="12" ${st(2)} opacity=".55"/><g class="gspin" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx + 30}" cy="${cy}" r="4.5" fill="${c}"/></g><ellipse cx="${cx}" cy="${cy}" rx="12" ry="30" ${st(2)} opacity=".35"/>`;
    case 'route': return `<path d="M${cx - 30} ${cy + 18} C${cx - 10} ${cy + 18} ${cx - 16} ${cy - 18} ${cx + 4} ${cy - 18} S${cx + 22} ${cy + 8} ${cx + 30} ${cy - 10}" ${s} opacity=".3"/><path class="gdash" d="M${cx - 30} ${cy + 18} C${cx - 10} ${cy + 18} ${cx - 16} ${cy - 18} ${cx + 4} ${cy - 18} S${cx + 22} ${cy + 8} ${cx + 30} ${cy - 10}" ${s}/><circle cx="${cx - 30}" cy="${cy + 18}" r="5" fill="${c}"/><circle class="pulse" cx="${cx + 30}" cy="${cy - 10}" r="5" fill="${c}"/>`;
    case 'grid': return [0, 1, 2].flatMap((r) => [0, 1, 2].map((q) => `<rect class="gcell" style="animation-delay:${((r * 3 + q) * 0.18).toFixed(2)}s" x="${cx - 27 + q * 19}" y="${cy - 27 + r * 19}" width="15" height="15" rx="3" fill="${c}"/>`)).join('');
    case 'pixel': return `<rect x="${cx - 30}" y="${cy + 22}" width="60" height="5" rx="2" fill="${c}" opacity=".5"/><rect class="gjump" x="${cx - 9}" y="${cy + 2}" width="18" height="18" rx="3" fill="${c}"/>`;
    default: return '';
  }
}
const GLYPH_CSS = `
  .gscan{animation:gs 2s ease-in-out infinite alternate}@keyframes gs{to{transform:translateY(20px)}}
  .gscan2{animation:gs2 2.2s ease-in-out infinite alternate}@keyframes gs2{to{transform:translateY(50px)}}
  .gdash{stroke-dasharray:36 110;animation:gd 1.8s linear infinite}@keyframes gd{from{stroke-dashoffset:146}to{stroke-dashoffset:0}}
  .gbar{transform-box:fill-box;transform-origin:center;animation:gb .8s ease-in-out infinite alternate}@keyframes gb{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
  .gdot{animation:gdot 1.2s ease-in-out infinite}@keyframes gdot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
  .gnode{transform-box:fill-box;transform-origin:center;animation:gn 1.6s ease-in-out infinite}@keyframes gn{50%{transform:scale(1.5);opacity:.6}}
  .gspin{animation:spin 3s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  .gcell{opacity:.25;animation:gc 1.8s ease-in-out infinite}@keyframes gc{30%{opacity:1}60%{opacity:.25}}
  .gjump{animation:gj 1s cubic-bezier(.3,0,.7,1) infinite alternate}@keyframes gj{to{transform:translateY(-22px)}}`;

export function projectCard(t, p) {
  const W = 600, H = 290, pad = 32, c = color(t, p.key);
  const f = frame(t, W, H, { id: 'c', hue: [p.key, 'cyan', 'accent'] });
  const lines = wrap(p.desc, W - 2 * pad, 17).slice(0, 4);
  const ch = chips(t, p.stack, pad, H - pad - 28, W - 2 * pad, { size: 12, h: 26, colorKey: p.key });
  return svg(W, H, {
    title: p.title, desc: `${p.tag}. ${p.desc} Built with ${p.stack.join(', ')}.`,
    defs: f.defs, css: f.css + GLYPH_CSS,
    body: `${f.back}
    <g class="in"><text x="${pad}" y="${pad + 18}" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2.5" fill="${c}">${esc(p.tag)}<tspan fill="${t.muted}"> · ${p.year}</tspan></text>
    <text x="${pad}" y="${pad + 60}" font-family="${SANS}" font-size="29" font-weight="800" letter-spacing="-.5" fill="${t.text}">${esc(p.title)}</text></g>
    <g>${glyph(t, p.glyph, W - pad - 34, pad + 30, c)}</g>
    <g class="in" ${delay(0.15)}>${lines.map((l, i) => `<text x="${pad}" y="${pad + 100 + i * 26}" font-family="${SANS}" font-size="17" fill="${t.muted}">${esc(l)}</text>`).join('')}</g>
    <g class="in" ${delay(0.3)}>${ch.svg}</g>`,
  });
}

// ───────────────────────── research & patent ─────────────────────────
export function research(t) {
  const W = 1200, pad = 48, colW = 690;
  let y = 56, pubs = '';
  D.publications.forEach((p, i) => {
    const c = color(t, p.key);
    const tl = wrap(p.title, colW - 40, 21);
    const vl = wrap(p.venue, colW - 40, 14, true);
    const bw = textWidth(p.badge, 12, true) + 24;
    pubs += `<g class="in" ${delay(0.2 + i * 0.18)}>
      <rect x="${pad}" y="${y - 4}" width="4" height="${36 + tl.length * 28 + vl.length * 20}" rx="2" fill="${c}"/>
      <rect x="${pad + 20}" y="${y}" width="${bw}" height="24" rx="12" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-opacity=".5"/>
      <text x="${pad + 20 + bw / 2}" y="${y + 16}" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="700" fill="${c}">${esc(p.badge)}</text>
      ${tl.map((l, k) => `<text x="${pad + 20}" y="${y + 56 + k * 28}" font-family="${SANS}" font-size="21" font-weight="700" fill="${t.text}">${esc(l)}</text>`).join('')}
      ${vl.map((l, k) => `<text x="${pad + 20}" y="${y + 56 + tl.length * 28 + k * 20}" font-family="${MONO}" font-size="14" fill="${t.muted}">${esc(l)}</text>`).join('')}
    </g>`;
    y += 56 + tl.length * 28 + vl.length * 20 + 34;
  });
  const H = Math.max(y + 10, 470);
  const px = pad + colW + 40, pw = W - px - pad, pcx = px + pw / 2;
  const f = frame(t, W, H, { id: 'r', hue: ['amber', 'accent', 'cyan'] });
  const pt = wrap(D.patent.title, pw - 40, 19);
  return svg(W, H, {
    title: 'Research and patent', desc: `${D.publications.map((p) => `${p.badge}: ${p.title}`).join('; ')}. Patent: ${D.patent.title}, ${D.patent.office}, application ${D.patent.number} (${D.patent.year}), ${D.patent.status}.`,
    defs: f.defs + `<linearGradient id="seal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.amber}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient>`,
    css: f.css + `.rot{animation:spin 18s linear infinite;transform-origin:${pcx}px 140px}.rot2{animation:spin 12s linear infinite reverse;transform-origin:${pcx}px 140px}@keyframes spin{to{transform:rotate(360deg)}}`,
    body: `${f.back}
    ${pubs}
    <g class="in" ${delay(0.5)}>
      <rect x="${px}" y="36" width="${pw}" height="${H - 72}" rx="16" fill="${t.panel2}" stroke="${t.amber}" stroke-opacity=".5"/>
      <circle class="rot" cx="${pcx}" cy="140" r="70" fill="none" stroke="url(#seal)" stroke-width="3" stroke-dasharray="6 7"/>
      <circle class="rot2" cx="${pcx}" cy="140" r="56" fill="none" stroke="${t.amber}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="2 5"/>
      <circle cx="${pcx}" cy="140" r="44" fill="${t.amber}" fill-opacity=".12"/>
      <text x="${pcx}" y="134" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="2" fill="${t.amber}">PATENT</text>
      <text x="${pcx}" y="154" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${t.text}">${D.patent.year}</text>
      ${pt.map((l, k) => `<text x="${pcx}" y="${250 + k * 26}" text-anchor="middle" font-family="${SANS}" font-size="19" font-weight="700" fill="${t.text}">${esc(l)}</text>`).join('')}
      <text x="${pcx}" y="${262 + pt.length * 26}" text-anchor="middle" font-family="${MONO}" font-size="15" fill="${t.amber}">#${D.patent.number}</text>
      <text x="${pcx}" y="${288 + pt.length * 26}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${t.muted}">${esc(D.patent.office)}</text>
      <circle class="pulse" cx="${pcx - 50}" cy="${315 + pt.length * 26}" r="5" fill="${t.green}"/>
      <text x="${pcx - 38}" y="${320 + pt.length * 26}" font-family="${MONO}" font-size="13" font-weight="700" fill="${t.green}">${esc(D.patent.status.toUpperCase())}</text>
    </g>`,
  });
}

// ─────────────────────────── certifications ───────────────────────────
export function certs(t) {
  const W = 1200, H = 236, gap = 16, n = D.certifications.length, tw = (W - 2 * 24 - (n - 1) * gap) / n;
  const body = D.certifications.map((c, i) => {
    const x = 24 + i * (tw + gap), col = color(t, c.key), nl = wrap(c.name, tw - 36, 17);
    const sx = x + 22, sy = 40;
    return `<g class="in" ${delay(i * 0.12)}>
      <rect x="${x}" y="16" width="${tw}" height="${H - 32}" rx="16" fill="${t.panel2}" stroke="${t.border}"/>
      <rect x="${x + 18}" y="16" width="${tw - 36}" height="3" fill="${col}"/>
      <path d="M${sx + 18} ${sy} l18 7 v14 c0 12 -8 20 -18 24 c-10 -4 -18 -12 -18 -24 v-14 z" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="2"/>
      <path class="tick" style="animation-delay:${(0.5 + i * 0.15).toFixed(2)}s" d="M${sx + 10} ${sy + 22} l6 6 l11 -12" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${nl.map((l, k) => `<text x="${x + 22}" y="${sy + 82 + k * 23}" font-family="${SANS}" font-size="17" font-weight="700" fill="${t.text}">${esc(l)}</text>`).join('')}
      <text x="${x + 22}" y="${H - 38}" font-family="${MONO}" font-size="12" fill="${col}">${esc(c.provider)}</text>
    </g>`;
  }).join('');
  return svg(W, H, {
    title: 'Certifications', desc: D.certifications.map((c) => `${c.name} (${c.provider})`).join('; '),
    css: `.tick{stroke-dasharray:30;stroke-dashoffset:30;animation:tick .6s ease-out forwards}@keyframes tick{to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){.tick{stroke-dashoffset:0}}`,
    body,
  });
}

// ─────────────────────────────── skills ───────────────────────────────
export function skills(t) {
  const W = 1200, gap = 16, cols = 3, cw = (W - 2 * 24 - (cols - 1) * gap) / cols;
  const rows = Math.ceil(D.skills.length / cols);
  const maxItems = Math.max(...D.skills.map((g) => g.items.length));
  const ch = 70 + maxItems * 40 + 10;
  const H = 16 + rows * ch + (rows - 1) * gap + 16;
  let body = '';
  D.skills.forEach((g, gi) => {
    const x = 24 + (gi % cols) * (cw + gap), y = 16 + Math.floor(gi / cols) * (ch + gap), c = color(t, g.key);
    body += `<g class="in" ${delay(gi * 0.1)}><rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="16" fill="${t.panel2}" stroke="${t.border}"/>
      <circle cx="${x + 30}" cy="${y + 38}" r="6" fill="${c}"/><text x="${x + 46}" y="${y + 44}" font-family="${SANS}" font-size="20" font-weight="800" fill="${t.text}">${esc(g.label)}</text></g>`;
    g.items.forEach(([name, lvl], k) => {
      const iy = y + 86 + k * 40;
      body += `<g class="in" ${delay(0.2 + gi * 0.1 + k * 0.05)}><text x="${x + 24}" y="${iy}" font-family="${SANS}" font-size="16" fill="${t.text}">${esc(name)}</text>` +
        [0, 1, 2, 3, 4].map((s) => `<rect x="${x + cw - 24 - (5 - s) * 22}" y="${iy - 11}" width="18" height="10" rx="3" fill="${s < lvl ? c : t.faint}" fill-opacity="${s < lvl ? 1 : 0.35}" ${s < lvl ? `class="seg" style="animation-delay:${(0.5 + gi * 0.1 + k * 0.06 + s * 0.08).toFixed(2)}s"` : ''}/>`).join('') + `</g>`;
    });
  });
  return svg(W, H, {
    title: 'Skills', desc: D.skills.map((g) => `${g.label}: ${g.items.map(([n, l]) => `${n} ${l}/5`).join(', ')}`).join('; '),
    css: `.seg{transform-box:fill-box;transform-origin:left;animation:seg .4s ease-out both}@keyframes seg{from{transform:scaleX(0)}to{transform:scaleX(1)}}`,
    body,
  });
}

// ─────────────────────────────── marquee ───────────────────────────────
export function marquee(t) {
  const W = 1200, H = 132;
  const keys = ['accent', 'cyan', 'green', 'amber', 'pink', 'blue'];
  let body = '', css = '';
  D.marquee.forEach((row, r) => {
    let x = 0, set = '';
    row.forEach((label, i) => {
      const w = textWidth(label, 16, true) + 40, c = color(t, keys[(i + r * 2) % keys.length]);
      set += `<g><rect x="${x}" y="0" width="${w}" height="40" rx="20" fill="${t.panel2}" stroke="${c}" stroke-opacity=".5"/><circle cx="${x + 18}" cy="20" r="4" fill="${c}"/><text x="${x + 30}" y="26" font-family="${MONO}" font-size="16" font-weight="600" fill="${t.text}">${esc(label)}</text></g>`;
      x += w + 14;
    });
    const L = Math.round(x);
    css += `.m${r}{animation:m${r} ${Math.round(L / 28)}s linear infinite}@keyframes m${r}{from{transform:translateX(${r ? -L : 0}px)}to{transform:translateX(${r ? 0 : -L}px)}}`;
    body += `<g transform="translate(0 ${16 + r * 58})"><g class="m${r}">${set}<g transform="translate(${L} 0)">${set}</g><g transform="translate(${2 * L} 0)">${set}</g></g></g>`;
  });
  return svg(W, H, {
    title: 'Technologies', desc: D.marquee.flat().join(', '),
    defs: `<linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".08" stop-color="#fff"/><stop offset=".92" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="mk"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>`,
    css, body: `<g mask="url(#mk)">${body}</g>`,
  });
}

// ─────────────────────────────── footer ───────────────────────────────
export function footer(t) {
  const W = 1200, H = 260;
  const wave = (amp, y0, len) => {
    let d = `M0 ${y0}`;
    for (let x = 0; x <= 2 * W; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    return d + ` V${H} H0 Z`;
  };
  return svg(W, H, {
    title: 'Thanks for visiting', desc: `Thanks for stopping by. ${D.person.tagline} ${D.person.email}`,
    defs: `<linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset=".5" stop-color="${t.cyan}"/><stop offset="1" stop-color="${t.green}"/></linearGradient>`,
    css: `.w1{animation:wave 12s linear infinite}.w2{animation:wave 8s linear infinite reverse}.w3{animation:wave 16s linear infinite}@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-${W}px)}}`,
    body: `
    <g class="in"><text x="${W / 2}" y="70" text-anchor="middle" font-family="${SANS}" font-size="38" font-weight="800" letter-spacing="-1" fill="${t.text}">Thanks for stopping by.</text></g>
    <g class="in" ${delay(0.15)}><text x="${W / 2}" y="108" text-anchor="middle" font-family="${SANS}" font-size="19" fill="${t.muted}">Let’s build something that scales, survives, and ships.</text></g>
    <g class="in" ${delay(0.3)}><text x="${W / 2}" y="142" text-anchor="middle" font-family="${MONO}" font-size="16" fill="${t.accent}">${esc(D.person.email)}</text></g>
    <path class="w3" d="${wave(18, 196, 300)}" fill="url(#wg)" opacity=".18"/>
    <path class="w1" d="${wave(14, 208, 400)}" fill="url(#wg)" opacity=".3"/>
    <path class="w2" d="${wave(10, 222, 240)}" fill="url(#wg)" opacity=".55"/>`,
  });
}

// ─────────────────────────────── buttons ───────────────────────────────
// Theme-neutral (solid fill, white label) so one file works in both themes.
export const BUTTONS = [
  { file: 'portfolio', label: 'Portfolio', fill: '#6d28d9', icon: 'M3 4h18v12H3zM1 19h22' },
  { file: 'resume', label: 'Resume', fill: '#0f766e', icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8' },
  { file: 'linkedin', label: 'LinkedIn', fill: '#0a66c2', icon: 'M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2 9h4v12H2zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 3V21H9z' },
  { file: 'email', label: 'Email', fill: '#b42318', icon: 'M2 5h20v14H2zM3.5 6.5 12 13l8.5-6.5' },
  { file: 'leetcode', label: 'LeetCode', fill: '#b45309', icon: 'M14 3 6 11a3 3 0 0 0 0 4.2l4 4a3 3 0 0 0 4.2 0l2-2M9 13h11' },
  { file: 'instagram', label: 'Instagram', fill: '#c13584', icon: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5h.01' },
  { file: 'live', label: 'Live demo', fill: '#047857', icon: 'M5 3l14 9-14 9z' },
  { file: 'source', label: 'Source code', fill: '#24292f', icon: 'M8 6l-6 6 6 6M16 6l6 6-6 6' },
  { file: 'walkthrough', label: 'Walkthrough', fill: '#6d28d9', icon: 'M2 4h20v16H2zM10 9l5 3-5 3z' },
  { file: 'playground', label: 'Playground', fill: '#0e7490', icon: 'M4 4h16v16H4zM4 9h16M9 9v11' },
  { file: 'coach-ui', label: 'Coach UI', fill: '#b45309', icon: 'M4 4h16v12H4zM8 20h8M12 16v4' },
];
export function button({ label, fill, icon }) {
  const w = Math.round(62 + label.length * 9.4), h = 42;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="cl"><rect width="${w}" height="${h}" rx="11"/></clipPath></defs>
<style>.shine{animation:sh 4s ease-in-out infinite}@keyframes sh{0%,60%{transform:translateX(-${w}px) skewX(-20deg)}100%{transform:translateX(${w}px) skewX(-20deg)}}@media (prefers-reduced-motion:reduce){.shine{display:none}}</style>
<rect width="${w}" height="${h}" rx="11" fill="${fill}"/>
<g clip-path="url(#cl)"><rect class="shine" x="0" y="0" width="${w * 0.5}" height="${h}" fill="url(#sh)"/></g>
<g transform="translate(15 9)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icon}"/></g>
<text x="48" y="27" fill="#fff" font-family="${SANS}" font-size="15.5" font-weight="700">${esc(label)}</text>
</svg>
`;
}
