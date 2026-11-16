<script lang="ts">
  import type { Clock } from '../lib/clock.svelte';
  import type { Period } from '../lib/phrase';
  import { SHORTCUT_KEYS } from '../lib/shortcuts';
  import { fromDate, type Hand } from '../lib/time';
  import * as s from '../styles/controls.css';

  interface Props {
    clock: Clock;
  }

  let { clock }: Props = $props();

  const HANDS: ReadonlyArray<{ value: Hand; label: string }> = [
    { value: 'hours', label: 'Hours' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'seconds', label: 'Seconds' },
  ];

  const PERIODS: ReadonlyArray<{ value: Period; label: string }> = [
    { value: 'day', label: 'Day' },
    { value: 'night', label: 'Night' },
  ];

  /** Tooltip text such as "Hours (H)" or "Pause (Space or K)" (REQ-UX-002). */
  const tip = (label: string, keys: string) => `${label} (${keys.split(' ').join(' or ')})`;
</script>

<div class={s.controls}>
  <!-- REQ-CTRL-001/002 -->
  <div class={s.group} role="group" aria-label="Hand to move">
    {#each HANDS as { value, label } (value)}
      <button
        type="button"
        class={s.button}
        aria-pressed={clock.hand === value}
        aria-keyshortcuts={SHORTCUT_KEYS[value]}
        title={tip(label, SHORTCUT_KEYS[value])}
        onclick={() => (clock.hand = value)}>{label}</button
      >
    {/each}
  </div>

  <div class={s.pair}>
    <!-- REQ-CTRL-003/004 -->
    <button
      type="button"
      class={s.toggle}
      aria-keyshortcuts={SHORTCUT_KEYS.toggle}
      title={tip(clock.playing ? 'Pause' : 'Play', SHORTCUT_KEYS.toggle)}
      onclick={() => (clock.playing = !clock.playing)}
    >
      <svg class={s.icon} viewBox="0 0 24 24" aria-hidden="true">
        {#if clock.playing}
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        {:else}
          <path
            d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"
          />
        {/if}
      </svg>
      {clock.playing ? 'Pause' : 'Play'}
    </button>

    <!-- REQ-UX-003 -->
    <button
      type="button"
      class={s.solo}
      aria-keyshortcuts={SHORTCUT_KEYS.now}
      title={tip('Back to the current time', SHORTCUT_KEYS.now)}
      onclick={() => clock.syncTo(fromDate(new Date()))}
    >
      <svg class={s.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 1-8.49 6h2.17A7 7 0 1 0 12 5v3L7.5 4 12 0v3Z M11 8h2v4.6l3.2 1.9-1 1.7L11 13.7V8Z"
        />
      </svg>
      Now
    </button>
  </div>

  <!-- REQ-CTRL-005 -->
  <div class={s.group} role="group" aria-label="Time of day">
    {#each PERIODS as { value, label } (value)}
      <button
        type="button"
        class={s.button}
        aria-pressed={clock.period === value}
        aria-keyshortcuts={SHORTCUT_KEYS[value]}
        title={tip(label, SHORTCUT_KEYS[value])}
        onclick={() => (clock.period = value)}
      >
        <svg class={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          {#if value === 'day'}
            <circle cx="12" cy="12" r="4.5" />
            <path
              d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          {:else}
            <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
          {/if}
        </svg>
        {label}
      </button>
    {/each}
  </div>
</div>
