## ADDED Requirements

### Requirement: Component-scoped stylesheets
Each React component that uses CSS class names SHALL own a co-located SCSS file containing all rules for its own class names. The component file SHALL import that SCSS file directly. Global or shared utilities with no single component owner SHALL live in `App.scss`.

#### Scenario: Component styles are co-located
- **WHEN** a React component renders elements with CSS class names
- **THEN** those class names' style rules SHALL be defined in a `.scss` file in the same directory as the component, not in `App.scss`

#### Scenario: Shared utilities remain global
- **WHEN** a CSS rule applies to a reusable utility used across multiple components (e.g., `.btn`)
- **THEN** it SHALL be defined in `App.scss` rather than in any single component's stylesheet
