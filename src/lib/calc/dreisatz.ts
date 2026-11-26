/**
 * Dreisatz: proportional („je mehr, desto mehr“), antiproportional („je mehr, desto weniger“)
 * und zusammengesetzter Dreisatz mit zwei Einflussgrößen.
 *
 * Proportional:     A ≙ B  →  1 ≙ B ÷ A  →  C ≙ B ÷ A × C
 * Antiproportional: A ≙ B  →  1 ≙ B × A  →  C ≙ B × A ÷ C
 */

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };
export type Art = 'proportional' | 'antiproportional';

export interface DreisatzInput {
  art: Art;
  a: number;
  b: number;
  c: number;
}

export interface DreisatzOutput {
  art: Art;
  /** Wert für 1 Einheit (Zwischenschritt) */
  einheit: number;
  ergebnis: number;
}

const MAX = 1e15;
function check(e: Errors, key: string, v: number, nonZero = false) {
  if (!Number.isFinite(v)) e[key] = 'Bitte geben Sie eine Zahl ein.';
  else if (Math.abs(v) > MAX) e[key] = 'Der Wert ist zu groß.';
  else if (nonZero && v === 0) e[key] = 'Der Wert darf nicht 0 sein.';
}

export function calculateDreisatz({ art, a, b, c }: DreisatzInput): Result<DreisatzOutput> {
  const e: Errors = {};
  check(e, 'a', a, true);
  check(e, 'b', b);
  check(e, 'c', c, art === 'antiproportional');
  if (Object.keys(e).length) return { ok: false, errors: e };
  const einheit = art === 'proportional' ? b / a : b * a;
  const ergebnis = art === 'proportional' ? einheit * c : einheit / c;
  return { ok: true, art, einheit, ergebnis };
}

export interface ZusammengesetztInput {
  /** Ausgangslage: Größe 1, Größe 2, Ergebnis */
  a1: number;
  a2: number;
  b: number;
  /** Neue Lage: Größe 1, Größe 2 */
  c1: number;
  c2: number;
  art1: Art;
  art2: Art;
}

export interface ZusammengesetztOutput {
  /** Zwischenergebnis nach dem ersten Dreisatz (nur Größe 1 geändert) */
  zwischen: number;
  ergebnis: number;
}

/** Zwei Dreisätze hintereinander: zuerst Größe 1 ändern, dann Größe 2 */
export function calculateZusammengesetzt(i: ZusammengesetztInput): Result<ZusammengesetztOutput> {
  const e: Errors = {};
  check(e, 'za1', i.a1, true);
  check(e, 'za2', i.a2, true);
  check(e, 'zb', i.b);
  check(e, 'zc1', i.c1, i.art1 === 'antiproportional');
  check(e, 'zc2', i.c2, i.art2 === 'antiproportional');
  if (Object.keys(e).length) return { ok: false, errors: e };
  const f = (art: Art, alt: number, neu: number) => (art === 'proportional' ? neu / alt : alt / neu);
  const zwischen = i.b * f(i.art1, i.a1, i.c1);
  return { ok: true, zwischen, ergebnis: zwischen * f(i.art2, i.a2, i.c2) };
}
