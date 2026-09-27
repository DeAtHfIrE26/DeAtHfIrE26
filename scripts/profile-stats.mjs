// Generates the GitHub activity card for the profile README, in light and dark
// variants, from GitHub's GraphQL API. Runs in .github/workflows/profile-assets.yml
// and publishes to the `output` branch, so nothing depends on a third-party
// stats server (the public github-readme-stats instance is rate-limited).
//
//   GH_TOKEN=... GH_USER=DeAtHfIrE26 node scripts/profile-stats.mjs --out dist
//   node scripts/profile-stats.mjs --out dist --mock      # offline preview
//
// Only public, non-fork repositories count toward languages, so no private
// repository name or language is ever read into the card.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { themes } from './theme.mjs';

const args = process.argv.slice(2);
const outDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'dist';
const mock = args.includes('--mock');
const login = process.env.GH_USER || 'DeAtHfIrE26';

const QUERY = `query($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

async function fetchUser() {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN is not set');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-stats' },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) throw new Error(`GraphQL: ${res.status} ${JSON.stringify(body.errors ?? body)}`);
  return body.data.user;
}

function mockUser() {
  // Deterministic synthetic data, for previewing the layout only.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const start = Date.UTC(2025, 8, 28);
  const weeks = Array.from({ length: 53 }, (_, w) => ({
    contributionDays: Array.from({ length: 7 }, (_, d) => ({
      date: new Date(start + (w * 7 + d) * 864e5).toISOString().slice(0, 10),
      contributionCount: rnd() < 0.3 ? 0 : Math.floor(rnd() * 12 * (0.4 + w / 53)),
    })),
  }));
  const lang = (name, color, size) => ({ size, node: { name, color } });
  return {
    repositories: {
      totalCount: 24,
      nodes: [
        { stargazerCount: 3, languages: { edges: [lang('TypeScript', '#3178c6', 900), lang('CSS', '#663399', 90)] } },
        { stargazerCount: 2, languages: { edges: [lang('Python', '#3572A5', 700), lang('C++', '#f34b7d', 120)] } },
        { stargazerCount: 1, languages: { edges: [lang('JavaScript', '#f1e05a', 300), lang('C#', '#178600', 150), lang('HTML', '#e34c26', 60)] } },
      ],
    },
    contributionsCollection: { contributionCalendar: { totalContributions: 1234, weeks } },
  };
}

export function summarize(user, today = new Date().toISOString().slice(0, 10)) {
  const days = user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .filter((d) => d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0, run = 0;
  for (const d of days) { run = d.contributionCount > 0 ? run + 1 : 0; longest = Math.max(longest, run); }

  // A streak survives until the end of today: if nothing is in yet today,
  // count back from yesterday.
  let i = days.length - 1;
  if (i >= 0 && days[i].date === today && days[i].contributionCount === 0) i--;
  let current = 0;
  for (; i >= 0 && days[i].contributionCount > 0; i--) current++;

  const weekly = user.contributionsCollection.contributionCalendar.weeks
    .map((w) => w.contributionDays.filter((d) => d.date <= today).reduce((s, d) => s + d.contributionCount, 0));

  const bytes = new Map();
  for (const r of user.repositories.nodes)
    for (const e of r.languages.edges) {
      const prev = bytes.get(e.node.name) ?? { size: 0, color: e.node.color ?? '#8b949e' };
      bytes.set(e.node.name, { ...prev, size: prev.size + e.size });
    }
  const total = [...bytes.values()].reduce((s, l) => s + l.size, 0) || 1;
  const ranked = [...bytes.entries()].sort((a, b) => b[1].size - a[1].size);
  const top = ranked.slice(0, 5).map(([name, l]) => ({ name, color: l.color, pct: (l.size / total) * 100 }));
  const rest = 100 - top.reduce((s, l) => s + l.pct, 0);
  if (ranked.length > 5 && rest > 0.05) top.push({ name: 'Other', color: '#8b949e', pct: rest });

  return {
    contributions: user.contributionsCollection.contributionCalendar.totalContributions,
    current, longest,
    repos: user.repositories.totalCount,
    stars: user.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0),
    weekly, languages: top, today,
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (n) => n.toLocaleString('en-US');
const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`;

export function card(s, t) {
  const W = 720, H = 492, P = 32;
  const tiles = [
    [fmt(s.contributions), 'contributions, last 12 months'],
    [`${s.current} ${s.current === 1 ? 'day' : 'days'}`, 'current streak'],
    [`${s.longest} ${s.longest === 1 ? 'day' : 'days'}`, 'longest streak, last 12 months'],
    [`${s.repos} · ${fmt(s.stars)}★`, 'public repos · stars'],
  ];
  const tw = (W - P * 2 - 16) / 2;
  const tileSvg = tiles.map(([v, l], i) => {
    const x = P + (i % 2) * (tw + 16), y = 64 + Math.floor(i / 2) * 100;
    return `<g class="in" style="animation-delay:${0.1 + i * 0.08}s">
      <rect x="${x}" y="${y}" width="${tw}" height="84" rx="12" fill="${t.bg}" stroke="${t.border}"/>
      <text x="${x + 20}" y="${y + 44}" class="val">${esc(v)}</text>
      <text x="${x + 20}" y="${y + 70}" class="lbl">${esc(l)}</text>
    </g>`;
  }).join('');

  // Weekly contributions as an area sparkline.
  const sy = 294, sh = 58, sw = W - P * 2;
  const max = Math.max(1, ...s.weekly);
  const pts = s.weekly.map((v, i) => [P + (i / Math.max(1, s.weekly.length - 1)) * sw, sy + sh - (v / max) * sh]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  const area = `${P},${sy + sh} ${line} ${P + sw},${sy + sh}`;

  // Language bar + legend (3 columns).
  const by = 394;
  let x = P;
  const segs = s.languages.map((l) => {
    const w = (l.pct / 100) * sw;
    const r = `<rect x="${x.toFixed(1)}" y="${by}" width="${Math.max(w, 0).toFixed(1)}" height="12" fill="${l.color}"/>`;
    x += w;
    return r;
  }).join('');
  const legend = s.languages.map((l, i) => {
    const lx = P + (i % 3) * (sw / 3), ly = by + 42 + Math.floor(i / 3) * 26;
    return `<circle cx="${lx + 6}" cy="${ly - 5}" r="6" fill="${l.color}"/><text x="${lx + 20}" y="${ly}" class="leg">${esc(l.name)} <tspan class="pct">${l.pct.toFixed(1)}%</tspan></text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">GitHub activity for ${esc(login)}</title>
  <desc id="d">${fmt(s.contributions)} contributions in the last 12 months; current streak ${s.current} days; longest streak ${s.longest} days; ${s.repos} public repositories with ${s.stars} stars. Top languages across public repositories: ${s.languages.map((l) => `${l.name} ${l.pct.toFixed(1)}%`).join(', ')}.</desc>
  <style>
    .h{font:600 13px ${MONO};fill:${t.muted};letter-spacing:.5px}
    .val{font:700 30px ${SANS};fill:${t.text}}
    .lbl{font:400 15px ${SANS};fill:${t.muted}}
    .leg{font:500 15px ${SANS};fill:${t.text}}
    .pct{fill:${t.muted}}
    .in{opacity:0;animation:in .6s ease-out forwards}
    .spark{stroke:${t.accent};stroke-width:2.5;fill:none;stroke-linejoin:round;stroke-dasharray:2000;stroke-dashoffset:2000;animation:draw 1.8s ease-out .4s forwards}
    .bar{transform-origin:${P}px 0;transform:scaleX(0);animation:grow 1s cubic-bezier(.2,.8,.2,1) .6s forwards}
    @keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    @keyframes draw{to{stroke-dashoffset:0}}
    @keyframes grow{to{transform:scaleX(1)}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}.in{opacity:1}.spark{stroke-dashoffset:0}.bar{transform:none}}
  </style>
  <defs><clipPath id="bar"><rect x="${P}" y="${by}" width="${sw}" height="12" rx="6"/></clipPath></defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
  <text x="${P}" y="40" class="h">GITHUB ACTIVITY</text>
  <text x="${W - P}" y="40" class="h" text-anchor="end">updated ${esc(s.today)}</text>
  ${tileSvg}
  <text x="${P}" y="${sy - 10}" class="h">WEEKLY CONTRIBUTIONS</text>
  <polygon points="${area}" fill="${t.accentSoft}" class="in" style="animation-delay:.9s"/>
  <polyline points="${line}" class="spark"/>
  <text x="${P}" y="${by - 14}" class="h">LANGUAGES · PUBLIC REPOS</text>
  <g clip-path="url(#bar)"><g class="bar">${segs}</g></g>
  <g class="in" style="animation-delay:.9s">${legend}</g>
</svg>
`;
}

const user = mock ? mockUser() : await fetchUser();
const summary = summarize(user, mock ? '2026-09-27' : undefined);
mkdirSync(outDir, { recursive: true });
for (const [name, t] of Object.entries(themes)) writeFileSync(join(outDir, `stats-${name}.svg`), card(summary, t));
console.log(JSON.stringify({ ...summary, weekly: `${summary.weekly.length} weeks` }));
