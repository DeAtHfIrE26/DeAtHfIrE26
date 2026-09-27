// Shared palette for every generated SVG. The light accent is darker than the
// dark one so text in it clears WCAG AA on GitHub's white background.
export const themes = {
  dark: {
    bg: '#0d1117', panel: '#161b22', border: '#30363d', grid: '#21262d',
    text: '#e6edf3', muted: '#8b949e', accent: '#a78bfa', accentSoft: '#a78bfa33',
    ok: '#34d399', node: '#30363d',
  },
  light: {
    bg: '#ffffff', panel: '#f6f8fa', border: '#d0d7de', grid: '#eaeef2',
    text: '#1f2328', muted: '#59636e', accent: '#6d28d9', accentSoft: '#6d28d91f',
    ok: '#047857', node: '#d0d7de',
  },
};
