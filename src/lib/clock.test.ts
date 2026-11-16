import { describe, expect, it } from 'vitest';
import { Clock } from './clock.svelte';
import type { Hand } from './time';

const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

/** Simulates a pointer drag made of many small movements. */
function drag(clock: Clock, hand: Hand, totalDeg: number, steps = 30) {
  clock.hand = hand;
  clock.beginDrag();
  for (let i = 0; i < steps; i++) clock.dragBy(totalDeg / steps);
  clock.endDrag();
}

describe('Clock state', () => {
  it('REQ-FACE-004: advances in real time while playing', () => {
    const clock = new Clock(hms(3, 25, 40));
    clock.tick(2);
    expect(clock.time).toBe(hms(3, 25, 42));
    expect(clock.phrase.main).toBe("It's twenty-five past three in the afternoon");
    expect(clock.phrase.seconds).toBe('and forty-two seconds');
  });

  it('REQ-FACE-004: the seconds hand advances 6° per second', () => {
    const clock = new Clock(hms(1, 0, 0));
    const before = clock.angles.seconds;
    clock.tick(2);
    expect(clock.angles.seconds - before).toBe(12);
  });

  it('REQ-FACE-004: wraps past 12 o’clock', () => {
    const clock = new Clock(hms(11, 59, 59));
    clock.tick(2);
    expect(clock.time).toBe(1);
  });

  it('REQ-DRAG-002: starting a drag does not move any hand', () => {
    const clock = new Clock(hms(3, 0, 0));
    clock.beginDrag();
    expect(clock.time).toBe(hms(3, 0, 0));
    expect(clock.dragging).toBe(true);
    clock.endDrag();
    expect(clock.dragging).toBe(false);
  });

  it('REQ-DRAG-003: a quarter turn of the minute hand moves the hour hand along', () => {
    const clock = new Clock(hms(3, 0, 0));
    drag(clock, 'minutes', 90);
    expect(clock.time).toBe(hms(3, 15, 0));
    expect(clock.angles.hours).toBeCloseTo(97.5);
  });

  it('REQ-DRAG-003: dragging the minute hand past 12 advances the hour', () => {
    const clock = new Clock(hms(3, 50, 0));
    drag(clock, 'minutes', 120);
    expect(clock.time).toBe(hms(4, 10, 0));
  });

  it('REQ-DRAG-003/REQ-TIME-010: the hour hand keeps the seconds still', () => {
    const clock = new Clock(hms(3, 0, 42));
    clock.hand = 'hours';
    clock.beginDrag();
    for (let i = 0; i < 90; i++) {
      clock.dragBy(1);
      expect(clock.angles.seconds).toBe(252);
    }
    clock.endDrag();
    expect(clock.time).toBe(hms(6, 0, 42));
  });

  it('REQ-DRAG-003/REQ-TIME-010: slow minute drags accumulate instead of being lost', () => {
    const clock = new Clock(hms(3, 0, 10));
    drag(clock, 'minutes', 6, 60); // 0.1° per move = 1 s each
    expect(clock.time).toBe(hms(3, 1, 10));
  });

  it('REQ-DRAG-003: the seconds hand drags minutes and hours proportionally', () => {
    const clock = new Clock(hms(3, 0, 0));
    drag(clock, 'seconds', -90);
    expect(clock.time).toBeCloseTo(hms(2, 59, 45));
  });

  it('REQ-DRAG-007: keyboard steps move the selected hand by its unit', () => {
    const clock = new Clock(hms(3, 0, 0));
    clock.step(2);
    expect(clock.time).toBe(hms(3, 2, 0));
    clock.hand = 'hours';
    clock.step(-5);
    expect(clock.time).toBe(hms(10, 2, 0));
    clock.hand = 'seconds';
    clock.step(1);
    expect(clock.time).toBe(hms(10, 2, 1));
  });

  it('REQ-UX-003: syncing to now keeps play state, hand and period', () => {
    const clock = new Clock(hms(9, 0, 0));
    clock.playing = false;
    clock.hand = 'hours';
    clock.period = 'night';
    clock.syncTo(hms(3, 25, 42));
    expect(clock.time).toBe(hms(3, 25, 42));
    expect(clock.playing).toBe(false);
    expect(clock.hand).toBe('hours');
    expect(clock.period).toBe('night');
  });

  it('REQ-UX-004: the accessible value only includes seconds when they matter', () => {
    const clock = new Clock(hms(3, 25, 42.7));
    expect(clock.valueText).toBe("It's twenty-five past three in the afternoon");
    expect(clock.valueNow).toBe(hms(3, 25, 0));

    clock.hand = 'seconds';
    expect(clock.valueText).toBe(
      "It's twenty-five past three in the afternoon, and forty-two seconds",
    );
    expect(clock.valueNow).toBe(hms(3, 25, 42));

    clock.hand = 'minutes';
    clock.playing = false;
    expect(clock.valueText).toContain('and forty-two seconds');
  });

  it('does not advance while paused or while a hand is being dragged', () => {
    const clock = new Clock(0);
    clock.playing = false;
    clock.tick(5);
    expect(clock.time).toBe(0);
    clock.playing = true;
    clock.beginDrag();
    clock.tick(5);
    expect(clock.time).toBe(0);
    clock.endDrag();
    clock.tick(5);
    expect(clock.time).toBe(5);
  });
});
