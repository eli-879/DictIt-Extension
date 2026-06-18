## 1. Word Normalization

- [x] 1.1 Lowercase the incoming word in `App.tsx` `handleMessage` before setting `pendingWord` state, so the normalized form flows through to the API lookup, panel heading, and storage

## 2. Data Model

- [x] 2.1 Extract a `DictionaryContent` interface in `src/constants/wordEntry.ts` with fields `definition: string`, `pronunciation?: string`, `wordType?: string`, `exampleUsage?: string`
- [x] 2.2 Replace the flat `definition` field and add `content: DictionaryContent` to `WordEntry`, keeping `word` at the top level alongside `id`, `sourceUrl`, and `dateAdded`

## 3. Dictionary Lookup Hook

- [x] 3.1 Replace the `DictionaryResult` type in `src/hooks/useDictionaryLookup.ts` with `{ content: DictionaryContent | null; loading: boolean; error: boolean }`
- [x] 3.2 Extract `definition`, `pronunciation`, `wordType`, and `exampleUsage` from the API response and set them as a `DictionaryContent` object in `setResult`
- [x] 3.3 Initialize `content: null` in the default `useState` value and in all `setResult` calls (loading, 404, and error branches)

## 4. Incoming Word Panel

- [x] 4.1 Update `onSave` prop type in `IncomingWordPanel` to `(content: DictionaryContent | null) => void`
- [x] 4.2 Render `content.pronunciation` below the word heading when present (e.g., `<p className="incoming-panel__pronunciation">`)
- [x] 4.3 Render `content.wordType` as a label/badge when present (e.g., `<span className="incoming-panel__word-type">`)
- [x] 4.4 Render `content.exampleUsage` below the definition when present (e.g., `<p className="incoming-panel__example">`)
- [x] 4.5 Update the Save button's `onClick` to call `onSave(content)` with the full `DictionaryContent` from the hook result

## 5. App Save Handler

- [x] 5.1 Update `handleSave` in `src/App.tsx` to accept `content: DictionaryContent | null`
- [x] 5.2 Assign `content: content ?? { definition: "" }` when constructing the `WordEntry` to save

## 6. Vocabulary Entry Card

- [x] 6.1 Update `VocabularyEntry.tsx` to read from `entry.content.definition`, `entry.content.pronunciation`, `entry.content.wordType`, `entry.content.exampleUsage`
- [x] 6.2 Render `entry.content.pronunciation` below the word heading when present
- [x] 6.3 Render `entry.content.wordType` as a label near the word when present
- [x] 6.4 Render `entry.content.exampleUsage` below the definition when present
