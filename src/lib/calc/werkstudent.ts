/**
 * Werkstudent Brutto-Netto 2026.
 * Regeln: DRV-Lexikon „Werkstudentenprivileg“ (20-Stunden-Grenze), § 20 Abs. 2a SGB IV (Übergangsbereich),
 * BMF-Schreiben 14.08.2025 Rn. 16 (keine KV/PV-Vorsorgepauschale bei Studenten ohne AN-Anteil).
 */
import { lohnsteuerMonat, sozialabgabenMonat, einkommensteuer, soliJahr, type Steuerklasse } from '../lohnsteuer-2026.ts';
import { steuer2026, kirchensteuerSatz, type BundeslandCode } from '../../data/steuer-2026.ts';

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export interface WerkstudentInput {
  bruttoMonat: number;
  stundenVorlesung: number;
  stundenFerien: number;
  steuerklasse: Steuerklasse;
  kirche: boolean;
  bundesland: BundeslandCode;
  alter: number;
  kinder: number;
}

export type WerkstudentStatus = 'werkstudent' | 'minijob' | 'ueber20';

export interface Posten {
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
  rv: number;
  kv: number;
  pv: number;
  av: number;
  netto: number;
}

export interface WerkstudentOutput {
  status: WerkstudentStatus;
  uebergangsbereich: boolean;
  monat: Posten & { brutto: number };
  jahr: Posten & { brutto: number };
  /** Grobe Schätzung der möglichen Erstattung über die Steuererklärung (nur dieses Arbeitsverhältnis, ganzes Jahr) */
  erstattungSchaetzung: number;
  ferienHinweis: boolean;
}

export function calculateWerkstudent(i: WerkstudentInput): Result<WerkstudentOutput> {
  const errors: Errors = {};
  if (!Number.isFinite(i.bruttoMonat) || i.bruttoMonat <= 0) errors.brutto = 'Bitte geben Sie einen Bruttolohn größer als 0 ein.';
  else if (i.bruttoMonat > 20_000) errors.brutto = 'Bitte geben Sie einen Monatslohn bis 20.000 € ein.';
  if (!Number.isFinite(i.stundenVorlesung) || i.stundenVorlesung <= 0 || i.stundenVorlesung > 60)
    errors.stundenVorlesung = 'Bitte geben Sie 1 bis 60 Wochenstunden ein.';
  if (!Number.isFinite(i.stundenFerien) || i.stundenFerien < 0 || i.stundenFerien > 60) errors.stundenFerien = 'Bitte geben Sie 0 bis 60 Wochenstunden ein.';
  if (!Number.isInteger(i.alter) || i.alter < 16 || i.alter > 70) errors.alter = 'Bitte geben Sie ein Alter zwischen 16 und 70 Jahren ein.';
  if (!Number.isFinite(i.kinder) || i.kinder < 0 || i.kinder > 10) errors.kinder = 'Bitte geben Sie 0 bis 10 Kinder ein.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const minijob = i.bruttoMonat <= steuer2026.minijobGrenze;
  const status: WerkstudentStatus = minijob ? 'minijob' : i.stundenVorlesung > 20 ? 'ueber20' : 'werkstudent';
  // Kinderlosenzuschlag zur PV erst ab 23 Jahren (§ 55 Abs. 3 SGB XI)
  const pvKinderlos = i.kinder === 0 && i.alter >= 23;
  const pvAbschlaege = Math.max(0, i.kinder - 1);

  const sv = sozialabgabenMonat({
    bruttoMonat: i.bruttoMonat,
    beschaeftigung: status === 'minijob' ? 'minijob' : status === 'werkstudent' ? 'werkstudent' : 'regulaer',
    bundesland: i.bundesland,
    pvKinderlos,
    pvAbschlaege,
  });

  // Minijob: Annahme Pauschsteuer 2 % trägt der Arbeitgeber → keine Lohnsteuer beim Studierenden
  const steuer =
    status === 'minijob'
      ? { lohnsteuer: 0, soli: 0, kirchensteuer: 0 }
      : lohnsteuerMonat({
          bruttoMonat: i.bruttoMonat,
          steuerklasse: i.steuerklasse,
          kinderfreibetraege: i.kinder,
          kirche: i.kirche,
          bundesland: i.bundesland,
          rvPflicht: true,
          avPflicht: status === 'ueber20',
          kv: status === 'ueber20' ? 'gkv' : 'ohne',
          pvKinderlos,
          pvAbschlaege,
        });

  const monat = posten(i.bruttoMonat, steuer, sv);
  const jahr = posten(i.bruttoMonat * 12, scale(steuer, 12), scale(sv, 12));

  // Schätzung Veranlagung: zvE = Jahresbrutto − AN-Pauschbetrag − SA-Pauschbetrag − Vorsorge (RV/KV/PV/AV-AN-Anteile)
  let erstattungSchaetzung = 0;
  if (status !== 'minijob') {
    const vorsorge = jahr.rv + jahr.kv + jahr.pv + jahr.av;
    const zvE = Math.max(0, i.bruttoMonat * 12 - steuer2026.arbeitnehmerPauschbetrag - steuer2026.sonderausgabenPauschbetrag - vorsorge);
    const est = einkommensteuer(zvE);
    const kist = i.kirche ? (est * kirchensteuerSatz(i.bundesland)) / 100 : 0;
    const festgesetzt = est + soliJahr(est) + kist;
    erstattungSchaetzung = Math.max(0, Math.round(jahr.lohnsteuer + jahr.soli + jahr.kirchensteuer - festgesetzt));
  }

  return {
    ok: true,
    status,
    uebergangsbereich: sv.uebergangsbereich && status !== 'minijob',
    monat: { brutto: i.bruttoMonat, ...monat },
    jahr: { brutto: i.bruttoMonat * 12, ...jahr },
    erstattungSchaetzung,
    ferienHinweis: i.stundenFerien > 20,
  };
}

/** Monatsbeträge auf das Jahr hochrechnen (nur Zahlenfelder, auf Cent gerundet) */
function scale<T extends object>(o: T, f: number): T {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) r[k] = typeof v === 'number' ? Math.round(v * f * 100) / 100 : v;
  return r as T;
}

function posten(brutto: number, st: { lohnsteuer: number; soli: number; kirchensteuer: number }, sv: { rv: number; kv: number; pv: number; av: number }): Posten {
  const abzuege = st.lohnsteuer + st.soli + st.kirchensteuer + sv.rv + sv.kv + sv.pv + sv.av;
  return {
    lohnsteuer: st.lohnsteuer,
    soli: st.soli,
    kirchensteuer: st.kirchensteuer,
    rv: sv.rv,
    kv: sv.kv,
    pv: sv.pv,
    av: sv.av,
    netto: Math.round((brutto - abzuege) * 100) / 100,
  };
}
