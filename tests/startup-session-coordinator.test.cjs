const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runStartupSessionCoordinator,
} = require("../.test-dist/application/startup/startup-session-coordinator.js");

function createScenarioPack() {
  return {
    schemaVersion: 1,
    id: "pack.preview",
    title: "Runtime Preview Pack",
    scenarioProfile: {
      id: "scenario.preview",
      title: "Runtime Preview Scenario",
      playerCharacterId: "char.preview",
      chapterId: "chapter.preview",
      initialLocation: {
        mapId: "map.preview",
        cityId: "city.preview",
        houseId: null,
        view: "map",
      },
      initialCalendar: {
        year: 1,
        month: 2,
        day: 3,
      },
      entryEventId: "event.preview.entry",
    },
  };
}

function createDeps(log, scenarioPack) {
  return {
    async activateBuiltinDefaultMod() {
      throw new Error("builtin startup should not run for loaded scenario pack");
    },
    async restoreModFromSave() {
      throw new Error("restore should not run for loaded scenario pack");
    },
    async activateScenarioPackMod(pack, source, requestId) {
      log.push({
        type: "activate",
        pack,
        source,
        requestId,
      });
      return {
        ok: true,
        modId: "mod.preview",
        source,
        content: {
          source: pack,
        },
      };
    },
    createPrototypeAppState() {
      throw new Error("prototype startup should not run for loaded scenario pack");
    },
    createHaozhouReturnEncounterAppState() {
      throw new Error("builtin story bootstrap should not run for loaded scenario pack");
    },
    createScenarioPackAppState(pack) {
      log.push({
        type: "create-app-state",
        pack,
      });
      return {
        sourcePackId: pack.id,
      };
    },
    createStartupContentContext(activationResult) {
      log.push({
        type: "content-context",
        activationResult,
      });
      return {
        activated: activationResult.modId,
      };
    },
    bootstrapStartupStoryAppState({ appState, bootstrap }) {
      log.push({
        type: "bootstrap",
        bootstrap,
      });
      return {
        ...appState,
        bootstrap,
      };
    },
  };
}

test("loaded scenario pack startup reuses the provided pack and source descriptor", async () => {
  const scenarioPack = createScenarioPack();
  const log = [];
  const source = {
    kind: "file",
    name: "runtime-preview",
    filePath: "runtime-preview:pack.preview",
  };
  const result = await runStartupSessionCoordinator(
    {
      type: "loaded-scenario-pack",
      scenarioPack,
      source,
    },
    createDeps(log, scenarioPack)
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.playerCharacterId, "char.preview");
  assert.deepEqual(log[0], {
    type: "activate",
    pack: scenarioPack,
    source,
    requestId: "startup:file:pack.preview",
  });

  const appState = result.session.createAppState();

  assert.deepEqual(appState, {
    sourcePackId: "pack.preview",
    bootstrap: {
      eventId: "event.preview.entry",
    },
  });
  assert.deepEqual(log.slice(1), [
    {
      type: "content-context",
      activationResult: {
        ok: true,
        modId: "mod.preview",
        source,
        content: {
          source: scenarioPack,
        },
      },
    },
    {
      type: "create-app-state",
      pack: scenarioPack,
    },
    {
      type: "bootstrap",
      bootstrap: {
        eventId: "event.preview.entry",
      },
    },
  ]);
});

test("builtin default startup reuses builtin scenario-pack app-state creation when activated content exposes a scenario pack", async () => {
  const builtinScenarioPack = {
    schemaVersion: 1,
    id: "scenario-pack.zhu_yuanzhang.builtin",
    title: "Builtin Start",
    scenarioProfile: {
      id: "scenario.zhu_yuanzhang.builtin",
      title: "Builtin Start",
      playerCharacterId: "char.pack.default",
      chapterId: "chapter.zhu-yuanzhang-rise",
      initialLocation: {
        mapId: "map.yuanmo_campaign",
        cityId: "city.kulan",
        houseId: null,
        view: "map",
      },
    },
  };
  const selectedCharacter = { id: "char.selected", name: "Selected" };
  const log = [];

  const result = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter,
      startupScenario: "default",
    },
    {
      activateBuiltinDefaultMod: async () => ({
        ok: true,
        modId: "mod.builtin",
        activatedMod: {
          normalizedContentSources: [builtinScenarioPack],
        },
      }),
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => {
        throw new Error("scenario-pack activation should not run for builtin start");
      },
      createPrototypeAppState: () => {
        throw new Error("covered builtin default startup should not use prototype state");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("haozhou-return overlay should not run for builtin default start");
      },
      createScenarioPackAppState: (pack) => {
        log.push({
          type: "create-app-state",
          pack,
        });
        return {
          sourcePackId: pack.id,
          packPlayerId: pack.scenarioProfile.playerCharacterId,
        };
      },
      createStartupContentContext: () => ({
        packId: "pack.base",
        storyContent: {},
      }),
      bootstrapStartupStoryAppState: ({ appState }) => appState,
    }
  );

  assert.equal(result.ok, true);

  const appState = result.session.createAppState();

  assert.equal(appState.sourcePackId, builtinScenarioPack.id);
  assert.equal(appState.packPlayerId, selectedCharacter.id);
  assert.equal(log.length, 1);
  assert.equal(log[0].type, "create-app-state");
  assert.equal(log[0].pack.id, builtinScenarioPack.id);
  assert.equal(
    log[0].pack.scenarioProfile.playerCharacterId,
    selectedCharacter.id
  );
});

test("loaded scenario pack startup can normalize a selected character through the shared scenario-pack path", async () => {
  const scenarioPack = {
    schemaVersion: 1,
    id: "pack.selected-character",
    title: "Selected Character Pack",
    scenarioProfile: {
      id: "scenario.selected-character",
      title: "Selected Character Scenario",
      playerCharacterId: "char.default",
      chapterId: "chapter.selected-character",
      initialLocation: {
        mapId: "map.preview",
        cityId: "city.preview",
        houseId: "house.base",
        view: "house",
      },
      initialUi: {
        reviewDateText: "默认评定",
        mainHouseMissionText: "默认任务",
      },
      characterStartups: [
        {
          characterId: "char.selected",
          initialUi: {
            reviewDateText: "选中角色评定",
            mainHouseMissionText: "选中角色任务",
          },
        },
      ],
    },
  };
  const log = [];
  const source = {
    kind: "file",
    name: "selected-character-pack",
    filePath: "runtime-preview:pack.selected-character",
  };

  const result = await runStartupSessionCoordinator(
    {
      type: "loaded-scenario-pack",
      scenarioPack,
      source,
      selectedCharacterId: "char.selected",
    },
    {
      activateBuiltinDefaultMod: async () => {
        throw new Error("builtin startup should not run for loaded scenario pack");
      },
      restoreModFromSave: async () => {
        throw new Error("restore should not run for loaded scenario pack");
      },
      activateScenarioPackMod: async (pack, receivedSource, requestId) => {
        log.push({
          type: "activate",
          pack,
          source: receivedSource,
          requestId,
        });
        return {
          ok: true,
          modId: "mod.selected-character",
          source: receivedSource,
          activatedMod: {
            normalizedContentSources: [pack],
          },
        };
      },
      createPrototypeAppState: () => {
        throw new Error("prototype startup should not run for loaded scenario pack");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("builtin overlay should not run for loaded scenario pack");
      },
      createScenarioPackAppState: (pack) => {
        log.push({
          type: "create-app-state",
          pack,
        });
        return {
          packPlayerId: pack.scenarioProfile.playerCharacterId,
          reviewDateText: pack.scenarioProfile.initialUi?.reviewDateText ?? null,
          mainHouseMissionText:
            pack.scenarioProfile.initialUi?.mainHouseMissionText ?? null,
        };
      },
      createStartupContentContext: () => ({
        storyContent: {},
      }),
      bootstrapStartupStoryAppState: ({ appState }) => appState,
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.playerCharacterId, "char.selected");

  const appState = result.session.createAppState();

  assert.deepEqual(appState, {
    packPlayerId: "char.selected",
    reviewDateText: "选中角色评定",
    mainHouseMissionText: "选中角色任务",
  });
  assert.equal(log[0].type, "activate");
  assert.equal(log[0].pack.scenarioProfile.playerCharacterId, "char.default");
  assert.equal(log[1].type, "create-app-state");
  assert.equal(log[1].pack.scenarioProfile.playerCharacterId, "char.selected");
  assert.equal(
    log[1].pack.scenarioProfile.initialUi.reviewDateText,
    "选中角色评定"
  );
});

test("loaded scenario pack startup does not immediately bootstrap deferred after-map-entry events", async () => {
  const scenarioPack = {
    schemaVersion: 1,
    id: "pack.deferred-entry",
    title: "Deferred Entry Pack",
    scenarioProfile: {
      id: "scenario.deferred-entry",
      title: "Deferred Entry Scenario",
      playerCharacterId: "char.player",
      chapterId: "chapter.deferred-entry",
      initialLocation: {
        mapId: "map.preview",
        cityId: "city.preview",
        houseId: null,
        view: "map",
      },
      entryEventId: "event.deferred.entry",
      launchPolicy: {
        initialView: "map",
        entryEventTiming: "after-map-entry",
      },
    },
  };
  const log = [];

  const result = await runStartupSessionCoordinator(
    {
      type: "loaded-scenario-pack",
      scenarioPack,
      source: {
        kind: "file",
        name: "deferred-entry-pack",
        filePath: "runtime-preview:pack.deferred-entry",
      },
    },
    {
      activateBuiltinDefaultMod: async () => {
        throw new Error("builtin startup should not run for loaded scenario pack");
      },
      restoreModFromSave: async () => {
        throw new Error("restore should not run for loaded scenario pack");
      },
      activateScenarioPackMod: async () => ({
        ok: true,
        modId: "mod.deferred-entry",
        activatedMod: {
          normalizedContentSources: [scenarioPack],
        },
      }),
      createPrototypeAppState: () => {
        throw new Error("prototype startup should not run for loaded scenario pack");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("builtin overlay should not run for loaded scenario pack");
      },
      createScenarioPackAppState: () => ({
        sourcePackId: scenarioPack.id,
      }),
      createStartupContentContext: () => ({
        storyContent: {},
      }),
      bootstrapStartupStoryAppState: ({ appState, bootstrap }) => {
        log.push(bootstrap);
        return {
          ...appState,
          bootstrapEventId: bootstrap?.eventId ?? null,
        };
      },
    }
  );

  assert.equal(result.ok, true);
  const appState = result.session.createAppState();

  assert.equal(appState.bootstrapEventId, null);
  assert.deepEqual(log, [null]);
});

test("builtin default startup and loaded scenario-pack startup keep deferred first-follow-up timing on the same startup contract", async () => {
  const scenarioPack = {
    schemaVersion: 1,
    id: "pack.followup-parity",
    title: "Follow-up Parity Pack",
    scenarioProfile: {
      id: "scenario.followup-parity",
      title: "Follow-up Parity Scenario",
      playerCharacterId: "char.player",
      chapterId: "chapter.followup-parity",
      initialLocation: {
        mapId: "map.preview",
        cityId: "city.preview",
        houseId: "house.temple",
        view: "house",
      },
      entryEventId: "event.followup.entry",
      launchPolicy: {
        initialView: "map",
        entryEventTiming: "after-map-entry",
      },
      characterStartups: [
        {
          characterId: "char.selected",
          initialUi: {
            reviewDateText: "选中角色评定",
            mainHouseMissionText: "选中角色任务",
          },
        },
      ],
    },
  };
  const builtinBootstraps = [];
  const loadedBootstraps = [];
  const selectedCharacter = {
    id: "char.selected",
    name: "Selected",
  };

  const builtinResult = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter,
      startupScenario: "default",
    },
    {
      activateBuiltinDefaultMod: async () => ({
        ok: true,
        modId: "mod.builtin",
        activatedMod: {
          normalizedContentSources: [scenarioPack],
        },
      }),
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => {
        throw new Error("scenario-pack activation should not run for builtin start");
      },
      createPrototypeAppState: () => {
        throw new Error("prototype startup should not run for builtin start");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("builtin overlay should not run for builtin start");
      },
      createScenarioPackAppState: (pack) => ({
        playerCharacterId: pack.scenarioProfile.playerCharacterId,
        reviewDateText: pack.scenarioProfile.initialUi?.reviewDateText ?? null,
      }),
      createStartupContentContext: () => ({
        storyContent: {},
      }),
      bootstrapStartupStoryAppState: ({ appState, bootstrap }) => {
        builtinBootstraps.push(bootstrap);
        return {
          ...appState,
          bootstrapEventId: bootstrap?.eventId ?? null,
        };
      },
    }
  );

  const loadedResult = await runStartupSessionCoordinator(
    {
      type: "loaded-scenario-pack",
      scenarioPack,
      source: {
        kind: "file",
        name: "followup-parity-pack",
        filePath: "runtime-preview:pack.followup-parity",
      },
      selectedCharacterId: "char.selected",
    },
    {
      activateBuiltinDefaultMod: async () => {
        throw new Error("builtin startup should not run for loaded scenario pack");
      },
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => ({
        ok: true,
        modId: "mod.loaded",
        activatedMod: {
          normalizedContentSources: [scenarioPack],
        },
      }),
      createPrototypeAppState: () => {
        throw new Error("prototype startup should not run for loaded scenario pack");
      },
      createHaozhouReturnEncounterAppState: () => {
        throw new Error("builtin overlay should not run for loaded scenario pack");
      },
      createScenarioPackAppState: (pack) => ({
        playerCharacterId: pack.scenarioProfile.playerCharacterId,
        reviewDateText: pack.scenarioProfile.initialUi?.reviewDateText ?? null,
      }),
      createStartupContentContext: () => ({
        storyContent: {},
      }),
      bootstrapStartupStoryAppState: ({ appState, bootstrap }) => {
        loadedBootstraps.push(bootstrap);
        return {
          ...appState,
          bootstrapEventId: bootstrap?.eventId ?? null,
        };
      },
    }
  );

  assert.equal(builtinResult.ok, true);
  assert.equal(loadedResult.ok, true);
  assert.equal(builtinResult.session.playerCharacterId, "char.selected");
  assert.equal(loadedResult.session.playerCharacterId, "char.selected");
  assert.deepEqual(builtinResult.session.createAppState(), {
    playerCharacterId: "char.selected",
    reviewDateText: "选中角色评定",
    bootstrapEventId: null,
  });
  assert.deepEqual(loadedResult.session.createAppState(), {
    playerCharacterId: "char.selected",
    reviewDateText: "选中角色评定",
    bootstrapEventId: null,
  });
  assert.deepEqual(builtinBootstraps, [null]);
  assert.deepEqual(loadedBootstraps, [null]);
});
