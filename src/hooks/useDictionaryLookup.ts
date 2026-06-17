import { useState, useEffect } from "react";

interface DictionaryResult {
  definition: string | null;
  loading: boolean;
  error: boolean;
}

export function useDictionaryLookup(word: string | null): DictionaryResult {
  const [result, setResult] = useState<DictionaryResult>({
    definition: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (!word) return;

    let cancelled = false;
    setResult({ definition: null, loading: true, error: false });

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setResult({ definition: null, loading: false, error: false });
          return;
        }
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const definition: string | null =
          data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? null;
        if (!cancelled) setResult({ definition, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ definition: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [word]);

  return result;
}
