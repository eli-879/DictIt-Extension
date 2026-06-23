## Context

`VocabularyList` (`src/components/VocabularyList.tsx`) already models sort as a two-dimensional value:

```ts
type SortKey = "date" | "word";
type SortDir = "asc" | "desc";
type Sort = { key: SortKey; dir: SortDir };
```

with a `comparators: Record<SortKey, (a, b) => number>` map and a `sort.dir === "asc" ? r : -r` flip. The *model* is already key×direction. What hides that is the **view**: a single `SORT_OPTIONS` array flattens the matrix into four explicit `<select>` entries (`date-desc`, `date-asc`, `word-asc`, `word-desc`) and reverse-maps the chosen option back to `{ key, dir }`. Adding a third key would push that flat list to six entries and require hand-maintaining the option⇄`{key,dir}` mapping.

`searchCount` is present on every `WordEntry` (a missing value is displayed as 1 per the existing entry-display requirement), so no storage or model change is needed.

## Goals / Non-Goals

**Goals:**
- Add `searches` as a third sort key ordered by `searchCount`.
- Surface the existing key×direction model directly in the UI as two controls, removing the flattened option list.
- Preserve current defaults and filter-then-sort composition.

**Non-Goals:**
- Persisting the chosen sort across sessions (it stays component state, as today).
- Changing storage, the `WordEntry` shape, or any capture/lookup/save behavior.
- Adding further keys (e.g., last-searched date) — out of scope.

## Decisions

### Decision: Split the control into a key `<select>` plus a direction toggle
Replace the single `SORT_OPTIONS` `<select>` with two controls bound to the existing `sort` state: a "Sort by" `<select>` whose options are the `SortKey`s (Date / Word / Searches), and a direction toggle (a button or a two-option control) bound to `sort.dir`. The flattened `SORT_OPTIONS` array and its reverse-mapping are removed.

- **Why:** The state is already `{ key, dir }`; the flat list was the only thing obscuring it. Two controls make the 3×2 matrix explicit, and adding a key becomes "add a comparator + one `<option>`" with no option-string bookkeeping.
- **Alternative considered:** Keep one `<select>` and append two options. Rejected per the chosen direction — it scales poorly (a key adds two options and two mapping rows) and the user explicitly asked to refactor.

### Decision: Drive the key `<select>` options from a `SortKey`-keyed label map
Define a small `SORT_KEY_LABELS: Record<SortKey, string>` (e.g. `{ date: "Date", word: "Word", searches: "Searches" }`) and render `<option>`s from it. The comparator map stays the single source of truth for *how* each key orders.

- **Why:** Adding a key touches exactly two co-located places (the comparator and the label map), both `Record<SortKey, …>`, so TypeScript flags an omission. No separate option list to keep in sync.

### Decision: `searches` comparator uses `searchCount ?? 1`, ascending as the base
`comparators.searches = (a, b) => (a.searchCount ?? 1) - (b.searchCount ?? 1)`, with the existing `dir` flip turning descending into most-searched-first.

- **Why:** Mirrors the entry-display rule that a missing `searchCount` reads as 1, and matches the existing comparator convention (return ascending; let `dir` handle direction).

### Decision: Direction labels stay generic (ascending/descending), not key-aware
The direction toggle uses neutral asc/desc affordances (e.g. ↑/↓ or "Ascending/Descending") rather than per-key wording like "A–Z" / "Most searched".

- **Why:** Keeps the toggle independent of the selected key (no relabeling logic), which is the whole point of separating the two dimensions. Key-aware labels are a possible later polish, not required for correctness.

## Risks / Trade-offs

- **Generic direction labels are less self-explanatory than the old named options ("Newest first")** → Mitigation: pair the direction control with clear ascending/descending icons or text; the key selector names the dimension, so "Date + descending" is still legible. Revisit with key-aware labels only if users find it unclear.
- **This change edits the same sort code as the in-progress `add-word-sort-option` change** → Mitigation: this change supersedes that control's flat-`<select>` shape; reconcile by treating this as the current sort design when that change is applied/archived. Note the overlap in the proposal.
- **A two-control row takes more horizontal space than one `<select>` in the narrow side panel** → Mitigation: lay the key select and direction toggle on one row with the toggle compact (icon-sized), or wrap to a second line if needed; styling task covers fit.
