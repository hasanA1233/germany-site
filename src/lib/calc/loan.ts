/**
 * Kredit- und Tilgungsberechnungen (Annuitätendarlehen).
 *
 * Annahmen:
 * - Nominaler Sollzins, monatlicher Zinssatz = Jahreszins / 12
 * - Gleichbleibende Monatsrate (Annuität), nachschüssige Zahlung am Monatsende
 * - Sondertilgungen am Ende jedes vollen Laufzeitjahres
 * - Die letzte Rate wird auf die verbleibende Restschuld reduziert
 */

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export interface YearRow {
  year: number;
  interest: number;
  principal: number;
  extra: number;
  payments: number;
  balance: number;
}

/** Maximale Simulationsdauer: 100 Jahre */
export const MAX_MONTHS = 1200;

const EPS = 0.005; // halber Cent

/** Annuitätenformel: P · r · (1+r)^n / ((1+r)^n − 1); bei r = 0: P / n */
export function annuityPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) throw new RangeError('months must be > 0');
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

interface ScheduleInput {
  principal: number;
  annualRatePct: number;
  monthlyPayment: number;
  yearlyExtra?: number;
  maxMonths?: number;
}

export interface Schedule {
  months: number;
  totalInterest: number;
  totalPaid: number;
  totalExtra: number;
  rows: YearRow[];
  paidOff: boolean;
  finalBalance: number;
}

/** Simuliert den Tilgungsverlauf Monat für Monat und fasst ihn je Jahr zusammen. */
export function simulateSchedule({
  principal,
  annualRatePct,
  monthlyPayment,
  yearlyExtra = 0,
  maxMonths = MAX_MONTHS,
}: ScheduleInput): Schedule {
  const r = annualRatePct / 100 / 12;
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let totalExtra = 0;
  const rows: YearRow[] = [];
  let row: YearRow = { year: 1, interest: 0, principal: 0, extra: 0, payments: 0, balance };

  while (balance > EPS && month < maxMonths) {
    month++;
    const interest = balance * r;
    let payment = monthlyPayment;
    if (payment > balance + interest) payment = balance + interest;
    const principalPart = payment - interest;
    balance -= principalPart;
    totalInterest += interest;
    totalPaid += payment;
    row.interest += interest;
    row.principal += principalPart;
    row.payments += payment;

    if (month % 12 === 0 && yearlyExtra > 0 && balance > EPS) {
      const extra = Math.min(yearlyExtra, balance);
      balance -= extra;
      totalExtra += extra;
      totalPaid += extra;
      row.extra += extra;
    }

    if (balance < EPS) balance = 0;

    if (month % 12 === 0 || balance === 0 || month === maxMonths) {
      row.balance = balance;
      rows.push(row);
      row = { year: row.year + 1, interest: 0, principal: 0, extra: 0, payments: 0, balance };
    }
  }

  return { months: month, totalInterest, totalPaid, totalExtra, rows, paidOff: balance === 0, finalBalance: balance };
}

/** Restschuld nach einer bestimmten Anzahl Jahre aus den Jahreszeilen */
export function balanceAfterYears(rows: YearRow[], years: number): number {
  if (years <= 0) return rows.length ? rows[0].balance + rows[0].principal + rows[0].extra : 0;
  const row = rows.find((r) => r.year === years);
  if (row) return row.balance;
  return 0; // Darlehen bereits vorher getilgt
}

// ---------------------------------------------------------------------------
// Kreditrate-Rechner
// ---------------------------------------------------------------------------

export interface LoanInput {
  amount: number;
  ratePct: number;
  years: number;
  yearlyExtra?: number;
}

export interface LoanOutput {
  monthlyPayment: number;
  plannedPayments: number;
  actualPayments: number;
  totalPaid: number;
  totalInterest: number;
  amount: number;
  totalExtra: number;
  /** Zinskosten ohne Sondertilgung (zum Vergleich) */
  interestWithoutExtra: number;
  rows: YearRow[];
}

export function calculateLoan(input: LoanInput): Result<LoanOutput> {
  const errors: Errors = {};
  const { amount, ratePct, years } = input;
  const yearlyExtra = input.yearlyExtra ?? 0;

  if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Bitte geben Sie einen Kreditbetrag größer als 0 € ein.';
  else if (amount > 100_000_000) errors.amount = 'Bitte geben Sie maximal 100.000.000 € ein.';
  if (!Number.isFinite(ratePct) || ratePct < 0) errors.ratePct = 'Der Zinssatz darf nicht negativ sein.';
  else if (ratePct > 50) errors.ratePct = 'Bitte geben Sie einen Zinssatz von höchstens 50 % ein.';
  if (!Number.isFinite(years) || years <= 0) errors.years = 'Bitte geben Sie eine Laufzeit größer als 0 ein.';
  else if (years > 50) errors.years = 'Bitte geben Sie eine Laufzeit von höchstens 50 Jahren ein.';
  else if (Math.round(years * 12) < 1) errors.years = 'Die Laufzeit muss mindestens einen Monat betragen.';
  if (!Number.isFinite(yearlyExtra) || yearlyExtra < 0) errors.yearlyExtra = 'Die Sondertilgung darf nicht negativ sein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const months = Math.round(years * 12);
  const monthlyPayment = annuityPayment(amount, ratePct, months);
  const base = simulateSchedule({ principal: amount, annualRatePct: ratePct, monthlyPayment, maxMonths: months + 1 });
  const sched =
    yearlyExtra > 0
      ? simulateSchedule({ principal: amount, annualRatePct: ratePct, monthlyPayment, yearlyExtra, maxMonths: months + 1 })
      : base;

  return {
    ok: true,
    monthlyPayment,
    plannedPayments: months,
    actualPayments: sched.months,
    totalPaid: sched.totalPaid,
    totalInterest: sched.totalInterest,
    amount,
    totalExtra: sched.totalExtra,
    interestWithoutExtra: base.totalInterest,
    rows: sched.rows,
  };
}

// ---------------------------------------------------------------------------
// Tilgungsrechner
// ---------------------------------------------------------------------------

export interface RepaymentInput {
  amount: number;
  ratePct: number;
  mode: 'tilgung' | 'rate';
  /** Anfängliche Tilgung in % p. a. (mode = tilgung) */
  initialRepaymentPct?: number;
  /** Monatsrate in € (mode = rate) */
  monthlyPayment?: number;
  yearlyExtra?: number;
  /** Zinsbindung in Jahren (optional) */
  fixedYears?: number;
}

export interface RepaymentOutput {
  monthlyPayment: number;
  initialRepaymentPct: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  totalExtra: number;
  fixedYears: number;
  balanceAfterFixed: number;
  interestDuringFixed: number;
  rows: YearRow[];
}

export function calculateRepayment(input: RepaymentInput): Result<RepaymentOutput> {
  const errors: Errors = {};
  const { amount, ratePct, mode } = input;
  const yearlyExtra = input.yearlyExtra ?? 0;
  const fixedYears = input.fixedYears ?? 0;

  if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Bitte geben Sie einen Darlehensbetrag größer als 0 € ein.';
  else if (amount > 100_000_000) errors.amount = 'Bitte geben Sie maximal 100.000.000 € ein.';
  if (!Number.isFinite(ratePct) || ratePct < 0) errors.ratePct = 'Der Sollzins darf nicht negativ sein.';
  else if (ratePct > 30) errors.ratePct = 'Bitte geben Sie einen Sollzins von höchstens 30 % ein.';
  if (!Number.isFinite(yearlyExtra) || yearlyExtra < 0) errors.yearlyExtra = 'Die Sondertilgung darf nicht negativ sein.';
  if (!Number.isFinite(fixedYears) || fixedYears < 0 || fixedYears > 50 || !Number.isInteger(fixedYears))
    errors.fixedYears = 'Bitte geben Sie eine ganze Zahl von 0 bis 50 Jahren ein.';

  let monthlyPayment = 0;
  if (mode === 'tilgung') {
    const t = input.initialRepaymentPct ?? NaN;
    if (!Number.isFinite(t) || t <= 0) errors.initialRepaymentPct = 'Die anfängliche Tilgung muss größer als 0 % sein.';
    else if (t > 100) errors.initialRepaymentPct = 'Bitte geben Sie höchstens 100 % ein.';
    else monthlyPayment = (amount * (ratePct + t)) / 100 / 12;
  } else {
    const m = input.monthlyPayment ?? NaN;
    if (!Number.isFinite(m) || m <= 0) errors.monthlyPayment = 'Bitte geben Sie eine Monatsrate größer als 0 € ein.';
    else monthlyPayment = m;
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  const monthlyInterest = (amount * ratePct) / 100 / 12;
  if (monthlyPayment <= monthlyInterest + 0.005) {
    return {
      ok: false,
      errors: {
        [mode === 'tilgung' ? 'initialRepaymentPct' : 'monthlyPayment']:
          'Die Monatsrate deckt nicht einmal die Zinsen. Sie muss höher sein als ' +
          new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(monthlyInterest) +
          '.',
      },
    };
  }

  const sched = simulateSchedule({ principal: amount, annualRatePct: ratePct, monthlyPayment, yearlyExtra });
  if (!sched.paidOff) {
    return {
      ok: false,
      errors: {
        [mode === 'tilgung' ? 'initialRepaymentPct' : 'monthlyPayment']:
          'Mit dieser Rate wäre das Darlehen erst nach über 100 Jahren getilgt. Bitte erhöhen Sie Tilgung oder Rate.',
      },
    };
  }

  const fixedRows = sched.rows.filter((r) => r.year <= fixedYears);
  const interestDuringFixed = fixedRows.reduce((s, r) => s + r.interest, 0);
  const balanceAfterFixed = fixedYears > 0 ? balanceAfterYears(sched.rows, fixedYears) : 0;

  return {
    ok: true,
    monthlyPayment,
    initialRepaymentPct: ((monthlyPayment * 12) / amount) * 100 - ratePct,
    months: sched.months,
    totalInterest: sched.totalInterest,
    totalPaid: sched.totalPaid,
    totalExtra: sched.totalExtra,
    fixedYears,
    balanceAfterFixed,
    interestDuringFixed,
    rows: sched.rows,
  };
}
