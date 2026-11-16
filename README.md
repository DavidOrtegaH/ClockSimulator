# Clock Simulator

An analog wall clock you can play with. You grab a hand with your finger or the mouse, turn
it, and the clock tells you the time in plain English underneath, the way you'd say it out
loud: _"It's twenty-five past three in the afternoon"_.

**Try it:** https://davidortegah.github.io/ClockSimulator/

I built it as a practice project to learn a stack I had never touched before, and to work
the way I'd like to work on real projects: specs first, tests for everything, small
branches and a clean history.

## How it works

The clock starts at your device's local time and keeps running. Under the dial there are a
few controls:

| Control                   | What it does                                                        | Key         |
| ------------------------- | ------------------------------------------------------------------- | ----------- |
| Hours / Minutes / Seconds | Chooses which hand you move when you drag the dial                  | `H` `M` `S` |
| Pause / Play              | Stops and restarts the clock                                        | `Space` `K` |
| Now                       | Puts the clock back on your device's time                           | `T`         |
| Day / Night               | Decides if the sentence says "morning/afternoon" or "evening/night" | `D` `N`     |

You can also focus the dial and use the arrow keys (one unit) or Page Up / Page Down (five
units) to move the selected hand.

Moving a hand works like setting a real clock:

- Turn the **minute hand** past 12 and the hour moves on to the next one.
- Turn the **hour hand** and the minute hand sweeps around with it.
- Turn the **seconds hand** and the minutes and hours follow.
- When you set the hours or minutes, the seconds stay where they are, just like turning
  the little knob on the back of a wall clock.

An analog dial can't tell 3 a.m. from 3 p.m., so the Day / Night switch decides how the
sentence ends. It starts on Day.

It works on phones, tablets and computers, in portrait and landscape, and everything
always fits on one screen without scrolling. It follows your system's light or dark mode
and can be added to your home screen.

## What I learned, what went wrong and how I fixed it

### Things I learned

- **Svelte 5 and its runes.** I keep the whole state in one small class with `$state` and
  `$derived`, and the components just read from it. No store library needed.
- **vanilla-extract.** Writing styles in TypeScript felt strange at first, but having typed
  design tokens and getting plain static CSS at build time turned out to be really handy,
  especially for the security policy (more on that below).
- **Spec-Driven Development.** Every feature started as a short spec in [`specs/`](specs/)
  with numbered requirements, and every test names the requirement it checks. When I
  changed my mind about a behaviour, I changed the spec first. It forced me to think about
  edge cases before writing code instead of after.
- **Pointer Events.** One set of handlers covers mouse, touch and pen. I didn't need any
  separate touch code.
- **Testing things that depend on time.** Playwright can fake the browser clock, so I can
  start the app at exactly 15:25:42, move time forward two seconds and check the hands.
- **How English tells the time.** "A quarter to noon", "seven minutes past twelve", "ten
  to six in the afternoon" (the period follows the hour on the dial, not the one you name).
  Writing the rules down as a table of examples before coding saved me a lot of back and
  forth.

### Problems and how I solved them

**Keeping the three hands in sync.** My first idea was to store hours, minutes and seconds
separately, but then every drag had to update three values and they could drift apart. I
ended up storing a single number, the seconds elapsed on a 12-hour dial, and calculating
every angle from it. If the hands are always derived from the same number, they can't
disagree.

**Crossing 12 o'clock.** Going from 350° to 10° looked like a turn of −340° and the hand
flew all the way round. I now use the shortest angle between two positions, so that move
is +20°.

**Hands jumping when you touch the dial.** At first, pressing the dial snapped the selected
hand to your finger. If you missed the hour hand by a couple of degrees, the minute hand
jumped a long way. I changed it so the hand turns by however much your finger turns around
the centre, like a knob, and pressing alone never moves anything. I also ignore touches very
close to the centre and any single movement bigger than 120°, which only happens when your
finger crosses the middle.

**The seconds hand going crazy.** One degree of the hour hand is two minutes, so dragging
the hour hand made the seconds hand spin hundreds of times and look random. Now setting
hours or minutes keeps the seconds still and moves in whole minutes. The trick was keeping
an unrounded total during the drag and only rounding what's shown. Otherwise slow drags
were lost to rounding and the hand wouldn't move at all.

**The clock jumping up and down.** When the sentence changed from one line to two, the
whole clock moved. The text now always reserves two lines.

**Fitting every screen.** A fixed size never worked everywhere, especially on phones held
sideways. I switched to a full-height grid where the dial takes whatever space is left, and
used container queries so the dial is always the biggest square that fits. On short
landscape screens the dial goes on the left and the text and buttons on the right. There's
a test that opens the app on twelve different screen sizes and checks nothing scrolls or
gets cut off.

**A security policy on GitHub Pages.** Pages doesn't let you set HTTP headers, so the
Content Security Policy goes in a `<meta>` tag. The dev server needs inline styles for hot
reload, so I only add the policy to the production build. Because vanilla-extract produces
normal CSS files, I didn't need `'unsafe-inline'`, and the hands are rotated with SVG
attributes instead of inline styles.

**Screen readers talking non-stop.** The dial is a slider for keyboard and screen reader
users, and its value changed every second while the clock was running. Now it only
includes the seconds when you're moving the seconds hand or the clock is paused.

**An accessibility audit that failed for the wrong reason.** The automated audit reported
low contrast on the buttons. It turned out it was measuring the colours halfway through the
150 ms transition after a click. Running it with reduced motion (which the app already
respects) gave the real colours, and they pass.

**A dependency update that broke the build.** An automatic update tried to move to
TypeScript 7, which my type checker doesn't support yet. I stayed on TypeScript 6 and told
Dependabot to skip that major version for now.

### What I achieved

- A working app, published automatically on every release:
  https://davidortegah.github.io/ClockSimulator/
- 8 specs and every requirement covered by a test: 48 unit tests and about 90 browser tests
  run on a desktop and a phone profile.
- Zero issues in an automated WCAG 2.2 AA accessibility audit, in light and dark mode.
- A strict security policy, no third-party requests, no cookies or storage, and checks on
  every push (CodeQL, dependency audit, dependency review on pull requests).
- A clean Git history with Conventional Commits, enforced by a commit hook.

## Tech stack

| Area    | Tool                                                       |
| ------- | ---------------------------------------------------------- |
| UI      | [Svelte 5](https://svelte.dev) + TypeScript                |
| Build   | [Vite](https://vite.dev)                                   |
| Styles  | [vanilla-extract](https://vanilla-extract.style)           |
| Tests   | Vitest, Playwright, axe-core                               |
| Tooling | pnpm, ESLint, Prettier, svelte-check, commitlint, Lefthook |
| CI / CD | GitHub Actions, CodeQL, Dependabot, GitHub Pages           |

## Running it locally

You need Node.js 24 (there's an `.nvmrc`) and pnpm.

```bash
pnpm install                              # also installs the git hooks
pnpm exec playwright install chromium     # once, for the browser tests
pnpm dev                                  # http://localhost:5173/ClockSimulator/
```

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `pnpm dev`      | Development server                 |
| `pnpm build`    | Production build in `dist/`        |
| `pnpm preview`  | Serves the production build        |
| `pnpm test`     | Unit tests                         |
| `pnpm test:e2e` | Browser tests (desktop and mobile) |
| `pnpm lint`     | Prettier and ESLint                |
| `pnpm check`    | Type checking                      |

## Project structure

```
specs/              one spec per feature, written before the code
src/lib/            time model, English phrase, shortcuts, clock state
src/components/     ClockFace, TimePhrase, Controls
src/styles/         vanilla-extract styles and design tokens
e2e/                Playwright tests
.github/            CI, deploy, CodeQL, Dependabot
```

## How I work on it

- **Specs first.** New behaviour starts in [`specs/`](specs/README.md). Tests cite the
  requirement IDs (for example `REQ-DRAG-003`).
- **Git Flow.** `main` is what's live, `develop` collects finished work, and every change
  goes through a `feature/*` branch. Releases go through `release/*`, get a tag and are
  merged back into `develop`.
- **Conventional Commits** in English (`feat:`, `fix:`, `docs:`, `test:`...). A commit hook
  checks the message and lints the staged files.

Changes are listed in the [changelog](CHANGELOG.md). If you find a security problem, please
read [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © David Ortega
