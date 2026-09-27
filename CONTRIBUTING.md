# Contributing to Pancho

Thanks for taking the time to improve Pancho! This is a small, focused VS Code
extension, so a short checklist keeps everything green.

## Getting started

```bash
git clone https://github.com/undaniel/pancho.git
cd pancho
npm install
npm run compile   # typecheck
npm test          # unit tests (jest)
npm run bundle    # build dist/ (esbuild, node + web)
```

Press `F5` in VS Code to launch the **Extension Development Host** with the
extension loaded.

## Before opening a pull request

Run the same checks CI runs:

```bash
npm run typecheck
npm test
npm run l10n:check
npm run bundle
npm run test:integration   # if you touched activation, commands or UI wiring
```

All of them must pass. The integration suite downloads a real VS Code build on
first run (`VSCODE_VERSION` selects the version, default `stable`).

## Project conventions

- **Single command source.** `src/commands/registry.ts` is the source of truth
  for the command list. After adding/removing a command run
  `npm run commands:sync` to regenerate `contributes.commands`, and add the
  command's title to **both** `package.nls.json` and `package.nls.es.json`.
  The `commandsManifest` test enforces this.
- **Localization.** Every runtime string goes through `l10n.t(...)` (or the
  local `t(...)` wrapper) and must exist in `l10n/bundle.l10n.json` and
  `l10n/bundle.l10n.es.json`. `npm run l10n:check` fails otherwise.
- **No network, no telemetry.** Keep the extension fully local.
- **Web-safe code.** The `browser` bundle must not use Node built-ins
  (`Buffer`, `fs`, `path`, `crypto`, `worker_threads`) directly; go through the
  portable helpers under `src/utils/`.
- **Docs.** If you change behavior, update `README.md`, `docs/README.es.md` and
  `CHANGELOG.md`. `npm run generate:readme` syncs the command count.
- **Destructive commands** must go through the diff preview unless the user
  opted out.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) style
(`feat:`, `fix:`, `docs:`, `test:`, `ci:` …). Keep the subject in the
imperative mood.

## Reporting bugs and requesting features

Use the issue templates. For anything security-related see
[SECURITY.md](./SECURITY.md) — please report privately, not in a public issue.

## License

By contributing you agree that your contribution is licensed under the
[MIT License](./LICENSE).
