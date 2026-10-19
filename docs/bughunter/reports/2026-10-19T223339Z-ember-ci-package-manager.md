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
- **PR:** pending.
- **Measured timing:** pending timing ledger completion.
