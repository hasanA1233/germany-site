interface ImportMetaEnv {
  readonly PUBLIC_ADS_ENABLED?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_SHOW_AD_PLACEHOLDERS?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface Window {
  adsbygoogle?: unknown[];
}
