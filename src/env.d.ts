interface ImportMetaEnv {
  readonly PUBLIC_ADS_ENABLED?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_SHOW_AD_PLACEHOLDERS?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_GA_DISABLED?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface Window {
  adsbygoogle?: unknown[];
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
