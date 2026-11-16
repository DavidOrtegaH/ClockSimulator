import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

/** REQ-CTRL-007 */
export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5dvh, 12px) 12px',
  maxWidth: '100%',
});

export const group = style({
  display: 'inline-flex',
  gap: 4,
  padding: 4,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.pill,
  background: vars.color.surface,
});

/** REQ-CTRL-006: ≥ 44 px targets. */
export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minWidth: 44,
  minHeight: 44,
  padding: '0 16px',
  border: 'none',
  borderRadius: vars.radius.pill,
  background: 'transparent',
  color: vars.color.text,
  font: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  transition: 'background-color 150ms ease, color 150ms ease',
  selectors: {
    '&[aria-pressed="true"]': {
      background: vars.color.accent,
      color: vars.color.accentText,
    },
    '&:hover:not([aria-pressed="true"])': {
      background: vars.color.bg,
    },
  },
  '@media': {
    '(max-width: 380px)': { padding: '0 12px' },
  },
});

export const solo = style([
  button,
  {
    border: `1px solid ${vars.color.line}`,
    background: vars.color.surface,
    paddingLeft: 14,
    paddingRight: 16,
  },
]);

/** Same width for "Pause" and "Play" so the row never shifts (REQ-FACE-010). */
export const toggle = style([solo, { minWidth: '6.75rem' }]);

/** Keeps Pause/Play and Now together when the row wraps. */
export const pair = style({
  display: 'inline-flex',
  gap: 8,
});

export const icon = style({
  width: 18,
  height: 18,
  flexShrink: 0,
  fill: 'currentColor',
});
