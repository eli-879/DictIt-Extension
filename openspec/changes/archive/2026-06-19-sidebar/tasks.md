## 1. Type and Storage Foundations

- [x] 1.1 Update `ChromeMessageType` in `src/constants/chromeMessageTypes.ts` to `{ type: "NEW_WORD"; word: string }` (discriminated union object)
- [x] 1.2 Move `WordEntry` interface from `src/background.ts` to `src/constants/wordEntry.ts` and re-export it from `background.ts`
- [x] 1.3 Add a `src/storage.ts` module with `getWords()`, `saveWord(entry: WordEntry)`, and `deleteWord(id: number)` helpers using `chrome.storage.local` with the key `"words"`
- [x] 1.4 Add `"storage"` to the `permissions` array in `public/manifest.json` (or wherever the manifest lives)

## 2. Background Script

- [x] 2.1 Update `background.ts` message send to conform to `{ type: "NEW_WORD"; word: string }` (already passes `word`, just ensure the type is satisfied)
- [x] 2.2 Fix the TypeScript type of the `chrome.runtime.sendMessage` call to use the new union type

## 3. Word Lookup Hook and API

- [x] 3.1 Create `src/hooks/useDictionaryLookup.ts` — accepts a word string, fetches from `https://api.dictionaryapi.dev/api/v2/entries/en/<word>`, returns `{ definition: string | null; loading: boolean; error: boolean }`
- [x] 3.2 Handle the "not found" case (API returns 404) by setting `definition: null`

## 4. Sidebar UI Components

- [x] 4.1 Create `src/components/IncomingWordPanel.tsx` — shows word, definition (or loading/not-found state), and Save / Dismiss buttons
- [x] 4.2 Create `src/components/VocabularyList.tsx` — renders a scrollable list of `WordEntry` items; shows empty-state message when list is empty
- [x] 4.3 Create `src/components/VocabularyEntry.tsx` — renders a single entry (word, definition, date added, delete button)

## 5. Wire App Together

- [x] 5.1 Update `src/App.tsx` to use `useChromeMessage` and set state when a `NEW_WORD` message arrives
- [x] 5.2 Load vocabulary from `chrome.storage.local` on mount using `getWords()` from storage module
- [x] 5.3 Render `IncomingWordPanel` at the top when a pending word exists; pass save/dismiss handlers
- [x] 5.4 Render `VocabularyList` below with the current word list; pass a delete handler
- [x] 5.5 On save: call `saveWord()`, update local state, and dismiss the incoming-word panel
- [x] 5.6 On delete: call `deleteWord()` and remove the entry from local state

## 6. Styles

- [x] 6.1 Style `IncomingWordPanel` in `App.scss` (or a component-level `.scss` file) — clear visual separation from the list
- [x] 6.2 Style `VocabularyList` and `VocabularyEntry` — readable font size, word in bold, subtle delete button
