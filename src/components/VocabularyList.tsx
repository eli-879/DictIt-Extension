import { useState } from "react";
import type { WordEntry } from "../constants/wordEntry";
import { VocabularyEntry } from "./VocabularyEntry";
import "./VocabularyList.scss";

interface Props {
  words: WordEntry[];
  query: string;
  onQueryChange: (query: string) => void;
  onDelete: (id: number) => void;
  onLookup: (query: string) => void;
}

type SortKey = "date" | "word" | "searches";
type SortDir = "asc" | "desc";
type Sort = { key: SortKey; dir: SortDir };

// Label shown for each key in the "Sort by" control. Insertion order is the
// option order; Date is first so it lines up with the default sort.
const SORT_KEY_LABELS: Record<SortKey, string> = {
  date: "Date",
  word: "Word",
  searches: "Searches",
};

// Keyed off SortKey: each comparator returns the ascending order; the direction
// toggle flips it. Adding a key means adding one comparator and one label above.
const comparators: Record<SortKey, (a: WordEntry, b: WordEntry) => number> = {
  word: (a, b) =>
    a.word.localeCompare(b.word, undefined, { sensitivity: "base" }),
  // UnparTable dates become NaN; coerce to -Infinity so they sort as oldest.
  date: (a, b) => {
    const ta = Date.parse(a.dateAdded) || -Infinity;
    const tb = Date.parse(b.dateAdded) || -Infinity;
    return ta - tb;
  },
  // A missing searchCount reads as 1, matching how entries display it.
  searches: (a, b) => (a.searchCount ?? 1) - (b.searchCount ?? 1),
};

export function VocabularyList({
  words,
  query,
  onQueryChange,
  onDelete,
  onLookup,
}: Props) {
  const [sort, setSort] = useState<Sort>({ key: "date", dir: "desc" });

  if (words.length === 0) {
    return <p className="vocab-list__empty">No words saved yet.</p>;
  }

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? words.filter(
        (entry) =>
          entry.word.toLowerCase().includes(normalized) ||
          entry.content.definition.toLowerCase().includes(normalized)
      )
    : words;

  // Sort a non-mutating copy so the prop array is never reordered in place.
  const sorted = [...filtered].sort((a, b) => {
    const result = comparators[sort.key](a, b);
    return sort.dir === "asc" ? result : -result;
  });

  return (
    <div className="vocab-list">
      <input
        className="vocab-list__search"
        type="search"
        placeholder="Search saved words or lookup new word…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <div className="vocab-list__sort">
        <label className="vocab-list__sort-label">
          Sort by:
          <select
            className="vocab-list__sort-select"
            value={sort.key}
            onChange={(e) =>
              setSort((s) => ({ ...s, key: e.target.value as SortKey }))
            }
          >
            {(Object.keys(SORT_KEY_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_KEY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="vocab-list__sort-dir"
          onClick={() =>
            setSort((s) => ({ ...s, dir: s.dir === "asc" ? "desc" : "asc" }))
          }
          aria-label={
            sort.dir === "asc" ? "Sort ascending" : "Sort descending"
          }
          title={sort.dir === "asc" ? "Ascending" : "Descending"}
        >
          {sort.dir === "asc" ? "↑" : "↓"}
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="vocab-list__no-match">
          <p className="vocab-list__empty">No words match your search.</p>
          {normalized && (
            <button
              className="btn btn--primary vocab-list__lookup"
              onClick={() => onLookup(query.trim())}
            >
              Look up “{query.trim()}”
            </button>
          )}
        </div>
      ) : (
        sorted.map((entry) => (
          <VocabularyEntry key={entry.id} entry={entry} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
