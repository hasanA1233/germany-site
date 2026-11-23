/**
 * Google Analytics 4 – nur aktiv, wenn:
 *  - Produktions-Build (nicht `npm run dev`)
 *  - PUBLIC_GA_MEASUREMENT_ID gesetzt ist (Format G-XXXXXXXXXX)
 *
 * Auch dann wird Google Analytics erst nach ausdrücklicher Einwilligung im Cookie-Banner geladen
 * (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
 */
const env = import.meta.env;

export const gaMeasurementId: string = (env.PUBLIC_GA_MEASUREMENT_ID ?? '').trim().toUpperCase();
export const analyticsEnabled: boolean = env.PROD && /^G-[A-Z0-9]{4,}$/.test(gaMeasurementId);

/** Speicherschlüssel und Version der Einwilligung – Version erhöhen, um alle erneut zu fragen */
export const CONSENT_KEY = 'qr-consent';
export const CONSENT_VERSION = 1;
