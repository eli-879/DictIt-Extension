import type { DictionaryContent } from "../constants/wordEntry";
import { useDictionaryLookup } from "../hooks/useDictionaryLookup";
import "./IncomingWordPanel.scss";
interface Props {
  word: string;
  // Count + prior look-up date for an already-saved word; null when the word
  // is new (no badge shown).
  searchCount: number | null;
  priorDate: string | null;
  onSave: (content: DictionaryContent | null) => void;
  onDismiss: () => void;
}

export function IncomingWordPanel({
  word,
  searchCount,
  priorDate,
  onSave,
  onDismiss,
}: Props) {
  const { content, loading, error } = useDictionaryLookup(word);

  // Only previously saved words get a badge. It shows the current count plus
  // when the word was last looked up *before* this search — the list owns the
  // first-saved date, so it's deliberately not repeated here.
  const badge =
    searchCount !== null ? (
      <p className="incoming-panel__badge">
        Searched {searchCount}×
        {priorDate && (
          <span className="incoming-panel__badge-date">
            {" "}
            · last looked up {new Date(priorDate).toLocaleDateString()}
          </span>
        )}
      </p>
    ) : null;

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
      {badge}
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
