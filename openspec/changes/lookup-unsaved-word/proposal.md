## Why

Today the side panel's search box only filters words the user has already saved. When the user searches for a word that isn't in their vocabulary, they hit a dead end ("No words match your search") and have to leave the extension to look it up elsewhere. Since the panel already knows how to fetch and save a definition, we can turn that dead end into a one-click way to look the word up and add it.

## What Changes

- When a vocabulary search returns no matching saved word, the empty-state SHALL offer to look the typed word up in the dictionary (instead of only showing "No words match your search").
- Triggering the look-up SHALL fetch the word's definition, pronunciation, word type, and example usage from the dictionary API and present it for review using the existing incoming-word flow, with the option to Save or Dismiss.
- Saving from a search look-up SHALL persist the word as a `WordEntry` (upsert by normalized form) and surface it in the vocabulary list, identical to saving an incoming word captured from the page.
- No change to how words are captured from the page (context menu / Google definition button) or to the existing filter/sort behavior when matches do exist.

## Capabilities

### New Capabilities
- `search-lookup`: Looking up a word from the vocabulary search box when it is not already saved, and saving the result into the vocabulary.

### Modified Capabilities
<!-- The vocabulary-list and word-lookup specs are reused as-is; their requirements
     do not change. The new trigger and empty-state behavior are captured in the
     new search-lookup capability. -->

## Impact

- `src/components/VocabularyList.tsx`: the no-match empty state gains a "look up" affordance and must surface the typed query upward.
- `src/App.tsx`: routes a search-initiated look-up through the existing `showIncomingWord` / `handleSave` path (or an equivalent), so the `IncomingWordPanel` and saved list react as they do for page captures.
- Reuses existing modules unchanged: `useDictionaryLookup` (dictionary API fetch), `IncomingWordPanel` (review + Save/Dismiss), and `storage.saveWord` (upsert).
- No new dependencies, permissions, or storage shape changes; relies on the dictionary API already in use (`api.dictionaryapi.dev`).
