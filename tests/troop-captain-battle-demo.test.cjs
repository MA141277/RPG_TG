const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadCaptainBridge() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const body = extractFunctionBody(source, "function getFormationCaptainMember(unit)");
  const getFormationCaptainMember = new Function(
    `return function getFormationCaptainMember(unit) {${body}};`
  )();
  return { source, getFormationCaptainMember };
}

test("battle demo resolves captain from explicit member id first and middle-center second", () => {
  const { getFormationCaptainMember } = loadCaptainBridge();

  assert.equal(
    getFormationCaptainMember({
      captainMemberId: "member.right",
      formationMembers: [
        { id: "member.center", slot: "middle-center", name: "中军" },
        { id: "member.right", slot: "middle-right", name: "右翼" },
      ],
    })?.name,
    "右翼"
  );

  assert.equal(
    getFormationCaptainMember({
      formationMembers: [{ id: "member.center", slot: "middle-center", name: "中军" }],
    })?.name,
    "中军"
  );
});

test("battle demo source renders captain text and L badge in the left-side detail panel", () => {
  const { source } = loadCaptainBridge();
  assert.match(source, /队长/);
  assert.match(source, /formation-slot__captain-badge/);
  assert.match(source, /getFormationCaptainMember\(unit\)/);
});
