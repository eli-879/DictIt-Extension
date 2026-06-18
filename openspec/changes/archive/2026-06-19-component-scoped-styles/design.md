## Context

All component styles currently live in `src/App.scss`. Two component SCSS files (`IncomingWordPanel.scss`, `VocabularyEntry.scss`) were recently created and are already imported by their respective components, but each only carries a subset of their component's rules — the rest remain in `App.scss`. This split state is the immediate trigger for this change.

The full current rule distribution in `App.scss`:
- `.app` — global wrapper (stays)
- `.btn`, `.btn--primary`, `.btn--ghost` — shared button utilities (stay)
- `.incoming-panel*` — belongs in `IncomingWordPanel.scss`
- `.vocab-list*` — belongs in a new `VocabularyList.scss`
- `.vocab-entry*` — belongs in `VocabularyEntry.scss`

## Goals / Non-Goals

**Goals:**
- Each component owns all the SCSS rules for its own class names
- `App.scss` retains only rules with no single owner (`.app`, `.btn*`)
- No visual changes — purely a file reorganization

**Non-Goals:**
- Converting to CSS Modules (`.module.scss`) — BEM naming is sufficient to avoid collisions at this scale
- Adding or changing any styles
- Touching `index.scss`

## Decisions

### Keep BEM, use plain SCSS imports (not CSS Modules)

CSS Modules would require renaming every `className="..."` string to object property access, a large churn for no immediate gain. BEM class names already provide the namespace isolation CSS Modules are meant to enforce. Plain SCSS imports are consistent with the existing pattern.

**Alternative considered**: migrate to CSS Modules now. Rejected — the rename churn exceeds the benefit at current scale, and can be revisited independently later.

### `.btn*` stays in `App.scss`

Button utilities are shared across `IncomingWordPanel` and potentially other future components. They have no single owner, so `App.scss` is the right home.

### `VocabularyList` gets a new `VocabularyList.scss`

`VocabularyList.tsx` currently has no style import. Adding one now is consistent and gives `.vocab-list*` rules a home alongside their component.

## Risks / Trade-offs

- **Zero visual risk** → Rules are moved verbatim; no selectors or values change.
- **Import order** → Vite bundles all imported CSS into a single stylesheet; the split into multiple files does not affect cascade order for these non-overlapping BEM selectors.
