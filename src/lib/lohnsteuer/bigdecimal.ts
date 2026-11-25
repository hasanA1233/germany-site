/**
 * Minimaler, exakter Dezimaltyp nach dem Vorbild von java.math.BigDecimal –
 * nur die Operationen, die der Programmablaufplan (PAP) des BMF verwendet.
 * Intern: unscaled (BigInt) × 10^-scale. Keine Gleitkomma-Rundungsfehler.
 */

const TEN = 10n;
const pow10 = (n: number): bigint => TEN ** BigInt(n);

export type RoundingMode = 'DOWN' | 'UP';

export class BigDecimal {
  static readonly ROUND_DOWN: RoundingMode = 'DOWN';
  static readonly ROUND_UP: RoundingMode = 'UP';
  static readonly ZERO = new BigDecimal(0n, 0);
  static readonly ONE = new BigDecimal(1n, 0);

  readonly unscaled: bigint;
  readonly scale: number;

  private constructor(unscaled: bigint, scale: number) {
    this.unscaled = unscaled;
    this.scale = scale;
  }

  /** Wie Java BigDecimal.valueOf(long|double): Dezimaldarstellung der Zahl */
  static valueOf(value: number | string): BigDecimal {
    let s = typeof value === 'number' ? numberToPlain(value) : value.trim();
    let neg = false;
    if (s.startsWith('-')) {
      neg = true;
      s = s.slice(1);
    }
    const [int, frac = ''] = s.split('.');
    // Java: valueOf(double) liefert mindestens eine Nachkommastelle („2.0“) – für Werte irrelevant
    const u = BigInt((int || '0') + frac);
    return new BigDecimal(neg ? -u : u, frac.length);
  }

  private align(o: BigDecimal): [bigint, bigint, number] {
    const s = Math.max(this.scale, o.scale);
    return [this.unscaled * pow10(s - this.scale), o.unscaled * pow10(s - o.scale), s];
  }

  add(o: BigDecimal): BigDecimal {
    const [a, b, s] = this.align(o);
    return new BigDecimal(a + b, s);
  }

  subtract(o: BigDecimal): BigDecimal {
    const [a, b, s] = this.align(o);
    return new BigDecimal(a - b, s);
  }

  multiply(o: BigDecimal): BigDecimal {
    return new BigDecimal(this.unscaled * o.unscaled, this.scale + o.scale);
  }

  /**
   * divide(o)               – exakte Division (wie Java; bei unendlichem Dezimalbruch 34 Stellen)
   * divide(o, scale, mode)  – Ergebnis mit fester Nachkommastellenzahl und Rundungsart
   */
  divide(o: BigDecimal, scale?: number, mode: RoundingMode = 'DOWN'): BigDecimal {
    if (o.unscaled === 0n) throw new RangeError('Division durch 0');
    if (scale !== undefined) return divideToScale(this, o, scale, mode);
    // Exakte Division: kleinste Nachkommastellenzahl ohne Rest suchen
    const preferred = Math.max(this.scale - o.scale, 0);
    for (let s = preferred; s <= preferred + 34; s++) {
      const r = divideToScale(this, o, s, 'DOWN');
      if (r.multiply(o).compareTo(this) === 0) return r;
    }
    return divideToScale(this, o, preferred + 34, 'DOWN');
  }

  setScale(scale: number, mode: RoundingMode): BigDecimal {
    if (scale >= this.scale) return new BigDecimal(this.unscaled * pow10(scale - this.scale), scale);
    const d = pow10(this.scale - scale);
    return new BigDecimal(roundQuotient(this.unscaled, d, mode), scale);
  }

  compareTo(o: BigDecimal): -1 | 0 | 1 {
    const [a, b] = this.align(o);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /** Ganzzahliger Anteil (Richtung 0), wie Java longValue() */
  longValue(): number {
    return Number(this.unscaled / pow10(this.scale));
  }

  toNumber(): number {
    return Number(this.toString());
  }

  toString(): string {
    const neg = this.unscaled < 0n;
    let digits = (neg ? -this.unscaled : this.unscaled).toString();
    if (this.scale === 0) return (neg ? '-' : '') + digits;
    digits = digits.padStart(this.scale + 1, '0');
    return `${neg ? '-' : ''}${digits.slice(0, -this.scale)}.${digits.slice(-this.scale)}`;
  }
}

/** Ganzzahlige Division mit Rundung: DOWN = Richtung 0, UP = weg von 0 (wie Java) */
function roundQuotient(n: bigint, d: bigint, mode: RoundingMode): bigint {
  const q = n / d; // BigInt-Division schneidet Richtung 0 ab
  if (mode === 'UP' && n % d !== 0n) return (n < 0n) !== (d < 0n) ? q - 1n : q + 1n;
  return q;
}

function divideToScale(a: BigDecimal, b: BigDecimal, scale: number, mode: RoundingMode): BigDecimal {
  // a/b = (ua·10^-sa)/(ub·10^-sb); Ergebnis u·10^-scale → u = ua·10^(scale+sb-sa) / ub
  const shift = scale + b.scale - a.scale;
  const n = shift >= 0 ? a.unscaled * pow10(shift) : a.unscaled;
  const d = shift >= 0 ? b.unscaled : b.unscaled * pow10(-shift);
  return BigDecimal.valueOf(0).add(fromUnscaled(roundQuotient(n, d, mode), scale));
}

function fromUnscaled(u: bigint, scale: number): BigDecimal {
  const s = u.toString();
  const neg = s.startsWith('-');
  const digits = (neg ? s.slice(1) : s).padStart(scale + 1, '0');
  return BigDecimal.valueOf(`${neg ? '-' : ''}${scale ? `${digits.slice(0, -scale)}.${digits.slice(-scale)}` : digits}`);
}

/** Zahl ohne Exponentialschreibweise (Java Double.toString-Äquivalent für unsere Wertebereiche) */
function numberToPlain(n: number): string {
  if (!Number.isFinite(n)) throw new RangeError(`Ungültige Zahl: ${n}`);
  const s = String(n);
  if (!/e/i.test(s)) return s;
  return n.toFixed(20).replace(/\.?0+$/, '');
}
