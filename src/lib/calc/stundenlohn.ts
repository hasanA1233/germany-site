/**
 * Stundenlohn ↔ Monatsgehalt.
 * Umrechnung mit dem üblichen Faktor 13/3 ≈ 4,33 Wochen pro Monat (52 Wochen ÷ 12 Monate).
 * Optional: Stundenlohn je tatsächlich gearbeiteter Stunde (bezahlter Urlaub zählt nicht als Arbeitszeit).
 */
import { steuer2026 } from '../../data/steuer-2026.ts';

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export const WOCHEN_PRO_MONAT = 13 / 3;

export interface StundenlohnInput {
  modus: 'monat' | 'stunde';
  /** Monatsgehalt (Modus monat) bzw. Stundenlohn (Modus stunde), brutto in € */
  betrag: number;
  wochenstunden: number;
  /** optional: Urlaubstage pro Jahr und Arbeitstage pro Woche */
  urlaubstage?: number;
  arbeitstageProWoche?: number;
}

export interface StundenlohnOutput {
  stundenlohn: number;
  monatsgehalt: number;
  jahresgehalt: number;
  monatsstunden: number;
  /** Stundenlohn bezogen auf tatsächlich gearbeitete Stunden (nur mit Urlaubstagen) */
  stundenlohnGearbeitet?: number;
  gearbeiteteStundenJahr?: number;
  mindestlohn: number;
  /** Differenz zum Mindestlohn je Stunde (negativ = darunter) */
  diffMindestlohn: number;
}

export function calculateStundenlohn(i: StundenlohnInput): Result<StundenlohnOutput> {
  const e: Errors = {};
  if (!Number.isFinite(i.betrag) || i.betrag <= 0) e.betrag = 'Bitte geben Sie einen Betrag größer als 0 ein.';
  else if (i.betrag > 1e7) e.betrag = 'Der Betrag ist zu groß.';
  if (!Number.isFinite(i.wochenstunden) || i.wochenstunden <= 0 || i.wochenstunden > 80) e.wochenstunden = 'Bitte geben Sie 1 bis 80 Wochenstunden ein.';
  const tage = i.arbeitstageProWoche ?? 5;
  if (!Number.isInteger(tage) || tage < 1 || tage > 7) e.arbeitstage = 'Bitte geben Sie 1 bis 7 Arbeitstage ein.';
  if (i.urlaubstage !== undefined && (!Number.isFinite(i.urlaubstage) || i.urlaubstage < 0 || i.urlaubstage > 100))
    e.urlaubstage = 'Bitte geben Sie 0 bis 100 Urlaubstage ein.';
  if (Object.keys(e).length) return { ok: false, errors: e };

  const monatsstunden = i.wochenstunden * WOCHEN_PRO_MONAT;
  const stundenlohn = i.modus === 'monat' ? i.betrag / monatsstunden : i.betrag;
  const monatsgehalt = i.modus === 'monat' ? i.betrag : i.betrag * monatsstunden;
  const jahresgehalt = monatsgehalt * 12;
  const out: StundenlohnOutput = {
    stundenlohn,
    monatsgehalt,
    jahresgehalt,
    monatsstunden,
    mindestlohn: steuer2026.mindestlohn,
    diffMindestlohn: stundenlohn - steuer2026.mindestlohn,
  };
  if (i.urlaubstage !== undefined && i.urlaubstage > 0) {
    const stundenProTag = i.wochenstunden / tage;
    const gearbeitet = (52 * tage - i.urlaubstage) * stundenProTag;
    if (gearbeitet <= 0) return { ok: false, errors: { urlaubstage: 'So viele Urlaubstage sind bei diesen Arbeitstagen nicht möglich.' } };
    out.gearbeiteteStundenJahr = gearbeitet;
    out.stundenlohnGearbeitet = jahresgehalt / gearbeitet;
  }
  return { ok: true, ...out };
}
