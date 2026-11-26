// Tests für das gemeinsame Steuer-/Abgabenmodul 2026 und den Werkstudent-Rechner.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BigDecimal } from '../src/lib/lohnsteuer/bigdecimal.ts';
import {
  lohnsteuerMonat,
  einkommensteuer,
  einkommensteuerFuenftel,
  soliJahr,
  uebergangsbereichBE,
  sozialabgabenMonat,
} from '../src/lib/lohnsteuer-2026.ts';
import { calculateWerkstudent } from '../src/lib/calc/werkstudent.ts';

const close = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≈ ${b} (±${tol})`);

// ---------------------------------------------------------------- BigDecimal (Java-Semantik)
test('BigDecimal: Rundung wie java.math.BigDecimal', () => {
  const v = (x: string) => BigDecimal.valueOf(x);
  assert.equal(v('2.5').setScale(0, BigDecimal.ROUND_DOWN).toString(), '2');
  assert.equal(v('-2.5').setScale(0, BigDecimal.ROUND_DOWN).toString(), '-2'); // Richtung 0
  assert.equal(v('2.01').setScale(0, BigDecimal.ROUND_UP).toString(), '3');
  assert.equal(v('-2.01').setScale(0, BigDecimal.ROUND_UP).toString(), '-3'); // weg von 0
  assert.equal(v('10').divide(v('3'), 2, BigDecimal.ROUND_DOWN).toString(), '3.33');
  assert.equal(v('2.9').divide(v('2')).divide(v('100')).toString(), '0.0145'); // exakt
  assert.equal(v('1.50').compareTo(v('1.5')), 0);
  assert.equal(v('0.1').add(v('0.2')).toString(), '0.3'); // kein Gleitkommafehler
  assert.equal(v('123.99').longValue(), 123);
});

// ---------------------------------------------------------------- Tarif § 32a EStG 2026
test('Einkommensteuer: Grundfreibetrag, Splitting, Monotonie', () => {
  assert.equal(einkommensteuer(12_348), 0);
  assert.equal(einkommensteuer(0), 0);
  assert.ok(einkommensteuer(12_400) > 0);
  // Splitting = 2 × Grundtarif auf das halbe zvE
  assert.equal(einkommensteuer(80_000, true), 2 * einkommensteuer(40_000));
  let prev = 0;
  for (let z = 10_000; z <= 300_000; z += 7_919) {
    const st = einkommensteuer(z);
    assert.ok(st >= prev, `monoton bei ${z}`);
    prev = st;
  }
  // Spitzensteuersatz 45 % oberhalb 277.826 €: Zuwachs je 1.000 € ≈ 450 €
  close(einkommensteuer(301_000) - einkommensteuer(300_000), 450, 1);
});

test('Soli: Freigrenze und Milderungszone', () => {
  assert.equal(soliJahr(20_350), 0);
  close(soliJahr(20_450), 11.9); // (20.450 − 20.350) × 11,9 %
  close(soliJahr(60_000), 3_300); // volle 5,5 %
  assert.equal(soliJahr(40_000, true), 0); // Freigrenze verdoppelt
});

test('Fünftelregelung: mildert, nie höher als ohne', () => {
  const r = einkommensteuerFuenftel(45_000, 50_000);
  assert.ok(r.mit < r.ohne);
  const s = einkommensteuerFuenftel(300_000, 50_000); // Spitzensatz: kein Vorteil
  close(s.mit, s.ohne, 5);
});

// ---------------------------------------------------------------- Lohnsteuer PAP 2026
test('Lohnsteuer: Plausibilität 4.000 € Steuerklasse I und III', () => {
  const base = { kinderfreibetraege: 0, kirche: false, bundesland: 'NW', rvPflicht: true, avPflicht: true, kv: 'gkv', pvKinderlos: true } as const;
  const i = lohnsteuerMonat({ ...base, bruttoMonat: 4_000, steuerklasse: 1 });
  const iii = lohnsteuerMonat({ ...base, bruttoMonat: 4_000, steuerklasse: 3 });
  assert.ok(i.lohnsteuer > 400 && i.lohnsteuer < 650, `StKl I: ${i.lohnsteuer}`);
  assert.ok(iii.lohnsteuer < i.lohnsteuer / 2);
  assert.equal(i.soli, 0); // unter der Freigrenze
  const k = lohnsteuerMonat({ ...base, bruttoMonat: 4_000, steuerklasse: 1, kirche: true, bundesland: 'BY' });
  close(k.kirchensteuer, Math.floor(i.lohnsteuer * 8) / 100);
});

// ---------------------------------------------------------------- Übergangsbereich
test('Übergangsbereich: BE nach § 20 Abs. 2a SGB IV', () => {
  close(uebergangsbereichBE(2_000), 2_000);
  close(uebergangsbereichBE(800), (2000 / 1397) * 197, 1e-9);
  assert.equal(uebergangsbereichBE(2_500), 2_500);
  const sv = sozialabgabenMonat({ bruttoMonat: 800, beschaeftigung: 'werkstudent', bundesland: 'NW' });
  assert.deepEqual([sv.rv, sv.kv, sv.pv, sv.av, sv.uebergangsbereich], [26.23, 0, 0, 0, true]);
  const mj = sozialabgabenMonat({ bruttoMonat: 500, beschaeftigung: 'minijob', bundesland: 'NW' });
  assert.equal(mj.rv, 18); // 3,6 % Eigenanteil
});

// ---------------------------------------------------------------- Werkstudent
const ws = (bruttoMonat: number, steuerklasse: 1 | 6, stundenVorlesung = 20) =>
  calculateWerkstudent({ bruttoMonat, stundenVorlesung, stundenFerien: 20, steuerklasse, kirche: false, bundesland: 'NW', alter: 24, kinder: 0 });

test('Werkstudent: nur Rentenversicherung, Lohnsteuer nach Steuerklasse', () => {
  const a = ws(1_600, 1);
  assert.ok(a.ok);
  if (!a.ok) return;
  assert.equal(a.status, 'werkstudent');
  assert.deepEqual([a.monat.kv, a.monat.pv, a.monat.av], [0, 0, 0]);
  close(a.monat.rv, 132.74);
  close(a.monat.lohnsteuer, 55.33); // zvE 16.148 € → 664 € Jahressteuer ÷ 12
  close(a.monat.netto, 1_600 - 132.74 - 55.33);
  const b = ws(1_200, 1);
  assert.ok(b.ok && b.monat.lohnsteuer === 0);
  const c = ws(1_200, 6);
  assert.ok(c.ok && c.monat.lohnsteuer > 100 && c.erstattungSchaetzung > 1_500);
});

test('Werkstudent: Minijob-Grenze, 20-Stunden-Grenze, Validierung', () => {
  const m = ws(603, 1);
  assert.ok(m.ok && m.status === 'minijob' && m.monat.rv === 21.71);
  const u = ws(1_600, 1, 25);
  assert.ok(u.ok && u.status === 'ueber20' && u.monat.kv > 0 && u.monat.av > 0);
  const e = calculateWerkstudent({ bruttoMonat: 0, stundenVorlesung: 0, stundenFerien: 0, steuerklasse: 1, kirche: false, bundesland: 'NW', alter: 10, kinder: 0 });
  assert.ok(!e.ok && e.errors.brutto && e.errors.stundenVorlesung && e.errors.alter);
});

// ---------------------------------------------------------------- TVöD 2026
import { tvoed, entgeltgruppen, jahressonderzahlungProzent, vbl } from '../src/data/tvoed-2026.ts';
import { calculateTarif } from '../src/lib/calc/tarif.ts';

test('TVöD-Tabellen: Mai 2026 = April-2025-Tabelle × 1,028 (kaufmännisch gerundet)', () => {
  for (const [neu, alt] of [[tvoed.vka2026, tvoed.vka2025], [tvoed.bund2026, tvoed.bund2025]] as const) {
    for (const eg of entgeltgruppen) {
      neu[eg].forEach((v, i) => {
        const a = alt[eg][i];
        if (v === null || a === null) return assert.equal(v, a);
        close(v, Math.round(a * 1.028 * 100) / 100, 0.005);
      });
    }
  }
  assert.equal(tvoed.vka2026['9b'][3], 4690.55);
  assert.equal(tvoed.bund2026['9b'][3], 4608.13); // Bund und VKA unterscheiden sich in E 9a–9c
});

test('TVöD-Rechner: VKA E 5 Stufe 3, Steuerklasse I, Vollzeit', () => {
  const r = calculateTarif({ stufenwerte: tvoed.vka2026['5'], stufe: 3, teilzeitProzent: 100, jszProzent: jahressonderzahlungProzent('vka', '5'), zusatzversorgungProzent: vbl.west, steuerklasse: 1, kirche: false, bundesland: 'NW', kinder: 0, kvZusatz: 2.9 });
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.monat.brutto, 3449.05);
  // KV 7,3 % + 1,45 %, PV 1,8 % + 0,6 % (kinderlos), RV 9,3 %, AV 1,3 %, VBL West 1,81 %
  assert.deepEqual([r.monat.kv, r.monat.pv, r.monat.rv, r.monat.av, r.monat.zv], [301.79, 82.78, 320.76, 44.84, 62.43]);
  assert.equal(r.jsz.brutto, 2931.69); // 85 %
  assert.ok(r.jahr.netto > 12 * r.monat.netto);
  assert.equal(jahressonderzahlungProzent('bund', '13'), 75);
});

test('TVöD-Rechner: Teilzeit und ungültige Stufe', () => {
  const base = { jszProzent: 85, zusatzversorgungProzent: 1.81, steuerklasse: 1 as const, kirche: false, bundesland: 'NW' as const, kinder: 0, kvZusatz: 2.9 };
  const t = calculateTarif({ ...base, stufenwerte: tvoed.vka2026['9b'], stufe: 4, teilzeitProzent: 50 });
  assert.ok(t.ok && t.monat.brutto === 2345.28);
  assert.ok(!calculateTarif({ ...base, stufenwerte: tvoed.vka2026['1'], stufe: 1, teilzeitProzent: 100 }).ok);
});

// ---------------------------------------------------------------- TV-L 2026
import { tvl, entgeltgruppenTvl, jahressonderzahlungTvl } from '../src/data/tvl-2026.ts';

test('TV-L-Tabelle: ab 1.4.2026 = Vorgängertabelle × 1,028, mindestens + 100 €', () => {
  for (const eg of entgeltgruppenTvl) {
    tvl.tab2026[eg].forEach((v, i) => {
      const a = tvl.tab2025[eg][i];
      if (v === null || a === null) return assert.equal(v, a);
      close(v, Math.round(Math.max(a * 1.028, a + 100) * 100) / 100, 0.005);
    });
  }
  assert.equal(tvl.tab2026['13'][3], 5873.56);
  assert.deepEqual([jahressonderzahlungTvl('3'), jahressonderzahlungTvl('8'), jahressonderzahlungTvl('9b'), jahressonderzahlungTvl('13'), jahressonderzahlungTvl('15')], [87.43, 88.14, 74.35, 46.47, 32.53]);
});

test('TV-L-Rechner: E 13 Stufe 4 über der BBG KV wird gedeckelt', () => {
  const r = calculateTarif({ stufenwerte: tvl.tab2026['13'], stufe: 4, teilzeitProzent: 100, jszProzent: 46.47, zusatzversorgungProzent: 1.81, steuerklasse: 1, kirche: false, bundesland: 'NW', kinder: 0, kvZusatz: 2.9 });
  assert.ok(r.ok);
  if (!r.ok) return;
  close(r.monat.kv, 5812.5 * 0.0875, 0.01); // KV nur bis zur Beitragsbemessungsgrenze 5.812,50 €
  close(r.monat.rv, 5873.56 * 0.093, 0.01); // RV-BBG 8.450 € nicht erreicht
});
