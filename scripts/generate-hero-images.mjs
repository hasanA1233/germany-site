// Erzeugt die Hero-Illustrationen der Rechnerseiten (SVG → WebP) im Stil „Cloudy Sky“.
// Ausführen: npm run images:hero   → public/images/rechner/<name>.webp (1200×675) sowie <name>-800.webp und <name>-480.webp
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

  /** Werkstudent: abstrakte studierende Person (ohne Gesicht) am Laptop, Wanduhr, Bücherstapel, Münzen */
  'werkstudent-brutto-netto-rechner': () => `
  ${sky()}
  <!-- Tisch -->
  <rect x="250" y="500" width="700" height="22" rx="11" fill="${C.ink}" opacity=".85"/>
  <rect x="300" y="522" width="16" height="110" rx="8" fill="${C.ink}" opacity=".6"/>
  <rect x="884" y="522" width="16" height="110" rx="8" fill="${C.ink}" opacity=".6"/>
  <g filter="url(#soft)">
    <!-- Person: Kopf, Oberkörper, Arm (stilisiert) -->
    <circle cx="430" cy="300" r="52" fill="${C.primaryDark}"/>
    <path d="M350 500 C350 400 380 370 430 370 C480 370 510 400 515 440 L520 500 Z" fill="${C.primary}"/>
    <path d="M500 430 L585 470" stroke="${C.primary}" stroke-width="30" stroke-linecap="round"/>
    <!-- Laptop -->
    <path d="M560 360 h210 a10 10 0 0 1 10 10 v120 h-230 v-120 a10 10 0 0 1 10 -10z" fill="${C.ink}"/>
    <rect x="566" y="368" width="198" height="114" rx="6" fill="${C.skyTop}"/>
    <rect x="586" y="392" width="90" height="12" rx="6" fill="${C.primary}" opacity=".6"/>
    <rect x="586" y="416" width="150" height="10" rx="5" fill="${C.ink}" opacity=".18"/>
    <rect x="586" y="436" width="120" height="10" rx="5" fill="${C.ink}" opacity=".18"/>
    <path d="M530 490 h270 l-12 14 h-246z" fill="${C.ink}" opacity=".9"/>
  </g>
  <!-- Wanduhr (ohne Ziffern) -->
  <g transform="translate(870,190)" filter="url(#soft)">
    <circle r="78" fill="${C.white}"/>
    <circle r="78" fill="none" stroke="${C.primary}" stroke-width="10"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="-66" width="6" height="${i % 3 === 0 ? 16 : 9}" rx="3" fill="${C.ink}" opacity=".55" transform="rotate(${i * 30})"/>`).join('')}
    <path d="M0 0 L0 -46" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>
    <path d="M0 0 L36 22" stroke="${C.primaryDark}" stroke-width="7" stroke-linecap="round"/>
    <circle r="7" fill="${C.sun}"/>
  </g>
  <!-- Bücherstapel und Münzen auf dem Tisch -->
  <g filter="url(#soft)">
    <rect x="820" y="452" width="110" height="20" rx="5" fill="${C.primary}"/>
    <rect x="828" y="432" width="96" height="20" rx="5" fill="${C.sun}"/>
    <rect x="816" y="412" width="104" height="20" rx="5" fill="${C.primaryDark}"/>
    <rect x="822" y="472" width="114" height="28" rx="5" fill="${C.ink}" opacity=".75"/>
  </g>
  <g filter="url(#soft)">${coin(300, 480, 26)}${coin(300, 462, 26)}${coin(300, 444, 26)}</g>`,

  /** In-Artikel-Grafik: Gehaltsabrechnung mit Balken (Netto, Steuern, Rentenversicherung), keine Texte */
  'werkstudent-brutto-netto-rechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <rect x="300" y="110" width="600" height="470" rx="28" fill="${C.white}"/>
    <rect x="345" y="155" width="210" height="18" rx="9" fill="${C.primary}" opacity=".35"/>
    <rect x="345" y="190" width="320" height="12" rx="6" fill="${C.ink}" opacity=".12"/>
    <!-- Balken: Netto (lang), Steuern, Rente -->
    <rect x="345" y="250" width="510" height="54" rx="14" fill="${C.primary}"/>
    <rect x="345" y="330" width="80" height="54" rx="14" fill="${C.sun}"/>
    <rect x="345" y="410" width="120" height="54" rx="14" fill="${C.primaryDark}" opacity=".55"/>
    <rect x="345" y="500" width="510" height="3" fill="${C.ink}" opacity=".15"/>
    <rect x="345" y="525" width="150" height="16" rx="8" fill="${C.ink}" opacity=".25"/>
    <rect x="715" y="520" width="140" height="26" rx="13" fill="${C.sun}" opacity=".7"/>
  </g>
  <g filter="url(#soft)">${coin(980, 520, 30)}${coin(980, 498, 30)}${coin(980, 476, 30)}${coin(1040, 540, 24)}</g>`,

  /** Prozentrechner: großes Prozentzeichen und Tortendiagramm */
  prozentrechner: () => `
  ${sky()}
  <g filter="url(#soft)">
    <circle cx="420" cy="350" r="190" fill="${C.white}"/>
    <!-- Tortendiagramm: Anteil 30 % blau, 15 % sonnengelb -->
    <path d="M420 350 L420 160 A190 190 0 0 1 600.7 291.3 Z" fill="${C.primary}"/>
    <path d="M420 350 L600.7 291.3 A190 190 0 0 1 573.7 461.7 Z" fill="${C.sun}"/>
    <circle cx="420" cy="350" r="190" fill="none" stroke="${C.primary}" stroke-opacity=".25" stroke-width="6"/>
  </g>
  <g transform="translate(800,360)" filter="url(#soft)">
    <circle r="150" fill="${C.primaryDark}"/>
    <path d="M62 -78 L-62 78" stroke="${C.white}" stroke-width="22" stroke-linecap="round"/>
    <circle cx="-52" cy="-48" r="30" fill="none" stroke="${C.white}" stroke-width="18"/>
    <circle cx="52" cy="48" r="30" fill="none" stroke="${C.white}" stroke-width="18"/>
  </g>`,

  /** In-Artikel-Grafik: Torte mit hervorgehobenem Stück, Balken Grundwert/Prozentwert */
  'prozentrechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <circle cx="380" cy="350" r="170" fill="${C.white}"/>
    <path d="M380 350 L380 180 A170 170 0 0 1 541.7 297.5 Z" fill="${C.sun}" transform="translate(16,-14)"/>
    <circle cx="380" cy="350" r="170" fill="none" stroke="${C.primary}" stroke-opacity=".25" stroke-width="6"/>
  </g>
  <g filter="url(#soft)">
    <rect x="640" y="230" width="420" height="300" rx="28" fill="${C.white}"/>
    <rect x="690" y="290" width="320" height="48" rx="14" fill="${C.primary}"/>
    <rect x="690" y="370" width="64" height="48" rx="14" fill="${C.sun}"/>
    <rect x="690" y="455" width="200" height="14" rx="7" fill="${C.ink}" opacity=".15"/>
  </g>`,

  /** In-Artikel-Grafik MwSt: Kassenbon, Balken Netto (lang) und MwSt (kurz), Prozent-Plakette */
  'mwst-rechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <path d="M330 120h300v400l-25-16-25 16-25-16-25 16-25-16-25 16-25-16-25 16-25-16-25 16-25-16-25 16z" fill="${C.white}"/>
    <rect x="365" y="165" width="150" height="14" rx="7" fill="${C.primary}" opacity=".3"/>
    <rect x="365" y="200" width="230" height="10" rx="5" fill="${C.ink}" opacity=".12"/>
    <rect x="365" y="225" width="190" height="10" rx="5" fill="${C.ink}" opacity=".12"/>
    <rect x="365" y="290" width="230" height="44" rx="12" fill="${C.primary}"/>
    <rect x="365" y="350" width="44" height="44" rx="12" fill="${C.sun}"/>
    <rect x="365" y="420" width="230" height="3" fill="${C.ink}" opacity=".15"/>
  </g>
  <g transform="translate(810,320)" filter="url(#soft)">
    <circle r="120" fill="${C.primaryDark}"/>
    <path d="M48 -60 L-48 60" stroke="${C.white}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="-40" cy="-36" r="23" fill="none" stroke="${C.white}" stroke-width="14"/>
    <circle cx="40" cy="36" r="23" fill="none" stroke="${C.white}" stroke-width="14"/>
  </g>
  <g filter="url(#soft)">${coin(1010, 520, 28)}${coin(1010, 498, 28)}${coin(1060, 540, 22)}</g>`,

  /** TVöD/TV-L: neutrales Verwaltungsgebäude (ohne Hoheitszeichen) und Gehaltstabelle */
  'tvoed-rechner': () => `
  ${sky()}
  <g filter="url(#soft)">
    <!-- Gebäude: Giebel, Säulen, Stufen -->
    <path d="M220 270 L430 160 L640 270 Z" fill="${C.primaryDark}"/>
    <rect x="235" y="270" width="390" height="24" rx="6" fill="${C.ink}" opacity=".85"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${262 + i * 72}" y="300" width="34" height="200" rx="8" fill="${C.white}"/>`).join('')}
    <rect x="235" y="500" width="390" height="22" rx="6" fill="${C.ink}" opacity=".85"/>
    <rect x="210" y="522" width="440" height="22" rx="6" fill="${C.ink}" opacity=".6"/>
    <circle cx="430" cy="232" r="16" fill="${C.sun}"/>
  </g>
  <g filter="url(#soft)">
    <!-- Gehaltstabelle -->
    <rect x="720" y="210" width="360" height="330" rx="24" fill="${C.white}"/>
    <rect x="720" y="210" width="360" height="56" rx="24" fill="${C.primary}"/>
    <rect x="720" y="246" width="360" height="20" fill="${C.primary}"/>
    ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${748 + c * 82}" y="${290 + r * 48}" width="62" height="16" rx="8" fill="${r === 2 && c === 2 ? C.sun : C.ink}" opacity="${r === 2 && c === 2 ? 1 : 0.14}"/>`).join('')).join('')}
  </g>`,

  /** In-Artikel-Grafik TVöD: Tabelle mit markierter Zelle und Netto-/Abzugsbalken */
  'tvoed-rechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <rect x="200" y="150" width="440" height="380" rx="24" fill="${C.white}"/>
    ${[0, 1, 2, 3, 4, 5].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${228 + c * 82}" y="${180 + r * 56}" width="64" height="18" rx="9" fill="${r === 3 && c === 2 ? C.sun : r === 0 ? C.primary : C.ink}" opacity="${r === 3 && c === 2 ? 1 : r === 0 ? 0.6 : 0.13}"/>`).join('')).join('')}
  </g>
  <g filter="url(#soft)">
    <rect x="700" y="230" width="340" height="230" rx="24" fill="${C.white}"/>
    <rect x="735" y="275" width="190" height="40" rx="12" fill="${C.primary}"/>
    <rect x="735" y="335" width="70" height="40" rx="12" fill="${C.sun}"/>
    <rect x="815" y="335" width="80" height="40" rx="12" fill="${C.primaryDark}" opacity=".55"/>
    <rect x="735" y="405" width="180" height="12" rx="6" fill="${C.ink}" opacity=".15"/>
  </g>`,

  /** Dreisatz: drei verbundene Kästchen mit Pfeilen */
  'dreisatz-rechner': () => `
  ${sky()}
  <g filter="url(#soft)">
    ${[0, 1, 2].map((i) => `<rect x="${170 + i * 320}" y="250" width="220" height="170" rx="28" fill="${i === 2 ? C.primaryDark : C.white}"/>`).join('')}
    <rect x="215" y="310" width="130" height="18" rx="9" fill="${C.primary}" opacity=".5"/>
    <rect x="215" y="345" width="90" height="18" rx="9" fill="${C.ink}" opacity=".18"/>
    <rect x="535" y="310" width="130" height="18" rx="9" fill="${C.sun}"/>
    <rect x="535" y="345" width="90" height="18" rx="9" fill="${C.ink}" opacity=".18"/>
    <circle cx="920" cy="335" r="38" fill="${C.sun}"/>
  </g>
  ${[0, 1].map((i) => `<g transform="translate(${400 + i * 320},335)"><path d="M0 0 H70" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" opacity=".7"/><path d="M52 -16 L72 0 L52 16" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></g>`).join('')}
  <path d="M280 450 C 420 560, 780 560, 920 450" fill="none" stroke="${C.primary}" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/>`,

  /** In-Artikel-Grafik Dreisatz: drei Zeilen (Schritte) mit Pfeilen */
  'dreisatz-rechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <rect x="300" y="130" width="600" height="420" rx="28" fill="${C.white}"/>
    ${[0, 1, 2].map((r) => `<circle cx="365" cy="${215 + r * 120}" r="26" fill="${r === 2 ? C.sun : C.primary}"/><rect x="415" y="${203 + r * 120}" width="${[300, 220, 360][r]}" height="24" rx="12" fill="${C.ink}" opacity=".15"/>`).join('')}
    ${[0, 1].map((r) => `<path d="M365 ${250 + r * 120} V ${300 + r * 120}" stroke="${C.primary}" stroke-width="6" stroke-linecap="round" opacity=".5"/>`).join('')}
  </g>`,

  /** TV-L: Landesbehörde (Kuppelbau, ohne Hoheitszeichen) und Gehaltstabelle */
  'tv-l-rechner': () => `
  ${sky()}
  <g filter="url(#soft)">
    <path d="M300 250 A130 90 0 0 1 560 250 Z" fill="${C.primaryDark}"/>
    <rect x="250" y="250" width="360" height="22" rx="6" fill="${C.ink}" opacity=".85"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${278 + i * 86}" y="278" width="40" height="210" rx="8" fill="${C.white}"/>`).join('')}
    <rect x="250" y="488" width="360" height="22" rx="6" fill="${C.ink}" opacity=".85"/>
    <rect x="225" y="510" width="410" height="22" rx="6" fill="${C.ink}" opacity=".6"/>
    <rect x="422" y="150" width="16" height="40" rx="6" fill="${C.sun}"/>
  </g>
  <g filter="url(#soft)">
    <rect x="720" y="210" width="360" height="330" rx="24" fill="${C.white}"/>
    <rect x="720" y="210" width="360" height="56" rx="24" fill="${C.primary}"/>
    <rect x="720" y="246" width="360" height="20" fill="${C.primary}"/>
    ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${748 + c * 82}" y="${290 + r * 48}" width="62" height="16" rx="8" fill="${r === 1 && c === 3 ? C.sun : C.ink}" opacity="${r === 1 && c === 3 ? 1 : 0.14}"/>`).join('')).join('')}
  </g>`,

  /** In-Artikel-Grafik TV-L: Tabelle mit markierter Zelle und Deckel-Linie (Beitragsbemessungsgrenze) */
  'tv-l-rechner-beispiel': () => `
  ${sky()}
  <g filter="url(#soft)">
    <rect x="200" y="150" width="440" height="380" rx="24" fill="${C.white}"/>
    ${[0, 1, 2, 3, 4, 5].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${228 + c * 82}" y="${180 + r * 56}" width="64" height="18" rx="9" fill="${r === 2 && c === 3 ? C.sun : r === 0 ? C.primary : C.ink}" opacity="${r === 2 && c === 3 ? 1 : r === 0 ? 0.6 : 0.13}"/>`).join('')).join('')}
  </g>
  <g filter="url(#soft)">
    <rect x="700" y="200" width="340" height="290" rx="24" fill="${C.white}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${740 + i * 70}" y="${430 - [80, 140, 190, 190][i]}" width="44" height="${[80, 140, 190, 190][i]}" rx="10" fill="${i > 1 ? C.primaryDark : C.primary}" opacity="${i > 1 ? 0.6 : 1}"/>`).join('')}
    <path d="M725 240 H1015" stroke="${C.sun}" stroke-width="6" stroke-dasharray="14 10" stroke-linecap="round"/>
  </g>`,
};

await mkdir(OUT, { recursive: true });
for (const [name, draw] of Object.entries(scenes)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">${draw()}</svg>`;
  // Responsive Varianten: 1200w (Basis), 800w, 480w
  for (const [w, suffix] of [[1200, ''], [800, '-800'], [480, '-480']]) {
    const file = `${OUT}/${name}${suffix}.webp`;
    await sharp(Buffer.from(svg)).resize(w).webp({ quality: 80 }).toFile(file);
    const kb = (await stat(file)).size / 1024;
    if (kb > 120) throw new Error(`${file} ist ${kb.toFixed(0)} KB (> 120 KB)`);
    console.log(`${file}  ${kb.toFixed(1)} KB`);
  }
}
