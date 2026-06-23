## ADDED Requirements

### Requirement: Offer to look up an unsaved searched word
When the user enters a non-empty search query in the vocabulary search box and no saved `WordEntry` matches it (by word or definition), the side panel SHALL present a look-up affordance that lets the user fetch the typed query from the dictionary, instead of showing only a "no matches" message. The look-up affordance SHALL display the trimmed query so the user knows which word will be looked up. When the query is empty or at least one saved entry matches, no look-up affordance SHALL be shown.

#### Scenario: Search has no matching saved word
- **WHEN** the user types a non-empty query into the vocabulary search box and no saved entry matches it
- **THEN** the side panel SHALL show a look-up affordance referencing the trimmed query (e.g., a "Look up '<query>'" action) in place of, or alongside, the empty-state message

#### Scenario: Search matches a saved word
- **WHEN** the user types a query that matches at least one saved entry
- **THEN** the matching entries SHALL be displayed and no look-up affordance SHALL be shown

#### Scenario: Search box is empty
- **WHEN** the search box contains no text (or only whitespace)
- **THEN** no look-up affordance SHALL be shown and the full vocabulary list SHALL be displayed

### Requirement: Look up the searched word and present it for saving
When the user triggers the look-up affordance for a searched query, the side panel SHALL fetch that word's definition, pronunciation, word type, and example usage from the dictionary API and present the result through the incoming-word review flow, offering Save and Dismiss actions. The look-up SHALL reuse the same dictionary fetch and review presentation used for words captured from the page, including its loading, not-found, and error states.

#### Scenario: Look up a word with a definition
- **WHEN** the user triggers the look-up for a searched query that exists in the dictionary
- **THEN** the side panel SHALL display the word with its pronunciation, word type, definition, and example usage (when available) and offer Save and Dismiss actions

#### Scenario: Look-up fetch in progress
- **WHEN** the user has triggered a look-up and the dictionary request is pending
- **THEN** the side panel SHALL show a loading indicator while the request resolves

#### Scenario: Searched word not found in dictionary
- **WHEN** the user triggers a look-up for a query the dictionary returns no result for
- **THEN** the side panel SHALL display a "no definition found" state for the word and still allow the user to Dismiss

#### Scenario: Dictionary unreachable during look-up
- **WHEN** the dictionary request fails (network or server error) during a search look-up
- **THEN** the side panel SHALL display an error state indicating the dictionary could not be reached

### Requirement: Save a searched word into the vocabulary
When the user saves a word that was looked up from the search box, the side panel SHALL persist it as a `WordEntry` via the same upsert (keyed by normalized form) used for page-captured words, and the saved word SHALL immediately appear in the vocabulary list. Dismissing the look-up SHALL leave storage unchanged.

#### Scenario: Save a searched word that was not previously saved
- **WHEN** the user clicks Save on a word looked up from the search box that does not already exist in storage
- **THEN** a single `WordEntry` SHALL be inserted into `chrome.storage.local` with `searchCount` set to 1 and SHALL immediately appear in the vocabulary list

#### Scenario: Dismiss a searched look-up
- **WHEN** the user clicks Dismiss on a word looked up from the search box
- **THEN** no entry SHALL be written to storage and the vocabulary list SHALL be unchanged
