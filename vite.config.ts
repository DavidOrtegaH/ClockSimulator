import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/** REQ-SEC-001: same-origin only, no inline code, no plugins, no forms. */
const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

/**
 * Injects the CSP into production HTML only — the dev server relies on inline styles for
 * hot module replacement. GitHub Pages cannot send custom headers, so a meta tag is used.
 */
function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
        injectTo: 'head-prepend',
      },
    ],
  };
}

export default defineConfig({
  // REQ-DEP-002: served from https://davidortegah.github.io/ClockSimulator/
  base: '/ClockSimulator/',
  plugins: [svelte(), vanillaExtractPlugin(), contentSecurityPolicy()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
