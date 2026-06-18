import { useState } from "react";
import type { WordEntry } from "../constants/wordEntry";
import { VocabularyEntry } from "./VocabularyEntry";
import "./VocabularyList.scss";

interface Props {
  words: WordEntry[];
  onDelete: (id: number) => void;
}

export function VocabularyList({ words, onDelete }: Props) {
  const [query, setQuery] = useState("");

  if (words.length === 0) {
    return <p className="vocab-list__empty">No words saved yet.</p>;
  }

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? words.filter(
        (entry) =>
          entry.word.toLowerCase().includes(normalized) ||
          entry.content.definition.toLowerCase().includes(normalized),
      )
    : words;

  return (
    <div className="vocab-list">
      <input
        className="vocab-list__search"
        type="search"
        placeholder="Search words…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="vocab-list__empty">No words match your search.</p>
      ) : (
        filtered.map((entry) => (
          <VocabularyEntry key={entry.id} entry={entry} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
