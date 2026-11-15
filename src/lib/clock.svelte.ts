/**
 * Reactive clock state shared by every component.
 * All behaviour is expressed in terms of the pure time model (spec 001) and phrase (spec 002).
 */
import { describeTime, type Period } from './phrase';
import { angleDelta, exactHandAngle, handAngles, normalize, rotateHand, type Hand } from './time';

export class Clock {
  /** Seconds on a 12-hour dial — the single source of truth (REQ-TIME-001). */
  time = $state(0);
  /** Hand moved by dragging or the keyboard. */
  hand = $state<Hand>('minutes');
  playing = $state(true);
  period = $state<Period>('day');
  dragging = $state(false);

  readonly angles = $derived(handAngles(this.time));
  readonly phrase = $derived(describeTime(this.time, this.period));

  constructor(start: number) {
    this.time = normalize(start);
  }

  /** REQ-FACE-004: advance by real elapsed time while playing and not being dragged. */
  tick(elapsedSeconds: number): void {
    if (!this.playing || this.dragging || elapsedSeconds <= 0) return;
    this.time = normalize(this.time + elapsedSeconds);
  }

  /**
   * REQ-DRAG-002/003: turn the selected hand the shortest way until it points at `angle`
   * (degrees clockwise from 12). The other hands follow through the shared time value.
   */
  pointHandAt(angle: number): void {
    const delta = angleDelta(exactHandAngle(this.time, this.hand), angle);
    this.time = rotateHand(this.time, this.hand, delta);
  }

  /** REQ-DRAG-007: move the selected hand by whole units (1 h, 1 min or 1 s). */
  step(units: number): void {
    this.time = normalize(this.time + units * STEP_SECONDS[this.hand]);
  }
}

const STEP_SECONDS: Readonly<Record<Hand, number>> = { hours: 3600, minutes: 60, seconds: 1 };
