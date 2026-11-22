/**
 * Zentrale Schalter für Werbung. Standard: alles AUS.
 *
 * Anzeigen werden nur ausgeliefert, wenn ALLE Bedingungen erfüllt sind:
 *  - Produktions-Build (nicht `npm run dev`)
 *  - PUBLIC_ADS_ENABLED=true
 *  - PUBLIC_ADSENSE_CLIENT ist gesetzt (ca-pub-…)
 *
 * Hinweis: Für personalisierte Werbung in der EU ist eine zertifizierte Consent-Management-Plattform
 * (CMP) erforderlich. Vor dem Aktivieren Datenschutzerklärung und Einwilligungsbanner ergänzen!
 */
const env = import.meta.env;

export const adsenseClient: string = (env.PUBLIC_ADSENSE_CLIENT ?? '').trim();
export const adsEnabled: boolean = env.PROD && env.PUBLIC_ADS_ENABLED === 'true' && /^ca-pub-\d+$/.test(adsenseClient);
/** Gestrichelte Platzhalter zur Layoutplanung (nie gleichzeitig mit echten Anzeigen) */
export const showAdPlaceholders: boolean = !adsEnabled && env.PUBLIC_SHOW_AD_PLACEHOLDERS === 'true';
