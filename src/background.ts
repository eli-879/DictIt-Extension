export type { WordEntry } from "./constants/wordEntry";
import type { ChromeMessageType } from "./constants/chromeMessageTypes";
import { incrementSearchCount } from "./storage";

const CONTEXT_MENU_ID = "save-to-DictIt";

// Shared capture routine used by both the context menu and the in-page
// "Add to DictIt" button: count the search for already-saved words (no-op for
// new words), open the side panel, stash the word (and the prior look-up date
// for the badge) for the open-before-listener race, and broadcast NEW_WORD.
async function captureWord(word: string, windowId: number | undefined) {
  if (windowId !== undefined) {
    chrome.sidePanel.open({ windowId });
  }
  // Single writer for the counter; returns the prior look-up date (or null
  // when the word isn't saved yet) so the panel can display it.
  const priorDate = await incrementSearchCount(word);
  await chrome.storage.session.set({ pendingWord: word, priorDate });
  const message: ChromeMessageType = { type: "NEW_WORD", word };
  chrome.runtime.sendMessage(message).catch(() => {});
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save '%s' to DictIt",
    contexts: ["selection"],
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === CONTEXT_MENU_ID) {
    const word = info.selectionText ?? "";
    await captureWord(word, tab.windowId);
  }
});

chrome.runtime.onMessage.addListener((message: ChromeMessageType, sender) => {
  if (message?.type === "CAPTURE_WORD") {
    const word = message.word?.trim() ?? "";
    if (!word) return;
    captureWord(word, sender.tab?.windowId);
  }
});
