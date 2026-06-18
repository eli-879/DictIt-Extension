## Why

As the saved vocabulary list grows, scrolling to find a specific word becomes tedious. A search box that filters the list by word or definition text lets users jump straight to what they're looking for.

## What Changes

- Add a search input at the top of the vocabulary list
- Filter the displayed entries by case-insensitive substring match against the word and its definition
- Show a distinct "no matches" empty state when a search yields no results (separate from the existing "no words saved yet" state)
- Filtering is purely client-side over the already-loaded entries; storage and fetching are unchanged

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `vocabulary-list`: Adds a requirement for filtering the displayed entries via a search query, and refines the empty-state behavior to distinguish "no words saved" from "no matches for search".

## Impact

- `src/components/VocabularyList.tsx` — add search input, hold query state, filter entries before rendering
- `src/components/VocabularyList.scss` — style the search input and the no-matches state
- No changes to storage, the data model, or the dictionary lookup
