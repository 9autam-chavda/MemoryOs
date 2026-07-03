const test = require('node:test');
const assert = require('node:assert/strict');
const cosineSimilarity = require('../src/utils/cosineSimilarity');

test('returns 1 for identical vectors', () => {
  assert.equal(cosineSimilarity([1, 2, 3], [1, 2, 3]), 1);
});

test('returns 0 for empty or invalid vectors', () => {
  assert.equal(cosineSimilarity([], [1, 2]), 0);
  assert.equal(cosineSimilarity([1, 2], null), 0);
  assert.equal(cosineSimilarity([1, 2], [0, 0]), 0);
});

test('handles vectors of different lengths', () => {
  assert.equal(cosineSimilarity([1, 0, 1], [1, 0]), 1);
});
