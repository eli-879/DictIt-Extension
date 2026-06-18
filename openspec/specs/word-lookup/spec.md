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

### Requirement: Save incoming word to vocabulary
The side panel SHALL provide a Save button that persists the displayed word, definition, pronunciation, word type, and example usage as a `WordEntry` in Chrome local storage.

#### Scenario: User saves a word with full details
- **WHEN** the user clicks the Save button while a word with all detail fields is displayed
- **THEN** the `WordEntry` saved to `chrome.storage.local` SHALL include `word`, `definition`, `pronunciation`, `wordType`, and `exampleUsage` fields populated from the API response

#### Scenario: User saves a word with partial details
- **WHEN** the API response lacks pronunciation or example usage for the word
- **THEN** the saved `WordEntry` SHALL store those fields as absent (undefined/missing) without preventing the save

#### Scenario: User dismisses a word
- **WHEN** the user clicks the Dismiss button while a word is displayed
- **THEN** the incoming-word panel SHALL be hidden without writing to storage

### Requirement: Typed message payload
The `ChromeMessageType` SHALL be a discriminated union object `{ type: "NEW_WORD"; word: string }` so the side panel can safely read the word from the message without type casting.

#### Scenario: Background sends NEW_WORD message
- **WHEN** the background script fires a `NEW_WORD` message
- **THEN** the message object SHALL conform to `{ type: "NEW_WORD"; word: string }` and the side panel listener SHALL receive `message.word` as a non-empty string
