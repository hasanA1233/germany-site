# QuickRechner.de

QuickRechner is a free German website of finance and business calculators. It's built with **Astro**, **TypeScript** and **Tailwind CSS**. The site is fully static: no backend, no database, no API keys. It's designed to be hosted on **Cloudflare Pages**.

- 10 working calculators: Kredit, Tilgung, Zinseszins, Sparplan, Umsatzsteuer, Gewinn, Gewinnmarge, ROI, Break-Even and Rabatt
- 6 category pages, a homepage with live search, and legal/info pages
- Every calculation runs in the visitor's browser. Inputs are never sent to a server.

## Requirements

- Node.js **22.18+** (or 23.6+ / 24.x). `npm test` uses Node's built-in TypeScript support.
- npm

## Local development

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:4321
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests for all calculation logic (`tests/`) |
| `npm run check` | TypeScript and Astro type check |
| `npm run audit` | Checks `dist/` for broken links, duplicate titles, canonicals and JSON-LD (run after `build`) |
| `npm run images` | Regenerates favicons, the logo and the OG image in `public/` |

Recommended before each release: `npm test && npm run check && npm run build && npm run audit`

## Project structure

```
src/
  components/
    calculator/      Reusable calculator building blocks (Shell, NumberField, ChoiceField, results, table, chart)
    calculators/     The 10 calculators (markup + small client script each)
    layout/          Header, Footer, Breadcrumbs, CategoryPage
    ui/              Icon, Logo, SearchBox, CalculatorCard, FaqList, RelatedCalculators, OwnerField
    ads/             AdSlot, AdPlaceholder, ads-config.ts (everything OFF by default)
    affiliate/       AffiliateBox (optional, labeled, rel="sponsored nofollow")
  content/rechner/   German article content per calculator (Markdown, filename = URL slug)
  data/              site.ts (site and owner details), categories.ts, calculators.ts (central registry)
  layouts/           BaseLayout (SEO head, JSON-LD), ProseLayout
  lib/calc/          Pure calculation functions (framework-free, tested)
  lib/format.ts      German number/currency formatting and input parsing
  scripts/           Browser runtime for calculators, SVG charts
  pages/             Routes ([slug].astro renders all calculator pages)
tests/               Unit tests (node:test)
scripts/             Image generation, build audit
public/              robots.txt, _headers (Cloudflare), favicons, OG image
```

### Adding a new calculator

1. Write the logic in `src/lib/calc/` and add tests in `tests/`.
2. Build the component in `src/components/calculators/` from the shared building blocks. Form field `name`s must match the keys in the calculation function's error object.
3. Register it in `src/data/calculators.ts` (name, category, keywords, related calculators).
4. Add the article in `src/content/rechner/<slug>.md`.
5. Add the component to the `components` map in `src/pages/[slug].astro`.

The search, navigation, footer, category pages, sitemap and the page's **share image** (`/og/<slug>.png`, generated at build time from the article title, category and `ogFormula` in `src/lib/og-image.ts`) update automatically.

## Before going live: required owner details

Fill in every value in square brackets in **`src/data/site.ts`** (`owner`): name, address, email, and so on. Until you do, these values appear highlighted in yellow on the site. Also check:

- `src/pages/impressum.astro`: imprint template (§ 5 DDG)
- `src/pages/datenschutz.astro`: privacy policy template (fill in the placeholders on Cloudflare DPA and data transfers, and the date)
- `src/pages/about.astro`: "Wer hinter QuickRechner steht" section

> The legal pages are templates, not legal advice. Have them reviewed before launch.

## Ads (Google AdSense), optional

Ads are **off** by default and never appear in development. To enable them:

1. Copy `.env.example` to `.env`, or set the same variables in Cloudflare Pages under *Settings → Environment variables*:
   ```
   PUBLIC_ADS_ENABLED=true
   PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
2. Pass the ad unit ID to the `<AdSlot placement="…" slot="1234567890" />` components. Placements already exist after the results, in the sidebar and before related calculators in `src/pages/[slug].astro`.
3. **Required in the EU:** add a certified consent management platform (CMP) and extend the privacy policy.

`PUBLIC_SHOW_AD_PLACEHOLDERS=true` shows dashed placeholder boxes for layout planning only.

## Publishing on GitHub

```bash
git init
git add .
git commit -m "Initial commit: QuickRechner.de"
git branch -M main
git remote add origin https://github.com/<your-account>/quickrechner.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `dist/`, `.astro/` and `.env` files.

## Deploying to Cloudflare Pages

1. **Create a GitHub repository** and push the code (see above).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. **Connect your GitHub account** and grant access to the repository.
4. **Select the repository** `quickrechner`.
5. **Configure the build:**
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable (recommended): `NODE_VERSION` = `22` (or higher)
6. Click **Save and Deploy**. Cloudflare builds the site and publishes it at `<project>.pages.dev`. Every push to `main` triggers a new deploy, and pull requests get preview URLs.
7. **Connect quickrechner.de:** in the Pages project, go to **Custom domains → Set up a custom domain**, enter `quickrechner.de`, then repeat for `www.quickrechner.de`.
8. **Configure DNS:**
   - If the domain is managed in Cloudflare, Cloudflare creates the CNAME records automatically.
   - If it's with another registrar, either move the nameservers to Cloudflare (recommended) or create a `CNAME` record for `www` pointing to `<project>.pages.dev`. The apex domain normally requires Cloudflare nameservers.
   - Optionally redirect `www` to the apex domain (Bulk Redirects or a Redirect Rule), because the canonical URLs use `https://quickrechner.de`.
9. **Verify SSL:** Cloudflare issues the certificate automatically, which can take a few minutes. Check that `https://quickrechner.de` loads without warnings, and enable **SSL/TLS → Edge Certificates → Always Use HTTPS**.
10. **After launch:** add the site to Google Search Console and submit `https://quickrechner.de/sitemap-index.xml`.

`public/_headers` sets security headers and long-term caching for hashed assets. Cloudflare Pages serves `404.html` automatically for unknown URLs.

## Calculation conventions

- German formatting via `Intl.NumberFormat('de-DE')`. Input accepts `25.000`, `3,5` and `3.5`.
- Loans: nominal interest rate ÷ 12, annuity payment at month end, extra repayments at the end of each year.
- Compound interest: deposits at month end, yearly (pro-rata) or monthly interest crediting.
- Savings plan: deposits at month start, equivalent monthly rate (1 + p)^(1/12) − 1, no costs or taxes.
- VAT and discounts: amounts rounded commercially to the cent.
