import { describe, expect, it } from 'vitest';
import { Clock } from './clock.svelte';

const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

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

  it('REQ-DRAG-002/003: pointing the minute hand moves the hour hand along', () => {
    const clock = new Clock(hms(3, 0, 0));
    clock.hand = 'minutes';
    clock.pointHandAt(90);
    expect(clock.time).toBeCloseTo(hms(3, 15, 0));
    expect(clock.angles.hours).toBeCloseTo(97.5);
  });

  it('REQ-DRAG-003: dragging the minute hand past 12 advances the hour', () => {
    const clock = new Clock(hms(3, 50, 0));
    clock.hand = 'minutes';
    for (const angle of [320, 340, 0, 20, 40, 60]) clock.pointHandAt(angle);
    expect(clock.time).toBeCloseTo(hms(4, 10, 0));
  });

  it('REQ-DRAG-003: pointing the hour hand and the seconds hand', () => {
    const clock = new Clock(hms(3, 0, 0));
    clock.hand = 'hours';
    clock.pointHandAt(180);
    expect(clock.time).toBeCloseTo(hms(6, 0, 0));

    clock.time = hms(3, 0, 0);
    clock.hand = 'seconds';
    clock.pointHandAt(270);
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

  it('does not advance while paused or while a hand is being dragged', () => {
    const clock = new Clock(0);
    clock.playing = false;
    clock.tick(5);
    expect(clock.time).toBe(0);
    clock.playing = true;
    clock.dragging = true;
    clock.tick(5);
    expect(clock.time).toBe(0);
  });
});
