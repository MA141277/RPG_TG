# Yuanmo NPC Extraction Notes

## Source Files

- `mods/yuanmofengyunlu/data/world/maps/campaign/imperial_campaign/descr_strat.txt`
  - Initial campaign characters, faction ownership, role, age, map coordinates, portrait, battle model, traits.
- `mods/yuanmofengyunlu/data/text/names.txt`
  - Name key localisation. This file is UTF-16LE.
- `mods/yuanmofengyunlu/data/export_descr_character_traits.txt`
  - Trait definitions and trait level ids.
- `mods/yuanmofengyunlu/data/text/export_vnvs.txt`
  - Trait descriptions, biography text, effects, and epithets. This file is UTF-16LE.
- `mods/yuanmofengyunlu/data/export_descr_ancillaries.txt`
  - Ancillary ids and effects.
- `mods/yuanmofengyunlu/data/text/export_ancillaries.txt`
  - Ancillary names and descriptions. This file is UTF-16LE.

## Generated Files

- `generated/yuanmo-npcs.json`
  - Full extracted character list.
- `generated/yuanmo-npc-summary.json`
  - Counts and a Dadu/Shuntian nearby sample set.

Regenerate with:

```powershell
node tools\extract-yuanmo-npcs.mjs
```

## Current Extraction Coverage

- Total characters: 361
- Localised names: 361
- Characters with biography-like descriptions: 296
- Characters with epithets/titles: 164
- Roles:
  - named character: 291
  - general: 65
  - admiral: 2
  - spy: 1
  - diplomat: 1
  - merchant: 1

## Mapping Rules

- Character records come from `character ...` lines in `descr_strat.txt`.
- The active faction is the nearest preceding `faction ...` block.
- Names are tokenised from the source name, then localised through `text/names.txt`.
- `traits` lines become `{ id, level }` pairs.
- Biography and epithet are derived by:
  - `traits` entry, for example `LieZhuan-fengchen-31 1`
  - `export_descr_character_traits.txt` trait level, for example `LieZhuan-fengchen-31-01`
  - `text/export_vnvs.txt` keys:
    - `LieZhuan-fengchen-31-01_desc`
    - `LieZhuan-fengchen-31-01_epithet_desc`

## Known Quality Notes

- Some biography strings intentionally contain escaped `\n` from the mod text tables.
- Some characters without a personal `LieZhuan-*` trait fall back to generic trait descriptions such as nationality; this is useful metadata, but should not be shown as a full biography without filtering.
- The output keeps original faction ids from Medieval II, such as `byzantium`, `turks`, and `papal_states`; these should be mapped to Yuanmo political entities separately.
- Coordinates use the same campaign coordinate space as the extracted Yuanmo map nodes.
