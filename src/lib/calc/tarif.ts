/**
 * Tarifgehalt (TVöD, später TV-L) brutto → netto 2026.
 * Monat: Tabellenentgelt × Teilzeitquote; Abzüge nach PAP 2026 und Sozialversicherung 2026; Zusatzversorgung (AN-Anteil).
 * Jahr: 12 × Monat + Jahressonderzahlung (sonstiger Bezug, Auszahlung November; SV bis zur anteiligen BBG Jan–Nov).
 */
import { lohnsteuerMonat, lohnsteuerSonstigerBezug, sozialabgabenMonat, svSaetzeAn, type Steuerklasse } from '../lohnsteuer-2026.ts';
import { steuer2026, type BundeslandCode } from '../../data/steuer-2026.ts';

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export interface TarifInput {
  /** Monatswerte der gewählten Tabelle für die Entgeltgruppe (Index 0 = Stufe 1; null = Stufe existiert nicht) */
  stufenwerte: (number | null)[];
  stufe: number;
  teilzeitProzent: number;
  /** Jahressonderzahlung in % (je nach Tarif und Entgeltgruppe) */
  jszProzent: number;
  /** Arbeitnehmeranteil Zusatzversorgung in % */
  zusatzversorgungProzent: number;
  steuerklasse: Steuerklasse;
  kirche: boolean;
  bundesland: BundeslandCode;
  kinder: number;
  kvZusatz: number;
}

export interface Abzuege {
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
  kv: number;
  pv: number;
  rv: number;
  av: number;
  zv: number;
}

export interface TarifOutput {
  tabellenentgelt: number;
  monat: Abzuege & { brutto: number; netto: number };
  jsz: Abzuege & { brutto: number; netto: number };
  jahr: Abzuege & { brutto: number; netto: number };
}

const rc = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
const summe = (a: Abzuege) => a.lohnsteuer + a.soli + a.kirchensteuer + a.kv + a.pv + a.rv + a.av + a.zv;

export function calculateTarif(i: TarifInput): Result<TarifOutput> {
  const errors: Errors = {};
  const tabellenentgelt = i.stufenwerte[i.stufe - 1];
  if (!Number.isInteger(i.stufe) || i.stufe < 1 || i.stufe > 6 || tabellenentgelt == null)
    errors.stufe = 'Diese Stufe gibt es in der gewählten Entgeltgruppe nicht.';
  if (!Number.isFinite(i.teilzeitProzent) || i.teilzeitProzent <= 0 || i.teilzeitProzent > 100)
    errors.teilzeit = 'Bitte geben Sie einen Beschäftigungsumfang zwischen 1 und 100 % ein.';
  if (!Number.isFinite(i.kinder) || i.kinder < 0 || i.kinder > 10) errors.kinder = 'Bitte geben Sie 0 bis 10 Kinder ein.';
  if (!Number.isFinite(i.kvZusatz) || i.kvZusatz < 0 || i.kvZusatz > 6) errors.kvZusatz = 'Bitte geben Sie einen Zusatzbeitrag zwischen 0 und 6 % ein.';
  if (!Number.isFinite(i.zusatzversorgungProzent) || i.zusatzversorgungProzent < 0 || i.zusatzversorgungProzent > 10)
    errors.zv = 'Bitte geben Sie einen Wert zwischen 0 und 10 % ein.';
  if (Object.keys(errors).length || tabellenentgelt == null) return { ok: false, errors };

  const brutto = rc((tabellenentgelt * i.teilzeitProzent) / 100);
  // Annahme: ohne Kinder kinderlos und mindestens 23 Jahre alt (Zuschlag zur Pflegeversicherung)
  const pvKinderlos = i.kinder === 0;
  const pvAbschlaege = Math.max(0, i.kinder - 1);
  const steuerBasis = {
    bruttoMonat: brutto,
    steuerklasse: i.steuerklasse,
    kinderfreibetraege: i.kinder,
    kirche: i.kirche,
    bundesland: i.bundesland,
    rvPflicht: true,
    avPflicht: true,
    kv: 'gkv' as const,
    kvZusatz: i.kvZusatz,
    pvKinderlos,
    pvAbschlaege,
  };

  // --- Monat
  const st = lohnsteuerMonat(steuerBasis);
  const sv = sozialabgabenMonat({ bruttoMonat: brutto, beschaeftigung: 'regulaer', bundesland: i.bundesland, kvZusatz: i.kvZusatz, pvKinderlos, pvAbschlaege });
  const monatAbz: Abzuege = { ...st, kv: sv.kv, pv: sv.pv, rv: sv.rv, av: sv.av, zv: rc((brutto * i.zusatzversorgungProzent) / 100) };
  const monat = { brutto, ...monatAbz, netto: rc(brutto - summe(monatAbz)) };

  // --- Jahressonderzahlung (November)
  const jszBrutto = rc((brutto * i.jszProzent) / 100);
  const stJ = lohnsteuerSonstigerBezug(steuerBasis, brutto * 12, jszBrutto);
  const satz = svSaetzeAn({ bundesland: i.bundesland, kvZusatz: i.kvZusatz, pvKinderlos, pvAbschlaege });
  // Einmalzahlung: beitragspflichtig, soweit die anteilige Jahres-BBG (Januar–November) noch nicht ausgeschöpft ist
  const restKv = Math.max(0, 11 * steuer2026.bbg.kvPvMonat - 11 * brutto);
  const restRv = Math.max(0, 11 * steuer2026.bbg.rvAvMonat - 11 * brutto);
  const baseKv = Math.min(jszBrutto, restKv);
  const baseRv = Math.min(jszBrutto, restRv);
  const jszAbz: Abzuege = {
    ...stJ,
    kv: rc((baseKv * satz.kv) / 100),
    pv: rc((baseKv * satz.pv) / 100),
    rv: rc((baseRv * satz.rv) / 100),
    av: rc((baseRv * satz.av) / 100),
    zv: rc((jszBrutto * i.zusatzversorgungProzent) / 100),
  };
  const jsz = { brutto: jszBrutto, ...jszAbz, netto: rc(jszBrutto - summe(jszAbz)) };

  // --- Jahr
  const keys = ['lohnsteuer', 'soli', 'kirchensteuer', 'kv', 'pv', 'rv', 'av', 'zv'] as const;
  const jahrAbz = Object.fromEntries(keys.map((k) => [k, rc(monatAbz[k] * 12 + jszAbz[k])])) as unknown as Abzuege;
  const jahrBrutto = rc(brutto * 12 + jszBrutto);
  const jahr = { brutto: jahrBrutto, ...jahrAbz, netto: rc(jahrBrutto - summe(jahrAbz)) };

  return { ok: true, tabellenentgelt, monat, jsz, jahr };
}
