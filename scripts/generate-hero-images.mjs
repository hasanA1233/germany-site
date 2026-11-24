// Erzeugt die Hero-Illustrationen der Rechnerseiten (SVG → WebP) im Stil „Cloudy Sky“.
// Ausführen: npm run images:hero   → public/images/rechner/<name>.webp (1200×675) und <name>-600.webp
// Regeln: keine Texte im Bild, keine Logos/Hoheitszeichen, keine realen Personen oder Marken.
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const OUT = 'public/images/rechner';
const C = { skyTop: '#BFE3FF', skyBottom: '#F5FAFF', primary: '#2B7BD6', primaryDark: '#1E63B5', sun: '#FFC857', ink: '#1F2D3D', white: '#FFFFFF' };

/** Gemeinsamer Hintergrund: Himmelsverlauf, Sonne, weiche Wolken */
function sky(extra = '') {
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyTop}"/><stop offset="1" stop-color="${C.skyBottom}"/></linearGradient>
    <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD978"/><stop offset=".55" stop-color="${C.sun}" stop-opacity=".6"/><stop offset="1" stop-color="${C.sun}" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="${C.primary}" flood-opacity=".18"/></filter>
    ${extra}
  </defs>
  <rect width="1200" height="675" fill="url(#sky)"/>
  <circle cx="1040" cy="120" r="170" fill="url(#sun)"/>
  ${cloud(170, 150, 1.2, 0.95)}${cloud(980, 520, 1.6, 0.9)}${cloud(1110, 300, 0.8, 0.75)}${cloud(90, 560, 1.1, 0.8)}`;
}
function cloud(x, y, s, o) {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${C.white}" opacity="${o}"><ellipse cx="0" cy="22" rx="95" ry="34"/><circle cx="-40" cy="8" r="38"/><circle cx="18" cy="-6" r="54"/><circle cx="66" cy="16" r="32"/></g>`;
}
function coin(x, y, r = 34) {
  return `<g transform="translate(${x},${y})"><ellipse cx="0" cy="10" rx="${r}" ry="${r * 0.42}" fill="#E0A82E"/><ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.42}" fill="${C.sun}"/><ellipse cx="0" cy="0" rx="${r * 0.62}" ry="${r * 0.25}" fill="none" stroke="#E0A82E" stroke-width="4"/></g>`;
}

const scenes = {
  /** MwSt: Kassenbon mit Prozentzeichen, Münzen, Waagschale netto/brutto */
  'mwst-brutto-netto-rechner': () => `
  ${sky()}
  <g filter="url(#soft)">
    <!-- Kassenbon mit gezacktem Rand -->
    <path d="M430 110h340v430l-28-18-28 18-28-18-28 18-28-18-28 18-28-18-28 18-28-18-28 18-28-18-28 18z" fill="${C.white}"/>
    <rect x="470" y="160" width="170" height="16" rx="8" fill="${C.primary}" opacity=".25"/>
    <rect x="470" y="200" width="260" height="12" rx="6" fill="${C.ink}" opacity=".12"/>
    <rect x="470" y="230" width="220" height="12" rx="6" fill="${C.ink}" opacity=".12"/>
    <rect x="470" y="260" width="240" height="12" rx="6" fill="${C.ink}" opacity=".12"/>
    <rect x="470" y="300" width="260" height="3" fill="${C.ink}" opacity=".15"/>
    <!-- großes Prozentzeichen -->
    <g transform="translate(600,410)">
      <circle cx="0" cy="0" r="78" fill="${C.primary}"/>
      <path d="M30 -38 L-30 38" stroke="${C.white}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="-24" cy="-22" r="14" fill="none" stroke="${C.white}" stroke-width="10"/>
      <circle cx="24" cy="22" r="14" fill="none" stroke="${C.white}" stroke-width="10"/>
    </g>
  </g>
  <!-- Münzstapel links -->
  <g filter="url(#soft)">${coin(300, 520)}${coin(300, 496)}${coin(300, 472)}${coin(300, 448)}${coin(372, 540, 28)}${coin(372, 518, 28)}</g>
  <!-- Taschenrechner rechts -->
  <g transform="translate(830,300)" filter="url(#soft)">
    <rect width="190" height="260" rx="26" fill="${C.ink}"/>
    <rect x="22" y="24" width="146" height="54" rx="12" fill="${C.skyTop}"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${22 + c * 52}" y="${98 + r * 50}" width="42" height="38" rx="10" fill="${r === 2 && c === 2 ? C.sun : '#3A4D63'}"/>`).join('')).join('')}
  </g>`,
};

await mkdir(OUT, { recursive: true });
for (const [name, draw] of Object.entries(scenes)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">${draw()}</svg>`;
  for (const [w, suffix] of [[1200, ''], [600, '-600']]) {
    const file = `${OUT}/${name}${suffix}.webp`;
    await sharp(Buffer.from(svg)).resize(w).webp({ quality: 80 }).toFile(file);
    const kb = (await stat(file)).size / 1024;
    if (kb > 120) throw new Error(`${file} ist ${kb.toFixed(0)} KB (> 120 KB)`);
    console.log(`${file}  ${kb.toFixed(1)} KB`);
  }
}
