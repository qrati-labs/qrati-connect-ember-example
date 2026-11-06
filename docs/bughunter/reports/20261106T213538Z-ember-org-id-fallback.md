# Ember live gallery organization-id fallback

- **Scope:** Documented run path for the live Event Photo Gallery embed (`VITE_ORGANIZATION_ID` → `mountEmbed` → classic `embed.js` `data-organization-id`).
- **Base:** `origin/main` at `e560b5c45273835034bc91090fbb2bd5969d21db`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T213538Z-6bcccc73b0424dd5a007c87fb5b4e356-ember`, `bughunter/20261106T213538Z-6bcccc73b0424dd5a007c87fb5b4e356-ember`.
- **Run:** `20261106T213538Z-6bcccc73b0424dd5a007c87fb5b4e356`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P2] Empty organizationId disables the live gallery on the documented run path** — **Evidence:** `app/components/qrati-demo.gts` used `import.meta.env.VITE_ORGANIZATION_ID || ''`; `.env.example` left the variable blank; `.env.development` does not set it; `README.md` “Run it” is `pnpm install` / `pnpm start` with no env step. `mountEmbed` always sets `dataset.organizationId = ORG`. Connect embed.js (`qrati-connect-ts` `src/exports/embed.ts`) drops empty data attributes and returns without mounting when `organization-id` is missing (`embed requires a data-organization-id attribute`). **Failure:** clone → documented start never mounts `<qrati-connect>`; the demo gallery stays empty. **Fix:** fall back to public demo org `69ad9c7876d8bf6f864b3a65` (same id as Angular / Preact `DEFAULT_EXAMPLE_ORG_ID`, Connect `EXAMPLE_ORG_ID`, and `qrati-web` marketing embed). **Test:** `tests/unit/organization-id-fallback-test.ts` via `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` → `<QratiDemo />`.
2. Inputs: Vite `VITE_ORGANIZATION_ID`; `.env.example` blank; `.env.development` has no org key; README does not require env.
3. Authz: none (public demo).
4. Transform: `ORG = env || ''` → `s.dataset.organizationId = ORG` → empty `data-organization-id`.
5. Side effect: async `embed.js` `readConfig` skips `''`; `bootstrap` logs and returns; no `<qrati-connect>`, no session fetch (`enabled: !!organizationId` in the SDK).
6. Output: widget host remains empty aside from the sr-only heading (issue [#26](https://github.com/qrati-labs/qrati-connect-ember-example/issues/26)).
7. Tests: no prior regression for this fallback.

## Falsification

- Not an intentional “bring your own org” gate: README documents a zero-config run; sibling Preact issue [#38](https://github.com/qrati-labs/qrati-connect-preact-example/issues/38) treated the same empty fallback as a host defect.
- Oct 17 embed-configuration audit was report-only because this repo did not contain the loader contract. Loader source now confirms the refuse-to-mount path. Hash-routing audit noted the empty-id return as out of scope, not as accepted behavior.
- A set `VITE_ORGANIZATION_ID` still overrides via `||`.
- Quickstart snippet still shows `your-organization-id` as copy-paste documentation; live mount is the defect.
- No duplicate Ember issue for empty org id (`gh issue list` / search).

## Disposition

Confirmed source defect. Issue [#51](https://github.com/qrati-labs/qrati-connect-ember-example/issues/51). PR [#52](https://github.com/qrati-labs/qrati-connect-ember-example/pull/52). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue and PR left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/organization-id-fallback-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**

## Citations

- `qrati-connect-ts` `src/exports/embed.ts` (`readConfig`, `bootstrap`)
- `qrati-connect-ts` `src/index.tsx` (`organizationId is required`)
- `qrati-connect-ts/tests/examples/test-constants.ts` `EXAMPLE_ORG_ID`
- Angular `DEFAULT_EXAMPLE_ORG_ID`; Preact `DEFAULT_EXAMPLE_ORG_ID` / issue #38
- `qrati-web` `src/app/(qrati)/(marketing)/connect/interactions.ts`

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session. Local unit tests not executed per BugHunter boundary. Public demo org id is the established sibling default, not re-verified against a live session in this run.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T21:35:38Z | 2026-11-06T21:36:01Z | 03:05:38 | 03:06:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T21:36:23Z | 2026-11-06T21:42:28Z | 03:06:23 | 03:12:28 | 00:06:05 (6.1 min) |
| **Total run (preflight start to finish)** | 2026-11-06T21:35:38Z | 2026-11-06T21:42:28Z | 03:05:38 | 03:12:28 | **00:06:50 (6.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:23 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T213538Z-6bcccc73b0424dd5a007c87fb5b4e356.json`. IST dates are 2026-11-07.
