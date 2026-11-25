/**
 * Register der Tarifverträge für den gemeinsamen Tarifrechner (TarifCalc.astro).
 * Jeder Tarif: Bereiche (z. B. Bund/VKA), Tabellen je Stand, Jahressonderzahlung, Zusatzversorgung.
 * Werte und Quellen stehen in den jeweiligen Datendateien (tvoed-2026.ts, …).
 */
import { tvoed, entgeltgruppen, jahressonderzahlungProzent, vbl, type Tabelle, type Entgeltgruppe } from './tvoed-2026';

export interface TarifBereich {
  id: string;
  label: string;
  /** Tabellen je Stand: 'aktuell' = ab 1. Mai 2026, 'vorher' = Januar bis April 2026 */
  tabellen: { aktuell: Tabelle; vorher: Tabelle };
  jsz: (eg: Entgeltgruppe) => number;
}

export interface Tarif {
  id: 'tvoed';
  name: string;
  bereiche: TarifBereich[];
  entgeltgruppen: Entgeltgruppe[];
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
};
