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
  lessons: {}, srs: {}, badges: {}, readings: {}, kb: { best: 0, words: 0 },
  stats: { roleplays: 0, perfect: 0, reviews: 0, goodSpeech: 0, quizCorrect: 0, chats: 0 },
  settings: { rate: 0.9, translit: true, translation: true, sound: true, unlockAll: false, skin: 'rus', stress: true, voice: 'auto', silent: false, silentUntil: 0 }
});
RP.load = () => {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* privat modus e.l. */ }
  const d = DEFAULT();
  RP.state = s ? { ...d, ...s, stats: { ...d.stats, ...s.stats }, settings: { ...d.settings, ...s.settings }, kb: { ...d.kb, ...s.kb }, readings: { ...s.readings } } : d;
  if (RP.state.daily.date !== RP.today()) RP.state.daily = { date: RP.today(), xp: 0 };
};
RP.save = () => { try { localStorage.setItem(KEY, JSON.stringify(RP.state)); } catch (e) { } };
RP.reset = () => { RP.state = DEFAULT(); RP.save(); };

/* ---------- Nivåer ---------- */
/* ---------- Temaer (skins) ---------- */
RP.SKINS = {
  rus: {
    name: 'Russisk nasjonal', icon: '🪆', logo: 'Говорушка', sub: 'russisk på norsk', color: '#b3202a',
    hello: 'Добро пожаловать!', tagline: 'Reisen din gjennom Russland – fra Den røde plass til Bajkal.',
    desc: 'Trikolor, gull og folkekunst (khokhloma)',
    cheers: ['Отлично!', 'Молодец!', 'Правильно!', 'Здорово!'],
    titles: ['Новичок · Nybegynner', 'Турист · Turist', 'Путник · Vandrer', 'Странник · Eventyrer', 'Знаток · Kjenner',
      'Богатырь · Kjempe', 'Мастер · Mester', 'Мудрец · Vismann', 'Царь · Tsar', 'Жар-птица · Ildfuglen']
  },
  sov: {
    name: 'Sovjetisk brutalisme', icon: '☭', logo: 'ГОВОРУШКА', sub: 'folkets russiskkurs', color: '#1a1a1a',
    hello: 'Вперёд, товарищ!', tagline: 'Femårsplanen for russisk: fra Moskva til Bajkal. Oppfyll kvoten!',
    desc: 'Betong, konstruktivisme og røde stjerner',
    cheers: ['Ура!', 'Так держать!', 'Отлично, товарищ!', 'Молодец!'],
    titles: ['Октябрёнок · Oktobrist', 'Пионер · Pioner', 'Комсомолец · Komsomoler', 'Ударник · Sjokkarbeider',
      'Стахановец · Stakhanovist', 'Бригадир · Brigadeleder', 'Инженер · Ingeniør', 'Профессор · Professor',
      'Академик · Akademiker', 'Герой труда · Arbeidets helt']
  },
  leet: {
    name: 'Gamer 1337', icon: '🎮', logo: 'Г0В0РУШК4', sub: 'ru55i4n.exe', color: '#0a0a12',
    hello: 'Погнали!', tagline: '> Quest: Moskva → Bajkal. 20 levels. Ingen respawn-straff_',
    desc: 'Neon, pikselfont og CRT-scanlines',
    cheers: ['GG!', 'Изи!', 'Красава!', 'Имба!'],
    titles: ['Нуб · n00b', 'Казуал · Casual', 'Игрок · Gamer', 'Тащер · Carry', 'Про · Pro', 'Скиллер · Skilled',
      'Киберспортсмен · E-sportsutøver', 'Легенда · Legend', 'Чемпион · Champion', '1337 · Elite']
  }
};
/* Temaer basert på Hallmark (github.com/Nutlope/hallmark, MIT © Hallmark contributors).
   Fonter med latinsk-only brødtekst er byttet til tilsvarende fonter med kyrillisk. */
const HALLMARK_TITLES = RP.SKINS.rus.titles;
Object.assign(RP.SKINS, {
  werkstatt: {
    name: 'Werkstatt', icon: '📐', logo: 'Говорушка', sub: 'russisk på norsk', color: '#2b2622', hallmark: true,
    fonts: 'family=Jost:wght@500;700&family=Golos+Text:wght@400;600;700',
    hello: 'Урок начинается!', tagline: 'Verksted for russisk: ett grep om gangen, fra Moskva til Arktis.',
    desc: 'Hallmark · skole og verksted: putty, blekk og primærfarger',
    cheers: ['Верно!', 'Отлично!', 'Точно!', 'Молодец!'], titles: HALLMARK_TITLES
  },
  solstice: {
    name: 'Solstice', icon: '☀️', logo: 'Говорушка', sub: 'russisk på norsk', color: '#f3e6cf', hallmark: true,
    fonts: 'family=Yeseva+One&family=Golos+Text:wght@400;600;700',
    hello: 'Добрый день!', tagline: 'Et russisk år i leksjons-sesonger – fra vårens Moskva til polarnatten.',
    desc: 'Hallmark · krem, gull og en vermilion signalfarge',
    cheers: ['Прекрасно!', 'Чудесно!', 'Браво!', 'Верно!'], titles: HALLMARK_TITLES
  },
  garden: {
    name: 'Garden', icon: '🌿', logo: 'Говорушка', sub: 'russisk på norsk', color: '#203d2b', hallmark: true,
    fonts: 'family=Vollkorn:wght@500;600&family=Manrope:wght@400;600;700',
    hello: 'Здравствуйте!', tagline: 'La språket vokse: litt hver dag, i ditt eget tempo.',
    desc: 'Hallmark · havrepapir, dyp grønn og bladgrønt',
    cheers: ['Хорошо!', 'Отлично!', 'Растём!', 'Молодец!'], titles: HALLMARK_TITLES
  },
  hedgerow: {
    name: 'Hedgerow', icon: '🌲', logo: 'Говорушка', sub: 'russisk på norsk', color: '#163626', hallmark: true,
    fonts: 'family=Prata&family=Manrope:wght@400;600;700',
    hello: 'Добро пожаловать!', tagline: 'Gjennom taiga og bjørkeskog – ett ord om gangen.',
    desc: 'Hallmark · mørk løvgrønn, krem og chartreuse',
    cheers: ['Отлично!', 'Прекрасно!', 'Верно!', 'Здорово!'], titles: HALLMARK_TITLES
  },
  dusk: {
    name: 'Dusk', icon: '🌆', logo: 'Говорушка', sub: 'russisk på norsk', color: '#1d2130', hallmark: true,
    fonts: 'family=Wix+Madefor+Display:wght@500;600&family=Wix+Madefor+Text:wght@400;600;700',
    hello: 'Добрый вечер!', tagline: 'Rolig kveldsøkt: en leksjon før lyset går.',
    desc: 'Hallmark · skifer, røkt glass og periwinkle',
    cheers: ['Отлично!', 'Верно!', 'Прекрасно!', 'Молодец!'], titles: HALLMARK_TITLES
  },
  vantage: {
    name: 'Vantage', icon: '🧭', logo: 'Говорушка', sub: 'russisk på norsk', color: '#121a20', hallmark: true,
    fonts: 'family=Geologica:wght@300;400;600',
    hello: 'Курс проложен.', tagline: 'Kartet over Russland, kartlagt punkt for punkt.',
    desc: 'Hallmark · blåsvart, stål og limegrønt signal',
    cheers: ['Найдено!', 'Точно!', 'Верно!', 'Отлично!'], titles: HALLMARK_TITLES
  }
});
RP.skin = () => RP.SKINS[RP.state.settings.skin] || RP.SKINS.rus;
RP.titles = () => RP.skin().titles;
RP.applySkin = id => {
  if (id) { RP.state.settings.skin = id; RP.save(); }
  const k = RP.SKINS[RP.state.settings.skin] ? RP.state.settings.skin : 'rus';
  document.documentElement.dataset.skin = k;
  // Last temaets fonter først når temaet velges (sparer data på mobil)
  const f = RP.SKINS[k].fonts;
  if (f && !document.getElementById('font-' + k)) {
    const l = document.createElement('link'); l.id = 'font-' + k; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?' + f + '&display=swap'; document.head.appendChild(l);
  }
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = RP.SKINS[k].color;
};
RP.cycleSkin = () => {
  const ids = Object.keys(RP.SKINS), i = ids.indexOf(RP.state.settings.skin);
  RP.applySkin(ids[(i + 1) % ids.length]);
};

RP.levelInfo = (xp = RP.state.xp) => {
  let lvl = 1, need = 100, base = 0;
  while (xp >= base + need) { base += need; lvl++; need = 100 + 50 * (lvl - 1); }
  return { lvl, into: xp - base, need, pct: (xp - base) / need, title: RP.titles()[Math.min(lvl - 1, 9)] };
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
    RP.ui && RP.ui.toast(`🏅 «${RP.lesson(id).ru}» fullført!` + (id < RP.LESSONS.length ? ' Neste sted er låst opp.' : ''), 'gold');
  }
};

/* ---------- Merker ---------- */
const regionDone = r => { for (let i = r.from; i <= r.to; i++) if (!RP.isComplete(i)) return false; return true; };
RP.BADGES = [
  { id: 'first', icon: '🥾', no: 'Første skritt', d: 'Fullfør din første leksjon', test: () => RP.isComplete(1) || Object.keys(RP.state.lessons).some(RP.isComplete) },
  { id: 'moskva', icon: '🏰', no: 'Moskvas venn', d: 'Fullfør alle leksjoner i Moskva', test: () => regionDone(RP.REGIONS[0]) },
  { id: 'ring', icon: '💍', no: 'Den gylne ring', d: 'Fullfør Den gylne ring', test: () => regionDone(RP.REGIONS[1]) },
  { id: 'spb', icon: '⚓', no: 'Petersburger', d: 'Fullfør St. Petersburg', test: () => regionDone(RP.REGIONS[2]) },
  { id: 'baikal', icon: '🦭', no: 'Bajkal-mester', d: 'Fullfør Bajkal og Sibir', test: () => regionDone(RP.REGIONS[3]) },
  { id: 'streak3', icon: '🔥', no: 'Ild i ovnen', d: '3 dagers streak', test: () => RP.streakAlive() >= 3 },
  { id: 'streak7', icon: '🐻', no: 'Bjørnestyrke', d: '7 dagers streak', test: () => RP.streakAlive() >= 7 },
  { id: 'streak30', icon: '❄️', no: 'Sibirsk utholdenhet', d: '30 dagers streak', test: () => RP.streakAlive() >= 30 },
  { id: 'perfect', icon: '💎', no: 'Feilfri', d: '100 % på en quiz', test: () => RP.state.stats.perfect >= 1 },
  { id: 'talker', icon: '🗣️', no: 'Pratmaker', d: 'Fullfør 10 samtaler', test: () => RP.state.stats.roleplays >= 10 },
  { id: 'words50', icon: '📚', no: 'Ordsamler', d: '50 ord i repetisjonsbunken', test: () => Object.keys(RP.state.srs).length >= 50 },
  { id: 'reviewer', icon: '🧠', no: 'Hukommelsesmester', d: '100 repetisjoner', test: () => RP.state.stats.reviews >= 100 },
  { id: 'voice', icon: '🎤', no: 'Gullstrupe', d: '20 uttalelser med ≥ 80 %', test: () => RP.state.stats.goodSpeech >= 20 },
  { id: 'lvl5', icon: '⚔️', no: 'Bogatyr', d: 'Nå nivå 6', test: () => RP.levelInfo().lvl >= 6 },
  { id: 'kavkaz', icon: '🏔️', no: 'Fjellgeit', d: 'Fullfør Kaukasus', test: () => RP.REGIONS[4] && regionDone(RP.REGIONS[4]) },
  { id: 'kamchatka', icon: '🌋', no: 'Vulkanvandrer', d: 'Fullfør Kamtsjatka', test: () => RP.REGIONS[5] && regionDone(RP.REGIONS[5]) },
  { id: 'arktika', icon: '🌌', no: 'Nordlysjeger', d: 'Fullfør Murmansk og Arktis', test: () => RP.REGIONS[6] && regionDone(RP.REGIONS[6]) },
  { id: 'reader', icon: '📜', no: 'Bokorm', d: 'Les alle lesetekstene', test: () => RP.READINGS && RP.READINGS.length && RP.READINGS.every(r => RP.state.readings[r.id]) },
  { id: 'typist', icon: '⌨️', no: 'Kyrillisk skrivemaskin', d: 'Skriv 100 ord på russisk tastatur', test: () => RP.state.kb.words >= 100 },
  { id: 'chatter', icon: '🤖', no: 'Samtalepartner', d: 'Fullfør 5 frie samtaler', test: () => RP.state.stats.chats >= 5 }
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
RP.unlockAudio = () => { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume && actx.resume(); } catch (e) { } };
/* Lydfri modus: fast innstilling, eller «Kan ikke lytte nå» i én time. */
RP.silent = () => !!RP.state.settings.silent || Date.now() < (RP.state.settings.silentUntil || 0);
RP.setSilent = on => { RP.state.settings.silent = on; if (!on) RP.state.settings.silentUntil = 0; RP.save(); };
RP.sfx = type => {
  if (!RP.state.settings.sound || RP.silent()) return;
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

/* ---------- Trykkmerker ---------- */
const ACUTE = '́';
RP.unstress = s => String(s).replace(/́/g, '');
/* Setter inn trykk fra RP.STRESS for ord som mangler det. Tekst som allerede har trykk beholdes. */
RP.stress = s => {
  s = String(s);
  if (!RP.STRESS || s.includes(ACUTE)) return s;
  return s.replace(/[А-Яа-яЁё]+/g, w => {
    const v = RP.STRESS[w.toLowerCase()]; if (!v) return w;
    return w[0] !== w[0].toLowerCase() ? v[0].toUpperCase() + v.slice(1) : v;
  });
};
RP.disp = s => RP.state.settings.stress ? RP.stress(s) : RP.unstress(s);

/* ---------- Uttale: fonetisk nøkkel og ord-for-ord-justering ----------
   Tekstbasert: sammenligner det talegjenkjenningen hørte med målet, med russiske lydregler
   (akanje: ubetonet o ≈ a, stemte konsonanter blir ustemte i utlyd, -ться/-тся ≈ «tsa»). */
RP.phon = w => RP.normalize(w)
  .replace(/([oe])go\b/g, '$1vo').replace(/ts?ya\b/g, 'tsa').replace(/o/g, 'a').replace(/ye/g, 'e').replace(/yi/g, 'i')
  .replace(/zh\b/g, 'sh').replace(/b\b/g, 'p').replace(/d\b/g, 't').replace(/g\b/g, 'k').replace(/v\b/g, 'f').replace(/z\b/g, 's');
const wsim = (a, b) => { a = RP.phon(a); b = RP.phon(b); const L = Math.max(a.length, b.length); return L ? 1 - RP.lev(a, b) / L : 1; };
/* Justerer ordene (dynamisk programmering) og gir score per målord. */
RP.alignWords = (target, heard) => {
  const T = RP.unstress(target).split(/\s+/).filter(w => RP.normalize(w)), H = String(heard).split(/\s+/).filter(w => RP.normalize(w));
  const n = T.length, m = H.length, dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] + wsim(T[i - 1], H[j - 1]));
  const res = T.map(w => ({ w, heard: '', s: 0 }));
  let i = n, j = m;
  while (i > 0 && j > 0) {
    const s = wsim(T[i - 1], H[j - 1]);
    if (Math.abs(dp[i][j] - (dp[i - 1][j - 1] + s)) < 1e-9) { res[i - 1] = { w: T[i - 1], heard: H[j - 1], s }; i--; j--; }
    else if (dp[i][j] === dp[i - 1][j]) i--; else j--;
  }
  const score = res.length ? res.reduce((a, r) => a + r.s, 0) / res.length : 0;
  return { words: res, score: Math.max(0, Math.min(1, score - Math.max(0, m - n) * 0.05)) };
};

/* ---------- Lydnøkkel for innspilte opptak (FNV-1a av normalisert tekst) ---------- */
RP.audioKey = s => {
  const t = RP.unstress(s).toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  let h = 0x811c9dc5;
  for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
};
