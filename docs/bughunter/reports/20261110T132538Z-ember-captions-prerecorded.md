# Ember host WCAG 1.2.2 captions (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.2 Captions (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `35f3128dd6b9847bd24ea5115079c8cd93e8ca58`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T132538Z-284db30a6d394366a1ef91fcc45b9964-ember`, `bughunter/20261110T132538Z-284db30a6d394366a1ef91fcc45b9964-ember`.
- **Run:** `20261110T132538Z-284db30a6d394366a1ef91fcc45b9964`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, or `speechSynthesis`. No `.mp4` / `.webm` / `.vtt` assets in `public/`. The only `video` substring in host source is marketing copy (“Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play media.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored synchronized media.
5. [WCAG 2.2 SC 1.2.2](https://www.w3.org/TR/WCAG22/#captions-prerecorded) (Level A): captions are provided for all prerecorded audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such. [Understanding 1.2.2](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html): the SC applies to prerecorded audio in synchronized media (dialogue plus non-speech audio identified in captions). Failures F75/F8/F74 require synchronized media without adequate captions. With no host-authored synchronized media, there is no 1.2.2 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without captions fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`.
- **GTM / analytics could inject video:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.2 defect.
- **Marketing copy about “captions” in the feature map is a media alternative claim:** the feature-map sentence is product copy for the embed, not host-authored synchronized media.
- **Issue search** `1.2.2 OR caption OR captions OR synchronized media OR prerecorded`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.2 Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)
- [WCAG 2.2 SC 1.2.2](https://www.w3.org/TR/WCAG22/#captions-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.2 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T132538Z-284db30a6d394366a1ef91fcc45b9964.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `35f3128dd6b9847bd24ea5115079c8cd93e8ca58` / head `bughunter/20261110T132538Z-284db30a6d394366a1ef91fcc45b9964-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
