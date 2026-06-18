import type { WordEntry } from "../constants/wordEntry";
import "./VocabularyEntry.scss";

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
        <div>
          <span className="vocab-entry__date">{date}</span>
          <button
            className="vocab-entry__delete"
            aria-label={`Delete ${entry.word}`}
            onClick={() => onDelete(entry.id)}
          >
            ✕
          </button>
        </div>
      </div>
      {entry.content.pronunciation && (
        <p className="vocab-entry__pronunciation">
          {entry.content.pronunciation}
        </p>
      )}
      {entry.content.wordType && (
        <span className="vocab-entry__word-type">{entry.content.wordType}</span>
      )}
      <p className="vocab-entry__definition">
        {entry.content.definition || <em>No definition</em>}
      </p>
      {entry.content.exampleUsage && (
        <p className="vocab-entry__example">{entry.content.exampleUsage}</p>
      )}
    </div>
  );
}
