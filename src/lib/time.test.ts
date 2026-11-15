import { describe, expect, it } from 'vitest';
import {
  SECONDS_PER_DIAL,
  angleDelta,
  dialReading,
  fromDate,
  handAngles,
  normalize,
  pointerAngle,
  rotateHand,
} from './time';

const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

describe('time model', () => {
  it('REQ-TIME-001/002: normalises into [0, 43200) in both directions', () => {
    expect(SECONDS_PER_DIAL).toBe(43_200);
    expect(normalize(0)).toBe(0);
    expect(normalize(43_200)).toBe(0);
    expect(normalize(-1)).toBe(43_199);
    expect(normalize(43_200 * 3 + 5)).toBe(5);
    expect(normalize(-43_200 * 2 - 0.5)).toBeCloseTo(43_199.5);
  });

  it('REQ-TIME-003: derives hand angles from a single value', () => {
    const a = handAngles(hms(3, 25, 42));
    expect(a.hours).toBeCloseTo(102.85);
    expect(a.minutes).toBeCloseTo(154.2);
    expect(a.seconds).toBe(252);
  });

  it('REQ-TIME-004: seconds tick, hours and minutes sweep', () => {
    const a = handAngles(hms(0, 0, 10.9));
    expect(a.seconds).toBe(60);
    expect(a.minutes).toBeCloseTo(1.09);
    expect(a.hours).toBeCloseTo(10.9 / 120);
  });

  it('REQ-TIME-005: rotating the minute hand drags hours and seconds along', () => {
    const t = rotateHand(hms(3, 0, 0), 'minutes', 90);
    expect(t).toBe(hms(3, 15, 0));
    expect(handAngles(t).hours - handAngles(hms(3, 0, 0)).hours).toBeCloseTo(7.5);
  });

  it('REQ-TIME-005: rotating the seconds hand rolls the minute and hour over', () => {
    expect(rotateHand(hms(3, 59, 30), 'seconds', 180)).toBe(hms(4, 0, 0));
  });

  it('REQ-TIME-005: rotating the hour hand backwards across 12 wraps', () => {
    expect(rotateHand(0, 'hours', -30)).toBe(hms(11, 0, 0));
  });

  it('REQ-TIME-006: angular delta takes the shortest way round', () => {
    expect(angleDelta(350, 10)).toBe(20);
    expect(angleDelta(10, 350)).toBe(-20);
    expect(angleDelta(0, 180)).toBe(180);
    expect(angleDelta(180, 0)).toBe(180);
    expect(angleDelta(90, 90)).toBe(0);
  });

  it('REQ-TIME-007: maps pointer offsets to clockwise angles from 12', () => {
    expect(pointerAngle(0, -1)).toBeCloseTo(0);
    expect(pointerAngle(1, 0)).toBeCloseTo(90);
    expect(pointerAngle(0, 1)).toBeCloseTo(180);
    expect(pointerAngle(-1, 0)).toBeCloseTo(270);
    expect(pointerAngle(-1, -1)).toBeCloseTo(315);
  });

  it('REQ-TIME-008: starts from local time on a 12-hour dial', () => {
    expect(fromDate(new Date(2026, 0, 1, 15, 25, 42, 500))).toBe(12_342.5);
    expect(fromDate(new Date(2026, 0, 1, 0, 0, 0, 0))).toBe(0);
    expect(fromDate(new Date(2026, 0, 1, 12, 0, 1, 0))).toBe(1);
  });

  it('REQ-TIME-009: decomposes into hour 1-12, minute and second', () => {
    expect(dialReading(hms(3, 25, 42.9))).toEqual({ hour: 3, minute: 25, second: 42 });
    expect(dialReading(0)).toEqual({ hour: 12, minute: 0, second: 0 });
    expect(dialReading(hms(11, 59, 59.99))).toEqual({ hour: 11, minute: 59, second: 59 });
  });
});
