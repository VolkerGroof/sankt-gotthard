import fs from 'node:fs';
import path from 'node:path';

const TOTAL_S = 1099; // total spoken duration

function build(locale) {
  const srcPath = path.resolve(`src/data/transcript.${locale}.json`);
  const outPath = path.resolve(`src/data/transcript.${locale}.timed.json`);
  const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

  const sentences = [];
  for (const para of src.paragraphs) {
    const parts = para
      .replace(/\s+/g, ' ')
      .trim()
      .split(/(?<=[\.\?\!—])\s+(?=[A-ZÄÖÜ“„"])/g)
      .filter(Boolean);
    for (const p of parts) sentences.push(p.trim());
  }

  const totalChars = sentences.reduce((a, s) => a + s.length, 0);
  let cum = 0;
  const timed = sentences.map((s) => {
    const start = (cum / totalChars) * TOTAL_S;
    cum += s.length;
    const end = (cum / totalChars) * TOTAL_S;
    return {
      text: s,
      start: Math.round(start * 100) / 100,
      end: Math.round(end * 100) / 100,
    };
  });

  const out = {
    source: src.source,
    speaker: src.speaker,
    title: src.title,
    note: src.note,
    totalSeconds: TOTAL_S,
    sentences: timed,
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`[${locale}] sentences: ${timed.length}, chars: ${totalChars}`);
}

for (const locale of ['en', 'de']) build(locale);
