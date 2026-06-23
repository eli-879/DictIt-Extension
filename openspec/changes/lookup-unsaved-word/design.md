## Context

The side panel already has all the pieces this feature needs, just wired for a different trigger:

- `VocabularyList` (`src/components/VocabularyList.tsx`) owns the search box. It filters saved `words` by query and renders `"No words match your search."` when the filtered result is empty.
- `useDictionaryLookup` (`src/hooks/useDictionaryLookup.ts`) fetches a word from `api.dictionaryapi.dev` and exposes `{ content, loading, error }`, distinguishing 404 (not found → `content: null`, `error: false`) from network/server failure (`error: true`).
- `IncomingWordPanel` (`src/components/IncomingWordPanel.tsx`) renders that lookup result with loading / not-found / error states and Save / Dismiss buttons.
- `App` (`src/App.tsx`) coordinates: `showIncomingWord(raw)` sets `pendingWord`, which mounts `IncomingWordPanel`; `handleSave` upserts via `storage.saveWord` and re-reads the list.

The only thing missing is a path from "search query with no match" to "show that query in the incoming-word panel." `App` already renders both `IncomingWordPanel` and `VocabularyList`, so the wiring is local.

## Goals / Non-Goals

**Goals:**
- Turn the no-match search empty-state into a one-click look-up of the typed query.
- Reuse the existing lookup → review → save flow (`useDictionaryLookup`, `IncomingWordPanel`, `saveWord`) without duplicating it.
- Keep filter/sort behavior unchanged when matches exist.

**Non-Goals:**
- Changing how words are captured from the page (context menu / Google definition button).
- Auto-saving search results without user confirmation.
- The "previously searched" badge / `searchCount` increment behavior — a word reached via search is by definition not yet saved, so the new-word path (no badge) applies as-is.
- New dictionary sources, permissions, or storage shape changes.

## Decisions

### Decision: Reuse the incoming-word panel rather than a new inline result view
The look-up result is presented by mounting the existing `IncomingWordPanel` for the searched query — the same component already used for page captures. `App` lifts the search query up via a callback from `VocabularyList` and feeds it into the existing `pendingWord` flow.

- **Why:** `IncomingWordPanel` already implements every state this feature needs (loading, full result, not-found, error, Save/Dismiss) and `App.handleSave` already does the correct upsert + list refresh. Reuse keeps one rendering path and one save path.
- **Alternative considered:** Render an inline result card inside `VocabularyList`'s empty state. Rejected — it would duplicate `IncomingWordPanel`'s state handling and a second save path, and `VocabularyList` currently has no access to storage/save.

### Decision: `VocabularyList` reports the query up via a required `onLookup` callback
`VocabularyList` gains a **required** `onLookup(query: string)` prop. In the no-match branch it renders a button ("Look up '<query>'") that calls `onLookup(trimmedQuery)`. `App` passes a handler that routes the query into the pending-word flow.

- **Why:** Keeps `VocabularyList` presentational — it knows the query and that there's no match (information it already computes), and delegates the side-effecting lookup to `App`, consistent with how `onDelete` is already lifted.
- **Why required, not optional:** `VocabularyList` has exactly one caller (`App`), which always wires up lookup, and its sibling prop `onDelete` is already required. Making `onLookup` optional would add a fallback empty-state branch that can never execute in production (dead, untested-by-use code) and would type-claim a "no lookup" mode that does not exist. If a read-only usage ever appears, re-adding `?` is a trivial one-character change (YAGNI until then).
- **Alternative considered:** Have `VocabularyList` own the lookup hook and panel itself. Rejected — concentrates save/storage concerns in a list component and splits the save logic across two places.

### Decision: Reuse the new-word branch of the save flow (no badge, no count bump)
A searched word that had no match is, by construction, not in storage, so it flows through the existing "new word" path: no prior-search badge, `searchCount` initialized to 1 on save. The look-up trigger does not call `incrementSearchCount`.

- **Why:** Matches existing semantics — `searchCount` tracks captures of already-saved words; a brand-new look-up starting at 1 is exactly what `saveWord` does for inserts.

### Decision: Optionally clear the search box after a successful save
After a search-initiated save, optionally reset the query so the just-saved word appears in the list rather than leaving the user staring at a now-stale "no match" state. This is a small UX refinement carried in the relevant task; behavior is acceptable either way since the saved word is included once the filter is cleared.

## Risks / Trade-offs

- **Query passed to the dictionary API may be a phrase or contain noise (the search box accepts anything)** → The look-up affordance only appears for non-empty queries; the trimmed query is sent as-is and a not-found/error state is handled gracefully by `IncomingWordPanel`. No new validation is required beyond trimming.
- **A search-triggered panel could visually collide with a page-capture panel if a `NEW_WORD` arrives simultaneously** → Both use the single `pendingWord` slot in `App`; the later trigger replaces the earlier, which is the existing single-panel behavior. No concurrent panels are introduced.
- **Reusing `pendingWord` means a search look-up and a page capture share one state path** → Acceptable and intended; it guarantees identical rendering/saving and avoids a second code path.
