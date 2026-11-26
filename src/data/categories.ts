export type CategoryId = 'kredit' | 'sparen-investieren' | 'business' | 'gehalt-steuern' | 'prozent-rechner';

export interface Category {
  id: CategoryId;
  /** URL-Pfad mit führendem und abschließendem Slash */
  href: string;
  name: string;
  /** Kurzname für die Navigation */
  navLabel: string;
  short: string;
  seoTitle: string;
  metaDescription: string;
  icon: IconName;
}

export type IconName =
  | 'loan'
  | 'growth'
  | 'piggy'
  | 'table'
  | 'receipt'
  | 'profit'
  | 'margin'
  | 'roi'
  | 'breakeven'
  | 'discount'
  | 'briefcase'
  | 'percent'
  | 'calculator'
  | 'tax'
  | 'student'
  | 'building'
  | 'dreisatz'
  | 'clock';

export const categories: Category[] = [
  {
    id: 'kredit',
    href: '/kredit/',
    name: 'Kredit & Finanzierung',
    navLabel: 'Kredit & Finanzierung',
    short: 'Monatsraten, Zinskosten und Tilgungspläne für Ratenkredite und Baufinanzierungen.',
    seoTitle: 'Kreditrechner – Rate, Zinsen & Tilgung berechnen',
    metaDescription:
      'Kredit- und Finanzierungsrechner: Monatsrate, Zinskosten, Restschuld und Tilgungsplan kostenlos berechnen – mit Formeln und Beispielen.',
    icon: 'loan',
  },
  {
    id: 'sparen-investieren',
    href: '/sparen-investieren/',
    name: 'Sparen & Investieren',
    navLabel: 'Sparen & Investieren',
    short: 'Zinseszins, Sparpläne und Renditen verständlich durchrechnen.',
    seoTitle: 'Spar- & Anlagerechner – Zinseszins, Sparplan, ROI',
    metaDescription:
      'Rechner für Sparen und Investieren: Zinseszins, Sparplan und Rendite (ROI) berechnen. Mit Erklärungen, Annahmen und Rechenbeispielen.',
    icon: 'piggy',
  },
  {
    id: 'business',
    href: '/business/',
    name: 'Business',
    navLabel: 'Business',
    short: 'Gewinn, Marge, ROI, Break-Even und Umsatzsteuer für Selbstständige und Unternehmen.',
    seoTitle: 'Business-Rechner – Gewinn, Marge, ROI & Break-Even',
    metaDescription:
      'Kostenlose Business-Rechner für Selbstständige und Unternehmen: Gewinn, Gewinnmarge, ROI, Break-Even-Punkt und Umsatzsteuer berechnen.',
    icon: 'briefcase',
  },
  {
    id: 'gehalt-steuern',
    href: '/gehalt-steuern/',
    name: 'Gehalt & Steuern',
    navLabel: 'Gehalt & Steuern',
    short: 'Nettolohn für Werkstudenten berechnen und Mehrwertsteuer zwischen netto und brutto umrechnen.',
    seoTitle: 'Gehalts- & Steuerrechner 2026 – Netto & MwSt',
    metaDescription:
      'Gehalts- und Steuerrechner 2026: Werkstudent brutto netto mit Lohnsteuer nach BMF-Programmablaufplan sowie MwSt netto zu brutto mit 19 % oder 7 %.',
    icon: 'tax',
  },
  {
    id: 'prozent-rechner',
    href: '/prozent-rechner/',
    name: 'Prozent & Rabatt',
    navLabel: 'Prozent & Rabatt',
    short: 'Rabatte, Preisnachlässe und prozentuale Anteile schnell berechnen.',
    seoTitle: 'Prozentrechner – Rabatt & Prozentwerte berechnen',
    metaDescription:
      'Prozentrechner für den Alltag und das Business: Rabatt, Preisnachlass, Gewinnmarge, Umsatzsteuer und Rendite in Prozent berechnen.',
    icon: 'percent',
  },
];

export function getCategory(id: CategoryId): Category {
  const cat = categories.find((c) => c.id === id);
  if (!cat) throw new Error(`Unbekannte Kategorie: ${id}`);
  return cat;
}
