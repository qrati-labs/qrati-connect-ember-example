# Ember embed configuration and startup audit

- Run: `20261017T161839Z-60ee701a`
- Scope: Ember demo's configuration-to-widget startup path (`VITE_ORGANIZATION_ID`, CDN URL, script injection, theme reinjection).
- Base: `origin/main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- Result: no confirmed defect; report-only.

## Trace and evidence

`app/components/qrati-demo.gts:9-25` reads the optional organization ID and CDN URL, creates an async script, supplies organization/router/theme data attributes, and appends it to `.widget-frame`. The modifier is reevaluated with the tracked theme and clears the container before reinjection. `README.md` documents the environment variables and the script integration.

The organization ID defaults to an empty string. The source establishes that an empty value is passed through, but the repository does not contain the embed package's validation contract or observable behavior for missing IDs. It is therefore not established whether this is rejected, intentionally supported, or causes a user-visible failure. Likewise, no local load-error handling is present, but there is insufficient evidence for the third-party loader's resulting UI or contract. These are limitations/questions, not confirmed findings; no issue or code change is justified on this evidence.

## Impact, confidence, limitations

No confirmed user-facing failure or violated contract demonstrated. Confidence in the report-only disposition: moderate. The audit did not execute the external widget or inspect its deployed implementation. Runtime behavior and missing-configuration expectations remain unknown.

## Tests

No test authored; no confirmed defect warranted a regression test. Tests/build/lint/type-check were not run, per BugHunter boundary.

## Timing

- Started: 2026-10-17 16:18:39 UTC (21:48:39 IST)
- Finished: 2026-10-17 16:20:00 UTC (21:50:00 IST)
- Total measured wall time: 00:01:21
- Phases: preflight 00:00:21 (provided); scope/source trace and eligibility 00:01:00 (16:19:00–16:20:00 UTC).

## Delivery

Report-only documentation PR; no issue required. PR/check state to be recorded after remote readback.
