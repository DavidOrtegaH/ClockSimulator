/**
 * Keyboard shortcuts (spec 007, REQ-UX-001). Pure so it can be unit-tested without a DOM.
 */
import type { Period } from './phrase';
import type { Hand } from './time';

export type ShortcutAction =
  | { type: 'hand'; hand: Hand }
  | { type: 'toggle' }
  | { type: 'period'; period: Period }
  | { type: 'now' };

export interface ShortcutInput {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  /** True when focus is on a button, which already handles Space by itself. */
  onButton: boolean;
}

const ACTIONS: Readonly<Record<string, ShortcutAction>> = {
  h: { type: 'hand', hand: 'hours' },
  m: { type: 'hand', hand: 'minutes' },
  s: { type: 'hand', hand: 'seconds' },
  k: { type: 'toggle' },
  ' ': { type: 'toggle' },
  d: { type: 'period', period: 'day' },
  n: { type: 'period', period: 'night' },
  t: { type: 'now' },
};

/** Shortcut labels for `aria-keyshortcuts` and tooltips (REQ-UX-002). */
export const SHORTCUT_KEYS = {
  hours: 'H',
  minutes: 'M',
  seconds: 'S',
  toggle: 'Space K',
  day: 'D',
  night: 'N',
  now: 'T',
} as const;

export function shortcutFor(e: ShortcutInput): ShortcutAction | null {
  if (e.ctrlKey || e.altKey || e.metaKey || e.repeat) return null;
  if (e.key === ' ' && e.onButton) return null;
  return ACTIONS[e.key.toLowerCase()] ?? null;
}
