const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  runProgressionRuntime,
} = require("../.test-dist/core/runtime/progression-runtime.js");

test("progression runtime module exists in source", () => {
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), "src/core/runtime/progression-runtime.ts")
    ),
    true
  );
});

test("runProgressionRuntime enters highest satisfied tier and emits settlement once", () => {
  const track = {
    id: "rank",
    title: "Rank",
    metricKey: "merit",
    metricLabel: "Merit",
    hostFamily: "person",
    allowDemotion: false,
    tiers: [
      { id: "novice", title: "Novice", threshold: 10 },
      {
        id: "officer",
        title: "Officer",
        threshold: 20,
        targetTierSettlementId: "settle.officer",
      },
    ],
  };
  const binding = {
    id: "binding.rank.hero",
    trackId: "rank",
    host: {
      family: "person",
      id: "hero",
    },
  };

  const result = runProgressionRuntime({
    state: { trackStatesByHostKey: {} },
    track,
    binding,
    metricValue: 25,
    occurredAt: "1351-01-01",
  });

  assert.equal(
    result.state.trackStatesByHostKey["person:hero"].rank.currentTierId,
    "officer"
  );
  assert.deepEqual(result.settlementInstances, [
    {
      settlementId: "settle.officer",
      payload: {
        hostFamily: "person",
        hostId: "hero",
        trackId: "rank",
        fromTierId: null,
        toTierId: "officer",
        metricValue: 25,
      },
    },
  ]);

  const repeated = runProgressionRuntime({
    state: result.state,
    track,
    binding,
    metricValue: 25,
    occurredAt: "1351-01-02",
  });

  assert.deepEqual(repeated.settlementInstances, []);
});

test("runProgressionRuntime skips disabled or unresolved bindings", () => {
  const track = {
    id: "rank",
    title: "Rank",
    metricKey: "merit",
    metricLabel: "Merit",
    hostFamily: "person",
    tiers: [{ id: "novice", title: "Novice", threshold: 10 }],
  };

  const disabled = runProgressionRuntime({
    state: { trackStatesByHostKey: {} },
    track,
    binding: {
      id: "disabled",
      trackId: "rank",
      host: { family: "person", id: "hero" },
      enabled: false,
    },
    metricValue: 20,
    occurredAt: "1351-01-01",
  });
  const unresolved = runProgressionRuntime({
    state: { trackStatesByHostKey: {} },
    track,
    binding: {
      id: "unresolved",
      trackId: "rank",
      host: { family: "person" },
    },
    metricValue: 20,
    occurredAt: "1351-01-01",
  });

  assert.deepEqual(disabled.settlementInstances, []);
  assert.match(disabled.diagnostics[0], /skipped-disabled-binding/);
  assert.deepEqual(unresolved.settlementInstances, []);
  assert.match(unresolved.diagnostics[0], /skipped-unresolved-host/);
});
