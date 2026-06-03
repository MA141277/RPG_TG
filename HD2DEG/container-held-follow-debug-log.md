# Container Held Follow Debug Log

Date: 2026-04-29

## Symptom

When clicking an item inside a container, the source slot became empty, but the held icon either:

- appeared once and then stopped following the cursor, or
- disappeared entirely after pickup.

## Why It Took Several Rounds

The symptom was caused by multiple issues stacked together, and each one masked the next:

1. The first visible problem looked like a simple cursor-follow offset bug.
The held icon got an initial pointer position from the click event, so it looked like the follow logic was partially working.

2. The follow logic originally depended on local modal move events.
That made the icon appear to work at pickup time, but stop moving when the expected event path was not continuously firing for the current interaction path.

3. After moving the held icon into the modal card coordinate space, the icon became clamped by the card bounds.
When the cursor moved outside the card area, the icon looked stuck because it was pinned to the edge of the small host region.

4. The actual lifecycle bug was deeper than the position math.
`buildContainerModal()` assigned `__cleanupFn` and `__blockCloseFn` directly onto the global modal card before `openInteractionModal()` mounted the new content.

5. `openInteractionModal()` always runs the current `__cleanupFn` before replacing modal content.
That meant the container UI could destroy its own listeners / animation frame loop at open time, right before the user started interacting with it.

Because these issues overlapped, each partial fix exposed the next failure mode instead of fully resolving the bug.

## Final Fix

The stable fix ended up being:

1. Keep a global pointer track and use it to refresh held-icon position continuously.
2. Host the held icon on the full interaction modal layer instead of the small modal card.
3. Move modal cleanup ownership onto the mounted content node (`wrap.__cleanupFn`, `wrap.__blockCloseFn`).
4. Let `openInteractionModal()` transfer those hooks onto the modal card after the content is attached.

## Current UX Adjustment

The held icon is intentionally rendered 1.5 icon-body lengths to the upper-left of the actual cursor point, and its transparent framed wrapper visuals are removed so only the icon/count remain visible.
