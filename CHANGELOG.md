# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-11-15

### Fixed

- Hands no longer jump when you press the dial: dragging now turns the selected hand by how far the pointer turns, like a knob ([spec 005](specs/005-hand-dragging.md)).
- Setting the time with the hour or minute hand keeps the seconds still instead of spinning the seconds hand; the minute hand moves in whole minutes ([spec 001](specs/001-time-model.md)).
- Pointer moves near the centre of the dial, or across it, are ignored instead of flipping the hand.
- The clock no longer moves up and down when the phrase changes length.
- Everything fits in one screen without scrolling on phones, tablets and desktops, in portrait and landscape ([spec 003](specs/003-clock-face.md)).

## [1.0.0] — 2026-11-15

### Added

- Analog wall clock rendered as a scalable SVG, starting at the device's local time ([spec 003](specs/003-clock-face.md)).
- Geared time model: moving any hand moves the others proportionally ([spec 001](specs/001-time-model.md)).
- Natural-language English phrase under the clock, e.g. "It's twenty-five past three in the afternoon" ([spec 002](specs/002-time-phrase.md)).
- Hours / Minutes / Seconds selector, Play / Pause and Day / Night controls ([spec 004](specs/004-controls.md)).
- Drag the selected hand with touch, mouse or pen, or step it with the keyboard ([spec 005](specs/005-hand-dragging.md)).
- Strict Content Security Policy, CI with audit, Dependabot and GitHub Pages deployment ([spec 006](specs/006-security-and-deployment.md)).

[1.0.0]: https://github.com/DavidOrtegaH/ClockSimulator/releases/tag/v1.0.0
[1.1.0]: https://github.com/DavidOrtegaH/ClockSimulator/releases/tag/v1.1.0
