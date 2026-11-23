/**
 * Zentrale Website-Konfiguration.
 *
 * WICHTIG: Alle Angaben in `owner` müssen vom Seitenbetreiber ausgefüllt werden.
 * Solange ein Wert mit "[" beginnt, wird er auf der Website als gelb markierter
 * Platzhalter dargestellt (siehe Komponente OwnerField.astro).
 */
export const site = {
  name: 'QuickRechner',
  domain: 'quickrechner.de',
  url: 'https://quickrechner.de',
  locale: 'de-DE',
  lang: 'de',
  tagline: 'Finanzen einfach berechnen',
  description:
    'Kostenlose Online-Rechner für Kredite, Sparen, Investitionen, Steuern und Unternehmen – mit verständlichen Erklärungen, Formeln und Beispielen.',
  themeColor: '#BFE3FF',
  ogImage: '/og-default.png',
  /** Stand der redaktionellen Inhalte (ISO-Datum) */
  contentUpdated: '2026-11-22',
  owner: {
    name: '[Vor- und Nachname bzw. Firmenname]',
    street: '[Straße und Hausnummer]',
    zipCity: '[PLZ Ort]',
    country: 'Deutschland',
    email: '[E-Mail-Adresse]',
    phone: '[Telefonnummer (optional, aber empfohlen)]',
    responsibleContent: '[Name der inhaltlich verantwortlichen Person]',
    vatId: '[USt-IdNr. – nur falls vorhanden, sonst Zeile entfernen]',
    supervisoryAuthority: '[Zuständige Datenschutz-Aufsichtsbehörde Ihres Bundeslandes]',
  },
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith('[');
}
