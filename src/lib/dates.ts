/** Datumshilfen – maßgeblich ist immer deutsche Zeit (Europe/Berlin). */

export const TZ = 'Europe/Berlin';

/** Heutiges Datum in Berlin als ISO-String (YYYY-MM-DD) */
export function todayBerlin(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** true, wenn das ISO-Datum (YYYY-MM-DD) nicht nach dem heutigen Berliner Datum liegt */
export function isNotInFuture(isoDate: string, now: Date = new Date()): boolean {
  return isoDate.slice(0, 10) <= todayBerlin(now);
}

/** Datum für die Anzeige, z. B. „26. November 2026“ – ISO-Datumsangaben werden als Kalendertag behandelt */
export function formatDateDe(d: Date | string, style: 'long' | 'short' = 'long'): string {
  const iso = typeof d === 'string' ? d.slice(0, 10) : d.toISOString().slice(0, 10);
  // Mittag UTC: derselbe Kalendertag in jeder Zeitzone Europas
  const date = new Date(`${iso}T12:00:00Z`);
  return date.toLocaleDateString('de-DE', style === 'long' ? { timeZone: TZ, day: '2-digit', month: 'long', year: 'numeric' } : { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Einzahl/Mehrzahl: plural(1, 'Jahr', 'Jahre') → „1 Jahr“ */
export function plural(n: number, one: string, many: string): string {
  return `${n.toLocaleString('de-DE')} ${n === 1 ? one : many}`;
}
