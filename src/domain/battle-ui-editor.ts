export type BattleUiEditorVariableDefinition = {
  name: string;
  label: string;
  description: string;
  section: string;
  defaultValue: string;
};

export const battleUiEditorVariableDefinitions: BattleUiEditorVariableDefinition[] = [
  {
    name: "--battle-stage-left",
    label: "\u821e\u53f0 left",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "50%",
  },
  {
    name: "--battle-stage-top",
    label: "\u821e\u53f0 top",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "50%",
  },
  {
    name: "--battle-stage-width",
    label: "\u821e\u53f0 width",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u5bbd\u5ea6",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "min(100vw, 177.7778vh)",
  },
  {
    name: "--battle-stage-height",
    label: "\u821e\u53f0 height",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u9ad8\u5ea6",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "min(100vh, 56.25vw)",
  },
  {
    name: "--battle-stage-translate-x",
    label: "\u821e\u53f0 translateX",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u6c34\u5e73\u5fae\u8c03",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "-50%",
  },
  {
    name: "--battle-stage-translate-y",
    label: "\u821e\u53f0 translateY",
    description: "\u6574\u4e2a\u6218\u6597\u9875\u7684\u5782\u76f4\u5fae\u8c03",
    section: "\u6574\u4f53\u821e\u53f0",
    defaultValue: "-50%",
  },
  {
    name: "--battle-header-height",
    label: "\u9876\u680f\u9ad8\u5ea6",
    description: "\u9876\u90e8\u6218\u6597\u4fe1\u606f\u680f\u9ad8\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "8.0729%",
  },
  {
    name: "--battle-header-row-left",
    label: "\u6807\u9898\u7ec4 left",
    description: "\u9876\u680f\u4e2d\u95f4\u4fe1\u606f\u7ec4\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "33.4%",
  },
  {
    name: "--battle-header-row-top",
    label: "\u6807\u9898\u7ec4 top",
    description: "\u9876\u680f\u4e2d\u95f4\u4fe1\u606f\u7ec4\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "16%",
  },
  {
    name: "--battle-header-row-width",
    label: "\u6807\u9898\u7ec4 width",
    description: "\u9876\u680f\u4e2d\u95f4\u4fe1\u606f\u7ec4\u7684\u5bbd\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "33.2%",
  },
  {
    name: "--battle-header-row-height",
    label: "\u6807\u9898\u7ec4 height",
    description: "\u9876\u680f\u4e2d\u95f4\u4fe1\u606f\u7ec4\u7684\u9ad8\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "32%",
  },
  {
    name: "--battle-header-row-gap",
    label: "\u6807\u9898\u7ec4 gap",
    description: "\u9876\u680f\u4e2d\u95f4\u4fe1\u606f\u7ec4\u5185\u90e8\u95f4\u8ddd",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "1.1vw",
  },
  {
    name: "--battle-objective-left",
    label: "\u76ee\u6807 left",
    description: "\u76ee\u6807\u6587\u5b57\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "46.25%",
  },
  {
    name: "--battle-objective-top",
    label: "\u76ee\u6807 top",
    description: "\u76ee\u6807\u6587\u5b57\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "56%",
  },
  {
    name: "--battle-objective-width",
    label: "\u76ee\u6807 width",
    description: "\u76ee\u6807\u6587\u5b57\u533a\u57df\u7684\u5bbd\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "27%",
  },
  {
    name: "--battle-top-side-ally-width",
    label: "\u6211\u65b9\u603b\u89c8 width",
    description: "\u5de6\u4e0a\u6211\u65b9\u603b\u89c8\u9762\u677f\u5bbd\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "30.4%",
  },
  {
    name: "--battle-top-side-enemy-left",
    label: "\u654c\u65b9\u603b\u89c8 left",
    description: "\u53f3\u4e0a\u654c\u65b9\u603b\u89c8\u9762\u677f\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "68.945%",
  },
  {
    name: "--battle-top-side-enemy-width",
    label: "\u654c\u65b9\u603b\u89c8 width",
    description: "\u53f3\u4e0a\u654c\u65b9\u603b\u89c8\u9762\u677f\u5bbd\u5ea6",
    section: "\u9876\u90e8\u4fe1\u606f",
    defaultValue: "29%",
  },
  {
    name: "--battle-board-translate-y",
    label: "\u68cb\u76d8 translateY",
    description: "\u68cb\u76d8\u53ca\u5730\u56fe\u4e3b\u89c6\u89c9\u7684\u5782\u76f4\u5fae\u8c03",
    section: "\u6218\u573a\u4e3b\u4f53",
    defaultValue: "3.4%",
  },
  {
    name: "--battle-command-left",
    label: "\u5de6\u4fa7\u9762\u677f left",
    description: "\u5de6\u4fa7\u90e8\u961f\u9762\u677f\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u5de6\u4fa7\u9762\u677f",
    defaultValue: "-0.05%",
  },
  {
    name: "--battle-command-top",
    label: "\u5de6\u4fa7\u9762\u677f top",
    description: "\u5de6\u4fa7\u90e8\u961f\u9762\u677f\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u5de6\u4fa7\u9762\u677f",
    defaultValue: "16.1458%",
  },
  {
    name: "--battle-command-width",
    label: "\u5de6\u4fa7\u9762\u677f width",
    description: "\u5de6\u4fa7\u90e8\u961f\u9762\u677f\u7684\u5bbd\u5ea6",
    section: "\u5de6\u4fa7\u9762\u677f",
    defaultValue: "14.2578%",
  },
  {
    name: "--battle-command-height",
    label: "\u5de6\u4fa7\u9762\u677f height",
    description: "\u5de6\u4fa7\u90e8\u961f\u9762\u677f\u7684\u9ad8\u5ea6",
    section: "\u5de6\u4fa7\u9762\u677f",
    defaultValue: "67.6215%",
  },
  {
    name: "--battle-right-panel-left",
    label: "\u53f3\u4fa7\u9762\u677f left",
    description: "\u53f3\u4fa7\u65e5\u5fd7/\u63a7\u5236\u9762\u677f\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u53f3\u4fa7\u9762\u677f",
    defaultValue: "72.6074%",
  },
  {
    name: "--battle-right-panel-top",
    label: "\u53f3\u4fa7\u9762\u677f top",
    description: "\u53f3\u4fa7\u65e5\u5fd7/\u63a7\u5236\u9762\u677f\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u53f3\u4fa7\u9762\u677f",
    defaultValue: "12.5%",
  },
  {
    name: "--battle-right-panel-width",
    label: "\u53f3\u4fa7\u9762\u677f width",
    description: "\u53f3\u4fa7\u65e5\u5fd7/\u63a7\u5236\u9762\u677f\u7684\u5bbd\u5ea6",
    section: "\u53f3\u4fa7\u9762\u677f",
    defaultValue: "27.3438%",
  },
  {
    name: "--battle-right-panel-height",
    label: "\u53f3\u4fa7\u9762\u677f height",
    description: "\u53f3\u4fa7\u65e5\u5fd7/\u63a7\u5236\u9762\u677f\u7684\u9ad8\u5ea6",
    section: "\u53f3\u4fa7\u9762\u677f",
    defaultValue: "19.0972%",
  },
  {
    name: "--battle-start-left",
    label: "\u5f00\u59cb\u6218\u6597 left",
    description: "\u5f00\u59cb\u6218\u6597\u6309\u94ae\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "78.35%",
  },
  {
    name: "--battle-start-top",
    label: "\u5f00\u59cb\u6218\u6597 top",
    description: "\u5f00\u59cb\u6218\u6597\u6309\u94ae\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "92.52%",
  },
  {
    name: "--battle-start-width",
    label: "\u5f00\u59cb\u6218\u6597 width",
    description: "\u5f00\u59cb\u6218\u6597\u6309\u94ae\u7684\u5bbd\u5ea6",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "9.45%",
  },
  {
    name: "--battle-end-turn-left",
    label: "\u7ed3\u675f\u56de\u5408 left",
    description: "\u7ed3\u675f\u56de\u5408\u6309\u94ae\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "89.55%",
  },
  {
    name: "--battle-end-turn-top",
    label: "\u7ed3\u675f\u56de\u5408 top",
    description: "\u7ed3\u675f\u56de\u5408\u6309\u94ae\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "92.46%",
  },
  {
    name: "--battle-end-turn-width",
    label: "\u7ed3\u675f\u56de\u5408 width",
    description: "\u7ed3\u675f\u56de\u5408\u6309\u94ae\u7684\u5bbd\u5ea6",
    section: "\u5e95\u90e8\u6309\u94ae",
    defaultValue: "9.45%",
  },
  {
    name: "--battle-deploy-left",
    label: "\u90e8\u7f72\u6761 left",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u5de6\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "21.35%",
  },
  {
    name: "--battle-deploy-top",
    label: "\u90e8\u7f72\u6761 top",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u4e0a\u4fa7\u5b9a\u4f4d",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "86.05%",
  },
  {
    name: "--battle-deploy-width",
    label: "\u90e8\u7f72\u6761 width",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u5bbd\u5ea6",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "54.95%",
  },
  {
    name: "--battle-deploy-height",
    label: "\u90e8\u7f72\u6761 height",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u9ad8\u5ea6",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "10.25%",
  },
  {
    name: "--battle-deploy-translate-x",
    label: "\u90e8\u7f72\u6761 translateX",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u6c34\u5e73\u5fae\u8c03",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "20px",
  },
  {
    name: "--battle-deploy-translate-y",
    label: "\u90e8\u7f72\u6761 translateY",
    description: "\u5e95\u90e8\u90e8\u7f72\u680f\u7684\u5782\u76f4\u5fae\u8c03",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "9px",
  },
  {
    name: "--battle-action-menu-width",
    label: "\u884c\u52a8\u83dc\u5355 width",
    description: "\u884c\u52a8\u83dc\u5355\u5f39\u51fa\u5c42\u7684\u5bbd\u5ea6",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "29.75%",
  },
  {
    name: "--battle-action-menu-height",
    label: "\u884c\u52a8\u83dc\u5355 height",
    description: "\u884c\u52a8\u83dc\u5355\u5f39\u51fa\u5c42\u7684\u9ad8\u5ea6",
    section: "\u5e95\u90e8\u90e8\u7f72",
    defaultValue: "26.85%",
  },
];

export type BattleUiEditorVariableName =
  (typeof battleUiEditorVariableDefinitions)[number]["name"];

export type BattleUiEditorValues = Record<BattleUiEditorVariableName, string>;

export function createDefaultBattleUiEditorValues(): BattleUiEditorValues {
  return Object.fromEntries(
    battleUiEditorVariableDefinitions.map((definition) => [
      definition.name,
      definition.defaultValue,
    ])
  ) as BattleUiEditorValues;
}
