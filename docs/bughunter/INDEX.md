# BugHunter reports

- [2026-11-06 — Ember host Contact CTA text contrast](reports/20261106T124038Z-ember-cta-contrast.md) — P3 confirmed; `--cta-bg` for `.btn-cta-primary`; issue [#18](https://github.com/qrati-labs/qrati-connect-ember-example/issues/18).

- [2026-11-06 — Ember social document-head identity](reports/2026-11-06T115738Z-ember-social-head.md) — confirmed low-severity defect; missing Open Graph/Twitter image tags and document-relative favicon. Issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16).

- [2026-10-22 — Ember robots and sitemap routing](reports/2026-10-22T161839Z-ember-robots-sitemap.md) — report-only; no confirmed defect.
# BugHunter audit reports

| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-22 | Ember FAQ disclosures | No confirmed defect | [Report](reports/2026-10-22T101539Z-ember-faq-disclosures.md) |
# BugHunter reports

| Date (UTC) | Workflow | Result | Report | Measured duration |
|---|---|---|---|---|
| 2026-10-21 | Ember footer brand image | No confirmed defect; report-only | [Audit](reports/2026-10-21T1622Z-ember-footer-brand-image.md) | 00:02:37 (total; includes 00:00:09 unclassified) |
- [2026-10-20 — Ember theme and cookie-consent initialization](reports/2026-10-20T1209Z-ember-theme-cookie-workflow.md) — report-only; no confirmed defect. Measured total review time: 00:01:18 (UTC).
- [2026-10-19 — Ember CI dependency installation uses the wrong package manager](reports/2026-10-19T223339Z-ember-ci-package-manager.md) — confirmed CI setup defect; issue [#10](https://github.com/qrati-labs/qrati-connect-ember-example/issues/10), [PR #11](https://github.com/qrati-labs/qrati-connect-ember-example/pull/11). Total run: 00:02:12 (measured wall-clock, UTC); audit: 00:01:36.
# BugHunter index

| UTC date | Workflow | Outcome | Report |
|---|---|---|---|
| 2026-10-19 | Ember example deployment and subpath asset delivery | Report-only: live route returned HTTP 404; source-path behavior could not be confirmed as the deployed cause | [20261019T002838Z-ember-deployment-route.md](reports/20261019T002838Z-ember-deployment-route.md) |
# BugHunter reports

| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-18 19:31 | Ember FAQ disclosures | No confirmed defect; report-only | [FAQ disclosure workflow](reports/2026-10-18T19-31Z-ember-faq-disclosures.md) |
| Date (UTC) | Scope | Result | Report |
|---|---|---|---|
| 2026-10-18 | Ember example crawler discovery | No confirmed defect; report-only | [Crawler discovery audit](reports/20261018T174138Z-ember-crawler-discovery.md) |
| 2026-10-17 | Ember embed configuration and startup | No confirmed defect; report-only | [Report](reports/20261017T161839Z-ember-embed-configuration.md) |
- [20261017T145940Z — Ember public navigation](reports/20261017T145940Z-ember-public-navigation.md) — report-only; no confirmed defect.
| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-17 | Ember host theme toggle | No confirmed defect; report-only | [Report](reports/20261017T110239Z-ember-theme-toggle.md) |
| 2026-10-17 | Ember Worker subpath asset routing | No confirmed defect; report-only | [Report](reports/20261017T073239Z-ember-worker-routing.md) |
| 2026-10-17 | Ember Worker subpath asset routing | No confirmed defect; report-only | [Report](reports/20261017T073239Z-ember-worker-routing.md) |
# BugHunter audit index

| UTC | Workflow | Repositories / base SHAs | Outcome / severity | Tests / coverage | Research sources | Report | PR / blocker |
|---|---|---|---|---|---|---|---|
| 2026-10-16 12:21 | Ember cookie-consent workflow recheck | `qrati-connect-ember-example` `5f305b6c82156561862112bfa50d11d0bf8748d8` | No confirmed new defect; report-only | No tests authored or run; coverage not measured | Prior audit sources: [CookieConsent configuration](https://cookieconsent.orestida.com/reference/configuration-reference.html); [getting started](https://cookieconsent.orestida.com/essential/getting-started.html) | [Recheck report](reports/2026-10-16T12-23Z-ember-consent-recheck.md) | PR to be opened |
| 2026-10-15 23:53 | Ember cookie-consent and GTM analytics startup | `qrati-connect-ember-example` `5f305b6c82156561862112bfa50d11d0bf8748d8` | No confirmed defect; report-only, test-coverage gap | No workflow tests; coverage not measured; test/lint/build blocked (`pnpm` missing, dependencies absent) | [CookieConsent configuration](https://cookieconsent.orestida.com/reference/configuration-reference.html); [getting started](https://cookieconsent.orestida.com/essential/getting-started.html) | [Audit report](reports/2026-10-15T23-53Z-ember-cookie-consent.md) | PR #1 https://github.com/qrati-labs/qrati-connect-ember-example/pull/1 |
| 2026-10-15 23:53 | Ember cookie-consent and GTM analytics startup | `qrati-connect-ember-example` `5f305b6c82156561862112bfa50d11d0bf8748d8` | No confirmed defect; report-only, test-coverage gap | No workflow tests; coverage not measured; test/lint/build blocked (`pnpm` missing, dependencies absent) | [CookieConsent configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html); [getting started](https://cookieconsent.orestbida.com/essential/getting-started.html) | [Audit report](reports/2026-10-15T23-53Z-ember-cookie-consent.md) | PR to be opened; checks pending |
