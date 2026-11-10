# Ember host WCAG 1.2.7 extended audio description (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.7 Extended Audio Description (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.2.1 audio-only and video-only (20261110T130338Z), 1.2.2 captions (prerecorded) (20261110T132538Z), 1.2.3 audio description or media alternative (prerecorded) (20261110T134539Z), 1.2.4 captions (live) (20261110T144838Z), 1.2.5 audio description (prerecorded) (20261110T140538Z), 1.2.6 sign language (prerecorded) (20261110T150838Z), 1.4.2 audio control (20261110T124338Z).
- **Base:** `origin/main` at `0a842e9ffd6852ae10bfed340825c275e90e066f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T152838Z-7eea753669c6460e85dd048a9c825376-qrati-connect-ember-example`, `bughunter/20261110T152838Z-ember-embed`.
- **Run:** `20261110T152838Z-7eea753669c6460e85dd048a9c825376`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `<iframe>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, `speechSynthesis`, `MediaStream`, or `getUserMedia`. No `.mp4` / `.webm` / `.vtt` assets in `public/` (images, SVGs, `robots.txt`, `sitemap.xml` only). The only media-adjacent host strings are marketing copy (“event-media experience”, “Image/video layouts”). CSS `@media` rules are viewport/reduced-motion, not time-based media. Iconify is an SVG icon loader (`index.html` defer script); it does not play video or pause it for extra narration.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored prerecorded synchronized video.
5. [WCAG 2.2 SC 1.2.7](https://www.w3.org/TR/WCAG22/#extended-audio-description-prerecorded) (Level AAA): where pauses in foreground audio are insufficient to allow audio descriptions to convey the sense of the video, extended audio description is provided for all prerecorded video content in synchronized media. [Understanding 1.2.7](https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html): the SC applies when standard audio description cannot fit in existing dialogue pauses, so the presentation is periodically frozen to play additional description. With no host-authored prerecorded synchronized video, there is no 1.2.7 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video without extended audio description fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`/`<track>`. 1.2.7 is prerecorded synchronized-media extended description (pause-and-narrate), not live gallery clips.
- **GTM / analytics could inject a lecture video:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.7 defect.
- **1.2.5 already covered audio description so 1.2.7 is a duplicate:** 1.2.5 is standard prerecorded audio description during existing pauses; 1.2.7 is the AAA extended form that freezes the video when pauses are too short. Same host has no synchronized media of either kind, so the AAA criterion is independently not violated rather than waived by the earlier AA audit.
- **Issue search** `1.2.7 OR "extended audio"` / open set: empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.7 Extended Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html)
- [WCAG 2.2 SC 1.2.7](https://www.w3.org/TR/WCAG22/#extended-audio-description-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.7 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T15:28:38Z | 2026-11-10T15:29:04Z | 20:58:38 | 20:59:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-10T15:29:27Z | 2026-11-10T15:31:46Z | 20:59:27 | 21:01:46 | 00:02:19 (2.3 min) |
| `delivery` | 2026-11-10T15:31:46Z | 2026-11-10T15:32:20Z | 21:01:46 | 21:02:20 | 00:00:34 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-10T15:28:38Z | 2026-11-10T15:32:20Z | 20:58:38 | 21:02:20 | **00:03:42 (3.7 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T152838Z-7eea753669c6460e85dd048a9c825376.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/135
- Base `main` `0a842e9ffd6852ae10bfed340825c275e90e066f` / head `bughunter/20261110T152838Z-ember-embed` `d22b0599e93b3bce1f1afe4f4847a1302a81fd6d` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint, Test, Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
