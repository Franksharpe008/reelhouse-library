import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { catalogSeed } from '../src/lib/catalog-data.ts';
test('every catalog entry has a bundled cover and a public MP4 source rather than a short promo clip',()=>{
 assert.equal(catalogSeed.length,30);assert.equal(new Set(catalogSeed.map(x=>x.slug)).size,30);
 for(const item of catalogSeed){
  assert.ok(item.posterUrl.startsWith('/posters/'));const cover=new URL('../public'+item.posterUrl,import.meta.url);assert.ok(existsSync(cover),item.slug);assert.ok(statSync(cover).size>1000,item.slug);
  const source=new URL(item.mediaUrl);assert.equal(source.hostname,'archive.org');assert.ok(source.pathname.startsWith('/download/'+item.archiveId+'/'));assert.ok(source.pathname.endsWith('.mp4'));assert.ok(item.durationSeconds>(item.format==='Serial'?1100:1800),item.slug);
 }
});
