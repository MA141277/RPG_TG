# Zhu Yuanzhang Grain Procurement Bridge Design

## Goal

Refit the Zhu Yuanzhang temple opening from a vague "go out begging" beat into a clearer "the abbot gives 500 wen and sends the player to nearby cities to buy grain for the temple" beat, while keeping the existing week-2 to week-4 temple grain loop, return-to-Haozhou handoff, and house/runtime boundaries intact.

## Current Context

The active runtime content for this opening lives in the built-in `zhuyuanzhang` scenario pack JSON files under `src/content/scenario-packs/zhuyuanzhang/`. The current story path already has:

- `event.story.zhu_yuanzhang.first_temple_review`
- `event.story.zhu_yuanzhang.unlock_begging`
- `event.story.zhu_yuanzhang.runing_broadcast`
- `event.story.zhu_yuanzhang.haozhou_return_encounter`

The temple gameplay loop and grain submission logic already exist in `src/application/house-modules/temple-house/temple-house-house-module.ts`. The grain shop already has a sold-out path in text content. This change should refine and reuse those mechanisms, not replace them with a one-off story branch in `src/main.ts`.

## Approved Behavior

### 1. Review And Assignment Copy

`scene.story.zhu_yuanzhang.first_temple_review` keeps the same trigger and structure, but its two lines become more natural:

- `往后这段时日，寺里的方针以保全自身为主。`
- `你初来乍到，外面也兵荒马乱，姑且在寺内帮忙吧。`

`scene.story.zhu_yuanzhang.unlock_begging` remains the stage-unlock scene, but the player-facing meaning changes from generic alms travel to an explicit temple grain errand:

- Keep the first line as the abbot acknowledging the player's steadiness.
- Replace the second line with the approved assignment wording and lock it to the user-approved meaning: the abbot gives 500 wen, says Haozhou is in shortage, orders the player to buy grain from nearby cities, and says buying more is better because any surplus can also be used for relief.

The scene settlement should:

- give the player 500 wen through structured state/effect mutation, not ad hoc globals;
- update the main mission text to a grain-procurement objective;
- keep the story stage compatibility key as the existing begging-journey stage unless implementation review proves a safe rename across all temple runtime owners.

### 2. First Foreign City World Event

`event.story.zhu_yuanzhang.runing_broadcast` is repurposed into a world-event broadcast that fires the first time the player enters any non-Haozhou city after the grain errand begins.

The event should:

- keep `timing: "city-enter"`;
- drop the fixed `city.runing` scope;
- add an explicit negative location guard so it cannot fire in `city.kulan`;
- remain once-only.

The scene should use a new background resource id backed by `ui/cg/qiyi.png`. The design chooses the explicit id `bg.story.qiyi`.

The scene text becomes:

- a world-event line equivalent to `世界事件：濠州爆发红巾起义。繁荣度-2。`
- a Zhu Yuanzhang follow-up line equivalent to `不知寺内情况如何，买了粮食就回去吧。`

This is a story broadcast scene, not a new system overlay.

### 3. Haozhou Grain Shop Lock

After the world-event broadcast has fired, the Haozhou grain shop should no longer allow grain purchase. The refusal should be owned by the existing grain-shop/business-rule path, not by `main.ts`.

Expected player-facing behavior:

- Haozhou grain shop shows a sold-out / cannot-buy response tied to the uprising and shortage.
- Other cities can still sell grain through the current grain shop loop.

The existing grain-shop sold-out copy can be reused or lightly rewritten, but it should clearly direct the player away from buying in Haozhou during this phase.

### 4. Return To Haozhou

`event.story.zhu_yuanzhang.haozhou_return_encounter` keeps its current function as the return-to-Haozhou handoff into robbery, suspicion, Guo Zixing retention, and the following battle callback chain.

Only the story framing should shift from "returning from alms travel" to "returning from buying grain / carrying grain back."

## Owner Boundaries

Allowed owners for this slice:

- `src/content/scenario-packs/zhuyuanzhang/events.json`
- `src/content/scenario-packs/zhuyuanzhang/scenes.json`
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
- `src/ui/location-backgrounds.ts` for the new `bg.story.qiyi` mapping
- existing temple-house or grain-shop module/runtime files only where current mission labels or sold-out gates are already owned

Disallowed:

- new Zhu Yuanzhang-specific story branches in `src/main.ts`
- new ad hoc global state for temple grain errands
- HTML-returning content/application modules

## Testing

Implementation should add regression coverage for:

- updated first review and unlock scene text entries;
- unlock scene settlement granting 500 money and updating the mission label;
- `runing_broadcast` becoming a once-only non-Haozhou city-enter event;
- the repurposed scene using `bg.story.qiyi`;
- Haozhou grain shop refusing purchase after the uprising broadcast condition is active;
- return encounter remaining wired to the existing callback chain.

## Non-Goals

- No new standalone procurement task framework.
- No rewrite of the temple grain submission loop.
- No renaming of broad runtime keys unless the compatibility cost is proven low during implementation planning.
