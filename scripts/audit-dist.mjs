// Prüft den Build-Output (dist/) auf typische SEO- und Linkfehler.
// Ausführen nach `npm run build`:  node scripts/audit-dist.mjs
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://quickrechner.de';

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function exists(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const candidates = clean.endsWith('/') ? [join(DIST, clean, 'index.html')] : [join(DIST, clean), join(DIST, clean, 'index.html')];
  for (const c of candidates) {
    try {
      await stat(c);
      return true;
    } catch {}
  }
  return false;
}

const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const problems = [];
const titles = new Map();
const descs = new Map();
let linkCount = 0;

for (const file of files) {
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const html = await readFile(file, 'utf8');
  const is404 = rel.startsWith('/404');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) problems.push(`${rel}: kein <title>`);
  if (!desc) problems.push(`${rel}: keine Meta-Description`);
  else if (desc.length < 70 || desc.length > 170) problems.push(`${rel}: Description-Länge ${desc.length}`);
  if (!is404 && canonical !== SITE + rel) problems.push(`${rel}: Canonical ${canonical} ≠ ${SITE + rel}`);
  if (h1s !== 1) problems.push(`${rel}: ${h1s} × <h1>`);
  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!html.includes(`property="${prop}"`)) problems.push(`${rel}: ${prop} fehlt`);
  }
  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  if (ogImage?.startsWith(SITE) && !(await exists(ogImage.slice(SITE.length)))) problems.push(`${rel}: og:image fehlt im Build (${ogImage})`);
  if (!html.includes('name="twitter:card"')) problems.push(`${rel}: twitter:card fehlt`);
  if (!html.includes('<html lang="de"')) problems.push(`${rel}: lang fehlt`);

  if (!is404) {
    titles.set(title, [...(titles.get(title) ?? []), rel]);
    descs.set(desc, [...(descs.get(desc) ?? []), rel]);
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'FAQPage' && !html.includes('<details')) problems.push(`${rel}: FAQ-Schema ohne sichtbare FAQ`);
    } catch (e) {
      problems.push(`${rel}: ungültiges JSON-LD (${e.message})`);
    }
  }

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith('#') || url.startsWith('mailto:') || /^https?:\/\//.test(url) || url.startsWith('data:')) continue;
    linkCount++;
    if (!url.startsWith('/')) {
      problems.push(`${rel}: relativer Link ${url}`);
      continue;
    }
    const path = url.split('#')[0];
    if (!path.includes('.') && !path.endsWith('/')) problems.push(`${rel}: Link ohne abschließenden Slash ${url}`);
    if (!(await exists(url))) problems.push(`${rel}: defekter Link ${url}`);
  }
  // Anker auf derselben Seite prüfen
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!html.includes(`id="${m[1]}"`)) problems.push(`${rel}: Anker #${m[1]} nicht gefunden`);
  }
}

for (const [t, pages] of titles) if (pages.length > 1) problems.push(`Doppelter Titel "${t}": ${pages.join(', ')}`);
for (const [d, pages] of descs) if (pages.length > 1) problems.push(`Doppelte Description: ${pages.join(', ')}`);

const sitemap = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8').catch(() => '');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemapUrls.some((u) => u.includes('404'))) problems.push('404-Seite in der Sitemap');
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => '');
if (!robots.includes('Sitemap:')) problems.push('robots.txt ohne Sitemap');

console.log(`${files.length} HTML-Seiten, ${linkCount} interne Links, ${sitemapUrls.length} URLs in der Sitemap geprüft.`);
if (problems.length) {
  console.log(`\n${problems.length} Problem(e):`);
  for (const p of problems) console.log(' - ' + p);
  process.exit(1);
}
console.log('Keine Probleme gefunden.');
