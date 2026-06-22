## 1. Sort logic & control

- [x] 1.1 In `src/components/VocabularyList.tsx`, define `SortKey = "date" | "word"`, `SortDir = "asc" | "desc"`, and a `sort` state of type `{ key: SortKey; dir: SortDir }` defaulting to `{ key: "date", dir: "desc" }`.
- [x] 1.2 After the existing `query` filtering, sort a non-mutating copy of the filtered entries by `sort.key`/`sort.dir`: word via `localeCompare` (case-insensitive), date via `dateAdded`; treat unparTable dates as oldest. Keep the comparator keyed off `SortKey` so adding a key is a one-line change.
- [x] 1.3 Render a labeled `<select>` sort control on its own full-width row directly below the search input (both column children of `.vocab-list`) whose options map onto `{ key, dir }` values (Newest first → `{date,desc}`, Oldest first → `{date,asc}`, A–Z → `{word,asc}`), bound to `sort`.

## 2. Styling

- [x] 2.1 Add styles for the sort control in `src/components/VocabularyList.scss` consistent with the existing search input.

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it compiles with no type errors.
- [ ] 3.2 Load the unpacked extension and confirm switching sort options reorders the list correctly (A–Z, newest first, oldest first) and that the default is newest first.
- [ ] 3.3 Confirm sorting composes with search: filter to a subset, then verify the selected sort order applies to only the matching entries.
