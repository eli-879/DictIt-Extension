import type { WordEntry } from "../constants/wordEntry";
import { VocabularyEntry } from "./VocabularyEntry";

interface Props {
  words: WordEntry[];
  onDelete: (id: number) => void;
}

export function VocabularyList({ words, onDelete }: Props) {
  if (words.length === 0) {
    return <p className="vocab-list__empty">No words saved yet.</p>;
  }

  return (
    <div className="vocab-list">
      {words.map((entry) => (
        <VocabularyEntry key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </div>
  );
}
