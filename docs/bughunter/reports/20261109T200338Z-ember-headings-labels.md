# Ember host WCAG 2.4.6 headings and labels

- **Scope:** WCAG 2.2 SC 2.4.6 Headings and Labels for host-authored headings and control labels in `QratiDemo` (hero `h1`, section `h2`/`h3`, FAQ `<summary>`s, theme-toggle, Contact CTA text, footer Cookie Preferences, cookie-consent modal titles/buttons/sections). Excludes 1.3.1 heading markup/landmarks (not this SC), 2.4.2 page titled (20261109T185738Z), 2.4.4 link purpose (20261109T183438Z), 2.5.3 label-in-name / theme-toggle (issue #34), 3.3.2 labels-or-instructions, 4.1.2 name/role/value, embed internals.
- **Base:** `origin/main` at `13c77e40735f5b9b62dbc63b259845514d45667b`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T200338Z-a18689dc01c948e4aecd6e84a8240573-ember`, `bughunter/20261109T200338Z-a18689dc01c948e4aecd6e84a8240573-ember`.
- **Run:** `20261109T200338Z-a18689dc01c948e4aecd6e84a8240573`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single application index). Document title is a separate SC (2.4.2).
2. Host headings in `app/components/qrati-demo.gts` (one `h1`, then `h2` sections, then card `h3`s):
   - `h1`: “Qrati Connect inside an Ember host site”
   - `h2.sr-only`: “Live Event Photo Gallery Component” (gallery section; section also has `aria-label="Interactive Ember Event Gallery"`)
   - `h2`: “What does Qrati Connect add to Ember?”
   - `h2#feature-map-heading`: “One embed. The full event experience.” plus `h3` cards (Embed cleanly, Run the event, Show every memory, Collect uploads, Make it social, Keep people safe)
   - `h2#features-heading`: “A reliable event layer, ready for Ember” plus `h3` cards (Live photo wall, Guest uploads, Reactions and contests, Framework-friendly)
   - `h2#quickstart-heading`: “Embed in 3 simple steps”
   - `h2#faq-heading`: “Frequently asked questions”
   - `h2`: “Give every event a place to come alive.”
3. Host control labels (visible text; no extra `aria-label` on these controls):
   - `.theme-toggle`: `☀ Light` / `🌙 Dark` from `this.isDark` (issue #34 dropped a generic `aria-label` so the visible name is the accessible name)
   - FAQ `<summary>`s: four questions that match the disclosure topic
   - Contact CTA: “Contact Qrati →”
   - Footer: “Cookie Preferences”
4. Cookie-consent copy (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0 `language.translations.en`): first-layer title “We use cookies”; buttons Accept all / Reject analytics / Manage preferences; preferences title “Cookie preferences”; section titles “Strictly necessary cookies” / “Analytics cookies”; `closeIconLabel: 'Close'`.
5. SC 2.4.6 (AA): **if** headings or labels are provided, they describe topic or purpose. [Understanding 2.4.6](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html): the SC does not require headings or labels to exist (1.3.1 / 3.3.2 / 4.1.2 cover markup, presence, and accessible name). A word, or even a single character, may suffice. Sufficient techniques: G130 descriptive headings, G131 descriptive labels.

Authz/validation/persistence: none (public demo). Side effects on this path: theme persist, `showCookiePreferences`, outbound links. Errors: none thrown by heading/label text.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme-toggle “Light”/“Dark” is not descriptive of “theme”:** Understanding 2.4.6 allows a single word when it cues purpose. The control’s visible name is the destination appearance; #34 already required that name to be used. Not a 2.4.6 failure.
- **Missing `aria-labelledby` on `.answer-section` / `.seo-cta-section`:** those sections still have descriptive `h2`s. 2.4.6 does not require programmatic association (1.3.1).
- **sr-only gallery `h2` vs section `aria-label` wording mismatch:** both describe the live gallery. 2.4.6 is description of topic, not identical strings.
- **Empty / placeholder headings:** none. `id="your-organization-id"` appears only as escaped `data-organization-id` inside the quickstart `<pre><code>` snippet, not as a heading/label id.
- **iconify-icon without text:** decorative next to `h3`s; not headings or labels. 1.1.1 / 4.1.2 out of scope.
- **Heading level skips or landmark gaps:** 1.3.1 / 2.4.10, not 2.4.6.
- **Issue search** `heading OR label OR 2.4.6 OR headings`: closed issues (#26 gallery heading remount, #34 label-in-name) are different defects. No open match. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
- [WCAG 2.2 SC 2.4.6](https://www.w3.org/TR/WCAG22/#headings-and-labels)
- [G130: Providing descriptive headings](https://www.w3.org/WAI/WCAG22/Techniques/general/G130)
- [G131: Providing descriptive labels](https://www.w3.org/WAI/WCAG22/Techniques/general/G131)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`

## Limitations

CodeGraph unindexed. No browser/AT session; heading and label strings are from source. Live `https://qrati.com/connect/ember-example` was not used as evidence this run.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-09T20:03:38Z | 2026-11-09T20:04:03Z | 01:33:38 | 01:34:03 | 00:00:25 (0.4 min) |
| `audit` | 2026-11-09T20:04:25Z | 2026-11-09T20:06:25Z | 01:34:25 | 01:36:25 | 00:02:00 (2.0 min) |
| `delivery` | 2026-11-09T20:06:25Z | 2026-11-09T20:07:23Z | 01:36:25 | 01:37:23 | 00:00:57 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-09T20:03:38Z | 2026-11-09T20:07:23Z | 01:33:38 | 01:37:23 | **00:03:45 (3.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T200338Z-a18689dc01c948e4aecd6e84a8240573.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/92
- Base `main` `13c77e40735f5b9b62dbc63b259845514d45667b` / head `bughunter/20261109T200338Z-a18689dc01c948e4aecd6e84a8240573-ember`
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
