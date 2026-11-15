# Specifications (SpecDD)

This project follows **Spec-Driven Development**: the specification is the source of truth,
and code exists to satisfy it.

## Process

1. **Specify** — before writing code for a feature, add or update a spec in this folder on the
   feature branch and commit it first (`docs(spec): ...`).
2. **Test** — write tests that encode the acceptance criteria. Each test title cites the
   requirement ID it verifies, e.g. `REQ-TIME-003`.
3. **Implement** — write the minimum code that makes the tests pass.
4. **Review** — a feature is done when every requirement in its spec is covered by at least one
   passing test (or, for purely visual requirements, a documented manual check).
5. **Change** — behaviour changes start by editing the spec, never the code alone.

## Format

Each spec is a Markdown file named `NNN-short-name.md` with:

- **Status** — `Draft`, `Approved` or `Implemented`.
- **Purpose** — why the feature exists.
- **Requirements** — numbered, testable statements using MUST / SHOULD
  ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119)), with IDs `REQ-<AREA>-NNN`.
- **Acceptance criteria** — Given / When / Then scenarios.
- **Out of scope** — what the feature deliberately does not do.

## Index

| Spec                                                        | Area     | Status |
| ----------------------------------------------------------- | -------- | ------ |
| [001 Time model](001-time-model.md)                         | `TIME`   | —      |
| [002 Time phrase](002-time-phrase.md)                       | `PHRASE` | —      |
| [003 Clock face](003-clock-face.md)                         | `FACE`   | —      |
| [004 Controls](004-controls.md)                             | `CTRL`   | —      |
| [005 Hand dragging](005-hand-dragging.md)                   | `DRAG`   | —      |
| [006 Security & deployment](006-security-and-deployment.md) | `SEC`    | —      |
