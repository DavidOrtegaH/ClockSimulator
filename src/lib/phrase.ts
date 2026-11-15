/**
 * Natural-language English time phrase (spec 002).
 */
import { dialReading } from './time';

export type Period = 'day' | 'night';

export interface TimePhrase {
  /** e.g. "It's twenty-five past three in the afternoon" */
  main: string;
  /** e.g. "and forty-two seconds" or "exactly" */
  seconds: string;
}

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
] as const;

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'] as const;

/** REQ-PHRASE-002: 0–59 in English words. */
export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 59) {
    throw new RangeError(`Expected an integer between 0 and 59, got ${n}`);
  }
  if (n < 20) return ONES[n] as string;
  const tens = TENS[Math.floor(n / 10)] as string;
  const ones = n % 10;
  return ones === 0 ? tens : `${tens}-${ONES[ones] as string}`;
}

/** REQ-PHRASE-007/008: period of the day for the hour shown on the dial. */
function periodSuffix(hour: number, period: Period): string {
  if (period === 'day') {
    return hour >= 6 && hour <= 11 ? 'in the morning' : 'in the afternoon';
  }
  return hour >= 6 && hour <= 8 ? 'in the evening' : 'at night';
}

/** REQ-PHRASE-005/006: "twenty-five", "seven minutes", "one minute". */
function minutesWords(n: number): string {
  const words = numberToWords(n);
  if (n % 5 === 0) return words;
  return `${words} ${n === 1 ? 'minute' : 'minutes'}`;
}

/** REQ-PHRASE-010 */
function secondsLine(second: number): string {
  if (second === 0) return 'exactly';
  return `and ${numberToWords(second)} ${second === 1 ? 'second' : 'seconds'}`;
}

function mainLine(hour: number, minute: number, period: Period): string {
  const twelveName = period === 'day' ? 'noon' : 'midnight';
  const suffix = periodSuffix(hour, period);
  const nextHour = hour === 12 ? 1 : hour + 1;

  // REQ-PHRASE-009
  if (minute === 0 && hour === 12) return twelveName;
  // REQ-PHRASE-003
  if (minute === 0) return `${numberToWords(hour)} o'clock ${suffix}`;

  // REQ-PHRASE-004/005
  if (minute <= 30) {
    const amount = minute === 15 ? 'a quarter' : minute === 30 ? 'half' : minutesWords(minute);
    return `${amount} past ${numberToWords(hour)} ${suffix}`;
  }

  const remaining = 60 - minute;
  const amount = remaining === 15 ? 'a quarter' : minutesWords(remaining);
  // REQ-PHRASE-009: "to noon" / "to midnight" needs no suffix.
  if (nextHour === 12) return `${amount} to ${twelveName}`;
  // REQ-PHRASE-011: suffix follows the dial hour.
  return `${amount} to ${numberToWords(nextHour)} ${suffix}`;
}

/** REQ-PHRASE-001: full phrase for a dial time `t` (seconds on a 12-hour dial). */
export function describeTime(t: number, period: Period): TimePhrase {
  const { hour, minute, second } = dialReading(t);
  return {
    main: `It's ${mainLine(hour, minute, period)}`,
    seconds: secondsLine(second),
  };
}
