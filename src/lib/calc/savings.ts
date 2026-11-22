/**
 * Zinseszins- und Sparplanberechnungen.
 */

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export interface GrowthRow {
  year: number;
  /** Summe aller Einzahlungen inkl. Anfangskapital bis Jahresende */
  deposits: number;
  /** Kumulierte Zinsen/Erträge bis Jahresende */
  interest: number;
  balance: number;
}

// ---------------------------------------------------------------------------
// Zinseszins
// ---------------------------------------------------------------------------

export interface CompoundInput {
  principal: number;
  ratePct: number;
  years: number;
  monthlyDeposit?: number;
  /** Zinsgutschrift: jährlich (Standard bei Sparkonten) oder monatlich */
  compounding?: 'yearly' | 'monthly';
}

export interface CompoundOutput {
  finalBalance: number;
  totalDeposits: number;
  interest: number;
  growthPct: number;
  rows: GrowthRow[];
}

/**
 * Annahmen:
 * - Monatliche Einzahlungen jeweils am Monatsende.
 * - Jährliche Zinsgutschrift: Einzahlungen werden im Jahr ihrer Einzahlung anteilig
 *   (zeitanteilig, ohne Zinseszins innerhalb des Jahres) verzinst, Zinsen am Jahresende gutgeschrieben.
 * - Monatliche Zinsgutschrift: Monatszins = Jahreszins / 12, Zinsen jeden Monat gutgeschrieben.
 */
export function calculateCompound(input: CompoundInput): Result<CompoundOutput> {
  const errors: Errors = {};
  const { principal, ratePct, years } = input;
  const deposit = input.monthlyDeposit ?? 0;
  const compounding = input.compounding ?? 'yearly';

  if (!Number.isFinite(principal) || principal < 0) errors.principal = 'Das Anfangskapital darf nicht negativ sein.';
  else if (principal > 1e9) errors.principal = 'Bitte geben Sie maximal 1.000.000.000 € ein.';
  if (!Number.isFinite(ratePct) || ratePct < 0) errors.ratePct = 'Der Zinssatz darf nicht negativ sein.';
  else if (ratePct > 50) errors.ratePct = 'Bitte geben Sie höchstens 50 % ein.';
  if (!Number.isFinite(years) || years < 1 || !Number.isInteger(years))
    errors.years = 'Bitte geben Sie eine ganze Zahl von Jahren (mindestens 1) ein.';
  else if (years > 100) errors.years = 'Bitte geben Sie höchstens 100 Jahre ein.';
  if (!Number.isFinite(deposit) || deposit < 0) errors.monthlyDeposit = 'Die monatliche Einzahlung darf nicht negativ sein.';
  if (!errors.principal && !errors.monthlyDeposit && principal === 0 && deposit === 0)
    errors.principal = 'Bitte geben Sie ein Anfangskapital oder eine monatliche Einzahlung ein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const p = ratePct / 100;
  let balance = principal;
  let deposits = principal;
  const rows: GrowthRow[] = [];

  for (let y = 1; y <= years; y++) {
    if (compounding === 'monthly') {
      const r = p / 12;
      for (let m = 0; m < 12; m++) balance = balance * (1 + r) + deposit;
    } else {
      // Einzahlung am Ende von Monat m wird (12 − m) / 12 Jahre verzinst → Summe 66/12 = 5,5 Monatsraten
      balance = balance * (1 + p) + 12 * deposit + deposit * p * (66 / 12);
    }
    deposits += 12 * deposit;
    rows.push({ year: y, deposits, interest: balance - deposits, balance });
  }

  const interest = balance - deposits;
  return {
    ok: true,
    finalBalance: balance,
    totalDeposits: deposits,
    interest,
    growthPct: deposits > 0 ? (interest / deposits) * 100 : 0,
    rows,
  };
}

// ---------------------------------------------------------------------------
// Sparplan
// ---------------------------------------------------------------------------

export interface SavingsPlanInput {
  monthlyRate: number;
  principal: number;
  returnPct: number;
  years: number;
  /** Jährliche Erhöhung der Sparrate in % (Dynamik) */
  dynamicPct?: number;
}

export interface SavingsPlanOutput {
  finalBalance: number;
  totalDeposits: number;
  returns: number;
  lastMonthlyRate: number;
  rows: GrowthRow[];
}

/**
 * Annahmen:
 * - Sparrate jeweils zu Monatsbeginn (typisch für Sparpläne).
 * - Konstante Rendite p. a., umgerechnet in einen äquivalenten Monatszins: (1 + p)^(1/12) − 1.
 * - Keine Kosten, Steuern oder Inflation berücksichtigt.
 */
export function calculateSavingsPlan(input: SavingsPlanInput): Result<SavingsPlanOutput> {
  const errors: Errors = {};
  const { monthlyRate, principal, returnPct, years } = input;
  const dynamicPct = input.dynamicPct ?? 0;

  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) errors.monthlyRate = 'Die Sparrate darf nicht negativ sein.';
  else if (monthlyRate > 1e7) errors.monthlyRate = 'Bitte geben Sie maximal 10.000.000 € ein.';
  if (!Number.isFinite(principal) || principal < 0) errors.principal = 'Das Anfangskapital darf nicht negativ sein.';
  if (!Number.isFinite(returnPct) || returnPct < -50 || returnPct > 50)
    errors.returnPct = 'Bitte geben Sie eine Rendite zwischen −50 % und 50 % ein.';
  if (!Number.isFinite(years) || years < 1 || !Number.isInteger(years))
    errors.years = 'Bitte geben Sie eine ganze Zahl von Jahren (mindestens 1) ein.';
  else if (years > 80) errors.years = 'Bitte geben Sie höchstens 80 Jahre ein.';
  if (!Number.isFinite(dynamicPct) || dynamicPct < 0 || dynamicPct > 50)
    errors.dynamicPct = 'Bitte geben Sie eine Dynamik zwischen 0 % und 50 % ein.';
  if (!errors.monthlyRate && !errors.principal && monthlyRate === 0 && principal === 0)
    errors.monthlyRate = 'Bitte geben Sie eine Sparrate oder ein Anfangskapital ein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const rm = Math.pow(1 + returnPct / 100, 1 / 12) - 1;
  let balance = principal;
  let deposits = principal;
  let rate = monthlyRate;
  const rows: GrowthRow[] = [];

  for (let y = 1; y <= years; y++) {
    if (y > 1) rate = rate * (1 + dynamicPct / 100);
    for (let m = 0; m < 12; m++) {
      balance = (balance + rate) * (1 + rm);
      deposits += rate;
    }
    rows.push({ year: y, deposits, interest: balance - deposits, balance });
  }

  return {
    ok: true,
    finalBalance: balance,
    totalDeposits: deposits,
    returns: balance - deposits,
    lastMonthlyRate: rate,
    rows,
  };
}
