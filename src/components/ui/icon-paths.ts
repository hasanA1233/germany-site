import type { IconName } from '../../data/categories';

export type ExtraIcon = 'search' | 'menu' | 'close' | 'arrow-right' | 'chevron-right' | 'reset' | 'info' | 'check';

/** Einfache 24×24-Strichsymbole (eigene Zeichnungen, keine externe Bibliothek) */
export const iconPaths: Record<IconName | ExtraIcon, string> = {
  loan: 'M3 10h18M5 10V8l7-4 7 4v2M6 10v7M10 10v7M14 10v7M18 10v7M3 20h18',
  growth: 'M3 17l5-5 4 4 8-8M15 8h5v5',
  piggy: 'M5 11a6 5 0 0 1 11-2.5h2.5l-.5 2.5 2 1v3l-2 .5-1.5 2.5h-2v-1.5h-4V19h-2l-1.2-3A5 5 0 0 1 5 11zM9 7.5V6a2 2 0 0 1 3-1.7M15.5 11h.01',
  table: 'M4 5h16v14H4zM4 10h16M4 14.5h16M10 5v14',
  receipt: 'M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h3',
  profit: 'M4 20h16M7 16v-4M12 16V8M17 16V5',
  margin: 'M12 3v18M17 6.5c0-1.7-2.2-3-5-3s-5 1.3-5 3.3S9 10 12 11s5 1.7 5 3.7-2.2 3.3-5 3.3-5-1.3-5-3',
  roi: 'M4 18l6-6 3 3 7-7M14 8h6v6M4 4v16',
  breakeven: 'M3 19L21 6M3 12c6 0 12 1.5 18 3M12 4v16',
  discount: 'M20 12l-8 8-9-9V4h7zM7.5 7.5h.01',
  briefcase: 'M4 7h16v12H4zM9 7V5h6v2M4 12h16',
  percent: 'M19 5L5 19M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  calculator: 'M6 3h12v18H6zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01',
  tax: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  student: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  dreisatz: 'M2 8h6v8H2zM9 8h6v8H9zM16 8h6v8h-6zM8 12h1M15 12h1M5 19c3 2 11 2 14 0M17 17.5l2 1.5-2 1.5',
  building: 'M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M3 10l9-6 9 6M8 13h.01M16 13h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  reset: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  check: 'M5 12l5 5 9-10',
};
