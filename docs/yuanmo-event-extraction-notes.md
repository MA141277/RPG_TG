# Yuanmo Event Extraction Notes

## Source Files

- `mods/yuanmofengyunlu/data/world/maps/campaign/imperial_campaign/campaign_script.txt`
  - Campaign monitor blocks, trigger conditions, historic event calls, counters, console commands, spawn-army logic, city-change logic, and campaign plot logic.
- `mods/yuanmofengyunlu/data/text/historic_events.txt`
  - Most historic event titles and body text. Usually UTF-16LE.
- `mods/yuanmofengyunlu/data/text/event_strings.txt`
  - Extra event UI strings.
- `mods/yuanmofengyunlu/data/text/event_titles.txt`
  - Event title lookup table.
- `mods/yuanmofengyunlu/data/text/missions.txt`
  - Mission text and objectives.
- `mods/yuanmofengyunlu/data/text/campaign_descriptions.txt`
  - Campaign description text.

## Generated Files

- `generated/yuanmo-events.json`
  - Full extracted event list, including text and source monitor script blocks.
- `generated/yuanmo-event-summary.json`
  - Counts, source paths, section distribution, and sample events.

Regenerate with:

```powershell
node tools\extract-yuanmo-events.mjs
```

## Current Extraction Coverage

- Total monitor blocks parsed: 370
- Monitors with historic events: 79
- Historic event calls: 82
- Unique historic event ids: 73
- Events with title text: 48
- Events with body text: 47
- Declared counters: 286

## Mapping Rules

- `campaign_script.txt` is decoded as GB18030 because its comments and section headings are Chinese.
- Text tables are decoded as UTF-16LE when a BOM or null bytes are detected.
- Text table entries use the pattern `{KEY}value`.
- A `historic_event WUGUOGONG` call maps to text keys such as:
  - `WUGUOGONG_TITLE`
  - `WUGUOGONG_BODY`
- Each event record keeps every call site because the same event id may be triggered by more than one monitor.

## Output Shape

Important fields in `generated/yuanmo-events.json`:

```ts
type YuanmoEvent = {
  id: string;
  title: { key: string; value: string; source: string } | null;
  body: { key: string; value: string; source: string } | null;
  directText: { key: string; value: string; source: string } | null;
  calls: Array<{
    line: number;
    args: string;
    monitor: {
      kind: "monitor_event" | "monitor_conditions";
      declaration: string;
      startLine: number;
      endLine: number | null;
      section: string | null;
      script: string;
      consoleCommands: Array<{ line: number; command: string }>;
      spawnArmyCount: number;
      setCounterCount: number;
    };
  }>;
};
```

## Useful Event Groups

- Opening events: `DESCR`, `DESCRT`, `DESMUGHAL`, `YIZHIYAN`.
- History route opt-in: `lishizhengshi`, followed by scripted history events such as `WUGUOGONG`, `WUSHANGFA`, `SONGJIANGXIANG`.
- Famous-city ownership changes: `LOST_YINGTIAN`, `LOST_SHUNTIAN`, and related `LOST_*` ids.
- Larger campaign arcs appear under script sections such as `朱元璋北伐`, `王保保力挽大元`, `鄱阳湖之战`, `蒙古定河北`.

## Known Quality Notes

- Some historic events intentionally have no title/body because they may be engine-side prompts or disabled/test events.
- Some script sections rely on counters and console commands; displaying the title/body alone is safe, but reproducing behavior requires converting the monitor script into project-native rules.
- The extractor does not yet deeply parse every condition expression. It preserves the raw monitor script so a later pass can implement condition/action conversion without rereading the mod file.
