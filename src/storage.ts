import type { WordEntry } from "./constants/wordEntry";

const STORAGE_KEY = "words";

// Single source of truth for word identity: Unicode NFC + trim + collapse
// internal whitespace + locale-independent lowercase. Used at every "same
// word?" comparison site so save, increment, and lookup never disagree.
export function normalizeWord(w: string): string {
  return w.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

export async function getWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as WordEntry[]) ?? [];
}

// Upsert keyed by the normalized word. Inserts with searchCount = 1 when new;
// when the word already exists, refreshes its content in place while
// preserving id, dateAdded, and searchCount (no duplicate rows).
export async function saveWord(entry: WordEntry): Promise<void> {
  const words = await getWords();
  const key = normalizeWord(entry.word);
  const index = words.findIndex((w) => normalizeWord(w.word) === key);

  if (index === -1) {
    const inserted: WordEntry = { ...entry, searchCount: entry.searchCount ?? 1 };
    await chrome.storage.local.set({ [STORAGE_KEY]: [...words, inserted] });
    return;
  }

  const existing = words[index];
  const updated: WordEntry = {
    ...existing,
    content: entry.content,
    searchCount: existing.searchCount ?? 1,
  };
  const next = [...words];
  next[index] = updated;
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
}

// Increments the search count for an already-saved word. Returns the prior
// look-up date (lastSearched ?? dateAdded) so the panel can display when the
// word was last looked up *before* this search; returns null when the word is
// not saved (no-op). A missing searchCount is treated as 1.
export async function incrementSearchCount(
  word: string,
): Promise<string | null> {
  const words = await getWords();
  const key = normalizeWord(word);
  const index = words.findIndex((w) => normalizeWord(w.word) === key);
  if (index === -1) return null;

  const existing = words[index];
  const priorDate = existing.lastSearched ?? existing.dateAdded;
  const updated: WordEntry = {
    ...existing,
    searchCount: (existing.searchCount ?? 1) + 1,
    lastSearched: new Date().toISOString(),
  };
  const next = [...words];
  next[index] = updated;
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return priorDate;
}

export async function deleteWord(id: number): Promise<void> {
  const words = await getWords();
  await chrome.storage.local.set({
    [STORAGE_KEY]: words.filter((w) => w.id !== id),
  });
}
