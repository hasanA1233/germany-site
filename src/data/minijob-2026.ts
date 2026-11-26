/**
 * Minijob 2026 – Abgaben des Arbeitgebers und Eigenanteil zur Rentenversicherung (in % des Verdienstes).
 * Quellen (zuletzt geprüft 2026-11-26):
 * - Gewerbe: https://www.minijob-zentrale.de/DE/fuer-gewerbetreibende/abgaben-und-steuern („insgesamt bei höchstens 31,17 Prozent“)
 * - Privathaushalt: https://www.minijob-zentrale.de/DE/fuer-haushalte/abgaben-und-fristen („Abgaben von maximal 14,62 Prozent“)
 * - Verdienstgrenze 603 € (Mindestlohn 13,90 € × 130 ÷ 3, aufgerundet): DRV-Pressemitteilung 23.02.2026 (siehe steuer-2026.ts)
 * - Gelegentliches Überschreiten: § 8 Abs. 1b SGB IV, https://www.gesetze-im-internet.de/sgb_4/__8.html
 */

export interface MinijobAbgaben {
  /** Pauschalbeitrag Krankenversicherung – nur wenn der Minijobber gesetzlich krankenversichert ist */
  kv: number;
  rvArbeitgeber: number;
  /** Eigenanteil des Minijobbers zur Rentenversicherung (entfällt bei Befreiung) */
  rvEigenanteil: number;
  pauschsteuer: number;
  u1: number;
  u2: number;
  insolvenzgeldumlage: number;
  /** Unfallversicherung in % – im Gewerbe individuell (null), im Privathaushalt 1,6 % */
  unfallversicherung: number | null;
}

export const minijob2026: Record<'gewerbe' | 'haushalt', MinijobAbgaben> = {
  gewerbe: { kv: 13, rvArbeitgeber: 15, rvEigenanteil: 3.6, pauschsteuer: 2, u1: 0.8, u2: 0.22, insolvenzgeldumlage: 0.15, unfallversicherung: null },
  haushalt: { kv: 5, rvArbeitgeber: 5, rvEigenanteil: 13.6, pauschsteuer: 2, u1: 0.8, u2: 0.22, insolvenzgeldumlage: 0, unfallversicherung: 1.6 },
};

/** Verdienstgrenze 2027 bei Mindestlohn 14,60 € (14,60 × 130 ÷ 3 = 632,67 → aufgerundet) – Quelle: Bundesregierung, Mindestlohn-FAQ */
export const minijobGrenze2027 = 633;
