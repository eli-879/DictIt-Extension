# word-lookup

## Purpose

Define how the side panel receives a selected word, looks up its definition from the dictionary API, and lets the user save or dismiss it.

## Requirements

### Requirement: Display incoming word and fetch definition
When the side panel receives a `NEW_WORD` message, it SHALL display the word and automatically fetch its definition, pronunciation, word type, and example usage from the dictionary API. The word, pronunciation, word type, definition, and example usage SHALL all be shown in the incoming-word panel when available.

#### Scenario: Word received and full details found
- **WHEN** the user right-clicks a selected word and chooses "Save to DictIt"
- **THEN** the side panel opens and displays the word along with its pronunciation (phonetic text), part of speech, first definition, and example usage from the dictionary API

#### Scenario: Word received but pronunciation or example absent
- **WHEN** the dictionary API returns a result for the word but omits phonetic text or an example sentence
- **THEN** the panel SHALL omit those specific fields from the display without affecting the visibility of other fields

#### Scenario: Word received but not found in dictionary
- **WHEN** the side panel receives a `NEW_WORD` message and the dictionary API returns no result
- **THEN** the side panel displays the word with a "No definition found" message and no pronunciation, word type, or example fields are shown

#### Scenario: Definition fetch is in progress
- **WHEN** the side panel has received a word and the API request is pending
- **THEN** the UI SHALL show a loading indicator in place of the detail fields

### Requirement: Show prior-search badge for previously saved words
When the side panel displays an incoming word that is already saved (matched by its normalized form), it SHALL show a "previously searched" badge that includes how many times the word has been searched (`searchCount`) and the date it was last looked up before this search. The last-looked-up date SHALL be the word's previous `lastSearched` value, or its first-saved date (`dateAdded`) if it has not been re-searched before. The current search SHALL increment the stored `searchCount` and update `lastSearched`, but the badge SHALL display the prior date (not the current moment). When the incoming word is not already saved, no badge SHALL be shown.

#### Scenario: Incoming word was saved before
- **WHEN** the side panel receives a word that already exists in `chrome.storage.local` (by normalized form)
- **THEN** the panel SHALL display a badge showing the word's search count and the date it was last looked up before this search, and the stored `searchCount` SHALL be incremented and `lastSearched` updated to reflect this search

#### Scenario: Last-looked-up date shows the prior search, not the current one
- **WHEN** an already-saved word is searched again and the badge is shown
- **THEN** the displayed last-looked-up date SHALL be the value from before this search (the previous `lastSearched`, or `dateAdded` if none), never the current moment

#### Scenario: Incoming word is new
- **WHEN** the side panel receives a word that is not present in `chrome.storage.local`
- **THEN** no badge SHALL be shown and no count SHALL be incremented

#### Scenario: Count is tracked for both capture entry points
- **WHEN** an already-saved word is captured either via the context menu or via the Google definition button
- **THEN** its `searchCount` SHALL be incremented in the same way, since both routes share the background capture path

### Requirement: Save incoming word to vocabulary
The side panel SHALL provide a Save button that persists the displayed word, definition, pronunciation, word type, and example usage as a `WordEntry` in Chrome local storage. Saving SHALL be an upsert keyed by the word's normalized form (trimmed, lowercased): if no entry for that word exists, a new `WordEntry` SHALL be inserted with `searchCount` initialized to 1; if an entry already exists, it SHALL be updated in place — its `content` refreshed from the latest lookup while its `searchCount` and original date added are preserved — rather than appending a duplicate.

#### Scenario: User saves a new word with full details
- **WHEN** the user clicks the Save button while a word not already in storage is displayed
- **THEN** a single `WordEntry` SHALL be saved to `chrome.storage.local` including `word`, `definition`, `pronunciation`, `wordType`, and `exampleUsage` from the API response, with `searchCount` set to 1

#### Scenario: User saves a word with partial details
- **WHEN** the API response lacks pronunciation or example usage for the word
- **THEN** the saved `WordEntry` SHALL store those fields as absent (undefined/missing) without preventing the save

#### Scenario: User re-saves a word already in the vocabulary
- **WHEN** the user clicks Save for a word whose normalized form already exists in storage
- **THEN** the existing entry SHALL be updated in place with the latest content, no duplicate entry SHALL be created, and its `searchCount` and original date added SHALL be preserved

#### Scenario: User dismisses a word
- **WHEN** the user clicks the Dismiss button while a word is displayed
- **THEN** the incoming-word panel SHALL be hidden without writing to storage

### Requirement: Typed message payload
The `ChromeMessageType` SHALL be a discriminated union object `{ type: "NEW_WORD"; word: string }` so the side panel can safely read the word from the message without type casting.

#### Scenario: Background sends NEW_WORD message
- **WHEN** the background script fires a `NEW_WORD` message
- **THEN** the message object SHALL conform to `{ type: "NEW_WORD"; word: string }` and the side panel listener SHALL receive `message.word` as a non-empty string
