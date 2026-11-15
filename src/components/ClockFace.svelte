<script lang="ts">
  import type { Clock } from '../lib/clock.svelte';
  import type { Hand } from '../lib/time';
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
</script>

<svg
  class={s.dial}
  viewBox="-100 -100 200 200"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Analog clock"
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
