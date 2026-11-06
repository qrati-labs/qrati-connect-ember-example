# Ember host GitHub / VS Code action pills

- **Scope:** Host example-source links in `QratiDemo` (`.action-pills` → GitHub repo + vscode.dev), including href construction, `target`/`rel`, SVG labeling, contrast, and motion.
- **Base:** `origin/main` at `1eab9cf424c503ba0e2dc976bbc122f18e7ef3c7`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T215838Z-5b5e9f1c4498479c87e8cf8aee6c6600-ember`, `bughunter/20261106T215838Z-5b5e9f1c4498479c87e8cf8aee6c6600-ember`.
- **Run:** `20261106T215838Z-5b5e9f1c4498479c87e8cf8aee6c6600`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. Constants in `app/components/qrati-demo.gts`: `GITHUB_ORG = 'qrati-labs'`, `REPO = 'qrati-connect-ember-example'`; `repoUrl = https://github.com/${GITHUB_ORG}/${REPO}`; `vscodeUrl = https://vscode.dev/github/${GITHUB_ORG}/${REPO}`.
3. Hero `.action-pills` (`aria-label="Example links"`) exposes two `<a>` elements: visible “View on GitHub” / “Open in VS Code” text, inline SVG with `aria-hidden="true"`, `target="_blank"`, `rel="noopener noreferrer"`.
4. Style (`app/styles/app.css`): light `--pill-text: #374151` on ~85% white over `#fff7f1` ≈ **10.2:1**; hover uses `--pill-text-hover: #c24100`. Dark `--pill-text: rgba(255,255,255,0.8)` on translucent white. No `outline: none`. Hover `transform` is covered by `@media (prefers-reduced-motion: reduce)`.
5. Live read-only HEAD: both URLs returned HTTP 200 at audit time (`https://github.com/qrati-labs/qrati-connect-ember-example`, `https://vscode.dev/github/qrati-labs/qrati-connect-ember-example`).

Authz/validation/persistence: none (public marketing/source links). Side effects: navigation in a new tab only.

## Falsification

- **Broken href / wrong vscode.dev shape:** HEAD 200 on the exact constructed URLs; vscode.dev `/github/{owner}/{repo}` matches the live host.
- **Missing `rel` on `target=_blank`:** both links set `noopener noreferrer`.
- **Unlabeled icon-only controls:** each control has a visible `<span>` name; SVGs are `aria-hidden="true"`.
- **WCAG 1.4.3 on pill text:** light resting contrast ≈ 10.2:1 (well above 4.5:1). Hover accent `#c24100` on the warm page background is the same token already accepted for hero kicker (issue [#24](https://github.com/qrati-labs/qrati-connect-ember-example/issues/24)).
- **Motion:** global reduced-motion rule shortens transitions; not a separate action-pills gap.
- **Public example route 404:** previously documented deployment-availability gap; not an action-pills source defect.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: none (no confirmed defect).
- Command: none.
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check` on docs-only diff.

## Citations

- WCAG 2.2 [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- WCAG 2.2 [2.5.5 Target Size (Enhanced)](https://www.w3.org/TR/WCAG22/#target-size-enhanced) not claimed (AAA)
- vscode.dev GitHub URLs as used: `https://vscode.dev/github/{owner}/{repo}`

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Contrast computed from CSS tokens, not a captured screenshot. Live example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T21:58:38Z | 2026-11-06T21:59:00Z | 03:28:38 | 03:29:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-06T21:59:33Z | 2026-11-06T22:06:53Z | 03:29:33 | 03:36:53 | 00:07:20 (7.3 min) |
| `delivery` | 2026-11-06T22:06:53Z | 2026-11-06T22:07:44Z | 03:36:53 | 03:37:44 | 00:00:50 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-06T21:58:38Z | 2026-11-06T22:07:44Z | 03:28:38 | 03:37:44 | **00:09:06 (9.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:34 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T215838Z-5b5e9f1c4498479c87e8cf8aee6c6600.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/53
- Base `main` `1eab9cf424c503ba0e2dc976bbc122f18e7ef3c7` / head `bughunter/20261106T215838Z-5b5e9f1c4498479c87e8cf8aee6c6600-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: CI Lint queued; CI Test queued; Workers Builds in progress; GitGuardian SUCCESS
- Local tests **NOT RUN BY BUGHUNTER**
