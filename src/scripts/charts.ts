/**
 * Minimalistische SVG-Diagramme ohne externe Bibliothek.
 * Die Diagramme sind dekorativ ergänzend – dieselben Daten stehen immer auch in einer Tabelle.
 */
import { formatEUR } from '../lib/format';

const NS = 'http://www.w3.org/2000/svg';

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

function compactEUR(v: number): string {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Mio. €`;
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Tsd. €`;
  return formatEUR(v, { rounded: true });
}

export interface StackedBar {
  label: string;
  /** Untere Teilsäule (z. B. Einzahlungen) */
  a: number;
  /** Obere Teilsäule (z. B. Zinsen) */
  b: number;
}

/** Gestapeltes Säulendiagramm (Einzahlungen + Erträge je Jahr) */
export function renderStackedBars(container: HTMLElement | null, bars: StackedBar[], summary: string) {
  if (!container) return;
  const W = 640;
  const H = 260;
  const pad = { t: 12, r: 8, b: 28, l: 64 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = niceMax(Math.max(...bars.map((d) => d.a + Math.max(0, d.b)), 0));
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': summary, class: 'w-full h-auto' });

  // Gitterlinien
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = pad.t + innerH - (v / max) * innerH;
    svg.appendChild(svgEl('line', { x1: pad.l, x2: W - pad.r, y1: y, y2: y, stroke: '#e5e7eb', 'stroke-width': 1 }));
    const t = svgEl('text', { x: pad.l - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#4b5563' });
    t.textContent = compactEUR(v);
    svg.appendChild(t);
  }

  const n = bars.length;
  const slot = innerW / Math.max(n, 1);
  const bw = Math.max(1, Math.min(28, slot * 0.7));
  const labelEvery = Math.ceil(n / 12);

  bars.forEach((d, i) => {
    const x = pad.l + i * slot + (slot - bw) / 2;
    const hA = (Math.max(0, d.a) / max) * innerH;
    const hB = (Math.max(0, d.b) / max) * innerH;
    const baseY = pad.t + innerH;
    const g = svgEl('g', {});
    const title = svgEl('title', {});
    title.textContent = `${d.label}: ${formatEUR(d.a + d.b)} (Einzahlungen ${formatEUR(d.a)}, Erträge ${formatEUR(d.b)})`;
    g.appendChild(title);
    g.appendChild(svgEl('rect', { x, y: baseY - hA, width: bw, height: hA, fill: '#10243A', rx: 1.5 }));
    if (hB > 0) g.appendChild(svgEl('rect', { x, y: baseY - hA - hB, width: bw, height: hB, fill: '#16A34A', rx: 1.5 }));
    svg.appendChild(g);
    if (i % labelEvery === 0 || i === n - 1) {
      const t = svgEl('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': 11, fill: '#4b5563' });
      t.textContent = d.label;
      svg.appendChild(t);
    }
  });

  container.replaceChildren(svg);
}

export interface LineSeries {
  points: [number, number][];
  color: string;
  label: string;
}

/** Einfaches Liniendiagramm (z. B. Erlöse vs. Kosten beim Break-Even) */
export function renderLines(
  container: HTMLElement | null,
  series: LineSeries[],
  opts: { summary: string; xLabel: string; marker?: [number, number] },
) {
  if (!container) return;
  const W = 640;
  const H = 260;
  const pad = { t: 12, r: 12, b: 36, l: 64 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const all = series.flatMap((s) => s.points);
  const maxX = Math.max(...all.map((p) => p[0]), 1);
  const maxY = niceMax(Math.max(...all.map((p) => p[1]), 1));
  const sx = (x: number) => pad.l + (x / maxX) * innerW;
  const sy = (y: number) => pad.t + innerH - (y / maxY) * innerH;

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.summary, class: 'w-full h-auto' });
  for (let i = 0; i <= 4; i++) {
    const v = (maxY / 4) * i;
    svg.appendChild(svgEl('line', { x1: pad.l, x2: W - pad.r, y1: sy(v), y2: sy(v), stroke: '#e5e7eb' }));
    const t = svgEl('text', { x: pad.l - 8, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#4b5563' });
    t.textContent = compactEUR(v);
    svg.appendChild(t);
  }
  for (let i = 0; i <= 4; i++) {
    const v = (maxX / 4) * i;
    const t = svgEl('text', { x: sx(v), y: H - 18, 'text-anchor': 'middle', 'font-size': 11, fill: '#4b5563' });
    t.textContent = Math.round(v).toLocaleString('de-DE');
    svg.appendChild(t);
  }
  const xl = svgEl('text', { x: pad.l + innerW / 2, y: H - 2, 'text-anchor': 'middle', 'font-size': 11, fill: '#4b5563' });
  xl.textContent = opts.xLabel;
  svg.appendChild(xl);

  for (const s of series) {
    const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
  }
  if (opts.marker) {
    const [mx, my] = opts.marker;
    svg.appendChild(svgEl('line', { x1: sx(mx), x2: sx(mx), y1: pad.t, y2: pad.t + innerH, stroke: '#4b5563', 'stroke-dasharray': '4 4' }));
    svg.appendChild(svgEl('circle', { cx: sx(mx), cy: sy(my), r: 5, fill: '#fff', stroke: '#10243A', 'stroke-width': 2.5 }));
  }
  container.replaceChildren(svg);
}
