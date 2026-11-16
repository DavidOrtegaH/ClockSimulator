import { describe, expect, it } from 'vitest';
import { shortcutFor, type ShortcutInput } from './shortcuts';

const key = (k: string, extra: Partial<ShortcutInput> = {}): ShortcutInput => ({
  key: k,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  repeat: false,
  onButton: false,
  ...extra,
});

describe('keyboard shortcuts', () => {
  it('REQ-UX-001: H, M and S select the hand, in either case', () => {
    expect(shortcutFor(key('h'))).toEqual({ type: 'hand', hand: 'hours' });
    expect(shortcutFor(key('M'))).toEqual({ type: 'hand', hand: 'minutes' });
    expect(shortcutFor(key('s'))).toEqual({ type: 'hand', hand: 'seconds' });
  });

  it('REQ-UX-001: Space and K toggle play/pause', () => {
    expect(shortcutFor(key(' '))).toEqual({ type: 'toggle' });
    expect(shortcutFor(key('k'))).toEqual({ type: 'toggle' });
  });

  it('REQ-UX-001: D, N choose the period and T resets to now', () => {
    expect(shortcutFor(key('d'))).toEqual({ type: 'period', period: 'day' });
    expect(shortcutFor(key('N'))).toEqual({ type: 'period', period: 'night' });
    expect(shortcutFor(key('t'))).toEqual({ type: 'now' });
  });

  it('REQ-UX-001: ignores modifiers, auto-repeat and unknown keys', () => {
    expect(shortcutFor(key('h', { ctrlKey: true }))).toBeNull();
    expect(shortcutFor(key('m', { metaKey: true }))).toBeNull();
    expect(shortcutFor(key('s', { altKey: true }))).toBeNull();
    expect(shortcutFor(key('k', { repeat: true }))).toBeNull();
    expect(shortcutFor(key('x'))).toBeNull();
    expect(shortcutFor(key('ArrowLeft'))).toBeNull();
  });

  it('REQ-UX-001: Space is left to a focused button', () => {
    expect(shortcutFor(key(' ', { onButton: true }))).toBeNull();
    expect(shortcutFor(key('k', { onButton: true }))).toEqual({ type: 'toggle' });
  });
});
