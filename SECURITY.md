# Security Policy

## Supported versions

Security fixes are shipped for the latest published release. Please keep Pancho
updated.

| Version | Supported |
| ------- | --------- |
| 1.3.x   | ✅        |
| < 1.3   | ❌        |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report it privately through GitHub's
[Security Advisories](https://github.com/undaniel/pancho/security/advisories/new)
form. You can expect an initial response within a few days and a fix or a
coordinated disclosure timeline after that.

Useful details to include:

- Pancho, VS Code and OS versions (`Pancho: Show logs` prints the first two).
- Which command or feature is affected.
- A minimal reproduction (sample text, exact steps).
- Impact: what an attacker could achieve, and whether workspace trust or the
  current file must be trusted.

## Scope notes

Pancho is a local text-transformation extension. It declares **no network
access** and collects **no telemetry**. Areas that matter for security:

- **Regex engine** — user patterns run in a worker thread with a timeout
  (`pancho.regexTimeoutMs`) and a catastrophic-backtracking guard. A bypass of
  that guard (a frozen/abusive regex) is in scope.
- **AES commands** — authenticated AES-256-GCM (legacy CBC still decryptable).
  Weakening of the authenticated format or key handling is in scope.
- **Clipboard history** — stored locally in extension global state (never
  synced). Leakage outside the local machine is in scope.
- **Untrusted workspaces** — Pancho declares *limited* support; anything that
  executes workspace-controlled input without consent is in scope.

Third-party dependencies keep their own security process; please report to them
first and let us know so we can bump the affected package.
