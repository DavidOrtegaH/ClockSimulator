import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from '@vanilla-extract/css';

/** Design tokens shared by every component. */
export const vars = createGlobalThemeContract(
  {
    color: {
      bg: 'bg',
      surface: 'surface',
      text: 'text',
      muted: 'muted',
      line: 'line',
      accent: 'accent',
      accentText: 'accent-text',
      focus: 'focus',
    },
    font: { body: 'font-body', mono: 'font-mono' },
    radius: { pill: 'radius-pill' },
  },
  (value) => `clock-${value}`,
);

const shared = {
  font: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  },
  radius: { pill: '999px' },
};

createGlobalTheme(':root', vars, {
  color: {
    bg: '#f4f4f1',
    surface: '#ffffff',
    text: '#1c1c1e',
    muted: '#5c5c62',
    line: '#d6d6d1',
    accent: '#c2410c',
    accentText: '#ffffff',
    focus: '#1d4ed8',
  },
  ...shared,
});

globalStyle(':root', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: assignVars(vars.color, {
        bg: '#111113',
        surface: '#1c1c1f',
        text: '#f2f2f0',
        muted: '#a6a6ad',
        line: '#3a3a40',
        accent: '#fb923c',
        accentText: '#111113',
        focus: '#93c5fd',
      }),
    },
  },
});

globalStyle('*, *::before, *::after', { boxSizing: 'border-box' });

globalStyle('html, body', {
  margin: 0,
  minHeight: '100%',
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  WebkitTextSizeAdjust: '100%',
});

globalStyle('body', {
  minHeight: '100dvh',
  WebkitFontSmoothing: 'antialiased',
});

globalStyle(':focus-visible', {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: '3px',
});

globalStyle('*', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transitionDuration: '0s !important',
      animationDuration: '0s !important',
    },
  },
});
