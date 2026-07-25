# City/Building Location Access Simulated-Human Buglist

## Control

- date: `2026-07-20`
- updated_at: `2026-07-24`
- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- task: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- source_acceptance: `ACC-CITY-BUILDING-ACCESS-CONDITION-007`
- test_surface: `in-app browser simulated-human operation`
- status: `open`
- closeout_effect: `Queue cannot be closed from this evidence. The report now retains only still-open bugs after a 2026-07-24 follow-up audit removed later-fixed or stale entries.`

## Test Discipline

- The tested matrix is city/building entry access conditions across event, person, and time factors.
- Each bug below records the simulated-human path, observed failure, current cause assessment, fix status, and owning version.
- No production fix is claimed in this document.
- Historical BUG-ACC007-001..003 were removed on `2026-07-24` after later queue closeout evidence and current source/test audit showed they no longer represent open defects.

## Bug List

### BUG-ACC007-004: Re-mounted template keep building still triggered inherited location-access refusal in runtime preview

- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- case: `Building - Template remount residual access binding`
- bug_status: `open`
- fixed: `no`
- simulated_path:
  - Open `http://localhost:5173/` in the in-app browser.
  - Enter Script Editor.
  - Click `使用模板`.
  - Delete all existing cities.
  - Create one new city.
  - Mount one `帅府` building instance onto the new city.
  - Clear the visible building-instance enter-condition and event configuration.
  - Click `运行预览`.
  - Complete the unified character-selection flow.
  - Enter the only authored city.
  - Open `地点`.
  - Click `打开帅府`.
- observed:
  - The runtime preview did not enter the building.
  - A refusal dialogue appeared before entry with text `军机要出，请阁下回避。`
  - The speaker rendered as the template soldier role rather than as a newly authored city/building-local configuration.
  - The triggered refusal came from the inherited `location-access` rule on `house.kulan.keep`, not from the visible building-instance event fields that had been cleared.
- expected:
  - After deleting the template cities and remounting the building into a new city, clearing the visible instance-side enter conditions/events should prevent inherited template refusal behavior from firing.
  - If inherited building-id-scoped template bindings are intentionally preserved, Script Editor should surface that preserved ownership explicitly instead of making the remounted building appear locally clean while runtime still uses hidden template bindings.
- current_cause_assessment:
  - Root cause is confirmed.
  - `使用模板` imports the built-in Zhu Yuanzhang scenario pack rather than a blank template shell.
  - The remounted `帅府` reused the concrete template building id `house.kulan.keep`.
  - `src/content/scenario-packs/zhuyuanzhang/location-access.json` contains `location-access.zhu_yuanzhang.temple.keep_closed.house.kulan.keep`, keyed to `targetFamily=building` and `targetId=house.kulan.keep`, with blocked message `军机要出，请阁下回避。`
  - `src/application/location-access/location-access-runtime.ts` evaluates access by `targetFamily + targetId`, so deleting cities and remounting the same building id does not detach that refusal rule.
  - A separate inherited enter-event chain also still exists for the same building id through `event-bindings.json -> events.json -> dialogues.json`, so even after access refusal is removed the reused template building id still carries old template-owned behavior.
- next_needed:
  - Decide the intended authoring contract for `使用模板` plus city deletion/remount flows.
  - If the intended result is a creator-clean city/building setup, remounting must clone to a fresh building id or detach inherited `location-access` and building-enter event bindings from the reused template id.
  - If inherited template behavior is intentional, add explicit Script Editor visibility for building-id-scoped inherited access/event ownership so creators can see and clear the real runtime bindings.

## Non-Bug Notes

- `使用模板` currently loads `/scenario-packs/zhuyuanzhang/pack.json`; this is a built-in authored scenario pack, not a blank project template.
- The reproduced popup in this report was a pre-entry `location-access` refusal, not the later building-enter event dialogue chain.
- PowerShell `Get-Content` rendered some UTF-8 Chinese source and markdown text as mojibake during investigation. Browser-rendered UI text was readable in the observed session, so this document does not treat shell display mojibake as a runtime UI bug.

## Current Outcome

- ACC-CITY-BUILDING-ACCESS-CONDITION-007: `not passed`
- Queue closeout: `blocked`
- Version closeout: `not entered`
- Follow-up handling: `defer the remaining open bug to later unified fix/test pass`
