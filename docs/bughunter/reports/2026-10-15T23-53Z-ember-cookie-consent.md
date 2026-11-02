# BugHunter audit: Ember cookie-consent and analytics startup

- **UTC:** 2026-10-15 23:53
- **Repository/base:** `qrati-connect-ember-example` at `5f305b6c82156561862112bfa50d11d0bf8748d8` (`origin/main`)
- **Workflow:** determine geographic consent requirement, initialize CookieConsent, and synchronize analytics/ad consent with GTM.
- **Outcome:** No verified code defect; report-only PR. No production code or test changes made.

## Flow and bounded scope

`app/components/qrati-demo.gts` invokes `initCookieConsent()` from its constructor. `app/lib/cookieConsent.ts` checks a sessionStorage geo-decision cache; on a cache miss it calls the same-origin geo endpoint when hostname contains `qrati.com`, otherwise the Qrati endpoint. It stores `required`, falls back to requiring consent on thrown errors, initializes CookieConsent in opt-in or opt-out mode, then synchronizes GTM consent. GTM insertion is gated on `acceptedCategory('analytics')`, a configured GTM ID, and absence of an existing `gtm-script` element. Consent callbacks also synchronize consent values.

Scope included the Ember demo component, consent helper, application template, test setup and package scripts. One-hop cross-repository API implementation was not available in this checkout; the external geo endpoint behavior was therefore not assumed. Excluded unrelated page content, visual styling, and the full Qrati Connect embed internals.

CodeGraph was initialized in the isolated worktree and used to trace the target symbols; its index did not surface the relevant component/helper in the initial symbol match, so the directly related source was then verified from disk. The temporary CodeGraph index was removed after inspection.

## Findings

- **No confirmed defect.** The geo lookup is fail-closed on thrown network, parsing, and storage errors (`catch` returns `true`); GTM consent updates default to denied unless analytics is accepted, and GTM insertion requires analytics acceptance. This is consistent with the documented CookieConsent distinction: opt-in scripts require acceptance, while opt-out activation is tied to categories configured `enabled: true`.[1]
- **Test-quality gap (non-defect):** the repository has no test files beyond helper setup/placeholders, and `package.json` has a test script but no committed workflow-specific assertions. Consent initialization, cache behavior, network error handling, callback state, and duplicate GTM insertion are untested.
- **Potentially useful future hardening, not changed:** explicitly validate the geo response HTTP status and its `required` boolean before caching. Current catch handles thrown failures but accepts any JSON object with a missing/wrong-typed `required` field; the exact API contract and desired handling should be verified against the endpoint before changing behavior.

## Tests and quality evidence

- **Unit:** none present for this workflow; no test added because no defect was established and dependencies were unavailable to execute a credible regression suite.
- **Integration:** none identified.
- **E2E:** none identified.
- **Coverage:** not measured.
- `pnpm test` and lint/type/build were not run: `pnpm` is not installed in the execution environment and `node_modules` is absent. The repository declares `pnpm@11.1.3` and requires Node >=22.
- GitHub auth succeeded; no existing open PR was found for this repository before this audit.
- Performance: not measured.

## Recommendations

1. Add focused helper tests using a real DOM/browser test environment and deterministic geo-response cases (valid true/false, non-OK response, invalid payload, network failure, cached value).
2. Add an integration assertion that rejecting analytics never inserts the GTM script and leaves all four consent signals denied; accepting analytics should insert the script once and produce granted signals.
3. Verify the geo endpoint contract before deciding whether invalid responses require explicit schema validation; retain the current fail-closed posture.

## Research sources

CookieConsent documents `opt-in` as requiring user acceptance and `opt-out` behavior as activating scripts configured under categories with `enabled: true`.[1] Its getting-started guide shows `categories` and `language` as required run configuration, with callbacks for consent state.[2]

## Commands and results

- `gh auth status` — authenticated as `qratilabsagent`.
- Fresh preflight reported fetch success and a clean source checkout; source default branch SHA and `git ls-remote` both reported `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- `gh pr list -R qrati-labs/qrati-connect-ember-example --state open` — no open PRs.
- `codegraph init` and MCP exploration completed; temporary index removed with `codegraph uninit --force`.
- `pnpm --version` — command not found; `node_modules` absent.

## PR status

Report-only PR to be opened from `bughunter/ember-example-workflow-20261015`. Checks are pending until GitHub creates the PR.

## Sources

[1] https://cookieconsent.orestbida.com/reference/configuration-reference.html — CookieConsent configuration reference
[2] https://cookieconsent.orestbida.com/essential/getting-started.html — CookieConsent getting started
