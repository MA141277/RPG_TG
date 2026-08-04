const test = require("node:test");
const assert = require("node:assert/strict");
const {
  ScopedAmbientLoopController,
} = require("../.test-dist/application/audio/scoped-ambient-loop-controller.js");

test("scoped ambient controller only toggles the target when city activity changes", () => {
  const calls = [];
  const controller = new ScopedAmbientLoopController({
    target: {
      activate: () => calls.push("activate"),
      deactivate: () => calls.push("deactivate"),
      destroy: () => calls.push("destroy"),
    },
    isActive: (snapshot) =>
      snapshot.isGameVisible && snapshot.currentView === "city",
  });

  controller.sync({ isGameVisible: true, currentView: "map" });
  controller.sync({ isGameVisible: true, currentView: "city" });
  controller.sync({ isGameVisible: true, currentView: "city" });
  controller.sync({ isGameVisible: true, currentView: "house" });

  assert.deepEqual(calls, ["activate", "deactivate"]);
});

test("destroy deactivates an active target once and always destroys it", () => {
  const calls = [];
  const controller = new ScopedAmbientLoopController({
    target: {
      activate: () => calls.push("activate"),
      deactivate: () => calls.push("deactivate"),
      destroy: () => calls.push("destroy"),
    },
    isActive: (snapshot) =>
      snapshot.isGameVisible && snapshot.currentView === "city",
  });

  controller.sync({ isGameVisible: true, currentView: "city" });
  controller.destroy();
  controller.destroy();

  assert.deepEqual(calls, ["activate", "deactivate", "destroy", "destroy"]);
});
