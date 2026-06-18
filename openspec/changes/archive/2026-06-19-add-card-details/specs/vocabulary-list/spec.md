## MODIFIED Requirements

### Requirement: Entry display format
Each vocabulary list entry SHALL display the word, pronunciation (when available), word type (when available), definition, example usage (when available), and the date it was added (from `WordEntry.dateAdded`).

#### Scenario: Entry renders all fields
- **WHEN** a `WordEntry` with all fields populated is displayed in the vocabulary list
- **THEN** the word name, pronunciation, word type, definition text, example usage, and formatted date added SHALL all be visible

#### Scenario: Entry renders with missing optional fields
- **WHEN** a `WordEntry` lacks `pronunciation`, `wordType`, or `exampleUsage` (e.g., entries saved before this change)
- **THEN** only the fields that are present SHALL be rendered; absent fields SHALL be silently omitted without showing empty placeholders or errors
