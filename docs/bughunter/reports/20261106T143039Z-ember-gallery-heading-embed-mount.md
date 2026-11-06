# Ember live-gallery heading vs embed remount

- **UTC date:** 2026-11-06
- **Run ID:** `20261106T143039Z-2090b2a12cd74677898c18db583676bf`
- **Repository / base SHA:** `qrati-labs/qrati-connect-ember-example` `origin/main` `c670fafcfb2f52dead72af5746a1a85ab84617ed`
- **Workflow:** Host embed script mount (`mountEmbed`) vs the live gallery `h2.sr-only` heading
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T143039Z-2090b2a12cd74677898c18db583676bf-ember`
- **Branch:** `bughunter/20261106T143039Z-2090b2a12cd74677898c18db583676bf-ember`

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` checkout `REPO=main` path missing (`/home/hermes/Projects/main`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Embed remount wipes the live gallery heading** — **Evidence:** `app/components/qrati-demo.gts` puts `<h2 class="sr-only">Live Event Photo Gallery Component</h2>` inside `<section class="widget-frame" … {{mountEmbed this.theme}}>`. `mountEmbed` always sets `element.innerHTML = ''` then appends the embed script. Trigger: first paint of `QratiDemo`, and every host theme toggle. **Failure:** the heading never remains in the accessibility tree (heading navigation / outline). The section `aria-label` still names the region. React sibling keeps the `h2` as a sibling of the widget, not a child of a wiped mount node. **Fix:** move `{{mountEmbed}}` onto an inner `.widget-embed-host` so the heading is outside the cleared node. **Test:** `tests/unit/gallery-heading-embed-mount-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` → `QratiDemo`.
2. Constructor sets theme + `initCookieConsent()` (out of scope).
3. Template renders labeled `.widget-frame` with the sr-only `h2`.
4. `mountEmbed` (ember-modifier) runs on insert and on `this.theme` change; clears mount `innerHTML`; injects async embed.js with `data-organization-id`, `data-router="hash"`, `data-theme`.
5. Output: heading gone; script remains as the only child of the previous mount node.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Heading is decorative / redundant with aria-label:** the `h2.sr-only` was added for heading navigation, matching the React example. `aria-label` names the region but does not restore a heading in the outline.
- **Glimmer reinserts the heading after the modifier:** even if a later render restored it, the next theme remount clears it again; the modifier’s contract is to empty the mount node.
- **Embed.js recreates an equivalent heading:** not evidenced in this host repo; the host heading is the documented host-side label.
- **Cookie-consent / contrast:** out of scope; `preferencesModal.sections: []` already falsifies toggle contrast on this host.

## Impact / severity

P3 (low). Assistive-tech users lose the intended gallery heading. No data loss or authz failure.

## Root cause

`mountEmbed` treated the labeled gallery `<section>` as a disposable mount point. `innerHTML` mutation does not preserve Glimmer children.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/26. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests and verification

- Authored: `tests/unit/gallery-heading-embed-mount-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used

## Citations

- [WCAG 2.2 Success Criterion 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- React sibling: `qrati-connect-react-example` `src/App.tsx` (`h2.sr-only` sibling of `<QratiConnect />`, not wiped)

## Limitations

No browser/AT run. Structural invariant asserted from source. Third-party embed internals not inspected.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T14:30:39Z | 2026-11-06T14:31:03Z | 20:00:39 | 20:01:03 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-06T14:31:32Z | 2026-11-06T14:34:22Z | 20:01:32 | 20:04:22 | 00:02:50 (2.8 min) |
| `delivery` | 2026-11-06T14:34:22Z | 2026-11-06T14:35:13Z | 20:04:22 | 20:05:13 | 00:00:51 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-06T14:30:39Z | 2026-11-06T14:35:13Z | 20:00:39 | 20:05:13 | **00:04:35 (4.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:29 (0.5 min) |

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/26 (open, unassigned; repo unmapped)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/27
- Base `main` `c670fafcfb2f52dead72af5746a1a85ab84617ed` / head `e21bfa1033a4cd7cca1cc74a6c1db11b77472a3e`
- `Fixes #26` verified via `closingIssuesReferences`
- Mergeable; assignees none
- Checks at first read-back: CI Lint QUEUED, CI Test IN_PROGRESS, Workers Builds IN_PROGRESS, GitGuardian SUCCESS
- Local tests **NOT RUN BY BUGHUNTER**
