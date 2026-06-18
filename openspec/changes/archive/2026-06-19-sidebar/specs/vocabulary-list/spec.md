## ADDED Requirements

### Requirement: Display saved vocabulary
The side panel SHALL display all `WordEntry` records saved in `chrome.storage.local` as a scrollable list. The list SHALL update immediately when an entry is added or deleted.

#### Scenario: Vocabulary list loads on open
- **WHEN** the user opens the side panel
- **THEN** all previously saved words SHALL be loaded from `chrome.storage.local` and displayed in the vocabulary list

#### Scenario: New word appears in list after save
- **WHEN** the user clicks Save on an incoming word
- **THEN** the new entry SHALL immediately appear in the vocabulary list without requiring a reload

#### Scenario: Empty vocabulary list
- **WHEN** no words have been saved yet
- **THEN** the vocabulary list area SHALL display an empty-state message (e.g., "No words saved yet")

### Requirement: Delete a saved entry
The user SHALL be able to remove any individual `WordEntry` from the vocabulary list. Deletion SHALL be permanent and update `chrome.storage.local` immediately.

#### Scenario: User deletes a word
- **WHEN** the user clicks the delete button on a vocabulary list entry
- **THEN** the entry SHALL be removed from the list and from `chrome.storage.local`

#### Scenario: List reflects deletion immediately
- **WHEN** an entry is deleted
- **THEN** the vocabulary list SHALL update without a full reload, and the deleted entry SHALL no longer appear

### Requirement: Entry display format
Each vocabulary list entry SHALL display the word, its definition, and the date it was added (from `WordEntry.dateAdded`).

#### Scenario: Entry renders all fields
- **WHEN** a `WordEntry` is displayed in the vocabulary list
- **THEN** the word name, definition text, and formatted date added SHALL all be visible
