const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getCompactCityDisplayName,
} = require("../.test-dist/shared/city-display-name.js");

test("getCompactCityDisplayName keeps the final city name after legacy markers", () => {
  assert.equal(getCompactCityDisplayName("庐州路※合肥"), "合肥");
  assert.equal(getCompactCityDisplayName("汴梁路★开封"), "开封");
  assert.equal(getCompactCityDisplayName("延安路●绥德州"), "绥德州");
});

test("getCompactCityDisplayName strips legacy route and prefecture suffixes", () => {
  assert.equal(getCompactCityDisplayName("庐州路"), "庐州");
  assert.equal(getCompactCityDisplayName("高邮府"), "高邮");
  assert.equal(getCompactCityDisplayName("濠州"), "濠州");
});

test("getCompactCityDisplayName unwraps bracketed labels", () => {
  assert.equal(getCompactCityDisplayName("【濠州】"), "濠州");
});
