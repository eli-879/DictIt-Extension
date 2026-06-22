## Why

Today the only way to capture a word is to select text on a page and use the right-click context menu. When a user searches a word on Google and reads its built-in dictionary definition, they have to re-select the word and right-click — extra friction at the exact moment they have decided the word is worth saving. A one-click "Add to DictIt" button placed directly on Google's definition card removes that friction.

## What Changes

- Add a content script that runs on Google search result pages and detects Google's built-in dictionary definition card.
- Inject an "Add to DictIt" button into that card. Clicking it captures the headword and triggers the existing save flow (opens the side panel and pre-fills the incoming word for lookup/save).
- Reuse the existing `NEW_WORD` messaging path so the side panel behaves identically to the context-menu entry point.
- Update the extension manifest to register the content script and grant the host permission for Google search pages.
- Update the Vite build to emit the content script as an additional bundle.

## Capabilities

### New Capabilities
- `google-definition-button`: Detecting Google's dictionary definition card on search pages, injecting an "Add to DictIt" button, and sending the headword to the side panel through the existing word-capture flow.

### Modified Capabilities
<!-- No existing spec requirements change; the side-panel word-lookup behavior is reused unchanged via NEW_WORD. -->

## Impact

- **Manifest** (`public/manifest.json`): add a `content_scripts` entry for Google search pages and the corresponding host permission.
- **Build** (`vite.config.ts`): add the content script as a new rollup input so it is emitted to `dist`.
- **New source**: a content script module under `src/` that observes the page for the definition card and injects the button.
- **Background/messaging** (`src/background.ts`, `src/constants/chromeMessageTypes.ts`): reuse the existing `NEW_WORD` message and side-panel-open behavior; add a handler so a content-script request can open the side panel and forward the word.
- **No changes** to the side panel UI, dictionary lookup, or storage — the existing incoming-word flow is reused as-is.
