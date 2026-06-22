## 1. Messaging & background routing

- [x] 1.1 Extend `src/constants/chromeMessageTypes.ts` with a content-script message type (e.g. `{ type: "CAPTURE_WORD"; word: string }`) alongside the existing `NEW_WORD`.
- [x] 1.2 Refactor `src/background.ts` to extract a shared `captureWord(word, windowId)` helper that opens the side panel, sets `pendingWord` in `chrome.storage.session`, and broadcasts `NEW_WORD`.
- [x] 1.3 Update the context-menu `onClicked` handler to call the shared helper (no behavior change).
- [x] 1.4 Add a `chrome.runtime.onMessage` listener in `background.ts` that, on `CAPTURE_WORD`, calls the shared helper using the sender tab's `windowId`; ignore messages with an empty word.

## 2. Content script

- [x] 2.1 Create `src/content/googleDefinition.ts` that locates Google's dictionary definition card and reads the headword.
- [x] 2.2 Inject a single "Add to DictIt" button into/adjacent to the card, guarded by a sentinel `id`/`data-` attribute so it is never duplicated.
- [x] 2.3 Add a `MutationObserver` scoped to the results container to (re)inject the button when the card appears or is replaced; early-return when the button already exists.
- [x] 2.4 On button click, read the headword and send `CAPTURE_WORD` to the background; do nothing (no message) when no headword can be read.
- [x] 2.5 Add minimal button styling (DictIt-branded) without breaking on Google markup changes; fail silently (no button) if selectors do not match.

## 3. Manifest & build

- [x] 3.1 Add a `content_scripts` entry to `public/manifest.json` matching `https://www.google.com/search*` pointing at the built `content.js`, plus the matching host permission.
- [x] 3.2 Add a `content` rollup input to `vite.config.ts` for `src/content/googleDefinition.ts`, emitted as `content.js`.

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm `dist/content.js` is emitted and `manifest.json` references it.
- [ ] 4.2 Load the unpacked extension; search a word on Google and confirm the "Add to DictIt" button appears on the definition card.
- [ ] 4.3 Click the button and confirm the side panel opens, displays the word, and fetches its definition (same as the context-menu flow).
- [ ] 4.4 Verify no duplicate buttons appear after navigating between word searches, and no button appears on searches without a definition card.
