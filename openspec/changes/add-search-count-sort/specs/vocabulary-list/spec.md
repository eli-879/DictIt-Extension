## MODIFIED Requirements

### Requirement: Sort vocabulary by selected order
The side panel SHALL provide a sort control above the vocabulary list that lets the user choose the display order of entries along two independent dimensions: a sort **key** and a sort **direction**. The key selector SHALL offer at least: word (alphabetical), date added, and search count. The direction control SHALL toggle between ascending and descending. Together these SHALL produce six orderings (three keys × two directions), including: alphabetical A–Z and Z–A, date added newest first and oldest first, and search count most-searched first and least-searched first. The default order SHALL be date added, descending (newest first), preserving the current behavior. The search-count key SHALL order entries by `WordEntry.searchCount`, treating a missing count as 1 (consistent with how entries display it). Sorting SHALL operate on the displayed entries without modifying storage, and SHALL compose with the active search filter (entries are filtered first, then the matching entries are sorted).

#### Scenario: Sort alphabetically
- **WHEN** the user selects the word key with ascending direction
- **THEN** the displayed entries SHALL be ordered by their word, case-insensitively, in ascending (A–Z) order

#### Scenario: Sort reverse-alphabetically
- **WHEN** the user selects the word key with descending direction
- **THEN** the displayed entries SHALL be ordered by their word, case-insensitively, in descending (Z–A) order

#### Scenario: Sort by date added, newest first
- **WHEN** the user selects the date key with descending direction
- **THEN** the displayed entries SHALL be ordered by `WordEntry.dateAdded` descending (most recently added first)

#### Scenario: Sort by date added, oldest first
- **WHEN** the user selects the date key with ascending direction
- **THEN** the displayed entries SHALL be ordered by `WordEntry.dateAdded` ascending (least recently added first)

#### Scenario: Sort by search count, most searched first
- **WHEN** the user selects the search-count key with descending direction
- **THEN** the displayed entries SHALL be ordered by `WordEntry.searchCount` descending (most-searched first), with a missing count treated as 1

#### Scenario: Sort by search count, least searched first
- **WHEN** the user selects the search-count key with ascending direction
- **THEN** the displayed entries SHALL be ordered by `WordEntry.searchCount` ascending (least-searched first), with a missing count treated as 1

#### Scenario: Default order on open
- **WHEN** the user opens the side panel and has not changed the sort key or direction
- **THEN** the entries SHALL be displayed by date added, descending (newest first)

#### Scenario: Changing direction re-orders the current key
- **WHEN** a sort key is selected and the user toggles the direction
- **THEN** the displayed entries SHALL keep the same key but reverse their order

#### Scenario: Sorting composes with search filter
- **WHEN** a search query is active and the user changes the sort key or direction
- **THEN** only the entries matching the query SHALL be displayed, ordered according to the selected key and direction
