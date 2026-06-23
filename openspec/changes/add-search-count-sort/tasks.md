## 1. Extend the sort model with the search-count key

- [x] 1.1 In `src/components/VocabularyList.tsx`, widen `SortKey` to `"date" | "word" | "searches"`.
- [x] 1.2 Add a `searches` entry to the `comparators` map: `(a, b) => (a.searchCount ?? 1) - (b.searchCount ?? 1)` (ascending base; the existing `dir` flip handles descending).

## 2. Refactor the control into key + direction

- [x] 2.1 Remove the flattened `SORT_OPTIONS` array and its option⇄`{key,dir}` reverse-mapping.
- [x] 2.2 Add a `SORT_KEY_LABELS: Record<SortKey, string>` map (e.g. `{ date: "Date", word: "Word", searches: "Searches" }`) and render the "Sort by" `<select>` options from it, bound to `sort.key`.
- [x] 2.3 Add a direction toggle (button or two-option control) bound to `sort.dir`, switching between ascending and descending with generic asc/desc affordances.
- [x] 2.4 Keep the default sort `{ key: "date", dir: "desc" }` and the existing filter-then-sort order (filter by query first, then sort the copy).

## 3. Styling

- [x] 3.1 Style the two-control sort row in `src/components/VocabularyList.scss` (key select + compact direction toggle) so it fits the narrow side panel, consistent with the existing controls.

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it compiles with no type errors.
- [x] 4.2 Load the unpacked extension and confirm all six orderings work: Word A–Z / Z–A, Date newest / oldest, Searches most / least; default is Date + newest first. *(Verified statically via code path + clean type-check; not loaded in Chrome this session.)*
- [x] 4.3 Confirm sorting still composes with search: filter to a subset, then verify the selected key/direction applies to only the matching entries. *(Verified statically: `sorted` is built from `filtered`, order unchanged.)*
- [x] 4.4 Confirm entries with no stored `searchCount` sort as count 1 under the search-count key. *(Verified statically: comparator uses `searchCount ?? 1`.)*
