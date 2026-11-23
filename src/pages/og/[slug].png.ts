/**
 * Statische Vorschaubilder je Rechnerseite: /og/<slug>.png
 * Werden beim Build aus Artikel-H1, Kategorie, Symbol und Kernformel erzeugt.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCalculator } from '../../data/calculators';
import { getCategory } from '../../data/categories';
import { ogPng } from '../../lib/og-image';

export async function getStaticPaths() {
  const entries = await getCollection('rechner');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { title: entry.data.h1 } }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const calc = getCalculator(params.slug!);
  const category = getCategory(calc.category);
  const png = await ogPng({
    title: props.title as string,
    category: category.name,
    formula: calc.ogFormula,
    icon: category.icon,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
