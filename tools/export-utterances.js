/* Eksporterer alle russiske replikker, ord og lesetekstsetninger fra kurset til JSON,
   med lydnøkkel (RP.audioKey) og hvem som snakker. Brukes av tools/generate-voices.py.
   Kjør: node tools/export-utterances.js > tools/utterances.json */
const vm = require('vm'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => { } }, document: { addEventListener() { } } };
vm.createContext(ctx);
for (const f of ['js/data/lessons.js', 'js/data/lessons-b1.js', 'js/data/readings.js', 'js/core.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8').replace(/^window\.RP = window\.RP \|\| \{\};/m, 'window.RP = window.RP || {}; var RP = window.RP;'), ctx);
const RP = ctx.window.RP;

const out = [], seen = new Set();
const add = (text, who, where) => {
  const k = RP.audioKey(text), clean = RP.unstress(text).trim();
  if (seen.has(k) || !RP.normalize(clean)) return;
  seen.add(k); out.push({ k, text: clean, who: who || 'Диктор', where });
};
for (const L of RP.LESSONS) {
  L.dialog.forEach(([who, ru]) => add(ru, who, `L${L.id} dialog`));
  L.rp.steps.forEach(s => add(s.b, L.rp.bot, `L${L.id} samtale`));
}
// Ord, modellsvar og lesetekster leses av en nøytral fortellerstemme
for (const L of RP.LESSONS) {
  L.vocab.forEach(([ru]) => add(ru, 'Диктор', `L${L.id} ord`));
  L.rp.steps.forEach(s => add(s.m, 'Диктор', `L${L.id} fasit`));
}
(RP.READINGS || []).forEach(r => r.text.forEach(([ru]) => add(ru, 'Диктор', r.id)));
RP.ALPHABET.forEach(a => add(a[3], 'Диктор', 'alfabet'));
process.stdout.write(JSON.stringify({ gender: RP.GENDER, items: out }, null, 1));
