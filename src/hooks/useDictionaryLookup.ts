import { useState, useEffect } from "react";
import type { DictionaryContent } from "../constants/wordEntry";

interface DictionaryResult {
  content: DictionaryContent | null;
  loading: boolean;
  error: boolean;
}

export function useDictionaryLookup(word: string | null): DictionaryResult {
  const [result, setResult] = useState<DictionaryResult>({
    content: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (!word) return;

    let cancelled = false;
    setResult({ content: null, loading: true, error: false });

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setResult({ content: null, loading: false, error: false });
          return;
        }
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const content: DictionaryContent = {
          definition: data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? "",
          pronunciation: data?.[0]?.phonetics?.find((p: { text?: string }) => p.text)?.text,
          wordType: data?.[0]?.meanings?.[0]?.partOfSpeech,
          exampleUsage: data?.[0]?.meanings?.[0]?.definitions?.[0]?.example,
        };
        if (!cancelled) setResult({ content, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ content: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [word]);

  return result;
}
