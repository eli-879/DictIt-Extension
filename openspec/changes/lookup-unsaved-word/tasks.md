## 1. Surface the look-up affordance in the search empty state

- [x] 1.1 Add a required `onLookup: (query: string) => void` prop to `VocabularyList` (`src/components/VocabularyList.tsx`), matching the existing required `onDelete` prop.
- [x] 1.2 In the no-match branch (where `sorted.length === 0` while a non-empty `normalized` query exists), render a "Look up '<query>'" button that calls `onLookup(query.trim())` unconditionally (no optional-prop fallback branch).
- [x] 1.3 Ensure the affordance only appears for a non-empty trimmed query and never when at least one entry matches or the box is empty.
- [x] 1.4 Add minimal styling for the look-up button in `VocabularyList.scss` consistent with existing buttons.

## 2. Wire the search look-up into App's pending-word flow

- [x] 2.1 In `src/App.tsx`, add a `handleLookup(query: string)` that routes the trimmed query into the existing pending-word path so `IncomingWordPanel` mounts for it (reusing `showIncomingWord` or an equivalent that sets `pendingWord` without incrementing `searchCount`).
- [x] 2.2 Confirm a search look-up takes the new-word branch: no prior-search badge, `searchCount` not incremented (the word is unsaved by construction).
- [x] 2.3 Pass `onLookup={handleLookup}` to `<VocabularyList />`.

## 3. Save / dismiss behavior

- [x] 3.1 Verify Save on a searched look-up persists via the existing `handleSave` → `storage.saveWord` upsert and the word appears immediately in the list.
- [x] 3.2 Verify Dismiss leaves storage unchanged.
- [x] 3.3 (UX refinement) After a successful save from a search look-up, clear the search query so the just-saved word is visible in the list.

## 4. Verify states and finish

- [x] 4.1 Manually verify loading, found, not-found ("No definition found"), and error ("Could not reach dictionary") states for a search look-up via `IncomingWordPanel`.
- [x] 4.2 Confirm page-capture (context menu / Google definition) behavior is unchanged and does not collide with a search look-up.
- [x] 4.3 Run lint/build (`npm run lint`, `npm run build`) and confirm no type or lint errors.
