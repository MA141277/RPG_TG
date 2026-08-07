const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("script editor host contract uses injected previewHost templateCatalog and publicationCatalog fields", () => {
  const source = readSource("src/modules/script-editor/host/script-editor-host.ts");

  assert.match(source, /previewHost\?: ScriptEditorPreviewHost/);
  assert.match(source, /templateCatalog\?: ScriptEditorTemplateCatalog/);
  assert.match(source, /publicationCatalog\?: ScriptEditorPublicationCatalog/);
  assert.doesNotMatch(source, /previewRuntime/);
});

test("runtime person attribute support imports the neutral contract instead of modules script editor", () => {
  const source = readSource("src/application/character/person-attribute-runtime.ts");

  assert.match(source, /core\/contracts\/script-editor-person-attributes/);
  assert.doesNotMatch(source, /modules\/script-editor/);
});

test("neutral script editor person attribute contract file exists under core contracts", () => {
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/core/contracts/script-editor-person-attributes.ts"
      )
    ),
    true
  );
});

test("script editor playable authoring and export use a package-local playable catalog seam", () => {
  const menuAuthoringSource = readSource(
    "src/modules/script-editor/application/menu-authoring.ts"
  );
  const minigameBindingSource = readSource(
    "src/modules/script-editor/application/minigame-binding-authoring.ts"
  );
  const runtimePackExportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-export.ts"
  );

  assert.doesNotMatch(
    menuAuthoringSource,
    /core\/registry\/builtin-playable-definition-registry/
  );
  assert.doesNotMatch(
    menuAuthoringSource,
    /core\/registry\/builtin-playable-integration-registry/
  );
  assert.doesNotMatch(
    minigameBindingSource,
    /core\/registry\/builtin-playable-definition-registry/
  );
  assert.doesNotMatch(
    minigameBindingSource,
    /core\/registry\/builtin-playable-integration-registry/
  );
  assert.doesNotMatch(
    minigameBindingSource,
    /core\/registry\/builtin-playable-shell-registry/
  );
  assert.doesNotMatch(
    runtimePackExportSource,
    /core\/registry\/builtin-playable-definition-registry/
  );
  assert.match(menuAuthoringSource, /script-editor-playable-catalog/);
  assert.match(minigameBindingSource, /script-editor-playable-catalog/);
  assert.match(runtimePackExportSource, /script-editor-playable-catalog/);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/host/script-editor-playable-catalog.ts"
      )
    ),
    true
  );
});

test("script editor runtime pack export uses a package-local event-binding seam", () => {
  const runtimePackExportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-export.ts"
  );

  assert.doesNotMatch(
    runtimePackExportSource,
    /core\/runtime\/event-binding-contract/
  );
  assert.match(
    runtimePackExportSource,
    /script-editor-event-binding-contract/
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/application/script-editor-event-binding-contract.ts"
      )
    ),
    true
  );
});

test("script editor playable runtime contract is consumed through a package-local seam", () => {
  const runtimePackExportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-export.ts"
  );
  const runtimePackImportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-import.ts"
  );
  const playableCatalogSource = readSource(
    "src/modules/script-editor/host/script-editor-playable-catalog.ts"
  );

  assert.doesNotMatch(
    runtimePackExportSource,
    /core\/contracts\/playable-runtime/
  );
  assert.doesNotMatch(
    runtimePackImportSource,
    /core\/contracts\/playable-runtime/
  );
  assert.doesNotMatch(
    playableCatalogSource,
    /core\/contracts\/playable-runtime/
  );
  assert.match(
    runtimePackExportSource,
    /script-editor-playable-runtime-contract/
  );
  assert.match(
    runtimePackImportSource,
    /script-editor-playable-runtime-contract/
  );
  assert.match(
    playableCatalogSource,
    /script-editor-playable-runtime-contract/
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/application/script-editor-playable-runtime-contract.ts"
      )
    ),
    true
  );
});

test("script editor runtime-result contract is consumed through a package-local seam", () => {
  const runtimePackExportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-export.ts"
  );
  const storyDialogueAuthoringSource = readSource(
    "src/modules/script-editor/application/story-dialogue-event-authoring.ts"
  );
  const projectDomainSource = readSource(
    "src/modules/script-editor/domain/script-editor-project.ts"
  );

  assert.doesNotMatch(
    runtimePackExportSource,
    /core\/contracts\/runtime-result/
  );
  assert.doesNotMatch(
    storyDialogueAuthoringSource,
    /core\/contracts\/runtime-result/
  );
  assert.doesNotMatch(
    projectDomainSource,
    /core\/contracts\/runtime-result/
  );
  assert.match(
    runtimePackExportSource,
    /script-editor-runtime-result-contract/
  );
  assert.match(
    storyDialogueAuthoringSource,
    /script-editor-runtime-result-contract/
  );
  assert.match(
    projectDomainSource,
    /script-editor-runtime-result-contract/
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/domain/script-editor-runtime-result-contract.ts"
      )
    ),
    true
  );
});

test("script editor domain contracts consume progression and person-attribute contracts through package-local seams", () => {
  const projectDomainSource = readSource(
    "src/modules/script-editor/domain/script-editor-project.ts"
  );
  const scriptEditorIndexSource = readSource("src/modules/script-editor/index.ts");

  assert.doesNotMatch(
    projectDomainSource,
    /core\/contracts\/progression-runtime/
  );
  assert.doesNotMatch(
    projectDomainSource,
    /core\/contracts\/script-editor-person-attributes/
  );
  assert.doesNotMatch(
    scriptEditorIndexSource,
    /core\/contracts\/script-editor-person-attributes/
  );
  assert.match(
    projectDomainSource,
    /script-editor-progression-runtime-contract/
  );
  assert.match(
    projectDomainSource,
    /script-editor-person-attribute-contract/
  );
  assert.match(
    scriptEditorIndexSource,
    /script-editor-person-attribute-contract/
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/domain/script-editor-progression-runtime-contract.ts"
      )
    ),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/domain/script-editor-person-attribute-contract.ts"
      )
    ),
    true
  );
});

test("script editor shared rule compiler consumes effect and task contracts through a package-local seam", () => {
  const sharedRuleCompilerSource = readSource(
    "src/modules/script-editor/application/shared-rule-compiler.ts"
  );

  assert.doesNotMatch(sharedRuleCompilerSource, /core\/contracts\/effect/);
  assert.doesNotMatch(sharedRuleCompilerSource, /core\/contracts\/task-runtime/);
  assert.match(
    sharedRuleCompilerSource,
    /script-editor-shared-rule-contract/
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/application/script-editor-shared-rule-contract.ts"
      )
    ),
    true
  );
});

test("script editor runtime import-export consumes scenario dialogue event flow and content contracts through package-local seams", () => {
  const runtimePackExportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-export.ts"
  );
  const runtimePackImportSource = readSource(
    "src/modules/script-editor/application/runtime-pack-import.ts"
  );
  const dialogueMaterializerSource = readSource(
    "src/modules/script-editor/application/dialogue-story-runtime-materializer.ts"
  );

  for (const source of [
    runtimePackExportSource,
    runtimePackImportSource,
    dialogueMaterializerSource,
  ]) {
    assert.doesNotMatch(source, /domain\/dialogue/);
    assert.doesNotMatch(source, /domain\/event/);
  }
  assert.doesNotMatch(runtimePackExportSource, /domain\/scenario-profile/);
  assert.doesNotMatch(runtimePackExportSource, /domain\/content-pack/);
  assert.doesNotMatch(runtimePackExportSource, /domain\/playables\/flow/);
  assert.doesNotMatch(runtimePackExportSource, /domain\/game-state/);
  assert.doesNotMatch(runtimePackImportSource, /domain\/content-pack/);
  assert.doesNotMatch(runtimePackImportSource, /domain\/location-access/);

  assert.match(runtimePackExportSource, /script-editor-dialogue-contract/);
  assert.match(runtimePackExportSource, /script-editor-event-contract/);
  assert.match(runtimePackExportSource, /script-editor-flow-contract/);
  assert.match(runtimePackExportSource, /script-editor-scenario-profile-contract/);
  assert.match(runtimePackExportSource, /script-editor-content-pack-contract/);
  assert.match(runtimePackExportSource, /script-editor-game-state-contract/);
  assert.match(runtimePackImportSource, /script-editor-event-contract/);
  assert.match(runtimePackImportSource, /script-editor-location-access-contract/);
  assert.match(runtimePackImportSource, /script-editor-content-pack-contract/);
  assert.match(dialogueMaterializerSource, /script-editor-dialogue-contract/);

  for (const file of [
    "src/modules/script-editor/domain/script-editor-dialogue-contract.ts",
    "src/modules/script-editor/domain/script-editor-event-contract.ts",
    "src/modules/script-editor/domain/script-editor-flow-contract.ts",
    "src/modules/script-editor/domain/script-editor-location-access-contract.ts",
    "src/modules/script-editor/application/script-editor-scenario-profile-contract.ts",
    "src/modules/script-editor/application/script-editor-content-pack-contract.ts",
    "src/modules/script-editor/application/script-editor-game-state-contract.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(process.cwd(), file)), true);
  }
});

test("script editor domain and authoring consume menu location-access dialogue and event contracts through package-local seams", () => {
  const projectDomainSource = readSource(
    "src/modules/script-editor/domain/script-editor-project.ts"
  );
  const storyDialogueAuthoringSource = readSource(
    "src/modules/script-editor/application/story-dialogue-event-authoring.ts"
  );
  const menuAuthoringSource = readSource(
    "src/modules/script-editor/application/menu-authoring.ts"
  );
  const locationAccessAuthoringSource = readSource(
    "src/modules/script-editor/application/location-access-authoring.ts"
  );

  for (const source of [
    projectDomainSource,
    storyDialogueAuthoringSource,
    menuAuthoringSource,
    locationAccessAuthoringSource,
  ]) {
    assert.doesNotMatch(source, /domain\/dialogue/);
    assert.doesNotMatch(source, /domain\/event/);
  }
  assert.doesNotMatch(projectDomainSource, /domain\/menu/);
  assert.doesNotMatch(projectDomainSource, /domain\/location-access/);
  assert.doesNotMatch(projectDomainSource, /domain\/playables\/flow/);
  assert.doesNotMatch(menuAuthoringSource, /domain\/menu/);
  assert.doesNotMatch(locationAccessAuthoringSource, /domain\/location-access/);

  assert.match(projectDomainSource, /script-editor-dialogue-contract/);
  assert.match(projectDomainSource, /script-editor-event-contract/);
  assert.match(projectDomainSource, /script-editor-menu-contract/);
  assert.match(projectDomainSource, /script-editor-location-access-contract/);
  assert.match(projectDomainSource, /script-editor-flow-contract/);
  assert.match(storyDialogueAuthoringSource, /script-editor-dialogue-contract/);
  assert.match(storyDialogueAuthoringSource, /script-editor-event-contract/);
  assert.match(menuAuthoringSource, /script-editor-menu-contract/);
  assert.match(locationAccessAuthoringSource, /script-editor-location-access-contract/);

  for (const file of [
    "src/modules/script-editor/domain/script-editor-menu-contract.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(process.cwd(), file)), true);
  }
});
