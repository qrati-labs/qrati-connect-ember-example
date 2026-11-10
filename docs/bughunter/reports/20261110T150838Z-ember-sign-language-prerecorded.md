# Ember host WCAG 1.2.6 sign language (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.6 Sign Language (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.2.2 captions (prerecorded) (20261110T132538Z), 1.2.3 audio description or media alternative (prerecorded) (20261110T134539Z), 1.2.4 captions (live) (20261110T144838Z), 1.2.5 audio description (prerecorded) (20261110T140538Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `5936f55dc71300e2b174dcd141cc7cd10bdb6121`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T150838Z-463a1e8d4864414ba941be2ce8a617e5-ember`, `bughunter/20261110T150838Z-463a1e8d4864414ba941be2ce8a617e5-ember`.
- **Run:** `20261110T150838Z-463a1e8d4864414ba941be2ce8a617e5`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, `speechSynthesis`, `MediaStream`, or `getUserMedia`. No `.mp4` / `.webm` / `.vtt` assets in `public/` (images, SVGs, `robots.txt`, `sitemap.xml` only). The only media-adjacent host strings are marketing copy (“event-media experience”, “Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play media or present sign language.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored prerecorded synchronized media.
5. [WCAG 2.2 SC 1.2.6](https://www.w3.org/TR/WCAG22/#sign-language-prerecorded) (Level AAA): sign language interpretation is provided for all prerecorded audio content in synchronized media. [Understanding 1.2.6](https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html): the SC applies to prerecorded audio in synchronized media so people who are deaf or hard of hearing and fluent in sign language can access the audio track; captions are not a substitute. With no host-authored prerecorded synchronized media, there is no 1.2.6 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without a sign-language interpreter fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`. 1.2.6 is prerecorded synchronized-media sign language, not live gallery clips.
- **GTM / analytics could inject a talking-head video:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.6 defect.
- **1.2.5 already covered audio description so 1.2.6 is a duplicate:** 1.2.5 is prerecorded audio description of video; 1.2.6 is sign language interpretation of prerecorded audio in synchronized media. Same host has no synchronized media of either kind, so the AAA sign-language criterion is independently not violated rather than waived by the earlier AA audit.
- **Issue search** `sign language OR 1.2.6` / open set: empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.6 Sign Language (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html)
- [WCAG 2.2 SC 1.2.6](https://www.w3.org/TR/WCAG22/#sign-language-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.6 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T15:08:38Z | 2026-11-10T15:09:09Z | 20:38:38 | 20:39:09 | 00:00:31 (0.5 min) |
| `audit` | 2026-11-10T15:09:37Z | 2026-11-10T15:11:15Z | 20:39:37 | 20:41:15 | 00:01:38 (1.6 min) |
| `delivery` | 2026-11-10T15:11:15Z | 2026-11-10T15:12:03Z | 20:41:15 | 20:42:03 | 00:00:48 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T15:08:38Z | 2026-11-10T15:12:03Z | 20:38:38 | 20:42:03 | **00:03:25 (3.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:29 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T150838Z-463a1e8d4864414ba941be2ce8a617e5.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/134
- Base `main` `5936f55dc71300e2b174dcd141cc7cd10bdb6121` / head `bughunter/20261110T150838Z-463a1e8d4864414ba941be2ce8a617e5-ember` `0748c63c8677b0d512463e477c26a6c9b03271bc` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
