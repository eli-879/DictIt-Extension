## Why

All component styles are co-mingled in `App.scss`, making it hard to know which rules belong to which component. Two component-level SCSS files (`VocabularyEntry.scss`, `IncomingWordPanel.scss`) already exist and are imported by their components but only carry a fraction of each component's rules, leaving the codebase in an inconsistent split state that will get harder to manage as more components are added.

## What Changes

- Move `.incoming-panel*` rules from `App.scss` into `src/components/IncomingWordPanel.scss`
- Move `.vocab-entry*` rules from `App.scss` into `src/components/VocabularyEntry.scss`
- Create `src/components/VocabularyList.scss` with the `.vocab-list*` rules and import it in `VocabularyList.tsx`
- Retain only truly global rules in `App.scss`: `.app` wrapper and `.btn*` button utilities

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
<!-- none — this is a pure style refactor with no behavior or requirement changes -->

## Impact

- `src/App.scss` — remove component-specific rule blocks; keep `.app` and `.btn*`
- `src/components/IncomingWordPanel.scss` — receive `.incoming-panel*` rules; already imported
- `src/components/VocabularyEntry.scss` — receive `.vocab-entry*` rules; already imported
- `src/components/VocabularyList.scss` — new file with `.vocab-list*` rules
- `src/components/VocabularyList.tsx` — add import for `./VocabularyList.scss`
