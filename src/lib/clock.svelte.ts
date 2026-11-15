/**
 * Reactive clock state shared by every component.
 * All behaviour is expressed in terms of the pure time model (spec 001) and phrase (spec 002).
 */
import { describeTime, type Period } from './phrase';
import { handAngles, normalize, type Hand } from './time';

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
}
