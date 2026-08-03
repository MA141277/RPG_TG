# Dialogue Browser Test Log (2026-08-01)

## Environment

- URL: `http://localhost:5173/`
- Surface: in-app browser
- Mode: human-style runtime verification through script editor preview

## Passed So Far

1. Script editor template project can be opened and the dialogue module can be entered.
2. Dialogue module currently exposes the single-screen `基础` tab path and can edit:
   - `title`
   - `mode`
   - `textId`
   - `speakerPersonId`
   - `cast`
   - `nextEventId`
3. Preview can enter the temple host runtime directly.
4. Temple `离开` can return from building host to city host.
5. City `粮账` minigame can launch and produce a result screen.
6. City `粮账` settlement updates runtime money:
   - before: `银两 120 文`
   - after: `银两 133 文`
7. City `药材炼制` minigame can launch and produce a result screen.
8. City `药材炼制` settlement updates runtime stamina:
   - before: `体力 93`
   - after: `体力 89`
9. City `化缘` minigame can still launch from the city host and enter the playable screen.

## Blockers

### Block-01

- Phenomenon: preview was blocked by dialogue export validation.
- Error: `Single-screen dialogue export requires a speakerPersonId.`
- Trigger: click `运行预览`.
- Located record: `颍州街头风声`.
- Impact: runtime tests cannot start until the record is fixed.

### Block-02

- Phenomenon: city entry flow is easily masked by overlay sequencing.
- Trigger: enter city and operate top city menu while overlay/result layers are still visible.
- Impact: later runtime actions look unresponsive unless the current layer is dismissed first.

### Block-03

- Phenomenon: city result overlays block subsequent city actions but the UI does not make the blocked state explicit enough.
- Trigger: complete a city action such as `化缘`, then click another city menu action before dismissing the result.
- Impact: follow-up tests appear stuck until `确定` or `收起结果` is clicked.

### Block-04

- Phenomenon: city `地点` opens but does not present a usable location/building list.
- Trigger: city host -> `地点`.
- Impact: blocks runtime verification for city location -> event/dialogue entry.

### Block-05

- Phenomenon: fixing `speakerPersonId` in the dialogue editor left a stray empty cast row.
- Error: `Dialogue cast entries require a non-empty personId.`
- Trigger: click `运行预览` after partially fixing `颍州街头风声`.
- Impact: preview export is blocked again until the empty cast row is removed.

### Block-06

- Phenomenon: temple actions such as `评定` open a building function page but do not progress.
- Observed UI: a `Continue` button appears, but the state does not advance.
- Trigger:
  1. direct preview into `皇觉寺`
  2. click `评定`
  3. click `Continue`
- Impact: the building-function runtime branch is not playable end-to-end.

### Block-07

- Phenomenon: temple action `挑水` enters the same dead-end building function page shape as `评定`.
- Observed UI: `建筑功能 / 皇觉寺挑水 / Continue`
- Trigger:
  1. direct preview into `皇觉寺`
  2. click `挑水`
- Impact: temple action flows are currently not reaching dialogue/minigame/result completion.

### Block-08

- Phenomenon: direct preview into temple host does not automatically surface an entry dialogue/event handoff.
- Trigger: project startup set to `initialView=house`, `houseId=house.kulan.temple`, `characterSelection=fixed`.
- Impact: cannot yet confirm that a fresh session will always show the expected dialogue entry path from host startup.

## Temporary Test Data Adjustments

These were used only to continue verification and should be replaced by a real fix:

1. In dialogue `颍州街头风声`, set `speakerPersonId = char.player`.
2. Ensure cast contains only one valid row:
   - `personId = char.player`
   - `side = left`

## Next Recommended Test Steps

1. Fix temple building-function runtime so `Continue` actually advances or closes with a result.
2. Fix city `地点` so building/location entries are visible and clickable.
3. Re-run dialogue event-entry tests after host startup wiring is confirmed.
4. Add a dedicated runtime case for:
   - dialogue -> next event
   - dialogue option -> next event
   - dialogue -> menu
   - dialogue -> playable
