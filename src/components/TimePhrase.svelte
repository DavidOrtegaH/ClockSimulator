<script lang="ts">
  import type { TimePhrase } from '../lib/phrase';
  import * as s from '../styles/phrase.css';

  interface Props {
    phrase: TimePhrase;
    /** REQ-FACE-009: only announce changes while the clock is still. */
    announce: boolean;
  }

  let { phrase, announce }: Props = $props();
</script>

<p class={s.phrase} data-testid="time-phrase" aria-live={announce ? 'polite' : 'off'}>
  <span class={s.main}>{phrase.main}</span>
  <span class={s.seconds}>{phrase.seconds}</span>
</p>
