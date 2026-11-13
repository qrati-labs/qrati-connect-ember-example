# Ember host WCAG 2.4.9 link purpose (link only)

- **Scope:** WCAG 2.2 SC 2.4.9 Link Purpose (Link Only) on host-authored `<a>` elements in `QratiDemo`: hero `Qrati` links, GitHub/VS Code action pills, Contact CTA, footer nav (`qrati.com`, npm, GitHub, Pricing). Excludes 2.4.4 in-context (20261109T183438Z), 3.2.5 new-tab indication (#146), 1.4.1 underline (#49), cookie-consent chrome, embed-shadow links.
- **Base:** `origin/main` at `bea93041e9fabd8f43ff1fd5a874b20d8db067cb`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T131438Z-71898bc2ef884de2ab64acf765a66943-ember`, `bughunter/20261113T131438Z-71898bc2ef884de2ab64acf765a66943-ember`.
- **Run:** `20261113T131438Z-71898bc2ef884de2ab64acf765a66943`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main'`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.4.9. Link accessible names are not F84 generic (“click here” / “more”). Terse footer labels (`npm`, `GitHub`, `Pricing`) are AAA enhancements, not a violated product invariant.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single history index).
2. Nine host `<a>` elements in `app/components/qrati-demo.gts`. Theme-toggle and Cookie Preferences are `<button>`. Footer brand `<img>` is not wrapped in an anchor. Worker (`src/worker.ts`) does not inject links.
3. SC 2.4.9 (AAA): a mechanism is available so the purpose of each link can be identified from **link text alone**, except where the purpose would be ambiguous to users in general. [Understanding 2.4.9](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html). “The name of the document or web application would be sufficient.” F84 is nondescript text such as “click here” or “more” with no mechanism to expand it.
4. Accessible names from source (visible text + in-link `.sr-only`; SVGs `aria-hidden="true"`):
   - Hero `<h1>` and `.hero-copy`: `Qrati (opens in a new tab)` → `https://qrati.com` (same destination twice). Brand name of the destination application.
   - Action pills: `View on GitHub (opens in a new tab)` → this example repo; `Open in VS Code (opens in a new tab)` → `vscode.dev` of that repo.
   - Contact CTA: `Contact Qrati →` → `https://qrati.com/contact-us` (no `target="_blank"`).
   - Footer: `qrati.com (opens in a new tab)`; `npm (opens in a new tab)` → `@qratilabs/qrati-connect` package listing; `GitHub (opens in a new tab)` → `https://github.com/qrati-labs`; `Pricing (opens in a new tab)` → `https://qrati.com/pricing`.
5. No host control changes short link text to long form (G189 / SCR30). Names are the default (and only) mechanism.

Authz/validation/persistence: none (public demo). Side effects: `target="_blank"` + `rel="noopener noreferrer"` on off-site links except Contact. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`npm` / `GitHub` / `Pricing` fail F84:** F84 examples are “click here” / “read more”. Understanding: the name of the destination document or web application is sufficient. `npm` names the registry app; `GitHub` names the org host; `Pricing` names that page. Not F84.
- **Hero `Qrati` is too short out of context:** 2.4.9 allows the application name. Both `Qrati` anchors share `https://qrati.com` (identical-name / equivalent-purpose test rule).
- **Must file because 2.5.5 / 3.2.5 were AAA confirms:** those had source-measurable host contracts (44×44 boxes; `target=_blank` without a new-tab name). 2.4.9 is unclaimed; terse-but-named footer labels are not that class.
- **Missing G189 expander is itself 2.4.9:** the mechanism may be the default link text. An expander is needed only when short text is otherwise nondescript.
- **Issue search** `2.4.9 OR "link only" OR "link purpose"`: no matching issue (open set empty). Closed #49 (1.4.1 underline) and #146 (3.2.5 new tab) are different paths. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.9 Link Purpose (Link Only)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html)
- [WCAG 2.2 SC 2.4.9](https://www.w3.org/TR/WCAG22/#link-purpose-link-only)
- [F84](https://www.w3.org/WAI/WCAG22/Techniques/failures/F84)
- [H30](https://www.w3.org/WAI/WCAG22/Techniques/html/H30) / [G91](https://www.w3.org/WAI/WCAG22/Techniques/general/G91)
- `app/components/qrati-demo.gts` (nine host anchors)
- Prior: 2.4.4 (20261109T183438Z); 3.2.5 (#146)

## Limitations

CodeGraph unindexed. No screen-reader “list of links” session; accessible names inferred from source. Live `https://qrati.com/connect/ember-example` was not used as evidence.

## Timing

TIMING_PLACEHOLDER

## PR / checks

PR_PLACEHOLDER
