# Ember host WCAG 1.2.1 audio-only and video-only (prerecorded)

- **Scope:** WCAG 2.2 SC 1.2.1 Audio-only and Video-only (Prerecorded) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.4.2 audio control (20261110T124338Z), 2.2.2 pause/stop/hide (20261109T231938Z).
- **Base:** `origin/main` at `d7deddd982bdadc2856cd6c561ed4fe936ec2a75`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T130338Z-3f93304664fa4f2faa4d498c2cd86a3a-qrati-connect-ember-example`, `bughunter/20261110T130338Z-3f93304664fa4f2faa4d498c2cd86a3a-ember`.
- **Run:** `20261110T130338Z-3f93304664fa4f2faa4d498c2cd86a3a`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, or `speechSynthesis`. The only `video` substring in host source is marketing copy (“Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play media.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored prerecorded audio-only or video-only media.
5. [WCAG 2.2 SC 1.2.1](https://www.w3.org/TR/WCAG22/#audio-only-and-video-only-prerecorded) (Level A): for prerecorded audio-only, provide an alternative for time-based media; for prerecorded video-only, provide a text alternative or an audio track. [Understanding 1.2.1](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html): the SC applies to prerecorded audio-only and video-only media. With no host-authored prerecorded audio-only or video-only media, there is no 1.2.1 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media attributes on `qrati-connect` and does not add host `<video>`/`<audio>`.
- **GTM / analytics could inject media:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.2.1 defect.
- **CSS, Iconify, or footer PNG is time-based media:** they are static visual/network resources, not prerecorded audio-only or video-only media.
- **Issue search** `1.2.1 OR caption OR video-only OR audio-only OR media alternative`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.2.1 Audio-only and Video-only (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html)
- [WCAG 2.2 SC 1.2.1](https://www.w3.org/TR/WCAG22/#audio-only-and-video-only-prerecorded)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.2.1 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T13:03:38Z | 2026-11-10T13:04:00Z | 18:33:38 | 18:34:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T13:04:16Z | 2026-11-10T13:09:03Z | 18:34:16 | 18:39:03 | 00:04:47 (4.8 min) |
| `delivery` | 2026-11-10T13:09:03Z | 2026-11-10T13:09:50Z | 18:39:03 | 18:39:50 | 00:00:47 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T13:03:38Z | 2026-11-10T13:09:50Z | 18:33:38 | 18:39:50 | **00:06:12 (6.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:16 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T130338Z-3f93304664fa4f2faa4d498c2cd86a3a.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/129
- Base `main` `d7deddd982bdadc2856cd6c561ed4fe936ec2a75` / head `bughunter/20261110T130338Z-3f93304664fa4f2faa4d498c2cd86a3a-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pass; Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
