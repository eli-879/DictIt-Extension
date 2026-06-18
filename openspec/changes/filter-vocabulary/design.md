## Context

`VocabularyList` receives the full `words: WordEntry[]` array from `App.tsx` and renders each entry. There is currently a single empty state ("No words saved yet.") when the array is empty. Filtering is a presentation concern local to this component — `App.tsx` continues to own the canonical list and storage sync.

## Goals / Non-Goals

**Goals:**
- Let the user narrow the visible list by typing a query
- Match against both the word and its definition, case-insensitively
- Distinguish "nothing saved" from "nothing matches your search"

**Non-Goals:**
- Persisting the search query across panel reloads
- Fuzzy matching, ranking, or highlighting matches
- Searching pronunciation, word type, or example usage text (word + definition is sufficient)
- Debouncing — the list is small and filtering is cheap

## Decisions

### Local component state, filter at render

`VocabularyList` holds `query` in `useState` and derives the filtered array inline during render. No need to lift state to `App.tsx` — nothing else depends on the query, and the source `words` array stays untouched.

**Alternative considered**: lift query to `App.tsx`. Rejected — adds prop plumbing for state that only this component uses.

### Match on word + definition, case-insensitive substring

Lowercase the query and test `entry.word` and `entry.content.definition` with `includes`. Simple, predictable, and covers the common "I remember part of the word or its meaning" case.

### Two distinct empty states

- `words.length === 0` → "No words saved yet." (unchanged)
- `words.length > 0` but filtered result is empty → "No words match your search."

This keeps the existing first-run experience intact while giving clear feedback during search.

## Risks / Trade-offs

- **Query not persisted across reloads** → Acceptable; search is a transient action, and the panel reopening fresh is expected behavior.
- **Definition may be empty for some entries** → `includes` on an empty string is safe; such entries simply won't match definition text but still match on word.
