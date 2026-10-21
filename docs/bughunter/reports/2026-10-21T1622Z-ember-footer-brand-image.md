# Ember footer brand image audit

- Scope: footer logo loading and accessibility in the Ember demo.
- Base: `main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- Finding: no confirmed defect; report-only.

## Trace and evidence

`app/templates/application.gts` renders `QratiDemo` on the application route. Its template in `app/components/qrati-demo.gts` includes a footer `<img>` pointing to `https://assets.qrati.com/images/qrati-connect-logo-square.png`, with the non-empty alternative text `Qrati Connect logo` and `referrerpolicy="no-referrer"`. The repository also contains local brand assets under `public/`, but this footer image does not currently use those files.

The image request is a browser-side request to an external asset host. The source contains no explicit load/error handling or fallback, so an unavailable or blocked host could leave the logo absent. That is an availability risk, not a confirmed defect: no evidence in this workflow establishes that the host is failing or that the asset is unavailable. The non-empty alt text preserves the brand identification for assistive technology when the image cannot be rendered.

Compared the HTML entrypoint and repo asset references: no second footer-logo code path or competing fallback was found. Open PR #12 audits theme/cookie consent, #11 CI package-manager configuration, #9 deployment routing, and #8 FAQ disclosures; none changes the footer image path or behavior. Other open PRs similarly document distinct workflows or concern other files. No issue created because no confirmed defect was established.

## Disposition

No source or test changes. No regression test authored. Limitations: the external asset's live availability and browser/network behavior were not probed; no external test was performed. Tests/builds/lint were not run under BugHunter constraints.

## Timing

Timing table is pending completion of the run's timing ledger; no durations are estimated or backfilled.
