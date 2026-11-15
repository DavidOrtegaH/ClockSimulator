# 005 — Hand dragging

**Status:** Implemented

## Purpose

The user sets the clock by moving the selected hand with a finger (phones, tablets) or the
mouse (computers). Like turning the crown of a real clock, the other hands follow.

## Requirements

| ID           | Requirement                                                                                                                                                                                                                                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-DRAG-001 | Dragging MUST use Pointer Events so mouse, touch and pen share one code path, and capture the pointer so the drag continues outside the dial.                                                                                                                                                                                                      |
| REQ-DRAG-002 | Pressing on the dial MUST NOT move any hand. Dragging MUST turn the selected hand (004) by the angle the pointer turns around the dial centre, like turning a knob, so the hand never jumps.                                                                                                                                                       |
| REQ-DRAG-003 | Each movement MUST rotate the selected hand by the shortest angular delta (REQ-TIME-006), accumulated over the whole drag. Dragging the seconds hand MUST move minutes and hours proportionally (REQ-TIME-005); dragging the hour or minute hand MUST keep the seconds still (REQ-TIME-010). The hour MUST advance when the minute hand passes 12. |
| REQ-DRAG-004 | The clock MUST NOT advance while a hand is being dragged; when released it MUST continue from the new time if playing, or stay still if paused.                                                                                                                                                                                                    |
| REQ-DRAG-005 | The dial MUST disable browser touch gestures (`touch-action: none`) so dragging does not scroll or zoom the page.                                                                                                                                                                                                                                  |
| REQ-DRAG-006 | Only the primary pointer MUST drag; a second finger MUST be ignored. A cancelled pointer MUST end the drag.                                                                                                                                                                                                                                        |
| REQ-DRAG-007 | The dial MUST be a keyboard-focusable slider: ←/↓ and →/↑ move the selected hand one unit (1 hour, 1 minute or 1 second), PageDown/PageUp five units, and its `aria-valuetext` MUST be the phrase.                                                                                                                                                 |
| REQ-DRAG-008 | The phrase (002) MUST update live while dragging.                                                                                                                                                                                                                                                                                                  |
| REQ-DRAG-009 | Pointer positions within 15 % of the radius from the centre MUST be ignored, and the drag MUST resume from the next position outside that zone without jumping. A single movement that turns more than 120° (the pointer crossing the centre between two events) MUST be discarded the same way.                                                   |

## Acceptance criteria

- **Given** 3:00:00 with Minutes selected, **when** the user presses anywhere on the dial without moving, **then** no hand moves.
- **Given** 3:00:00 with Minutes selected, **when** the user drags a quarter turn clockwise around the centre, **then** the clock reads 3:15:00 and the hour hand moved 7.5°.
- **Given** 3:50:00 with Minutes selected, **when** the user drags a third of a turn clockwise, **then** the clock reads 4:10:00.
- **Given** 3:00:42 with Hours selected, **when** the user drags a quarter turn clockwise, **then** the clock reads 6:00:42 and the seconds hand never moved.
- **Given** 3:00:00 with Seconds selected, **when** the user drags a quarter turn anticlockwise, **then** the clock reads 2:59:45.
- **Given** a drag that passes through the centre of the dial, **then** the hands do not jump.
- **Given** a playing clock, **when** the user holds the hand still for 2 seconds, **then** the time does not change.
- **Given** Minutes selected and the dial focused, **when** the user presses → twice, **then** the clock advanced two minutes.
- **Given** a touch screen, **when** the user drags on the dial, **then** the page does not scroll.

## Out of scope

- Inertia / flick gestures; multi-touch to move two hands at once.
