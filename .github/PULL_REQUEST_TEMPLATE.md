# Pull request

## What does this change?

<!-- A short description of the change and why it is needed. -->

## Type

- [ ] Bug fix
- [ ] New command / feature
- [ ] Docs
- [ ] Tooling / CI
- [ ] Refactor (no behavior change)

## Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run l10n:check` passes (new runtime strings are in both bundles)
- [ ] `npm run bundle` passes (Node **and** web builds)
- [ ] New/removed command added to `src/commands/registry.ts` and `npm run commands:sync` run
- [ ] `package.nls.json` **and** `package.nls.es.json` updated
- [ ] `CHANGELOG.md` updated under `Unreleased`
- [ ] Behavior changes documented in `README.md` / `docs/README.es.md`
- [ ] No network access or telemetry introduced
- [ ] Web bundle stays free of Node built-ins (`Buffer`, `fs`, `crypto`, …)

## Related issues

<!-- Closes #123 -->
