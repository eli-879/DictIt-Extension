import type { DictionaryContent } from "../constants/wordEntry";
import { useDictionaryLookup } from "../hooks/useDictionaryLookup";
import "./IncomingWordPanel.scss";
interface Props {
  word: string;
  onSave: (content: DictionaryContent | null) => void;
  onDismiss: () => void;
}

export function IncomingWordPanel({ word, onSave, onDismiss }: Props) {
  const { content, loading, error } = useDictionaryLookup(word);

  let bodyContent: React.ReactNode;
  if (loading) {
    bodyContent = (
      <p className="incoming-panel__status">Looking up definition…</p>
    );
  } else if (error) {
    bodyContent = (
      <p className="incoming-panel__status incoming-panel__status--error">
        Could not reach dictionary.
      </p>
    );
  } else if (content) {
    bodyContent = (
      <>
        {content.pronunciation && (
          <p className="incoming-panel__pronunciation">
            {content.pronunciation}
          </p>
        )}
        {content.wordType && (
          <span className="incoming-panel__word-type">{content.wordType}</span>
        )}
        <p className="incoming-panel__definition">
          {content.definition || <em>No definition</em>}
        </p>
        {content.exampleUsage && (
          <p className="incoming-panel__example">{content.exampleUsage}</p>
        )}
      </>
    );
  } else {
    bodyContent = (
      <p className="incoming-panel__status">No definition found.</p>
    );
  }

  return (
    <div className="incoming-panel">
      <h2 className="incoming-panel__word">{word}</h2>
      {bodyContent}
      <div className="incoming-panel__actions">
        <button className="btn btn--primary" onClick={() => onSave(content)}>
          Save
        </button>
        <button className="btn btn--ghost" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
