# Ember host Iconify script and on-demand icon fetch

- **Scope:** Host loading of `iconify-icon` from `code.iconify.design` (`index.html`) and the ten decorative `<iconify-icon>` hosts in `QratiDemo` (feature-map + SEO feature cards), including on-demand Iconify API fetch, SRI/consent, and failure. Excludes reserved 1em host box (#38), webfonts, cookie-consent categories, embed mount, theme toggle.
- **Base:** `origin/main` at `c71689ae4c538cdd0a9debb2d5b10236c946d5b5`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T021238Z-7078214466c64d7dab432e39bf40ea82-ember`, `bughunter/20261107T021238Z-7078214466c64d7dab432e39bf40ea82-ember`.
- **Run:** `20261107T021238Z-7078214466c64d7dab432e39bf40ea82`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Document head (`index.html` line 46) loads `https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js` with `defer` (classic script; no `integrity`, no `crossorigin`).
2. `QratiDemo` renders ten `<iconify-icon icon="material-symbols:…">` hosts: six in `.feature-map-heading` beside visible `h3`s, four as first children of `.seo-feature-card`. GitHub/VS Code hero SVGs are inline and already `aria-hidden="true"`; they do not use Iconify.
3. Iconify 2.1.0 minified loader (fetched this run, 23739 bytes) registers the custom element, renders SVG in shadow DOM, and requests missing icon data from public API hosts `api.iconify.design`, `api.simplesvg.com`, `api.unisvg.com`. The bundle contains no `document.cookie`, `localStorage`, or `aria-hidden`.
4. Host CSS (`app/styles/app.css`) already reserves `iconify-icon { display: inline-block; width: 1em; height: 1em }` (#38). Feature/SEO rules set `font-size: 1.5rem` / `currentColor` via `--brand-accent`.
5. Cookie consent (`app/lib/cookieConsent.ts`) gates only the `analytics` category and GTM. The Iconify script is not a cookie category and is not delayed until consent.

Authz/validation/persistence: none (public demo chrome). Side effects: third-party GET for the loader, then per-icon API JSON. Errors: if the script or API fails, custom elements stay as reserved empty boxes; adjacent headings and copy remain.

## Falsification

- **Missing SRI is a supply-chain break of this example:** Iconify’s own documented snippet is a CDN `<script src>` without `integrity`. Empty `integrity=""` on Embroider vendor CSS is unrelated. Hardening, not a violated host invariant.
- **GDPR / consent invariant:** host contract is essential vs optional analytics. Iconify is not claimed as analytics and sets no cookies in the 2.1.0 bundle. Same policy-risk class as the webfonts audit, not a falsified product-code defect.
- **CDN/API outage leaves the page unusable:** headings, gallery embed, CTAs, and FAQ do not depend on Iconify. Reserved 1em boxes prevent the layout shift already fixed in #38.
- **Missing `aria-hidden` is WCAG 1.1.1:** previously considered on the feature-map and SEO-card audits; Iconify does not default `aria-hidden`; hosts are unnamed custom elements beside visible `h3`s. No screen-reader session in this run; not claimed.
- **Issue search** `iconify OR iconify-icon`: only closed #38 (reserved size). No duplicate open issue.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Iconify Icon web component](https://iconify.design/docs/iconify-icon/) (CDN snippet; on-demand API; shadow DOM SVG)
- `index.html` line 46 (`defer` loader)
- `app/components/qrati-demo.gts` ten `material-symbols` hosts
- `app/styles/app.css` reserved `iconify-icon` box (#38)
- `app/lib/cookieConsent.ts` analytics-only gating
- Prior related: #38 reserved size; webfonts report explicitly excluded Iconify

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Public example URL has previously 404’d (deployment-availability, out of scope). Iconify API JSON not live-fetched beyond confirming hosts in the 2.1.0 bundle.

## Timing

TIMING_TABLE_PLACEHOLDER

## PR / checks

PR_META_PLACEHOLDER
