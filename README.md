# Clock Simulator

An interactive analog wall clock for the web. Drag the hands with your finger or mouse,
and read the time in plain English underneath.

**Live demo:** https://davidortegah.github.io/ClockSimulator/

## Features

- Analog clock that runs in real time, starting from your device's local time.
- Pick which hand to move — **Hours**, **Minutes** or **Seconds** — and drag it.
  The other hands follow like a real geared clock.
- **Play / Pause** the clock.
- **Day / Night** toggle that decides whether the phrase says "in the morning",
  "in the afternoon", "in the evening" or "at night".
- Natural-language time, e.g. _"It's twenty-five past three in the afternoon — and 42 seconds"_.
- Responsive, minimal, keyboard accessible, light & dark themes.

## Tech stack

| Area    | Choice                                              |
| ------- | --------------------------------------------------- |
| UI      | [Svelte 5](https://svelte.dev) + TypeScript         |
| Build   | [Vite](https://vite.dev)                            |
| Styling | [vanilla-extract](https://vanilla-extract.style)    |
| Tests   | Vitest (unit) + Playwright (end-to-end)             |
| CI/CD   | GitHub Actions → GitHub Pages                       |

## Getting started

Requires Node.js ≥ 22 and pnpm.

```bash
pnpm install
pnpm dev          # start the dev server
pnpm test         # unit tests
pnpm test:e2e     # end-to-end tests (run `pnpm exec playwright install chromium` once)
pnpm lint         # ESLint + Prettier
pnpm check        # svelte-check type checking
pnpm build        # production build in dist/
```

## Development workflow

### Spec-Driven Development (SpecDD)

Every feature starts as a specification in [`specs/`](specs/README.md) before any code is
written. Specs list numbered requirements (e.g. `REQ-TIME-001`) with Given/When/Then
acceptance criteria, and tests reference those IDs.

### Branching (Git Flow)

| Branch      | Purpose                                         |
| ----------- | ----------------------------------------------- |
| `main`      | Production. Every push deploys to GitHub Pages. |
| `develop`   | Integration branch for the next release.        |
| `feature/*` | One branch per feature, merged into `develop`.  |
| `release/*` | Release preparation, merged into `main` and back into `develop`. |

### Commits

[Conventional Commits](https://www.conventionalcommits.org) in English:
`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`, `style:`.

## License

[MIT](LICENSE)
