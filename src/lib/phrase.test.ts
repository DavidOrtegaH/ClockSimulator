import { describe, expect, it } from 'vitest';
import { describeTime, numberToWords, type Period } from './phrase';

const hms = (h: number, m: number, s: number) => (h % 12) * 3600 + m * 60 + s;

function say(h: number, m: number, s: number, period: Period) {
  return describeTime(hms(h, m, s), period);
}

describe('numberToWords', () => {
  it('REQ-PHRASE-002: writes 1–59 in hyphenated English words', () => {
    expect(numberToWords(1)).toBe('one');
    expect(numberToWords(13)).toBe('thirteen');
    expect(numberToWords(20)).toBe('twenty');
    expect(numberToWords(25)).toBe('twenty-five');
    expect(numberToWords(42)).toBe('forty-two');
    expect(numberToWords(59)).toBe('fifty-nine');
  });
});

describe('describeTime', () => {
  it.each<[number, number, number, Period, string, string]>([
    [3, 25, 42, 'day', "It's twenty-five past three in the afternoon", 'and forty-two seconds'],
    [9, 0, 0, 'day', "It's nine o'clock in the morning", 'exactly'],
    [7, 15, 1, 'night', "It's a quarter past seven in the evening", 'and one second'],
    [10, 30, 10, 'night', "It's half past ten at night", 'and ten seconds'],
    [11, 45, 0, 'day', "It's a quarter to noon", 'exactly'],
    [12, 0, 0, 'night', "It's midnight", 'exactly'],
    [12, 7, 0, 'day', "It's seven minutes past twelve in the afternoon", 'exactly'],
    [2, 58, 30, 'night', "It's two minutes to three at night", 'and thirty seconds'],
    [5, 50, 0, 'day', "It's ten to six in the afternoon", 'exactly'],
    [8, 1, 0, 'day', "It's one minute past eight in the morning", 'exactly'],
  ])('acceptance: %i:%i:%i (%s)', (h, m, s, period, main, seconds) => {
    expect(say(h, m, s, period)).toEqual({ main, seconds });
  });

  it('REQ-PHRASE-003: minute zero is o’clock', () => {
    expect(say(4, 0, 0, 'day').main).toBe("It's four o'clock in the afternoon");
  });

  it('REQ-PHRASE-004: quarters and half', () => {
    expect(say(1, 15, 0, 'day').main).toBe("It's a quarter past one in the afternoon");
    expect(say(1, 30, 0, 'day').main).toBe("It's half past one in the afternoon");
    expect(say(1, 45, 0, 'day').main).toBe("It's a quarter to two in the afternoon");
  });

  it('REQ-PHRASE-005/006: past up to 30, to from 31, "minutes" when not a multiple of 5', () => {
    expect(say(6, 20, 0, 'day').main).toBe("It's twenty past six in the morning");
    expect(say(6, 29, 0, 'day').main).toBe("It's twenty-nine minutes past six in the morning");
    expect(say(6, 31, 0, 'day').main).toBe("It's twenty-nine minutes to seven in the morning");
    expect(say(6, 35, 0, 'day').main).toBe("It's twenty-five to seven in the morning");
    expect(say(6, 59, 0, 'day').main).toBe("It's one minute to seven in the morning");
  });

  it('REQ-PHRASE-007: day periods', () => {
    expect(say(6, 0, 0, 'day').main).toContain('in the morning');
    expect(say(11, 59, 0, 'day').main).toBe("It's one minute to noon");
    expect(say(11, 10, 0, 'day').main).toContain('in the morning');
    expect(say(12, 30, 0, 'day').main).toContain('in the afternoon');
    expect(say(1, 0, 0, 'day').main).toContain('in the afternoon');
    expect(say(5, 59, 0, 'day').main).toContain('in the afternoon');
  });

  it('REQ-PHRASE-008: night periods', () => {
    expect(say(6, 0, 0, 'night').main).toContain('in the evening');
    expect(say(8, 59, 0, 'night').main).toContain('in the evening');
    expect(say(9, 0, 0, 'night').main).toContain('at night');
    expect(say(12, 30, 0, 'night').main).toContain('at night');
    expect(say(3, 0, 0, 'night').main).toContain('at night');
  });

  it('REQ-PHRASE-009: noon and midnight', () => {
    expect(say(12, 0, 0, 'day').main).toBe("It's noon");
    expect(say(12, 0, 0, 'night').main).toBe("It's midnight");
    expect(say(11, 50, 0, 'night').main).toBe("It's ten to midnight");
  });

  it('REQ-PHRASE-010: seconds line', () => {
    expect(say(1, 2, 0, 'day').seconds).toBe('exactly');
    expect(say(1, 2, 1, 'day').seconds).toBe('and one second');
    expect(say(1, 2, 59.9, 'day').seconds).toBe('and fifty-nine seconds');
  });

  it('REQ-PHRASE-011: period follows the dial hour, not the named hour', () => {
    expect(say(5, 50, 0, 'day').main).toBe("It's ten to six in the afternoon");
    expect(say(8, 45, 0, 'night').main).toBe("It's a quarter to nine in the evening");
  });
});
