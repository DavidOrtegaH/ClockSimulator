import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

/** Short landscape screens (phones held sideways) put the dial beside the text. */
export const SIDE_BY_SIDE = '(orientation: landscape) and (max-height: 600px)';

/**
 * REQ-FACE-006: exactly one screen tall. The dial row absorbs whatever space the title,
 * phrase and controls leave, so nothing ever scrolls.
 */
export const main = style({
  boxSizing: 'border-box',
  height: '100vh',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gridTemplateRows: 'auto minmax(0, 1fr) auto auto',
  gridTemplateAreas: '"title" "dial" "phrase" "controls"',
  justifyItems: 'center',
  alignItems: 'center',
  rowGap: 'clamp(8px, 2.5dvh, 28px)',
  paddingTop: 'max(12px, env(safe-area-inset-top))',
  paddingRight: 'max(16px, env(safe-area-inset-right))',
  paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
  paddingLeft: 'max(16px, env(safe-area-inset-left))',
  overflow: 'hidden',
  '@supports': {
    '(height: 100dvh)': { height: '100dvh' },
  },
  '@media': {
    [SIDE_BY_SIDE]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gridTemplateRows: 'minmax(0, 1fr) auto auto auto minmax(0, 1fr)',
      gridTemplateAreas: '"dial ." "dial title" "dial phrase" "dial controls" "dial ."',
      columnGap: 24,
      rowGap: 'clamp(6px, 2dvh, 16px)',
    },
  },
});

export const title = style({
  gridArea: 'title',
  margin: 0,
  fontSize: 'clamp(0.75rem, min(2.5vw, 2.4dvh), 1.25rem)',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.muted,
});

/** Size container for the dial: the SVG fills the largest square that fits (REQ-FACE-006). */
export const dialArea = style({
  gridArea: 'dial',
  alignSelf: 'stretch',
  justifySelf: 'stretch',
  minHeight: 0,
  minWidth: 0,
  display: 'grid',
  placeItems: 'center',
  containerType: 'size',
});

export const phraseArea = style({
  gridArea: 'phrase',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

export const controlsArea = style({
  gridArea: 'controls',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});
