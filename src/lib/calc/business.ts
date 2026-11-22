/**
 * Business- und Prozentberechnungen: Umsatzsteuer, Gewinn, Marge, ROI, Break-Even, Rabatt.
 */

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

const MAX_AMOUNT = 1e12;

/** Feldvalidierung; Meldungen erscheinen direkt unter dem jeweiligen Eingabefeld. */
function checkAmount(errors: Errors, key: string, value: number, allowZero = true) {
  if (!Number.isFinite(value)) errors[key] = 'Bitte geben Sie eine gültige Zahl ein.';
  else if (value < 0) errors[key] = 'Bitte geben Sie keinen negativen Wert ein.';
  else if (!allowZero && value === 0) errors[key] = 'Bitte geben Sie einen Wert größer als 0 ein.';
  else if (value > MAX_AMOUNT) errors[key] = 'Der Wert ist zu groß.';
}

/** Kaufmännisch auf Cent runden (robust gegen Gleitkomma-Artefakte) */
export function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Umsatzsteuer
// ---------------------------------------------------------------------------

export interface VatInput {
  amount: number;
  mode: 'net-to-gross' | 'gross-to-net';
  ratePct: number;
}
export interface VatOutput {
  net: number;
  vat: number;
  gross: number;
  ratePct: number;
}

/**
 * Netto → Brutto: USt = Netto × Satz, gerundet auf Cent; Brutto = Netto + USt.
 * Brutto → Netto: Netto = Brutto / (1 + Satz), gerundet auf Cent; USt = Brutto − Netto.
 */
export function calculateVat({ amount, mode, ratePct }: VatInput): Result<VatOutput> {
  const errors: Errors = {};
  checkAmount(errors, 'amount', amount);
  if (!Number.isFinite(ratePct) || ratePct < 0 || ratePct > 100)
    errors.ratePct = 'Bitte geben Sie einen Steuersatz zwischen 0 % und 100 % ein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const r = ratePct / 100;
  if (mode === 'net-to-gross') {
    const net = roundCents(amount);
    const vat = roundCents(net * r);
    return { ok: true, net, vat, gross: roundCents(net + vat), ratePct };
  }
  const gross = roundCents(amount);
  const net = roundCents(gross / (1 + r));
  return { ok: true, net, vat: roundCents(gross - net), gross, ratePct };
}

// ---------------------------------------------------------------------------
// Gewinn
// ---------------------------------------------------------------------------

export interface ProfitInput {
  revenue: number;
  costs: number;
}
export interface ProfitOutput {
  revenue: number;
  costs: number;
  profit: number;
  status: 'gewinn' | 'verlust' | 'ausgeglichen';
  /** Gewinnmarge in %, null wenn Umsatz = 0 */
  marginPct: number | null;
}

export function calculateProfit({ revenue, costs }: ProfitInput): Result<ProfitOutput> {
  const errors: Errors = {};
  checkAmount(errors, 'revenue', revenue);
  checkAmount(errors, 'costs', costs);
  if (Object.keys(errors).length) return { ok: false, errors };
  const profit = roundCents(revenue - costs);
  return {
    ok: true,
    revenue,
    costs,
    profit,
    status: profit > 0 ? 'gewinn' : profit < 0 ? 'verlust' : 'ausgeglichen',
    marginPct: revenue > 0 ? (profit / revenue) * 100 : null,
  };
}

// ---------------------------------------------------------------------------
// Gewinnmarge
// ---------------------------------------------------------------------------

export interface MarginOutput {
  profit: number;
  /** null wenn Umsatz = 0 (Marge nicht definiert) */
  marginPct: number | null;
  costRatioPct: number | null;
  /** Aufschlag auf die Kosten in %, null wenn Kosten = 0 */
  markupPct: number | null;
}

export function calculateMargin({ revenue, costs }: ProfitInput): Result<MarginOutput> {
  const errors: Errors = {};
  checkAmount(errors, 'revenue', revenue);
  checkAmount(errors, 'costs', costs);
  if (Object.keys(errors).length) return { ok: false, errors };
  const profit = revenue - costs;
  return {
    ok: true,
    profit,
    marginPct: revenue > 0 ? (profit / revenue) * 100 : null,
    costRatioPct: revenue > 0 ? (costs / revenue) * 100 : null,
    markupPct: costs > 0 ? (profit / costs) * 100 : null,
  };
}

// ---------------------------------------------------------------------------
// ROI
// ---------------------------------------------------------------------------

export interface RoiInput {
  investment: number;
  /** "total": Gesamtrückfluss (inkl. eingesetztem Kapital); "profit": Nettogewinn */
  mode: 'total' | 'profit';
  value: number;
  years?: number;
}
export interface RoiOutput {
  investment: number;
  profit: number;
  totalReturn: number;
  roiPct: number;
  /** Durchschnittliche jährliche Rendite (geometrisch), nur wenn Jahre angegeben */
  annualizedPct: number | null;
}

export function calculateRoi({ investment, mode, value, years }: RoiInput): Result<RoiOutput> {
  const errors: Errors = {};
  checkAmount(errors, 'investment', investment, false);
  if (!Number.isFinite(value)) errors.value = 'Bitte geben Sie einen Wert ein.';
  else if (mode === 'total' && value < 0) errors.value = 'Der Gesamtrückfluss darf nicht negativ sein.';
  else if (Math.abs(value) > MAX_AMOUNT) errors.value = 'Der Wert ist zu groß.';
  if (years !== undefined && (!Number.isFinite(years) || years <= 0 || years > 100))
    errors.years = 'Bitte geben Sie eine Dauer zwischen 0 und 100 Jahren ein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const profit = mode === 'total' ? value - investment : value;
  const totalReturn = investment + profit;
  if (totalReturn < 0) {
    return { ok: false, errors: { value: 'Ein Verlust kann höchstens so groß sein wie die Investitionssumme.' } };
  }
  const roi = profit / investment;
  const annualizedPct = years ? (Math.pow(1 + roi, 1 / years) - 1) * 100 : null;
  return { ok: true, investment, profit, totalReturn, roiPct: roi * 100, annualizedPct };
}

// ---------------------------------------------------------------------------
// Break-Even
// ---------------------------------------------------------------------------

export interface BreakEvenInput {
  fixedCosts: number;
  price: number;
  variableCost: number;
  /** Optional: geplante Absatzmenge */
  plannedUnits?: number;
}
export interface BreakEvenOutput {
  contributionMargin: number;
  contributionMarginRatioPct: number;
  breakEvenUnitsExact: number;
  /** Aufgerundet auf ganze Stück */
  breakEvenUnits: number;
  breakEvenRevenue: number;
  plannedProfit: number | null;
}

export function calculateBreakEven(input: BreakEvenInput): Result<BreakEvenOutput> {
  const errors: Errors = {};
  const { fixedCosts, price, variableCost, plannedUnits } = input;
  checkAmount(errors, 'fixedCosts', fixedCosts);
  checkAmount(errors, 'price', price, false);
  checkAmount(errors, 'variableCost', variableCost);
  if (plannedUnits !== undefined && (!Number.isFinite(plannedUnits) || plannedUnits < 0))
    errors.plannedUnits = 'Die Absatzmenge darf nicht negativ sein.';
  if (!errors.price && !errors.variableCost && price <= variableCost)
    errors.price = 'Der Verkaufspreis muss höher sein als die variablen Kosten pro Stück – sonst wird die Gewinnschwelle nie erreicht.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const cm = price - variableCost;
  const exact = fixedCosts / cm;
  // Gleitkomma-Toleranz, damit z. B. 1000,0000000001 nicht auf 1001 aufgerundet wird
  const units = Math.max(0, Math.ceil(exact - 1e-9));
  return {
    ok: true,
    contributionMargin: cm,
    contributionMarginRatioPct: (cm / price) * 100,
    breakEvenUnitsExact: exact,
    breakEvenUnits: units,
    breakEvenRevenue: exact * price,
    plannedProfit: plannedUnits !== undefined ? plannedUnits * cm - fixedCosts : null,
  };
}

// ---------------------------------------------------------------------------
// Rabatt
// ---------------------------------------------------------------------------

export interface DiscountByPercentInput {
  mode: 'percent';
  original: number;
  discountPct: number;
}
export interface DiscountByPriceInput {
  mode: 'reverse';
  original: number;
  finalPrice: number;
}
export interface DiscountOutput {
  original: number;
  discountAmount: number;
  finalPrice: number;
  discountPct: number;
}

export function calculateDiscount(input: DiscountByPercentInput | DiscountByPriceInput): Result<DiscountOutput> {
  const errors: Errors = {};
  checkAmount(errors, 'original', input.original, false);

  if (input.mode === 'percent') {
    const pct = input.discountPct;
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) errors.discountPct = 'Bitte geben Sie einen Rabatt zwischen 0 % und 100 % ein.';
    if (Object.keys(errors).length) return { ok: false, errors };
    const discountAmount = roundCents((input.original * pct) / 100);
    return {
      ok: true,
      original: input.original,
      discountAmount,
      finalPrice: roundCents(input.original - discountAmount),
      discountPct: pct,
    };
  }

  checkAmount(errors, 'finalPrice', input.finalPrice);
  if (!errors.original && !errors.finalPrice && input.finalPrice > input.original)
    errors.finalPrice = 'Der reduzierte Preis ist höher als der Originalpreis – das wäre eine Preiserhöhung, kein Rabatt.';
  if (Object.keys(errors).length) return { ok: false, errors };
  const discountAmount = roundCents(input.original - input.finalPrice);
  return {
    ok: true,
    original: input.original,
    discountAmount,
    finalPrice: input.finalPrice,
    discountPct: (discountAmount / input.original) * 100,
  };
}
