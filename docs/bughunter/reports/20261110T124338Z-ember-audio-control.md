# Ember host WCAG 1.4.2 audio control

- **Scope:** WCAG 2.2 SC 1.4.2 Audio Control for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 2.2.2 pause/stop/hide (20261109T231938Z), 2.3.1 three flashes (20261110T095638Z).
- **Base:** `origin/main` at `5b0e75189ec7a7489324edf92e57b9da926a9a2b`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T124338Z-f49ba74d355a428f8b13a05053d7c663-ember`, `bughunter/20261110T124338Z-f49ba74d355a428f8b13a05053d7c663-ember`.
- **Run:** `20261110T124338Z-f49ba74d355a428f8b13a05053d7c663`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `autoplay`, `HTMLMediaElement`, `AudioContext`, or `speechSynthesis`. The only `audio`/`video` substring in host source is marketing copy (“event-media experience”). Iconify is an SVG icon loader (`index.html` defer script); it does not play sound.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored autoplay audio. No host `play()` / unmute path.
5. [WCAG 2.2 SC 1.4.2](https://www.w3.org/TR/WCAG22/#audio-control) (Level A): if any audio on a Web page plays automatically for more than 3 seconds, a mechanism must pause/stop it or control volume independently of system volume. [Understanding 1.4.2](https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html): a page that does not auto-play audio does not fail this SC. With no host-authored auto-playing audio, there is no 1.4.2 failure on this host.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video autoplay fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set autoplay or media attributes on `qrati-connect`.
- **GTM / analytics could inject audio ads:** not host-authored; GTM loads only after optional analytics consent and is not present unless `VITE_GTM_ID` is set. Not a host 1.4.2 defect.
- **CSS transitions or Iconify fetch are audio:** they are visual/network only.
- **Issue search** `audio OR autoplay OR 1.4.2 OR unmute`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html)
- [WCAG 2.2 SC 1.4.2](https://www.w3.org/TR/WCAG22/#audio-control)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.4.2 Understanding. Embed widget media players are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

<!-- timing table inserted after finish -->

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Local tests **NOT RUN BY BUGHUNTER**
