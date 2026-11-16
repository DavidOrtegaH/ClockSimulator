<script lang="ts">
  import type { Clock } from '../lib/clock.svelte';
  import { angleDelta, pointerAngle, type Hand } from '../lib/time';
  import * as s from '../styles/clock.css';

  interface Props {
    clock: Clock;
  }

  let { clock }: Props = $props();

  const TICKS = Array.from({ length: 60 }, (_, i) => i);
  const NUMERALS = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const rad = (n * 30 * Math.PI) / 180;
    return { n, x: +(70 * Math.sin(rad)).toFixed(2), y: +(-70 * Math.cos(rad)).toFixed(2) };
  });

  /** Hand geometry: tail length below the pivot and tip distance above it. */
  const HANDS: ReadonlyArray<{ hand: Hand; tail: number; tip: number }> = [
    { hand: 'hours', tail: 12, tip: 48 },
    { hand: 'minutes', tail: 14, tip: 74 },
    { hand: 'seconds', tail: 20, tip: 84 },
  ];

  const HAND_NAMES: Readonly<Record<Hand, string>> = {
    hours: 'hour',
    minutes: 'minute',
    seconds: 'seconds',
  };

  /** REQ-DRAG-009: dead zone around the pivot, as a fraction of the dial radius. */
  const DEAD_ZONE = 0.15;
  /** REQ-DRAG-009: larger single-move turns mean the pointer jumped across the centre. */
  const MAX_STEP_DEG = 120;

  let dial: SVGSVGElement;
  let activePointer: number | null = null;
  /** Pointer angle at the previous move; null until a usable position is known. */
  let lastAngle: number | null = null;

  /** Angle of the pointer around the dial centre; null inside the dead zone. */
  function angleOf(e: PointerEvent): number | null {
    const r = dial.getBoundingClientRect();
    const radius = Math.min(r.width, r.height) / 2;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < radius * DEAD_ZONE) return null;
    return pointerAngle(dx, dy);
  }

  // REQ-DRAG-001/002/006: grabbing never moves a hand.
  function onpointerdown(e: PointerEvent) {
    if (!e.isPrimary || activePointer !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    activePointer = e.pointerId;
    dial.setPointerCapture(e.pointerId);
    lastAngle = angleOf(e);
    clock.beginDrag();
  }

  // REQ-DRAG-002/003/008/009: turn the hand by how far the pointer turned, like a knob.
  function onpointermove(e: PointerEvent) {
    if (e.pointerId !== activePointer) return;
    const angle = angleOf(e);
    if (angle !== null && lastAngle !== null) {
      const delta = angleDelta(lastAngle, angle);
      if (Math.abs(delta) <= MAX_STEP_DEG) clock.dragBy(delta);
    }
    lastAngle = angle;
  }

  // REQ-DRAG-004/006
  function endDrag(e: PointerEvent) {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    lastAngle = null;
    clock.endDrag();
  }

  // REQ-DRAG-007
  const KEY_STEPS: Readonly<Record<string, number>> = {
    ArrowRight: 1,
    ArrowUp: 1,
    ArrowLeft: -1,
    ArrowDown: -1,
    PageUp: 5,
    PageDown: -5,
  };

  function onkeydown(e: KeyboardEvent) {
    const units = KEY_STEPS[e.key];
    if (units === undefined) return;
    e.preventDefault();
    clock.step(units);
  }
</script>

<svg
  bind:this={dial}
  class={s.dial}
  data-dragging={clock.dragging}
  viewBox="-100 -100 200 200"
  xmlns="http://www.w3.org/2000/svg"
  role="slider"
  tabindex="0"
  aria-label="Analog clock — move the {HAND_NAMES[clock.hand]} hand"
  aria-valuemin={0}
  aria-valuemax={43199}
  aria-valuenow={clock.valueNow}
  aria-valuetext={clock.valueText}
  {onpointerdown}
  {onpointermove}
  onpointerup={endDrag}
  onpointercancel={endDrag}
  onlostpointercapture={endDrag}
  {onkeydown}
  oncontextmenu={(e) => e.preventDefault()}
>
  <circle class={s.rim} r="96" />

  {#each TICKS as i (i)}
    <line
      class={i % 5 === 0 ? s.tick.major : s.tick.minor}
      y1="-90"
      y2={i % 5 === 0 ? -80 : -85}
      transform="rotate({i * 6})"
    />
  {/each}

  {#each NUMERALS as { n, x, y } (n)}
    <text class={s.numeral} {x} {y}>{n}</text>
  {/each}

  {#each HANDS as { hand, tail, tip } (hand)}
    <line
      class="{s.hand[hand]} {clock.hand === hand ? s.handSelected : ''}"
      data-hand={hand}
      y1={tail}
      y2={-tip}
      transform="rotate({clock.angles[hand]})"
    />
  {/each}

  <circle class={s.pivot} r="5" />
  <circle class={s.pivotDot} r="1.8" />
</svg>
