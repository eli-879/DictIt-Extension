## 1. Search State & Filtering

- [x] 1.1 Add a `query` state (`useState("")`) to `VocabularyList` in `src/components/VocabularyList.tsx`
- [x] 1.2 Derive a `filtered` array: keep entries where `entry.word` or `entry.content.definition` contains `query` (both lowercased) as a substring

## 2. Search Input UI

- [x] 2.1 Render a controlled search `<input>` above the list, bound to `query`, with a placeholder like "Search words…" and class `vocab-list__search`
- [x] 2.2 Render the `filtered` entries (instead of `words`) in the list

## 3. Empty States

- [x] 3.1 Keep the existing "No words saved yet." message for when `words.length === 0`
- [x] 3.2 When `words.length > 0` but `filtered.length === 0`, render a distinct "No words match your search." message (class `vocab-list__empty`); ensure the search input stays visible in this state so the user can adjust the query

## 4. Styling

- [x] 4.1 Add `.vocab-list__search` styles (full-width input, padding, border, matching the existing card aesthetic) to `src/components/VocabularyList.scss`
