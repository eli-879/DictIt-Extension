## Why

The vocabulary card currently shows only a word and its first definition, leaving out richer data that the dictionary API already returns — pronunciation, part of speech, and example usage. Adding these fields makes each saved entry more useful for learning and review.

## What Changes

- Extend the `WordEntry` data model with optional `pronunciation`, `wordType`, and `exampleUsage` fields
- Update the dictionary lookup hook to extract pronunciation (phonetic text), part of speech, and example sentence from the API response alongside the existing definition
- Update the incoming-word panel to display pronunciation, word type, and example usage before the user saves
- Update the vocabulary list entry card to render the new fields for saved words

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `word-lookup`: The lookup panel now displays pronunciation, part of speech, and example usage in addition to the definition. The `WordEntry` model gains three optional fields populated at save time.
- `vocabulary-list`: The entry display format expands from word + definition + date to also include pronunciation, word type, and example usage when available.

## Impact

- `src/constants/wordEntry.ts` — add `pronunciation`, `wordType`, `exampleUsage` optional fields
- `src/hooks/useDictionaryLookup.ts` — extract and return the three new fields from the API payload
- `src/components/IncomingWordPanel.tsx` — render the new fields in the preview card
- `src/components/VocabularyEntry.tsx` — render the new fields in saved-entry cards
- `src/storage.ts` / `src/App.tsx` — pass the new fields through to storage at save time; existing stored entries without these fields continue to render gracefully
