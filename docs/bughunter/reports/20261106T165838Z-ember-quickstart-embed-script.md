# Ember example quickstart embed script

- **Scope:** On-page developer-integration recipe and first FAQ answer in `app/components/qrati-demo.gts` (quickstart + “How do I embed…”).
- **Base:** `origin/main` at `b2cae6b36d878bf2a2fc20bb15bc281ad2c3253f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T165838Z-850917e0261b400abb34ba392271b5cd-ember`, `bughunter/20261106T165838Z-850917e0261b400abb34ba392271b5cd-ember`.
- **Run:** `20261106T165838Z-850917e0261b400abb34ba392271b5cd`.

## Finding

**[P3] Ember example quickstart shows web component instead of embed script** — **Evidence:** `QratiDemo` quickstart (`id="quickstart-heading"`) contained `pnpm add @qratilabs/qrati-connect` and `&lt;qrati-connect …&gt;`; first FAQ said to “render its element”. Reachable on every page view of the Ember example. **Failure:** This host’s contract is the classic embed loader (`README.md`, `mountEmbed` injecting `embed/embed.js` with `data-organization-id` / `data-router` / `data-theme`). The example does not depend on `@qratilabs/qrati-connect`. Copy-paste of the on-page recipe uses a different API than the live demo and than `@qratilabs/qrati-connect` script-tag docs. **Fix:** replace the snippet with the escaped classic `<script src="…/embed/embed.js">` tag and describe the embed script in the FAQ. **Test:** `tests/unit/ember-quickstart-embed-script-test.ts` via `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

- Entry: host page → `application.gts` → `QratiDemo`.
- Live widget: `mountEmbed` creates an async script (`EMBED_URL` defaulting to jsDelivr `embed/embed.js`) with `dataset.organizationId`, `dataset.router = 'hash'`, `dataset.theme`.
- Package.json dependencies: `vanilla-cookieconsent` only; no `@qratilabs/qrati-connect`.
- README: “Integration method: Embed script”; web component listed under other frameworks.
- Connect package README: script-tag loader vs web component vs React are separate APIs.
- Out of scope: cookie consent, theme toggle, worker routing, contrast (already tracked).

## Falsification

- Not intentional dual-API teaching: intro admitted “package or embed script” but the only code sample was the web component, which this repo never mounts.
- Feature-map copy still mentioning “Web component” describes product capabilities, not this host’s recipe; left unchanged.
- Empty-org embed behavior remains unknown (prior 2026-10-17 embed-configuration audit); not claimed here.
- No duplicate open/closed issue for this mismatch (`gh issue list` / search).

## Disposition

Confirmed source/docs defect. Issue [#36](https://github.com/qrati-labs/qrati-connect-ember-example/issues/36). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/ember-quickstart-embed-script-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- This repo `README.md` embed-script snippet
- `@qratilabs/qrati-connect` README “Script tag” vs “Web Component” sections (`qrati-connect-ts`)

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session. Local unit tests not executed per BugHunter boundary.

## Timing

TIMING_TABLE_PLACEHOLDER
