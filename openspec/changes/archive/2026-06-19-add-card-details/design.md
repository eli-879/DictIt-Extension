## Context

The extension uses `dictionaryapi.dev` (Free Dictionary API) for word lookups. The API response already contains pronunciation (phonetic text in `phonetics[].text`), part of speech (`meanings[].partOfSpeech`), and example usage (`meanings[].definitions[].example`). Currently only the first definition string is extracted; the rest is discarded.

`WordEntry` is the shared data model persisted in `chrome.storage.local`. Before this change it is a flat bag of eight strings/primitives. Adding three more flat string fields would make this worse — the interface has no structure reflecting that some fields are API-derived content and others are record metadata. This change takes the opportunity to address that while the codebase is still small and storage is dev-only (no migration needed).

## Goals / Non-Goals

**Goals:**
- Extract pronunciation, word type (part of speech), and example usage from the existing API response
- Introduce a `DictionaryContent` type that groups API-derived word data and align `WordEntry`, the lookup hook, and the save callback around it
- Display the new fields in both the incoming-word preview panel and saved vocabulary cards

**Non-Goals:**
- Fetching from a different or additional dictionary API
- Supporting multiple word types or definitions per entry (pick the first meaning)
- Editing or overriding the fetched pronunciation/type/example before saving

## Decisions

### Introduce `DictionaryContent` and nest it in `WordEntry`

Rather than adding three more flat fields, group all API-derived content into a named type:

```ts
interface DictionaryContent {
  definition: string;
  pronunciation?: string;
  wordType?: string;
  exampleUsage?: string;
}

interface WordEntry {
  id: number;
  word: string;           // stays top-level — it's the identity, not content
  content: DictionaryContent;
  sourceUrl: string;
  dateAdded: string;
}
```

`word` stays at the top level because it is the primary key of the record, not just something the API returned. All four dictionary fields live under `content`, making it clear where they come from and giving future fields (synonyms, audio URL, etc.) a natural home.

**Alternative considered**: keep fields flat, add `pronunciation`, `wordType`, `exampleUsage` directly to `WordEntry`. Rejected because it continues the structural problem — after eight flat strings there is no indication of which fields belong together or where they originate.

### Align the hook return type with `DictionaryContent`

`useDictionaryLookup` returns `DictionaryContent` (plus `loading` and `error` flags) instead of a parallel flat shape. The hook's output and the storage type now speak the same language — the save operation becomes a direct assignment (`content: hookResult`) rather than manual field extraction.

Extraction strategy:
- `definition`: `data[0].meanings[0]?.definitions[0]?.definition ?? null`
- `pronunciation`: `data[0].phonetics.find(p => p.text)?.text ?? null` — first phonetic entry with text
- `wordType`: `data[0].meanings[0]?.partOfSpeech ?? null` — part of speech of the first meaning
- `exampleUsage`: `data[0].meanings[0]?.definitions[0]?.example ?? null` — example from the first definition of the first meaning

### Pass `DictionaryContent` through `onSave` in `App.tsx`

`IncomingWordPanel.onSave` is typed as `(content: DictionaryContent) => void`. The panel passes the hook result directly; `App.tsx` assigns it to `WordEntry.content`. No manual field mapping anywhere.

## Risks / Trade-offs

- **API fields may be absent for some words** → `pronunciation`, `wordType`, and `exampleUsage` are optional; the UI conditionally renders each one only when present.
- **`entry.content.*` access is more verbose than flat `entry.*`** → Accepted trade-off; the grouping communicates intent and contains future growth.
- **Phonetic text format varies** (e.g., `/wɜːrd/` vs `wɜːrd`) → Displayed as-is; no normalization needed at this stage.
