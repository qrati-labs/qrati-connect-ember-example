# Ember host WCAG 3.2.3 consistent navigation

- **Scope:** WCAG 2.2 SC 3.2.3 Consistent Navigation for host-authored chrome in `QratiDemo`: footer `nav`, action-pill links, theme toggle, Contact CTA, FAQ. Excludes embed internals (`qrati-connect` / `embed.js` hash routes), vanilla-cookieconsent modal chrome, 3.2.2 on input (20261110T022738Z).
- **Base:** `origin/main` at `ed97aa6fd4c01d95f707080a4ef43a50e7dde667`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T024638Z-9dd169164f804516b18278e68efa0efa-ember`, `bughunter/20261110T024638Z-9dd169164f804516b18278e68efa0efa-ember`.
- **Run:** `20261110T024638Z-9dd169164f804516b18278e68efa0efa`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts` and `app/styles/app.css`. `app/router.ts` `Router.map` is empty (single history index). `config/environment.js` `locationType: 'history'`, `rootURL: '/'`.
2. [WCAG 2.2 SC 3.2.3 Consistent Navigation](https://www.w3.org/TR/WCAG22/#consistent-navigation) (Level AA): navigational mechanisms that are repeated on multiple [web pages](https://www.w3.org/TR/WCAG22/#dfn-web-page-s) within a [set of web pages](https://www.w3.org/TR/WCAG22/#dfn-set-of-web-pages) occur in the [same relative order](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) each time they are repeated, unless a change is initiated by the user. Understanding: predict location of repeated nav; F66 applies only when a mechanism is used on **more than one** page and the default link order differs.
3. Host navigation:
   - No site header `<nav>`. Theme toggle is a single `type="button"` (not a repeated link list).
   - Action pills: GitHub then VS Code (`aria-label="Example links"`). Static in template.
   - Footer `<nav aria-label="Footer navigation">` source order: qrati.com, npm, GitHub, Pricing, Cookie Preferences button. CSS `flex-wrap` may wrap but does not reorder.
   - Contact CTA is a single in-page link, not a repeated menu.
4. There is one host web page (one URI after Worker prefix rewrite). Hash routing is `data-router="hash"` on the embed script, not additional host routes. No second template reorders footer/action links.

Authz/validation: public demo. Persistence: theme `qc-theme`, geo consent cache — neither permutes nav order.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing skip link fails 3.2.3:** Understanding examples describe skip links as a *consistently located* pattern when they exist. SC 3.2.3 does not require introducing skip links. Skip-bypass was audited separately (20261107T044738Z).
- **Footer vs action-pill link order is inconsistent (GitHub appears in both):** SC compares a **repeated mechanism** across pages, not two different link groups on one page. F66 procedure step 1 is false here.
- **Theme toggle `position: fixed` then `absolute` changes spatial nav:** layout of one control on one page is not a multi-page relative-order failure (theme-toggle position already audited 20261107T031838Z).
- **Embed hash gallery pages form a set of web pages:** hash views are inside the third-party widget; host URI is unchanged. Out of this host-chrome scope.
- **Issue search** `3.2.3 OR "consistent navigation"`: no matching issue. `gh issue list` has no open 3.2.3 item. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
- [WCAG 2.2 SC 3.2.3](https://www.w3.org/TR/WCAG22/#consistent-navigation)
- [set of web pages](https://www.w3.org/TR/WCAG22/#dfn-set-of-web-pages)
- [F66](https://www.w3.org/WAI/WCAG22/Techniques/failures/F66)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `app/router.ts`
- `app/styles/app.css` footer nav
- `config/environment.js`

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS/JS plus WCAG 3.2.3 Understanding. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T024638Z-9dd169164f804516b18278e68efa0efa.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `ed97aa6fd4c01d95f707080a4ef43a50e7dde667` / head `bughunter/20261110T024638Z-9dd169164f804516b18278e68efa0efa-ember`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
