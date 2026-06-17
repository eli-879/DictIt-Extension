## Why

The DictIt Chrome extension can already capture selected text via the context menu and open the side panel, but the side panel UI (`App.tsx`) is a stub that only renders "Hi". Users have no way to see the word they selected, look up its definition, save it to their vocabulary list, or browse previously saved words.

## What Changes

- Build the side panel UI to receive and display an incoming word when the `NEW_WORD` message arrives
- Fetch and display the word's definition using a free dictionary API
- Allow the user to save a word+definition to Chrome local storage
- Display a list of all previously saved vocabulary entries
- Allow the user to delete individual entries from their saved list

## Capabilities

### New Capabilities

- `word-lookup`: When the side panel receives a `NEW_WORD` message, display the word and fetch its definition from a dictionary API, showing a save/dismiss action.
- `vocabulary-list`: Display all saved `WordEntry` records from Chrome local storage, with the ability to delete individual entries.

### Modified Capabilities

<!-- No existing specs directory — no existing spec-level behaviors to modify. -->

## Impact

- `src/App.tsx`: Replace stub with full sidebar UI (word lookup panel + vocabulary list)
- `src/background.ts`: No changes needed; already sends `NEW_WORD` message correctly
- `src/hooks/useChromeMessage.ts`: Will be wired up to real handler in `App.tsx`
- `src/constants/chromeMessageTypes.ts`: May need to expand message type to carry the word payload
- New dependency: fetch calls to a public dictionary API (e.g., `dictionaryapi.dev`) — no API key required
- Chrome manifest will need `storage` permission for `chrome.storage.local`
