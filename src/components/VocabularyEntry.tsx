import type { WordEntry } from "../constants/wordEntry";

interface Props {
  entry: WordEntry;
  onDelete: (id: number) => void;
}

export function VocabularyEntry({ entry, onDelete }: Props) {
  const date = new Date(entry.dateAdded).toLocaleDateString();

  return (
    <div className="vocab-entry">
      <div className="vocab-entry__header">
        <span className="vocab-entry__word">{entry.word}</span>
        <span className="vocab-entry__date">{date}</span>
      </div>
      <p className="vocab-entry__definition">{entry.definition || <em>No definition</em>}</p>
      <button
        className="vocab-entry__delete"
        aria-label={`Delete ${entry.word}`}
        onClick={() => onDelete(entry.id)}
      >
        ✕
      </button>
    </div>
  );
}
