/* Skriver all russisk tekst i kurset (leksjoner, samtaler, lesetekster, avis, alfabet) og kursets egne
   ordpar (russisk → norsk) som JSON. Brukes av tools/build-dictionary.py.
   Kjør: node tools/corpus.js > /tmp/corpus.json */
const vm = require('vm'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => { } }, document: { addEventListener() { } } };
vm.createContext(ctx);
for (const f of ['js/data/lessons.js', 'js/data/lessons-b1.js', 'js/data/readings.js', 'js/data/news.js', 'js/core.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8').replace(/^window\.RP = window\.RP \|\| \{\};/m, 'window.RP = window.RP || {}; var RP = window.RP;'), ctx);
const RP = ctx.window.RP;
const texts = [];
const walk = v => {
  if (typeof v === 'string') { if (/[а-яё]/i.test(v)) texts.push(RP.unstress(v)); }
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
walk(RP.LESSONS); walk(RP.READINGS || []); walk(RP.NEWS || []); walk(RP.ALPHABET);
const pairs = [];
RP.LESSONS.forEach(L => L.vocab.forEach(([ru, no]) => pairs.push([RP.unstress(ru), no])));
process.stdout.write(JSON.stringify({ texts, pairs }));
