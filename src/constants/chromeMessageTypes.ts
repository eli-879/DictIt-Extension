export type ChromeMessageType =
  | { type: "NEW_WORD"; word: string }
  | { type: "CAPTURE_WORD"; word: string };
