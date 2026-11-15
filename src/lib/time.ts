/**
 * Geared clock time model (spec 001).
 *
 * The whole clock is one number: seconds elapsed on a 12-hour dial. Every hand angle is
 * derived from it, so the hands can never disagree — just like a real geared movement.
 */

export type Hand = 'hours' | 'minutes' | 'seconds';

export interface HandAngles {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface DialReading {
  /** 1–12 */
  hour: number;
  /** 0–59 */
  minute: number;
  /** 0–59 */
  second: number;
}

/** REQ-TIME-001: length of one full turn of the hour hand. */
export const SECONDS_PER_DIAL = 12 * 60 * 60;

/** Seconds of clock time represented by one full 360° turn of each hand. */
const SECONDS_PER_TURN: Readonly<Record<Hand, number>> = {
  hours: SECONDS_PER_DIAL,
  minutes: 60 * 60,
  seconds: 60,
};

/** REQ-TIME-001/002: wrap any value into [0, 43200). */
export function normalize(t: number): number {
  const r = ((t % SECONDS_PER_DIAL) + SECONDS_PER_DIAL) % SECONDS_PER_DIAL;
  // Guard against floating-point rounding up to exactly one full dial.
  return r >= SECONDS_PER_DIAL ? 0 : r;
}

/** REQ-TIME-003/004: hand angles in degrees, clockwise from 12 o'clock. */
export function handAngles(t: number): HandAngles {
  const n = normalize(t);
  return {
    hours: n / 120,
    minutes: (n % 3600) / 10,
    seconds: Math.floor(n % 60) * 6,
  };
}

/** REQ-TIME-005: turn one hand by `deltaDeg`; the others follow through the shared value. */
export function rotateHand(t: number, hand: Hand, deltaDeg: number): number {
  return normalize(t + (deltaDeg * SECONDS_PER_TURN[hand]) / 360);
}

/**
 * REQ-TIME-010: the nearest time to `t` whose position within the minute is `secondOfMinute`.
 * Used when setting the clock with the hour or minute hand so the seconds stay put.
 */
export function snapKeepingSecond(t: number, secondOfMinute: number): number {
  const minutes = Math.round((t - secondOfMinute) / 60);
  return normalize(minutes * 60 + secondOfMinute);
}

/** REQ-TIME-006: shortest signed difference from `from` to `to`, in (-180, 180]. */
export function angleDelta(from: number, to: number): number {
  const d = (((to - from) % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
}

/** REQ-TIME-007: screen offset from the dial centre → angle in [0, 360) clockwise from 12. */
export function pointerAngle(dx: number, dy: number): number {
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/** REQ-TIME-008: local wall-clock time on a 12-hour dial. */
export function fromDate(date: Date): number {
  return (
    (date.getHours() % 12) * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds() +
    date.getMilliseconds() / 1000
  );
}

/** REQ-TIME-009: what a person reads on the dial. */
export function dialReading(t: number): DialReading {
  const n = normalize(t);
  const h = Math.floor(n / 3600);
  return {
    hour: h === 0 ? 12 : h,
    minute: Math.floor((n % 3600) / 60),
    second: Math.floor(n % 60),
  };
}
