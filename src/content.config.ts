import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isNotInFuture, todayBerlin } from './lib/dates';

/**
 * Ratgeber-Inhalte zu jedem Rechner. Dateiname = URL-Slug des Rechners.
 * Der Rechner selbst ist eine Komponente (siehe src/components/calculators),
 * der Text darunter kommt aus src/content/rechner/<slug>.md.
 */
const rechner = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/rechner' }),
  schema: z.object({
    /** <title> ohne Markenzusatz, ca. 50–60 Zeichen */
    seoTitle: z.string().max(70),
    /** Meta-Description, ca. 120–160 Zeichen */
    description: z.string().min(80).max(170),
    h1: z.string(),
    /** Einleitung direkt unter der H1 */
    intro: z.string(),
    /** Veröffentlichungs-/Aktualisierungsdatum – darf nicht in der Zukunft liegen (deutsche Zeit) */
    updated: z.coerce.date().refine((d) => isNotInFuture(d.toISOString()), { message: `Datum liegt in der Zukunft (heute in Berlin: ${todayBerlin()})` }),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    /** Optionales Hero-Bild: Dateiname ohne Endung in public/images/rechner/ (nur Desktop sichtbar) */
    hero: z.object({ file: z.string(), alt: z.string() }).optional(),
  }),
});

export const collections = { rechner };
