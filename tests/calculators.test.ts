// Ausführen mit: npm test  (Node ≥ 22.18 / 23.6 mit nativer TypeScript-Unterstützung)
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { annuityPayment, calculateLoan, calculateRepayment } from '../src/lib/calc/loan.ts';
import { calculateCompound, calculateSavingsPlan } from '../src/lib/calc/savings.ts';
import {
  calculateVat,
  calculateVatList,
  calculateProfit,
  calculateMargin,
  calculateRoi,
  calculateBreakEven,
  calculateDiscount,
} from '../src/lib/calc/business.ts';
import { parseNumber, formatEUR, formatPercent, formatDuration } from '../src/lib/format.ts';

const close = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≈ ${b} (±${tol})`);

function ok<T extends { ok: boolean }>(r: T): Extract<T, { ok: true }> {
  assert.equal(r.ok, true, JSON.stringify((r as { errors?: unknown }).errors));
  return r as Extract<T, { ok: true }>;
}
function fail<T extends { ok: boolean }>(r: T): Record<string, string> {
  assert.equal(r.ok, false);
  return (r as unknown as { errors: Record<string, string> }).errors;
}

// ---------------------------------------------------------------- Formatierung
test('parseNumber: deutsche und internationale Eingaben', () => {
  assert.equal(parseNumber('1.234,56'), 1234.56);
  assert.equal(parseNumber('1234,56'), 1234.56);
  assert.equal(parseNumber('1234.56'), 1234.56);
  assert.equal(parseNumber('10.000'), 10000);
  assert.equal(parseNumber('1.250.000'), 1250000);
  assert.equal(parseNumber('3.5'), 3.5);
  assert.equal(parseNumber('0.125'), 0.125);
  assert.equal(parseNumber(' 2 500 € '), 2500);
  assert.equal(parseNumber('19 %'), 19);
  assert.equal(parseNumber('-5,5'), -5.5);
  assert.equal(parseNumber('1,234.56'), 1234.56);
  assert.ok(Number.isNaN(parseNumber('')));
  assert.ok(Number.isNaN(parseNumber('abc')));
  assert.ok(Number.isNaN(parseNumber('1,2,3')));
  assert.ok(Number.isNaN(parseNumber('1.2.3')));
});

test('Formatierung de-DE', () => {
  assert.equal(formatEUR(1234.5).replace(/\s/g, ' '), '1.234,50 €');
  assert.equal(formatEUR(-0.001).replace(/\s/g, ' '), '0,00 €');
  assert.equal(formatPercent(12.345), '12,35 %');
  assert.equal(formatDuration(87), '7 Jahre und 3 Monate');
  assert.equal(formatDuration(12), '1 Jahr');
});

// ---------------------------------------------------------------- Kredit
test('Annuität: 10.000 € · 5 % · 36 Monate ≈ 299,71 €', () => {
  close(annuityPayment(10000, 5, 36), 299.71);
});

test('Kreditrate: Gesamtkosten und Zinsen', () => {
  const r = ok(calculateLoan({ amount: 20000, ratePct: 6, years: 5 }));
  close(r.monthlyPayment, 386.66);
  assert.equal(r.actualPayments, 60);
  close(r.totalPaid, 386.656 * 60, 0.1);
  close(r.totalInterest, r.totalPaid - 20000, 0.001);
  close(r.rows.at(-1)!.balance, 0, 0.001);
});

test('Kreditrate: zinsloser Kredit', () => {
  const r = ok(calculateLoan({ amount: 12000, ratePct: 0, years: 2 }));
  close(r.monthlyPayment, 500, 1e-9);
  close(r.totalInterest, 0, 1e-9);
  assert.equal(r.actualPayments, 24);
});

test('Kreditrate: Sondertilgung verkürzt Laufzeit und senkt Zinsen', () => {
  const base = ok(calculateLoan({ amount: 30000, ratePct: 7, years: 6 }));
  const extra = ok(calculateLoan({ amount: 30000, ratePct: 7, years: 6, yearlyExtra: 2000 }));
  assert.ok(extra.actualPayments < base.actualPayments);
  assert.ok(extra.totalInterest < base.totalInterest);
  close(extra.interestWithoutExtra, base.totalInterest, 1e-6);
  // Summe aus Tilgung + Sondertilgung = Kreditbetrag
  const repaid = extra.rows.reduce((s, r) => s + r.principal + r.extra, 0);
  close(repaid, 30000, 0.01);
});

test('Kreditrate: ungültige Eingaben', () => {
  assert.ok(fail(calculateLoan({ amount: -1, ratePct: 5, years: 5 })).amount);
  assert.ok(fail(calculateLoan({ amount: 1000, ratePct: -1, years: 5 })).ratePct);
  assert.ok(fail(calculateLoan({ amount: 1000, ratePct: 5, years: 0 })).years);
  assert.ok(fail(calculateLoan({ amount: NaN, ratePct: 5, years: 5 })).amount);
});

// ---------------------------------------------------------------- Tilgung
test('Tilgungsrechner: 300.000 € · 3,5 % · 2 % Tilgung', () => {
  const r = ok(calculateRepayment({ amount: 300000, ratePct: 3.5, mode: 'tilgung', initialRepaymentPct: 2, fixedYears: 10 }));
  close(r.monthlyPayment, 1375);
  // erste Monatszinsen 875 €, Tilgungsanteil 500 €
  close(r.rows[0].interest + r.rows[0].principal, 1375 * 12, 0.01);
  assert.ok(r.months > 300 && r.months < 380, `Laufzeit ${r.months}`);
  assert.ok(r.balanceAfterFixed > 220000 && r.balanceAfterFixed < 240000, `Restschuld ${r.balanceAfterFixed}`);
  close(r.initialRepaymentPct, 2, 1e-9);
});

test('Tilgungsrechner: Modus Monatsrate und Validierung', () => {
  const r = ok(calculateRepayment({ amount: 100000, ratePct: 0, mode: 'rate', monthlyPayment: 1000 }));
  assert.equal(r.months, 100);
  close(r.totalInterest, 0, 1e-9);
  assert.ok(fail(calculateRepayment({ amount: 100000, ratePct: 6, mode: 'rate', monthlyPayment: 500 })).monthlyPayment);
  assert.ok(fail(calculateRepayment({ amount: 100000, ratePct: 4, mode: 'tilgung', initialRepaymentPct: 0 })).initialRepaymentPct);
});

// ---------------------------------------------------------------- Zinseszins
test('Zinseszins: 10.000 € · 5 % · 10 Jahre, jährlich', () => {
  const r = ok(calculateCompound({ principal: 10000, ratePct: 5, years: 10 }));
  close(r.finalBalance, 10000 * Math.pow(1.05, 10));
  close(r.interest, 6288.95);
  close(r.growthPct, 62.8895, 0.001);
});

test('Zinseszins: monatliche Gutschrift und Einzahlungen', () => {
  const r = ok(calculateCompound({ principal: 0, ratePct: 6, years: 1, monthlyDeposit: 100, compounding: 'monthly' }));
  // Endwert nachschüssige Rente: 100 · ((1,005^12 − 1) / 0,005)
  close(r.finalBalance, 100 * ((Math.pow(1.005, 12) - 1) / 0.005));
  const y = ok(calculateCompound({ principal: 0, ratePct: 6, years: 1, monthlyDeposit: 100 }));
  close(y.finalBalance, 1200 + 100 * 0.06 * 5.5);
  const zero = ok(calculateCompound({ principal: 5000, ratePct: 0, years: 3, monthlyDeposit: 50 }));
  close(zero.finalBalance, 5000 + 1800);
  assert.ok(fail(calculateCompound({ principal: 0, ratePct: 3, years: 5 })).principal);
  assert.ok(fail(calculateCompound({ principal: 100, ratePct: 3, years: 2.5 })).years);
});

// ---------------------------------------------------------------- Sparplan
test('Sparplan: Rendite 0 % ergibt Summe der Einzahlungen', () => {
  const r = ok(calculateSavingsPlan({ monthlyRate: 100, principal: 1000, returnPct: 0, years: 10 }));
  close(r.finalBalance, 13000, 1e-6);
  close(r.returns, 0, 1e-6);
});

test('Sparplan: 200 € · 6 % · 20 Jahre (vorschüssig, konformer Zins)', () => {
  const r = ok(calculateSavingsPlan({ monthlyRate: 200, principal: 0, returnPct: 6, years: 20 }));
  const rm = Math.pow(1.06, 1 / 12) - 1;
  const n = 240;
  const expected = 200 * ((Math.pow(1 + rm, n) - 1) / rm) * (1 + rm);
  close(r.finalBalance, expected, 0.01);
  close(r.totalDeposits, 48000, 1e-6);
});

test('Sparplan: Dynamik erhöht Sparrate jährlich', () => {
  const r = ok(calculateSavingsPlan({ monthlyRate: 100, principal: 0, returnPct: 0, years: 3, dynamicPct: 10 }));
  close(r.totalDeposits, 1200 + 1320 + 1452, 1e-6);
  close(r.lastMonthlyRate, 121, 1e-9);
});

// ---------------------------------------------------------------- Umsatzsteuer
test('Umsatzsteuer: netto ↔ brutto', () => {
  const a = ok(calculateVat({ amount: 100, mode: 'net-to-gross', ratePct: 19 }));
  assert.deepEqual([a.net, a.vat, a.gross], [100, 19, 119]);
  const b = ok(calculateVat({ amount: 119, mode: 'gross-to-net', ratePct: 19 }));
  assert.deepEqual([b.net, b.vat, b.gross], [100, 19, 119]);
  const c = ok(calculateVat({ amount: 50, mode: 'gross-to-net', ratePct: 7 }));
  assert.deepEqual([c.net, c.vat], [46.73, 3.27]);
  const d = ok(calculateVat({ amount: 0.1, mode: 'net-to-gross', ratePct: 19 }));
  assert.equal(d.vat, 0.02);
  assert.ok(fail(calculateVat({ amount: -5, mode: 'net-to-gross', ratePct: 19 })).amount);
  assert.ok(fail(calculateVat({ amount: 5, mode: 'net-to-gross', ratePct: 120 })).ratePct);
});

test('Umsatzsteuer Listenmodus: Restaurantrechnung 7 % + 19 % (brutto → netto)', () => {
  const r = ok(calculateVatList([{ amount: 30, ratePct: 7 }, { amount: 11.9, ratePct: 19 }], 'gross-to-net'));
  assert.deepEqual([r.net, r.vat, r.gross], [38.04, 3.86, 41.9]);
  assert.deepEqual(r.groups.map((g) => [g.ratePct, g.net, g.vat]), [[19, 10, 1.9], [7, 28.04, 1.96]]);
  // Gleicher Satz: Steuer aus der Summe, nicht je Position
  const s = ok(calculateVatList([{ amount: 0.1, ratePct: 19 }, { amount: 0.1, ratePct: 19 }, { amount: 0.1, ratePct: 19 }], 'net-to-gross'));
  assert.deepEqual([s.net, s.vat, s.gross], [0.3, 0.06, 0.36]);
  assert.equal(s.groups[0].count, 3);
  assert.ok(fail(calculateVatList([], 'net-to-gross'))._form);
  assert.ok(fail(calculateVatList([{ amount: 5, ratePct: 19 }, { amount: -1, ratePct: 7 }], 'net-to-gross')).item2);
});

// ---------------------------------------------------------------- Gewinn / Marge
test('Gewinn und Verlust', () => {
  const g = ok(calculateProfit({ revenue: 50000, costs: 32000 }));
  assert.equal(g.profit, 18000);
  assert.equal(g.status, 'gewinn');
  const v = ok(calculateProfit({ revenue: 1000, costs: 1500 }));
  assert.equal(v.profit, -500);
  assert.equal(v.status, 'verlust');
  assert.equal(ok(calculateProfit({ revenue: 0, costs: 0 })).marginPct, null);
});

test('Gewinnmarge inkl. Umsatz = 0', () => {
  const m = ok(calculateMargin({ revenue: 200, costs: 150 }));
  close(m.marginPct!, 25, 1e-9);
  close(m.costRatioPct!, 75, 1e-9);
  close(m.markupPct!, 33.333, 0.001);
  const z = ok(calculateMargin({ revenue: 0, costs: 100 }));
  assert.equal(z.marginPct, null);
  assert.equal(z.costRatioPct, null);
});

// ---------------------------------------------------------------- ROI
test('ROI', () => {
  const r = ok(calculateRoi({ investment: 10000, mode: 'total', value: 12500, years: 2 }));
  close(r.roiPct, 25, 1e-9);
  assert.equal(r.profit, 2500);
  close(r.annualizedPct!, (Math.sqrt(1.25) - 1) * 100, 1e-9);
  const p = ok(calculateRoi({ investment: 5000, mode: 'profit', value: -1000 }));
  close(p.roiPct, -20, 1e-9);
  assert.equal(p.annualizedPct, null);
  assert.ok(fail(calculateRoi({ investment: 0, mode: 'total', value: 100 })).investment);
  assert.ok(fail(calculateRoi({ investment: 100, mode: 'profit', value: -200 })).value);
});

// ---------------------------------------------------------------- Break-Even
test('Break-Even', () => {
  const r = ok(calculateBreakEven({ fixedCosts: 6000, price: 25, variableCost: 10, plannedUnits: 500 }));
  assert.equal(r.contributionMargin, 15);
  assert.equal(r.breakEvenUnits, 400);
  assert.equal(r.breakEvenRevenue, 10000);
  assert.equal(r.plannedProfit, 1500);
  const frac = ok(calculateBreakEven({ fixedCosts: 1000, price: 7, variableCost: 4 }));
  assert.equal(frac.breakEvenUnits, 334);
  assert.ok(fail(calculateBreakEven({ fixedCosts: 1000, price: 5, variableCost: 5 })).price);
  assert.ok(fail(calculateBreakEven({ fixedCosts: 1000, price: 4, variableCost: 6 })).price);
  assert.equal(ok(calculateBreakEven({ fixedCosts: 0, price: 4, variableCost: 2 })).breakEvenUnits, 0);
});

// ---------------------------------------------------------------- Rabatt
test('Rabatt vorwärts und rückwärts', () => {
  const a = ok(calculateDiscount({ mode: 'percent', original: 79.99, discountPct: 20 }));
  assert.equal(a.discountAmount, 16);
  assert.equal(a.finalPrice, 63.99);
  const b = ok(calculateDiscount({ mode: 'reverse', original: 120, finalPrice: 90 }));
  close(b.discountPct, 25, 1e-9);
  assert.equal(b.discountAmount, 30);
  assert.ok(fail(calculateDiscount({ mode: 'reverse', original: 100, finalPrice: 120 })).finalPrice);
  assert.ok(fail(calculateDiscount({ mode: 'percent', original: 100, discountPct: 120 })).discountPct);
  assert.ok(fail(calculateDiscount({ mode: 'percent', original: 0, discountPct: 10 })).original);
});

// ---------------------------------------------------------------- Prozentrechner
import { calculatePercent } from '../src/lib/calc/percent.ts';

test('Prozentrechner: alle fünf Modi (Testfälle aus der Aufgabenstellung)', () => {
  const v = (r: ReturnType<typeof calculatePercent>) => (r.ok ? r.value : NaN);
  close(v(calculatePercent({ mode: 'prozentwert', p: 15, g: 240 })), 36, 1e-9);
  close(v(calculatePercent({ mode: 'prozentsatz', w: 36, g: 120 })), 30, 1e-9);
  close(v(calculatePercent({ mode: 'grundwert', w: 45, p: 15 })), 300, 1e-9);
  const ch = calculatePercent({ mode: 'veraenderung', a: 80, b: 100 });
  assert.ok(ch.ok && Math.abs(ch.value - 25) < 1e-9 && ch.diff === 20);
  close(v(calculatePercent({ mode: 'veraenderung', a: 100, b: 80 })), -20, 1e-9);
  const up = calculatePercent({ mode: 'aufschlag', g: 250, p: 19, richtung: 'plus' });
  assert.ok(up.ok && Math.abs(up.value - 297.5) < 1e-9 && Math.abs(up.diff! - 47.5) < 1e-9);
  close(v(calculatePercent({ mode: 'aufschlag', g: 250, p: 20, richtung: 'minus' })), 200, 1e-9);
});

test('Prozentrechner: Validierung (Division durch 0, fehlende Werte)', () => {
  assert.ok(fail(calculatePercent({ mode: 'prozentsatz', w: 5, g: 0 })).g);
  assert.ok(fail(calculatePercent({ mode: 'grundwert', w: 5, p: 0 })).p);
  assert.ok(fail(calculatePercent({ mode: 'veraenderung', a: 0, b: 5 })).a);
  assert.ok(fail(calculatePercent({ mode: 'prozentwert', p: NaN, g: 5 })).p);
  assert.ok(fail(calculatePercent({ mode: 'aufschlag', g: 5, p: -3 })).p);
});
