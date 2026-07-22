# City/Building Location Access Simulated-Human Buglist

## Control

- date: `2026-07-20`
- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- task: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- source_acceptance: `ACC-CITY-BUILDING-ACCESS-CONDITION-007`
- test_surface: `in-app browser simulated-human operation`
- status: `open`
- closeout_effect: `Queue cannot be closed from this evidence. Bugs are recorded for later unified handling.`

## Test Discipline

- The tested matrix is city/building entry access conditions across event, person, and time factors.
- Each bug below records the simulated-human path, observed failure, current cause assessment, fix status, and owning version.
- No production fix is claimed in this document.
- Remaining cases should resume from this buglist or a successor acceptance report after the listed blockers are handled.

## Bug List

### BUG-ACC007-001: City event entry condition did not block city entry in runtime preview

- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- case: `City - Event condition`
- bug_status: `open`
- fixed: `no`
- simulated_path:
  - Open `http://localhost:5173/` in the in-app browser.
  - Enter Script Editor.
  - Click `使用模板`.
  - Select the city family and default selected city `city.kulan` / `濠州`.
  - Open the `进入条件` tab.
  - Add or reuse one condition row.
  - Set factor to `事件`.
  - Set event to `event.story.zhu_yuanzhang.first_temple_review`.
  - Set event state to `完成`.
  - Click `运行预览`.
  - Confirm preview enters the unified character-selection flow.
  - Click `开始冒险`.
  - On map, click `濠州`.
  - In the confirmation overlay, click `进入城市`.
- observed:
  - Runtime preview launched successfully.
  - The map showed `濠州`.
  - City entry confirmation appeared.
  - After clicking `进入城市`, no refusal dialogue/text appeared.
  - Browser evidence showed city scene state became present instead of a blocked entry state.
- expected:
  - If the selected event is not completed at that runtime point, entry should be refused.
  - If the selected event is already completed by startup flow, the test setup must use an event known to be incomplete or explicitly document that the condition is satisfied.
- current_cause_assessment:
  - Root cause is not fully confirmed.
  - Candidate causes:
    - The selected event may already be completed by scenario startup before map interaction.
    - The preview-exported `location-access.json` may not contain the edited city condition.
    - The map city-entry path may not be consuming the `LocationAccessRuntime` result for city entry.
    - The runtime access result may be computed but not converted into the visible refusal dialogue state.
  - Requires inspection across editor memory, runtime-pack export, loaded active content, navigation commit, and refusal UI handoff.
- next_needed:
  - Capture exported preview `location-access.json` for the edited city.
  - Inspect runtime event completion state before clicking the city.
  - Verify whether `routeNavigationRuntime` returns `runtimeResult.access.refusal`.
  - Verify the city entry UI consumes that refusal result.

### BUG-ACC007-002: City entry condition factor switch to person did not reveal person-specific controls

- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- case: `City - Person condition`
- bug_status: `open`
- fixed: `no`
- simulated_path:
  - Start from Script Editor workspace after the city event-condition test.
  - Stay on city `city.kulan` / `濠州`.
  - Stay on the `进入条件` tab.
  - In the existing condition row, change factor from `事件` to `人物`.
- observed:
  - The factor select displayed `人物`.
  - The dependent controls still displayed event selector options and the `完成` / `未完成` select.
  - No person selector, person attribute selector, operator selector, or value control appeared.
  - Because the UI could not configure a person condition through the visible authoring surface, the remaining person runtime test could not proceed from this state.
- expected:
  - Selecting `人物` should immediately render:
    - person selector sourced from the project people list,
    - attribute selector sourced from the selected person's base/custom attributes,
    - operator selector appropriate to the attribute type,
    - value input/select appropriate to the attribute type.
- current_cause_assessment:
  - Root cause is not fully confirmed.
  - Evidence indicates the DOM select value changed, but the dependent controls did not re-render to the person branch.
  - Candidate causes:
    - The change event for native select did not reach the Script Editor delegated change handler during simulated operation.
    - The update handler did not persist the `factor` change into `location.access.conditionExpression`.
    - The render branch still read the prior event-shaped condition.
  - A follow-up should verify this with a real UI event listener trace and by inspecting the in-memory selected city access shape immediately after factor change.
- next_needed:
  - Add a focused UI regression test or browser diagnostic proving factor changes update `conditionExpression.left.subject`.
  - Re-run the same simulated-human path after any fix.

### BUG-ACC007-003: ACC-007 matrix could not continue to city time and building cases after person-factor blocker

- version: `target.city-building-module-entry-and-project-startup-authoring`
- queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- case: `City - Time condition`, `Building - Event condition`, `Building - Person condition`, `Building - Time condition`
- bug_status: `blocked-by-earlier-bug`
- fixed: `no`
- simulated_path:
  - Planned continuation after city-person condition setup.
  - Required matrix cases were not executed because the visible authoring UI did not allow person condition configuration after factor switch.
- observed:
  - The full six-case ACC-007 matrix remains incomplete.
- expected:
  - Each of the six cases must be separately operated and recorded before queue closeout can claim simulated-human acceptance.
- current_cause_assessment:
  - This is a test-continuation blocker, not a separate runtime root cause.
  - It depends first on resolving or bypassing `BUG-ACC007-002`.
- next_needed:
  - After `BUG-ACC007-002` is handled, resume the full matrix from city-person and continue through city-time and all building event/person/time cases.

## Non-Bug Notes

- The imported template used in this browser pass exposed no project dialogues in the refusal prompt select, so the refusal prompt dropdown only showed `不弹出拒绝对话`.
- That is not enough by itself to prove a runtime refusal-dialogue bug; a later simulated-human case must create/select a dialogue before validating refusal dialogue display.
- PowerShell `Get-Content` rendered some UTF-8 Chinese source and markdown text as mojibake during investigation. Browser-rendered UI text was readable in the observed session, so this document does not treat shell display mojibake as a runtime UI bug.

## Current Outcome

- ACC-CITY-BUILDING-ACCESS-CONDITION-007: `not passed`
- Queue closeout: `blocked`
- Version closeout: `not entered`
- Follow-up handling: `defer listed bugs to later unified fix/test pass`
