# 008 — Quality gates

**Status:** Implemented

## Purpose

Automatic checks that keep the project consistent without having to remember them: commit
messages, accessibility, formatting and the runtime version.

## Requirements

| ID         | Requirement                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-QA-001 | Commit messages MUST follow Conventional Commits in English; a local `commit-msg` hook MUST reject non-compliant messages and CI MUST check every commit of a pull request. |
| REQ-QA-002 | A local `pre-commit` hook MUST check formatting and lint the staged files so broken code is caught before it reaches CI.                                                    |
| REQ-QA-003 | An automated accessibility audit (axe-core, WCAG 2.2 A/AA rules) MUST report zero violations in light and dark mode, both while running and paused.                         |
| REQ-QA-004 | The Node.js version used locally MUST match CI (`.nvmrc`), and editors MUST share indentation and line-ending rules (`.editorconfig`).                                      |
| REQ-QA-005 | Pull requests MUST use a template that links the spec and lists the checks to run.                                                                                          |

## Acceptance criteria

- **Given** the message `Added stuff`, **when** committing, **then** the hook rejects it; **given** `fix(drag): keep seconds still`, **then** it is accepted.
- **Given** the page in light or dark mode, **when** axe runs, **then** it reports no violations.

## Out of scope

- Enforcing hooks on machines that skip them (`--no-verify`); CI is the backstop.
