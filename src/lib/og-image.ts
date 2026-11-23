/**
 * Erzeugt Vorschaubilder (Open Graph, 1200 × 630) für Rechnerseiten im Stil „Cloudy Sky“.
 * Wird beim Build über src/pages/og/[slug].png.ts aufgerufen – keine externen Dienste.
 */
import sharp from 'sharp';
import { iconPaths } from '../components/ui/icon-paths';
import type { IconName } from '../data/categories';

const FONT = "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', 'DejaVu Sans', sans-serif";

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Bricht Text an Wortgrenzen um (Näherung über Zeichenanzahl) */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, '') + ' …';
    return kept;
  }
  return lines;
}

function cloud(x: number, y: number, s: number, opacity: number): string {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="#ffffff" opacity="${opacity}">
    <ellipse cx="0" cy="20" rx="90" ry="34"/><circle cx="-38" cy="6" r="38"/><circle cx="18" cy="-8" r="52"/><circle cx="62" cy="14" r="32"/>
  </g>`;
}

export interface OgInput {
  title: string;
  category: string;
  formula: string;
  icon: IconName;
}

export function ogSvg({ title, category, formula, icon }: OgInput): string {
  const titleLines = wrap(title, 26, 3);
  // Drei Zeilen: kleinere Schrift, damit Formel und Fußzeile Platz behalten
  const titleSize = titleLines.length > 2 ? 54 : 68;
  const titleY = titleLines.length > 2 ? 250 : 268;
  const lineH = titleSize * 1.12;
  const formulaY = titleY + titleLines.length * lineH + 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe3ff"/><stop offset="0.55" stop-color="#ddf0ff"/><stop offset="1" stop-color="#f5faff"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffd978"/><stop offset="0.6" stop-color="#ffc857" stop-opacity="0.55"/><stop offset="1" stop-color="#ffc857" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  <circle cx="1080" cy="96" r="150" fill="url(#sun)"/>
  ${cloud(930, 470, 1.6, 0.95)}
  ${cloud(1120, 380, 1.1, 0.8)}
  ${cloud(160, 600, 1.4, 0.7)}

  <!-- Marke -->
  <g transform="translate(80,70)">
    <rect width="64" height="64" rx="16" fill="#1e63b5"/>
    <path d="M18 42l10-10 7 7 12-14M40 25h7v7" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="84" y="44" font-family="${FONT}" font-size="34" font-weight="800" fill="#1f2d3d">Quick<tspan fill="#1a5aa6">Rechner</tspan></text>
  </g>

  <!-- Kategorie mit Symbol -->
  <g transform="translate(80,168)">
    <rect width="${Math.max(220, category.length * 15 + 90)}" height="48" rx="24" fill="#ffffff" fill-opacity="0.85" stroke="#2b7bd6" stroke-opacity="0.25"/>
    <g transform="translate(16,10) scale(1.15)">
      <path d="${iconPaths[icon]}" fill="none" stroke="#1a5aa6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="58" y="32" font-family="${FONT}" font-size="22" font-weight="700" fill="#1a5aa6">${esc(category)}</text>
  </g>

  <!-- Titel -->
  ${titleLines
    .map(
      (l, i) =>
        `<text x="80" y="${titleY + i * lineH + titleSize * 0.8}" font-family="${FONT}" font-size="${titleSize}" font-weight="800" fill="#1f2d3d">${esc(l)}</text>`,
    )
    .join('\n  ')}

  <!-- Formel -->
  <g transform="translate(80,${formulaY})">
    <rect width="${Math.min(1040, formula.length * 17 + 64)}" height="64" rx="16" fill="#10243a"/>
    <text x="32" y="42" font-family="'Menlo', 'DejaVu Sans Mono', monospace" font-size="26" fill="#ffffff">${esc(formula)}</text>
  </g>

  <text x="80" y="590" font-family="${FONT}" font-size="24" font-weight="700" fill="#1a5aa6">quickrechner.de · kostenlos &amp; ohne Anmeldung</text>
</svg>`;
}

export async function ogPng(input: OgInput): Promise<Buffer> {
  return sharp(Buffer.from(ogSvg(input))).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
