# Zhu Yuanzhang Sundeya Victory Follow-up Design

Date: 2026-07-31

## 1. Goal

Add a post-victory follow-up segment to the Zhu Yuanzhang mainline after the Sundeya rescue battle.

The requested sequence is:

1. battle victory resolves
2. Guo Zixing, Sun Deya, and Zhu Yuanzhang speak
3. a chapter title card shows `第二章 濠州从戎`
4. a closing popup thanks the player and points them to `funloom`

The implementation must stay inside the existing story scene/runtime contract instead of adding story-specific shell logic in `src/main.ts`.

## 2. Current State

The relevant story entry already exists in:

- `scene.story.zhu_yuanzhang.haozhou_return_encounter`

That scene already:

- transitions Zhu Yuanzhang into the Guo Zixing camp
- launches the Sundeya rescue battle through `story.zhu_yuanzhang.start-sundeya-rescue-battle`
- returns to the same scene after battle completion
- ends with a single closing narration node

The repository also already has:

- scene dialogue nodes with portrait resolution through `renderSceneView()`
- scene reward popups through the `reward` action node
- story callback dispatch through `runStoryCallback()`

The repository does not currently expose a reusable scene-level chapter-title action.

The only visible chapter intro/title presentation currently appears as a map-opening shell overlay path in `src/main.ts`, which is not an acceptable owner for this requested post-battle story beat.

## 3. Scope

This design covers:

- adding the requested post-battle dialogue lines
- making Zhu Yuanzhang's line render with the current red-turban-stage player portrait
- adding a reusable story/runtime mechanism for a chapter title card from scene flow
- adding a closing thank-you popup in the same scene

This design does not cover:

- changing the battle runtime result rules
- moving the existing initial map chapter-intro overlay out of `main.ts`
- adding a generic new scene action type
- adding credits, menus, or end-of-demo navigation beyond the requested popup

## 4. Recommended Design

### 4.1 Ownership

Keep the content change in the existing story scene:

- `src/content/story/zhu-yuanzhang-main-story.ts`

Keep the title-card trigger in story runtime callback ownership:

- `src/application/story/story-callbacks.ts`

Keep the visible popup in the existing scene reward UI:

- `src/ui/views/scene/scene-view.ts`

Do not add direct chapter-title story branching in `src/main.ts`.

### 4.2 Scene Flow

Extend `scene.story.zhu_yuanzhang.haozhou_return_encounter` after the Sundeya rescue battle callback.

The new sequence after battle completion should be:

1. existing post-battle closing narration, if retained
2. Guo Zixing dialogue: `这次大家的表现都很英勇`
3. Sun Deya dialogue: `英勇个屁，我的弟兄们都快被元军砍成臊子了，你郭子兴的人才来`
4. Zhu Yuanzhang dialogue: `看来城中义军将帅并非传闻啊`
5. chapter-title callback for `第二章 濠州从戎`
6. reward popup:
   - title: `感谢您的游玩`
   - lines:
     - `请关注 funloom 了解游戏最新进展。`

The Zhu Yuanzhang line should remain a normal `dialogue` action for `char.player`.

Because the join-to-Guo-Zixing callback already updates the player biography/title/faction state before the rescue battle starts, the post-battle dialogue should render with the current red-turban-stage portrait path naturally and should not require a special portrait override.

### 4.3 Chapter Title Mechanism

Add a new story callback handler specifically for showing a chapter title overlay from scene flow.

Recommended handler id:

- `story.show-chapter-title`

Recommended payload:

- `titleText`

This callback should write a small, reusable runtime/UI state that the existing UI layer can render as a transient title overlay without coupling the request to the map-opening intro path.

The mechanism should be narrow:

- one callback
- one small overlay state
- one render path
- no story-specific hardcoding for Zhu Yuanzhang only

If a temporary seam is needed because final owner placement is still emerging, it should still live in story/runtime or UI coordination code rather than `main.ts`.

### 4.4 Thank-you Popup

Use the existing scene `reward` action node instead of inventing a new modal type.

This is sufficient because the requested end card is effectively a single acknowledgement popup with one confirm action.

The popup should appear after the chapter title card finishes or is dismissed.

## 5. File-Level Change Plan

### 5.1 `src/content/story/zhu-yuanzhang-main-story.ts`

Update `scene.story.zhu_yuanzhang.haozhou_return_encounter` to append:

- three dialogue nodes
- one chapter-title callback
- one reward node

### 5.2 `src/application/story/story-callbacks.ts`

Add a callback handler for chapter-title presentation state.

This handler should:

- read a payload string
- write the title-card request into the correct runtime/UI state
- avoid any Zhu-Yuanzhang-only hardcoding

### 5.3 UI / state owner

Add the minimum shared state/render wiring needed so a scene-triggered chapter title can appear and dismiss cleanly.

The implementation must be generic enough to reuse later, but limited to the requested title-card overlay behavior.

### 5.4 Tests

Add tests that lock:

- the follow-up scene ordering after the rescue battle callback
- the three requested dialogue lines
- the inserted chapter-title callback
- the inserted reward popup
- the callback/runtime contract for chapter-title state

## 6. TDD Plan

The implementation should follow TDD in this order:

1. add a failing source/content test asserting the new scene nodes exist in order
2. add a failing callback/runtime test for the chapter-title trigger state
3. implement the minimum callback/state/render wiring
4. update the story content scene to pass the tests
5. run the relevant scene/story/runtime tests

## 7. Risks

### 7.1 Title overlay owner drift

The repository already has one chapter-title-like presentation in `src/main.ts`.

The risk is accidentally reusing that shell-only path and deepening story ownership in `main.ts`.

This must be avoided.

### 7.2 Scene pacing

If the title card blocks scene advancement incorrectly, the reward popup may never appear or may overlap visually.

The title-card state therefore needs a deterministic dismissal path before the scene continues to the reward node.

## 8. Final Recommendation

Implement the requested follow-up by extending the existing Zhu Yuanzhang return scene and adding a narrow reusable `story.show-chapter-title` callback path.

That keeps:

- story content in story data
- runtime triggering in story callbacks
- final acknowledgement in the existing scene reward popup

and avoids hardcoding post-battle story presentation back into `src/main.ts`.
