import { useState } from "react";
import type { WordEntry } from "../constants/wordEntry";
import { VocabularyEntry } from "./VocabularyEntry";
import "./VocabularyList.scss";

interface Props {
  words: WordEntry[];
  onDelete: (id: number) => void;
}

type SortKey = "date" | "word";
type SortDir = "asc" | "desc";
type Sort = { key: SortKey; dir: SortDir };

// Option values map onto { key, dir } so the model stays two-dimensional while
// the control is a single <select>.
const SORT_OPTIONS: { value: string; label: string; sort: Sort }[] = [
  { value: "date-desc", label: "Newest first", sort: { key: "date", dir: "desc" } },
  { value: "date-asc", label: "Oldest first", sort: { key: "date", dir: "asc" } },
  { value: "word-asc", label: "A–Z", sort: { key: "word", dir: "asc" } },
];

// Keyed off SortKey: adding a key is a one-line change here.
const comparators: Record<SortKey, (a: WordEntry, b: WordEntry) => number> = {
  word: (a, b) =>
    a.word.localeCompare(b.word, undefined, { sensitivity: "base" }),
  // UnparTable dates become NaN; coerce to -Infinity so they sort as oldest.
  date: (a, b) => {
    const ta = Date.parse(a.dateAdded) || -Infinity;
    const tb = Date.parse(b.dateAdded) || -Infinity;
    return ta - tb;
  },
};

export function VocabularyList({ words, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>({ key: "date", dir: "desc" });

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

  // Sort a non-mutating copy so the prop array is never reordered in place.
  const sorted = [...filtered].sort((a, b) => {
    const result = comparators[sort.key](a, b);
    return sort.dir === "asc" ? result : -result;
  });

  const sortValue =
    SORT_OPTIONS.find(
      (o) => o.sort.key === sort.key && o.sort.dir === sort.dir,
    )?.value ?? SORT_OPTIONS[0].value;

  return (
    <div className="vocab-list">
      <input
        className="vocab-list__search"
        type="search"
        placeholder="Search words…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <label className="vocab-list__sort">
        Sort:
        <select
          className="vocab-list__sort-select"
          value={sortValue}
          onChange={(e) => {
            const option = SORT_OPTIONS.find((o) => o.value === e.target.value);
            if (option) setSort(option.sort);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {sorted.length === 0 ? (
        <p className="vocab-list__empty">No words match your search.</p>
      ) : (
        sorted.map((entry) => (
          <VocabularyEntry key={entry.id} entry={entry} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
