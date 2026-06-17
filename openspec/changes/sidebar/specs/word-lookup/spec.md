## ADDED Requirements

### Requirement: Display incoming word and fetch definition
When the side panel receives a `NEW_WORD` message, it SHALL display the word and automatically fetch its definition from the dictionary API. The word and definition SHALL be shown in a dedicated incoming-word panel at the top of the sidebar.

#### Scenario: Word received and definition found
- **WHEN** the user right-clicks a selected word and chooses "Save to DictIt"
- **THEN** the side panel opens and displays the selected word along with its first definition from the dictionary API

#### Scenario: Word received but not found in dictionary
- **WHEN** the side panel receives a `NEW_WORD` message and the dictionary API returns no result
- **THEN** the side panel displays the word with a "No definition found" message in place of the definition

#### Scenario: Definition fetch is in progress
- **WHEN** the side panel has received a word and the API request is pending
- **THEN** the UI SHALL show a loading indicator in the definition area

### Requirement: Save incoming word to vocabulary
The side panel SHALL provide a Save button that persists the displayed word and definition as a `WordEntry` in Chrome local storage.

#### Scenario: User saves a word
- **WHEN** the user clicks the Save button while a word and definition are displayed
- **THEN** the word SHALL be added to `chrome.storage.local` under the key `"words"` and the incoming-word panel SHALL be dismissed

#### Scenario: User dismisses a word
- **WHEN** the user clicks the Dismiss button while a word is displayed
- **THEN** the incoming-word panel SHALL be hidden without writing to storage

### Requirement: Typed message payload
The `ChromeMessageType` SHALL be a discriminated union object `{ type: "NEW_WORD"; word: string }` so the side panel can safely read the word from the message without type casting.

#### Scenario: Background sends NEW_WORD message
- **WHEN** the background script fires a `NEW_WORD` message
- **THEN** the message object SHALL conform to `{ type: "NEW_WORD"; word: string }` and the side panel listener SHALL receive `message.word` as a non-empty string
