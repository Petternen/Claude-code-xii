/* Kjerne: lagring, translitterasjon, svar-matching, XP/nivå/streak, merker, SRS og lyd. */
window.RP = window.RP || {};

/* ---------- Hjelpere ---------- */
RP.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
RP.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
RP.today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
RP.dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
RP.lesson = id => RP.LESSONS.find(l => l.id === +id);

/* ---------- Translitterasjon ---------- */
const TL = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: "'", э: 'e', ю: 'yu', я: 'ya' };
RP.translit = s => String(s).split('').map(ch => {
  const lo = ch.toLowerCase(); const t = TL[lo];
  if (t === undefined) return ch;
  return ch !== lo && t ? t[0].toUpperCase() + t.slice(1) : t;
}).join('');

/* Normaliserer til sammenlignbar latinsk form, slik at både kyrillisk og latinsk input fungerer. */
RP.normalize = s => {
  let t = String(s).toLowerCase().replace(/ё/g, 'е').replace(/[-–—]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
  t = RP.translit(t).replace(/'/g, '');
  // Norske skrivemåter av translitterasjon → standard
  return t.replace(/tsj/g, 'ch').replace(/sj/g, 'sh').replace(/zj/g, 'zh')
    .replace(/j/g, 'y').replace(/x/g, 'kh').replace(/w/g, 'v').replace(/kkh/g, 'kh');
};

RP.lev = (a, b) => {
  if (a === b) return 0;
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
};
RP.similarity = (a, b) => { a = RP.normalize(a); b = RP.normalize(b); const L = Math.max(a.length, b.length); return L ? 1 - RP.lev(a, b) / L : 1; };

/* Vurderer et svar i rollespill. Returnerer {pass, score}. */
RP.judge = (inputs, step) => {
  let best = { pass: false, score: 0, text: inputs[0] || '' };
  for (const raw of inputs) {
    const n = ' ' + RP.normalize(raw) + ' ';
    let score = 0, pass = false;
    for (const ok of step.ok || []) {
      const s = RP.similarity(raw, ok); score = Math.max(score, s);
      if (s >= 0.75 || n.includes(' ' + RP.normalize(ok) + ' ')) pass = true;
    }
    if ((step.any || []).some(w => n.includes(' ' + RP.normalize(w) + ' '))) { pass = true; score = Math.max(score, 0.9); }
    if (step.dig && /\d/.test(raw)) { pass = true; score = Math.max(score, 0.9); }
    if (pass) score = Math.max(score, 0.8);
    if (pass > best.pass || (pass === best.pass && score > best.score)) best = { pass, score, text: raw };
  }
  return best;
};

/* ---------- Tilstand / lagring ---------- */
const KEY = 'govorushka_v1';
const DEFAULT = () => ({
  xp: 0, daily: { date: RP.today(), xp: 0 }, streak: { count: 0, last: null }, dailyGoal: 50,
  lessons: {}, srs: {}, badges: {},
  stats: { roleplays: 0, perfect: 0, reviews: 0, goodSpeech: 0, quizCorrect: 0 },
  settings: { rate: 0.9, translit: true, translation: true, sound: true, unlockAll: false }
});
RP.load = () => {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* privat modus e.l. */ }
  const d = DEFAULT();
  RP.state = s ? { ...d, ...s, stats: { ...d.stats, ...s.stats }, settings: { ...d.settings, ...s.settings } } : d;
  if (RP.state.daily.date !== RP.today()) RP.state.daily = { date: RP.today(), xp: 0 };
};
RP.save = () => { try { localStorage.setItem(KEY, JSON.stringify(RP.state)); } catch (e) { } };
RP.reset = () => { RP.state = DEFAULT(); RP.save(); };

/* ---------- Nivåer ---------- */
RP.TITLES = ['Новичок · Nybegynner', 'Турист · Turist', 'Путник · Vandrer', 'Странник · Eventyrer', 'Знаток · Kjenner',
  'Богатырь · Kjempe', 'Мастер · Mester', 'Мудрец · Vismann', 'Царь · Tsar', 'Жар-птица · Ildfuglen'];
RP.levelInfo = (xp = RP.state.xp) => {
  let lvl = 1, need = 100, base = 0;
  while (xp >= base + need) { base += need; lvl++; need = 100 + 50 * (lvl - 1); }
  return { lvl, into: xp - base, need, pct: (xp - base) / need, title: RP.TITLES[Math.min(lvl - 1, RP.TITLES.length - 1)] };
};

RP.addXP = (n, label) => {
  if (!n) return;
  const s = RP.state, before = RP.levelInfo().lvl;
  if (s.daily.date !== RP.today()) s.daily = { date: RP.today(), xp: 0 };
  const wasBelow = s.daily.xp < s.dailyGoal;
  s.xp += n; s.daily.xp += n;
  // Streak teller når dagen har fått XP
  const t = RP.today();
  if (s.streak.last !== t) {
    s.streak.count = s.streak.last && RP.dayDiff(s.streak.last, t) === 1 ? s.streak.count + 1 : 1;
    s.streak.last = t;
  }
  RP.save();
  RP.ui && RP.ui.toastXP(n, label);
  if (wasBelow && s.daily.xp >= s.dailyGoal) RP.ui && RP.ui.toast('🎯 Dagens mål nådd!', 'gold');
  const after = RP.levelInfo().lvl;
  if (after > before) { RP.sfx('level'); RP.ui && RP.ui.levelUp(after); }
  RP.checkBadges();
  RP.ui && RP.ui.renderTopbar();
};
RP.streakAlive = () => { const s = RP.state.streak; return s.last && RP.dayDiff(s.last, RP.today()) <= 1 ? s.count : 0; };

/* ---------- Leksjonsfremdrift ---------- */
RP.SECTIONS = [
  { id: 'dialog', no: 'Dialog', icon: '🎧' }, { id: 'vocab', no: 'Ord', icon: '📜' },
  { id: 'grammar', no: 'Grammatikk', icon: '📖' }, { id: 'quiz', no: 'Quiz', icon: '⚔️' },
  { id: 'roleplay', no: 'Samtale', icon: '🗣️' }
];
RP.prog = id => (RP.state.lessons[id] = RP.state.lessons[id] || { done: {}, stars: 0, best: 0 });
RP.isComplete = id => { const p = RP.state.lessons[id]; return !!(p && p.done.quiz && p.done.roleplay); };
RP.isUnlocked = id => RP.state.settings.unlockAll || id === 1 || RP.isComplete(id - 1);
RP.markSection = (id, sec, xp) => {
  const p = RP.prog(id), first = !p.done[sec], wasComplete = RP.isComplete(id);
  p.done[sec] = true; RP.save();
  if (first && xp) RP.addXP(xp, RP.SECTIONS.find(s => s.id === sec).no);
  if (!wasComplete && RP.isComplete(id)) {
    RP.addXP(50, 'Leksjon fullført');
    RP.sfx('level');
    RP.ui && RP.ui.toast(`🏅 «${RP.lesson(id).ru}» fullført!` + (id < 20 ? ' Neste sted er låst opp.' : ''), 'gold');
  }
};

/* ---------- Merker ---------- */
const regionDone = r => { for (let i = r.from; i <= r.to; i++) if (!RP.isComplete(i)) return false; return true; };
RP.BADGES = [
  { id: 'first', icon: '🥾', no: 'Første skritt', d: 'Fullfør din første leksjon', test: () => RP.isComplete(1) || Object.keys(RP.state.lessons).some(RP.isComplete) },
  { id: 'moskva', icon: '🏰', no: 'Moskvas venn', d: 'Fullfør alle leksjoner i Moskva', test: () => regionDone(RP.REGIONS[0]) },
  { id: 'ring', icon: '💍', no: 'Den gylne ring', d: 'Fullfør Den gylne ring', test: () => regionDone(RP.REGIONS[1]) },
  { id: 'spb', icon: '⚓', no: 'Petersburger', d: 'Fullfør St. Petersburg', test: () => regionDone(RP.REGIONS[2]) },
  { id: 'baikal', icon: '🦭', no: 'Bajkal-mester', d: 'Fullfør hele kurset', test: () => regionDone(RP.REGIONS[3]) },
  { id: 'streak3', icon: '🔥', no: 'Ild i ovnen', d: '3 dagers streak', test: () => RP.streakAlive() >= 3 },
  { id: 'streak7', icon: '🐻', no: 'Bjørnestyrke', d: '7 dagers streak', test: () => RP.streakAlive() >= 7 },
  { id: 'streak30', icon: '❄️', no: 'Sibirsk utholdenhet', d: '30 dagers streak', test: () => RP.streakAlive() >= 30 },
  { id: 'perfect', icon: '💎', no: 'Feilfri', d: '100 % på en quiz', test: () => RP.state.stats.perfect >= 1 },
  { id: 'talker', icon: '🗣️', no: 'Pratmaker', d: 'Fullfør 10 samtaler', test: () => RP.state.stats.roleplays >= 10 },
  { id: 'words50', icon: '📚', no: 'Ordsamler', d: '50 ord i repetisjonsbunken', test: () => Object.keys(RP.state.srs).length >= 50 },
  { id: 'reviewer', icon: '🧠', no: 'Hukommelsesmester', d: '100 repetisjoner', test: () => RP.state.stats.reviews >= 100 },
  { id: 'voice', icon: '🎤', no: 'Gullstrupe', d: '20 uttalelser med ≥ 80 %', test: () => RP.state.stats.goodSpeech >= 20 },
  { id: 'lvl5', icon: '⚔️', no: 'Bogatyr', d: 'Nå nivå 6', test: () => RP.levelInfo().lvl >= 6 }
];
RP.checkBadges = () => {
  for (const b of RP.BADGES) if (!RP.state.badges[b.id] && b.test()) {
    RP.state.badges[b.id] = RP.today(); RP.save();
    RP.sfx('badge'); RP.ui && RP.ui.toast(`${b.icon} Nytt merke: ${b.no}`, 'gold');
  }
};

/* ---------- SRS (forenklet SM-2) ---------- */
RP.srsAdd = (lessonId, words) => {
  for (const [ru, no] of words) if (!RP.state.srs[ru]) RP.state.srs[ru] = { no, l: lessonId, due: Date.now(), ivl: 0, ef: 2.5, reps: 0 };
  RP.save(); RP.checkBadges();
};
RP.srsDue = () => Object.entries(RP.state.srs).filter(([, c]) => c.due <= Date.now()).map(([ru, c]) => ({ ru, ...c }));
RP.srsGrade = (ru, g) => { // g: 1 igjen, 2 vanskelig, 3 bra, 4 lett
  const c = RP.state.srs[ru]; if (!c) return;
  const day = 86400000;
  if (g === 1) { c.reps = 0; c.ivl = 0; c.ef = Math.max(1.3, c.ef - 0.2); c.due = Date.now() + 60000; }
  else {
    c.reps++;
    c.ivl = c.reps === 1 ? (g === 4 ? 3 : 1) : c.reps === 2 ? (g === 4 ? 6 : 3) : Math.round(c.ivl * c.ef * (g === 2 ? 0.6 : g === 4 ? 1.3 : 1));
    c.ef = Math.max(1.3, c.ef + (g === 2 ? -0.15 : g === 4 ? 0.15 : 0));
    c.due = Date.now() + c.ivl * day;
  }
  RP.state.stats.reviews++; RP.save();
};

/* ---------- Lydeffekter (WebAudio) ---------- */
let actx;
RP.sfx = type => {
  if (!RP.state.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { ok: [[660, .08], [880, .12]], bad: [[220, .18]], level: [[523, .1], [659, .1], [784, .1], [1047, .25]], badge: [[784, .1], [988, .1], [1319, .2]], click: [[440, .04]] }[type] || [];
    let t = actx.currentTime;
    for (const [f, d] of seq) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.9;
    }
  } catch (e) { }
};
