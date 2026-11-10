# Ember host WCAG 1.2.5 audio description (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.5 Audio Description (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.2.2 captions (prerecorded) (20261110T132538Z), 1.2.3 audio description or media alternative (20261110T134539Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `f317c890159659ebf39c27777532c55c28dcf937`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T140538Z-82f056f5e8eb42818e092edf80b7220e-ember`, `bughunter/20261110T140538Z-82f056f5e8eb42818e092edf80b7220e-ember`.
- **Run:** `20261110T140538Z-82f056f5e8eb42818e092edf80b7220e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, or `speechSynthesis`. No `.mp4` / `.webm` / `.vtt` assets in `public/` (images, SVGs, `robots.txt`, `sitemap.xml` only). The only `video` substring in host source is marketing copy (“Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play media.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored synchronized media.
5. [WCAG 2.2 SC 1.2.5](https://www.w3.org/TR/WCAG22/#audio-description-prerecorded) (Level AA): audio description is provided for all prerecorded video content in synchronized media. [Understanding 1.2.5](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html): the SC applies to prerecorded video in synchronized media (spoken description of important visual details not in the main soundtrack). Unlike 1.2.3, a text media alternative is not sufficient at AA. With no host-authored synchronized media, there is no 1.2.5 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without audio description fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`.
- **GTM / analytics could inject video:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.5 defect.
- **Static OG/PNG/SVG assets require audio description:** 1.2.5 applies to synchronized time-based media, not still images.
- **1.2.3 already covered this path so 1.2.5 is a duplicate finding:** 1.2.3 allows a media alternative; 1.2.5 requires audio description. Same host has no synchronized media, so the AA criterion is independently not violated rather than waived by the earlier A audit.
- **Issue search** `1.2.5 OR audio description OR prerecorded`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.5 Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html)
- [WCAG 2.2 SC 1.2.5](https://www.w3.org/TR/WCAG22/#audio-description-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.5 Understanding. Embed widget media players are out of scope.

## Timing

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Base `main` `f317c890159659ebf39c27777532c55c28dcf937`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
