import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const phrase = style({
  margin: 0,
  maxWidth: '28ch',
  minHeight: '2.6em',
  textAlign: 'center',
  textWrap: 'balance',
});

/** REQ-FACE-005 */
export const main = style({
  display: 'block',
  fontSize: 'clamp(1.25rem, 4.5vw, 2rem)',
  fontWeight: 650,
  lineHeight: 1.25,
  color: vars.color.text,
});

export const seconds = style({
  display: 'block',
  marginTop: '0.25em',
  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
  fontWeight: 450,
  color: vars.color.muted,
});
