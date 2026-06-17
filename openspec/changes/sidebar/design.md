## Context

DictIt is a Chrome extension where the background script captures selected text via a context menu item and opens the Chrome side panel, then sends a `NEW_WORD` runtime message. The side panel (`App.tsx`) currently renders only "Hi". The `WordEntry` type already exists in `background.ts` but is not used by any storage or UI layer. The message type constant is a bare string literal `"NEW_WORD"` with no payload.

## Goals / Non-Goals

**Goals:**
- Display the incoming word in the side panel and fetch its definition from a free dictionary API
- Let the user save the word+definition to Chrome local storage
- Show the full saved vocabulary list in the side panel
- Let the user delete individual saved entries

**Non-Goals:**
- User accounts or cloud sync
- Flashcard or quiz modes
- Pronunciation audio
- Support for multiple dictionary APIs or language selection

## Decisions

### Message shape: object instead of bare string type

Current: `ChromeMessageType = "NEW_WORD"` (union of string literals, no payload).
Change to a discriminated union object: `{ type: "NEW_WORD"; word: string }`.

**Rationale**: The background script already passes `word: info.selectionText` in the message body (see `background.ts:27`). Typing this properly allows the side panel to safely read `message.word` without casting. Alternatives considered: keeping the string union and adding a separate global state — rejected because it couples unrelated modules.

### Dictionary API: `dictionaryapi.dev`

Use `https://api.dictionaryapi.dev/api/v2/entries/en/<word>` (Free Dictionary API). No API key, CORS-safe from extension context.

**Rationale**: Zero setup friction. The response structure is stable and well-documented. Alternatives: Merriam-Webster (requires API key), Oxford (paid). Both add setup overhead for a hobby project.

### Storage: `chrome.storage.local`

Use `chrome.storage.local` with a single key `"words"` holding a `WordEntry[]` array.

**Rationale**: Stays local to the browser, no permissions beyond `storage`, simple read/write model. `WordEntry` already has the right shape. Alternative: `localStorage` in the side panel — rejected because it doesn't persist across extension reloads and isn't accessible from the background script if needed later.

### UI layout: single-page with two sections

The side panel shows two stacked sections:
1. **Incoming word panel** (top) — visible only when a new word arrives; shows word, definition, and Save/Dismiss buttons.
2. **Vocabulary list** (bottom, or full-height when no incoming word) — scrollable list of saved entries with delete buttons.

**Rationale**: Keeps the UI in one view. Alternative: tabbed or route-based navigation — overkill for two sections.

### No manifest changes tracked here

Adding `"storage"` to the Chrome manifest `permissions` array is required but is an environment concern, not a code pattern decision. Noted here for the implementer.

## Risks / Trade-offs

- **API rate limiting** → `dictionaryapi.dev` has no documented rate limit for reasonable personal use; if it becomes an issue, add a debounce or cache the last result in state.
- **Word not found in dictionary** → Show a "no definition found" message; still allow the user to save the word without a definition.
- **Large vocabulary list performance** → For a personal dictionary extension this is unlikely to be an issue; no pagination needed initially.
- **`chrome.storage.local` quota (~5 MB)** → Each `WordEntry` is tiny; thousands of entries fit comfortably within quota.
- **Message timing** → The side panel may not be mounted when the background fires `NEW_WORD`. The background already opens the panel first (`sidePanel.open`) before sending the message, but there's a potential race. Mitigation: the side panel should also query storage for a "pending word" on mount, or the background should set a pending word in `chrome.storage.session` before opening the panel.
