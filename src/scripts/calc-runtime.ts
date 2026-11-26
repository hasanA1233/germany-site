/**
 * Gemeinsame Browser-Logik für alle Rechner.
 *
 * Konventionen im Markup (siehe components/calculator/*):
 *  - <form data-calc="slug">                       Wurzel eines Rechners
 *  - <input name="x" data-num data-decimals="2">   Zahlenfeld (deutsches Format)
 *  - <p data-error-for="x">                        Fehlermeldung zu Feld x
 *  - [data-out="key"]                              Ausgabefeld
 *  - [data-results] / [data-results-invalid]       Ergebnisbereich / Hinweis bei ungültigen Eingaben
 *  - [data-show-when="feld=wert"]                  nur sichtbar, wenn Radio/Select feld den Wert hat
 *  - <button type="reset">                         setzt auf Standardwerte zurück
 */
import { formatNumber, parseNumber } from '../lib/format';

export type Errors = Record<string, string>;

export interface CalcContext {
  form: HTMLFormElement;
  /** Liest ein Zahlenfeld. Leeres optionales Feld → `fallback` (Standard 0). Leeres Pflichtfeld → NaN */
  num(name: string, fallback?: number): number;
  /** Liest ein optionales Feld: leer → undefined */
  optional(name: string): number | undefined;
  /** Wert einer Radio-Gruppe oder eines Selects */
  choice(name: string): string;
  out(key: string, text: string): void;
  /** Setzt data-state auf ein Element mit [data-out=key] (z. B. für Farbwechsel Gewinn/Verlust) */
  state(key: string, value: string): void;
  el<T extends Element = HTMLElement>(selector: string): T | null;
}

export type ComputeFn = (ctx: CalcContext) => Errors | null;

export function initCalculator(form: HTMLFormElement, compute: ComputeFn) {
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;

  const ctx: CalcContext = {
    form,
    num(name, fallback = 0) {
      const f = field(name) as HTMLInputElement | null;
      if (!f) return NaN;
      const raw = f.value.trim();
      if (raw === '') return f.hasAttribute('data-optional') ? fallback : NaN;
      return parseNumber(raw);
    },
    optional(name) {
      const f = field(name) as HTMLInputElement | null;
      if (!f || f.value.trim() === '') return undefined;
      return parseNumber(f.value);
    },
    choice(name) {
      const f = field(name);
      if (!f) return '';
      return (f as RadioNodeList | HTMLInputElement).value;
    },
    out(key, text) {
      form.querySelectorAll<HTMLElement>(`[data-out="${key}"]`).forEach((n) => (n.textContent = text));
    },
    state(key, value) {
      form.querySelectorAll<HTMLElement>(`[data-out="${key}"], [data-state-for="${key}"]`).forEach((n) => (n.dataset.state = value));
    },
    el(selector) {
      return form.querySelector(selector);
    },
  };

  const updateVisibility = () => {
    form.querySelectorAll<HTMLElement>('[data-show-when]').forEach((node) => {
      const [name, value] = (node.dataset.showWhen ?? '').split('=');
      const visible = ctx.choice(name) === value;
      node.hidden = !visible;
      // Ausgeblendete Felder nicht validieren/absenden
      node.querySelectorAll<HTMLInputElement>('input, select').forEach((i) => (i.disabled = !visible));
    });
  };

  const applyErrors = (errors: Errors | null) => {
    // undefined/leere Meldungen ignorieren
    const errs: Errors = {};
    for (const [k, v] of Object.entries(errors ?? {})) if (v) errs[k] = v;

    // Meldungen ohne sichtbares Feld landen in der allgemeinen Formular-Meldung
    const formLevel: string[] = [];
    for (const [name, msg] of Object.entries(errs)) {
      const p = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (name !== '_form' && (!p || p.closest('[hidden]'))) formLevel.push(msg);
    }
    if (formLevel.length) errs._form = [errs._form, ...formLevel].filter(Boolean).join(' ');

    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((p) => {
      const name = p.dataset.errorFor!;
      const msg = errs[name];
      const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (p.textContent !== (msg ?? '')) p.textContent = msg ?? '';
      p.hidden = !msg;
      if (input) {
        if (msg) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
    });
    const invalid = Object.keys(errs).length > 0;
    form.querySelectorAll<HTMLElement>('[data-results]').forEach((n) => (n.hidden = invalid));
    form.querySelectorAll<HTMLElement>('[data-results-invalid]').forEach((n) => (n.hidden = !invalid));
  };

  // Nutzungsstatistik: nach einer Eingabe mit gültigem Ergebnis ein Ereignis melden (entprellt, ohne Eingabewerte).
  // Ob es an Google Analytics geht, entscheidet allein der Cookie-Banner (nur mit Einwilligung „Statistik“).
  let userInput = false;
  let statTimer = 0;
  const reportCalculation = () => {
    clearTimeout(statTimer);
    statTimer = window.setTimeout(() => {
      const calculator = location.pathname.replace(/^\/+|\/+$/g, '') || form.dataset.calc || '';
      document.dispatchEvent(new CustomEvent('qr:calculate', { detail: { calculator } }));
    }, 1500);
  };

  let frame = 0;
  const run = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      updateVisibility();
      try {
        const errors = compute(ctx);
        applyErrors(errors);
        if (userInput && (!errors || Object.keys(errors).length === 0)) reportCalculation();
      } catch (err) {
        console.error('[QuickRechner] Berechnung fehlgeschlagen', err);
        applyErrors({ _form: 'Die Berechnung konnte nicht durchgeführt werden. Bitte prüfen Sie Ihre Eingaben.' });
      }
    });
  };

  const onUserInput = () => {
    userInput = true;
    run();
  };
  form.addEventListener('input', onUserInput);
  form.addEventListener('change', onUserInput);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onUserInput();
  });
  form.addEventListener('reset', () => setTimeout(run, 0));

  // Zahlen beim Verlassen des Feldes hübsch formatieren (z. B. 25000 → 25.000)
  form.addEventListener(
    'blur',
    (e) => {
      const t = e.target as HTMLInputElement;
      if (!t.matches?.('input[data-num]') || t.value.trim() === '') return;
      const n = parseNumber(t.value);
      if (Number.isFinite(n)) t.value = formatNumber(n, Number(t.dataset.decimals ?? 2));
    },
    true,
  );

  run();
}

/** Sucht alle Formulare mit data-calc="slug" und initialisiert sie */
export function mountCalculator(slug: string, compute: ComputeFn) {
  document.querySelectorAll<HTMLFormElement>(`form[data-calc="${slug}"]`).forEach((f) => initCalculator(f, compute));
}

/** Füllt eine Tabelle (tbody) mit Zeilen aus Textzellen – ohne innerHTML */
export function fillTable(tbody: HTMLTableSectionElement | null, rows: string[][]) {
  if (!tbody) return;
  const frag = document.createDocumentFragment();
  for (const cells of rows) {
    const tr = document.createElement('tr');
    cells.forEach((text, i) => {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) cell.setAttribute('scope', 'row');
      cell.textContent = text;
      tr.appendChild(cell);
    });
    frag.appendChild(tr);
  }
  tbody.replaceChildren(frag);
}
