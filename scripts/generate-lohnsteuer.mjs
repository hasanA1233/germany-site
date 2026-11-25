// Erzeugt aus dem offiziellen XML-Pseudocode des BMF (Programmablaufplan Lohnsteuer)
// eine TypeScript-Klasse. So wird die Formel nicht von Hand abgeschrieben.
//
// Quelle der XML-Datei: https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml
//   → „XML-Pseudocode des Programm-Ablauf-Plans 2026“ (Stand laut Datei: 2025-10-23)
//
// Ausführen: npm run lohnsteuer:generate
// Neues Jahr: XML herunterladen, unter scripts/data/ ablegen, YEAR anpassen, Skript ausführen, Tests prüfen.
import { readFile, writeFile } from 'node:fs/promises';

const YEAR = 2026;
const SRC = `scripts/data/Lohnsteuer${YEAR}.xml`;
const OUT = `src/lib/lohnsteuer/pap${YEAR}.generated.ts`;

const raw = (await readFile(SRC, 'utf8')).replace(/^﻿/, '');
const xml = raw.replace(/<!--[\s\S]*?-->/g, '');
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`));
  return m ? decode(m[1]) : undefined;
};

// --- Variablen und Konstanten ---------------------------------------------------
const fields = []; // { name, type, init }
for (const m of xml.matchAll(/<(INPUT|OUTPUT|INTERNAL)\b([^>]*)\/>/g)) {
  const name = attr(m[2], 'name');
  const type = attr(m[2], 'type');
  if (!name || !type) throw new Error(`Variable ohne Name/Typ: ${m[0]}`);
  // Hinweis: im BMF-XML steht bei VJAHR „defaul“ statt „default“ – dann gilt der Typ-Standardwert
  const def = attr(m[2], 'default');
  fields.push({ kind: m[1], name, type, def });
}
const constants = [];
for (const m of xml.matchAll(/<CONSTANT\b([^>]*)\/>/g)) {
  constants.push({ name: attr(m[1], 'name'), type: attr(m[1], 'type'), value: attr(m[1], 'value') });
}
const known = new Set([...fields.map((f) => f.name), ...constants.map((c) => c.name)]);

/** Java-Ausdruck → TypeScript: Variablen werden zu this.NAME, Rest bleibt (BigDecimal-API ist nachgebildet) */
function expr(src) {
  return decode(src)
    .trim()
    .replace(/(?<![\w.$])([A-Za-z_]\w*)\b/g, (m, id) => (known.has(id) ? `this.${id}` : m));
}

const tsType = (t) => (t === 'BigDecimal' ? 'BigDecimal' : t === 'BigDecimal[]' ? 'BigDecimal[]' : 'number');
const defaultFor = (f) => {
  if (f.def !== undefined) return expr(f.def);
  return f.type === 'BigDecimal' ? 'BigDecimal.ZERO' : '0';
};

// --- Methoden ------------------------------------------------------------------------
const methodsXml = xml.slice(xml.indexOf('<METHODS>'), xml.indexOf('</METHODS>'));
const tokens = [...methodsXml.matchAll(/<(\/?)([A-Z_0-9]+)\b([^>]*?)(\/?)>/g)].map((m) => ({
  close: m[1] === '/',
  tag: m[2],
  attrs: m[3],
  selfClose: m[4] === '/',
}));

let pos = 0;
function parseBlock(endTag) {
  const out = [];
  while (pos < tokens.length) {
    const t = tokens[pos++];
    if (t.close) {
      if (t.tag !== endTag) throw new Error(`Erwartet </${endTag}>, gefunden </${t.tag}>`);
      return out;
    }
    switch (t.tag) {
      case 'EVAL':
        out.push({ type: 'eval', exec: attr(t.attrs, 'exec') });
        break;
      case 'EXECUTE':
        out.push({ type: 'exec', method: attr(t.attrs, 'method') });
        break;
      case 'IF': {
        const node = { type: 'if', cond: attr(t.attrs, 'expr'), then: [], else: [] };
        const body = parseBlock('IF');
        for (const b of body) {
          if (b.type === 'then') node.then = b.body;
          else if (b.type === 'else') node.else = b.body;
          else throw new Error('IF darf nur THEN/ELSE enthalten');
        }
        out.push(node);
        break;
      }
      case 'THEN':
      case 'ELSE':
        out.push({ type: t.tag.toLowerCase(), body: t.selfClose ? [] : parseBlock(t.tag) });
        break;
      default:
        throw new Error(`Unbekanntes Element <${t.tag}>`);
    }
  }
  throw new Error(`Ende erreicht ohne </${endTag}>`);
}

const methods = [];
while (pos < tokens.length) {
  const t = tokens[pos++];
  if (t.close) continue;
  if (t.tag === 'MAIN') methods.push({ name: 'MAIN', body: parseBlock('MAIN') });
  else if (t.tag === 'METHOD') methods.push({ name: attr(t.attrs, 'name'), body: parseBlock('METHOD') });
  else if (t.tag !== 'METHODS') throw new Error(`Unerwartet: <${t.tag}>`);
}
const methodNames = new Set(methods.map((m) => m.name));

function emit(nodes, ind) {
  const pad = '  '.repeat(ind);
  return nodes
    .map((n) => {
      if (n.type === 'eval') {
        const [lhs, ...rest] = n.exec.split('=');
        const name = lhs.trim();
        if (!known.has(name)) throw new Error(`Zuweisung an unbekannte Variable: ${n.exec}`);
        return `${pad}this.${name} = ${expr(rest.join('='))};`;
      }
      if (n.type === 'exec') {
        if (!methodNames.has(n.method)) throw new Error(`Unbekannte Methode: ${n.method}`);
        return `${pad}this.${n.method}();`;
      }
      const elsePart = n.else.length ? ` else {\n${emit(n.else, ind + 1)}\n${pad}}` : '';
      return `${pad}if (${expr(n.cond)}) {\n${emit(n.then, ind + 1)}\n${pad}}${elsePart}`;
    })
    .join('\n');
}

const constInit = (c) =>
  c.type.endsWith('[]') ? `[${expr(c.value.replace(/^\{|\}$/g, ''))}]` : expr(c.value);

const code = `// AUTOMATISCH ERZEUGT von scripts/generate-lohnsteuer.mjs – NICHT VON HAND ÄNDERN.
// Quelle: BMF, XML-Pseudocode Programmablaufplan Lohnsteuer ${YEAR} (${SRC}),
// https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml
/* eslint-disable */
import { BigDecimal } from './bigdecimal.ts';

export class Lohnsteuer${YEAR} {
${fields.map((f) => `  /** ${f.kind} */ ${f.name}: ${tsType(f.type)} = ${defaultFor(f)};`).join('\n')}

${constants.map((c) => `  readonly ${c.name}: ${tsType(c.type)} = ${constInit(c)};`).join('\n')}

${methods.map((m) => `  ${m.name}(): void {\n${emit(m.body, 2)}\n  }`).join('\n\n')}
}
`;

await writeFile(OUT, code);
console.log(`${OUT}: ${fields.length} Variablen, ${constants.length} Konstanten, ${methods.length} Methoden`);
