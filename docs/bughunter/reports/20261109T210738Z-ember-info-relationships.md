# Ember host WCAG 1.3.1 info and relationships

- **Scope:** WCAG 2.2 SC 1.3.1 Info and Relationships for host-authored structure in `QratiDemo`: landmarks (`header`/`main`/`footer`/`nav`), heading outline, section naming, FAQ `details`/`summary`, feature/SEO cards, short-answer bullets, action-pills grouping, footer brand image. Excludes 2.4.6 heading/label *wording* (20261109T200338Z), 2.4.1 bypass (20261107T044738Z), 1.1.1 decorative Iconify (20261107T021238Z), 4.1.2 name/role/value as a separate SC, cookie-consent internals beyond host-supplied titles, embed internals.
- **Base:** `origin/main` at `815e9b883d234aac78589707550f23ab5770d781`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T210738Z-4ea2aa9279eb469599e4019ced0caa1a-ember`, `bughunter/20261109T210738Z-ember-workflow`.
- **Run:** `20261109T210738Z-4ea2aa9279eb469599e4019ced0caa1a`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single application index).
2. Landmarks in `app/components/qrati-demo.gts` DOM order: theme-toggle (button, outside landmarks) → `<header class="hero">` (banner) → `<main class="content-shell">` → `<footer class="footer">` with `<nav aria-label="Footer navigation">`.
3. Heading outline (one `h1`, then `h2` sections, then card `h3`s; no skipped levels):
   - `h1`: “Qrati Connect inside an Ember host site”
   - gallery `h2.sr-only`: “Live Event Photo Gallery Component” (section also has `aria-label="Interactive Ember Event Gallery"`)
   - `h2`: “What does Qrati Connect add to Ember?”
   - `h2#feature-map-heading` + six `h3` cards
   - `h2#features-heading` + four `h3` cards
   - `h2#quickstart-heading`, `h2#faq-heading`, CTA `h2`
4. Programmatic section names: `aria-labelledby` on feature-map, SEO features, quickstart, and FAQ sections. `answer-section` and `seo-cta-section` expose their in-section `h2`s without `aria-labelledby` (heading-in-section is sufficient; H69/ARIA12 not required together).
5. Relationships:
   - FAQ: native `<details>`/`<summary>` (four items; first `open`).
   - Feature/SEO cards: `<article>` wrapping `h3` + supporting `<p>`.
   - Short-answer bullets: four sibling `<span>`s in `.answer-points` (CSS grid), each a distinct element.
   - Action pills: two named links in `<div class="action-pills" aria-label="Example links">` (no `role`; `aria-label` on a generic is not mapped).
   - Footer logo: `<img alt="Qrati Connect logo">`.
6. Cookie-consent copy (`app/lib/cookieConsent.ts`) supplies modal/section titles that vanilla-cookieconsent 3.1.0 renders as the library’s labeled regions; host does not re-implement that tree.
7. SC 1.3.1 (A): information, structure, and relationships *conveyed through presentation* can be programmatically determined or are available in text. [Understanding 1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html). Sufficient techniques used here: HTML landmarks, H42 headings, H69 section headings, native `details`/`summary`.

Authz/validation/persistence: none (public demo). Side effects on this path: none from structure markup. Errors: none thrown by landmarks/headings.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`.answer-points` is not a `<ul>`:** H48 is a sufficient technique, not a required one. The four items are separate elements with visible text; the check-mark is in the text node, not color-only. Not a demonstrated 1.3.1 failure.
- **`aria-label` on `.action-pills` without a role:** the grouping name is not exposed, but both links have visible accessible names. 1.3.1 does not require a named group around two adjacent links. 4.1.2 applies to UI components, not a generic `div`.
- **Theme-toggle outside `<header>`:** still a native `button`; landmark membership is not required for 1.3.1.
- **Gallery `aria-label` vs sr-only `h2` wording mismatch:** both describe the live gallery. Redundant naming is not a relationship failure.
- **Missing `aria-labelledby` on `.answer-section` / `.seo-cta-section`:** each contains a descriptive `h2`. 1.3.1 does not require ARIA naming when the heading is in the section.
- **Iconify hosts without `aria-hidden`:** decorative; adjacent `h3`s carry the topic. 1.1.1 / 4.1.2, previously not claimed without an AT session (20261107T021238Z).
- **Issue search** `info OR relationship OR landmark OR 1.3.1 OR heading structure OR list`: no matching open issue. Closed #26 is gallery heading vs embed remount (different defect). No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [WCAG 2.2 SC 1.3.1](https://www.w3.org/TR/WCAG22/#info-and-relationships)
- [H42: Using h1-h6 to identify headings](https://www.w3.org/WAI/WCAG22/Techniques/html/H42)
- [H69: Providing heading elements at the beginning of each section of content](https://www.w3.org/WAI/WCAG22/Techniques/html/H69)
- [ARIA11: Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `app/lib/cookieConsent.ts`

## Limitations

CodeGraph unindexed. No browser/AT session; structure is from source. Live `https://qrati.com/connect/ember-example` was not used as evidence this run.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PENDING

## PR / checks

- Issue: none (report-only)
- PR: pending
- Local tests **NOT RUN BY BUGHUNTER**
