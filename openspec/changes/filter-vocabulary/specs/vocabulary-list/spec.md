## ADDED Requirements

### Requirement: Filter vocabulary by search query
The side panel SHALL provide a search input above the vocabulary list. While the input contains text, the list SHALL display only entries whose word or definition contains the query as a case-insensitive substring. Filtering SHALL operate on the already-loaded entries without modifying storage.

#### Scenario: Query matches by word
- **WHEN** the user types text that is a case-insensitive substring of a saved entry's word
- **THEN** that entry SHALL remain visible in the list and non-matching entries SHALL be hidden

#### Scenario: Query matches by definition
- **WHEN** the user types text that is a case-insensitive substring of a saved entry's definition
- **THEN** that entry SHALL remain visible in the list even if the word itself does not match

#### Scenario: Query cleared
- **WHEN** the user clears the search input
- **THEN** the full set of saved entries SHALL be displayed again

#### Scenario: No entries match the query
- **WHEN** the search input is non-empty and no saved entry matches by word or definition
- **THEN** the list SHALL display a "no matches" message distinct from the empty-storage message

## MODIFIED Requirements

### Requirement: Display saved vocabulary
The side panel SHALL display all `WordEntry` records saved in `chrome.storage.local` as a scrollable list. The list SHALL update immediately when an entry is added or deleted. When a search query is active, the list SHALL display only the matching entries.

#### Scenario: Vocabulary list loads on open
- **WHEN** the user opens the side panel
- **THEN** all previously saved words SHALL be loaded from `chrome.storage.local` and displayed in the vocabulary list

#### Scenario: New word appears in list after save
- **WHEN** the user clicks Save on an incoming word
- **THEN** the new entry SHALL immediately appear in the vocabulary list without requiring a reload

#### Scenario: Empty vocabulary list
- **WHEN** no words have been saved yet
- **THEN** the vocabulary list area SHALL display an empty-state message (e.g., "No words saved yet") distinct from the no-search-matches message
