# 006 — Security & deployment

**Status:** Implemented

## Purpose

The app is a static site on GitHub Pages. It handles no user data, so security focuses on
keeping the page and the supply chain tamper-resistant.

## Requirements

| ID          | Requirement                                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-SEC-001 | The production page MUST ship a Content Security Policy that only allows same-origin scripts, styles, images and fonts, and forbids plugins, framing targets, base URI changes and form submissions. |
| REQ-SEC-002 | The app MUST NOT use inline scripts, inline style attributes, `eval`, `{@html}` or `innerHTML`.                                                                                                      |
| REQ-SEC-003 | The app MUST NOT make network requests to third parties (no CDNs, fonts, analytics) and MUST NOT store data in cookies or storage.                                                                   |
| REQ-SEC-004 | The page MUST send no referrer (`<meta name="referrer" content="no-referrer">`).                                                                                                                     |
| REQ-SEC-005 | CI MUST install with a frozen lockfile, run `pnpm audit` and fail on high-severity advisories in production dependencies.                                                                            |
| REQ-SEC-006 | GitHub Actions MUST be pinned to full commit SHAs and run with least-privilege `permissions`.                                                                                                        |
| REQ-SEC-007 | Dependabot MUST open weekly update PRs for npm packages and GitHub Actions against `develop`.                                                                                                        |
| REQ-SEC-008 | CodeQL MUST analyse the TypeScript/Svelte code and the workflows on every push and pull request to `main`/`develop`, and weekly.                                                                     |
| REQ-SEC-009 | Pull requests MUST run a dependency review that fails on new dependencies with high-severity advisories or non-permissive licences.                                                                  |
| REQ-SEC-010 | pnpm MUST refuse package versions published less than 24 hours ago (`minimumReleaseAge`) to reduce exposure to compromised releases, and only allow install scripts from an explicit allow-list.     |
| REQ-SEC-011 | Dependabot MUST wait a few days before proposing new versions and MUST NOT propose TypeScript majors the toolchain does not support yet.                                                             |
| REQ-SEC-012 | The repository MUST have private vulnerability reporting, Dependabot alerts and security updates enabled, and `main` and `develop` MUST reject force-pushes and deletion.                            |
| REQ-DEP-001 | Every push to `main` MUST build, test and deploy `dist/` to GitHub Pages at `https://davidortegah.github.io/ClockSimulator/`.                                                                        |
| REQ-DEP-002 | The site MUST be built with base path `/ClockSimulator/` so all assets resolve under the Pages URL.                                                                                                  |

## Acceptance criteria

- **Given** the production build, **then** `dist/index.html` contains the CSP meta tag and no inline `<script>` or `style=` attributes.
- **Given** the production site is loaded, **then** the browser console reports no CSP violations and every request targets the same origin.
- **Given** a commit is merged into `main`, **then** the Deploy workflow publishes it to GitHub Pages.
- **Given** a pull request that adds a dependency with a known high-severity advisory, **then** the dependency review check fails.
- **Given** a package version released one hour ago, **when** it is installed, **then** pnpm refuses it.

## Out of scope

- HTTP response headers (GitHub Pages does not allow custom headers; `frame-ancestors` cannot be set from a meta tag).
