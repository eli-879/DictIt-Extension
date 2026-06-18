import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { IncomingWordPanel } from "./components/IncomingWordPanel";
import { VocabularyList } from "./components/VocabularyList";
import type { ChromeMessageType } from "./constants/chromeMessageTypes";
import type { DictionaryContent, WordEntry } from "./constants/wordEntry";
import { useChromeMessage } from "./hooks/useChromeMessage";
import { deleteWord, getWords, saveWord } from "./storage";

function App() {
  const [pendingWord, setPendingWord] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    getWords().then(setWords);
    // Read pending word written by background before the panel was opened.
    chrome.storage.session.get("pendingWord").then((result) => {
      const word = result["pendingWord"] as string | undefined;
      if (word) {
        setPendingWord(word.toLowerCase());
        chrome.storage.session.remove("pendingWord");
      }
    });
  }, []);

  const handleMessage = useCallback((message: ChromeMessageType) => {
    if (message.type === "NEW_WORD" && message.word) {
      setPendingWord(message.word.toLowerCase());
    }
    // Clear session entry so it doesn't replay on next mount.
    chrome.storage.session.remove("pendingWord");
  }, []);

  useChromeMessage(handleMessage);

  const handleSave = async (content: DictionaryContent | null) => {
    if (!pendingWord) return;
    const entry: WordEntry = {
      id: Date.now(),
      word: pendingWord,
      content: content ?? { definition: "" },
      sourceUrl: "",
      dateAdded: new Date().toISOString(),
    };
    await saveWord(entry);
    setWords((prev) => [entry, ...prev]);
    setPendingWord(null);
  };

  const handleDismiss = () => setPendingWord(null);

  const handleDelete = async (id: number) => {
    await deleteWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="app">
      {pendingWord && (
        <IncomingWordPanel
          word={pendingWord}
          onSave={handleSave}
          onDismiss={handleDismiss}
        />
      )}
      <VocabularyList words={words} onDelete={handleDelete} />
    </div>
  );
}

export default App;
