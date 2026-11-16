# 007 — Usability

**Status:** Implemented

## Purpose

Small touches that make the clock quicker to use and friendlier on every device, without
adding visual clutter.

## Requirements

| ID         | Requirement                                                                                                                                                                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-UX-001 | Keyboard shortcuts MUST select the hand (**H**, **M**, **S**), toggle Play/Pause (**Space** or **K**), choose Day/Night (**D**, **N**) and reset to the current time (**T**). They MUST be ignored when a modifier key (Ctrl, Alt, Meta) is held, and Space MUST NOT be hijacked while a button has focus. |
| REQ-UX-002 | Each control MUST expose its shortcut with `aria-keyshortcuts` and a tooltip.                                                                                                                                                                                                                              |
| REQ-UX-003 | A **Now** button MUST set the clock back to the device's current local time without changing Play/Pause, the selected hand or Day/Night.                                                                                                                                                                   |
| REQ-UX-004 | The dial's `aria-valuetext` MUST only include the seconds when the seconds hand is selected or the clock is paused, so screen readers are not flooded every second while it runs.                                                                                                                          |
| REQ-UX-005 | Long-pressing the dial on a touch screen MUST NOT open the context menu or select text.                                                                                                                                                                                                                    |
| REQ-UX-006 | The app MUST be installable on a home screen (web app manifest, theme colour) and show a short message when JavaScript is disabled.                                                                                                                                                                        |
| REQ-UX-007 | The page MUST provide Open Graph metadata so shared links show a title and description.                                                                                                                                                                                                                    |

## Acceptance criteria

- **Given** the app has loaded, **when** the user presses **H**, **then** Hours is selected; **when** they press **Space**, **then** the clock pauses.
- **Given** the Pause button has focus, **when** the user presses **Space**, **then** the clock toggles only once.
- **Given** the user moved the clock to 9:00, **when** they press **Now**, **then** the clock shows the device time again and keeps running.
- **Given** the clock is running with Minutes selected, **then** the dial's `aria-valuetext` reads like "It's twenty-five past three in the afternoon" without seconds.

## Out of scope

- Offline support through a service worker.
