# Ember host WCAG 1.2.4 captions (live)

- **Scope:** WCAG 2.2 SC 1.2.4 Captions (Live) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.2.2 captions (prerecorded) (20261110T132538Z), 1.2.3 audio description or media alternative (20261110T134539Z), 1.2.5 audio description (prerecorded) (20261110T140538Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `03fcae398b1d93b38b19c487ffecf50ab6a8fff8`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T144838Z-44e9dbdab8d647fa9a06d70caba5ca0a-qrati-connect-ember-example`, `bughunter/20261110T144838Z-44e9dbdab8d647fa9a06d70caba5ca0a-ember`.
- **Run:** `20261110T144838Z-44e9dbdab8d647fa9a06d70caba5ca0a`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, `speechSynthesis`, `MediaStream`, or `getUserMedia`. No `.mp4` / `.webm` / `.vtt` assets in `public/` (images, SVGs, `robots.txt`, `sitemap.xml` only). The only media-adjacent host strings are marketing copy (“event-media experience”, “Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play media.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored live synchronized media.
5. [WCAG 2.2 SC 1.2.4](https://www.w3.org/TR/WCAG22/#captions-live) (Level AA): captions are provided for all live audio content in synchronized media. [Understanding 1.2.4](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html): the SC applies to real-time (broadcast) synchronized media so people who are deaf or hard of hearing can access the audio track via captions; it is not intended to require captioning of two-way multimedia calls in web apps. With no host-authored live synchronized media, there is no 1.2.4 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without captions fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`. 1.2.4 is live (real-time) captions, not prerecorded gallery clips.
- **GTM / analytics could inject a live stream:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.4 defect.
- **1.2.2 already covered captions so 1.2.4 is a duplicate:** 1.2.2 is prerecorded captions; 1.2.4 is live captions. Same host has no synchronized media of either kind, so the AA live criterion is independently not violated rather than waived by the earlier A audit.
- **Issue search** `1.2.4 OR captions live OR live caption` / `captions`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.4 Captions (Live)](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html)
- [WCAG 2.2 SC 1.2.4](https://www.w3.org/TR/WCAG22/#captions-live)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.4 Understanding. Embed widget media players are out of scope.

## Timing

timing incomplete

## PR / checks

Pending delivery.
