import { useEffect } from "react";
import type { ChromeMessageType } from "../constants/chromeMessageTypes";

export function useChromeMessage(
  callback: (message: ChromeMessageType) => void
) {
  useEffect(() => {
    const listener = (message: unknown) => {
      callback(message as ChromeMessageType);
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [callback]);
}
