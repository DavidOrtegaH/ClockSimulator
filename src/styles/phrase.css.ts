import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const phrase = style({
  margin: 0,
  width: '100%',
  textAlign: 'center',
});

/**
 * REQ-FACE-005/010: large and legible, and always two lines tall so a longer or shorter
 * wording never resizes or moves the dial. Font sizes follow the smaller viewport side so
 * the text also fits short landscape screens.
 */
export const main = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '24ch',
  minHeight: '2.5em',
  marginInline: 'auto',
  fontSize: 'clamp(1.1rem, min(4.5vw, 4.2dvh), 2rem)',
  fontWeight: 650,
  lineHeight: 1.25,
  textWrap: 'balance',
  color: vars.color.text,
});

export const seconds = style({
  display: 'block',
  marginTop: '0.2em',
  fontSize: 'clamp(0.9rem, min(3vw, 2.8dvh), 1.25rem)',
  lineHeight: 1.25,
  fontWeight: 450,
  color: vars.color.muted,
});
