## Why

The vocabulary list now tracks how many times each word has been searched (`searchCount`), but users can only sort by date added or alphabetically — there's no way to surface the words they look up most (or least). Adding a third sort key pushes the current single 4-option `<select>` toward a long flat list, so this is also the moment to restructure the control before it grows unwieldy.

## What Changes

- Refactor the sort control from a single flat `<select>` into two composable controls: a **"Sort by" key selector** (Date / Word / Searches) and a **direction toggle** (ascending / descending). The 3 keys × 2 directions yield all six orderings.
- Add **search count** as a sort key, ordered by `WordEntry.searchCount` (a missing count counts as 1, matching how entries display it).
- Preserve existing behavior: default order stays date added, newest first; sorting still operates on the displayed entries without touching storage; sorting still composes with the active search filter (filter first, then sort).
- No change to capture, look-up, save, delete, or the storage shape — `searchCount` already exists on every entry.

## Capabilities

### New Capabilities
<!-- None; this extends an existing capability. -->

### Modified Capabilities
- `vocabulary-list`: The "Sort vocabulary by selected order" requirement changes — the sort control is restructured into a key selector plus a direction toggle, and a new "search count" key is added (six total orderings).

## Impact

- **Component** (`src/components/VocabularyList.tsx`): widen `SortKey` to include `"searches"`; add a `searches` comparator; replace the single `SORT_OPTIONS` `<select>` with a key `<select>` + direction toggle bound to the existing `{ key, dir }` sort state.
- **Styling** (`src/components/VocabularyList.scss`): styles for the two-control sort row (key select + direction toggle).
- **No changes** to storage (`src/storage.ts`), the `WordEntry` model, background, or the incoming-word flow — `searchCount`, `dateAdded`, and `word` already exist on every entry.
- Overlaps the same sort code as the in-progress `add-word-sort-option` change; this change supersedes that control's flat-`<select>` shape.
