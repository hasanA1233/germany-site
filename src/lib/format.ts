/**
 * Formatierung und Eingabe-Parsing im deutschen Format (de-DE).
 */

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const eurRounded = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** 1234.5 → "1.234,50 €" (negative Null wird als 0 dargestellt) */
export function formatEUR(value: number, opts: { rounded?: boolean } = {}): string {
  const v = Object.is(value, -0) || Math.abs(value) < 0.005 ? 0 : value;
  return (opts.rounded ? eurRounded : eur).format(v);
}

/** 1234.567 → "1.234,57" */
export function formatNumber(value: number, maxDecimals = 2, minDecimals = 0): string {
  const v = Math.abs(value) < Math.pow(10, -maxDecimals) / 2 ? 0 : value;
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: minDecimals, maximumFractionDigits: maxDecimals }).format(v);
}

/** 12.345 → "12,35 %" (Wert bereits in Prozent) */
export function formatPercent(value: number, maxDecimals = 2): string {
  return `${formatNumber(value, maxDecimals)} %`;
}

/** Ganze Zahl mit Tausenderpunkten */
export function formatInt(value: number): string {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value);
}

/** Monate → "7 Jahre und 3 Monate" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} ${y === 1 ? 'Jahr' : 'Jahre'}`);
  if (m > 0) parts.push(`${m} ${m === 1 ? 'Monat' : 'Monate'}`);
  return parts.length ? parts.join(' und ') : '0 Monate';
}

/**
 * Parst Benutzereingaben im deutschen oder internationalen Format.
 * "1.234,56" → 1234.56 · "1234,56" → 1234.56 · "1234.56" → 1234.56 · "10.000" → 10000
 * Leere Eingabe → NaN (der Aufrufer entscheidet über Standardwerte).
 */
export function parseNumber(raw: string): number {
  let s = raw.trim().replace(/[\s  €%]/g, '').replace(/[−–]/g, '-');
  if (s === '' || s === '-') return NaN;
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    // Das zuletzt vorkommende Zeichen ist das Dezimaltrennzeichen
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (hasComma) {
    if ((s.match(/,/g) ?? []).length > 1) return NaN;
    s = s.replace(',', '.');
  } else if (hasDot) {
    // "10.000" bzw. "1.250.000" = Tausenderpunkte (deutsches Format)
    if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else if ((s.match(/\./g) ?? []).length > 1) return NaN;
  }
  if (!/^-?\d*\.?\d+$/.test(s) && !/^-?\d+\.$/.test(s)) return NaN;
  return Number(s);
}
