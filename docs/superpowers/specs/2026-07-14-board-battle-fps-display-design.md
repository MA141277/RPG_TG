# Board And Battle FPS Display Design

## Goal

Add a built-in always-visible FPS display to the game for:

- the campaign board page
- the embedded battle page

The display must remain fixed at the top-right corner and show only `FPS`.

This work is for runtime visibility only. It must not change gameplay logic,
animation timing, rendering style, or input behavior.

## Scope

### In Scope

- add an always-visible FPS HUD to the campaign board page
- add an always-visible FPS HUD to `prototypes/battle-demo/index.html`
- position the HUD at the top-right corner in both contexts
- show only a single `FPS: <value>` readout
- use smoothed frame sampling so the number is readable instead of flickering
- keep the HUD click-through so it does not block existing controls
- add regression tests for the HUD formatting and update path

### Out Of Scope

- no global performance overlay shared across every game screen
- no extra metrics such as frame time, memory, draw calls, or render source
- no toggle button, drag behavior, or debug settings panel
- no scheduler throttling, frame skipping, or render-loop changes intended to
  increase performance
- no gameplay, camera, animation, or combat behavior changes

## Current Structure

The project has two separate rendering contexts relevant to this request.

### Embedded Battle Page

The story battle view embeds `prototypes/battle-demo/index.html` through an
`iframe`. That page already owns its own battle and board presentation, so the
most reliable integration point is inside the battle demo page itself.

### Campaign Board Page

The formal map / board presentation is rendered through the campaign map view
and the campaign terrain WebGL runtime. This render path is separate from the
battle demo page, so its FPS must be measured and displayed independently.

Because these two contexts do not share one render loop, a single global HUD
abstraction would add wiring complexity without providing a real runtime
benefit for this request.

## Recommended Approach

Implement one lightweight FPS HUD per rendering context.

### Why

- it matches the actual architecture: board and battle are separate runtimes
- it keeps each FPS readout accurate for the page the player is currently
  viewing
- it avoids unnecessary cross-module coupling for a simple visibility feature
- it minimizes risk to existing rendering and interaction behavior

## Runtime Design

### Shared Behavior Contract

Both HUDs should follow the same visible contract:

- fixed at the top-right corner
- always visible
- text only, formatted as `FPS: <integer>`
- semi-transparent background for readability
- `pointer-events: none` so it never intercepts input
- readable above both bright and dark scene content

The styling may be implemented separately per page or through a small shared
helper, but the visible result should stay consistent.

### Sampling Rules

FPS should be computed from `requestAnimationFrame` timestamps using a rolling
window or equivalent smoothing buffer.

Rules:

- sample from real animation frame timestamps, not `setInterval`
- smooth enough to avoid noisy number jitter
- update continuously while the associated page is rendering
- tolerate startup / idle states without throwing or producing invalid text

Acceptable idle behavior:

- continue showing the last valid FPS value, or
- fall back to a safe low / zero value

The implementation only needs to be stable and readable. It does not need to be
an exact profiler-grade metric.

### Battle Page Integration

For `prototypes/battle-demo/index.html`:

- add a dedicated HUD node in the page shell
- start a local FPS tracker inside the page runtime
- drive it from the page's own animation-frame cadence
- keep it active in both board-state and battle-state presentation inside that
  page

This ensures the embedded battle frame reports the FPS of the content it is
actually rendering.

### Campaign Board Integration

For the campaign board page:

- add a HUD node to the map view shell
- feed it from the campaign terrain render path
- keep the update logic attached to the campaign runtime rather than unrelated
  UI update cycles

This keeps the displayed value tied to the actual board rendering workload
instead of generic app event traffic.

## Implementation Boundaries

### Approved in This Batch

- HUD node creation
- top-right fixed positioning
- smoothed FPS sampling
- battle-page integration
- campaign-board integration
- regression tests for formatting and update safety

### Not Approved in This Batch

- cross-app debug framework work
- per-scene controls or configuration persistence
- performance optimization changes hidden behind the FPS feature
- expansion to unrelated screens unless explicitly requested later

## Testing Strategy

Add focused regression coverage for the FPS display behavior.

Expected test targets include:

- HUD text formatting uses the expected `FPS: <integer>` shape
- FPS update helpers handle initial / sparse frame history safely
- battle-page FPS display logic can update without depending on full DOM boot
- campaign-page FPS display logic can update without breaking when renderers are
  absent or being re-synced

The feature should also preserve existing battle and rendering regressions.

## Acceptance Criteria

This work is complete when all of the following are true:

- the campaign board page shows a built-in FPS display at the top-right corner
- the embedded battle page shows a built-in FPS display at the top-right corner
- both readouts are always visible
- both readouts show only `FPS`
- the HUD does not block mouse or pointer interaction
- the displayed value updates from real frame activity and remains visually
  stable enough to read
- no existing gameplay or rendering behavior changes
- regression tests cover the new FPS display update contract
