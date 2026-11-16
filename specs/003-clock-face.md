# 003 — Clock face

**Status:** Implemented

## Purpose

A minimal, legible wall clock that runs in real time, with the English phrase underneath.

## Requirements

| ID           | Requirement                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-FACE-001 | The dial MUST be a scalable SVG with 60 minute ticks (every fifth one stronger) and the numbers 1–12.                                                                                                                                                                                                                                                                                          |
| REQ-FACE-002 | The dial MUST show hour, minute and seconds hands whose rotation comes from the time model (001).                                                                                                                                                                                                                                                                                              |
| REQ-FACE-003 | Hands MUST be rotated with the SVG `transform` attribute, never with inline `style` attributes (CSP, see 006).                                                                                                                                                                                                                                                                                 |
| REQ-FACE-004 | The clock MUST start at the device's local time and advance in real time while playing.                                                                                                                                                                                                                                                                                                        |
| REQ-FACE-005 | The phrase (002) MUST be displayed under the clock in a large, high-contrast font.                                                                                                                                                                                                                                                                                                             |
| REQ-FACE-006 | The title, dial, phrase and controls MUST fit in one screen (`100dvh` × `100vw`) without scrolling on any device and orientation: the dial takes the space left by the other elements, and on short landscape screens the dial sits beside the phrase and controls. This MUST hold with wider system fonts too (e.g. Linux and Android), shrinking the dial rather than cutting off a control. |
| REQ-FACE-007 | Colours MUST follow the system light/dark preference and meet WCAG AA contrast.                                                                                                                                                                                                                                                                                                                |
| REQ-FACE-008 | The hand currently selected for dragging (004) MUST be visually highlighted with the accent colour.                                                                                                                                                                                                                                                                                            |
| REQ-FACE-009 | The phrase MUST be announced to assistive technology (`aria-live="polite"`) only while the clock is paused, to avoid announcing every second.                                                                                                                                                                                                                                                  |
| REQ-FACE-010 | The layout MUST NOT shift while the time changes: the phrase reserves room for its longest wording so the dial never resizes or moves.                                                                                                                                                                                                                                                         |

## Acceptance criteria

- **Given** the page loads at 15:25:42 local time, **then** the phrase reads "It's twenty-five past three in the afternoon" and the hands point at 3:25:42.
- **Given** the clock is playing, **when** 2 seconds pass, **then** the seconds hand has advanced 12°.
- **Given** any viewport from 320 × 480 to 2560 × 1440, portrait or landscape (e.g. a phone held sideways at 740 × 360), **then** the dial, phrase and controls are fully visible with no vertical or horizontal scrolling.
- **Given** the phrase changes from "It's noon" to "It's twenty-nine minutes past twelve in the afternoon", **then** the dial keeps the same size and position.
- **Given** the minutes hand is selected, **then** the minutes hand is drawn in the accent colour and the others are not.

## Out of scope

- Themes chosen by the user, decorative skins, sounds.
