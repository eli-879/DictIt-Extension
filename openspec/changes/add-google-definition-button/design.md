## Context

DictIt currently captures words through a single entry point: the user selects text on any page and uses the right-click context menu "Save '%s' to DictIt". The background service worker (`src/background.ts`) handles that click by opening the side panel, writing `pendingWord` to `chrome.storage.session`, and broadcasting a `NEW_WORD` message. The side panel (`src/App.tsx` + `IncomingWordPanel`) then looks the word up and lets the user save it.

This change adds a second entry point — an in-page "Add to DictIt" button on Google's dictionary definition card — without changing the side-panel behavior. The extension has no content scripts today; the manifest only declares `sidePanel`, `contextMenus`, and `storage` permissions, and Vite builds two bundles (`main`, `background`).

## Goals / Non-Goals

**Goals:**
- Inject a one-click "Add to DictIt" button onto Google's dictionary definition card.
- Reuse the existing `NEW_WORD` → side-panel flow so capture behaves identically to the context menu.
- Handle Google's dynamic DOM (cards that appear/replace after initial load) without duplicate buttons.

**Non-Goals:**
- Supporting definition panels on other sites or other search engines.
- Changing the side panel UI, dictionary lookup, or storage logic.
- Scraping Google's own definition text into storage — we capture the headword and reuse the existing dictionary-API lookup.

## Decisions

### Decision: Content script injected via manifest on Google search pages
Register a `content_scripts` entry in `public/manifest.json` matching Google search pages (`https://www.google.com/search*`) and add the matching host permission. A declarative manifest content script is simpler than programmatic injection and needs no `activeTab`/scripting gymnastics for a fixed, known host.

*Alternative considered:* programmatic injection via `chrome.scripting` from the background worker. Rejected — it adds the `scripting` permission and event wiring for no benefit on a single fixed host.

### Decision: Button click routes through the background worker, not `chrome.sidePanel` directly
The content script cannot open the side panel itself (`chrome.sidePanel.open` requires an extension context with a user gesture in the worker/UI). The content script SHALL send a runtime message to the background worker; the worker opens the side panel and forwards the word via the existing `NEW_WORD` path (and `pendingWord` session storage for the open-before-listener race).

This means extending the message protocol: add a message the content script sends to the background (e.g. `CAPTURE_WORD`), handled alongside the existing context-menu logic, which reuses the same "open side panel + set pendingWord + send NEW_WORD" routine. Refactor that routine into a shared helper in `background.ts` so both the context menu and the content-script path call it.

*Alternative considered:* having the content script send `NEW_WORD` directly. Rejected — the side panel may not be open yet, and only the background worker can open it; centralizing in the worker keeps one code path.

### Decision: Locate the card via Google's definition DOM, with a MutationObserver
Find the definition card using a resilient selector strategy (e.g. the phonetics/definition region) and read the headword from the card's heading. Because Google injects/replaces this region asynchronously and on in-page navigations, use a `MutationObserver` on the results container to (re)inject the button, guarded by a sentinel marker/`id` so only one button ever exists.

*Alternative considered:* one-shot query on `DOMContentLoaded`. Rejected — the card frequently mounts after initial paint, so the button would often be missing.

### Decision: Emit the content script as a separate Vite bundle
Add a `content` input to `vite.config.ts` rollup inputs pointing at the new `src/content/googleDefinition.ts`, emitted as `content.js`, and reference that file in the manifest. Mirrors how `background.ts` is already built.

## Risks / Trade-offs

- **Google markup changes break the selector** → Use a tolerant selector strategy and fail silently (no button) rather than throwing; the context-menu path remains a working fallback.
- **Duplicate buttons from rapid DOM mutations** → Guard injection with a sentinel `id`/`data-` attribute and check before inserting.
- **Host permission prompt on update** → Adding a host permission may require users to re-accept permissions; acceptable and limited to `google.com/search`.
- **MutationObserver overhead on a busy page** → Scope the observer to the results container and debounce/early-return when the button already exists.

## Open Questions

- Should the button match Google's visual style or DictIt's own button styling? (Default: lightweight DictIt-branded button; refine during implementation.)
- Confirm the most stable selector for the headword across desktop result layouts during implementation/manual testing.
