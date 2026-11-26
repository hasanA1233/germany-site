/**
 * Register der Tarifverträge für den gemeinsamen Tarifrechner (TarifCalc.astro).
 * Jeder Tarif: Bereiche (z. B. Bund/VKA), Tabellen je Stand, Jahressonderzahlung, Zusatzversorgung.
 * Werte und Quellen stehen in den jeweiligen Datendateien (tvoed-2026.ts, tvl-2026.ts).
 */
import { tvoed, entgeltgruppen, jahressonderzahlungProzent, vbl } from './tvoed-2026';
import { tvl, entgeltgruppenTvl, jahressonderzahlungTvl } from './tvl-2026';

/** Monatswerte je Entgeltgruppe (Index 0 = Stufe 1; null = Stufe existiert nicht) */
export type TarifTabelle = Record<string, (number | null)[]>;

export interface TarifBereich {
  id: string;
  label: string;
  /** Tabellen je Stand: 'aktuell' = nach der letzten Erhöhung 2026, 'vorher' = Monate davor */
  tabellen: { aktuell: TarifTabelle; vorher: TarifTabelle };
  /** Jahressonderzahlung in % je Entgeltgruppe */
  jsz: (eg: string) => number;
}

export interface Tarif {
  id: 'tvoed' | 'tvl';
  name: string;
  bereiche: TarifBereich[];
  entgeltgruppen: string[];
  standLabels: { aktuell: string; vorher: string };
  zusatzversorgung: { west: number; ost: number };
}

export const tarife: Record<Tarif['id'], Tarif> = {
  tvoed: {
    id: 'tvoed',
    name: 'TVöD',
    bereiche: [
      { id: 'vka', label: 'Kommunen (VKA)', tabellen: { aktuell: tvoed.vka2026, vorher: tvoed.vka2025 }, jsz: (eg) => jahressonderzahlungProzent('vka', eg) },
      { id: 'bund', label: 'Bund', tabellen: { aktuell: tvoed.bund2026, vorher: tvoed.bund2025 }, jsz: (eg) => jahressonderzahlungProzent('bund', eg) },
    ],
    entgeltgruppen,
    standLabels: { aktuell: 'ab 1. Mai 2026', vorher: 'Jan.–Apr. 2026' },
    zusatzversorgung: vbl,
  },
  tvl: {
    id: 'tvl',
    name: 'TV-L',
    bereiche: [{ id: 'laender', label: 'Länder (TV-L)', tabellen: { aktuell: tvl.tab2026, vorher: tvl.tab2025 }, jsz: jahressonderzahlungTvl }],
    entgeltgruppen: entgeltgruppenTvl,
    standLabels: { aktuell: 'ab 1. April 2026', vorher: 'Jan.–März 2026' },
    // Die VBL-Sätze gelten laut VBL für ATV- (Bund/VKA) und TdL-Arbeitgeber gleichermaßen
    zusatzversorgung: vbl,
  },
};
