## 1. Data model

- [ ] 1.1 In `src/constants/wordEntry.ts`, add `searchCount: number` and optional `lastSearched?: string` to `WordEntry`.

## 2. Storage (identity, upsert, increment)

- [ ] 2.1 Add a single shared `normalizeWord(w)` helper — `w.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase()` (locale-independent `toLowerCase`) — and use it as the entry key at every comparison site (upsert, increment, already-saved lookup).
- [ ] 2.2 Rewrite `saveWord` in `src/storage.ts` as an upsert by normalized word: insert with `searchCount = 1` when new; when it exists, update `content` in place while preserving `id`, `dateAdded`, and `searchCount` (no duplicate rows).
- [ ] 2.3 Add an `incrementSearchCount(word)` helper that, only if the normalized word exists, returns the prior look-up date (`lastSearched ?? dateAdded`) and then increments `searchCount` (treating a missing value as 1) and sets `lastSearched` to the current ISO timestamp.

## 3. Background counting

- [ ] 3.1 In `src/background.ts` `captureWord`, call `incrementSearchCount(word)` for words already in storage (no-op for new words) so both the context menu and Google button count consistently. Stash the returned prior look-up date into `chrome.storage.session` (alongside `pendingWord`) so the panel can display it.

## 4. Badge UI

- [ ] 4.1 In `src/App.tsx`, re-read words after capture so the count is current, find the saved entry matching the incoming `pendingWord` (by normalized form), and read the stashed prior look-up date from session; pass the matching entry's count and the prior date to `IncomingWordPanel`.
- [ ] 4.2 In `src/components/IncomingWordPanel.tsx`, when the word is already saved, render a badge showing `Searched N×` plus the prior last-looked-up date (locale-formatted); render nothing when the word is new. Do NOT show the first-saved date here (the list owns that).
- [ ] 4.3 Add badge styling in `src/components/IncomingWordPanel.scss`.
- [ ] 4.4 In `src/components/VocabularyEntry.tsx`, render the entry's search count as a compact chip (e.g. "4×") next to the existing first-saved date, treating a missing `searchCount` as 1; add styling in `src/components/VocabularyEntry.scss`.

## 5. Verification

- [ ] 5.1 Run `npm run build` and confirm it compiles with no type errors.
- [ ] 5.2 Load the unpacked extension; save a new word and confirm no badge appears and exactly one entry is stored.
- [ ] 5.3 Search the same word again; confirm the badge appears with an incremented count, shows the *prior* look-up date (not the current moment), and that no duplicate entry is created.
- [ ] 5.4 Confirm counting works from the Google definition button as well as the context menu, and that legacy entries (no `searchCount`) display as "1×" both in the list and (when re-searched) the badge.
- [ ] 5.5 Confirm the count chip appears on each entry in the vocabulary list and updates after a re-search.
