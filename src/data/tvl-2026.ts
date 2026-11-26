/**
 * TV-L 2026 – Allgemeine Entgelttabelle (Anlage B zum TV-L), Jahressonderzahlung, Stufenlaufzeiten.
 *
 * Quellen (Tarifgemeinschaft deutscher Länder, zuletzt geprüft: 2026-11-26):
 * - Anlage B gültig 01.04.2026–31.12.2026: https://www.tdl-online.de/fileadmin/downloads/TV-L/TV-L_Anlagen/Allgemeine_Entgelttabelle__Anlage_B___g%C3%BCltig_vom_01.04.2026_bis_31.12.2026.pdf
 * - Anlage B gültig 01.11.2025–31.03.2026: https://www.tdl-online.de/fileadmin/downloads/TV-L/TV-L_Anlagen/Allgemeine_Entgelttabelle__Anlage_B___g%C3%BCltig_vom_01.11.2025_bis_31.03.2026.pdf
 * - TV-L i. d. F. des ÄTV Nr. 14 (§§ 6, 16, 20): https://www.tdl-online.de/fileadmin/downloads/TV-L/260812_TV-L__i.d.F._des_%C3%84TV_Nr._14_VT_neu.pdf
 * - Tarifeinigung vom 14.02.2026 (Pressemitteilung TdL 02/2026): https://www.tdl-online.de/tarifrunden/tarifrunde-fuer-die-beschaeftigten-im-oeffentlichen-dienst-der-laender-2026
 * Prüfung: Jeder Wert der Tabelle ab 1.4.2026 = Vorgängertabelle × 1,028, mindestens + 100 € (kaufmännisch gerundet) – keine Abweichung.
 *
 * Werte: Monatsbeträge in Euro, Index 0 = Stufe 1 … Index 5 = Stufe 6; null = Stufe existiert nicht (E 1: Stufen 2–6).
 * Die TV-L-Tabelle kennt E 9a und E 9b (keine E 9c).
 */

export type EntgeltgruppeTvl = '15' | '14' | '13' | '12' | '11' | '10' | '9b' | '9a' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1';
export type TabelleTvl = Record<EntgeltgruppeTvl, (number | null)[]>;

export const entgeltgruppenTvl: EntgeltgruppeTvl[] = ['15', '14', '13', '12', '11', '10', '9b', '9a', '8', '7', '6', '5', '4', '3', '2', '1'];

export const tvl = {
  /** gültig vom 1. April 2026 bis 31. Dezember 2026 */
  tab2026: {
    '15': [5658.38, 6067.30, 6283.38, 7050.89, 7632.07, 7854.52],
    '14': [5143.59, 5515.90, 5821.41, 6283.38, 6991.23, 7194.48],
    '13': [4759.37, 5106.09, 5366.89, 5873.56, 6573.97, 6764.69],
    '12': [4310.90, 4599.41, 5210.41, 5746.90, 6439.85, 6626.54],
    '11': [4178.35, 4444.86, 4748.43, 5210.41, 5881.02, 6050.95],
    '10': [4038.42, 4299.95, 4599.41, 4904.89, 5486.13, 5644.20],
    '9b': [3620.10, 3870.81, 4035.07, 4488.99, 4875.10, 5014.87],
    '9a': [3620.10, 3870.81, 3925.58, 4035.07, 4488.99, 4615.76],
    '8': [3419.52, 3659.02, 3795.52, 3925.58, 4069.31, 4158.27],
    '7': [3235.83, 3469.72, 3645.69, 3781.85, 3891.36, 3987.16],
    '6': [3186.57, 3418.08, 3547.20, 3679.20, 3768.15, 3863.96],
    '5': [3073.97, 3301.87, 3430.99, 3553.66, 3652.34, 3720.25],
    '4': [2949.24, 3179.22, 3340.61, 3430.99, 3521.39, 3579.47],
    '3': [2915.57, 3140.47, 3205.03, 3308.32, 3392.25, 3463.27],
    '2': [2742.84, 2953.24, 3017.80, 3082.36, 3230.84, 3385.81],
    '1': [null, 2534.49, 2565.06, 2601.78, 2638.51, 2730.30],
  } as TabelleTvl,
  /** gültig vom 1. November 2025 bis 31. März 2026 (gilt also für Januar bis März 2026) */
  tab2025: {
    '15': [5504.26, 5902.04, 6112.24, 6858.84, 7424.19, 7640.58],
    '14': [5003.49, 5365.66, 5662.85, 6112.24, 6800.81, 6998.52],
    '13': [4629.74, 4967.01, 5220.71, 5713.58, 6394.91, 6580.44],
    '12': [4193.48, 4474.13, 5068.49, 5590.37, 6264.45, 6446.05],
    '11': [4064.54, 4323.79, 4619.10, 5068.49, 5720.84, 5886.14],
    '10': [3928.42, 4182.83, 4474.13, 4771.29, 5336.70, 5490.47],
    '9b': [3520.10, 3765.38, 3925.17, 4366.72, 4742.32, 4878.28],
    '9a': [3520.10, 3765.38, 3818.66, 3925.17, 4366.72, 4490.04],
    '8': [3319.52, 3559.02, 3692.14, 3818.66, 3958.47, 4045.01],
    '7': [3135.83, 3369.72, 3545.69, 3678.84, 3785.37, 3878.56],
    '6': [3086.57, 3318.08, 3447.20, 3578.99, 3665.52, 3758.72],
    '5': [2973.97, 3201.87, 3330.99, 3453.66, 3552.34, 3618.92],
    '4': [2849.24, 3079.22, 3240.61, 3330.99, 3421.39, 3479.47],
    '3': [2815.57, 3040.47, 3105.03, 3208.32, 3292.25, 3363.27],
    '2': [2642.84, 2853.24, 2917.80, 2982.36, 3130.84, 3285.81],
    '1': [null, 2434.49, 2465.06, 2501.78, 2538.51, 2630.30],
  } as TabelleTvl,
};

/** Jahressonderzahlung § 20 Abs. 2 TV-L (ab dem Kalenderjahr 2022, einheitlich in Ost und West) in % */
export function jahressonderzahlungTvl(eg: string): number {
  const n = parseInt(eg, 10);
  if (n <= 4) return 87.43;
  if (n <= 8) return 88.14;
  if (n <= 11) return 74.35;
  if (n <= 13) return 46.47;
  return 32.53;
}
