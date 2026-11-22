// Erzeugt Favicons, Logo und Open-Graph-Bild aus SVG-Vorlagen.
// Ausführen: node scripts/generate-images.mjs  (Ergebnis liegt in public/ und wird mit committet)
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const icon = await readFile(new URL('../public/favicon.svg', import.meta.url));

await sharp(icon, { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(icon, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(icon, { density: 1200 }).resize(512, 512).png().toFile('public/logo-512.png');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="85%" cy="10%" r="70%">
      <stop offset="0" stop-color="#16A34A" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#10243A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#10243A"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(90,110)">
    <rect width="96" height="96" rx="24" fill="#ffffff"/>
    <path d="M27 63l15-15 10.5 10.5 18-21M60 37.5h10.5V48" fill="none" stroke="#16A34A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="124" y="66" font-family="Helvetica, Arial, sans-serif" font-size="48" font-weight="800" fill="#ffffff">Quick<tspan fill="#86efac">Rechner</tspan></text>
  </g>
  <text x="90" y="340" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">Finanzen einfach berechnen</text>
  <text x="90" y="410" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#e3eaf3">Kostenlose Online-Rechner für Kredite, Sparen, Investitionen,</text>
  <text x="90" y="455" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#e3eaf3">Steuern und Unternehmen.</text>
  <text x="90" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#86efac">quickrechner.de</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og-default.png');
console.log('Bilder erzeugt.');
