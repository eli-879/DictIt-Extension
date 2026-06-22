## ADDED Requirements

### Requirement: Inject button into Google definition card
A content script SHALL run on Google search result pages and, when Google's built-in dictionary definition card is present, inject a single "Add to DictIt" button into that card. The button SHALL NOT be injected on pages without a definition card, and SHALL NOT be duplicated when the page already contains the injected button.

#### Scenario: Definition card present on search results
- **WHEN** the user searches a word on Google and the results page shows Google's dictionary definition card
- **THEN** an "Add to DictIt" button SHALL appear within or adjacent to that card

#### Scenario: No definition card on the page
- **WHEN** the user is on a Google search results page that does not contain a dictionary definition card
- **THEN** no "Add to DictIt" button SHALL be injected

#### Scenario: Definition card loaded dynamically after initial render
- **WHEN** Google renders or replaces the definition card after the initial page load (e.g. via dynamic navigation)
- **THEN** the content script SHALL detect the card and inject exactly one "Add to DictIt" button, without creating duplicate buttons on repeated updates

### Requirement: Capture headword and trigger save flow
When the injected "Add to DictIt" button is clicked, the content script SHALL determine the headword shown on the definition card and send it to the extension so the existing word-capture flow runs: the side panel opens and receives the word as a `NEW_WORD`.

#### Scenario: User clicks Add to DictIt
- **WHEN** the user clicks the injected "Add to DictIt" button on a definition card for a word
- **THEN** the extension SHALL open the side panel and deliver that word to it as a `NEW_WORD`, so the panel displays the word and fetches its definition exactly as it does for the context-menu entry point

#### Scenario: Headword cannot be determined
- **WHEN** the button is clicked but the content script cannot read a headword from the card
- **THEN** no `NEW_WORD` SHALL be sent and the side panel SHALL NOT be opened with an empty word
