/**
 * Steuer- und Sozialversicherungswerte 2026 – zentrale Datenquelle für alle Brutto-Netto-Rechner.
 * Jeder Wert mit Quelle und Prüfdatum. Die Lohnsteuer selbst rechnet der aus dem BMF-XML
 * erzeugte Programmablaufplan (src/lib/lohnsteuer/pap2026.generated.ts); die dort fest
 * eingebauten Werte sind hier zur Anzeige im Text und für die Sozialversicherung gespiegelt.
 */

const PAP = 'BMF, Programmablaufplan Lohnsteuer 2026 (XML-Pseudocode, Stand 23.10.2025), https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml';

export const steuer2026 = {
  /** Grundfreibetrag § 32a EStG in € – Quelle: PAP (GFB), zuletzt geprüft 2026-11-25 */
  grundfreibetrag: 12_348,
  /** Freigrenze Solidaritätszuschlag (Einzelveranlagung) in € – Quelle: PAP (SOLZFREI), zuletzt geprüft 2026-11-25 */
  soliFreigrenze: 20_350,
  /** Arbeitnehmer-Pauschbetrag in € – Quelle: PAP (MZTABFB), zuletzt geprüft 2026-11-25 */
  arbeitnehmerPauschbetrag: 1_230,
  /** Sonderausgaben-Pauschbetrag in € – Quelle: PAP (SAP), zuletzt geprüft 2026-11-25 */
  sonderausgabenPauschbetrag: 36,

  /** Beitragsbemessungsgrenzen (bundeseinheitlich) – Quelle: PAP (BBGRVALV, BBGKVPV), zuletzt geprüft 2026-11-25 */
  bbg: {
    rvAvJahr: 101_400,
    rvAvMonat: 8_450,
    kvPvJahr: 69_750,
    kvPvMonat: 5_812.5,
  },

  /** Beitragssätze in % (gesamt; Arbeitnehmer trägt i. d. R. die Hälfte) */
  beitrag: {
    /** Rentenversicherung 18,6 % (AN 9,3 %) – Quelle: PAP (RVSATZAN 0,093), zuletzt geprüft 2026-11-25 */
    rv: 18.6,
    /** Arbeitslosenversicherung 2,6 % (AN 1,3 %) – Quelle: PAP (AVSATZAN 0,013), zuletzt geprüft 2026-11-25 */
    av: 2.6,
    /** Allgemeiner Beitragssatz KV 14,6 % (AN 7,0 %) – Quelle: PAP (KVSATZAN = KVZ/2 + 0,07), zuletzt geprüft 2026-11-25 */
    kv: 14.6,
    /** Durchschnittlicher Zusatzbeitragssatz 2026 – Quelle: BMG, BAnz AT 10.11.2025 B7,
     *  https://www.bundesanzeiger.de/pub/publication/oUJYVk8GYRXybnb9Y4h/content/oUJYVk8GYRXybnb9Y4h/BAnz%20AT%2010.11.2025%20B7.pdf (zuletzt geprüft 2026-11-25) */
    kvZusatzDurchschnitt: 2.9,
    /** Pflegeversicherung 3,6 % (AN 1,8 %; Sachsen AN 2,3 %) – Quelle: PAP (PVSATZAN), BMF-Schreiben 14.08.2025 Rn. 18, zuletzt geprüft 2026-11-25 */
    pv: 3.6,
    pvAnSachsenZusatz: 0.5,
    /** Zuschlag für Kinderlose (AN allein) und Abschlag je Kind (2. bis 5. Kind) – Quelle: PAP, BMF-Schreiben 14.08.2025 Rn. 19, zuletzt geprüft 2026-11-25 */
    pvKinderlosZuschlag: 0.6,
    pvAbschlagJeKind: 0.25,
  },

  /** Minijob / Übergangsbereich – Quelle: DRV-Pressemitteilung 23.02.2026,
   *  https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Presse/Meldungen/2026/260223-minijob-midijob-verdienstgrenzen-steigen.html (zuletzt geprüft 2026-11-25) */
  minijobGrenze: 603,
  uebergangsbereichObergrenze: 2_000,
  /** Gesetzlicher Mindestlohn in €/Stunde (brutto je Zeitstunde) – Quelle: Fünfte Mindestlohnanpassungsverordnung (MiLoV5) v. 05.11.2025,
   *  https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html (zuletzt geprüft 2026-11-26) */
  mindestlohn: 13.9,
  /** ab 1. Januar 2027 – Quelle: MiLoV5 (s. o.) */
  mindestlohn2027: 14.6,

  /** Minijob-Rentenversicherung in % – Quelle: DRV, FAQ Minijobs,
   *  https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Allgemeine-Informationen/Wissenswertes-zur-Rente/FAQs/Minijobs/Minijobs.html (zuletzt geprüft 2026-11-25) */
  minijob: {
    rvEigenanteil: 3.6,
    rvArbeitgeberPauschal: 15,
    pauschsteuer: 2,
  },

  /** Kirchensteuersatz in % der Lohn-/Einkommensteuer – BY/BW 8 %, übrige Länder 9 %.
   *  Quelle u. a. Bekanntmachung Kirchensteuerbeschlüsse BW 2026, BStBl 2026 I S. 869 (zuletzt geprüft 2026-11-25) */
  kirchensteuer: { BY: 8, BW: 8, default: 9 },

  quellePap: PAP,
} as const;

export const bundeslaender = [
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
] as const;

export type BundeslandCode = (typeof bundeslaender)[number]['code'];

export function kirchensteuerSatz(land: BundeslandCode): number {
  return land === 'BY' || land === 'BW' ? steuer2026.kirchensteuer.BY : steuer2026.kirchensteuer.default;
}
