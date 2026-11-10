# Ember host WCAG 2.5.8 target size (remaining controls)

- **Scope:** WCAG 2.2 SC 2.5.8 Target Size (Minimum) for remaining host-authored pointer targets in `QratiDemo` after the footer-only audit (20261107T053238Z): `.theme-toggle`, `.action-pills a`, `.btn-cta-primary`, FAQ `<summary>`. Excludes footer nav / Cookie Preferences (already audited), hero/footer inline `Qrati` / text links (inline exception), cookie-consent modal chrome (library-owned), embed internals (`qrati-connect` / `embed.js`), 2.5.5 Target Size (Enhanced, AAA), 2.5.2 pointer cancellation (20261110T051738Z).
- **Base:** `origin/main` at `ddb5a2bf738c5aaea10756e671b3107335f2c538`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T184938Z-f047c4ae0e1d427dade8766ef0acc07e-ember`, `bughunter/20261110T184938Z-f047c4ae0e1d427dade8766ef0acc07e-ember`.
- **Run:** `20261110T184938Z-f047c4ae0e1d427dade8766ef0acc07e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Remaining host pointer targets live in `app/components/qrati-demo.gts` and `app/styles/app.css`. `:root { line-height: 1.5 }` with UA 16px root.
2. [SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) (AA): pointer targets are at least 24×24 CSS pixels unless Spacing, Equivalent, Inline, User agent control, or Essential applies.
3. **Theme toggle** (`.theme-toggle`): `display: inline-flex; align-items: center; padding: 0.5rem 0.9rem; font-size: 0.78rem`. Content line box `0.78rem × 1.5 = 12.48px × 1.5 = 18.72px`. Height `8 + 8 + 18.72 = 34.72px`. Horizontal padding `14.4px` each side plus “☀ Light” / “🌙 Dark” text. Both axes ≥ 24px. Later `position: absolute` override does not change the box size.
4. **Action pills** (`.action-pills a`): `inline-flex; padding: 0.7rem 1rem; font-size: 0.8rem`. Height `11.2 + 11.2 + 19.2 = 41.6px`. Width includes 16px padding plus label (`View on GitHub` / `Open in VS Code`) and 16px icon. Both axes ≥ 24px. Flex `gap: 0.65rem` (10.4px) is extra spacing, not required once size is met.
5. **Contact CTA** (`.btn-cta-primary`): `padding: 0.8rem 1.4rem` (first rule) kept under `inline-flex` (second rule). Height `12.8 + 12.8 + 24 = 49.6px`. Width includes `22.4px` padding plus “Contact Qrati →”. Both axes ≥ 24px.
6. **FAQ `<summary>`**: `.faq-list summary` sets only `cursor` and `font-weight: 600`. Font size inherits 1rem; height `16 × 1.5 = 24px`. Visible names are full questions (width ≫ 24px). Padding `1rem` is on `details`, not `summary`; the activation target is the summary box. Adjacent closed summaries: collapsed vertical margins `0.75rem` plus `1rem` details padding each side → `16 + 12 + 16 = 44px` gap; center-to-center `68px` (Spacing would also pass if height were under 24px).
7. Hero `Qrati` anchors sit in heading/copy sentences → **Inline** exception; not re-tested as undersized controls. Footer targets remain out of scope (20261107T053238Z).

Authz: none (public demo). Persistence: none on this path. Side effects: theme persist, navigation, FAQ open/close. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Open issues: none.

## Falsification

- **Footer undersize (18.72px) applies here:** contradicted; these controls are padded buttons/pills/CTA or 24px-tall summaries, not the footer `padding: 0` text controls.
- **FAQ summary is exactly 24px so it fails:** “at least 24” includes 24. Width of each question exceeds 24px.
- **Details padding is not part of the summary, so FAQ fails:** padding does not shrink the summary; it only adds space around it. Size still 24×(text width).
- **Must meet 2.5.5 44×24/44×44 (AAA):** not claimed. Theme-toggle height 34.72px would fail 2.5.5; that is out of scope.
- **CSS `transform` on hover changes the hit box below 24px:** hover `translateY` / `scale(1.02)` is visual; the layout box used for 2.5.8 is the untransformed border box (still ≥ 24px).
- **Issue search** `2.5.8 OR target size OR FAQ summary tap`: no matching open issue. Closed hits (#138 gtag, #60 remount, #57 overflow, #51 org id, #49 hero underline) are different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-connect-ts` is mapped High / Chiranjeet Sarkar; this example repo is not). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.5.8 Target Size (Minimum)](https://www.w3.org/TR/WCAG22/#target-size-minimum)
- [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- `app/components/qrati-demo.gts` (theme toggle, action pills, Contact CTA, FAQ `<summary>`)
- `app/styles/app.css` (`.theme-toggle`, `.action-pills a`, `.btn-cta-primary`, `.faq-list details` / `summary`)
- Prior: footer 2.5.8 (20261107T053238Z)

## Limitations

CodeGraph unindexed. Sizes from authored CSS tokens at 16px root, not a computed-style / screenshot capture. No pointer session on `https://qrati.com/connect/ember-example`. No claim about cookie-consent / embed hit targets.

## Timing

TIMING_PLACEHOLDER
