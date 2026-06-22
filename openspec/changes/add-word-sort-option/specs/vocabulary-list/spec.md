## ADDED Requirements

### Requirement: Sort vocabulary by selected order
The side panel SHALL provide a sort control above the vocabulary list that lets the user choose the display order of entries. The control SHALL offer at least: alphabetical by word (A–Z), date added newest first, and date added oldest first. The default order SHALL be date added newest first, preserving the current behavior. Sorting SHALL operate on the displayed entries without modifying storage, and SHALL compose with the active search filter (entries are filtered first, then the matching entries are sorted).

#### Scenario: Sort alphabetically
- **WHEN** the user selects the alphabetical (A–Z) sort option
- **THEN** the displayed entries SHALL be ordered by their word, case-insensitively, in ascending order

#### Scenario: Sort by date added, newest first
- **WHEN** the user selects the newest-first sort option
- **THEN** the displayed entries SHALL be ordered by `WordEntry.dateAdded` descending (most recently added first)

#### Scenario: Sort by date added, oldest first
- **WHEN** the user selects the oldest-first sort option
- **THEN** the displayed entries SHALL be ordered by `WordEntry.dateAdded` ascending (least recently added first)

#### Scenario: Default order on open
- **WHEN** the user opens the side panel and has not chosen a sort option
- **THEN** the entries SHALL be displayed newest first by date added

#### Scenario: Sorting composes with search filter
- **WHEN** a search query is active and the user selects a sort option
- **THEN** only the entries matching the query SHALL be displayed, ordered according to the selected sort option

## MODIFIED Requirements

### Requirement: Display saved vocabulary
The side panel SHALL display all `WordEntry` records saved in `chrome.storage.local` as a scrollable list. The list SHALL update immediately when an entry is added or deleted. The list SHALL be displayed in the order chosen by the sort control (defaulting to date added, newest first).

#### Scenario: Vocabulary list loads on open
- **WHEN** the user opens the side panel
- **THEN** all previously saved words SHALL be loaded from `chrome.storage.local` and displayed in the vocabulary list

#### Scenario: New word appears in list after save
- **WHEN** the user clicks Save on an incoming word
- **THEN** the new entry SHALL immediately appear in the vocabulary list without requiring a reload, positioned according to the active sort order

#### Scenario: Empty vocabulary list
- **WHEN** no words have been saved yet
- **THEN** the vocabulary list area SHALL display an empty-state message (e.g., "No words saved yet")
