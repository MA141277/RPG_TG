import "../../../styles/app.css";
import { createStandaloneScriptEditorHost } from "./script-editor-standalone-host";

const mountPoint = document.getElementById("app");

if (mountPoint == null) {
  throw new Error("Standalone script editor mount point is missing.");
}

createStandaloneScriptEditorHost(mountPoint).mount();
