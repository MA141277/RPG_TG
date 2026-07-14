const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`Missing signature: ${signature}`);
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function stripTypeScriptSyntax(body) {
  return body
    .replace("const frameTimes: number[] = [];", "const frameTimes = [];")
    .replace("push(timestampMs: number)", "push(timestampMs)");
}

function loadCampaignFpsFns() {
  const source = fs.readFileSync("src/ui/views/map/campaign-terrain-webgl.ts", "utf8");
  const formatBody = stripTypeScriptSyntax(
    extractFunctionBody(source, "export function formatCampaignFpsReadout("),
  );
  const samplerBody = stripTypeScriptSyntax(
    extractFunctionBody(source, "export function createCampaignFpsSampler(windowMs = 500)"),
  );
  const formatCampaignFpsReadout = new Function(
    `return function formatCampaignFpsReadout(fpsValue) {${formatBody}};`,
  )();
  const createCampaignFpsSampler = new Function(
    `return function createCampaignFpsSampler(windowMs = 500) {${samplerBody}};`,
  )();
  return { formatCampaignFpsReadout, createCampaignFpsSampler };
}

test("campaign FPS readout formats integers for the map HUD", () => {
  const { formatCampaignFpsReadout } = loadCampaignFpsFns();
  assert.equal(formatCampaignFpsReadout(47.2), "FPS: 47");
  assert.equal(formatCampaignFpsReadout(undefined), "FPS: 0");
});

test("campaign FPS sampler keeps a safe last value with sparse timestamps", () => {
  const { createCampaignFpsSampler } = loadCampaignFpsFns();
  const sampler = createCampaignFpsSampler(500);
  assert.equal(sampler.current(), 0);
  sampler.push(100);
  sampler.push(116);
  sampler.push(132);
  assert.equal(sampler.current() > 0, true);
});
