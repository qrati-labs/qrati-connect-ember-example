# Ember host WCAG 1.2.9 audio-only (live)

- **Scope:** WCAG 2.2 SC 1.2.9 Audio-only (Live) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (prerecorded) (20261110T130338Z), 1.2.4 captions (live) (20261110T144838Z), 1.2.8 media alternative (prerecorded) (20261110T154838Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `d4a10cc93a4513750a20e1206c6c3062e53acade`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T163238Z-96736bc5f5484e3799d3631d4f36ba90-ember`, `bughunter/20261110T163238Z-96736bc5f5484e3799d3631d4f36ba90-ember`.
- **Run:** `20261110T163238Z-96736bc5f5484e3799d3631d4f36ba90`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Admin chore PRs #121/#122 do not apply to this repository. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`, `vite.config.mjs`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, `speechSynthesis`, `MediaStream`, `getUserMedia`, or `RTCPeerConnection`. No `.mp3` / `.m4a` / `.wav` / `.ogg` / `.mp4` / `.webm` / `.vtt` assets in `public/` (PNG/SVG, `robots.txt`, `sitemap.xml` only). Marketing copy mentions “event-media experience” and “Image/video layouts”; CSS `@media` rules are viewport/reduced-motion, not time-based media. Iconify is an SVG icon loader (`index.html` defer script).
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored live audio-only content. `.env.example` leaves `VITE_GTM_ID` empty.
5. [WCAG 2.2 SC 1.2.9](https://www.w3.org/TR/WCAG22/#audio-only-live) (Level AAA): an alternative for time-based media that presents equivalent information for **live audio-only** content is provided. [Understanding 1.2.9](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live): goal is a text equivalent so people who cannot hear or understand real-time audio can read it (e.g. live captions/transcript of a webcast). With no host-authored live audio-only stream, there is no 1.2.9 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery could play live audio without a transcript:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<audio>`/`<video>`. 1.2.9 is live **audio-only** (no video), not a photo gallery.
- **1.2.4 already covered live captions so 1.2.9 is a duplicate:** 1.2.4 (AA) is captions for live **synchronized** media. 1.2.9 (AAA) is a text alternative for live **audio-only**. Same host has neither kind.
- **GTM / analytics could inject a live audio player:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set.
- **Issue search** `1.2.9 OR audio-only OR "audio only" OR live audio` / open+closed set: empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.9 Audio-only (Live)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live)
- [WCAG 2.2 SC 1.2.9](https://www.w3.org/TR/WCAG22/#audio-only-live)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.9 Understanding. Embed widget media players are out of scope. `web_extract` of the Understanding page failed in this environment; criterion text taken from W3C search snippet plus the WCAG 2.2 SC URI.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T163238Z-96736bc5f5484e3799d3631d4f36ba90.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
