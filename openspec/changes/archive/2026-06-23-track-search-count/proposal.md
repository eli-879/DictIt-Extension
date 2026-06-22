## Why

When a user looks up a word they have saved before, DictIt gives no sign of it — every lookup looks like the first. Surfacing "you've searched this before" plus how many times turns repeated lookups into a useful signal: the words a user keeps coming back to are exactly the ones that aren't sticking. This also forces a latent gap to be fixed — words are currently stored without identity, so the same word can be saved as multiple duplicate entries.

## What Changes

- Track a per-word `searchCount` (and `lastSearched` timestamp) on each saved word.
- When an incoming word is captured, if it is already saved, increment its `searchCount` and update `lastSearched`.
- In the incoming-word panel, show a "previously searched" badge for words already saved, including the search count and dates (first saved / last searched).
- In the vocabulary list, show each saved word's search count (a small count chip next to the date).
- Define word identity via a single shared `normalizeWord` helper (Unicode NFC + trim + collapse whitespace + locale-independent lowercase) used at every comparison site.
- **BREAKING (storage semantics):** saving becomes an **upsert keyed by the normalized word** — re-saving an existing word updates it in place instead of appending a duplicate. This fixes today's duplicate-entry behavior.
- Counting works for both capture entry points (context menu and the Google definition button), since both route through the shared background capture helper.

## Capabilities

### New Capabilities
<!-- None; this extends existing capabilities. -->

### Modified Capabilities
- `word-lookup`: Add a requirement that the incoming-word panel show a prior-search badge with count/dates for already-saved words; modify the save requirement so persisting a word is an upsert keyed by the normalized word (no duplicates) that initializes or preserves `searchCount`.
- `vocabulary-list`: Modify the entry display format so each saved entry also shows its search count.

## Impact

- **Model** (`src/constants/wordEntry.ts`): add `searchCount: number` and optional `lastSearched?: string` to `WordEntry`. Existing entries lack these — treated as `searchCount = 1` / absent date, mirroring the existing missing-optional-field handling.
- **Storage** (`src/storage.ts`): `saveWord` becomes an upsert by normalized word; add a helper to increment a word's count/last-searched.
- **Background** (`src/background.ts`): in the shared `captureWord` helper, increment the count for words that already exist in storage.
- **UI** (`src/App.tsx`, `src/components/IncomingWordPanel.tsx`): pass the matching saved entry (if any) into the panel and render the badge.
- **No changes** to the dictionary API lookup or the message protocol.
