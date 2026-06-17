import type { WordEntry } from "./constants/wordEntry";

const STORAGE_KEY = "words";

export async function getWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as WordEntry[]) ?? [];
}

export async function saveWord(entry: WordEntry): Promise<void> {
  const words = await getWords();
  await chrome.storage.local.set({ [STORAGE_KEY]: [...words, entry] });
}

export async function deleteWord(id: number): Promise<void> {
  const words = await getWords();
  await chrome.storage.local.set({
    [STORAGE_KEY]: words.filter((w) => w.id !== id),
  });
}
