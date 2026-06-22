import type { ChromeMessageType } from "../constants/chromeMessageTypes";

// Sentinel so we only ever inject one button per definition card.
const BUTTON_ID = "dictit-add-button";

/**
 * Locate Google's built-in dictionary definition card.
 * Google marks the dictionary block with a phonetics region; we look for a
 * containing card heading. Returns null when no definition card is present so
 * the caller can fail silently (no button) on layout changes / other searches.
 */
function findDefinitionCard(): HTMLElement | null {
  // The phonetics/pronunciation node lives inside the dictionary card.
  const phonetics = document.querySelector('[data-dobid="hdw"]');
  if (!phonetics) return null;
  // Walk up to a reasonable card container; fall back to the headword's parent.
  const card =
    phonetics.closest<HTMLElement>("div.lr_container") ??
    phonetics.closest<HTMLElement>("div[jscontroller]") ??
    (phonetics.parentElement as HTMLElement | null);
  return card;
}

/**
 * Read the headword shown on the definition card. Returns "" when it cannot be
 * determined so the click handler can do nothing.
 */
function readHeadword(): string {
  const headword = document.querySelector('[data-dobid="hdw"]');
  const text = headword?.textContent?.trim() ?? "";
  // Strip the syllable separators Google sometimes inserts (e.g. "ex·am·ple").
  return text.replace(/·/g, "").trim();
}

function createButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.type = "button";
  button.textContent = "Add to DictIt";
  Object.assign(button.style, {
    display: "inline-block",
    marginTop: "8px",
    padding: "6px 12px",
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  } as Partial<CSSStyleDeclaration>);

  button.addEventListener("click", () => {
    const word = readHeadword();
    if (!word) return;
    const message: ChromeMessageType = { type: "CAPTURE_WORD", word };
    chrome.runtime.sendMessage(message).catch(() => {});
  });

  return button;
}

function injectButton() {
  // Early-return when the button already exists, avoiding duplicates.
  if (document.getElementById(BUTTON_ID)) return;

  const card = findDefinitionCard();
  if (!card) return;

  card.appendChild(createButton());
}

function init() {
  injectButton();

  // Google injects/replaces the definition card asynchronously and on in-page
  // navigations. Observe the results container and (re)inject as needed.
  const results = document.getElementById("search") ?? document.body;
  const observer = new MutationObserver(() => {
    injectButton();
  });
  observer.observe(results, { childList: true, subtree: true });
}

init();
