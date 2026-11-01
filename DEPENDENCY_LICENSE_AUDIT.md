# Dependency license metadata audit

**Snapshot reviewed:** `package-lock.json`  
**Scope:** npm package metadata recorded in the committed lockfile; this is not a legal opinion or a complete asset-rights review.

## Inventory

The lockfile contains 565 package entries under `packages`.

| Declared license metadata | Package entries |
|---|---:|
| MIT | 467 |
| Apache-2.0 | 22 |
| ISC | 34 |
| BSD-2-Clause | 11 |
| BSD-3-Clause | 7 |
| Apache-2.0 AND MIT | 9 |
| BlueOak-1.0.0 | 3 |
| Hippocratic-2.1 | 2 |
| Other declared expressions | 4 |
| Missing license field | 6 |

The six entries with missing license metadata are:

- `@tailwindcss/typography/node_modules/postcss-selector-parser`
- `class-variance-authority`
- `cross-spawn`
- `lodash.castarray`
- `lodash.isplainobject`
- `lucide-react`

The lockfile records Hippocratic-2.1 for `react-leaflet` and `@react-leaflet/core`. Review the exact license text and compatibility with the project's intended distribution and use before release.

## Follow-up

1. Verify missing license metadata against authoritative package license files.
2. Review the Hippocratic-2.1 terms for the two React Leaflet packages.
3. Verify fonts, icons, images, maps, and other externally sourced assets independently.
4. Regenerate this report whenever the lockfile changes.

**Limitations:** package-lock metadata can be absent, stale, or simplified. Counts include optional and platform-specific package entries. This report does not replace actual license texts or notices.
