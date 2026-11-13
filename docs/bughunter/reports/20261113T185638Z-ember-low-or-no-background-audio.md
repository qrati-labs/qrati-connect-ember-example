# Ember host WCAG 1.4.7 low or no background audio

- **Scope:** WCAG 2.2 SC 1.4.7 Low or No Background Audio (AAA) for host-authored UI in the Ember example: `QratiDemo`, `index.html`, host CSS, cookie-consent init, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js` gallery video/audio players), vanilla-cookieconsent modal chrome, 1.4.2 audio control (20261110T124338Z), 1.2.1 audio-only and video-only (20261110T130338Z), 2.2.2 pause/stop/hide (20261109T231938Z).
- **Base:** `origin/main` at `2f09499b612b081e99b06403eccc46c8e76b8382`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T185638Z-12052b2844344e79bd9632ce1cc9b7a5-qrati-connect-ember-example`, `bughunter/20261113T185638Z-12052b2844344e79bd9632ce1cc9b7a5-ember`.
- **Run:** `20261113T185638Z-12052b2844344e79bd9632ce1cc9b7a5`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject media.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount (`dataset.organizationId`, `dataset.router='hash'`, `dataset.theme` only), marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`, `app/styles/app.css`: no `<audio>`, `<video>`, `<track>`, `autoplay`, `HTMLMediaElement`, `Audio` / `AudioContext`, or `speechSynthesis`. The only speech-adjacent host copy is marketing text (“event-media experience”, “Image/video layouts”). Iconify is an SVG icon loader (`index.html` defer script); it does not play sound.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) injects GTM only after analytics consent. GTM is a tag loader, not host-authored prerecorded audio-only. `.env.example` leaves `VITE_GTM_ID` empty.
5. [WCAG 2.2 SC 1.4.7](https://www.w3.org/TR/WCAG22/#low-or-no-background-audio) (Level AAA) applies only to **prerecorded audio-only** content that (1) contains primarily speech in the foreground, (2) is not an audio CAPTCHA or audio logo, and (3) is not primarily musical vocalization. Then at least one of: no background sounds; background can be turned off; background is ≥20 dB below foreground speech. [Understanding 1.4.7](https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html): the SC is about separating speech from background in audio-only recordings. With no host-authored audio-only content, there is no 1.4.7 failure on this host.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Live gallery video or lightbox audio fails this host SC:** widget internals are out of scope; host `mountEmbed` does not set media/`autoplay` attributes on `qrati-connect`. 1.4.7 is audio-only (no video); gallery video is not this SC even inside the widget.
- **GTM / analytics could inject speech-with-music ads:** not host-authored; GTM loads only after optional analytics consent and is absent unless `VITE_GTM_ID` is set. Not a host 1.4.7 defect.
- **1.4.2 already covered audio, so this cannot be a separate workflow:** 1.4.2 is autoplay longer than 3 seconds with a pause/volume control. 1.4.7 is background-vs-speech in prerecorded audio-only. Traced separately against primary Understanding text.
- **CSS transitions, Iconify fetch, or cookie banner are audio:** they are visual/network only.
- **Issue search** `1.4.7 OR "background audio" OR "low or no background" OR audio-only`: no matching issues (open set empty). Closed 1.4.2 / 1.2.x media reports are different SCs. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 1.4.7 Low or No Background Audio](https://www.w3.org/TR/WCAG22/#low-or-no-background-audio)
- [WCAG 2.2 Understanding SC 1.4.7](https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html)
- `app/components/qrati-demo.gts` (no media elements; embed data attributes only)
- `index.html`, `app/styles/app.css`, `src/worker.ts`, `app/lib/cookieConsent.ts`
- Prior: 1.4.2 (20261110T124338Z); 1.2.1 (20261110T130338Z); 2.2.2 (20261109T231938Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 1.4.7 Understanding. Embed widget media is out of scope.

## Timing

TIMING_TABLE_PLACEHOLDER

## PR / checks

PR_META_PLACEHOLDER
