# 004 — Controls

**Status:** Implemented

## Purpose

Buttons under the phrase let the user choose which hand to move, stop and resume the clock,
and choose whether the time is read as day or night.

## Requirements

| ID           | Requirement                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-CTRL-001 | Three buttons labelled **Hours**, **Minutes** and **Seconds** MUST select which hand is moved; exactly one is selected at a time, exposed with `aria-pressed`. |
| REQ-CTRL-002 | **Minutes** MUST be selected by default.                                                                                                                       |
| REQ-CTRL-003 | A fourth button MUST toggle between **Pause** (while running) and **Play** (while paused), with a matching icon and accessible name.                           |
| REQ-CTRL-004 | While paused the clock MUST NOT advance; on Play it MUST continue from the time currently shown.                                                               |
| REQ-CTRL-005 | A **Day** / **Night** switch MUST choose the period used by the phrase (002); **Day** MUST be the default.                                                     |
| REQ-CTRL-006 | Every control MUST be reachable and operable with the keyboard, show a visible focus ring, and have a touch target of at least 44 × 44 px.                     |
| REQ-CTRL-007 | Controls MUST wrap onto multiple rows on narrow screens without horizontal scrolling.                                                                          |

## Acceptance criteria

- **Given** the app has loaded, **then** Minutes is pressed and Hours and Seconds are not.
- **Given** Minutes is selected, **when** the user presses Hours, **then** Hours is pressed, Minutes is not, and the hour hand is highlighted.
- **Given** the clock is running, **when** the user presses Pause, **then** after 3 seconds the phrase is unchanged and the button reads Play.
- **Given** the clock is paused, **when** the user presses Play, **then** the clock advances again.
- **Given** 9:00 and Day, **when** the user presses Night, **then** the phrase reads "It's nine o'clock at night".

## Out of scope

- Remembering choices between visits.
