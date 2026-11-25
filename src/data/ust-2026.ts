/**
 * Umsatzsteuer-Werte 2026 – zentrale Datenquelle für Rechner und Ratgebertexte.
 * Jeder Wert mit Quelle und Prüfdatum. Bei Gesetzesänderungen nur hier anpassen.
 */

export const ust2026 = {
  /** Regelsteuersatz in % – § 12 Abs. 1 UStG
   *  Quelle: https://www.gesetze-im-internet.de/ustg_1980/__12.html (zuletzt geprüft: 2026-11-24) */
  regelsatz: 19,

  /** Ermäßigter Steuersatz in % – § 12 Abs. 2 UStG (inkl. Nr. 15: Speisen in der Gastronomie, ohne Getränke, seit 01.01.2026)
   *  Quelle: https://www.gesetze-im-internet.de/ustg_1980/__12.html (zuletzt geprüft: 2026-11-24)
   *  Inkrafttreten Nr. 15: Steueränderungsgesetz 2025 v. 22.12.2025, BGBl. I 2025 Nr. 363 */
  ermaessigt: 7,

  kleinunternehmer: {
    /** Gesamtumsatz im vorangegangenen Kalenderjahr höchstens … € – § 19 Abs. 1 UStG
     *  Quelle: https://www.gesetze-im-internet.de/ustg_1980/__19.html (zuletzt geprüft: 2026-11-24) */
    vorjahr: 25_000,
    /** Gesamtumsatz im laufenden Kalenderjahr höchstens … € – § 19 Abs. 1 UStG
     *  Wird die Grenze im laufenden Jahr überschritten, unterliegt bereits der überschreitende Umsatz der Regelbesteuerung.
     *  Quelle: BMF-Schreiben v. 18.03.2025, https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-03-18-sonderregelung-kleinunternehmer.pdf (zuletzt geprüft: 2026-11-24) */
    laufendesJahr: 100_000,
    /** Im Gründungsjahr gilt die Grenze von 25.000 € für das laufende Jahr.
     *  Quelle: BMF, Muster USt-Voranmeldung 2026 v. 29.12.2025, https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/2025-12-29-vordruckmuster-USt-voranmeldung-2026.pdf (zuletzt geprüft: 2026-11-24) */
    gruendungsjahr: 25_000,
  },
} as const;
