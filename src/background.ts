export type { WordEntry } from "./constants/wordEntry";
import type { ChromeMessageType } from "./constants/chromeMessageTypes";

const CONTEXT_MENU_ID = "save-to-DictIt";

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
    await chrome.sidePanel.open({ windowId: tab.windowId });

    const message: ChromeMessageType = {
      type: "NEW_WORD",
      word: info.selectionText ?? "",
    };
    chrome.runtime.sendMessage(message);
  }
});
