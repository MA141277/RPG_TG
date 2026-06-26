import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modDataRoot = path.join(
  repositoryRoot,
  "map",
  "yuan mo feng yun lu",
  "mods",
  "yuanmofengyunlu",
  "data"
);
const outputRoot = path.join(repositoryRoot, "generated");
const campaignRoot = path.join(
  modDataRoot,
  "world",
  "maps",
  "campaign",
  "imperial_campaign"
);
const campaignScriptPath = path.join(campaignRoot, "campaign_script.txt");
const textRoot = path.join(modDataRoot, "text");

const textTableFiles = [
  "historic_events.txt",
  "event_strings.txt",
  "event_titles.txt",
  "missions.txt",
  "campaign_descriptions.txt",
];

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

async function readAutoText(filePath, fallbackEncoding = "utf8") {
  const buffer = await readFile(filePath);
  const hasUtf16Bom = buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe;
  const hasNullBytes = buffer.subarray(0, Math.min(buffer.length, 512)).includes(0);
  const encoding = hasUtf16Bom || hasNullBytes ? "utf16le" : fallbackEncoding;

  if (encoding === "gb18030") {
    return stripBom(new TextDecoder("gb18030").decode(buffer));
  }

  return stripBom(buffer.toString(encoding));
}

function parseLocalisationTable(text) {
  const entries = new Map();
  const entryPattern = /^\{([^}]+)\}\s*(.*)$/gm;
  let match;

  while ((match = entryPattern.exec(text)) != null) {
    const key = match[1]?.trim();
    const value = match[2]?.trim() ?? "";
    if (key != null && key !== "") {
      entries.set(key, value);
    }
  }

  return entries;
}

function mergeTextTables(tables) {
  const merged = new Map();

  for (const table of tables) {
    for (const [key, value] of table.entries) {
      if (!merged.has(key)) {
        merged.set(key, { value, source: table.file });
      }
    }
  }

  return merged;
}

function normalizeHistoricEventLine(line) {
  return line.replace(/;.*$/, "").trim();
}

function parseHistoricEventCall(line) {
  const normalized = normalizeHistoricEventLine(line);
  const match = normalized.match(/^historic_event\s+([^\s]+)(?:\s+(.*))?$/i);
  if (match == null) {
    return null;
  }

  return {
    id: match[1],
    args: match[2]?.trim() ?? "",
  };
}

function findSectionHeading(lines, startIndex) {
  for (let index = startIndex; index >= 0; index -= 1) {
    const trimmed = lines[index]?.trim() ?? "";
    if (/^;{2,}/.test(trimmed)) {
      return trimmed.replace(/^;+|;+$/g, "").trim() || null;
    }
  }

  return null;
}

function parseMonitors(scriptText) {
  const lines = scriptText.split(/\r?\n/);
  const monitors = [];
  let current = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (/^monitor_event\b/i.test(trimmed) || /^monitor_conditions\b/i.test(trimmed)) {
      current = {
        kind: trimmed.match(/^monitor_conditions\b/i) == null ? "monitor_event" : "monitor_conditions",
        declaration: trimmed,
        startLine: index + 1,
        endLine: null,
        section: findSectionHeading(lines, index),
        lines: [line],
        historicEventCalls: [],
        consoleCommands: [],
        spawnArmyCount: 0,
        setCounterCount: 0,
      };
      monitors.push(current);
      return;
    }

    if (current == null) {
      return;
    }

    current.lines.push(line);

    const historicEvent = parseHistoricEventCall(trimmed);
    if (historicEvent != null) {
      current.historicEventCalls.push({
        ...historicEvent,
        line: index + 1,
      });
    }

    if (/^console_command\b/i.test(trimmed)) {
      current.consoleCommands.push({
        line: index + 1,
        command: trimmed.replace(/^console_command\s+/i, ""),
      });
    }

    if (/^spawn_army\b/i.test(trimmed)) {
      current.spawnArmyCount += 1;
    }

    if (/^(set_counter|set_event_counter|inc_counter)\b/i.test(trimmed)) {
      current.setCounterCount += 1;
    }

    if (/^end_monitor\b/i.test(trimmed)) {
      current.endLine = index + 1;
      current = null;
    }
  });

  return monitors;
}

function parseDeclareCounters(scriptText) {
  return scriptText
    .split(/\r?\n/)
    .map((line, index) => {
      const match = line.trim().match(/^declare_counter\s+(\S+)/i);
      return match == null ? null : { id: match[1], line: index + 1 };
    })
    .filter((counter) => counter != null);
}

function lookupText(textsByKey, id, suffix) {
  const keys = suffix == null ? [id] : [`${id}_${suffix}`, `${id}${suffix}`];

  for (const key of keys) {
    const entry = textsByKey.get(key);
    if (entry != null) {
      return {
        key,
        value: entry.value,
        source: entry.source,
      };
    }
  }

  return null;
}

function buildEvents(monitors, textsByKey) {
  const eventsById = new Map();

  for (const monitor of monitors) {
    for (const call of monitor.historicEventCalls) {
      const existing = eventsById.get(call.id) ?? {
        id: call.id,
        title: lookupText(textsByKey, call.id, "TITLE"),
        body: lookupText(textsByKey, call.id, "BODY"),
        directText: lookupText(textsByKey, call.id, null),
        calls: [],
      };

      existing.calls.push({
        line: call.line,
        args: call.args,
        monitor: {
          kind: monitor.kind,
          declaration: monitor.declaration,
          startLine: monitor.startLine,
          endLine: monitor.endLine,
          section: monitor.section,
          script: monitor.lines.join("\n"),
          consoleCommands: monitor.consoleCommands,
          spawnArmyCount: monitor.spawnArmyCount,
          setCounterCount: monitor.setCounterCount,
        },
      });

      eventsById.set(call.id, existing);
    }
  }

  return [...eventsById.values()].sort((left, right) => left.calls[0].line - right.calls[0].line);
}

function summarize(events, monitors, counters, textTables) {
  const bySection = {};

  for (const event of events) {
    for (const call of event.calls) {
      const section = call.monitor.section ?? "unsectioned";
      bySection[section] = (bySection[section] ?? 0) + 1;
    }
  }

  return {
    source: {
      campaignScript: campaignScriptPath,
      textTables: textTables.map((table) => path.join(textRoot, table.file)),
    },
    totalMonitors: monitors.length,
    monitorsWithHistoricEvents: monitors.filter((monitor) => monitor.historicEventCalls.length > 0)
      .length,
    totalHistoricEventCalls: events.reduce((total, event) => total + event.calls.length, 0),
    uniqueHistoricEvents: events.length,
    withTitle: events.filter((event) => event.title != null).length,
    withBody: events.filter((event) => event.body != null).length,
    counters: counters.length,
    bySection: Object.fromEntries(
      Object.entries(bySection).sort((left, right) => right[1] - left[1])
    ),
    sampleEvents: events.slice(0, 20).map((event) => ({
      id: event.id,
      title: event.title?.value ?? event.directText?.value ?? null,
      firstLine: event.calls[0]?.line ?? null,
      section: event.calls[0]?.monitor.section ?? null,
      callCount: event.calls.length,
    })),
  };
}

async function main() {
  const [scriptText, ...tableTexts] = await Promise.all([
    readAutoText(campaignScriptPath, "gb18030"),
    ...textTableFiles.map((file) => readAutoText(path.join(textRoot, file))),
  ]);
  const textTables = textTableFiles.map((file, index) => ({
    file,
    entries: parseLocalisationTable(tableTexts[index]),
  }));
  const textsByKey = mergeTextTables(textTables);
  const monitors = parseMonitors(scriptText);
  const counters = parseDeclareCounters(scriptText);
  const events = buildEvents(monitors, textsByKey);
  const summary = summarize(events, monitors, counters, textTables);

  await mkdir(outputRoot, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(outputRoot, "yuanmo-events.json"),
      `${JSON.stringify(events, null, 2)}\n`,
      "utf8"
    ),
    writeFile(
      path.join(outputRoot, "yuanmo-event-summary.json"),
      `${JSON.stringify(summary, null, 2)}\n`,
      "utf8"
    ),
  ]);

  console.log(JSON.stringify(summary, null, 2));
}

await main();
