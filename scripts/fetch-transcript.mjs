import { YoutubeTranscript } from 'youtube-transcript';
import fs from 'node:fs';
import path from 'node:path';

const VIDEO = 'rZPMtMG7mE0';
const tryLangs = ['en', 'en-US', 'en-GB', undefined];

let lines = null;
let usedLang = null;
let lastErr = null;
for (const lang of tryLangs) {
  try {
    const opts = lang ? { lang } : {};
    lines = await YoutubeTranscript.fetchTranscript(VIDEO, opts);
    usedLang = lang ?? '(default)';
    break;
  } catch (e) {
    lastErr = e;
  }
}

if (!lines) {
  console.error('Failed:', lastErr?.message);
  process.exit(1);
}

const out = path.resolve('src/data/transcript.en.json');
console.log('Lang:', usedLang, '| Lines:', lines.length);
fs.writeFileSync(out, JSON.stringify(lines, null, 2), 'utf8');
console.log('Wrote', out);
