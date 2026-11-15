# 001 — Time model

**Status:** Implemented

## Purpose

A real wall clock is a single mechanism: its three hands are geared together, so moving one
hand moves the others by the proportional amount. The app models this with **one number** —
the elapsed seconds within a 12-hour dial — from which every hand angle is derived.

## Requirements

| ID           | Requirement                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| REQ-TIME-001 | The clock state MUST be a single value `t`, in seconds, normalised to the range `[0, 43200)` (12 hours).                                                                                               |
| REQ-TIME-002 | Normalisation MUST wrap values in both directions (e.g. `-1 → 43199`, `43200 → 0`).                                                                                                                    |
| REQ-TIME-003 | Hand angles, in degrees clockwise from 12 o'clock, MUST be derived from `t`: hours `t / 120`, minutes `(t mod 3600) / 10`, seconds `(t mod 60) × 6`.                                                   |
| REQ-TIME-004 | The seconds hand MUST advance in one-second ticks (`floor(t mod 60) × 6`); hour and minute hands MUST sweep continuously.                                                                              |
| REQ-TIME-005 | Rotating a hand by `Δ` degrees MUST change `t` by `Δ × k` seconds, where `k` is 120 (hours), 10 (minutes) or 1/6 (seconds), so the other hands follow proportionally.                                  |
| REQ-TIME-006 | The shortest angular difference between two angles MUST be in `(-180, 180]` so a hand crossing 12 o'clock does not jump a full turn.                                                                   |
| REQ-TIME-007 | A pointer offset `(dx, dy)` from the dial centre (screen coordinates, y down) MUST map to an angle in `[0, 360)` clockwise from 12 o'clock.                                                            |
| REQ-TIME-008 | The initial value MUST be the device's local time on a 12-hour dial, including milliseconds.                                                                                                           |
| REQ-TIME-009 | `t` MUST be decomposable into the dial reading: hour `1–12`, minute `0–59`, second `0–59`.                                                                                                             |
| REQ-TIME-010 | Setting the clock with the hour or minute hand MUST keep the seconds unchanged, like the setting knob of a real wall clock: the time snaps to the nearest whole minute that keeps the original second. |

## Acceptance criteria

- **Given** `t = 3h 25m 42s`, **when** angles are derived, **then** hours = 102.85°, minutes = 154.2°, seconds = 252°.
- **Given** the clock reads 3:00:00, **when** the minute hand is rotated +90°, **then** the clock reads 3:15:00 and the hour hand moved +7.5°.
- **Given** the clock reads 3:59:30, **when** the seconds hand is rotated +180°, **then** the clock reads 4:00:00.
- **Given** the clock reads 12:00:00, **when** the hour hand is rotated −30°, **then** the clock reads 11:00:00.
- **Given** 3:00:42 and an hour/minute adjustment landing on 3:15:20, **when** it is snapped, **then** the clock reads 3:15:42.
- **Given** a hand at 350°, **when** the pointer moves to 10°, **then** the angular delta is +20°, not −340°.
- **Given** a local time of 15:25:42.500, **when** the clock starts, **then** `t = 12342.5`.

## Out of scope

- Telling AM from PM: the dial is 12-hour; the period of the day is chosen by the user (see 002/004).
