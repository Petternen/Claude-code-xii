/* Visninger: kart, leksjon (dialog, ord, grammatikk, quiz, samtale), repetisjon, alfabet, profil. */
window.RP = window.RP || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const E = RP.esc;
const CYR = /[а-яё]/i;
const genderOf = name => RP.GENDER[name] || 'f';
const tr = s => RP.state.settings.translit ? `<div class="tl">${E(RP.translit(RP.disp(s)))}</div>` : '';
const R = s => E(RP.disp(s));
const say = (t, o) => RP.speech.speak(t, o);

/* ================= Felles UI ================= */
RP.ui = {
  toast(msg, cls = '') {
    const t = document.createElement('div'); t.className = 'toast ' + cls; t.textContent = msg;
    const box = $('#toasts'); box.appendChild(t);
    while (box.children.length > 2) box.firstChild.remove();
    setTimeout(() => t.classList.add('out'), 1800); setTimeout(() => t.remove(), 2200);
  },
  toastXP(n, label) { RP.ui.toast(`+${n} XP${label ? ' · ' + label : ''}`, 'xp'); },
  modal(html, onClose) {
    const m = $('#modal'); m.innerHTML = `<div class="modal-card ornament" role="dialog" aria-modal="true">${html}<div class="modal-foot"><button class="btn primary" data-close>OK</button></div></div>`;
    m.hidden = false; RP.modalOpen = true;
    const close = () => { m.hidden = true; m.innerHTML = ''; RP.modalOpen = false; onClose && onClose(); };
    RP.closeModal = close;
    $('[data-close]', m).onclick = close; m.onclick = e => { if (e.target === m) close(); };
  },
  levelUp(lvl) {
    const t = RP.titles()[Math.min(lvl - 1, 9)];
    // Ikke-blokkerende banner (forsvinner av seg selv) – flyten skal aldri stoppe opp
    const d = document.createElement('div'); d.className = 'levelbanner';
    d.innerHTML = `<span class="burst">⭐</span><div><b>Новый уровень! Nivå ${lvl}</b><small>${E(t)}</small></div>`;
    document.body.appendChild(d); setTimeout(() => d.classList.add('out'), 2800); setTimeout(() => d.remove(), 3300);
    RP.ui.confetti();
  },
  confetti() {
    const c = document.createElement('div'); c.className = 'confetti';
    c.innerHTML = Array.from({ length: 40 }, (_, i) => `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * .6}s;background:${['var(--red)', 'var(--gold)', 'var(--blue)', 'var(--green)'][i % 4]}"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
  },
  renderTopbar() {
    const s = RP.state, L = RP.levelInfo(), due = RP.srsDue().length, st = RP.streakAlive();
    const goal = Math.min(1, s.daily.xp / s.dailyGoal), C = 2 * Math.PI * 15;
    const route = location.hash.split('/')[1] || 'map';
    const nav = (r, icon, label, extra = '') => `<a href="#/${r}" class="nav ${route === r ? 'on' : ''}"><span class="ni">${icon}${extra}</span><span class="nl">${label}</span></a>`;
    $('#tabbar').innerHTML = nav('map', '🗺️', 'Kart') + nav('review', '🃏', 'Repetisjon', due ? `<span class="pill">${due}</span>` : '') + nav('alphabet', 'Аа', 'Alfabet') + nav('keyboard', '⌨️', 'Tastatur') + nav('profile', '👤', 'Profil');
    $('#topbar').innerHTML = `
      <a href="#/map" class="logo" title="Говорушка"><span class="matr">${RP.skin().icon}</span><span><b>${E(RP.skin().logo)}</b><small>${E(RP.skin().sub)}</small></span></a>
      <div class="hud">
        <button class="skinbtn" id="skinbtn" title="Bytt tema: ${E(RP.skin().name)}">🎨</button>
        <div class="streak ${st ? 'on' : ''}" title="Streak: ${st} dager på rad">🔥<b>${st}</b></div>
        <div class="goal" title="Dagens mål: ${s.daily.xp}/${s.dailyGoal} XP">
          <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="track"/><circle cx="18" cy="18" r="15" class="bar" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - goal)}"/></svg>
          <span>${goal >= 1 ? '✓' : Math.round(goal * 100) + '%'}</span></div>
        <div class="lvl" title="${E(L.title)} – ${L.into}/${L.need} XP til neste nivå">
          <div class="shield">${L.lvl}</div>
          <div class="lvlbar"><small>${E(L.title.split(' · ')[1])}</small><div class="bar"><i style="width:${L.pct * 100}%"></i></div></div>
        </div>
      </div>`;
    $('#skinbtn').onclick = () => { RP.cycleSkin(); RP.route(); RP.ui.toast('🎨 Tema: ' + RP.skin().name); };
  },
  /* Fargelegger målordene etter uttalescore (grønn ≥ 80 %, gul ≥ 50 %, rød under). */
  wordsHTML(r) {
    return r.words.map(x => { const p = Math.round(x.s * 100); return `<span class="pw ${p >= 80 ? 'good' : p >= 50 ? 'mid' : 'bad'}" title="${x.heard ? 'Hørt: ' + E(x.heard) : 'Ikke hørt'} (${p} %)">${R(x.w)}</span>`; }).join(' ');
  }
};

/* ================= KART ================= */
RP.views = {};
RP.readingUnlocked = r => { const reg = RP.REGIONS.find(x => x.id === r.region); return RP.state.settings.unlockAll || !!(reg && RP.isComplete(reg.to)); };
RP.views.map = {
  render() {
    const N = RP.LESSONS.length;
    const firstOpen = (RP.LESSONS.find(l => RP.isUnlocked(l.id) && !RP.isComplete(l.id)) || RP.LESSONS[N - 1]).id;
    if (!RP.mapSel || !RP.mapKeep) RP.mapSel = 'L' + firstOpen;
    RP.mapKeep = false;
    const s = RP.state, next = RP.lesson(firstOpen), due = RP.srsDue().length;
    let html = `<section class="hero ornament">
      <div><h1>${E(RP.skin().hello)}</h1><p>${E(RP.skin().tagline)}</p></div>
      <div class="hero-actions">
        <button class="btn primary big" data-act="open" data-key="L${next.id}">▶ ${RP.isComplete(next.id) ? 'Øv igjen' : 'Fortsett'}: ${R(next.ru)}</button>
        ${due ? `<a class="btn" href="#/review">🃏 ${due} ord å repetere</a>` : ''}
      </div>
      <div class="today"><b>${s.daily.xp}</b>/${s.dailyGoal} XP i dag</div>
    </section><div class="map">`;
    for (const r of RP.REGIONS) {
      const ls = RP.LESSONS.filter(l => l.id >= r.from && l.id <= r.to);
      if (!ls.length) continue;
      const done = ls.filter(l => RP.isComplete(l.id)).length;
      const lvl = r.from >= 21 ? 'B1' : r.from >= 13 ? 'A2' : 'A1';
      html += `<section class="region" style="--rc:${r.color}"><header class="region-head"><h2>${E(r.ru)}</h2><span>${E(r.no)} · ${lvl} · ${done}/${ls.length}</span></header><div class="path">`;
      ls.forEach((l, i) => {
        const p = RP.state.lessons[l.id], unlocked = RP.isUnlocked(l.id), complete = RP.isComplete(l.id);
        const stars = p ? p.stars : 0;
        const cls = [unlocked ? '' : 'locked', complete ? 'done' : '', l.id === firstOpen ? 'current' : '', l.boss ? 'boss' : ''].join(' ');
        html += `<div class="stop" style="--x:${[0, 1, 2, 1][i % 4]}">
          <button class="node ${cls}" data-act="open" data-key="L${l.id}" aria-label="Leksjon ${l.id}: ${E(l.no)}${unlocked ? '' : ' (låst)'}">
            <span class="medal">${unlocked ? l.icon : '🔒'}</span>
            ${l.id === firstOpen ? '<span class="flag">Du er her</span>' : ''}
          </button>
          <div class="node-label"><b>${l.id}. ${R(l.ru)}</b><small>${E(l.no)} · ${E(l.place)}</small>
          <span class="stars">${[1, 2, 3].map(n => n <= stars ? '★' : '☆').join('')}</span></div></div>`;
      });
      const rd = (RP.READINGS || []).find(x => x.region === r.id);
      if (rd) {
        const un = RP.readingUnlocked(rd), sc = RP.state.readings[rd.id];
        html += `<div class="stop" style="--x:0"><button class="node reading ${un ? '' : 'locked'} ${sc ? 'done' : ''}" data-act="open" data-key="${rd.id}" aria-label="Lesetekst: ${E(rd.no)}${un ? '' : ' (låst)'}">
          <span class="medal">${un ? rd.icon : '🔒'}</span></button>
          <div class="node-label"><b>📜 ${R(rd.ru)}</b><small>Lesetekst · ${E(rd.no)}${sc ? ` · ${sc} %` : ''}</small></div></div>`;
      }
      html += `</div></section>`;
    }
    $('#main').innerHTML = html + '</div>';
    this.mark();
    this.scroll(false);
  },
  nodes() { return $$('.map .node'); },
  mark() { this.nodes().forEach(n => n.classList.toggle('sel', n.dataset.key === RP.mapSel)); },
  scroll(smooth = true) { const n = $('.node.sel'); n && n.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' }); },
  move(d) {
    const ns = this.nodes(), i = ns.findIndex(n => n.dataset.key === RP.mapSel);
    for (let j = i + d; j >= 0 && j < ns.length; j += d) {
      if (!ns[j].classList.contains('locked')) { RP.mapSel = ns[j].dataset.key; this.mark(); this.scroll(); RP.sfx('click'); return; }
      if (ns[j].dataset.key.startsWith('L')) break;
    }
    RP.ui.toast('🔒 Fullfør forrige leksjon for å låse opp');
  },
  act(a, el) {
    if (a !== 'open') return;
    const k = el.dataset.key;
    if (k.startsWith('L')) {
      const id = +k.slice(1);
      if (!RP.isUnlocked(id)) { RP.ui.toast('🔒 Fullfør forrige leksjon for å låse opp'); RP.sfx('bad'); return; }
      RP.mapSel = k; RP.mapKeep = true; location.hash = `#/lesson/${id}/dialog`;
    } else {
      const rd = RP.READINGS.find(x => x.id === k);
      if (!RP.readingUnlocked(rd)) { RP.ui.toast('🔒 Fullfør regionen for å låse opp leseteksten'); RP.sfx('bad'); return; }
      RP.mapSel = k; RP.mapKeep = true; location.hash = `#/reading/${k}`;
    }
  }
};

/* ================= LEKSJON (ramme) ================= */
RP.views.lesson = {
  render([id, sec = 'dialog']) {
    const L = RP.lesson(id);
    if (!L) { location.hash = '#/map'; return; }
    if (!RP.isUnlocked(L.id)) { RP.ui.toast('🔒 Leksjonen er låst'); location.hash = '#/map'; return; }
    this.L = L; this.sec = RP.SECTIONS.find(s => s.id === sec) || (sec === 'chat' && RP.ai) ? sec : 'dialog';
    const p = RP.prog(L.id);
    $('#main').innerHTML = `<article class="lesson">
      <header class="lesson-head ornament">
        <a class="back" href="#/map" aria-label="Lukk leksjonen">✕</a>
        <div class="lh-icon">${L.icon}</div>
        <button class="silentbtn ${RP.silent() ? 'on' : ''}" data-act="silent" aria-label="Lydfri modus">${RP.silent() ? '🔇' : '🔊'}</button>
        <div class="lh-title"><h1>${E(L.ru)}</h1><p>${E(L.no)} · <span class="muted">${E(L.place)}</span> · Leksjon ${L.id}/${RP.LESSONS.length}</p></div>
      </header>
      <nav class="tabs ${RP.ai ? 'six' : ''}">${RP.SECTIONS.concat(RP.ai ? [{ id: 'chat', no: 'Fri prat', icon: '🤖' }] : []).map((s, i) => `<a href="#/lesson/${L.id}/${s.id}" class="tab ${s.id === this.sec ? 'on' : ''} ${p.done[s.id] ? 'done' : ''}">
        <span>${s.icon}</span><b>${s.no}</b>${p.done[s.id] ? '<i>✓</i>' : ''}</a>`).join('')}</nav>
      <div id="sec" class="sec"></div></article>`;
    this.sub = RP.sections[this.sec];
    this.sub.render(L);
    const on = $('.tab.on'); on && on.scrollIntoView({ inline: 'center', block: 'nearest' });
    RP.swipe($('#sec'), d => { if (['dialog', 'vocab', 'grammar'].includes(this.sec) || (d < 0 && this.sec !== 'dialog')) this.go(d); });
  },
  go(d) { const all = RP.SECTIONS.map(s => s.id).concat(RP.ai ? ['chat'] : []); const i = all.indexOf(this.sec) + d; if (i >= 0 && i < all.length) location.hash = `#/lesson/${this.L.id}/${all[i]}`; },
  finish(xp = 10) { // marker del som ferdig og gå videre
    RP.markSection(this.L.id, this.sec, xp);
    if (this.sec === 'roleplay') location.hash = '#/map'; else this.go(1);
  },
  act(a, el) {
    if (a === 'silent') { RP.setSilent(!RP.silent()); RP.speech.stop(); RP.ui.toast(RP.silent() ? '🔇 Lydfri modus: ingen lytteoppgaver eller automatisk lyd' : '🔊 Lyd er på igjen'); el.textContent = RP.silent() ? '🔇' : '🔊'; el.classList.toggle('on', RP.silent()); if (this.sec === 'quiz' && RP.silent()) RP.sections.quiz.muteListening(); return; }
    this.sub.act && this.sub.act(a, el);
  },
  cleanup() { RP.speech.stop(); RP.speech.stopListening(); this.sub && this.sub.cleanup && this.sub.cleanup(); }
};
RP.sections = {};
/* Sveip til venstre/høyre (som i en mobilapp) – kun tydelig horisontale sveip. */
RP.swipe = (el, fn) => {
  let x0, y0, t0;
  el.addEventListener('touchstart', e => { const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 == null || e.target.closest('input, .kb, .tokens, .built')) return;
    const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy) && Date.now() - t0 < 600) fn(dx < 0 ? 1 : -1);
  }, { passive: true });
};

/* ---------- Dialog ---------- */
RP.sections.dialog = {
  render(L) {
    this.L = L; this.sel = 0; this.slow = false; this.token = 0;
    const st = RP.state.settings;
    $('#sec').innerHTML = `<p class="intro">${E(L.intro)}</p>
      <div class="toolbar">
        <button class="btn primary" data-act="playall" id="playall">▶ Spill av hele</button>
        <button class="btn toggle ${this.slow ? 'on' : ''}" data-act="slow" id="slowbtn">🐢 Sakte</button>
        <button class="btn toggle ${st.translit ? 'on' : ''}" data-act="tl">Aa Translitt.</button>
        <button class="btn toggle ${st.translation ? 'on' : ''}" data-act="trans">🇳🇴 Oversettelse</button>
      </div>
      ${RP.speech.hasRuVoice ? '' : '<p class="warn">⚠️ Fant ingen russisk stemme i nettleseren. Opplesning kan mangle eller høres norsk ut. Chrome, Edge og Safari har russiske stemmer.</p>'}
      <div class="dialog ${st.translation ? '' : 'hide-no'}">${L.dialog.map(([who, ru, no], i) => `
        <div class="line ${i === 0 ? 'sel' : ''} ${who === L.dialog[0][0] ? 'left' : 'right'}" data-act="line" data-i="${i}">
          <div class="avatar g-${genderOf(who)}">${E(who[0])}</div>
          <div class="bubble"><small class="who">${E(who)}</small><div class="ru">${R(ru)}</div>${tr(ru)}<div class="no">${E(no)}</div></div>
        </div>`).join('')}</div>
      <div class="sec-foot cta"><button class="btn primary big" data-act="next">Fortsett til ordene →</button></div>`;
  },
  select(i) { this.sel = Math.max(0, Math.min(this.L.dialog.length - 1, i)); $$('.line').forEach((n, j) => n.classList.toggle('sel', j === this.sel)); $$('.line')[this.sel].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); },
  async playLine(i, tok) {
    this.select(i); const n = $$('.line')[i]; n.classList.add('playing');
    const [who, ru] = this.L.dialog[i];
    await say(ru, { gender: genderOf(who), slow: this.slow });
    n && n.classList.remove('playing');
    return tok === this.token;
  },
  async playAll() {
    if (RP.speech.speaking || this.playingAll) { this.stop(); return; }
    const tok = ++this.token; this.playingAll = true; $('#playall').innerHTML = `■ Stopp`;
    for (let i = 0; i < this.L.dialog.length; i++) { if (!(await this.playLine(i, tok))) return; await new Promise(r => setTimeout(r, 350)); if (tok !== this.token) return; }
    this.stop(); this.heard = true;
  },
  stop() { this.token++; this.playingAll = false; RP.speech.stop(); $$('.line').forEach(n => n.classList.remove('playing')); const b = $('#playall'); if (b) b.innerHTML = `▶ Spill av hele`; },
  toggle(k) { RP.state.settings[k] = !RP.state.settings[k]; RP.save(); RP.views.lesson.render([this.L.id, 'dialog']); },
  act(a, el) {
    if (a === 'playall') this.playAll();
    if (a === 'line') { this.stop(); this.playLine(+el.dataset.i, this.token); }
    if (a === 'slow') { this.slow = !this.slow; el.classList.toggle('on', this.slow); }
    if (a === 'tl') this.toggle('translit');
    if (a === 'trans') this.toggle('translation');
    if (a === 'next') { this.stop(); RP.views.lesson.finish(10); }
  },
  cleanup() { this.stop(); }
};

/* ---------- Ordforråd ---------- */
RP.speakCheck = async (target, outEl) => {
  if (!RP.speech.sttOK) { RP.ui.toast(RP.micErrorText({ message: 'unsupported' })); return null; }
  outEl.innerHTML = '<span class="rec">● Lytter …</span>';
  try {
    const alts = await RP.speech.listen(t => { outEl.innerHTML = `<span class="rec">● ${E(t)}</span>`; });
    if (!alts.length) { outEl.textContent = 'Hørte ingenting – prøv igjen.'; return null; }
    const best = alts.map(a => ({ a, r: RP.alignWords(target, a) })).sort((x, y) => y.r.score - x.r.score)[0];
    const pct = Math.round(best.r.score * 100);
    outEl.innerHTML = `<span class="score ${pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'bad'}">${pct}%</span> ${RP.ui.wordsHTML(best.r)} <span class="muted small">hørt: «${E(best.a)}»</span>`;
    RP.sfx(pct >= 80 ? 'ok' : 'bad');
    if (pct >= 80) { RP.state.stats.goodSpeech++; RP.save(); RP.checkBadges(); }
    return pct;
  } catch (err) { outEl.textContent = RP.micErrorText(err); return null; }
};

RP.sections.vocab = {
  render(L) {
    this.L = L; this.sel = 0; this.rewarded = new Set();
    $('#sec').innerHTML = `<p class="intro">Trykk på et ord for å høre det, og på 🎤 for å si det selv. Ordene legges i repetisjonsbunken din når du fortsetter.</p>
      <div class="vocab">${L.vocab.map(([ru, no], i) => `
        <div class="vcard ${i === 0 ? 'sel' : ''}" data-act="vsel" data-i="${i}">
          <div class="vmain"><div class="ru">${R(ru)}</div>${tr(ru)}<div class="no">${E(no)}</div></div>
          <div class="vbtns"><button class="icon" data-act="play" data-i="${i}" title="Hør">🔊</button>${RP.speech.sttOK ? `<button class="icon" data-act="speak" data-i="${i}" title="Si ordet">🎤</button>` : ''}</div>
          <div class="vres" id="vres${i}"></div>
        </div>`).join('')}</div>
      <div class="sec-foot cta"><button class="btn primary big" data-act="next">Lagre ordene og fortsett →</button></div>`;
  },
  select(i) { this.sel = (i + this.L.vocab.length) % this.L.vocab.length; $$('.vcard').forEach((n, j) => n.classList.toggle('sel', j === this.sel)); $$('.vcard')[this.sel].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); },
  play(i) { this.select(i); say(this.L.vocab[i][0]); },
  async speak(i) {
    this.select(i); const pct = await RP.speakCheck(this.L.vocab[i][0], $('#vres' + i));
    if (pct >= 80 && !this.rewarded.has(i)) { this.rewarded.add(i); RP.addXP(2, 'Uttale'); }
  },
  act(a, el) {
    const i = +el.dataset.i;
    if (a === 'vsel') this.play(i);
    if (a === 'play') { this.play(i); return; }
    if (a === 'speak') this.speak(i);
    if (a === 'next') { RP.srsAdd(this.L.id, this.L.vocab); RP.views.lesson.finish(10); }
  },
};

/* ---------- Grammatikk ---------- */
RP.sections.grammar = {
  render(L) {
    this.L = L;
    $('#sec').innerHTML = `<div class="grammar scroll-paper"><h2>${E(L.grammar.title)}</h2>${L.grammar.html}
      <p class="muted small">🔊 Trykk på russisk tekst i tabellen for å høre den.</p></div>
      <div class="sec-foot cta"><button class="btn primary big" data-act="next">Klar for quiz! →</button></div>`;
    $$('#sec td, #sec .grammar b').forEach(td => { if (CYR.test(td.textContent)) { td.classList.add('speakable'); td.dataset.act = 'say'; } });
  },
  act(a, el) {
    if (a === 'say') say(el.textContent.replace(/[^\p{L}\s\-.,!?]/gu, ''));
    if (a === 'next') RP.views.lesson.finish(10);
  },
};

/* ---------- Quiz ---------- */
const tokens = s => s.replace(/[.,!?«»:;–]/g, ' ').split(/\s+/).filter(Boolean);
RP.buildQuiz = L => {
  const items = L.quiz.map(([q, c, ...w]) => ({ type: 'mc', q, options: RP.shuffle([c, ...w]), correct: c }));
  const V = RP.shuffle(L.vocab), pool = L.vocab;
  const others = (val, idx) => RP.shuffle([...new Set(pool.map(v => v[idx]).filter(x => x !== val))]).slice(0, 3);
  V.slice(0, 3).forEach(([ru, no]) => items.push({ type: 'mc', q: 'Hva betyr dette?', big: ru, say: ru, options: RP.shuffle([no, ...others(no, 1)]), correct: no }));
  V.slice(3, 5).forEach(([ru, no]) => items.push({ type: 'mc', q: `Hvordan sier man «${no}» på russisk?`, options: RP.shuffle([ru, ...others(ru, 0)]), correct: ru }));
  V.slice(5, 7).forEach(([ru, no]) => items.push({ type: 'listen', q: 'Lytt og velg ordet du hører', say: ru, no, options: RP.shuffle([ru, ...others(ru, 0)]), correct: ru }));
  const [tru, tno] = V[7] || V[0];
  items.push({ type: 'type', q: `Skriv på russisk: «${tno}»`, answer: tru });
  const line = RP.shuffle(L.dialog.filter(d => { const n = tokens(d[1]).length; return n >= 3 && n <= 7; }))[0];
  const out = RP.shuffle(items);
  if (line) out.push({ type: 'order', q: 'Sett ordene i riktig rekkefølge', no: line[2], answer: tokens(line[1]), pool: RP.shuffle(tokens(line[1]).map((w, i) => ({ w, i }))) });
  return out;
};

RP.sections.quiz = {
  render(L) {
    this.L = L; this.items = RP.buildQuiz(L); this.i = 0; this.correct = 0; this.combo = 0; this.maxCombo = 0;
    this.show();
  },
  show() {
    const it = this.items[this.i]; this.answered = false; this.picked = [];
    const n = this.items.length, opt = (o, k) => `<button class="opt" data-act="pick" data-k="${k}"><span><b>${R(o)}</b>${CYR.test(o) ? tr(o) : ''}</span></button>`;
    let body = '';
    if (it.type === 'listen' && RP.silent()) Object.assign(it, { type: 'mc', q: `Velg det russiske ordet for «${it.no}»` });
    if (it.type === 'mc' || it.type === 'listen') {
      body = (it.big ? `<div class="bigword" data-act="say">${R(it.big)}${tr(it.big)}</div>` : '') +
        (it.type === 'listen' ? `<button class="btn big listenbtn" data-act="say">🔊 Spill av</button><button class="btn ghost cantbtn" data-act="cantlisten">🔇 Kan ikke lytte nå</button>` : '') +
        `<div class="opts">${it.options.map(opt).join('')}</div>`;
    } else if (it.type === 'type') {
      body = `<form id="qform" class="qform"><input id="qin" class="answer" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="Skriv kyrillisk eller latinsk (f.eks. spasibo)…"><button class="btn primary big">Sjekk</button></form>`;
    } else if (it.type === 'order') {
      body = `<p class="no-sent">«${E(it.no)}»</p><div class="built" id="built"></div>
        <div class="opts tokens">${it.pool.map((t, k) => `<button class="tok" data-act="tok" data-k="${k}">${E(t.w)}</button>`).join('')}</div>
        <div class="row order-btns"><button class="btn" data-act="reset">↺ Nullstill</button><button class="btn primary" data-act="check" id="ordercheck">Sjekk svaret</button></div>`;
    }
    $('#sec').innerHTML = `<div class="quiz">
      <div class="qbar"><div class="bar"><i style="width:${this.i / n * 100}%"></i></div><span>${this.i + 1}/${n}</span>
        <span class="combo ${this.combo >= 2 ? 'on' : ''}">🔥 Combo ×${this.combo}</span></div>
      <div class="qcard"><h2>${E(it.q)}</h2>${body}</div>
      <div class="feedback" id="fb"></div></div>`;
    if (it.type === 'type') { $('#qform').onsubmit = e => { e.preventDefault(); this.submit(); }; setTimeout(() => $('#qin').focus(), 30); }
    if (it.type === 'order') this.drawBuilt();
    if (it.say && it.type === 'listen') setTimeout(() => say(it.say, { auto: true }), 250);
  },
  check(ok, right) {
    this.answered = true;
    const it = this.items[this.i];
    if (ok) {
      this.correct++; this.combo++; this.maxCombo = Math.max(this.maxCombo, this.combo); RP.state.stats.quizCorrect++;
      RP.sfx('ok'); RP.addXP(5 + Math.min(this.combo - 1, 5), this.combo >= 2 ? `Combo ×${this.combo}` : '');
    } else { this.combo = 0; RP.sfx('bad'); $('.qcard').classList.add('shake'); }
    const answerRu = it.type === 'order' ? it.answer.join(' ') : it.type === 'type' ? it.answer : CYR.test(it.correct) ? it.correct : (it.say || '');
    $('#fb').className = 'feedback show ' + (ok ? 'good' : 'bad');
    $('#fb').innerHTML = `<div><b>${ok ? RP.skin().cheers[Math.floor(Math.random() * 4)] + ' Riktig.' : 'Ikke helt.'}</b>
      ${right ? `<div>Riktig svar: <b>${R(right)}</b></div>` : ''}</div>
      <button class="btn primary big" data-act="cont">${ok ? 'Neste →' : 'Fortsett →'}</button>`;
    if (answerRu && CYR.test(answerRu)) say(answerRu, { auto: true });
    // Riktig svar går automatisk videre – feil svar venter på et trykk så man rekker å lese fasit
    if (ok) this.auto = setTimeout(() => this.next(), 1300);
  },
  pick(k) {
    const it = this.items[this.i]; if (this.answered || !it.options || k >= it.options.length) return;
    const ok = it.options[k] === it.correct;
    $$('.opt').forEach((b, j) => { b.disabled = true; if (it.options[j] === it.correct) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
    this.check(ok, ok ? '' : it.correct);
  },
  tok(k) {
    const it = this.items[this.i]; if (this.answered || k >= it.pool.length || this.picked.includes(k)) return;
    this.picked.push(k); this.drawBuilt();
    if (this.picked.length === it.pool.length) setTimeout(() => this.submit(), 250);
  },
  /* Gjør gjenstående lytteoppgaver om til leseoppgaver (uten å starte quizen på nytt). */
  muteListening() {
    this.items.forEach((x, n) => { if (n >= this.i && x.type === 'listen') Object.assign(x, { type: 'mc', q: `Velg det russiske ordet for «${x.no}»` }); });
    if (!this.answered && !this.done) this.show();
  },
  untok(j) { if (this.answered) return; this.picked.splice(j, 1); this.drawBuilt(); },
  drawBuilt() {
    const it = this.items[this.i];
    $('#built').innerHTML = this.picked.map((k, j) => `<button class="tok in" data-act="untok" data-j="${j}">${E(it.pool[k].w)}</button>`).join('') || '<span class="muted">Trykk på ordene i riktig rekkefølge …</span>';
    $$('.tok[data-k]').forEach(b => b.classList.toggle('used', this.picked.includes(+b.dataset.k)));
  },
  submit() {
    const it = this.items[this.i];
    if (this.answered) return this.next();
    if (it.type === 'type') {
      const v = $('#qin').value.trim(); if (!v) return;
      const s = RP.similarity(v, it.answer); $('#qin').disabled = true;
      this.check(s >= 0.8, s >= 1 ? '' : it.answer);
    } else if (it.type === 'order') {
      if (this.picked.length < it.pool.length) { RP.ui.toast('Bruk alle ordene først'); return; }
      const built = this.picked.map(k => it.pool[k].w).join(' ');
      const ok = RP.normalize(built) === RP.normalize(it.answer.join(' '));
      this.check(ok, ok ? '' : it.answer.join(' '));
    }
  },
  next() {
    clearTimeout(this.auto);
    if (!this.answered) return;
    this.answered = false;
    RP.speech.stop();
    if (++this.i < this.items.length) return this.show();
    // Resultat
    const n = this.items.length, pct = Math.round(this.correct / n * 100), p = RP.prog(this.L.id);
    const stars = pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
    if (pct === 100) RP.state.stats.perfect++;
    p.best = Math.max(p.best, pct); p.stars = Math.max(p.stars, stars); RP.save();
    if (stars) RP.markSection(this.L.id, 'quiz', 0); else RP.checkBadges();
    if (stars === 3) RP.ui.confetti();
    $('#sec').innerHTML = `<div class="result ornament">
      <h2>${stars ? 'Победа!' : 'Почти!'}</h2>
      <div class="bigstars">${[1, 2, 3].map(s => `<span class="${s <= stars ? 'on' : ''}">★</span>`).join('')}</div>
      <p class="big">${this.correct} av ${n} riktige (${pct} %)</p>
      <p>Lengste combo: 🔥 ${this.maxCombo}</p>
      ${stars ? '' : '<p class="warn">Du trenger minst 60 % for å bestå quizen. Prøv igjen!</p>'}
      <div class="row stack"><button class="btn primary big" data-act="tonext">${stars ? 'Til samtalen →' : 'Repeter dialogen'}</button>
      <button class="btn" data-act="retry">↻ Ta quizen igjen</button></div></div>`;
    this.done = true; this.passed = !!stars;
  },
  act(a, el) {
    if (a === 'pick') this.pick(+el.dataset.k);
    if (a === 'tok') this.tok(+el.dataset.k);
    if (a === 'untok') this.untok(+el.dataset.j);
    if (a === 'reset' && !this.answered) { this.picked = []; this.drawBuilt(); }
    if (a === 'check') this.submit();
    if (a === 'cantlisten') {
      RP.state.settings.silentUntil = Date.now() + 3600000; RP.save(); RP.speech.stop();
      RP.ui.toast('🔇 Ingen lytteoppgaver den neste timen');
      this.muteListening();
    }
    if (a === 'say') say(this.items[this.i].say);
    if (a === 'cont') this.next();
    if (a === 'retry') { this.done = false; this.render(this.L); }
    if (a === 'tonext') location.hash = `#/lesson/${this.L.id}/${this.passed ? 'roleplay' : 'dialog'}`;
  },
  cleanup() { this.done = false; clearTimeout(this.auto); }
};

/* ---------- Samtale / rollespill ---------- */
RP.sections.roleplay = {
  render(L) {
    this.L = L; this.rp = L.rp; this.step = -1; this.passed = 0; this.skipped = 0; this.hint = 0; this.tries = 0; this.busy = false; this.ended = false;
    const bot = this.rp.bot;
    $('#sec').innerHTML = `<div class="rp">
      <div class="rp-intro ornament"><div class="avatar big g-${genderOf(bot)}">${E(bot[0])}</div>
        <div><h2>Samtale med ${E(bot)}</h2><p>${E(this.rp.intro)}</p>
        <p class="muted small">Trykk på riktig svar.${RP.silent() ? '' : RP.speech.sttOK ? ' Vil du øve uttale, kan du også si det med 🎤.' : ''} Du kan også skrive svaret selv. Verken lyd eller mikrofon er nødvendig.</p>
        <button class="btn primary big" data-act="start">▶ Start samtalen</button></div></div>
      <div class="chat" id="chat"></div>
      <div class="rp-controls" id="rpc" hidden>
        <div class="hintbox" id="hint"></div>
        <div class="choices" id="choices"></div>
        <div class="row alt-input">
          ${RP.speech.sttOK && !RP.silent() ? `<button class="mic small" data-act="mic" id="mic" title="Si svaret">🎤</button>` : ''}
          <button class="btn ghost" data-act="typemode">⌨️ Skriv selv</button>
          <button class="btn ghost" data-act="hint">💡 Hint</button>
        </div>
        <form id="rpform" class="qform" hidden><input id="rpin" class="answer" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="Skriv svaret (kyrillisk eller latinsk)"><button class="btn">Send</button></form>
        <div class="row small-btns">
          ${RP.silent() ? '' : '<button class="btn ghost" data-act="again">🔊 Hør igjen</button>'}
          <button class="btn ghost" data-act="trans">🇳🇴 Oversett</button>
          <button class="btn ghost" data-act="skip">⏭ Hopp over</button>
        </div>
      </div></div>`;
    $('#rpform').onsubmit = e => { e.preventDefault(); this.send(); };
  },
  bubble(who, html, cls = '') {
    const d = document.createElement('div'); d.className = `msg ${who} ${cls}`;
    d.innerHTML = who === 'bot' ? `<div class="avatar g-${genderOf(this.rp.bot)}">${E(this.rp.bot[0])}</div><div class="bubble">${html}</div>` : `<div class="bubble">${html}</div>`;
    $('#chat').appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' }); return d;
  },
  async nextStep() {
    this.step++; this.hint = 0; this.tries = 0; $('#hint').innerHTML = '';
    if (this.step >= this.rp.steps.length) return this.end();
    const s = this.rp.steps[this.step];
    const bb = this.bubble('bot', `<div class="ru">${R(s.b)}</div>${tr(s.b)}<div class="no" hidden>${E(s.bn)}</div>`);
    $('#rpc').hidden = false; $('#rpin').value = '';
    this.drawChoices(s);
    bb.scrollIntoView({ block: 'start', behavior: 'smooth' });
    await say(s.b, { gender: genderOf(this.rp.bot), auto: true });
  },
  /* Trykkbare svaralternativer: fasit + to replikker fra kurset som IKKE godkjennes for dette trinnet. */
  drawChoices(s) {
    const own = this.rp.steps.filter(x => x !== s).map(x => x.m);
    const all = RP.LESSONS.flatMap(l => l.rp.steps.map(x => x.m));
    const pool = [...new Set(RP.shuffle(own).concat(RP.shuffle(all)))].filter(m => RP.normalize(m) !== RP.normalize(s.m) && !RP.judge([m], s).pass);
    this.choices = RP.shuffle([s.m, ...pool.slice(0, 2)]);
    $('#choices').innerHTML = this.choices.map((c, k) => `<button class="choice" data-act="choose" data-k="${k}"><b>${R(c)}</b>${tr(c)}</button>`).join('');
  },
  choose(k, el) {
    if (this.busy || this.ended || this.step < 0 || el.disabled) return;
    const s = this.rp.steps[this.step], text = this.choices[k], ok = RP.judge([text], s).pass;
    el.disabled = true; el.classList.add(ok ? 'right' : 'wrong');
    if (ok) $$('#choices .choice').forEach(b => { b.disabled = true; });
    this.answer([RP.unstress(text)]);
  },
  async mic() {
    if (this.busy || this.ended || this.step < 0) return;
    if (RP.speech.listening) { RP.speech.stopListening(); return; }
    const m = $('#mic'); m.classList.add('on'); this.busy = true;
    const live = this.bubble('me', '<span class="rec">● Lytter …</span>', 'live');
    try {
      const alts = await RP.speech.listen(t => { live.querySelector('.bubble').innerHTML = `<span class="rec">● ${E(t)}</span>`; });
      live.remove();
      if (!alts.length) { RP.ui.toast('Hørte ingenting – prøv igjen'); }
      else this.answer(alts);
    } catch (err) { live.remove(); RP.ui.toast(RP.micErrorText(err)); }
    m.classList.remove('on'); this.busy = false;
  },
  answer(alts) {
    const s = this.rp.steps[this.step], r = RP.judge(alts, s);
    const b = this.bubble('me', `<div class="ru">${E(r.text)}</div>${CYR.test(r.text) ? tr(r.text) : ''}`, r.pass ? 'ok' : 'bad');
    if (r.pass) {
      RP.sfx('ok'); this.passed++;
      b.insertAdjacentHTML('beforeend', `<span class="verdict">✓</span>`);
      $('#hint').innerHTML = `<span class="good">${RP.skin().cheers[this.step % 4]}</span>` + (RP.normalize(r.text) !== RP.normalize(s.m) ? ` <span class="muted">Et annet godt svar: «${R(s.m)}»</span>` : '');
      this.busy = true; setTimeout(() => { this.busy = false; this.nextStep(); }, 1300);
    } else {
      RP.sfx('bad'); this.tries++;
      b.insertAdjacentHTML('beforeend', `<span class="verdict">✗</span>`);
      const target = [s.m, ...(s.ok || [])].map(t => RP.alignWords(t, r.text)).sort((a, b) => b.score - a.score)[0];
      $('#hint').innerHTML = `Ikke helt – prøv igjen. ${this.tries >= 2 ? 'Trykk 💡 Hint for hjelp.' : ''}` + (this.tries >= 2 && target ? `<div class="small">Nærmeste svar: ${RP.ui.wordsHTML(target)}</div>` : '');
      if (this.tries >= 3 && this.hint < 2) this.showHint(2);
    }
  },
  showHint(level) {
    const s = this.rp.steps[this.step]; this.hint = level || Math.min(2, this.hint + 1);
    $('#hint').innerHTML = `💡 ${E(s.h)}` + (this.hint >= 2 ? `<div class="model" data-act="model">🔊 <b>${R(s.m)}</b> <span class="muted">${E(RP.translit(RP.disp(s.m)))}</span></div>` : ` <span class="muted">(trykk 💡 igjen for fasit)</span>`);
    if (this.hint >= 2) say(s.m, { auto: true });
  },
  send() { const v = $('#rpin').value.trim(); if (!v || this.busy) return; $('#rpin').value = ''; this.answer([v]); },
  skip() {
    if (this.busy || this.step < 0) return;
    const s = this.rp.steps[this.step]; this.skipped++;
    this.bubble('me', `<div class="ru">${R(s.m)}</div>${tr(s.m)}`, 'skipped');
    this.busy = true; say(s.m, { auto: true }).then(() => { this.busy = false; this.nextStep(); });
  },
  end() {
    this.ended = true; $('#rpc').hidden = true;
    const n = this.rp.steps.length, ok = this.passed >= Math.ceil(n / 2);
    const xp = ok ? Math.max(10, 30 - this.skipped * 8) : 0;
    if (ok) { RP.state.stats.roleplays++; RP.save(); RP.markSection(this.L.id, 'roleplay', 0); RP.addXP(xp, 'Samtale'); }
    const next = this.L.id < RP.LESSONS.length && RP.isUnlocked(this.L.id + 1);
    this.bubble('bot', `<div class="ru">${ok ? 'Было приятно поговорить! До встречи!' : 'Давай попробуем ещё раз!'}</div><div class="no">${ok ? 'Hyggelig å snakke med deg! Vi ses!' : 'La oss prøve igjen!'}</div>`);
    const d = document.createElement('div'); d.className = 'result ornament';
    d.innerHTML = `<h2>${ok ? 'Samtale fullført!' : 'Nesten!'}</h2><p class="big">${this.passed}/${n} svar klarte du selv</p>
      ${this.skipped ? `<p class="muted">Hoppet over: ${this.skipped}</p>` : ''}
      ${!ok ? '<p class="warn">Klar minst halvparten av replikkene selv for å fullføre samtalen.</p>' : ''}
      ${ok && !RP.prog(this.L.id).done.quiz ? '<p class="warn">Bestå quizen også for å fullføre leksjonen.</p>' : ''}
      <div class="row stack"><button class="btn primary big" data-act="finish">${next ? 'Neste leksjon →' : 'Til kartet'}</button>
      <button class="btn" data-act="restart">↻ Spill igjen</button></div>`;
    $('#chat').appendChild(d); d.scrollIntoView({ behavior: 'smooth' });
    if (ok) RP.ui.confetti();
    say(ok ? 'Было приятно поговорить! До встречи!' : 'Давай попробуем ещё раз!', { gender: genderOf(this.rp.bot), auto: true });
  },
  act(a, el) {
    if (a === 'start') { $('.rp').classList.add('started'); this.nextStep(); }
    if (a === 'mic') this.mic();
    if (a === 'send') this.send();
    if (a === 'hint') this.showHint();
    if (a === 'model') say(this.rp.steps[this.step].m);
    if (a === 'again') { const s = this.rp.steps[this.step]; s && say(s.b, { gender: genderOf(this.rp.bot) }); }
    if (a === 'trans') { const n = $$('#chat .msg.bot .no'); n.length && (n[n.length - 1].hidden = !n[n.length - 1].hidden); }
    if (a === 'skip') this.skip();
    if (a === 'choose') this.choose(+el.dataset.k, el);
    if (a === 'typemode') { const f = $('#rpform'); f.hidden = !f.hidden; if (!f.hidden) $('#rpin').focus(); }
    if (a === 'restart') this.render(this.L);
    if (a === 'finish') {
      const next = this.L.id < RP.LESSONS.length && RP.isUnlocked(this.L.id + 1);
      if (next) RP.mapSel = 'L' + (this.L.id + 1);
      location.hash = next ? `#/lesson/${this.L.id + 1}/dialog` : '#/map';
    }
  },
};

/* ================= REPETISJON ================= */
RP.views.review = {
  render(practice) {
    const due = RP.shuffle(RP.srsDue()).slice(0, 20);
    this.queue = due.length ? due : practice ? RP.shuffle(Object.entries(RP.state.srs).map(([ru, c]) => ({ ru, ...c }))).slice(0, 10) : [];
    this.count = 0; this.practice = !due.length;
    if (!this.queue.length) {
      const total = Object.keys(RP.state.srs).length;
      $('#main').innerHTML = `<section class="center-card ornament"><h1>🃏 Repetisjon</h1>
        ${total ? `<p>Ingen kort å repetere akkurat nå – godt jobbet! Du har <b>${total}</b> ord i bunken.</p>
        <button class="btn primary big" data-act="practice">Øv på 10 tilfeldige ord</button>`
          : `<p>Bunken er tom. Fullfør ordforrådet i en leksjon for å legge til ord.</p><a class="btn primary" href="#/map">Til kartet</a>`}</section>`; this.empty = true; return;
    }
    this.empty = false; this.show();
  },
  show() {
    const c = this.queue[0]; this.flipped = false; this.dir = Math.random() < 0.5 ? 'ru' : 'no';
    const front = this.dir === 'ru' ? `<div class="ru">${R(c.ru)}</div>${tr(c.ru)}` : `<div class="no big">${E(c.no)}</div>`;
    $('#main').innerHTML = `<section class="review">
      <p class="muted">${this.practice ? 'Øvingsmodus' : 'Repetisjon'} · ${this.queue.length} igjen · ${this.count} gjort</p>
      <div class="flash" id="flash" data-act="flip"><div class="face">${front}<p class="muted small">${this.dir === 'ru' ? 'Hva betyr dette?' : 'Hva heter dette på russisk?'}</p></div></div>
      <div id="rv-res" class="vres"></div>
      <div class="grades" id="grades" hidden>
        <button class="btn g1" data-act="grade" data-g="1">Igjen</button>
        <button class="btn g2" data-act="grade" data-g="2">Vanskelig</button>
        <button class="btn g3" data-act="grade" data-g="3">Bra</button>
        <button class="btn g4" data-act="grade" data-g="4">Lett</button></div>
      <div class="row stack"><button class="btn primary big" data-act="flip" id="flipbtn">Vis svaret</button>
      ${RP.speech.sttOK ? `<button class="btn ghost" data-act="speak">🎤 Si ordet</button>` : ''}</div></section>`;
    if (this.dir === 'ru') say(c.ru, { auto: true });
  },
  flip() {
    if (this.flipped) return; this.flipped = true; const c = this.queue[0];
    $('#flash').classList.add('flipped');
    $('#flash').insertAdjacentHTML('beforeend', `<div class="back-face"><div class="ru">${R(c.ru)}</div>${tr(c.ru)}<div class="no">${E(c.no)}</div></div>`);
    $('#grades').hidden = false; $('#flipbtn').hidden = true;
    if (this.dir === 'no') say(c.ru, { auto: true });
  },
  grade(g) {
    if (!this.flipped) return;
    const c = this.queue.shift(); RP.srsGrade(c.ru, g); this.count++;
    RP.addXP(2); RP.sfx(g > 1 ? 'ok' : 'click');
    if (g === 1) this.queue.push(c);
    if (this.queue.length) this.show();
    else {
      $('#main').innerHTML = `<section class="center-card ornament"><h1>Готово! 🎉</h1><p>Du repeterte <b>${this.count}</b> kort.</p>
        <a class="btn primary big" href="#/map">Til kartet</a></section>`;
      this.empty = true; this.doneAll = true;
    }
  },
  act(a, el) {
    if (a === 'flip') this.flip();
    if (a === 'grade') this.grade(+el.dataset.g);
    if (a === 'practice') this.render(true);
    if (a === 'speak') RP.speakCheck(this.queue[0].ru, $('#rv-res'));
  },
};

/* ================= ALFABET ================= */
RP.views.alphabet = {
  render() {
    this.sel = this.sel || 0;
    $('#main').innerHTML = `<section class="alpha-page"><header class="page-head ornament"><h1>Кириллица</h1><p>Det kyrilliske alfabetet – 33 bokstaver. ⚠️ markerer «falske venner» som ligner latinske bokstaver.</p></header>
      <div class="alpha">${RP.ALPHABET.map(([L, s, d, w], i) => `<button class="letter ${i === this.sel ? 'sel' : ''} ${d.includes('⚠️') ? 'false-friend' : ''}" data-act="play" data-i="${i}">
        <span class="L">${E(L)}</span><span class="snd">${E(s)}</span><small>${E(d.replace('⚠️ ', ''))}</small><span class="ex">${E(w)}</span></button>`).join('')}</div></section>`;
  },
  select(i) { this.sel = (i + 33) % 33; $$('.letter').forEach((n, j) => n.classList.toggle('sel', j === this.sel)); $$('.letter')[this.sel].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); },
  act(a, el) { if (a === 'play') { this.select(+el.dataset.i); say(RP.ALPHABET[this.sel][3]); } },
};

/* ================= PROFIL ================= */
RP.views.profile = {
  render() {
    const s = RP.state, L = RP.levelInfo(), done = RP.LESSONS.filter(l => RP.isComplete(l.id)).length;
    const sp = RP.speech;
    $('#main').innerHTML = `<section class="profile">
      <header class="page-head ornament"><div class="shield big">${L.lvl}</div><div><h1>${E(L.title)}</h1>
        <p>${s.xp} XP totalt · ${L.into}/${L.need} XP til nivå ${L.lvl + 1}</p><div class="bar"><i style="width:${L.pct * 100}%"></i></div></div></header>
      <div class="stats">
        <div><b>🔥 ${RP.streakAlive()}</b><span>dagers streak</span></div>
        <div><b>🗺️ ${done}/${RP.LESSONS.length}</b><span>leksjoner</span></div>
        <div><b>📚 ${Object.keys(s.srs).length}</b><span>ord lært</span></div>
        <div><b>🗣️ ${s.stats.roleplays}</b><span>samtaler</span></div>
        <div><b>🧠 ${s.stats.reviews}</b><span>repetisjoner</span></div>
        <div><b>🎤 ${s.stats.goodSpeech}</b><span>gode uttalelser</span></div>
      </div>
      <h2>Merker</h2>
      <div class="badges">${RP.BADGES.map(b => `<div class="badge ${s.badges[b.id] ? 'got' : ''}" title="${E(b.d)}"><span>${b.icon}</span><b>${E(b.no)}</b><small>${E(b.d)}</small></div>`).join('')}</div>
      <h2>Tema</h2>
      <div class="skins">${Object.entries(RP.SKINS).map(([id, k], i) => `<button class="skincard ${s.settings.skin === id ? 'on' : ''}" data-act="skin" data-skin="${id}">
        <span class="sk-prev sk-${id}"><i></i><i></i><i></i></span><b>${k.icon} ${E(k.name)}</b><small>${E(k.desc)}</small></button>`).join('')}</div>
      <h2>Innstillinger</h2>
      <div class="settings">
        <label>Dagens mål <select data-set="dailyGoal">${[20, 50, 100, 150].map(v => `<option value="${v}" ${s.dailyGoal === v ? 'selected' : ''}>${v} XP</option>`).join('')}</select></label>
        <label>Lesehastighet <input type="range" min="0.5" max="1.2" step="0.05" value="${s.settings.rate}" data-set="rate"> <span id="ratev">${s.settings.rate}</span></label>
        <label><input type="checkbox" data-set="translit" ${s.settings.translit ? 'checked' : ''}> Vis translitterasjon</label>
        <label><input type="checkbox" data-set="translation" ${s.settings.translation ? 'checked' : ''}> Vis norsk oversettelse i dialoger</label>
        <label><input type="checkbox" data-set="sound" ${s.settings.sound ? 'checked' : ''}> Lydeffekter</label>
        <label><input type="checkbox" data-set="silent" ${s.settings.silent ? 'checked' : ''}> 🔇 Lydfri modus (ingen lytteoppgaver eller automatisk opplesning)</label>
        <label><input type="checkbox" data-set="stress" ${s.settings.stress ? 'checked' : ''}> Vis trykkmerker (молоко́)</label>
        <label>Stemme <select data-set="voice" data-str><option value="auto" ${s.settings.voice !== 'browser' ? 'selected' : ''}>Beste tilgjengelige (opptak → Claude → nettleser)</option><option value="browser" ${s.settings.voice === 'browser' ? 'selected' : ''}>Kun nettleserens stemme</option></select></label>
        <label><input type="checkbox" data-set="unlockAll" ${s.settings.unlockAll ? 'checked' : ''}> Lås opp alle leksjoner</label>
      </div>
      <h2>Tale i denne nettleseren</h2>
      <ul class="diag"><li>${sp.ttsOK && sp.hasRuVoice ? '✅ Russisk opplesning tilgjengelig' : '⚠️ Ingen russisk stemme funnet – installer en russisk stemme i operativsystemet, eller bruk Chrome/Edge/Safari'}</li>
        <li>${sp.sttOK ? '✅ Talegjenkjenning støttes' : '⚠️ Talegjenkjenning støttes ikke (Firefox). Du kan skrive svarene i stedet.'}</li></ul>
      <ul class="diag"><li>🔊 Opplesning nå: <b>${E(sp.source)}</b>${RP.AUDIO && Object.keys(RP.AUDIO).length ? ` · ${Object.keys(RP.AUDIO).length} innspilte morsmålsopptak` : ''}</li></ul>
      <div class="row"><button class="btn" data-act="testvoice">🔊 Test stemmen</button><a class="btn" href="#/studio">🎙️ Opptaksstudio for morsmålsbrukere</a></div>
      <h2>Fremdrift</h2>
      <p class="muted">Alt lagres lokalt i nettleseren. Ta sikkerhetskopi eller flytt til en annen enhet:</p>
      <div class="row"><button class="btn" data-act="export">⬇ Eksporter</button>
        <label class="btn">⬆ Importer<input type="file" accept="application/json" data-act-change="import" hidden></label>
        <button class="btn danger" data-act="reset">Nullstill alt</button></div>
    </section>`;
    $$('[data-set]').forEach(inp => inp.onchange = inp.oninput = () => {
      const k = inp.dataset.set, v = inp.type === 'checkbox' ? inp.checked : inp.hasAttribute('data-str') ? inp.value : +inp.value;
      if (k === 'dailyGoal') s.dailyGoal = v; else if (k === 'silent') RP.setSilent(v); else s.settings[k] = v;
      if (k === 'rate') $('#ratev').textContent = v;
      RP.save(); RP.ui.renderTopbar();
    });
    $('[data-act-change="import"]').onchange = e => this.import(e.target.files[0]);
  },
  import(file) {
    if (!file) return;
    file.text().then(t => { const d = JSON.parse(t); if (typeof d.xp !== 'number') throw 0; localStorage.setItem('govorushka_v1', t); RP.load(); RP.ui.toast('Fremdrift importert'); RP.route(); })
      .catch(() => RP.ui.toast('Ugyldig fil'));
  },
  act(a, el) {
    if (a === 'skin') { RP.applySkin(el.dataset.skin); RP.route(); RP.ui.toast('🎨 Tema: ' + RP.skin().name); return; }
    if (a === 'testvoice') say('Привет! Меня зовут Говорушка. Давай говорить по-русски!');
    if (a === 'export') {
      const b = new Blob([JSON.stringify(RP.state, null, 1)], { type: 'application/json' });
      const u = URL.createObjectURL(b), l = document.createElement('a'); l.href = u; l.download = `govorushka-${RP.today()}.json`; l.click(); URL.revokeObjectURL(u);
    }
    if (a === 'reset' && confirm('Slette all fremdrift? Dette kan ikke angres.')) { RP.reset(); RP.route(); RP.ui.renderTopbar(); }
  }
};
