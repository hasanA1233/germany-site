/** Befüllt die Komponente NettoBreakdown.astro (Tabelle Monat/Jahr + CSS-Balken). */
import type { CalcContext } from './calc-runtime';
import { formatEUR, formatPercent } from '../lib/format';

export type Werte = Record<string, { m: number; j: number }>;

/**
 * @param werte    Beträge je Zeilen-Schlüssel (brutto, lohnsteuer, …, netto)
 * @param gruppen  Zuordnung der Abzugs-Schlüssel zu den Balkengruppen „steuern“ und „sozial“
 */
export function renderBreakdown(c: CalcContext, werte: Werte, gruppen: { steuern: string[]; sozial: string[] }) {
  for (const [key, v] of Object.entries(werte)) {
    c.out(`${key}M`, formatEUR(v.m));
    c.out(`${key}J`, formatEUR(v.j));
    const row = c.form.querySelector<HTMLElement>(`[data-row="${key}"]`);
    if (row && key !== 'brutto' && key !== 'netto') row.hidden = Math.abs(v.m) < 0.005;
  }
  const brutto = werte.brutto?.m ?? 0;
  const sum = (keys: string[]) => keys.reduce((a, k) => a + (werte[k]?.m ?? 0), 0);
  const parts = { netto: werte.netto?.m ?? 0, steuern: sum(gruppen.steuern), sozial: sum(gruppen.sozial) };
  for (const [key, val] of Object.entries(parts)) {
    const pct = brutto > 0 ? Math.max(0, (val / brutto) * 100) : 0;
    const bar = c.form.querySelector<HTMLElement>(`[data-bar="${key}"]`);
    if (bar) bar.style.width = `${pct}%`;
    c.out(`pct-${key}`, formatPercent(pct, 1));
  }
  const label = c.form.querySelector<HTMLElement>('[data-bar-label]');
  if (label)
    label.setAttribute(
      'aria-label',
      `Aufteilung des Bruttolohns: Netto ${formatPercent((parts.netto / brutto) * 100, 1)}, Steuern ${formatPercent((parts.steuern / brutto) * 100, 1)}, Sozialversicherung ${formatPercent((parts.sozial / brutto) * 100, 1)}`,
    );
}
