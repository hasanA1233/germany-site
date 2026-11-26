/**
 * Google Analytics 4 – aktiv im Produktions-Build (nicht bei `npm run dev`).
 * Mess-ID: PUBLIC_GA_MEASUREMENT_ID (Umgebungsvariable) oder Standard unten. Leerer String in der Variable
 * schaltet Analytics nicht ab – dafür PUBLIC_GA_DISABLED=true setzen.
 *
 * Auch im Produktions-Build wird gtag.js erst nach ausdrücklicher Einwilligung („Statistik“) im Cookie-Banner geladen
 * (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Vorher gelten die Consent-Mode-v2-Standardwerte „denied“.
 */
const env = import.meta.env;

/** Mess-ID der GA4-Property von QuickRechner (öffentlich, kein Geheimnis) */
const DEFAULT_GA_ID = 'G-Q8SCZNB41N';

export const gaMeasurementId: string = ((env.PUBLIC_GA_MEASUREMENT_ID ?? '').trim() || DEFAULT_GA_ID).toUpperCase();
export const analyticsEnabled: boolean = env.PROD && env.PUBLIC_GA_DISABLED !== 'true' && /^G-[A-Z0-9]{4,}$/.test(gaMeasurementId);

/** Speicherschlüssel und Version der Einwilligung – Version erhöhen, um alle erneut zu fragen */
export const CONSENT_KEY = 'qr-consent';
/** v2: Kategorien Statistik/Marketing statt einer einzigen Ja/Nein-Entscheidung */
export const CONSENT_VERSION = 2;
