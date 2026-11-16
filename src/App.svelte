<script lang="ts">
  import ClockFace from './components/ClockFace.svelte';
  import Controls from './components/Controls.svelte';
  import TimePhrase from './components/TimePhrase.svelte';
  import { Clock } from './lib/clock.svelte';
  import { shortcutFor } from './lib/shortcuts';
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

  // REQ-UX-001: global keyboard shortcuts.
  function onkeydown(e: KeyboardEvent) {
    const action = shortcutFor({
      key: e.key,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      repeat: e.repeat,
      onButton: e.target instanceof HTMLButtonElement,
    });
    if (!action) return;
    e.preventDefault();
    switch (action.type) {
      case 'hand':
        clock.hand = action.hand;
        break;
      case 'toggle':
        clock.playing = !clock.playing;
        break;
      case 'period':
        clock.period = action.period;
        break;
      case 'now':
        clock.syncTo(fromDate(new Date()));
        break;
    }
  }
</script>

<svelte:window {onkeydown} />

<main class={s.main}>
  <h1 class={s.title}>Clock Simulator</h1>
  <div class={s.dialArea}>
    <ClockFace {clock} />
  </div>
  <div class={s.phraseArea}>
    <TimePhrase phrase={clock.phrase} announce={!clock.playing} />
  </div>
  <div class={s.controlsArea}>
    <Controls {clock} />
  </div>
</main>
