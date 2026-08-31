const test = require("node:test");
const assert = require("node:assert/strict");

function loadRenderer() {
  return require("../.test-dist/ui/views/house/txt-narrative-place-house-view.js");
}

test("TXT narrative house view renders transcript entries, recommended options, custom input, and control actions from typed overlay data", () => {
  const { renderTxtNarrativePlaceHouseView } = loadRenderer();

  const markup = renderTxtNarrativePlaceHouseView({
    moduleId: "txt-narrative-place",
    houseId: "house.kulan.temple_txt_narrative",
    sceneTitle: "皇觉寺（文游）",
    sceneSubtitle: "兵荒与化缘",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "txt-narrative",
      title: "TXT文游",
      placeName: "皇觉寺",
      phaseLabel: "皇觉寺遣众化缘",
      isStreaming: false,
      paused: false,
      transcript: [
        {
          id: "turn-1",
          kind: "narration",
          text: "兵荒马乱，皇觉寺山门前尽是流民与饥色。",
        },
        {
          id: "turn-2",
          kind: "dialogue",
          speakerId: "char.kulan_temple_abbot",
          speakerName: "皇觉寺住持",
          text: "寺里已经养不起这么多人了。",
          portraitArtClassName: "c-txt-narrative-portrait--abbot",
        },
      ],
      options: [
        {
          id: "option.accept_alms",
          label: "应下化缘",
          actionId: "txt-narrative-select-option:option.accept_alms",
          kind: "mainline",
          recommended: true,
        },
        {
          id: "option.exit_proactive",
          label: "退出主动推演",
          actionId: "txt-narrative-select-option:option.exit_proactive",
          kind: "exit",
          recommended: false,
        },
      ],
      customInput: {
        fieldId: "txt-narrative-custom-input",
        submitActionId: "txt-narrative-submit-custom-input",
        value: "",
        placeholder: "输入你的回应",
      },
      controlActions: {
        exitActionId: "txt-narrative-exit",
        reactivateActionId: "txt-narrative-reactivate",
      },
    },
    leaveAction: {
      id: "leave-house",
      label: "离开",
    },
  });

  assert.match(markup, /TXT文游/u);
  assert.match(markup, /皇觉寺遣众化缘/u);
  assert.match(markup, /兵荒马乱，皇觉寺山门前尽是流民与饥色/u);
  assert.match(markup, /皇觉寺住持/u);
  assert.match(markup, /寺里已经养不起这么多人了/u);
  assert.match(
    markup,
    /data-house-action="txt-narrative-select-option:option.accept_alms"/u
  );
  assert.match(markup, /c-txt-narrative__option--recommended/u);
  assert.match(
    markup,
    /data-house-field="txt-narrative-custom-input"/u
  );
  assert.match(
    markup,
    /data-house-action="txt-narrative-submit-custom-input"/u
  );
  assert.match(markup, /placeholder="输入你的回应"/u);
  assert.match(markup, /data-house-action="txt-narrative-exit"/u);
  assert.match(markup, /data-house-action="txt-narrative-reactivate"/u);
});

test("TXT narrative house view exposes paused and streaming state through typed status markup instead of implicit DOM-only logic", () => {
  const { renderTxtNarrativePlaceHouseView } = loadRenderer();

  const markup = renderTxtNarrativePlaceHouseView({
    moduleId: "txt-narrative-place",
    houseId: "house.kulan.temple_txt_narrative",
    sceneTitle: "皇觉寺（文游）",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "txt-narrative",
      title: "TXT文游",
      placeName: "皇觉寺山门外",
      phaseLabel: "化缘启程",
      isStreaming: true,
      paused: true,
      transcript: [],
      options: [],
      customInput: {
        fieldId: "txt-narrative-custom-input",
        submitActionId: "txt-narrative-submit-custom-input",
        value: "向住持作揖",
        placeholder: "输入你的回应",
      },
      controlActions: {
        exitActionId: "txt-narrative-exit",
        reactivateActionId: "txt-narrative-reactivate",
      },
      statusNotice: "正在继续推演……",
      errorNotice: "上一次请求已中断，可重新唤起。",
    },
    leaveAction: {
      id: "leave-house",
      label: "离开",
    },
  });

  assert.match(markup, /data-txt-narrative-streaming="true"/u);
  assert.match(markup, /data-txt-narrative-paused="true"/u);
  assert.match(markup, /正在继续推演/u);
  assert.match(markup, /上一次请求已中断，可重新唤起/u);
  assert.match(markup, /value="向住持作揖"/u);
});
