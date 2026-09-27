// Builds the hand-authored SVGs the profile README embeds: the animated hero
// (light + dark) and the contact buttons. Run with `node scripts/build-static-assets.mjs`
// after editing anything below; the outputs in assets/ are committed.
//
// No dependencies, no network. GitHub strips <script> and <style> from README
// markup, but an SVG loaded through <img> keeps its own <style> and animations,
// so everything that moves lives inside these files.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes } from './theme.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, s) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), s.replace(/\n\s*\n/g, '\n'));
};


const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`;
const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;

// Each line is a measured result from one of the featured projects, typed out
// in turn. Keep them under ~42 characters so they fit the left column.
const LINES = [
  'doc pipeline: 230 s → 2.9 s per upload',
  'dashboard API: 828 ms → 419 ms',
  'a 99 kB chart, rebuilt in 2 kB',
  'Merkle proofs matched to OpenZeppelin',
];

function hero(t) {
  const W = 960, H = 300;
  const CH = 14.4; // forced glyph advance for the 24px mono line (via textLength)
  const CYCLE = LINES.length * 4; // seconds; each line owns a 4 s slot
  const typeX = 78, typeY = 214;

  const lines = LINES.map((line, i) => {
    const w = Math.round(line.length * CH);
    const delay = i === 0 ? 0 : i * 4 - CYCLE; // negative delay = start mid-cycle
    return `
    <g class="slot" style="animation-delay:${delay}s">
      <text x="${typeX}" y="${typeY}" class="type" textLength="${w}" lengthAdjust="spacingAndGlyphs">${esc(line)}</text>
      <g class="cover" style="--w:${w}px;animation-delay:${delay}s">
        <rect x="${typeX - 2}" y="${typeY - 24}" width="${w + 40}" height="34" fill="${t.panel}"/>
        <rect class="caret" x="${typeX - 2}" y="${typeY - 21}" width="12" height="26" rx="2" fill="${t.accent}"/>
      </g>
    </g>`;
  }).join('');

  // A small Merkle tree on the right: leaves hash upward into a root, then the
  // inclusion proof for one leaf lights up. A nod to Merkle Verify, and a
  // decent picture of how most of these projects are built: small pieces,
  // verified all the way up.
  const leaves = [[690, 236], [760, 236], [830, 236], [900, 236]];
  const mids = [[725, 166], [865, 166]];
  const rootN = [795, 92];
  const edge = (a, b, cls, d) =>
    `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="edge ${cls}" style="animation-delay:${d}s"/>`;
  const edges = [
    edge(leaves[0], mids[0], '', 0.2), edge(leaves[1], mids[0], '', 0.3),
    edge(leaves[2], mids[1], 'path', 0.4), edge(leaves[3], mids[1], 'sib', 0.5),
    edge(mids[0], rootN, 'sib', 0.8), edge(mids[1], rootN, 'path', 0.9),
  ].join('');
  const node = ([x, y], cls, d, r = 13) =>
    `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" rx="6" class="node ${cls}" style="animation-delay:${d}s"/>`;
  const nodes = [
    node(leaves[0], '', 0), node(leaves[1], '', 0.05), node(leaves[2], 'pathN', 0.1), node(leaves[3], 'sibN', 0.15),
    node(mids[0], 'sibN', 0.6), node(mids[1], 'pathN', 0.65), node(rootN, 'rootN', 1.1, 16),
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">Kashyap Patel — full-stack engineer</title>
  <desc id="d">Full-stack engineer working across .NET, React, Python and cloud. Measured results from recent projects are typed out in turn: ${LINES.join('; ')}.</desc>
  <style>
    .name{font:700 56px ${SANS};fill:${t.text};letter-spacing:-1px}
    .role{font:400 23px ${SANS};fill:${t.muted}}
    .label{font:500 15px ${MONO};fill:${t.muted}}
    .prompt{font:600 24px ${MONO};fill:${t.accent}}
    .type{font:500 24px ${MONO};fill:${t.text}}
    .fade{opacity:0;animation:fade .8s ease-out forwards}
    .slot{opacity:0;animation:slot ${CYCLE}s linear infinite}
    .cover{animation:type ${CYCLE}s infinite}
    .caret{animation:blink 1s steps(1) infinite}
    .edge{stroke:${t.node};stroke-width:2.5;stroke-dasharray:120;stroke-dashoffset:120;animation:draw .7s ease-out forwards}
    .edge.path{animation:draw .7s ease-out forwards,pathOn 6s ease-in-out 1.6s infinite}
    .edge.sib{animation:draw .7s ease-out forwards,sibOn 6s ease-in-out 1.6s infinite}
    .node{fill:${t.panel};stroke:${t.node};stroke-width:2.5;opacity:0;animation:pop .5s ease-out forwards}
    .node.pathN{animation:pop .5s ease-out forwards,pathNode 6s ease-in-out 1.6s infinite}
    .node.sibN{animation:pop .5s ease-out forwards,sibNode 6s ease-in-out 1.6s infinite}
    .node.rootN{fill:${t.accentSoft};stroke:${t.accent};animation:pop .5s ease-out forwards,pulse 6s ease-in-out 1.6s infinite}
    .legend{font:500 13px ${MONO};fill:${t.muted}}
    @keyframes fade{to{opacity:1}}
    @keyframes slot{0%,24.9%{opacity:1}25%,100%{opacity:0}}
    @keyframes type{
      0%{transform:translateX(0);animation-timing-function:steps(28,end)}
      11%{transform:translateX(var(--w))}
      21%{transform:translateX(var(--w));animation-timing-function:ease-in}
      24%,100%{transform:translateX(0)}
    }
    @keyframes blink{0%{opacity:1}50%{opacity:0}}
    @keyframes draw{to{stroke-dashoffset:0}}
    @keyframes pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    @keyframes pathOn{0%,15%,85%,100%{stroke:${t.node}}30%,70%{stroke:${t.accent}}}
    @keyframes sibOn{0%,15%,85%,100%{stroke:${t.node}}30%,70%{stroke:${t.ok}}}
    @keyframes pathNode{0%,15%,85%,100%{stroke:${t.node}}30%,70%{stroke:${t.accent}}}
    @keyframes sibNode{0%,15%,85%,100%{stroke:${t.node}}30%,70%{stroke:${t.ok}}}
    @keyframes pulse{0%,20%,80%,100%{stroke-width:2.5}40%,60%{stroke-width:5}}
    @media (prefers-reduced-motion:reduce){
      *{animation:none!important}
      .fade,.node,.slot:first-of-type{opacity:1}
      .edge{stroke-dashoffset:0}
      .cover{transform:translateX(9999px)}
    }
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
  <g class="fade" style="animation-delay:0s">
    <text x="48" y="62" class="label">~/DeAtHfIrE26 · India</text>
  </g>
  <g class="fade" style="animation-delay:.15s">
    <text x="46" y="128" class="name">Kashyap Patel</text>
  </g>
  <g class="fade" style="animation-delay:.3s">
    <text x="48" y="164" class="role">Full-stack engineer · .NET · React · Python · cloud</text>
  </g>
  <g class="fade" style="animation-delay:.45s">
    <text x="48" y="${typeY}" class="prompt">$</text>
    ${lines}
  </g>
  <g>
    ${edges}
    ${nodes}
  </g>
  <g class="fade" style="animation-delay:1.4s">
    <rect x="686" y="270" width="10" height="10" rx="2" fill="${t.accent}"/>
    <text x="702" y="279" class="legend">proof path</text>
    <rect x="806" y="270" width="10" height="10" rx="2" fill="${t.ok}"/>
    <text x="822" y="279" class="legend">siblings</text>
  </g>
</svg>
`;
}

// Contact buttons. One design for both themes: solid fill, white label, so each
// reads on GitHub's light and dark backgrounds without a <picture> switch.
const BUTTONS = [
  { file: 'portfolio', label: 'Portfolio', fill: '#6d28d9', icon: 'M4 4h16v12H4zM2 18h20v2H2z' },
  { file: 'linkedin', label: 'LinkedIn', fill: '#0a66c2', icon: 'M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2 9h4v12H2zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 3V21H9z' },
  { file: 'email', label: 'Email', fill: '#b42318', icon: 'M2 5h20v14H2zM3.5 6.5 12 13l8.5-6.5' },
  { file: 'leetcode', label: 'LeetCode', fill: '#b45309', icon: 'M14 3 6 11a3 3 0 0 0 0 4.2l4 4a3 3 0 0 0 4.2 0l2-2M9 13h11' },
  { file: 'instagram', label: 'Instagram', fill: '#c13584', icon: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5h.01' },
];

function button({ label, fill, icon }) {
  const w = Math.round(58 + label.length * 9.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 40" width="${w}" height="40" role="img" aria-label="${label}">
  <title>${label}</title>
  <rect width="${w}" height="40" rx="10" fill="${fill}"/>
  <g transform="translate(14 8)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icon}"/></g>
  <text x="46" y="26" fill="#fff" font-family="${SANS}" font-size="15" font-weight="600">${label}</text>
</svg>
`;
}

for (const [name, t] of Object.entries(themes)) out(`assets/hero-${name}.svg`, hero(t));
for (const b of BUTTONS) out(`assets/buttons/${b.file}.svg`, button(b));
console.log('wrote assets/hero-{dark,light}.svg and assets/buttons/*.svg');
