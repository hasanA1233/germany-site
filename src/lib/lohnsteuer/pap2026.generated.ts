// AUTOMATISCH ERZEUGT von scripts/generate-lohnsteuer.mjs – NICHT VON HAND ÄNDERN.
// Quelle: BMF, XML-Pseudocode Programmablaufplan Lohnsteuer 2026 (scripts/data/Lohnsteuer2026.xml),
// https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml
/* eslint-disable */
import { BigDecimal } from './bigdecimal.ts';

export class Lohnsteuer2026 {
  /** INPUT */ af: number = 1;
  /** INPUT */ AJAHR: number = 0;
  /** INPUT */ ALTER1: number = 0;
  /** INPUT */ ALV: number = 0;
  /** INPUT */ f: number = 1.0;
  /** INPUT */ JFREIB: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ JHINZU: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ JRE4: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ JRE4ENT: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ JVBEZ: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ KRV: number = 0;
  /** INPUT */ KVZ: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ LZZ: number = 1;
  /** INPUT */ LZZFREIB: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ LZZHINZU: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ MBV: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ PKPV: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ PKPVAGZ: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ PKV: number = 0;
  /** INPUT */ PVA: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ PVS: number = 0;
  /** INPUT */ PVZ: number = 0;
  /** INPUT */ R: number = 0;
  /** INPUT */ RE4: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ SONSTB: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ SONSTENT: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ STERBE: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ STKL: number = 1;
  /** INPUT */ VBEZ: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ VBEZM: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ VBEZS: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ VBS: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ VJAHR: number = 0;
  /** INPUT */ ZKF: BigDecimal = BigDecimal.ZERO;
  /** INPUT */ ZMVB: number = 0;
  /** OUTPUT */ BK: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ BKS: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ LSTLZZ: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ SOLZLZZ: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ SOLZS: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ STS: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ VFRB: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ VFRBS1: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ VFRBS2: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ WVFRB: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ WVFRBO: BigDecimal = BigDecimal.ZERO;
  /** OUTPUT */ WVFRBM: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ALTE: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ANP: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ANTEIL1: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ AVSATZAN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ BBGKVPV: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ BBGRVALV: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ BMG: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ DIFF: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ EFA: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ FVB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ FVBSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ FVBZ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ FVBZSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ GFB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ HBALTE: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ HFVB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ HFVBZ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ HFVBZSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ HOCH: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ J: number = 0;
  /** INTERNAL */ JBMG: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ JLFREIB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ JLHINZU: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ JW: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ K: number = 0;
  /** INTERNAL */ KFB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ KVSATZAN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ KZTAB: number = 0;
  /** INTERNAL */ LSTJAHR: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ LSTOSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ LSTSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ MIST: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ PKPVAGZJ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ PVSATZAN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ RVSATZAN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ RW: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SAP: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SOLZFREI: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SOLZJ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SOLZMIN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SOLZSBMG: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ SOLZSZVE: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ST: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ST1: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ST2: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VBEZB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VBEZBSO: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VERGL: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSPHB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSP: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSPN: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSPALV: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSPKVPV: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ VSPR: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ W1STKL5: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ W2STKL5: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ W3STKL5: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ X: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ Y: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZRE4: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZRE4J: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZRE4VP: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZRE4VPR: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZTABFB: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZVBEZ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZVBEZJ: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZVE: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZX: BigDecimal = BigDecimal.ZERO;
  /** INTERNAL */ ZZX: BigDecimal = BigDecimal.ZERO;

  readonly TAB1: BigDecimal[] = [BigDecimal.ZERO, BigDecimal.valueOf( 0.4), BigDecimal.valueOf( 0.384), BigDecimal.valueOf( 0.368), BigDecimal.valueOf( 0.352), BigDecimal.valueOf( 0.336), BigDecimal.valueOf( 0.32), BigDecimal.valueOf( 0.304), BigDecimal.valueOf( 0.288), BigDecimal.valueOf( 0.272), BigDecimal.valueOf( 0.256), BigDecimal.valueOf( 0.24), BigDecimal.valueOf( 0.224), BigDecimal.valueOf( 0.208), BigDecimal.valueOf( 0.192), BigDecimal.valueOf( 0.176), BigDecimal.valueOf( 0.16), BigDecimal.valueOf( 0.152), BigDecimal.valueOf( 0.144), BigDecimal.valueOf( 0.14), BigDecimal.valueOf( 0.136), BigDecimal.valueOf( 0.132), BigDecimal.valueOf( 0.128), BigDecimal.valueOf( 0.124), BigDecimal.valueOf( 0.12), BigDecimal.valueOf( 0.116), BigDecimal.valueOf( 0.112), BigDecimal.valueOf( 0.108), BigDecimal.valueOf( 0.104), BigDecimal.valueOf( 0.1), BigDecimal.valueOf( 0.096), BigDecimal.valueOf( 0.092), BigDecimal.valueOf( 0.088), BigDecimal.valueOf( 0.084), BigDecimal.valueOf( 0.08), BigDecimal.valueOf( 0.076), BigDecimal.valueOf( 0.072), BigDecimal.valueOf( 0.068), BigDecimal.valueOf( 0.064), BigDecimal.valueOf( 0.06), BigDecimal.valueOf( 0.056), BigDecimal.valueOf( 0.052), BigDecimal.valueOf( 0.048), BigDecimal.valueOf( 0.044), BigDecimal.valueOf( 0.04), BigDecimal.valueOf( 0.036), BigDecimal.valueOf( 0.032), BigDecimal.valueOf( 0.028), BigDecimal.valueOf( 0.024), BigDecimal.valueOf( 0.02), BigDecimal.valueOf( 0.016), BigDecimal.valueOf( 0.012), BigDecimal.valueOf( 0.008), BigDecimal.valueOf( 0.004), BigDecimal.valueOf( 0)];
  readonly TAB2: BigDecimal[] = [BigDecimal.ZERO, BigDecimal.valueOf( 3000), BigDecimal.valueOf( 2880), BigDecimal.valueOf( 2760), BigDecimal.valueOf( 2640), BigDecimal.valueOf( 2520), BigDecimal.valueOf( 2400), BigDecimal.valueOf( 2280), BigDecimal.valueOf( 2160), BigDecimal.valueOf( 2040), BigDecimal.valueOf( 1920), BigDecimal.valueOf( 1800), BigDecimal.valueOf( 1680), BigDecimal.valueOf( 1560), BigDecimal.valueOf( 1440), BigDecimal.valueOf( 1320), BigDecimal.valueOf( 1200), BigDecimal.valueOf( 1140), BigDecimal.valueOf( 1080), BigDecimal.valueOf( 1050), BigDecimal.valueOf( 1020), BigDecimal.valueOf( 990), BigDecimal.valueOf( 960), BigDecimal.valueOf( 930), BigDecimal.valueOf( 900), BigDecimal.valueOf( 870), BigDecimal.valueOf( 840), BigDecimal.valueOf( 810), BigDecimal.valueOf( 780), BigDecimal.valueOf( 750), BigDecimal.valueOf( 720), BigDecimal.valueOf( 690), BigDecimal.valueOf( 660), BigDecimal.valueOf( 630), BigDecimal.valueOf( 600), BigDecimal.valueOf( 570), BigDecimal.valueOf( 540), BigDecimal.valueOf( 510), BigDecimal.valueOf( 480), BigDecimal.valueOf( 450), BigDecimal.valueOf( 420), BigDecimal.valueOf( 390), BigDecimal.valueOf( 360), BigDecimal.valueOf( 330), BigDecimal.valueOf( 300), BigDecimal.valueOf( 270), BigDecimal.valueOf( 240), BigDecimal.valueOf( 210), BigDecimal.valueOf( 180), BigDecimal.valueOf( 150), BigDecimal.valueOf( 120), BigDecimal.valueOf( 90), BigDecimal.valueOf( 60), BigDecimal.valueOf( 30), BigDecimal.valueOf( 0)];
  readonly TAB3: BigDecimal[] = [BigDecimal.ZERO, BigDecimal.valueOf( 900), BigDecimal.valueOf( 864), BigDecimal.valueOf( 828), BigDecimal.valueOf( 792), BigDecimal.valueOf( 756), BigDecimal.valueOf( 720), BigDecimal.valueOf( 684), BigDecimal.valueOf( 648), BigDecimal.valueOf( 612), BigDecimal.valueOf( 576), BigDecimal.valueOf( 540), BigDecimal.valueOf( 504), BigDecimal.valueOf( 468), BigDecimal.valueOf( 432), BigDecimal.valueOf( 396), BigDecimal.valueOf( 360), BigDecimal.valueOf( 342), BigDecimal.valueOf( 324), BigDecimal.valueOf( 315), BigDecimal.valueOf( 306), BigDecimal.valueOf( 297), BigDecimal.valueOf( 288), BigDecimal.valueOf( 279), BigDecimal.valueOf( 270), BigDecimal.valueOf( 261), BigDecimal.valueOf( 252), BigDecimal.valueOf( 243), BigDecimal.valueOf( 234), BigDecimal.valueOf( 225), BigDecimal.valueOf( 216), BigDecimal.valueOf( 207), BigDecimal.valueOf( 198), BigDecimal.valueOf( 189), BigDecimal.valueOf( 180), BigDecimal.valueOf( 171), BigDecimal.valueOf( 162), BigDecimal.valueOf( 153), BigDecimal.valueOf( 144), BigDecimal.valueOf( 135), BigDecimal.valueOf( 126), BigDecimal.valueOf( 117), BigDecimal.valueOf( 108), BigDecimal.valueOf( 99), BigDecimal.valueOf( 90), BigDecimal.valueOf( 81), BigDecimal.valueOf( 72), BigDecimal.valueOf( 63), BigDecimal.valueOf( 54), BigDecimal.valueOf( 45), BigDecimal.valueOf( 36), BigDecimal.valueOf( 27), BigDecimal.valueOf( 18), BigDecimal.valueOf( 9), BigDecimal.valueOf( 0)];
  readonly TAB4: BigDecimal[] = [BigDecimal.ZERO, BigDecimal.valueOf( 0.4), BigDecimal.valueOf( 0.384), BigDecimal.valueOf( 0.368), BigDecimal.valueOf( 0.352), BigDecimal.valueOf( 0.336), BigDecimal.valueOf( 0.32), BigDecimal.valueOf( 0.304), BigDecimal.valueOf( 0.288), BigDecimal.valueOf( 0.272), BigDecimal.valueOf( 0.256), BigDecimal.valueOf( 0.24), BigDecimal.valueOf( 0.224), BigDecimal.valueOf( 0.208), BigDecimal.valueOf( 0.192), BigDecimal.valueOf( 0.176), BigDecimal.valueOf( 0.16), BigDecimal.valueOf( 0.152), BigDecimal.valueOf( 0.144), BigDecimal.valueOf( 0.14), BigDecimal.valueOf( 0.136), BigDecimal.valueOf( 0.132), BigDecimal.valueOf( 0.128), BigDecimal.valueOf( 0.124), BigDecimal.valueOf( 0.12), BigDecimal.valueOf( 0.116), BigDecimal.valueOf( 0.112), BigDecimal.valueOf( 0.108), BigDecimal.valueOf( 0.104), BigDecimal.valueOf( 0.1), BigDecimal.valueOf( 0.096), BigDecimal.valueOf( 0.092), BigDecimal.valueOf( 0.088), BigDecimal.valueOf( 0.084), BigDecimal.valueOf( 0.08), BigDecimal.valueOf( 0.076), BigDecimal.valueOf( 0.072), BigDecimal.valueOf( 0.068), BigDecimal.valueOf( 0.064), BigDecimal.valueOf( 0.06), BigDecimal.valueOf( 0.056), BigDecimal.valueOf( 0.052), BigDecimal.valueOf( 0.048), BigDecimal.valueOf( 0.044), BigDecimal.valueOf( 0.04), BigDecimal.valueOf( 0.036), BigDecimal.valueOf( 0.032), BigDecimal.valueOf( 0.028), BigDecimal.valueOf( 0.024), BigDecimal.valueOf( 0.02), BigDecimal.valueOf( 0.016), BigDecimal.valueOf( 0.012), BigDecimal.valueOf( 0.008), BigDecimal.valueOf( 0.004), BigDecimal.valueOf( 0)];
  readonly TAB5: BigDecimal[] = [BigDecimal.ZERO, BigDecimal.valueOf( 1900), BigDecimal.valueOf( 1824), BigDecimal.valueOf( 1748), BigDecimal.valueOf( 1672), BigDecimal.valueOf( 1596), BigDecimal.valueOf( 1520), BigDecimal.valueOf( 1444), BigDecimal.valueOf( 1368), BigDecimal.valueOf( 1292), BigDecimal.valueOf( 1216), BigDecimal.valueOf( 1140), BigDecimal.valueOf( 1064), BigDecimal.valueOf( 988), BigDecimal.valueOf( 912), BigDecimal.valueOf( 836), BigDecimal.valueOf( 760), BigDecimal.valueOf( 722), BigDecimal.valueOf( 684), BigDecimal.valueOf( 665), BigDecimal.valueOf( 646), BigDecimal.valueOf( 627), BigDecimal.valueOf( 608), BigDecimal.valueOf( 589), BigDecimal.valueOf( 570), BigDecimal.valueOf( 551), BigDecimal.valueOf( 532), BigDecimal.valueOf( 513), BigDecimal.valueOf( 494), BigDecimal.valueOf( 475), BigDecimal.valueOf( 456), BigDecimal.valueOf( 437), BigDecimal.valueOf( 418), BigDecimal.valueOf( 399), BigDecimal.valueOf( 380), BigDecimal.valueOf( 361), BigDecimal.valueOf( 342), BigDecimal.valueOf( 323), BigDecimal.valueOf( 304), BigDecimal.valueOf( 285), BigDecimal.valueOf( 266), BigDecimal.valueOf( 247), BigDecimal.valueOf( 228), BigDecimal.valueOf( 209), BigDecimal.valueOf( 190), BigDecimal.valueOf( 171), BigDecimal.valueOf( 152), BigDecimal.valueOf( 133), BigDecimal.valueOf( 114), BigDecimal.valueOf( 95), BigDecimal.valueOf( 76), BigDecimal.valueOf( 57), BigDecimal.valueOf( 38), BigDecimal.valueOf( 19), BigDecimal.valueOf( 0)];
  readonly ZAHL1: BigDecimal = BigDecimal.ONE;
  readonly ZAHL2: BigDecimal = BigDecimal.valueOf(2);
  readonly ZAHL5: BigDecimal = BigDecimal.valueOf(5);
  readonly ZAHL7: BigDecimal = BigDecimal.valueOf(7);
  readonly ZAHL12: BigDecimal = BigDecimal.valueOf(12);
  readonly ZAHL100: BigDecimal = BigDecimal.valueOf(100);
  readonly ZAHL360: BigDecimal = BigDecimal.valueOf(360);
  readonly ZAHL500: BigDecimal = BigDecimal.valueOf(500);
  readonly ZAHL700: BigDecimal = BigDecimal.valueOf(700);
  readonly ZAHL1000: BigDecimal = BigDecimal.valueOf(1000);
  readonly ZAHL10000: BigDecimal = BigDecimal.valueOf(10000);

  MAIN(): void {
    this.MPARA();
    this.MRE4JL();
    this.VBEZBSO = BigDecimal.ZERO;
    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();
    this.MSONST();
  }

  MPARA(): void {
    this.BBGRVALV = BigDecimal.valueOf(101400);
    this.AVSATZAN = BigDecimal.valueOf(0.013);
    this.RVSATZAN = BigDecimal.valueOf(0.093);
    this.BBGKVPV = BigDecimal.valueOf(69750);
    this.KVSATZAN = (this.KVZ.divide(this.ZAHL2).divide(this.ZAHL100)).add(BigDecimal.valueOf(0.07));
    if (this.PVS == 1) {
      this.PVSATZAN = BigDecimal.valueOf(0.023);
    } else {
      this.PVSATZAN = BigDecimal.valueOf(0.018);
    }
    if (this.PVZ == 1) {
      this.PVSATZAN = this.PVSATZAN.add(BigDecimal.valueOf(0.006));
    } else {
      this.PVSATZAN = this.PVSATZAN.subtract(this.PVA.multiply(BigDecimal.valueOf(0.0025)));
    }
    this.W1STKL5 = BigDecimal.valueOf(14071);
    this.W2STKL5 = BigDecimal.valueOf(34939);
    this.W3STKL5 = BigDecimal.valueOf(222260);
    this.GFB = BigDecimal.valueOf(12348);
    this.SOLZFREI = BigDecimal.valueOf(20350);
  }

  MRE4JL(): void {
    if (this.LZZ == 1) {
      this.ZRE4J = this.RE4.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    } else {
      if (this.LZZ == 2) {
        this.ZRE4J = (this.RE4.multiply (this.ZAHL12)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.ZVBEZJ = (this.VBEZ.multiply (this.ZAHL12)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.JLFREIB = (this.LZZFREIB.multiply (this.ZAHL12)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.JLHINZU = (this.LZZHINZU.multiply (this.ZAHL12)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
      } else {
        if (this.LZZ == 3) {
          this.ZRE4J = (this.RE4.multiply (this.ZAHL360)).divide (this.ZAHL700, 2, BigDecimal.ROUND_DOWN);
          this.ZVBEZJ = (this.VBEZ.multiply (this.ZAHL360)).divide (this.ZAHL700, 2, BigDecimal.ROUND_DOWN);
          this.JLFREIB = (this.LZZFREIB.multiply (this.ZAHL360)).divide (this.ZAHL700, 2, BigDecimal.ROUND_DOWN);
          this.JLHINZU = (this.LZZHINZU.multiply (this.ZAHL360)).divide (this.ZAHL700, 2, BigDecimal.ROUND_DOWN);
        } else {
          this.ZRE4J = (this.RE4.multiply (this.ZAHL360)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
          this.ZVBEZJ = (this.VBEZ.multiply (this.ZAHL360)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
          this.JLFREIB = (this.LZZFREIB.multiply (this.ZAHL360)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
          this.JLHINZU = (this.LZZHINZU.multiply (this.ZAHL360)).divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        }
      }
    }
    if (this.af == 0) {
      this.f = 1;
    }
  }

  MRE4(): void {
    if (this.ZVBEZJ.compareTo (BigDecimal.ZERO) == 0) {
      this.FVBZ = BigDecimal.ZERO;
      this.FVB = BigDecimal.ZERO;
      this.FVBZSO = BigDecimal.ZERO;
      this.FVBSO = BigDecimal.ZERO;
    } else {
      if (this.VJAHR < 2006) {
        this.J = 1;
      } else {
        if (this.VJAHR < 2058) {
          this.J = this.VJAHR - 2004;
        } else {
          this.J = 54;
        }
      }
      if (this.LZZ == 1) {
        this.VBEZB = (this.VBEZM.multiply (BigDecimal.valueOf(this.ZMVB))).add (this.VBEZS);
        this.HFVB = this.TAB2[this.J].divide (this.ZAHL12).multiply (BigDecimal.valueOf(this.ZMVB)).setScale (0, BigDecimal.ROUND_UP);
        this.FVBZ = this.TAB3[this.J].divide (this.ZAHL12).multiply (BigDecimal.valueOf(this.ZMVB)).setScale (0, BigDecimal.ROUND_UP);
      } else {
        this.VBEZB = ((this.VBEZM.multiply (this.ZAHL12)).add (this.VBEZS)).setScale (2, BigDecimal.ROUND_DOWN);
        this.HFVB = this.TAB2[this.J];
        this.FVBZ = this.TAB3[this.J];
      }
      this.FVB = ((this.VBEZB.multiply (this.TAB1[this.J]))).divide (this.ZAHL100).setScale (2, BigDecimal.ROUND_UP);
      if (this.FVB.compareTo (this.HFVB) == 1) {
        this.FVB = this.HFVB;
      }
      if (this.FVB.compareTo (this.ZVBEZJ) == 1) {
        this.FVB = this.ZVBEZJ;
      }
      this.FVBSO = (this.FVB.add((this.VBEZBSO.multiply (this.TAB1[this.J])).divide (this.ZAHL100))).setScale (2, BigDecimal.ROUND_UP);
      if (this.FVBSO.compareTo (this.TAB2[this.J]) == 1) {
        this.FVBSO = this.TAB2[this.J];
      }
      this.HFVBZSO = (((this.VBEZB.add(this.VBEZBSO)).divide (this.ZAHL100)).subtract (this.FVBSO)).setScale (2, BigDecimal.ROUND_DOWN);
      this.FVBZSO = (this.FVBZ.add((this.VBEZBSO).divide (this.ZAHL100))).setScale (0, BigDecimal.ROUND_UP);
      if (this.FVBZSO.compareTo (this.HFVBZSO) == 1) {
        this.FVBZSO = this.HFVBZSO.setScale(0, BigDecimal.ROUND_UP);
      }
      if (this.FVBZSO.compareTo (this.TAB3[this.J]) == 1) {
        this.FVBZSO = this.TAB3[this.J];
      }
      this.HFVBZ = ((this.VBEZB.divide (this.ZAHL100)).subtract (this.FVB)).setScale (2, BigDecimal.ROUND_DOWN);
      if (this.FVBZ.compareTo (this.HFVBZ) == 1) {
        this.FVBZ = this.HFVBZ.setScale (0, BigDecimal.ROUND_UP);
      }
    }
    this.MRE4ALTE();
  }

  MRE4ALTE(): void {
    if (this.ALTER1 == 0) {
      this.ALTE = BigDecimal.ZERO;
    } else {
      if (this.AJAHR < 2006) {
        this.K = 1;
      } else {
        if (this.AJAHR < 2058) {
          this.K = this.AJAHR - 2004;
        } else {
          this.K = 54;
        }
      }
      this.BMG = this.ZRE4J.subtract (this.ZVBEZJ);
      this.ALTE = (this.BMG.multiply(this.TAB4[this.K])).setScale(0, BigDecimal.ROUND_UP);
      this.HBALTE = this.TAB5[this.K];
      if (this.ALTE.compareTo (this.HBALTE) == 1) {
        this.ALTE = this.HBALTE;
      }
    }
  }

  MRE4ABZ(): void {
    this.ZRE4 = (this.ZRE4J.subtract (this.FVB).subtract   (this.ALTE).subtract (this.JLFREIB).add (this.JLHINZU)).setScale (2, BigDecimal.ROUND_DOWN);
    if (this.ZRE4.compareTo (BigDecimal.ZERO) == -1) {
      this.ZRE4 = BigDecimal.ZERO;
    }
    this.ZRE4VP = this.ZRE4J;
    this.ZVBEZ = this.ZVBEZJ.subtract(this.FVB).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.ZVBEZ.compareTo(BigDecimal.ZERO) == -1) {
      this.ZVBEZ = BigDecimal.ZERO;
    }
  }

  MBERECH(): void {
    this.MZTABFB();
    this.VFRB = ((this.ANP.add(this.FVB.add(this.FVBZ))).multiply(this.ZAHL100)).setScale(0, BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRB = ((this.ZVE.subtract(this.GFB)).multiply(this.ZAHL100)).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.WVFRB.compareTo(BigDecimal.ZERO) == -1) {
      this.WVFRB = BigDecimal.ZERO;
    }
    this.LSTJAHR = (this.ST.multiply(BigDecimal.valueOf(this.f))).setScale(0,BigDecimal.ROUND_DOWN);
    this.UPLSTLZZ();
    if (this.ZKF.compareTo(BigDecimal.ZERO) == 1) {
      this.ZTABFB = this.ZTABFB.add(this.KFB);
      this.MRE4ABZ();
      this.MLSTJAHR();
      this.JBMG = (this.ST.multiply(BigDecimal.valueOf(this.f))).setScale(0,BigDecimal.ROUND_DOWN);
    } else {
      this.JBMG = this.LSTJAHR;
    }
    this.MSOLZ();
  }

  MZTABFB(): void {
    this.ANP = BigDecimal.ZERO;
    if (this.ZVBEZ.compareTo (BigDecimal.ZERO) >= 0 && this.ZVBEZ.compareTo(this.FVBZ) == -1) {
      this.FVBZ = BigDecimal.valueOf(this.ZVBEZ.longValue());
    }
    if (this.STKL < 6) {
      if (this.ZVBEZ.compareTo (BigDecimal.ZERO) == 1) {
        if ((this.ZVBEZ.subtract (this.FVBZ)).compareTo (BigDecimal.valueOf(102)) == -1) {
          this.ANP = (this.ZVBEZ.subtract (this.FVBZ)).setScale (0, BigDecimal.ROUND_UP);
        } else {
          this.ANP = BigDecimal.valueOf(102);
        }
      }
    } else {
      this.FVBZ = BigDecimal.ZERO;
      this.FVBZSO = BigDecimal.ZERO;
    }
    if (this.STKL < 6) {
      if (this.ZRE4.compareTo(this.ZVBEZ) == 1) {
        if (this.ZRE4.subtract(this.ZVBEZ).compareTo(BigDecimal.valueOf(1230)) == -1) {
          this.ANP = this.ANP.add(this.ZRE4).subtract(this.ZVBEZ).setScale(0,BigDecimal.ROUND_UP);
        } else {
          this.ANP = this.ANP.add(BigDecimal.valueOf(1230));
        }
      }
    }
    this.KZTAB = 1;
    if (this.STKL == 1) {
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = (this.ZKF.multiply (BigDecimal.valueOf(9756))).setScale (0, BigDecimal.ROUND_DOWN);
    } else {
      if (this.STKL == 2) {
        this.EFA = BigDecimal.valueOf(4260);
        this.SAP = BigDecimal.valueOf(36);
        this.KFB = (this.ZKF.multiply (BigDecimal.valueOf(9756))).setScale (0, BigDecimal.ROUND_DOWN);
      } else {
        if (this.STKL == 3) {
          this.KZTAB = 2;
          this.SAP = BigDecimal.valueOf(36);
          this.KFB = (this.ZKF.multiply (BigDecimal.valueOf(9756))).setScale (0, BigDecimal.ROUND_DOWN);
        } else {
          if (this.STKL == 4) {
            this.SAP = BigDecimal.valueOf(36);
            this.KFB = (this.ZKF.multiply (BigDecimal.valueOf(4878))).setScale (0, BigDecimal.ROUND_DOWN);
          } else {
            if (this.STKL == 5) {
              this.SAP = BigDecimal.valueOf(36);
              this.KFB = BigDecimal.ZERO;
            } else {
              this.KFB = BigDecimal.ZERO;
            }
          }
        }
      }
    }
    this.ZTABFB = (this.EFA.add (this.ANP).add (this.SAP).add (this.FVBZ)).setScale (2, BigDecimal.ROUND_DOWN);
  }

  MLSTJAHR(): void {
    this.UPEVP();
    this.ZVE = this.ZRE4.subtract (this.ZTABFB).subtract(this.VSP);
    this.UPMLST();
  }

  UPLSTLZZ(): void {
    this.JW = this.LSTJAHR.multiply(this.ZAHL100);
    this.UPANTEIL();
    this.LSTLZZ = this.ANTEIL1;
  }

  UPMLST(): void {
    if (this.ZVE.compareTo (this.ZAHL1) == -1) {
      this.ZVE = BigDecimal.ZERO;
      this.X = BigDecimal.ZERO;
    } else {
      this.X = (this.ZVE.divide (BigDecimal.valueOf(this.KZTAB))).setScale (0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
  }

  UPEVP(): void {
    if (this.KRV == 1) {
      this.VSPR = BigDecimal.ZERO;
    } else {
      if (this.ZRE4VP.compareTo(this.BBGRVALV) == 1) {
        this.ZRE4VPR = this.BBGRVALV;
      } else {
        this.ZRE4VPR = this.ZRE4VP;
      }
      this.VSPR = (this.ZRE4VPR.multiply(this.RVSATZAN)).setScale(2,BigDecimal.ROUND_DOWN);
    }
    this.MVSPKVPV();
    if (this.ALV == 1) {

    } else {
      if (this.STKL == 6) {

      } else {
        this.MVSPHB();
      }
    }
  }

  MVSPKVPV(): void {
    if (this.ZRE4VP.compareTo(this.BBGKVPV) == 1) {
      this.ZRE4VPR = this.BBGKVPV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    if (this.PKV > 0) {
      if (this.STKL == 6) {
        this.VSPKVPV = BigDecimal.ZERO;
      } else {
        this.PKPVAGZJ = this.PKPVAGZ.multiply(this.ZAHL12).divide(this.ZAHL100).setScale(2,BigDecimal.ROUND_DOWN);
        this.VSPKVPV = this.PKPV.multiply(this.ZAHL12).divide(this.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.VSPKVPV = this.VSPKVPV.subtract(this.PKPVAGZJ);
        if (this.VSPKVPV.compareTo(BigDecimal.ZERO) == -1) {
          this.VSPKVPV = BigDecimal.ZERO;
        }
      }
    } else {
      this.VSPKVPV = this.ZRE4VPR.multiply(this.KVSATZAN.add(this.PVSATZAN)).setScale(2, BigDecimal.ROUND_DOWN);
    }
    this.VSP = this.VSPKVPV.add(this.VSPR).setScale(0, BigDecimal.ROUND_UP);
  }

  MVSPHB(): void {
    if (this.ZRE4VP.compareTo(this.BBGRVALV) == 1) {
      this.ZRE4VPR = this.BBGRVALV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    this.VSPALV = this.AVSATZAN.multiply(this.ZRE4VPR).setScale(2, BigDecimal.ROUND_DOWN);
    this.VSPHB = this.VSPALV.add(this.VSPKVPV).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.VSPHB.compareTo(BigDecimal.valueOf(1900)) == 1) {
      this.VSPHB = BigDecimal.valueOf(1900);
    }
    this.VSPN = this.VSPR.add(this.VSPHB).setScale(0, BigDecimal.ROUND_UP);
    if (this.VSPN.compareTo(this.VSP) == 1) {
      this.VSP = this.VSPN;
    }
  }

  MST5_6(): void {
    this.ZZX = this.X;
    if (this.ZZX.compareTo(this.W2STKL5) == 1) {
      this.ZX = this.W2STKL5;
      this.UP5_6();
      if (this.ZZX.compareTo (this.W3STKL5) == 1) {
        this.ST = (this.ST.add ((this.W3STKL5.subtract (this.W2STKL5)).multiply (BigDecimal.valueOf(0.42)))).setScale (0, BigDecimal.ROUND_DOWN);
        this.ST = (this.ST.add ((this.ZZX.subtract (this.W3STKL5)).multiply (BigDecimal.valueOf(0.45)))).setScale (0, BigDecimal.ROUND_DOWN);
      } else {
        this.ST = (this.ST.add ((this.ZZX.subtract (this.W2STKL5)).multiply (BigDecimal.valueOf(0.42)))).setScale (0, BigDecimal.ROUND_DOWN);
      }
    } else {
      this.ZX = this.ZZX;
      this.UP5_6();
      if (this.ZZX.compareTo (this.W1STKL5) == 1) {
        this.VERGL = this.ST;
        this.ZX = this.W1STKL5;
        this.UP5_6();
        this.HOCH = (this.ST.add ((this.ZZX.subtract (this.W1STKL5)).multiply (BigDecimal.valueOf(0.42)))).setScale (0, BigDecimal.ROUND_DOWN);
        if (this.HOCH.compareTo (this.VERGL) == -1) {
          this.ST = this.HOCH;
        } else {
          this.ST = this.VERGL;
        }
      }
    }
  }

  UP5_6(): void {
    this.X = (this.ZX.multiply (BigDecimal.valueOf(1.25))).setScale (0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST1 = this.ST;
    this.X = (this.ZX.multiply (BigDecimal.valueOf(0.75))).setScale (0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST2 = this.ST;
    this.DIFF = (this.ST1.subtract (this.ST2)).multiply (this.ZAHL2);
    this.MIST = (this.ZX.multiply (BigDecimal.valueOf(0.14))).setScale (0, BigDecimal.ROUND_DOWN);
    if (this.MIST.compareTo (this.DIFF) == 1) {
      this.ST = this.MIST;
    } else {
      this.ST = this.DIFF;
    }
  }

  MSOLZ(): void {
    this.SOLZFREI = (this.SOLZFREI.multiply(BigDecimal.valueOf(this.KZTAB)));
    if (this.JBMG.compareTo (this.SOLZFREI) == 1) {
      this.SOLZJ = (this.JBMG.multiply (BigDecimal.valueOf(5.5))).divide(this.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
      this.SOLZMIN = (this.JBMG.subtract (this.SOLZFREI)).multiply (BigDecimal.valueOf(11.9)).divide (this.ZAHL100).setScale (2, BigDecimal.ROUND_DOWN);
      if (this.SOLZMIN.compareTo (this.SOLZJ) == -1) {
        this.SOLZJ = this.SOLZMIN;
      }
      this.JW = this.SOLZJ.multiply (this.ZAHL100).setScale (0, BigDecimal.ROUND_DOWN);
      this.UPANTEIL();
      this.SOLZLZZ = this.ANTEIL1;
    } else {
      this.SOLZLZZ = BigDecimal.ZERO;
    }
    if (this.R > 0) {
      this.JW = this.JBMG.multiply (this.ZAHL100);
      this.UPANTEIL();
      this.BK = this.ANTEIL1;
    } else {
      this.BK = BigDecimal.ZERO;
    }
  }

  UPANTEIL(): void {
    if (this.LZZ == 1) {
      this.ANTEIL1 = this.JW;
    } else {
      if (this.LZZ == 2) {
        this.ANTEIL1 = this.JW.divide (this.ZAHL12, 0, BigDecimal.ROUND_DOWN);
      } else {
        if (this.LZZ == 3) {
          this.ANTEIL1 = (this.JW.multiply (this.ZAHL7)).divide (this.ZAHL360, 0, BigDecimal.ROUND_DOWN);
        } else {
          this.ANTEIL1 = this.JW.divide (this.ZAHL360, 0, BigDecimal.ROUND_DOWN);
        }
      }
    }
  }

  MSONST(): void {
    this.LZZ = 1;
    if (this.ZMVB == 0) {
      this.ZMVB = 12;
    }
    if (this.SONSTB.compareTo (BigDecimal.ZERO) == 0 && this.MBV.compareTo (BigDecimal.ZERO) == 0) {
      this.LSTSO = BigDecimal.ZERO;
      this.STS = BigDecimal.ZERO;
      this.SOLZS = BigDecimal.ZERO;
      this.BKS = BigDecimal.ZERO;
    } else {
      this.MOSONST();
      this.ZRE4J = ((this.JRE4.add (this.SONSTB)).divide (this.ZAHL100)).setScale (2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = ((this.JVBEZ.add (this.VBS)).divide (this.ZAHL100)).setScale (2, BigDecimal.ROUND_DOWN);
      this.VBEZBSO = this.STERBE;
      this.MRE4SONST();
      this.MLSTJAHR();
      this.WVFRBM = (this.ZVE.subtract(this.GFB)).multiply(this.ZAHL100).setScale(2,BigDecimal.ROUND_DOWN);
      if (this.WVFRBM.compareTo(BigDecimal.ZERO) == -1) {
        this.WVFRBM = BigDecimal.ZERO;
      }
      this.LSTSO = this.ST.multiply (this.ZAHL100);
      this.STS = this.LSTSO.subtract(this.LSTOSO).multiply(BigDecimal.valueOf(this.f)).divide(this.ZAHL100, 0, BigDecimal.ROUND_DOWN).multiply(this.ZAHL100);
      this.STSMIN();
    }
  }

  STSMIN(): void {
    if (this.STS.compareTo(BigDecimal.ZERO) == -1) {
      if (this.MBV.compareTo(BigDecimal.ZERO) == 0) {

      } else {
        this.LSTLZZ = this.LSTLZZ.add(this.STS);
        if (this.LSTLZZ.compareTo(BigDecimal.ZERO) == -1) {
          this.LSTLZZ = BigDecimal.ZERO;
        }
        this.SOLZLZZ = this.SOLZLZZ.add(this.STS.multiply(BigDecimal.valueOf(5.5).divide(this.ZAHL100))).setScale(0, BigDecimal.ROUND_DOWN);
        if (this.SOLZLZZ.compareTo(BigDecimal.ZERO) == -1) {
          this.SOLZLZZ = BigDecimal.ZERO;
        }
        this.BK = this.BK.add(this.STS);
        if (this.BK.compareTo(BigDecimal.ZERO) == -1) {
          this.BK = BigDecimal.ZERO;
        }
      }
      this.STS = BigDecimal.ZERO;
      this.SOLZS = BigDecimal.ZERO;
    } else {
      this.MSOLZSTS();
    }
    if (this.R > 0) {
      this.BKS = this.STS;
    } else {
      this.BKS = BigDecimal.ZERO;
    }
  }

  MSOLZSTS(): void {
    if (this.ZKF.compareTo(BigDecimal.ZERO) == 1) {
      this.SOLZSZVE = this.ZVE.subtract(this.KFB);
    } else {
      this.SOLZSZVE = this.ZVE;
    }
    if (this.SOLZSZVE.compareTo(BigDecimal.ONE) == -1) {
      this.SOLZSZVE = BigDecimal.ZERO;
      this.X = BigDecimal.ZERO;
    } else {
      this.X = this.SOLZSZVE.divide(BigDecimal.valueOf(this.KZTAB), 0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
    this.SOLZSBMG = this.ST.multiply(BigDecimal.valueOf(this.f)).setScale(0,BigDecimal.ROUND_DOWN);
    if (this.SOLZSBMG.compareTo(this.SOLZFREI) == 1) {
      this.SOLZS = this.STS.multiply(BigDecimal.valueOf(5.5)).divide(this.ZAHL100, 0, BigDecimal.ROUND_DOWN);
    } else {
      this.SOLZS = BigDecimal.ZERO;
    }
  }

  MOSONST(): void {
    this.ZRE4J = (this.JRE4.divide (this.ZAHL100)).setScale (2, BigDecimal.ROUND_DOWN);
    this.ZVBEZJ = (this.JVBEZ.divide (this.ZAHL100)).setScale (2, BigDecimal.ROUND_DOWN);
    this.JLFREIB = this.JFREIB.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.JLHINZU = this.JHINZU.divide (this.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.MRE4();
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.subtract(this.JRE4ENT.divide(this.ZAHL100));
    this.MZTABFB();
    this.VFRBS1 = ((this.ANP.add(this.FVB.add(this.FVBZ))).multiply(this.ZAHL100)).setScale(2,BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRBO = ((this.ZVE.subtract(this.GFB)).multiply(this.ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.WVFRBO.compareTo(BigDecimal.ZERO) == -1) {
      this.WVFRBO = BigDecimal.ZERO;
    }
    this.LSTOSO = this.ST.multiply (this.ZAHL100);
  }

  MRE4SONST(): void {
    this.MRE4();
    this.FVB = this.FVBSO;
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.add(this.MBV.divide(this.ZAHL100)).subtract(this.JRE4ENT.divide(this.ZAHL100)).subtract(this.SONSTENT.divide(this.ZAHL100));
    this.FVBZ = this.FVBZSO;
    this.MZTABFB();
    this.VFRBS2 = ((((this.ANP.add(this.FVB).add(this.FVBZ))).multiply(this.ZAHL100))).subtract(this.VFRBS1);
  }

  UPTAB26(): void {
    if (this.X.compareTo(this.GFB.add(this.ZAHL1)) == -1) {
      this.ST = BigDecimal.ZERO;
    } else {
      if (this.X.compareTo (BigDecimal.valueOf(17800)) == -1) {
        this.Y = (this.X.subtract(this.GFB)).divide(this.ZAHL10000, 6,BigDecimal.ROUND_DOWN);
        this.RW = this.Y.multiply (BigDecimal.valueOf(914.51));
        this.RW = this.RW.add (BigDecimal.valueOf(1400));
        this.ST = (this.RW.multiply (this.Y)).setScale (0, BigDecimal.ROUND_DOWN);
      } else {
        if (this.X.compareTo (BigDecimal.valueOf(69879)) == -1) {
          this.Y = (this.X.subtract (BigDecimal.valueOf(17799))).divide (this.ZAHL10000, 6, BigDecimal.ROUND_DOWN);
          this.RW = this.Y.multiply (BigDecimal.valueOf(173.1));
          this.RW = this.RW.add (BigDecimal.valueOf(2397));
          this.RW = this.RW.multiply (this.Y);
          this.ST = (this.RW.add (BigDecimal.valueOf(1034.87))).setScale (0, BigDecimal.ROUND_DOWN);
        } else {
          if (this.X.compareTo (BigDecimal.valueOf(277826)) == -1) {
            this.ST = ((this.X.multiply (BigDecimal.valueOf(0.42))).subtract (BigDecimal.valueOf(11135.63))).setScale (0, BigDecimal.ROUND_DOWN);
          } else {
            this.ST = ((this.X.multiply (BigDecimal.valueOf(0.45))).subtract (BigDecimal.valueOf(19470.38))).setScale (0, BigDecimal.ROUND_DOWN);
          }
        }
      }
    }
    this.ST = this.ST.multiply (BigDecimal.valueOf(this.KZTAB));
  }
}
