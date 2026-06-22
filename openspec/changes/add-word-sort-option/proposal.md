## Why

The vocabulary list always shows entries in a single fixed order (most recently added first), so a user with a growing word list has no way to scan it alphabetically or revisit the oldest words. A simple sort control lets users reorder the list to match how they want to study.

## What Changes

- Add a sort control above the vocabulary list with options to sort **alphabetically (A–Z)** and **by date added (newest first / oldest first)**.
- Sorting operates on the already-loaded entries in the side panel and works together with the existing search filter (filter, then sort the visible results).
- Sorting does not modify storage; it only changes display order.
- No change to how words are captured, looked up, saved, or deleted.

## Capabilities

### New Capabilities
<!-- None; this extends an existing capability. -->

### Modified Capabilities
- `vocabulary-list`: Add a requirement that the side panel provide a user-selectable sort order (alphabetical and by date added) applied to the displayed entries, composing with the existing search filter.

## Impact

- **Component** (`src/components/VocabularyList.tsx`): add sort-order state, a sort control, and ordering logic applied after filtering.
- **Styling** (`src/components/VocabularyList.scss`): styles for the new sort control.
- **No changes** to storage (`src/storage.ts`), the `WordEntry` model, background, or the incoming-word flow — `dateAdded` and `word` already exist on every entry.
