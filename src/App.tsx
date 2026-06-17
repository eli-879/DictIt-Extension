import { useState, useEffect, useCallback } from "react";
import "./App.scss";
import { useChromeMessage } from "./hooks/useChromeMessage";
import { IncomingWordPanel } from "./components/IncomingWordPanel";
import { VocabularyList } from "./components/VocabularyList";
import { getWords, saveWord, deleteWord } from "./storage";
import type { WordEntry } from "./constants/wordEntry";
import type { ChromeMessageType } from "./constants/chromeMessageTypes";

function App() {
  const [pendingWord, setPendingWord] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    getWords().then(setWords);
  }, []);

  const handleMessage = useCallback((message: ChromeMessageType) => {
    if (message.type === "NEW_WORD" && message.word) {
      setPendingWord(message.word);
    }
  }, []);

  useChromeMessage(handleMessage);

  const handleSave = async (definition: string | null) => {
    if (!pendingWord) return;
    const entry: WordEntry = {
      id: Date.now(),
      word: pendingWord,
      definition: definition ?? "",
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
