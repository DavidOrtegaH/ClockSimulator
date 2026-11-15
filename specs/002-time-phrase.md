# 002 — Time phrase

**Status:** Implemented

## Purpose

Below the clock, a legible sentence tells the time the way an English speaker would say it
out loud. Because an analog dial cannot tell morning from evening, the user picks **Day** or
**Night** (see 004) and the sentence uses that choice.

## Requirements

| ID             | Requirement                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-PHRASE-001 | The phrase MUST have a main line starting with `It's` and a seconds line.                                                                   |
| REQ-PHRASE-002 | Numbers MUST be written in English words (`twenty-five`, `forty-two`), hyphenating compound numbers.                                        |
| REQ-PHRASE-003 | Minute 0 MUST read `<hour> o'clock`.                                                                                                        |
| REQ-PHRASE-004 | Minutes 15, 30 and 45 MUST read `a quarter past <hour>`, `half past <hour>` and `a quarter to <next hour>`.                                 |
| REQ-PHRASE-005 | Other minutes 1–30 MUST read `<n> past <hour>`; minutes 31–59 MUST read `<60 − n> to <next hour>`.                                          |
| REQ-PHRASE-006 | When the minute count is not a multiple of five the word `minute`/`minutes` MUST follow the number (`one minute past`, `seven minutes to`). |
| REQ-PHRASE-007 | In **Day** mode the period MUST be `in the morning` for hours 6–11 and `in the afternoon` for 12 and 1–5.                                   |
| REQ-PHRASE-008 | In **Night** mode the period MUST be `in the evening` for hours 6–8 and `at night` for 9–12 and 1–5.                                        |
| REQ-PHRASE-009 | 12:00 MUST read `It's noon` (Day) or `It's midnight` (Night); `to twelve` MUST read `to noon` / `to midnight` without a period suffix.      |
| REQ-PHRASE-010 | The seconds line MUST read `and <n> seconds`, `and one second`, or `exactly` when the seconds are zero.                                     |
| REQ-PHRASE-011 | The period MUST follow the hour shown on the dial, not the hour named in a `to` phrase (`ten to six in the afternoon` at 5:50 Day).         |

## Acceptance criteria

| Dial     | Mode  | Main line                                       | Seconds line          |
| -------- | ----- | ----------------------------------------------- | --------------------- |
| 3:25:42  | Day   | It's twenty-five past three in the afternoon    | and forty-two seconds |
| 9:00:00  | Day   | It's nine o'clock in the morning                | exactly               |
| 7:15:01  | Night | It's a quarter past seven in the evening        | and one second        |
| 10:30:10 | Night | It's half past ten at night                     | and ten seconds       |
| 11:45:00 | Day   | It's a quarter to noon                          | exactly               |
| 12:00:00 | Night | It's midnight                                   | exactly               |
| 12:07:00 | Day   | It's seven minutes past twelve in the afternoon | exactly               |
| 2:58:30  | Night | It's two minutes to three at night              | and thirty seconds    |
| 5:50:00  | Day   | It's ten to six in the afternoon                | exactly               |
| 8:01:00  | Day   | It's one minute past eight in the morning       | exactly               |

## Out of scope

- Localisation to languages other than English.
- Automatic day/night detection.
