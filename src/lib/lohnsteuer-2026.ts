/**
 * Gemeinsames Steuer- und Abgabenmodul 2026 für alle Brutto-Netto-Rechner.
 *
 * - Lohnsteuer, Soli, Kirchensteuer: offizieller Programmablaufplan des BMF (aus XML erzeugt)
 * - Einkommensteuer-Tarif § 32a EStG (gleiche Tarifformel wie im PAP), Fünftelregelung § 34 EStG
 * - Sozialversicherung (Arbeitnehmeranteile) inkl. Übergangsbereich § 20 Abs. 2a SGB IV
 *
 * Alle Beträge in Euro. Werte/Quellen: src/data/steuer-2026.ts
 */
import { BigDecimal } from './lohnsteuer/bigdecimal.ts';
import { Lohnsteuer2026 } from './lohnsteuer/pap2026.generated.ts';
import { steuer2026, kirchensteuerSatz, type BundeslandCode } from '../data/steuer-2026.ts';

export type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const cent = (euro: number) => BigDecimal.valueOf(Math.round(euro * 100));
const euro = (c: BigDecimal) => c.toNumber() / 100;
/** Auf volle Cent abrunden (Kirchensteuer, Beiträge werden kaufmännisch gerundet – s. u.) */
const floorCent = (v: number) => Math.floor(v * 100 + 1e-9) / 100;
const roundCent = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

// ---------------------------------------------------------------------------
// Lohnsteuer (Monat)
// ---------------------------------------------------------------------------

export interface LohnsteuerInput {
  /** Steuerpflichtiger Monatsbrutto in € */
  bruttoMonat: number;
  steuerklasse: Steuerklasse;
  /** Zahl der Kinderfreibeträge lt. ELStAM (z. B. 1 je Kind bei Steuerklasse I–III, 0,5 bei IV) */
  kinderfreibetraege: number;
  kirche: boolean;
  bundesland: BundeslandCode;
  /** In der gesetzlichen RV pflichtversichert (Teilbetrag RV in der Vorsorgepauschale) */
  rvPflicht: boolean;
  /** In der Arbeitslosenversicherung versichert */
  avPflicht: boolean;
  /**
   * 'gkv' = gesetzlich KV/PV mit Arbeitnehmeranteil; 'ohne' = kein AN-Anteil zur KV
   * (z. B. Werkstudenten, BMF-Schreiben 14.08.2025 Rn. 16 → PKV = 1 ohne Beiträge)
   */
  kv: 'gkv' | 'ohne';
  /** Kassenindividueller Zusatzbeitrag in % (Standard: Durchschnitt 2026) */
  kvZusatz?: number;
  pvKinderlos?: boolean;
  /** Zahl der PV-Abschläge (2. bis 5. Kind → 0–4) */
  pvAbschlaege?: number;
}

export interface LohnsteuerResult {
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
}

export function lohnsteuerMonat(i: LohnsteuerInput): LohnsteuerResult {
  const p = new Lohnsteuer2026();
  p.LZZ = 2;
  p.RE4 = cent(i.bruttoMonat);
  p.STKL = i.steuerklasse;
  p.ZKF = BigDecimal.valueOf(i.steuerklasse <= 4 ? i.kinderfreibetraege : 0);
  p.R = i.kirche ? 1 : 0;
  p.KRV = i.rvPflicht ? 0 : 1;
  p.ALV = i.avPflicht ? 0 : 1;
  p.PKV = i.kv === 'gkv' ? 0 : 1;
  p.PKPV = BigDecimal.ZERO;
  p.KVZ = BigDecimal.valueOf(i.kvZusatz ?? steuer2026.beitrag.kvZusatzDurchschnitt);
  p.PVS = i.bundesland === 'SN' ? 1 : 0;
  p.PVZ = i.pvKinderlos ? 1 : 0;
  p.PVA = BigDecimal.valueOf(Math.min(4, Math.max(0, i.pvAbschlaege ?? 0)));
  p.MAIN();
  const lohnsteuer = euro(p.LSTLZZ);
  const bk = euro(p.BK);
  return {
    lohnsteuer,
    soli: euro(p.SOLZLZZ),
    kirchensteuer: i.kirche ? floorCent((bk * kirchensteuerSatz(i.bundesland)) / 100) : 0,
  };
}

/**
 * Lohnsteuer auf einen sonstigen Bezug (z. B. Jahressonderzahlung/Weihnachtsgeld) nach § 39b Abs. 3 EStG
 * mit dem PAP (Felder JRE4, SONSTB → STS, SOLZS, BKS).
 * @param jahresbruttoOhneBezug voraussichtlicher Jahresarbeitslohn ohne den sonstigen Bezug
 */
export function lohnsteuerSonstigerBezug(i: LohnsteuerInput, jahresbruttoOhneBezug: number, sonstigerBezug: number): LohnsteuerResult {
  const p = new Lohnsteuer2026();
  p.LZZ = 2;
  p.RE4 = cent(i.bruttoMonat);
  p.JRE4 = cent(jahresbruttoOhneBezug);
  p.SONSTB = cent(sonstigerBezug);
  p.STKL = i.steuerklasse;
  p.ZKF = BigDecimal.valueOf(i.steuerklasse <= 4 ? i.kinderfreibetraege : 0);
  p.R = i.kirche ? 1 : 0;
  p.KRV = i.rvPflicht ? 0 : 1;
  p.ALV = i.avPflicht ? 0 : 1;
  p.PKV = i.kv === 'gkv' ? 0 : 1;
  p.KVZ = BigDecimal.valueOf(i.kvZusatz ?? steuer2026.beitrag.kvZusatzDurchschnitt);
  p.PVS = i.bundesland === 'SN' ? 1 : 0;
  p.PVZ = i.pvKinderlos ? 1 : 0;
  p.PVA = BigDecimal.valueOf(Math.min(4, Math.max(0, i.pvAbschlaege ?? 0)));
  p.MAIN();
  const bks = euro(p.BKS);
  return {
    lohnsteuer: euro(p.STS),
    soli: euro(p.SOLZS),
    kirchensteuer: i.kirche ? floorCent((bks * kirchensteuerSatz(i.bundesland)) / 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Einkommensteuer (Jahr) – § 32a EStG, Soli, Fünftelregelung § 34 EStG
// ---------------------------------------------------------------------------

/** Tarifliche Einkommensteuer für ein zu versteuerndes Einkommen (Grund- oder Splittingtarif) */
export function einkommensteuer(zvE: number, splitting = false): number {
  if (!(zvE > 0)) return 0;
  const p = new Lohnsteuer2026();
  p.MPARA(); // setzt u. a. den Grundfreibetrag
  p.KZTAB = splitting ? 2 : 1;
  p.X = BigDecimal.valueOf(Math.floor(zvE / p.KZTAB));
  p.UPTAB26();
  return p.ST.toNumber();
}

/** Solidaritätszuschlag auf eine Jahressteuer (Freigrenze, Milderungszone 11,9 %) – wie PAP MSOLZ */
export function soliJahr(steuer: number, splitting = false): number {
  const frei = steuer2026.soliFreigrenze * (splitting ? 2 : 1);
  if (steuer <= frei) return 0;
  return floorCent(Math.min(steuer * 0.055, (steuer - frei) * 0.119));
}

export interface FuenftelResult {
  ohne: number;
  mit: number;
}

/**
 * Einkommensteuer auf zvE (ohne Abfindung) plus außerordentliche Einkünfte – ohne und mit Fünftelregelung:
 * mit = ESt(zvE) + 5 × (ESt(zvE + A/5) − ESt(zvE))
 */
export function einkommensteuerFuenftel(zvE: number, ausserordentlich: number, splitting = false): FuenftelResult {
  const basis = einkommensteuer(zvE, splitting);
  const ohne = einkommensteuer(zvE + ausserordentlich, splitting);
  const mit = basis + 5 * (einkommensteuer(zvE + ausserordentlich / 5, splitting) - basis);
  return { ohne, mit: Math.min(mit, ohne) };
}

// ---------------------------------------------------------------------------
// Sozialversicherung – Arbeitnehmeranteile (Monat)
// ---------------------------------------------------------------------------

/** Beitragspflichtige Einnahme für den AN-Anteil im Übergangsbereich, § 20 Abs. 2a SGB IV:
 *  BE = 2000 / (2000 − G) × (AE − G) */
export function uebergangsbereichBE(brutto: number): number {
  const G = steuer2026.minijobGrenze;
  const O = steuer2026.uebergangsbereichObergrenze;
  if (brutto <= G || brutto > O) return brutto;
  return (O / (O - G)) * (brutto - G);
}

export type Beschaeftigung = 'regulaer' | 'werkstudent' | 'minijob';

export interface SvInput {
  bruttoMonat: number;
  beschaeftigung: Beschaeftigung;
  bundesland: BundeslandCode;
  kvZusatz?: number;
  pvKinderlos?: boolean;
  pvAbschlaege?: number;
  /** Nur Minijob: von der RV-Pflicht befreit */
  rvBefreit?: boolean;
}

export interface SvResult {
  rv: number;
  kv: number;
  pv: number;
  av: number;
  /** true, wenn der reduzierte AN-Anteil des Übergangsbereichs angewendet wurde */
  uebergangsbereich: boolean;
}

/** Arbeitnehmer-Beitragssätze in % (reguläre Beschäftigung) – z. B. für Einmalzahlungen */
export function svSaetzeAn(i: Pick<SvInput, 'bundesland' | 'kvZusatz' | 'pvKinderlos' | 'pvAbschlaege'>) {
  const b = steuer2026.beitrag;
  let pv = b.pv / 2 + (i.bundesland === 'SN' ? b.pvAnSachsenZusatz : 0);
  if (i.pvKinderlos) pv += b.pvKinderlosZuschlag;
  else pv -= Math.min(4, Math.max(0, i.pvAbschlaege ?? 0)) * b.pvAbschlagJeKind;
  return { rv: b.rv / 2, av: b.av / 2, kv: b.kv / 2 + (i.kvZusatz ?? b.kvZusatzDurchschnitt) / 2, pv };
}

export function sozialabgabenMonat(i: SvInput): SvResult {
  const b = steuer2026.beitrag;
  const bbg = steuer2026.bbg;
  if (i.beschaeftigung === 'minijob') {
    const rv = i.rvBefreit ? 0 : roundCent((i.bruttoMonat * steuer2026.minijob.rvEigenanteil) / 100);
    return { rv, kv: 0, pv: 0, av: 0, uebergangsbereich: false };
  }
  const ueb = i.bruttoMonat > steuer2026.minijobGrenze && i.bruttoMonat <= steuer2026.uebergangsbereichObergrenze;
  const be = uebergangsbereichBE(i.bruttoMonat);
  const beRv = Math.min(be, bbg.rvAvMonat);
  const beKv = Math.min(be, bbg.kvPvMonat);
  const rv = roundCent((beRv * b.rv) / 200);
  if (i.beschaeftigung === 'werkstudent') return { rv, kv: 0, pv: 0, av: 0, uebergangsbereich: ueb };

  const kvSatzAn = b.kv / 2 + (i.kvZusatz ?? b.kvZusatzDurchschnitt) / 2;
  let pvSatzAn = b.pv / 2 + (i.bundesland === 'SN' ? b.pvAnSachsenZusatz : 0);
  if (i.pvKinderlos) pvSatzAn += b.pvKinderlosZuschlag;
  else pvSatzAn -= Math.min(4, Math.max(0, i.pvAbschlaege ?? 0)) * b.pvAbschlagJeKind;
  return {
    rv,
    kv: roundCent((beKv * kvSatzAn) / 100),
    pv: roundCent((beKv * pvSatzAn) / 100),
    av: roundCent((beRv * b.av) / 200),
    uebergangsbereich: ueb,
  };
}
