/**
 * Reactive clock state shared by every component.
 * All behaviour is expressed in terms of the pure time model (spec 001) and phrase (spec 002).
 */
import { describeTime, type Period } from './phrase';
import { handAngles, normalize, rotateHand, snapKeepingSecond, type Hand } from './time';

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

  /** REQ-UX-004: seconds only matter to assistive tech when they are being set or frozen. */
  readonly #withSeconds = $derived(this.hand === 'seconds' || !this.playing);
  readonly valueText = $derived(
    this.#withSeconds ? `${this.phrase.main}, ${this.phrase.seconds}` : this.phrase.main,
  );
  readonly valueNow = $derived(
    this.#withSeconds ? Math.floor(this.time) : Math.floor(this.time / 60) * 60,
  );

  constructor(start: number) {
    this.time = normalize(start);
  }

  /** REQ-FACE-004: advance by real elapsed time while playing and not being dragged. */
  tick(elapsedSeconds: number): void {
    if (!this.playing || this.dragging || elapsedSeconds <= 0) return;
    this.time = normalize(this.time + elapsedSeconds);
  }

  /**
   * Unsnapped time accumulated over the current drag, plus the second to keep when
   * setting hours or minutes. Null when no drag is in progress.
   */
  #drag: { continuous: number; second: number } | null = null;

  /** REQ-DRAG-002/004: grab the selected hand without moving it and stop the clock. */
  beginDrag(): void {
    this.#drag = { continuous: this.time, second: this.time % 60 };
    this.dragging = true;
  }

  /**
   * REQ-DRAG-003: turn the selected hand by `deltaDeg`. The seconds hand carries minutes and
   * hours with it; the hour and minute hands leave the seconds still (REQ-TIME-010).
   * Deltas are accumulated unsnapped so slow drags are never lost to rounding.
   */
  dragBy(deltaDeg: number): void {
    if (!this.#drag) return;
    this.#drag.continuous = rotateHand(this.#drag.continuous, this.hand, deltaDeg);
    this.time =
      this.hand === 'seconds'
        ? this.#drag.continuous
        : snapKeepingSecond(this.#drag.continuous, this.#drag.second);
  }

  /** REQ-DRAG-004: release the hand; the clock continues from the new time if playing. */
  endDrag(): void {
    this.#drag = null;
    this.dragging = false;
  }

  /** REQ-UX-003: jump to a given time (e.g. the device clock) keeping every other setting. */
  syncTo(t: number): void {
    this.time = normalize(t);
  }

  /** REQ-DRAG-007: move the selected hand by whole units (1 h, 1 min or 1 s). */
  step(units: number): void {
    this.time = normalize(this.time + units * STEP_SECONDS[this.hand]);
  }
}

const STEP_SECONDS: Readonly<Record<Hand, number>> = { hours: 3600, minutes: 60, seconds: 1 };
