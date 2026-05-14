import fs from 'node:fs';
import path from 'node:path';

const VIDEO = 'rZPMtMG7mE0';

// Step 1: fetch the watch page to extract caption tracks
const watchUrl = `https://www.youtube.com/watch?v=${VIDEO}`;
const watchHtml = await fetch(watchUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' },
}).then((r) => r.text());

const m = watchHtml.match(/"captionTracks":(\[[^\]]+\])/);
if (!m) {
  console.error('No captionTracks found');
  process.exit(1);
}
const tracks = JSON.parse(m[1]);
console.log('Tracks:', tracks.map((t) => ({ lang: t.languageCode, name: t.name?.simpleText, kind: t.kind })));

// Step 2: pick a base track and request English auto-translation via tlang
const base = tracks[0];
const baseUrl = base.baseUrl + '&tlang=en&fmt=json3';
const json = await fetch(baseUrl).then((r) => r.json());

const events = (json.events || []).filter((e) => e.segs);
const lines = events.map((e) => ({
  text: e.segs.map((s) => s.utf8).join('').trim(),
  offset: e.tStartMs,
  duration: e.dDurationMs,
}));

const out = path.resolve('src/data/transcript.en.json');
fs.writeFileSync(out, JSON.stringify(lines, null, 2), 'utf8');
console.log('Wrote', lines.length, 'translated lines to', out);
console.log('Sample:', lines.slice(0, 3));
