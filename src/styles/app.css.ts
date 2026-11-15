import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const main = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(16px, 3vh, 32px)',
  padding: 'max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))',
});

export const title = style({
  margin: 0,
  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.muted,
});
