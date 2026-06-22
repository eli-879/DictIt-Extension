## Context

DictIt captures a word (context menu or Google button) → background's shared `captureWord(word, windowId)` opens the side panel, stashes `pendingWord`, and broadcasts `NEW_WORD` → `App.tsx` shows `IncomingWordPanel`, which looks the word up and offers Save/Dismiss → `saveWord` appends a `WordEntry` to `chrome.storage.local`.

Two facts shape this change:
- A word currently has no identity: `WordEntry` is keyed by `id` (a `Date.now()` timestamp) and `saveWord` blindly appends (`[...words, entry]`), so the same word can exist as multiple rows. A per-word counter is meaningless without single identity.
- "Searched up" means the capture event, which already funnels through one place — `captureWord` — making it the natural counting point for both entry points.

## Goals / Non-Goals

**Goals:**
- Show, at lookup time, that a word has been searched before and how many times.
- Give each saved word a stable identity (normalized word) so a count can attach to it.
- Count searches from both capture entry points consistently.

**Non-Goals:**
- A separate lookup *history* of words that were never saved (dismissed words leave no trace, as today).
- Showing the counter in the vocabulary list itself (this change scopes display to the lookup badge; the list can surface it later).
- Spaced-repetition / study scheduling (the count is a foundation that could feed it later).

## Decisions

### Decision: Word identity = normalized (trimmed, lowercased) word; saving is an upsert
`saveWord` changes from append to upsert keyed by `word.trim().toLowerCase()`. If a matching entry exists, update it in place (preserve its `id`, `dateAdded`, and `searchCount`; refresh `content`); otherwise insert a new entry with `searchCount = 1`. This both enables the counter and fixes the existing duplicate-entry behavior.

*Alternative considered:* keep append-only and dedupe only for display. Rejected — the duplicates still accumulate in storage and there's no single row to hold the count.

### Decision: Increment in the background `captureWord`; stash the prior search date for display
`captureWord` is the single writer for the counter (it fires exactly once per capture, with no panel re-mount ambiguity). For an already-saved word it:
1. reads the entry and computes `priorDate = entry.lastSearched ?? entry.dateAdded` (the last time it was looked up, falling back to when it was first saved),
2. stashes `priorDate` into `chrome.storage.session` alongside `pendingWord` so the panel can display it,
3. writes `searchCount + 1` and `lastSearched = now`.

New (unsaved) words are not counted until first saved (`searchCount = 1`). So `searchCount` means "times searched since first saved, inclusive." The panel only *displays* count and prior date; it never writes them, avoiding double-counting on re-mounts.

The prior-date must be captured **before** step 3 overwrites `lastSearched`; otherwise the badge would always read "today." This is why the value is read and stashed rather than re-derived in the panel.

*Alternative considered:* increment on panel open or on save click. Rejected — panel open risks double counting across the mount/message paths; save-click only counts deliberate saves, not searches. *Also considered:* let the panel read-then-write `lastSearched`. Rejected — two writers (background count, panel date) on the same entry invites clobbering; one writer is cleaner.

### Decision: On re-save, refresh content but preserve count and first-saved date
When the user explicitly re-saves an already-saved word, keep `searchCount` and `dateAdded`, but update `content` to the latest lookup so stored definitions stay current.

*Alternative considered:* bump-only (never refresh content). Rejected as mildly staler for no real simplicity gain, since upsert already rewrites the row.

### Decision: Split what each surface shows (no redundancy)
The lookup moment and the browsing view show complementary, non-overlapping facts:

- **IncomingWordPanel badge** — current count + **last looked up** date: "Searched 4× · last looked up Jun 3". The date is the *prior* search (the value before this one), or the first-saved date if it has never been re-searched. This is the freshest, most relevant fact at the moment of looking a word up again.
- **VocabularyEntry** — current count + **first saved** date: a compact "4×" chip next to the already-displayed `dateAdded`. Best for browsing the collection.

The badge deliberately does **not** repeat the first-saved date (the list already owns that), and the list does not show the last-searched date. Dates use the same locale formatting as the vocabulary entries. Entries with no `searchCount` (legacy) render as "1×".

### Decision: A single `normalizeWord` helper defines word identity (NFC + trim + collapse + lowercase)
All "same word?" comparisons go through one shared function so save, increment, and the already-saved lookup can never disagree (drift between call sites would silently break the counter):

```ts
const normalizeWord = (w: string) =>
  w.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
```

Rules and where the ladder stops:
- **NFC** — collapses visually identical but byte-different accents (e.g. "café" composed vs. decomposed), which copy-paste from different pages can produce. Cheap, prevents split counts.
- **trim + collapse internal whitespace** — removes selection artifacts.
- **`toLowerCase()` (locale-independent, not `toLocaleLowerCase`)** — avoids the Turkish dotless-ı surprise where identity would depend on the user's locale.
- **Stop before accent-folding** — "café" vs "cafe", "résumé" vs "resume" are treated as distinct headwords; folding is a value judgment that harms non-English users.
- **Stop before lemmatization/stemming** — "running" vs "run", "axes" vs "axe/axis" need NLP and over-merge against user intent; out of scope.

*Display vs. key form:* the stored `word` is kept in its normalized (lowercased) form, matching today's behavior (`App.tsx` already lowercases on capture), so matching is `normalizeWord(incoming) === entry.word` with no extra field. A future `display` field could preserve original casing (e.g. proper nouns like "Paris"); deferred.

## Risks / Trade-offs

- **Concurrent read-modify-write on `chrome.storage.local`** (background increment vs. a near-simultaneous panel save) could clobber → keep each operation a single read→modify→write, and have `saveWord`'s upsert re-read inside the same call; contention is rare for a single user, but note it.
- **`searchCount` undercounts pre-save searches** → acceptable and documented in the badge semantics ("since first saved").
- **Normalization could merge words that differ only by case/accent the user wanted distinct** → lowercasing is the right default for a dictionary tool; accents are preserved (only trim + lowercase).
- **Legacy entries without `searchCount`** → read as `1` and absent `lastSearched`, consistent with existing missing-field handling.

## Open Questions

- *(Resolved)* Vocabulary list also displays the count — see decision above.
- *(Resolved)* Normalization stops at NFC + trim + collapse + lowercase (no accent-fold, no lemmatization) — see `normalizeWord` decision.
- Future: preserve original casing for display (a `display` field for proper nouns) — deferred, not in scope.
