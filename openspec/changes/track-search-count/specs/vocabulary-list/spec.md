## MODIFIED Requirements

### Requirement: Entry display format
Each vocabulary list entry SHALL display the word, pronunciation (when available), word type (when available), definition, example usage (when available), the date it was added (from `WordEntry.dateAdded`), and its search count (from `WordEntry.searchCount`). The search count SHALL be shown as a compact indicator (e.g. "4×") next to the date. An entry with no stored `searchCount` (e.g. saved before this change) SHALL display a count of 1.

#### Scenario: Entry renders all fields
- **WHEN** a `WordEntry` with all fields populated is displayed in the vocabulary list
- **THEN** the word name, pronunciation, word type, definition text, example usage, formatted date added, and search count SHALL all be visible

#### Scenario: Entry renders with missing optional fields
- **WHEN** a `WordEntry` lacks `pronunciation`, `wordType`, or `exampleUsage` (e.g., entries saved before this change)
- **THEN** only the fields that are present SHALL be rendered; absent fields SHALL be silently omitted without showing empty placeholders or errors

#### Scenario: Entry with no stored search count
- **WHEN** a `WordEntry` has no `searchCount` (e.g., it was saved before this change)
- **THEN** the entry SHALL display a search count of 1 rather than an empty or zero value
