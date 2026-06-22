export interface DictionaryContent {
  definition: string;
  pronunciation?: string;
  wordType?: string;
  exampleUsage?: string;
}

export interface WordEntry {
  id: number;
  word: string;
  content: DictionaryContent;
  sourceUrl: string;
  dateAdded: string;
  searchCount: number;
  lastSearched?: string;
}
