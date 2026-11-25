/**
 * Kopieren-Buttons in Rechnern: <button data-copy data-value="…"> + <p data-copy-status aria-live="polite">.
 * Der zu kopierende Wert steht in data-value (wird vom Rechner bei jeder Berechnung aktualisiert).
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback für ältere Browser / unsichere Kontexte
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function bindCopyButtons(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-copy-status]');
  let timer = 0;
  form.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!btn || !btn.dataset.value) return;
    const ok = await copyText(btn.dataset.value);
    if (!status) return;
    status.textContent = ok ? `„${btn.dataset.value}“ in die Zwischenablage kopiert.` : 'Kopieren nicht möglich – bitte manuell markieren.';
    clearTimeout(timer);
    timer = window.setTimeout(() => (status.textContent = ''), 3000);
  });
}
