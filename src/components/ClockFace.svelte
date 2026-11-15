<script lang="ts">
  import type { Clock } from '../lib/clock.svelte';
  import { pointerAngle, type Hand } from '../lib/time';
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

  let dial: SVGSVGElement;
  let activePointer: number | null = null;

  /** Angle of the pointer around the dial centre; null when too close to the pivot. */
  function angleOf(e: PointerEvent): number | null {
    const r = dial.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.04) return null;
    return pointerAngle(dx, dy);
  }

  function follow(e: PointerEvent) {
    const angle = angleOf(e);
    if (angle !== null) clock.pointHandAt(angle);
  }

  // REQ-DRAG-001/002/006
  function onpointerdown(e: PointerEvent) {
    if (!e.isPrimary || activePointer !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    activePointer = e.pointerId;
    dial.setPointerCapture(e.pointerId);
    clock.dragging = true;
    follow(e);
  }

  // REQ-DRAG-003/008
  function onpointermove(e: PointerEvent) {
    if (e.pointerId === activePointer) follow(e);
  }

  // REQ-DRAG-004/006
  function endDrag(e: PointerEvent) {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    clock.dragging = false;
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
  aria-valuenow={Math.floor(clock.time)}
  aria-valuetext="{clock.phrase.main}, {clock.phrase.seconds}"
  {onpointerdown}
  {onpointermove}
  onpointerup={endDrag}
  onpointercancel={endDrag}
  onlostpointercapture={endDrag}
  {onkeydown}
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
