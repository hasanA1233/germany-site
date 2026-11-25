import { getCategory, type CategoryId, type IconName } from './categories';

export type CalculatorSlug =
  | 'kreditrate-berechnen'
  | 'zinseszins-rechner'
  | 'sparplan-rechner'
  | 'tilgungsrechner'
  | 'umsatzsteuer-rechner'
  | 'gewinn-rechner'
  | 'gewinnmarge-rechner'
  | 'roi-rechner'
  | 'break-even-rechner'
  | 'rabatt-rechner'
  | 'werkstudent-brutto-netto-rechner'
  | 'prozent-rechner';

export interface CalculatorMeta {
  slug: CalculatorSlug;
  href: string;
  name: string;
  /** Kurzbeschreibung für Karten und Suche */
  description: string;
  /** Primäre Kategorie (Breadcrumb) */
  category: CategoryId;
  /** Weitere Kategorien, in denen der Rechner gelistet wird */
  alsoIn: CategoryId[];
  keywords: string[];
  icon: IconName;
  related: CalculatorSlug[];
  /** Kernformel für das Vorschaubild (Open Graph) */
  ogFormula: string;
  featured?: boolean;
  /** Redaktionell als beliebtes Thema hervorgehoben */
  popular?: boolean;
  /** Reihenfolge unter „Häufige Rechenfragen“ auf der Startseite (kleiner = weiter vorn) */
  popularRank?: number;
  /** Veröffentlichungsdatum (ISO) */
  added: string;
}

export const calculators: CalculatorMeta[] = [
  {
    slug: 'kreditrate-berechnen',
    href: '/kreditrate-berechnen/',
    name: 'Kreditrechner',
    description: 'Monatliche Rate, Gesamtkosten und Zinsen eines Ratenkredits berechnen – optional mit Sondertilgung.',
    category: 'kredit',
    alsoIn: [],
    keywords: ['kredit', 'kreditrate', 'ratenkredit', 'darlehen', 'monatsrate', 'annuität', 'zinsen', 'autokredit', 'sondertilgung'],
    icon: 'loan',
    related: ['tilgungsrechner', 'zinseszins-rechner', 'roi-rechner'],
    ogFormula: 'Rate = K × r × (1+r)^n ÷ ((1+r)^n − 1)',
    featured: true,
    popular: true,
    added: '2026-11-22',
  },
  {
    slug: 'zinseszins-rechner',
    href: '/zinseszins-rechner/',
    name: 'Zinseszinsrechner',
    description: 'Wie viel wird aus Ihrem Kapital mit Zinseszins? Endkapital, Zinserträge und Wachstum berechnen.',
    category: 'sparen-investieren',
    alsoIn: [],
    keywords: ['zinseszins', 'zinsen', 'kapital', 'endkapital', 'anlage', 'tagesgeld', 'festgeld', 'verzinsung'],
    icon: 'growth',
    related: ['sparplan-rechner', 'roi-rechner', 'kreditrate-berechnen'],
    ogFormula: 'Endkapital = Kapital × (1 + Zins)^Jahre',
    featured: true,
    popular: true,
    added: '2026-11-22',
  },
  {
    slug: 'sparplan-rechner',
    href: '/sparplan-rechner/',
    name: 'Sparplanrechner',
    description: 'Monatlich sparen: Einzahlungen, geschätztes Endkapital und Erträge eines Sparplans berechnen.',
    category: 'sparen-investieren',
    alsoIn: [],
    keywords: ['sparplan', 'etf', 'sparrate', 'vermögensaufbau', 'rendite', 'altersvorsorge', 'fonds', 'sparen'],
    icon: 'piggy',
    related: ['zinseszins-rechner', 'roi-rechner', 'rabatt-rechner'],
    ogFormula: 'Endkapital = Einzahlungen + Erträge (geschätzt)',
    featured: true,
    popular: true,
    added: '2026-11-22',
  },
  {
    slug: 'tilgungsrechner',
    href: '/tilgungsrechner/',
    name: 'Tilgungsrechner',
    description: 'Tilgungsplan für Annuitätendarlehen: Rate, Laufzeit, Zinskosten und Restschuld nach Zinsbindung.',
    category: 'kredit',
    alsoIn: [],
    keywords: ['tilgung', 'tilgungsplan', 'baufinanzierung', 'annuitätendarlehen', 'restschuld', 'zinsbindung', 'immobilie', 'hypothek'],
    icon: 'table',
    related: ['kreditrate-berechnen', 'zinseszins-rechner', 'sparplan-rechner'],
    ogFormula: 'Rate = Darlehen × (Sollzins + Tilgung) ÷ 12',
    featured: true,
    popular: true,
    added: '2026-11-22',
  },
  {
    slug: 'umsatzsteuer-rechner',
    href: '/umsatzsteuer-rechner/',
    name: 'MwSt-Rechner',
    description: 'MwSt brutto netto rechnen: Mehrwertsteuer mit 19 %, 7 % oder eigenem Satz – in beide Richtungen, mit Kopierfunktion.',
    category: 'gehalt-steuern',
    alsoIn: ['business', 'prozent-rechner'],
    keywords: ['mwst', 'mwst rechner', 'mehrwertsteuer', 'umsatzsteuer', 'ust', 'brutto netto', 'netto brutto', '19 prozent', '7 prozent', 'rechnung', 'vorsteuer'],
    icon: 'receipt',
    related: ['prozent-rechner', 'rabatt-rechner', 'gewinnmarge-rechner', 'gewinn-rechner'],
    ogFormula: 'Brutto = Netto × 1,19  ·  Netto = Brutto ÷ 1,19',
    featured: true,
    popular: true,
    popularRank: 2,
    added: '2026-11-22',
  },
  {
    slug: 'gewinn-rechner',
    href: '/gewinn-rechner/',
    name: 'Gewinnrechner',
    description: 'Gewinn oder Verlust aus Umsatz und Kosten berechnen – einfach und übersichtlich.',
    category: 'business',
    alsoIn: [],
    keywords: ['gewinn', 'verlust', 'umsatz', 'kosten', 'ergebnis', 'selbstständig', 'unternehmen', 'einnahmen', 'ausgaben'],
    icon: 'profit',
    related: ['gewinnmarge-rechner', 'break-even-rechner', 'roi-rechner', 'umsatzsteuer-rechner'],
    ogFormula: 'Gewinn = Umsatz − Kosten',
    added: '2026-11-22',
  },
  {
    slug: 'gewinnmarge-rechner',
    href: '/gewinnmarge-rechner/',
    name: 'Gewinnmargenrechner',
    description: 'Gewinnmarge, Kostenquote und Aufschlag in Prozent berechnen – inklusive Unterschied Marge vs. Aufschlag.',
    category: 'business',
    alsoIn: ['prozent-rechner'],
    keywords: ['marge', 'gewinnmarge', 'umsatzrendite', 'aufschlag', 'kalkulation', 'handelsspanne', 'kostenquote'],
    icon: 'margin',
    related: ['gewinn-rechner', 'break-even-rechner', 'rabatt-rechner', 'umsatzsteuer-rechner'],
    ogFormula: 'Marge = Gewinn ÷ Umsatz × 100',
    added: '2026-11-22',
  },
  {
    slug: 'roi-rechner',
    href: '/roi-rechner/',
    name: 'ROI-Rechner',
    description: 'Return on Investment berechnen: ROI in Prozent, Gewinn und optional die jährliche Rendite.',
    category: 'business',
    alsoIn: ['sparen-investieren', 'prozent-rechner'],
    keywords: ['roi', 'return on investment', 'rendite', 'kapitalrendite', 'investition', 'rentabilität', 'marketing'],
    icon: 'roi',
    related: ['gewinn-rechner', 'break-even-rechner', 'zinseszins-rechner', 'sparplan-rechner'],
    ogFormula: 'ROI = Nettogewinn ÷ Investition × 100',
    featured: true,
    added: '2026-11-22',
  },
  {
    slug: 'break-even-rechner',
    href: '/break-even-rechner/',
    name: 'Break-Even-Rechner',
    description: 'Break-Even-Punkt berechnen: Ab welcher Menge und welchem Umsatz decken Sie Ihre Kosten?',
    category: 'business',
    alsoIn: [],
    keywords: ['break even', 'break-even', 'gewinnschwelle', 'deckungsbeitrag', 'fixkosten', 'variable kosten', 'nutzenschwelle'],
    icon: 'breakeven',
    related: ['gewinn-rechner', 'gewinnmarge-rechner', 'roi-rechner', 'umsatzsteuer-rechner'],
    ogFormula: 'Break-Even = Fixkosten ÷ Deckungsbeitrag',
    added: '2026-11-22',
  },
  {
    slug: 'rabatt-rechner',
    href: '/rabatt-rechner/',
    name: 'Rabattrechner',
    description: 'Rabatt in Euro und Endpreis berechnen – oder den Rabatt in Prozent aus altem und neuem Preis.',
    category: 'prozent-rechner',
    alsoIn: [],
    keywords: ['rabatt', 'prozent', 'preisnachlass', 'skonto', 'reduziert', 'sale', 'angebot', 'ersparnis', 'prozentrechner'],
    icon: 'discount',
    related: ['prozent-rechner', 'umsatzsteuer-rechner', 'gewinnmarge-rechner', 'gewinn-rechner'],
    ogFormula: 'Endpreis = Preis × (1 − Rabatt ÷ 100)',
    popular: true,
    added: '2026-11-22',
  },
  {
    slug: 'werkstudent-brutto-netto-rechner',
    href: '/werkstudent-brutto-netto-rechner/',
    name: 'Werkstudent-Rechner',
    description: 'Werkstudent brutto netto 2026: Lohnsteuer, Rentenversicherung und Netto pro Monat und Jahr – mit Prüfung der 20-Stunden-Grenze.',
    category: 'gehalt-steuern',
    alsoIn: [],
    keywords: ['werkstudent', 'werkstudentin', 'student', 'studentenjob', 'nebenjob', 'brutto netto', 'gehalt', 'lohnsteuer', 'rentenversicherung', '20 stunden', 'minijob', 'midijob'],
    icon: 'student',
    related: ['umsatzsteuer-rechner', 'sparplan-rechner', 'zinseszins-rechner'],
    ogFormula: 'Netto = Brutto − Lohnsteuer − Rentenversicherung',
    added: '2026-11-25',
  },
  {
    // Eigene Seite src/pages/prozent-rechner.astro (zugleich Kategorieseite „Prozent & Rabatt“)
    slug: 'prozent-rechner',
    href: '/prozent-rechner/',
    name: 'Prozentrechner',
    description: 'Prozentwert, Prozentsatz, Grundwert, prozentuale Veränderung und Auf-/Abschlag berechnen – mit Rechenweg.',
    category: 'prozent-rechner',
    alsoIn: [],
    keywords: ['prozent', 'prozentrechner', 'prozentrechnung', 'prozentsatz', 'prozentwert', 'grundwert', 'prozentuale veränderung', 'prozentpunkte', 'aufschlag', 'abschlag', 'dreisatz'],
    icon: 'percent',
    related: ['rabatt-rechner', 'umsatzsteuer-rechner', 'gewinnmarge-rechner', 'roi-rechner'],
    ogFormula: 'Prozentwert = Grundwert × Prozentsatz ÷ 100',
    featured: true,
    popular: true,
    popularRank: 1,
    added: '2026-11-25',
  },
];

export function getCalculator(slug: string): CalculatorMeta {
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) throw new Error(`Unbekannter Rechner: ${slug}`);
  return calc;
}

export function calculatorsInCategory(id: CategoryId): CalculatorMeta[] {
  return calculators.filter((c) => c.category === id || c.alsoIn.includes(id));
}

/** Kompakter Suchindex für die clientseitige Suche */
export function buildSearchIndex() {
  return calculators.map((c) => ({
    n: c.name,
    d: c.description,
    h: c.href,
    k: c.keywords.join(' '),
    c: getCategory(c.category).name,
  }));
}
