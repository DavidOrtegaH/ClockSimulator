# 003 — Clock face

**Status:** Implemented

## Purpose

A minimal, legible wall clock that runs in real time, with the English phrase underneath.

## Requirements

| ID           | Requirement                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-FACE-001 | The dial MUST be a scalable SVG with 60 minute ticks (every fifth one stronger) and the numbers 1–12.                                                |
| REQ-FACE-002 | The dial MUST show hour, minute and seconds hands whose rotation comes from the time model (001).                                                    |
| REQ-FACE-003 | Hands MUST be rotated with the SVG `transform` attribute, never with inline `style` attributes (CSP, see 006).                                       |
| REQ-FACE-004 | The clock MUST start at the device's local time and advance in real time while playing.                                                              |
| REQ-FACE-005 | The phrase (002) MUST be displayed under the clock in a large, high-contrast font.                                                                   |
| REQ-FACE-006 | The dial MUST size itself to `min(90vw, 60dvh)` (capped at 520 px) so the clock, phrase and controls fit one screen on phones, tablets and desktops. |
| REQ-FACE-007 | Colours MUST follow the system light/dark preference and meet WCAG AA contrast.                                                                      |
| REQ-FACE-008 | The hand currently selected for dragging (004) MUST be visually highlighted with the accent colour.                                                  |
| REQ-FACE-009 | The phrase MUST be announced to assistive technology (`aria-live="polite"`) only while the clock is paused, to avoid announcing every second.        |

## Acceptance criteria

- **Given** the page loads at 15:25:42 local time, **then** the phrase reads "It's twenty-five past three in the afternoon" and the hands point at 3:25:42.
- **Given** the clock is playing, **when** 2 seconds pass, **then** the seconds hand has advanced 12°.
- **Given** a 360 × 740 viewport, **then** the dial, phrase and controls are visible without horizontal scrolling.
- **Given** the minutes hand is selected, **then** the minutes hand is drawn in the accent colour and the others are not.

## Out of scope

- Themes chosen by the user, decorative skins, sounds.
