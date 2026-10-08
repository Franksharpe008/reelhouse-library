import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readWatchlist, toggleWatchlist } from '../src/lib/watchlist.ts';

function storage(value = null) {
  return { value, getItem() { return this.value; }, setItem(key, next) { this.value = next; } };
}
test('adding and removing preserves the other saved titles', () => {
  const store = storage('["his-girl-friday"]');
  assert.deepEqual(toggleWatchlist(store, 'night-of-the-living-dead'), ['his-girl-friday', 'night-of-the-living-dead']);
  assert.deepEqual(toggleWatchlist(store, 'night-of-the-living-dead'), ['his-girl-friday']);
  assert.deepEqual(readWatchlist(store), ['his-girl-friday']);
});
test('failed writes never report a successful save', () => {
  const store = storage('[]');
  store.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => toggleWatchlist(store, 'metropolis'), /Quota/);
  assert.equal(store.value, '[]');
});
test('corrupt values are not overwritten or treated as saved titles', () => {
  for (const raw of ['{}', '[1]', 'broken JSON']) {
    const store = storage(raw);
    assert.throws(() => toggleWatchlist(store, 'metropolis'));
    assert.equal(store.value, raw);
  }
});
