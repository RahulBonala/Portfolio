import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, 'api/_assets/playbook.pdf');

const b = readFileSync(file);
const s = b.toString('latin1');

const idx = s.indexOf('/Author (\\(anonymous\\))');
if (idx === -1) {
  console.log('set-pdf-metadata: /Author (\\(anonymous\\)) not found. Already patched or missing?');
  process.exit(0);
}

const endIdx = s.indexOf('>>', idx);
if (endIdx === -1) {
  console.error('set-pdf-metadata: could not find end of dictionary');
  process.exit(1);
}

const orig = s.slice(idx, endIdx);

const creationDate = orig.match(/\/CreationDate \([^)]+\)/)?.[0] ?? '';
const modDate = orig.match(/\/ModDate \([^)]+\)/)?.[0] ?? '';
const producer = orig.match(/\/Producer \([^)]+\)\)/)?.[0] ?? '';
const suffix = ' \n  /Trapped /False\n';

if (!creationDate || !modDate || !producer) {
  console.error('set-pdf-metadata: could not extract dates/producer');
  process.exit(1);
}

const newFields = `/Author (Rahul Bonala) /Creator (Zero to Live) /Title (The AI Builder's Playbook) `;
const replacementContent = newFields + creationDate + ' ' + modDate + ' ' + producer + '\n  /Trapped /False\n';

// We need exactly orig.length bytes
if (replacementContent.length > orig.length) {
  console.error(`set-pdf-metadata: new dictionary too long (${replacementContent.length} > ${orig.length})`);
  process.exit(1);
}

const padded = replacementContent.padEnd(orig.length, ' ');

const newBuffer = Buffer.from(s.slice(0, idx) + padded + s.slice(endIdx), 'latin1');
if (newBuffer.length !== b.length) {
  console.error(`set-pdf-metadata: length mismatch! orig ${b.length}, new ${newBuffer.length}`);
  process.exit(1);
}

writeFileSync(file, newBuffer);
console.log('set-pdf-metadata: success, metadata patched.');
