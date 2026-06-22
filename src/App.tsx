import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { IncomingWordPanel } from "./components/IncomingWordPanel";
import { VocabularyList } from "./components/VocabularyList";
import type { ChromeMessageType } from "./constants/chromeMessageTypes";
import type { DictionaryContent, WordEntry } from "./constants/wordEntry";
import { useChromeMessage } from "./hooks/useChromeMessage";
import { deleteWord, getWords, normalizeWord, saveWord } from "./storage";

function App() {
  const [pendingWord, setPendingWord] = useState<string | null>(null);
  // Count + prior look-up date for the incoming word's badge; null when the
  // incoming word is new (not yet saved), so no badge is shown.
  const [searchCount, setSearchCount] = useState<number | null>(null);
  const [priorDate, setPriorDate] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);

  // Re-read storage so the count reflects the background increment, locate the
  // saved entry (if any) matching the incoming word, and read the prior
  // look-up date the background stashed. New (unsaved) words have no match.
  const showIncomingWord = useCallback(async (raw: string) => {
    const word = raw.toLowerCase();
    setPendingWord(word);
    const [current, session] = await Promise.all([
      getWords(),
      chrome.storage.session.get("priorDate"),
    ]);
    setWords(current);
    const key = normalizeWord(word);
    const match = current.find((w) => normalizeWord(w.word) === key);
    setSearchCount(match ? match.searchCount ?? 1 : null);
    setPriorDate(
      match ? ((session["priorDate"] as string | undefined) ?? null) : null,
    );
    chrome.storage.session.remove(["pendingWord", "priorDate"]);
  }, []);

  useEffect(() => {
    getWords().then(setWords);
    // Read pending word written by background before the panel was opened.
    chrome.storage.session.get("pendingWord").then((result) => {
      const word = result["pendingWord"] as string | undefined;
      if (word) {
        showIncomingWord(word);
      }
    });
  }, [showIncomingWord]);

  const handleMessage = useCallback(
    (message: ChromeMessageType) => {
      if (message.type === "NEW_WORD" && message.word) {
        showIncomingWord(message.word);
      }
    },
    [showIncomingWord],
  );

  useChromeMessage(handleMessage);

  const clearIncoming = () => {
    setPendingWord(null);
    setSearchCount(null);
    setPriorDate(null);
  };

  const handleSave = async (content: DictionaryContent | null) => {
    if (!pendingWord) return;
    const entry: WordEntry = {
      id: Date.now(),
      word: pendingWord,
      content: content ?? { definition: "" },
      sourceUrl: "",
      dateAdded: new Date().toISOString(),
      searchCount: 1,
    };
    await saveWord(entry);
    // Re-read so an upsert (re-saving an existing word) doesn't duplicate the
    // entry in the list.
    setWords(await getWords());
    clearIncoming();
  };

  const handleDismiss = () => clearIncoming();

  const handleDelete = async (id: number) => {
    await deleteWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="app">
      {pendingWord && (
        <IncomingWordPanel
          word={pendingWord}
          searchCount={searchCount}
          priorDate={priorDate}
          onSave={handleSave}
          onDismiss={handleDismiss}
        />
      )}
      <VocabularyList words={words} onDelete={handleDelete} />
    </div>
  );
}

export default App;
