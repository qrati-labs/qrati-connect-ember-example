# Ember host theme toggle audit

- **Scope:** Public theme toggle in `app/components/qrati-demo.gts`: initial preference read, host document theme updates, persisted preference, and embed script reinjection.
- **Base:** `origin/main` at `5f305b6c82156561862112bfa50d11b0bf572346`.
- **Finding:** No confirmed defect in this bounded workflow.
- **Trace/evidence:** `QratiDemo.theme` reads `qc-theme` and otherwise falls back to `prefers-color-scheme`; its constructor synchronizes `data-theme` and the `dark` class. The button calls `toggleTheme`, which changes the tracked value, updates both document theme indicators, and persists the selected value. The `mountEmbed` modifier depends on `theme`, clears the mount point, and injects a script with the matching `data-theme`; README documents the reinjection behavior. `isDark` derives from the tracked theme for the button label. These paths are internally consistent for stored `light`/`dark` values and both toggle directions.
- **Impact/severity:** No defect established. Malformed stored values and browser behavior were not exercised; do not infer a user impact from source inspection alone.
- **Disposition:** Report-only; no issue, source change, or regression test warranted absent a reproducible defect.
- **Tests:** None authored; no tests run. No exact test command applies.
- **Validation/limitations:** CodeGraph index unavailable. Source and README reviewed; no browser/live site validation. `git diff --check` only.
- **Related PR overlap:** Existing PRs #1–#3 change only BugHunter documentation, not the theme toggle implementation.
- **Timing (measured):** Start 2026-10-17 11:02:39 UTC (16:32:39 IST); end 2026-10-17 11:03:51 UTC (16:33:51 IST); total 1m12s. Phase: workflow mapping and trace, 1m12s. No duration estimated.
- **PR/checks:** To be recorded after publication/readback.
