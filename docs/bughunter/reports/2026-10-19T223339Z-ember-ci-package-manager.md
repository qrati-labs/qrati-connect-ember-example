# CI dependency installation uses the wrong package manager

- **Scope:** Ember example CI workflow at base `5f305b6` (`main` fetched from `origin/main`); audit run `20261019T223339Z-24f50a301bc148ca88ed79b4e5a02a53`.
- **Finding:** `[medium]` Both CI jobs use `npm ci` although the repository declares pnpm 11.1.3 and tracks only `pnpm-lock.yaml`. Installation fails before lint/test commands execute, so every CI run is blocked.
- **Evidence:** `.github/workflows/ci.yml:23-30,37-47`; `package.json:4,17-31`; tracked `pnpm-lock.yaml`; no npm lockfile. The two jobs' failure path is deterministic from the workflow and lockfile mismatch.
- **Root cause:** CI setup and install commands assume npm, inconsistent with the repository's package manager and lockfile.
- **Fix:** Configure pnpm 11.1.3, pnpm lockfile caching, frozen-lockfile installation, and invoke existing lint/test scripts through pnpm in both jobs.
- **Issue:** https://github.com/qrati-labs/qrati-connect-ember-example/issues/10
- **Regression check authored:** CI workflow itself now exercises a frozen pnpm install in both jobs and calls lint/test. No separate test file is appropriate for this workflow-level defect. **NOT RUN BY BUGHUNTER**; expected automated verification is the PR's GitHub Actions `Lint` and `Test` jobs.
- **Validation:** `git diff --check` only; no CI, builds, tests, lint, type-checks, installs, or package-manager commands run locally.
- **Limitations:** GitHub Actions execution is delegated to CI; not observed during this audit. No production systems touched.
- **PR:** https://github.com/qrati-labs/qrati-connect-ember-example/pull/11 (base SHA `5f305b6c82156561862112bfa50d11d0bf8748d8`, head SHA `5abb573b060318d4fc632ec677e3b5d8a1cb75d5`; GitHub reports mergeable; issue #10 is a closing issue reference).
- **Observed checks at initial PR verification:** `GitGuardian Security Checks` passed; `Lint`, `Test`, and Cloudflare Workers build were pending. No CI results are asserted beyond that snapshot.
- **Measured timing (UTC):** preflight 2026-10-19T22:33:39Z–22:34:05Z, 00:00:26; audit 22:34:14Z–22:35:50Z, 00:01:36; total run 22:33:39Z–22:35:50Z, 00:02:12. Unclassified interval: 00:00:09. Timing ledger: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261019T223339Z-24f50a301bc148ca88ed79b4e5a02a53.json`.
