## Context

The vocabulary list lives entirely in `src/components/VocabularyList.tsx`. It receives the full `WordEntry[]` from `App.tsx` (loaded once from `chrome.storage.local`) and already owns a local `query` state that filters the array in render before mapping to `VocabularyEntry` rows. New entries are prepended in `App.tsx` (`[entry, ...prev]`), so today's effective order is "newest first" by insertion.

Every `WordEntry` already carries `word: string` and `dateAdded: string` (ISO timestamp), so no model or storage change is needed — sorting is a pure view concern layered onto the existing in-memory array, exactly like the search filter.

## Goals / Non-Goals

**Goals:**
- Let the user reorder the displayed list: alphabetical (A–Z), date newest-first, date oldest-first.
- Keep sorting a display-only transform that composes cleanly with the existing search filter.
- Match the existing component-scoped styling convention (co-located `.scss`).

**Non-Goals:**
- Persisting the chosen sort order across panel sessions.
- Changing storage, the `WordEntry` model, or the capture/lookup/save/delete flows.
- Additional sort keys (e.g., by word type or definition length).

## Decisions

### Decision: Sort state local to VocabularyList, applied after filtering
Add a `sortOrder` state to `VocabularyList` alongside the existing `query` state. In render, filter first (existing logic), then sort the filtered array with a non-mutating copy (`[...filtered].sort(...)`). This mirrors how `query` already works and keeps `App.tsx` and storage untouched.

*Alternative considered:* lifting sort state into `App.tsx` or sorting the stored array. Rejected — sorting is a presentation concern; storing or lifting it adds coupling for no benefit.

### Decision: Model sort as two orthogonal dimensions (`{ key, dir }`), not a flat enum
Represent the chosen sort as a structured value rather than a single flat string:

```ts
type SortKey = "date" | "word";          // extend with "wordType", "definitionLength", ... later
type SortDir = "asc" | "desc";
type Sort = { key: SortKey; dir: SortDir };
```

Default to `{ key: "date", dir: "desc" }` to preserve current behavior (newest first).

The motivation is future scaling. "Sort by" is secretly two questions — *what to sort on* (key) and *which direction* (dir). A flat enum like `"date-desc" | "date-asc" | "alpha"` collapses them, so the option count grows multiplicatively (keys × directions) and each new key must be hand-enumerated for both directions. Modeling `{ key, dir }` makes adding a key a linear, one-line change and keeps the sort/filter logic and storage untouched.

Crucially, this decouples the model from the UI: the same `{ key, dir }` state can be rendered as a flat dropdown today, or a key-selector + direction-toggle, or a popover sort menu later — without touching ordering logic. We therefore keep the data model two-dimensional and treat the control as a swappable renderer.

*Alternative considered:* flat `SortOrder` union + single `<select>`. Rejected — simplest to build but bakes the "one label per key×direction combination" assumption into every consumer, so it does not scale past a handful of keys.

### Decision: Initial UI control
For this change, render the smallest control that satisfies the spec: a single labeled `<select>` whose options map onto `{ key, dir }` values (Newest first → `{date,desc}`, Oldest first → `{date,asc}`, A–Z → `{word,asc}`). This keeps side-panel chrome minimal now while the two-dimension model leaves room to switch to a key+direction or popover UI when more keys arrive.

*Alternative considered:* building the key-selector + direction-toggle UI now. Deferred — not justified for two keys, and the model makes it a non-breaking later swap.

### Decision: Sort control on its own full-width row, below the search input
Place the sort `<select>` on its own row directly beneath the existing search input (both as column children of `.vocab-list`), rather than sharing a row with search. The side panel is narrow (~300–375px of usable width after `.app` padding); putting both controls on one row squeezes the search field to ~160px and leaves no room for longer option labels or future keys. A dedicated row gives each control full width, keeps labels readable, scales as sort keys grow, and is the smaller markup change (one more column child, no flex-row wrapper needed).

*Alternative considered:* in-line with the search bar (shared row). Rejected — too cramped at side-panel width and degrades as labels/keys are added. *Also considered:* a collapsed icon → popover menu; deferred as more build than warranted now, and reachable later without model changes.

### Decision: Comparison details
- Alphabetical: `a.word.localeCompare(b.word, undefined, { sensitivity: "base" })` for case-insensitive ordering.
- Date: compare `dateAdded` via `Date.parse` (or string compare, since ISO 8601 sorts lexicographically); descending = newest first.

*Sorting on a copy* avoids mutating the prop array, preventing surprises if React reuses it.

## Risks / Trade-offs

- **Sort order resets on panel close** → Acceptable per Non-Goals; can add `chrome.storage` persistence later if requested.
- **Re-sorting on every keystroke while filtering** → Lists are small (personal vocabulary); the combined filter+sort is O(n log n) on a short array, negligible. No memoization needed initially.
- **Legacy entries with malformed `dateAdded`** → `Date.parse` may yield `NaN`; treat unparTable dates as oldest so they sink to the bottom rather than throwing.
