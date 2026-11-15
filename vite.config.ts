import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Served from https://<user>.github.io/ClockSimulator/
  base: '/ClockSimulator/',
  plugins: [svelte(), vanillaExtractPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
