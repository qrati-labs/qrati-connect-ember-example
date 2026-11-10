# Ember host WCAG 3.2.4 consistent identification

- **Scope:** WCAG 2.2 SC 3.2.4 Consistent Identification for host-authored controls in `QratiDemo`: hero Qrati links, action pills, Contact CTA, footer links, theme toggle, Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome, 3.2.3 consistent navigation (20261110T024638Z).
- **Base:** `origin/main` at `49f142f5ced29d1ae06e9db80a6d78337f1ceade`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T030638Z-c86a6d2284a64284911928e695d8ec92-ember`, `bughunter/20261110T030638Z-c86a6d2284a64284911928e695d8ec92-ember`.
- **Run:** `20261110T030638Z-c86a6d2284a64284911928e695d8ec92`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `app/styles/app.css`. `app/router.ts` `Router.map` is empty (single history index). `config/environment.js` `locationType: 'history'`, `rootURL: '/'`. Worker route `*qrati.com/connect/ember-example*` (`wrangler.jsonc`).
2. [WCAG 2.2 SC 3.2.4 Consistent Identification](https://www.w3.org/TR/WCAG22/#consistent-identification) (Level AA): components that have the [same functionality](https://www.w3.org/TR/WCAG22/#dfn-same-functionality) within a [set of web pages](https://www.w3.org/TR/WCAG22/#dfn-set-of-web-pages) are identified consistently. Understanding: users can recognize the same functionality when it appears on **different** web pages. [F31](https://www.w3.org/WAI/WCAG22/Techniques/failures/F31) is a failure only when two different labels are used for the same function on **different web pages** in the set. Labels need not be character-identical if they are consistent (Understanding note).
3. Host-identified controls (one URI after Worker prefix rewrite):
   - Theme toggle: unique `type="button"`; visible name `☀ Light` / `🌙 Dark` from `isDark` (no extra `aria-label`).
   - Hero `<h1>` and `.hero-copy` links: both `href="https://qrati.com"`, accessible name `Qrati`.
   - Action pills: `View on GitHub` → `https://github.com/qrati-labs/qrati-connect-ember-example`; `Open in VS Code` → `https://vscode.dev/github/qrati-labs/qrati-connect-ember-example`. Distinct destinations.
   - Contact CTA: `Contact Qrati →` → `https://qrati.com/contact-us` (not the homepage).
   - Footer `<nav aria-label="Footer navigation">`: `qrati.com` → `https://qrati.com`; `npm` → package page; `GitHub` → `https://github.com/qrati-labs` (org, not the example repo); `Pricing` → `/pricing`; `Cookie Preferences` button calls `showCookiePreferences`.
   - Cookie first-layer copy (`cookieConsent.ts`): `showPreferencesBtn: 'Manage preferences'`; preferences modal title `Cookie preferences`. Footer reopen is a separate control on the same page.
4. There is one host web page. Hash routing is `data-router="hash"` on the embed script, not additional host routes. No second template identifies the same host control with a different name.

Authz/validation: public demo. Persistence: theme `qc-theme`, geo consent cache — neither relabels host controls.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hero `Qrati` vs footer `qrati.com` (same URL, different names) fails 3.2.4:** F31 requires the same function labeled differently on **different pages**. One host URI; Understanding goal is cross-page recognition. Same-page link-purpose differences were audited under 2.4.4 (20261109T183438Z).
- **Footer `GitHub` vs action-pill `View on GitHub`:** Different functions (org vs example repo URLs). Not same functionality.
- **Footer `Cookie Preferences` vs modal `Manage preferences`:** First-layer consent button vs footer reopen vs modal title are distinct controls on one page, not a repeated component across a set of pages. Cookie-consent chrome is out of this host-chrome scope.
- **Contact CTA vs homepage `qrati.com`:** `/contact-us` vs `/` — not the same functionality.
- **Embed hash views form a set of web pages:** hash views are inside the third-party widget; host URI is unchanged. Out of this host-chrome scope.
- **Issue search** `3.2.4 OR "consistent identification"`: no matching issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.2.4 Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html)
- [WCAG 2.2 SC 3.2.4](https://www.w3.org/TR/WCAG22/#consistent-identification)
- [F31](https://www.w3.org/WAI/WCAG22/Techniques/failures/F31)
- [same functionality](https://www.w3.org/TR/WCAG22/#dfn-same-functionality)
- [set of web pages](https://www.w3.org/TR/WCAG22/#dfn-set-of-web-pages)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `app/router.ts`
- `config/environment.js`

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS/JS plus WCAG 3.2.4 Understanding. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T03:06:38Z | 2026-11-10T03:07:00Z | 08:36:38 | 08:37:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T03:07:20Z | 2026-11-10T03:09:03Z | 08:37:20 | 08:39:03 | 00:01:43 (1.7 min) |
| `delivery` | 2026-11-10T03:09:03Z | 2026-11-10T03:09:39Z | 08:39:03 | 08:39:39 | 00:00:36 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-10T03:06:38Z | 2026-11-10T03:09:39Z | 08:36:38 | 08:39:39 | **00:03:01 (3.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:20 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T030638Z-c86a6d2284a64284911928e695d8ec92.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/107
- Base `main` `49f142f5ced29d1ae06e9db80a6d78337f1ceade` / head `bughunter/20261110T030638Z-c86a6d2284a64284911928e695d8ec92-ember` (`dc048d0ef8fb567c201cbc56772b91d7fa96b9f1` before timing-table commit)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint/Test/Workers Builds pending; GitGuardian pass
- Local tests **NOT RUN BY BUGHUNTER**
