# Ember example robots and sitemap routing audit

- **Scope:** `public/robots.txt` → advertised sitemap URL → `public/sitemap.xml` through the Cloudflare Worker asset path.
- **Base:** `origin/main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- **Disposition:** Report-only; no confirmed defect; no issue created.

## Trace and evidence

`public/robots.txt:4` advertises `https://qrati.com/connect/ember-example/sitemap.xml`. The deployment route in `wrangler.jsonc:6` covers the `/connect/ember-example` mount; `src/worker.ts:10-18` removes that prefix from matching requests and passes the rewritten request to `env.ASSETS.fetch`. Thus an external request for the advertised sitemap is mapped to `/sitemap.xml`, the asset corresponding to `public/sitemap.xml`. The XML's sole `<loc>` at `public/sitemap.xml:1` is the canonical public page `https://qrati.com/connect/ember-example`; `index.html:7-8` agrees on indexability and canonical URL.

## Finding / impact

No reachable failure or violated invariant was established in this bounded robots/sitemap discovery workflow. The paths, public URL, and canonical URL are mutually consistent on source inspection. No external request was made, so deployed edge behavior and asset availability remain unverified; this is a limitation, not a claimed defect.

## Tests

No tests authored. No tests run (**NOT RUN BY BUGHUNTER**; no test command applicable to this report-only audit).

## Timing (measured wall-clock; UTC)

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-10-22T16:18:39Z | 2026-10-22T16:19:04Z | 00:00:25 (0.4 min) |
| `audit` | 2026-10-22T16:19:13Z | 2026-10-22T16:20:26Z | 00:01:13 (1.2 min) |
| **Total run (preflight start to finish)** | 2026-10-22T16:18:39Z | 2026-10-22T16:20:26Z | **00:01:47 (1.8 min)** |
| Unclassified interval between marked phases | — | — | 00:00:10 (0.2 min) |
