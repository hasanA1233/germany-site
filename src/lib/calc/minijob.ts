/**
 * Minijob 2026: Verdienst, Grenze (603 €), Netto des Minijobbers und Kosten des Arbeitgebers.
 * Annahme: Der Arbeitgeber trägt die einheitliche Pauschsteuer von 2 % (üblich).
 */
import { steuer2026 } from '../../data/steuer-2026.ts';
import { minijob2026 } from '../../data/minijob-2026.ts';

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export interface MinijobInput {
  stundenlohn: number;
  /** Stunden pro Monat; undefined = nur maximale Stunden berechnen */
  stundenProMonat?: number;
  arbeitgeber: 'gewerbe' | 'haushalt';
  rvBefreit: boolean;
  /** Minijobber gesetzlich krankenversichert (sonst kein KV-Pauschalbeitrag) */
  gesetzlichVersichert: boolean;
}

export interface MinijobOutput {
  verdienst: number;
  grenze: number;
  /** maximale Stunden pro Monat bei diesem Stundenlohn */
  maxStunden: number;
  status: 'minijob' | 'ueberschritten';
  unterMindestlohn: boolean;
  rvEigenanteil: number;
  netto: number;
  arbeitgeber: { kv: number; rv: number; steuer: number; umlagen: number; unfall: number | null; summe: number; gesamtkosten: number };
}

const rc = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

export function calculateMinijob(i: MinijobInput): Result<MinijobOutput> {
  const e: Errors = {};
  if (!Number.isFinite(i.stundenlohn) || i.stundenlohn <= 0 || i.stundenlohn > 500) e.stundenlohn = 'Bitte geben Sie einen Stundenlohn zwischen 0,01 € und 500 € ein.';
  if (i.stundenProMonat !== undefined && (!Number.isFinite(i.stundenProMonat) || i.stundenProMonat <= 0 || i.stundenProMonat > 300))
    e.stunden = 'Bitte geben Sie 1 bis 300 Stunden pro Monat ein.';
  if (Object.keys(e).length) return { ok: false, errors: e };

  const grenze = steuer2026.minijobGrenze;
  // Ohne Stundenangabe: Verdienst bis zur Grenze
  const maxStunden = Math.floor((grenze / i.stundenlohn) * 100) / 100;
  const verdienst = rc(i.stundenProMonat !== undefined ? i.stundenlohn * i.stundenProMonat : Math.min(grenze, i.stundenlohn * maxStunden));
  const a = minijob2026[i.arbeitgeber];
  const rvEigenanteil = i.rvBefreit ? 0 : rc((verdienst * a.rvEigenanteil) / 100);
  const kv = i.gesetzlichVersichert ? rc((verdienst * a.kv) / 100) : 0;
  const rv = rc((verdienst * a.rvArbeitgeber) / 100);
  const steuer = rc((verdienst * a.pauschsteuer) / 100);
  const umlagen = rc((verdienst * (a.u1 + a.u2 + a.insolvenzgeldumlage)) / 100);
  const unfall = a.unfallversicherung === null ? null : rc((verdienst * a.unfallversicherung) / 100);
  const summe = rc(kv + rv + steuer + umlagen + (unfall ?? 0));
  return {
    ok: true,
    verdienst,
    grenze,
    maxStunden,
    status: verdienst > grenze ? 'ueberschritten' : 'minijob',
    unterMindestlohn: i.stundenlohn < steuer2026.mindestlohn - 1e-9,
    rvEigenanteil,
    netto: rc(verdienst - rvEigenanteil),
    arbeitgeber: { kv, rv, steuer, umlagen, unfall, summe, gesamtkosten: rc(verdienst + summe) },
  };
}
