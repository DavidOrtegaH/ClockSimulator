<script lang="ts">
  import ClockFace from './components/ClockFace.svelte';
  import TimePhrase from './components/TimePhrase.svelte';
  import { Clock } from './lib/clock.svelte';
  import { fromDate } from './lib/time';
  import * as s from './styles/app.css';

  const clock = new Clock(fromDate(new Date()));

  // REQ-FACE-004: advance with the real elapsed time between animation frames.
  $effect(() => {
    let last = performance.now();
    let frame = requestAnimationFrame(function loop(now) {
      clock.tick((now - last) / 1000);
      last = now;
      frame = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frame);
  });
</script>

<main class={s.main}>
  <h1 class={s.title}>Clock Simulator</h1>
  <ClockFace {clock} />
  <TimePhrase phrase={clock.phrase} announce={!clock.playing} />
</main>
