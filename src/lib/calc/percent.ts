/**
 * Prozentrechnung: Prozentwert, Prozentsatz, Grundwert, prozentuale Veränderung, Auf-/Abschlag.
 * Begriffe: Grundwert G (das Ganze), Prozentsatz p (in %), Prozentwert W (der Anteil).
 */

export type Errors = Record<string, string>;
export type Result<T> = ({ ok: true } & T) | { ok: false; errors: Errors };

export type PercentMode = 'prozentwert' | 'prozentsatz' | 'grundwert' | 'veraenderung' | 'aufschlag';

export interface PercentInput {
  mode: PercentMode;
  /** Prozentsatz in % (Modi prozentwert, grundwert, aufschlag) */
  p?: number;
  /** Grundwert (Modi prozentwert, prozentsatz, aufschlag) */
  g?: number;
  /** Prozentwert (Modi prozentsatz, grundwert) */
  w?: number;
  /** Alter und neuer Wert (Modus veraenderung) */
  a?: number;
  b?: number;
  /** Aufschlag (+) oder Abschlag (−) */
  richtung?: 'plus' | 'minus';
}

export interface PercentOutput {
  mode: PercentMode;
  /** Hauptergebnis */
  value: number;
  /** true, wenn das Hauptergebnis ein Prozentsatz ist */
  isPercent: boolean;
  /** Nebenwerte (z. B. Differenz beim Auf-/Abschlag oder bei der Veränderung) */
  diff?: number;
  inputs: Required<Pick<PercentInput, 'mode'>> & Omit<PercentInput, 'mode'>;
}

const MAX = 1e15;

function need(errors: Errors, key: string, v: number | undefined, opts: { nonZero?: boolean; min?: number } = {}) {
  if (v === undefined || !Number.isFinite(v)) errors[key] = 'Bitte geben Sie eine Zahl ein.';
  else if (Math.abs(v) > MAX) errors[key] = 'Der Wert ist zu groß.';
  else if (opts.nonZero && v === 0) errors[key] = 'Der Wert darf nicht 0 sein.';
  else if (opts.min !== undefined && v < opts.min) errors[key] = `Bitte geben Sie mindestens ${opts.min} ein.`;
}

export function calculatePercent(i: PercentInput): Result<PercentOutput> {
  const e: Errors = {};
  switch (i.mode) {
    case 'prozentwert': {
      need(e, 'p', i.p);
      need(e, 'g', i.g);
      if (Object.keys(e).length) return { ok: false, errors: e };
      return { ok: true, mode: i.mode, value: (i.g! * i.p!) / 100, isPercent: false, inputs: i };
    }
    case 'prozentsatz': {
      need(e, 'w', i.w);
      need(e, 'g', i.g, { nonZero: true });
      if (Object.keys(e).length) return { ok: false, errors: e };
      return { ok: true, mode: i.mode, value: (i.w! / i.g!) * 100, isPercent: true, inputs: i };
    }
    case 'grundwert': {
      need(e, 'w', i.w);
      need(e, 'p', i.p, { nonZero: true });
      if (Object.keys(e).length) return { ok: false, errors: e };
      return { ok: true, mode: i.mode, value: (i.w! * 100) / i.p!, isPercent: false, inputs: i };
    }
    case 'veraenderung': {
      need(e, 'a', i.a, { nonZero: true });
      need(e, 'b', i.b);
      if (Object.keys(e).length) return { ok: false, errors: e };
      const diff = i.b! - i.a!;
      // Bezug auf den Betrag des Ausgangswerts, damit das Vorzeichen die Richtung angibt
      return { ok: true, mode: i.mode, value: (diff / Math.abs(i.a!)) * 100, isPercent: true, diff, inputs: i };
    }
    case 'aufschlag': {
      need(e, 'g', i.g);
      need(e, 'p', i.p, { min: 0 });
      if (Object.keys(e).length) return { ok: false, errors: e };
      const diff = ((i.richtung === 'minus' ? -1 : 1) * i.g! * i.p!) / 100;
      return { ok: true, mode: i.mode, value: i.g! + diff, isPercent: false, diff, inputs: i };
    }
  }
}
