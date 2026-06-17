import { useDictionaryLookup } from "../hooks/useDictionaryLookup";

interface Props {
  word: string;
  onSave: (definition: string | null) => void;
  onDismiss: () => void;
}

export function IncomingWordPanel({ word, onSave, onDismiss }: Props) {
  const { definition, loading, error } = useDictionaryLookup(word);

  let definitionContent: React.ReactNode;
  if (loading) {
    definitionContent = <p className="incoming-panel__status">Looking up definition…</p>;
  } else if (error) {
    definitionContent = <p className="incoming-panel__status incoming-panel__status--error">Could not reach dictionary.</p>;
  } else if (definition) {
    definitionContent = <p className="incoming-panel__definition">{definition}</p>;
  } else {
    definitionContent = <p className="incoming-panel__status">No definition found.</p>;
  }

  return (
    <div className="incoming-panel">
      <h2 className="incoming-panel__word">{word}</h2>
      {definitionContent}
      <div className="incoming-panel__actions">
        <button className="btn btn--primary" onClick={() => onSave(definition)}>
          Save
        </button>
        <button className="btn btn--ghost" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
