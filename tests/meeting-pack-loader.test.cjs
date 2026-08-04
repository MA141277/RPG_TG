const assert = require("node:assert/strict");
const test = require("node:test");

const {
  loadScenarioPackFromUrl,
  loadScenarioPackFromFiles,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");
const {
  loadContentPackFromManifestText,
} = require("../.test-dist/application/content/content-pack-loader.js");
const {
  createActiveGameContent,
} = require("../.test-dist/application/content/active-game-content.js");

function createBaseScenarioManifest() {
  return {
    schemaVersion: 1,
    id: "scenario.test.meeting-pack",
    title: "Meeting Pack",
    files: {
      scenarioProfile: "scenario-profile.json",
      characters: "characters.json",
      events: "events.json",
      dialogues: "dialogues.json",
      meetings: "meetings.json",
      meetingBindings: "meeting-bindings.json",
      meetingPanels: "meeting-panels.json",
      meetingChoiceSets: "meeting-choice-sets.json",
      meetingActionSets: "meeting-action-sets.json",
    },
  };
}

test("scenario pack loader exposes authored meeting families to active content", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.endsWith("/pack.json")) {
      return { ok: true, json: async () => createBaseScenarioManifest() };
    }
    if (url.endsWith("/scenario-profile.json")) {
      return {
        ok: true,
        json: async () => ({
          id: "profile.test.meeting-pack",
          playerCharacterId: "char.player",
          chapterId: "chapter.test",
          initialLocation: {
            mapId: "map.test",
            cityId: "city.test",
            houseId: null,
            view: "city",
          },
        }),
      };
    }
    if (url.endsWith("/characters.json")) {
      return {
        ok: true,
        json: async () => [{ id: "char.player", name: "Player" }],
      };
    }
    if (url.endsWith("/events.json") || url.endsWith("/dialogues.json")) {
      return { ok: true, json: async () => [] };
    }
    if (url.endsWith("/meetings.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "meeting.temple.review",
            hostScope: {
              family: "building",
              templateId: "house.kulan.temple",
            },
            initialStageId: "intro",
            stageIds: ["intro"],
            stagesById: {
              intro: {
                id: "intro",
                type: "dialogue",
                dialogueId: "dialogue.temple.review.intro",
              },
            },
          },
        ],
      };
    }
    if (url.endsWith("/meeting-bindings.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "binding.temple.review",
            meetingId: "meeting.temple.review",
            owner: {
              family: "building",
              id: "house.kulan.temple",
            },
            trigger: {
              action: "building-container-item-action",
              itemId: "review",
            },
          },
        ],
      };
    }
    if (url.endsWith("/meeting-panels.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "panel.temple.review.policy",
            title: "Policy",
            sections: [],
          },
        ],
      };
    }
    if (url.endsWith("/meeting-choice-sets.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "choices.temple.review.assignment",
            choices: [],
          },
        ],
      };
    }
    if (url.endsWith("/meeting-action-sets.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "actions.temple.review.complete",
            actions: [],
          },
        ],
      };
    }

    throw new Error(`Unexpected fetch URL: ${url}`);
  };

  try {
    const pack = await loadScenarioPackFromUrl("file:///virtual/pack.json");
    const activeContent = createActiveGameContent(pack);

    assert.equal(pack.meetings?.[0]?.id, "meeting.temple.review");
    assert.equal(pack.meetingBindings?.[0]?.id, "binding.temple.review");
    assert.equal(pack.meetingPanels?.[0]?.id, "panel.temple.review.policy");
    assert.equal(
      pack.meetingChoiceSets?.[0]?.id,
      "choices.temple.review.assignment"
    );
    assert.equal(
      pack.meetingActionSets?.[0]?.id,
      "actions.temple.review.complete"
    );

    assert.equal(activeContent.meetings?.[0]?.id, "meeting.temple.review");
    assert.equal(
      activeContent.meetingsById?.["meeting.temple.review"]?.id,
      "meeting.temple.review"
    );
    assert.equal(
      activeContent.meetingBindingsById?.["binding.temple.review"]?.meetingId,
      "meeting.temple.review"
    );
    assert.equal(
      activeContent.meetingPanelsById?.["panel.temple.review.policy"]?.id,
      "panel.temple.review.policy"
    );
    assert.equal(
      activeContent.meetingChoiceSetsById?.["choices.temple.review.assignment"]?.id,
      "choices.temple.review.assignment"
    );
    assert.equal(
      activeContent.meetingActionSetsById?.["actions.temple.review.complete"]?.id,
      "actions.temple.review.complete"
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("scenario pack file import hydrates authored meeting families from pack.json", async () => {
  const importedFiles = [
    new File(
      [
        JSON.stringify({
          schemaVersion: 1,
          kind: "scenario-pack",
          id: "scenario.test.meeting-import",
          title: "Meeting Import Pack",
          files: {
            scenarioProfile: "scenario-profile.json",
            characters: "characters.json",
            events: "events.json",
            dialogues: "dialogues.json",
            meetings: "meetings.json",
            meetingBindings: "meeting-bindings.json",
            meetingPanels: "meeting-panels.json",
            meetingChoiceSets: "meeting-choice-sets.json",
            meetingActionSets: "meeting-action-sets.json",
          },
        }),
      ],
      "pack.json",
      { type: "application/json" }
    ),
    new File(
      [
        JSON.stringify({
          id: "profile.test.meeting-import",
          playerCharacterId: "char.player",
          chapterId: "chapter.test",
          initialLocation: {
            mapId: "map.test",
            cityId: "city.test",
            houseId: null,
            view: "city",
          },
        }),
      ],
      "scenario-profile.json",
      { type: "application/json" }
    ),
    new File(
      [JSON.stringify([{ id: "char.player", name: "Player" }])],
      "characters.json",
      { type: "application/json" }
    ),
    new File([JSON.stringify([])], "events.json", { type: "application/json" }),
    new File([JSON.stringify([])], "dialogues.json", {
      type: "application/json",
    }),
    new File(
      [
        JSON.stringify([
          {
            id: "meeting.temple.review",
            hostScope: {
              family: "building",
              templateId: "house.kulan.temple",
            },
            initialStageId: "intro",
            stageIds: ["intro"],
            stagesById: {
              intro: {
                id: "intro",
                type: "dialogue",
              },
            },
          },
        ]),
      ],
      "meetings.json",
      { type: "application/json" }
    ),
    new File(
      [
        JSON.stringify([
          {
            id: "binding.temple.review",
            meetingId: "meeting.temple.review",
            owner: {
              family: "building",
              id: "house.kulan.temple",
            },
            trigger: {
              action: "building-container-item-action",
              itemId: "review",
            },
          },
        ]),
      ],
      "meeting-bindings.json",
      { type: "application/json" }
    ),
    new File(
      [JSON.stringify([{ id: "panel.temple.review.policy", title: "Policy", sections: [] }])],
      "meeting-panels.json",
      { type: "application/json" }
    ),
    new File(
      [JSON.stringify([{ id: "choices.temple.review.assignment", choices: [] }])],
      "meeting-choice-sets.json",
      { type: "application/json" }
    ),
    new File(
      [JSON.stringify([{ id: "actions.temple.review.complete", actions: [] }])],
      "meeting-action-sets.json",
      { type: "application/json" }
    ),
  ];

  const pack = await loadScenarioPackFromFiles(importedFiles);

  assert.equal(pack.meetings?.[0]?.id, "meeting.temple.review");
  assert.equal(pack.meetingBindings?.[0]?.id, "binding.temple.review");
  assert.equal(pack.meetingPanels?.[0]?.id, "panel.temple.review.policy");
  assert.equal(
    pack.meetingChoiceSets?.[0]?.id,
    "choices.temple.review.assignment"
  );
  assert.equal(
    pack.meetingActionSets?.[0]?.id,
    "actions.temple.review.complete"
  );
});

test("content pack loader hydrates authored meeting families", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.endsWith("/meetings.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "meeting.temple.review",
            hostScope: {
              family: "building",
              templateId: "house.kulan.temple",
            },
            initialStageId: "intro",
            stageIds: ["intro"],
            stagesById: {
              intro: {
                id: "intro",
                type: "dialogue",
              },
            },
          },
        ],
      };
    }
    if (url.endsWith("/meeting-bindings.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "binding.temple.review",
            meetingId: "meeting.temple.review",
            owner: {
              family: "building",
              id: "house.kulan.temple",
            },
            trigger: {
              action: "building-container-item-action",
              itemId: "review",
            },
          },
        ],
      };
    }
    if (url.endsWith("/meeting-panels.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "panel.temple.review.policy",
            title: "Policy",
            sections: [],
          },
        ],
      };
    }
    if (url.endsWith("/meeting-choice-sets.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "choices.temple.review.assignment",
            choices: [],
          },
        ],
      };
    }
    if (url.endsWith("/meeting-action-sets.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "actions.temple.review.complete",
            actions: [],
          },
        ],
      };
    }

    throw new Error(`Unexpected fetch URL: ${url}`);
  };

  try {
    const pack = await loadContentPackFromManifestText(
      JSON.stringify({
        schemaVersion: 1,
        id: "pack.test.meeting-pack",
        title: "Meeting Pack",
        files: {
          meetings: "meetings.json",
          meetingBindings: "meeting-bindings.json",
          meetingPanels: "meeting-panels.json",
          meetingChoiceSets: "meeting-choice-sets.json",
          meetingActionSets: "meeting-action-sets.json",
        },
      }),
      "file:///virtual/pack.json"
    );
    const activeContent = createActiveGameContent(pack);

    assert.equal(pack.meetings?.[0]?.id, "meeting.temple.review");
    assert.equal(pack.meetingBindings?.[0]?.id, "binding.temple.review");
    assert.equal(pack.meetingPanels?.[0]?.id, "panel.temple.review.policy");
    assert.equal(
      pack.meetingChoiceSets?.[0]?.id,
      "choices.temple.review.assignment"
    );
    assert.equal(
      pack.meetingActionSets?.[0]?.id,
      "actions.temple.review.complete"
    );
    assert.equal(
      activeContent.meetingBindingsById["binding.temple.review"]?.meetingId,
      "meeting.temple.review"
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("active game content merges authored meeting families by id across override packs", () => {
  const content = createActiveGameContent(
    {
      schemaVersion: 1,
      id: "pack.base.meeting",
      title: "Base Meeting Pack",
      characters: [],
      events: [],
      scenes: [],
      dialogues: [],
      meetings: [
        {
          id: "meeting.temple.review",
          hostScope: {
            family: "building",
            templateId: "house.kulan.temple",
          },
          initialStageId: "intro",
          stageIds: ["intro"],
          stagesById: {
            intro: {
              id: "intro",
              type: "dialogue",
            },
          },
        },
      ],
      meetingBindings: [
        {
          id: "binding.temple.review",
          meetingId: "meeting.temple.review",
          owner: {
            family: "building",
            id: "house.kulan.temple",
          },
          trigger: {
            action: "building-container-item-action",
            itemId: "review",
          },
        },
      ],
      meetingPanels: [{ id: "panel.temple.review.policy", title: "Base", sections: [] }],
      meetingChoiceSets: [{ id: "choices.temple.review.assignment", choices: [] }],
      meetingActionSets: [{ id: "actions.temple.review.complete", actions: [] }],
    },
    {
      schemaVersion: 1,
      id: "pack.override.meeting",
      title: "Override Meeting Pack",
      characters: [],
      events: [],
      scenes: [],
      dialogues: [],
      meetings: [
        {
          id: "meeting.temple.review",
          hostScope: {
            family: "building",
            templateId: "house.kulan.temple",
          },
          initialStageId: "policy",
          stageIds: ["policy"],
          stagesById: {
            policy: {
              id: "policy",
              type: "policy-panel",
              panelId: "panel.temple.review.policy",
            },
          },
        },
      ],
      meetingPanels: [{ id: "panel.temple.review.policy", title: "Override", sections: [] }],
    }
  );

  assert.equal(content.meetings.length, 1);
  assert.equal(
    content.meetingsById["meeting.temple.review"]?.initialStageId,
    "policy"
  );
  assert.equal(
    content.meetingPanelsById["panel.temple.review.policy"]?.title,
    "Override"
  );
  assert.equal(
    content.meetingBindingsById["binding.temple.review"]?.meetingId,
    "meeting.temple.review"
  );
  assert.equal(
    content.meetingChoiceSetsById["choices.temple.review.assignment"]?.id,
    "choices.temple.review.assignment"
  );
  assert.equal(
    content.meetingActionSetsById["actions.temple.review.complete"]?.id,
    "actions.temple.review.complete"
  );
});
