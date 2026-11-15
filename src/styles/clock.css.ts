import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from './theme.css';

/** REQ-FACE-006 */
export const dial = style({
  display: 'block',
  width: 'min(90vw, 60dvh, 520px)',
  height: 'auto',
  aspectRatio: '1',
  borderRadius: '50%',
  cursor: 'grab',
  // REQ-DRAG-005: the dial owns all touch gestures.
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitTapHighlightColor: 'transparent',
  selectors: {
    '&[data-dragging="true"]': { cursor: 'grabbing' },
  },
});

export const rim = style({
  fill: vars.color.surface,
  stroke: vars.color.text,
  strokeWidth: 3,
});

export const tick = styleVariants({
  minor: { stroke: vars.color.muted, strokeWidth: 1, strokeLinecap: 'round' },
  major: { stroke: vars.color.text, strokeWidth: 2.5, strokeLinecap: 'round' },
});

export const numeral = style({
  fill: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: 13,
  fontWeight: 500,
  textAnchor: 'middle',
  dominantBaseline: 'central',
});

const handBase = style({
  strokeLinecap: 'round',
  transition: 'stroke 150ms ease',
});

export const hand = styleVariants({
  hours: [handBase, { stroke: vars.color.text, strokeWidth: 6 }],
  minutes: [handBase, { stroke: vars.color.text, strokeWidth: 4 }],
  seconds: [handBase, { stroke: vars.color.muted, strokeWidth: 1.6 }],
});

/** REQ-FACE-008 */
export const handSelected = style({
  stroke: vars.color.accent,
});

export const pivot = style({
  fill: vars.color.text,
});

export const pivotDot = style({
  fill: vars.color.surface,
});
