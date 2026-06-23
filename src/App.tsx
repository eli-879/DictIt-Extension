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
  const [query, setQuery] = useState("");
  // True when the open panel was opened by a search look-up rather than a page
  // capture, so saving can clear the search box to reveal the just-saved word.
  const [pendingFromSearch, setPendingFromSearch] = useState(false);

  // Re-read storage so the count reflects the background increment, locate the
  // saved entry (if any) matching the incoming word, and read the prior
  // look-up date the background stashed. New (unsaved) words have no match.
  const showIncomingWord = useCallback(async (raw: string, fromSearch = false) => {
    const word = raw.toLowerCase();
    setPendingWord(word);
    setPendingFromSearch(fromSearch);
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

  // Look up a word typed into the vocabulary search box that matches no saved
  // entry. By construction it is unsaved, so it flows through the new-word path
  // (no badge, searchCount untouched); the fromSearch flag lets the save clear
  // the search box afterward.
  const handleLookup = useCallback(
    (word: string) => {
      showIncomingWord(word, true);
    },
    [showIncomingWord],
  );

  const clearIncoming = () => {
    setPendingWord(null);
    setSearchCount(null);
    setPriorDate(null);
    setPendingFromSearch(false);
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
    // A search look-up filters the list to a query that, by definition, had no
    // match — clear it so the freshly saved word is visible.
    if (pendingFromSearch) setQuery("");
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
      <VocabularyList
        words={words}
        query={query}
        onQueryChange={setQuery}
        onDelete={handleDelete}
        onLookup={handleLookup}
      />
    </div>
  );
}

export default App;
