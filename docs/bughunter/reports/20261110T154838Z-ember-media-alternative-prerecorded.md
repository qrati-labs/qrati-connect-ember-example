# Ember host WCAG 1.2.8 media alternative (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.8 Media Alternative (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.2.2 captions (prerecorded) (20261110T132538Z), 1.2.3 audio description or media alternative (prerecorded) (20261110T134539Z), 1.2.4 captions (live) (20261110T144838Z), 1.2.5 audio description (prerecorded) (20261110T140538Z), 1.2.6 sign language (prerecorded) (20261110T150838Z), 1.2.7 extended audio description (prerecorded) (20261110T152838Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `ef71b473c09598981fd95be2d578cdcf9f79a424`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T154838Z-7d0fe5bcde7241f48512e5de3ae0fa8d-qrati-connect-ember-example`, `bughunter/20261110T154838Z-7d0fe5bcde7241f48512e5de3ae0fa8d-ember-demo`.
- **Run:** `20261110T154838Z-7d0fe5bcde7241f48512e5de3ae0fa8d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, `speechSynthesis`, `MediaStream`, or `getUserMedia`. No `.mp4` / `.webm` / `.vtt` assets in `public/` (images, SVGs, `robots.txt`, `sitemap.xml` only). The only media-adjacent host strings are marketing copy (“event-media experience”, “Image/video layouts”). CSS `@media` rules are viewport/reduced-motion, not time-based media. Iconify is an SVG icon loader (`index.html` defer script); it does not play video.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored prerecorded synchronized or video-only media.
5. [WCAG 2.2 SC 1.2.8](https://www.w3.org/TR/WCAG22/#media-alternative-prerecorded) (Level AAA): an alternative for time-based media is provided for all prerecorded synchronized media and for all prerecorded video-only media. [Understanding 1.2.8](https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html): the SC requires a full text equivalent of all visual and auditory information (a running book-like description, not limited to dialogue pauses) so people who cannot reliably use captions or audio description can still access the content. With no host-authored prerecorded synchronized media and no host-authored prerecorded video-only media, there is no 1.2.8 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without a full media alternative fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`. 1.2.8 is a prerecorded synchronized and video-only text alternative, not live gallery clips.
- **GTM / analytics could inject a lecture video:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.8 defect.
- **1.2.3 already covered media alternatives so 1.2.8 is a duplicate:** 1.2.3 (A) allows audio description *or* a media alternative for synchronized media only. 1.2.8 (AAA) requires a full text alternative for *all* prerecorded synchronized media *and* prerecorded video-only media. Same host has neither kind, so the AAA criterion is independently not violated rather than waived by the earlier A audit.
- **Issue search** `1.2.8 OR "media alternative" OR prerecorded` / open set: empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.8 Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html)
- [WCAG 2.2 SC 1.2.8](https://www.w3.org/TR/WCAG22/#media-alternative-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.8 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T154838Z-7d0fe5bcde7241f48512e5de3ae0fa8d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: (filled after open)
- Base `main` `ef71b473c09598981fd95be2d578cdcf9f79a424` / head `bughunter/20261110T154838Z-7d0fe5bcde7241f48512e5de3ae0fa8d-ember-demo`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: (filled after open)
- Local tests **NOT RUN BY BUGHUNTER**
