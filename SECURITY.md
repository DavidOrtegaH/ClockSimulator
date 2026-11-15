# Security Policy

## Supported versions

Only the latest release deployed to GitHub Pages is supported.

## Reporting a vulnerability

Please report vulnerabilities privately through
[GitHub Security Advisories](https://github.com/DavidOrtegaH/ClockSimulator/security/advisories/new)
rather than opening a public issue. You can expect a first response within 7 days.

## Measures in place

- Strict Content Security Policy: same-origin scripts and styles only, no inline code, no `eval`.
- No third-party requests, cookies, storage or user data.
- Locked dependencies, `pnpm audit` in CI and weekly Dependabot updates.
- GitHub Actions pinned to commit SHAs with least-privilege permissions.
