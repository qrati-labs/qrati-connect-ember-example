# Ember embed theme remount vs document.body

- **Scope:** Host `mountEmbed` theme path in `app/components/qrati-demo.gts` (wipe + re-inject `embed.js` vs in-place `theme` update). Excludes cookie-consent, webfonts, heading sibling layout (#26), org-id fallback.
- **Base:** `origin/main` at `f4d009243821accae4b0163463363240c2f29c8a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T005838Z-65a248f6ad0a4819bf47c1cef9327bec-ember`, `bughunter/20261107T005838Z-65a248f6ad0a4819bf47c1cef9327bec-ember`.
- **Run:** `20261107T005838Z-65a248f6ad0a4819bf47c1cef9327bec`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` path missing (`/home/hermes/Projects/main`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P2] Theme remount can mount a second gallery on document.body** — **Evidence:** `mountEmbed` set `element.innerHTML = ''` then appended a new async classic `embed.js`. Trigger: Light/Dark toggle while the previous loader is in-flight. **Failure:** HTML still executes a classic script prepared while connected after it is disconnected; `document.currentScript` still points at the detached tag; the loader’s `resolveMount` falls back to `document.body`. **Fix:** inject the loader once; on theme change set `theme` on existing `<qrati-connect>` or `data-theme` on the in-flight script. **Test:** `tests/unit/embed-theme-remount-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` → `QratiDemo`. Constructor sets theme + cookie consent (out of scope).
2. `.widget-embed-host {{mountEmbed this.theme}}` is a sibling of the sr-only gallery `h2` (issue #26).
3. Previously: every theme change cleared the host and injected a new `script async` with `data-organization-id`, `data-router="hash"`, `data-theme`.
4. [Prepare the script element](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element) requires connectedness only at insertion. [Execute the script element](https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element) still runs after removal and sets `currentScript` on the detached node.
5. `qrati-connect-ts` `src/exports/embed.ts` `resolveMount`: no `parentNode` → `{ parent: document.body }`.
6. `<qrati-connect>` observes `theme` and `renderComponent(false)` on theme-only changes (`element.tsx`).

Authz/validation/persistence: none (public demo). Side effects: second live gallery + hash router on `body`. Errors: loader `console.warn` only if `data-target` misses; this host set no `data-target`.

## Falsification

- **Scripts never run after `innerHTML` wipe:** contradicted by the HTML spec note that `currentScript` is set specifically because the element may have been removed prior to execution.
- **`async` on `createElement('script')` skips execute:** prepare already ran on `appendChild`; async only defers execute until fetch completes.
- **Must remount because script tags ignore attribute mutation:** true for the loader tag; false for upgraded `<qrati-connect>` (`observedAttributes` includes `theme`). In-flight `dataset.theme` is read at bootstrap (`readConfig`).
- **Issue #26 already fixed this:** #26 moved the heading out of the wiped node; it did not stop the wipe or the body fallback.
- **Hash-routing audit already closed this:** that run recorded the race as unconfirmed spec behavior; spec text is now cited.

## Disposition

Confirmed P2. Issue [#60](https://github.com/qrati-labs/qrati-connect-ember-example/issues/60). Ownership map has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/embed-theme-remount-test.ts`; `tests/unit/gallery-heading-embed-mount-test.ts` updated so it no longer requires `innerHTML = ''`.
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**).
- Patch hygiene: `git diff --check` — no whitespace errors.

## Citations

- [HTML spec — execute the script element](https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element)
- [HTML spec — prepare the script element](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element)
- `qrati-connect-ts` `src/exports/embed.ts` `resolveMount`; `src/exports/element.tsx` `observedAttributes` / `attributeChangedCallback`
- `app/components/qrati-demo.gts` `mountEmbed`

## Limitations

CodeGraph unindexed. No browser session; public example URL historically 404. Spec-backed, not live-toggled.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

## PR / checks

Placeholder until remote read-back.
