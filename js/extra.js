/* Tillegg: lesetekster, kyrillisk tastaturtrener, opptaksstudio for morsmålsbrukere og fri AI-samtale. */
(() => {
  const E = RP.esc, R = s => E(RP.disp(s));
  const tr = s => RP.state.settings.translit ? `<div class="tl">${E(RP.translit(RP.disp(s)))}</div>` : '';
  const say = (t, o) => RP.speech.speak(t, o);
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // AI (Claude via claude.ai) – kun tilgjengelig når appen kjører som Artifact
  if (window.claude && window.claude.use) window.claude.use('sample').then(s => { if (s) RP.ai = s; }).catch(() => { });

  /* ================= LESETEKST ================= */
  RP.views.reading = {
    render([id]) {
      const r = (RP.READINGS || []).find(x => x.id === id);
      if (!r || !RP.readingUnlocked(r)) { location.hash = '#/map'; return; }
      this.r = r; this.sel = 0; this.phase = 'read'; this.showNo = false; this.token = 0;
      q('#main').innerHTML = `<article class="reading-page">
        <header class="lesson-head ornament"><a class="back" href="#/map" aria-label="Lukk">✕</a><div class="lh-icon">${r.icon}</div>
          <div class="lh-title"><h1>${R(r.ru)}</h1><p>Lesetekst · ${E(r.no)}</p></div></header>
        <div class="toolbar"><button class="btn primary" data-act="all" id="rall">▶ Les opp alt</button>
          <button class="btn toggle" data-act="no" id="rno">🇳🇴 Oversettelse</button></div>
        <div class="text-paper scroll-paper hide-no" id="rtext">${r.text.map(([ru, no], i) => `<p class="sline ${i ? '' : 'sel'}" data-act="line" data-i="${i}"><span class="ru">${R(ru)}</span> <span class="no">${E(no)}</span></p>`).join('')}</div>
        <div class="sec-foot cta"><button class="btn primary big" data-act="quiz">Til spørsmålene →</button></div></article>`;
    },
    select(i) { this.sel = Math.max(0, Math.min(this.r.text.length - 1, i)); qa('.sline').forEach((n, j) => n.classList.toggle('sel', j === this.sel)); qa('.sline')[this.sel].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); },
    async line(i, tok) { this.select(i); qa('.sline')[i].classList.add('playing'); await say(this.r.text[i][0]); const n = qa('.sline')[i]; n && n.classList.remove('playing'); return tok === this.token; },
    async all() {
      if (this.playing) return this.stop();
      const tok = ++this.token; this.playing = true; q('#rall').innerHTML = `■ Stopp`;
      for (let i = this.sel; i < this.r.text.length; i++) { if (!(await this.line(i, tok))) return; }
      this.stop();
    },
    stop() { this.token++; this.playing = false; RP.speech.stop(); const b = q('#rall'); if (b) b.innerHTML = `▶ Les opp alt`; qa('.sline').forEach(n => n.classList.remove('playing')); },
    startQuiz() {
      this.stop(); this.phase = 'quiz'; this.qi = 0; this.ok = 0;
      this.items = this.r.quiz.map(([qq, c, ...w]) => ({ q: qq, c, o: RP.shuffle([c, ...w]) }));
      this.showQ();
    },
    showQ() {
      const it = this.items[this.qi]; this.answered = false;
      q('#main').innerHTML = `<div class="quiz"><div class="qbar"><div class="bar"><i style="width:${this.qi / this.items.length * 100}%"></i></div><span>${this.qi + 1}/${this.items.length}</span></div>
        <div class="qcard"><h2>${E(it.q)}</h2><div class="opts">${it.o.map((o, k) => `<button class="opt" data-act="pick" data-k="${k}"><span><b>${R(o)}</b></span></button>`).join('')}</div></div>
        <div class="feedback" id="fb"></div></div>`;
    },
    pick(k) {
      const it = this.items[this.qi]; if (this.answered || k >= it.o.length) return; this.answered = true;
      const good = it.o[k] === it.c; if (good) this.ok++;
      qa('.opt').forEach((b, j) => { b.disabled = true; if (it.o[j] === it.c) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
      RP.sfx(good ? 'ok' : 'bad');
      q('#fb').className = 'feedback show ' + (good ? 'good' : 'bad');
      q('#fb').innerHTML = `<b>${good ? RP.skin().cheers[this.qi % 4] : 'Riktig svar: ' + R(it.c)}</b><button class="btn primary big" data-act="next">${good ? 'Neste →' : 'Fortsett →'}</button>`;
      if (good) this.auto = setTimeout(() => this.next(), 1100);
    },
    next() {
      clearTimeout(this.auto);
      if (!this.answered) return;
      this.answered = false;
      if (++this.qi < this.items.length) return this.showQ();
      const pct = Math.round(this.ok / this.items.length * 100), prev = RP.state.readings[this.r.id] || 0;
      RP.state.readings[this.r.id] = Math.max(prev, pct); RP.save();
      if (!prev && pct >= 50) RP.addXP(20 + this.ok * 5, 'Lesetekst'); else RP.checkBadges();
      if (pct === 100) RP.ui.confetti();
      this.phase = 'done';
      q('#main').innerHTML = `<div class="result ornament"><h2>${pct >= 50 ? 'Прочитано!' : 'Почти!'}</h2><p class="big">${this.ok} av ${this.items.length} riktige (${pct} %)</p>
        <div class="row stack"><a class="btn primary big" href="#/map">Til kartet →</a><button class="btn" data-act="again">↻ Les igjen</button></div></div>`;
    },
    act(a, el) {
      if (a === 'all') this.all();
      if (a === 'line') { this.stop(); this.line(+el.dataset.i, this.token); }
      if (a === 'no') { this.showNo = !this.showNo; q('#rtext').classList.toggle('hide-no', !this.showNo); el.classList.toggle('on', this.showNo); }
      if (a === 'quiz') this.startQuiz();
      if (a === 'pick') this.pick(+el.dataset.k);
      if (a === 'next') this.next();
      if (a === 'again') this.render([this.r.id]);
    },
    cleanup() { this.stop(); clearTimeout(this.auto); }
  };

  /* ================= TASTATURTRENER (ЙЦУКЕН) ================= */
  const ROWS = [
    [['Backquote', 'ё', '|']].concat('KeyQ:й:Q KeyW:ц:W KeyE:у:E KeyR:к:R KeyT:е:T KeyY:н:Y KeyU:г:U KeyI:ш:I KeyO:щ:O KeyP:з:P BracketLeft:х:Å BracketRight:ъ:¨'.split(' ').map(x => x.split(':'))),
    'KeyA:ф:A KeyS:ы:S KeyD:в:D KeyF:а:F KeyG:п:G KeyH:р:H KeyJ:о:J KeyK:л:K KeyL:д:L Semicolon:ж:Ø Quote:э:Æ'.split(' ').map(x => x.split(':')),
    'KeyZ:я:Z KeyX:ч:X KeyC:с:C KeyV:м:V KeyB:и:B KeyN:т:N KeyM:ь:M Comma:б:, Period:ю:.'.split(' ').map(x => x.split(':'))
  ];
  const CODE2RU = {}; ROWS.flat().forEach(([c, r]) => { CODE2RU[c] = r; });
  const RU2CODE = {}; ROWS.flat().forEach(([c, r]) => { RU2CODE[r] = c; });

  RP.views.keyboard = {
    render() {
      const pool = [...new Set(Object.keys(RP.state.srs).concat(RP.LESSONS.slice(0, 3).flatMap(l => l.vocab.map(v => v[0])))
        .map(w => RP.unstress(w).toLowerCase()).filter(w => /^[а-яё]{2,12}$/.test(w)))];
      const no = {}; RP.LESSONS.forEach(l => l.vocab.forEach(([r, n]) => { no[RP.unstress(r).toLowerCase()] = n; }));
      this.words = RP.shuffle(pool).slice(0, 10).map(w => ({ w, no: no[w] || (RP.state.srs[w] || {}).no || '' }));
      this.i = 0; this.typed = ''; this.err = 0; this.chars = 0; this.t0 = 0;
      q('#main').innerHTML = `<section class="kb-page"><header class="page-head ornament"><h1>Русская клавиатура</h1>
        <p>Lær det russiske ЙЦУКЕН-oppsettet – det samme som på russisk mobiltastatur. Trykk tastene for å skrive ordet. Den lyse tasten er neste bokstav.</p></header>
        <div class="kb-target ornament"><div class="kb-word" id="kbw"></div><div class="muted" id="kbno"></div><div class="kb-typed" id="kbt"></div>
        <div class="kb-stats" id="kbs"></div></div>
        <div class="kb">${ROWS.map(row => `<div class="kb-row">${row.map(([c, r]) => `<button class="key" data-act="press" data-code="${c}">${r}</button>`).join('')}</div>`).join('')}</div>
        <div class="row stack"><button class="btn" data-act="skip">⏭ Hopp over ordet</button></div></section>`;
      this.show();
    },
    cur() { return this.words[this.i]; },
    show() {
      const c = this.cur(); if (!c) return this.finish();
      q('#kbw').innerHTML = c.w.split('').map((ch, j) => `<span class="${j < this.typed.length ? 'done' : j === this.typed.length ? 'next' : ''}">${E(ch)}</span>`).join('');
      q('#kbno').textContent = `${this.i + 1}/${this.words.length} · ${c.no}`;
      q('#kbt').textContent = this.typed || ' ';
      const need = c.w[this.typed.length];
      qa('.key').forEach(k => k.classList.toggle('hint', k.dataset.code === RU2CODE[need] || (need === 'ё' && k.dataset.code === 'Backquote')));
      const min = this.t0 ? (Date.now() - this.t0) / 60000 : 0;
      q('#kbs').innerHTML = `⚡ ${min > 0.05 ? Math.round(this.chars / 5 / min) : '–'} ord/min · 🎯 ${this.chars + this.err ? Math.round(this.chars / (this.chars + this.err) * 100) : 100} % · ❌ ${this.err}`;
    },
    press(code) {
      const c = this.cur(); if (!c) return;
      const ch = CODE2RU[code], el = q(`.key[data-code="${code}"]`);
      if (!ch) return;
      if (!this.t0) this.t0 = Date.now();
      const need = c.w[this.typed.length];
      if (ch === need || (need === 'ё' && ch === 'е')) {
        this.typed += need; this.chars++; el && el.classList.add('ok');
        if (this.typed === c.w) { RP.sfx('ok'); say(c.w, { auto: true }); this.i++; this.typed = ''; RP.state.kb.words++; }
      } else { this.err++; RP.sfx('bad'); el && el.classList.add('bad'); }
      setTimeout(() => el && el.classList.remove('ok', 'bad'), 180);
      this.show();
    },
    finish() {
      const min = this.t0 ? (Date.now() - this.t0) / 60000 : 0, wpm = min > 0.05 ? Math.round(this.chars / 5 / min) : 0, acc = this.chars ? Math.round(this.chars / (this.chars + this.err) * 100) : 0;
      RP.state.kb.best = Math.max(RP.state.kb.best, wpm); RP.save();
      RP.addXP(Math.max(5, this.i * 2), 'Tastatur');
      q('.kb-target').innerHTML = `<h2>Готово!</h2><p class="big">⚡ ${wpm} ord/min · 🎯 ${acc} %</p><p class="muted">Rekord: ${RP.state.kb.best} ord/min · ${RP.state.kb.words} ord totalt</p>
        <button class="btn primary big" data-act="again">Ny runde →</button>`;
      this.done = true;
    },
    act(a, el) {
      if (a === 'again') { this.done = false; this.render(); }
      if (a === 'press' && !this.done) this.press(el.dataset.code);
      if (a === 'skip' && !this.done) { this.i++; this.typed = ''; this.show(); }
    },
  };

  /* ================= OPPTAKSSTUDIO ================= */
  const idb = (() => {
    let dbp;
    const open = () => dbp = dbp || new Promise((res, rej) => { const r = indexedDB.open('govorushka-studio', 1); r.onupgradeneeded = () => r.result.createObjectStore('rec'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    const tx = (mode, fn) => open().then(db => new Promise((res, rej) => { const t = db.transaction('rec', mode), st = t.objectStore('rec'), out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }));
    return { put: (k, v) => tx('readwrite', s => s.put(v, k)), del: k => tx('readwrite', s => s.delete(k)), keys: () => tx('readonly', s => s.getAllKeys()), get: k => tx('readonly', s => s.get(k)) };
  })();

  // ZIP (lagringsmetode, uten komprimering) – nok for lydfiler som allerede er komprimert
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  RP.makeZip = files => {
    const enc = new TextEncoder(), parts = [], central = []; let off = 0;
    for (const f of files) {
      const name = enc.encode(f.name), d = f.data, crc = crc32(d), h = new DataView(new ArrayBuffer(30));
      [[0, 0x04034b50, 4], [4, 20, 2], [8, 0, 2], [14, crc, 4], [18, d.length, 4], [22, d.length, 4], [26, name.length, 2]].forEach(([o, v, z]) => z === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
      parts.push(new Uint8Array(h.buffer), name, d);
      const c = new DataView(new ArrayBuffer(46));
      [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [16, crc, 4], [20, d.length, 4], [24, d.length, 4], [28, name.length, 2], [42, off, 4]].forEach(([o, v, z]) => z === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
      central.push(new Uint8Array(c.buffer), name);
      off += 30 + name.length + d.length;
    }
    const csize = central.reduce((a, b) => a + b.length, 0), end = new DataView(new ArrayBuffer(22));
    [[0, 0x06054b50, 4], [8, files.length, 2], [10, files.length, 2], [12, csize, 4], [16, off, 4]].forEach(([o, v, z]) => z === 4 ? end.setUint32(o, v, true) : end.setUint16(o, v, true));
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' });
  };

  RP.views.studio = {
    items() {
      const out = [], seen = new Set();
      const add = (group, text, who) => { const k = RP.audioKey(text); if (seen.has(k) || !RP.normalize(text)) return; seen.add(k); out.push({ group, text, who, k }); };
      for (const L of RP.LESSONS) {
        const g = `${L.id}. ${RP.unstress(L.ru)}`;
        L.dialog.forEach(([who, ru]) => add(g, ru, who)); L.vocab.forEach(([ru]) => add(g, ru));
        L.rp.steps.forEach(s => { add(g, s.b, L.rp.bot); add(g, s.m); });
      }
      (RP.READINGS || []).forEach(r => r.text.forEach(([ru]) => add('📜 ' + RP.unstress(r.ru), ru)));
      return out;
    },
    async render() {
      this.list = this.items(); this.sel = this.sel || 0; this.onlyMissing = !!this.onlyMissing;
      try { this.rec = new Set(await idb.keys()); } catch (e) { this.rec = new Set(); }
      this.draw();
    },
    has(k) { return this.rec.has(k) || !!(RP.AUDIO && RP.AUDIO[k]); },
    draw() {
      const total = this.list.length, done = this.list.filter(x => this.has(x.k)).length;
      const vis = this.list.map((x, i) => ({ ...x, i })).filter(x => !this.onlyMissing || !this.has(x.k));
      let g = '';
      q('#main').innerHTML = `<section class="studio"><header class="page-head ornament"><div><h1>🎙️ Студия</h1>
        <p>For morsmålsbrukere: les inn hver replikk og hvert ord. Opptakene brukes i appen foran syntetisk stemme. ${done}/${total} ferdig (${this.rec.size} nye i denne nettleseren).</p>
        <div class="bar"><i style="width:${done / total * 100}%"></i></div></div></header>
        <div class="toolbar"><button class="btn primary" data-act="rec">● Ta opp / stopp</button>
          <button class="btn" data-act="play">▶ Spill opptak</button>
          <button class="btn" data-act="nextmiss">⏭ Neste uten opptak</button>
          <button class="btn toggle ${this.onlyMissing ? 'on' : ''}" data-act="filter">Bare manglende</button>
          <button class="btn" data-act="del">🗑 Slett opptak</button>
          <button class="btn" data-act="export">⬇ Eksporter ZIP</button></div>
        <p class="muted small" id="stmsg">Mikrofonen spør om tillatelse første gang. Studioet virker best lokalt eller på GitHub Pages i Chrome/Edge – inne i claude.ai er mikrofonopptak normalt blokkert.</p>
        <div class="studio-list">${vis.map(x => {
          const head = x.group !== g ? `<h3>${E(x.group)}</h3>` : ''; g = x.group;
          const st = this.rec.has(x.k) ? '🎙️' : RP.AUDIO && RP.AUDIO[x.k] ? '✅' : '○';
          return `${head}<div class="srow ${x.i === this.sel ? 'sel' : ''}" data-act="sel" data-i="${x.i}"><span class="st">${st}</span><span class="ru">${R(x.text)}</span>${x.who ? `<small class="muted">${E(x.who)}</small>` : ''}</div>`;
        }).join('')}</div></section>`;
      const s = q('.srow.sel'); s && s.scrollIntoView({ block: 'center' });
    },
    move(d) {
      const vis = this.list.map((x, i) => i).filter(i => !this.onlyMissing || !this.has(this.list[i].k));
      const p = vis.indexOf(this.sel), n = vis[Math.max(0, Math.min(vis.length - 1, (p < 0 ? 0 : p + d)))];
      if (n === undefined) return;
      this.sel = n; qa('.srow').forEach(r => r.classList.toggle('sel', +r.dataset.i === n)); const s = q('.srow.sel'); s && s.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
    async toggleRec() {
      if (this.mr && this.mr.state === 'recording') { this.mr.stop(); return; }
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
      catch (e) { q('#stmsg').textContent = '⚠️ Fikk ikke tilgang til mikrofonen: ' + (e.message || e.name); return; }
      const item = this.list[this.sel], chunks = [];
      this.mr = new MediaRecorder(stream);
      this.mr.ondataavailable = e => e.data.size && chunks.push(e.data);
      this.mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: this.mr.mimeType || 'audio/webm' });
        await idb.put(item.k, blob); this.rec.add(item.k); RP.sfx('ok');
        const auto = this.list.findIndex((x, i) => i > this.sel && !this.has(x.k));
        if (auto >= 0) this.sel = auto;
        this.draw();
      };
      this.mr.start();
      const row = q('.srow.sel'); row && row.classList.add('recording');
      q('#stmsg').innerHTML = '<span class="rec">● Tar opp … trykk ● igjen for å stoppe</span>';
    },
    async play() {
      const item = this.list[this.sel];
      const blob = await idb.get(item.k).catch(() => null);
      if (blob) { const a = new Audio(URL.createObjectURL(blob)); a.play(); } else say(item.text, { gender: RP.GENDER[item.who] || 'f' });
    },
    async exportZip() {
      const keys = [...this.rec]; if (!keys.length) { RP.ui.toast('Ingen nye opptak å eksportere'); return; }
      const files = [], map = { ...(RP.AUDIO || {}) };
      for (const k of keys) {
        const b = await idb.get(k); if (!b) continue;
        const ext = /mp4|m4a|aac/.test(b.type) ? 'm4a' : /ogg/.test(b.type) ? 'ogg' : 'webm';
        files.push({ name: `audio/${k}.${ext}`, data: new Uint8Array(await b.arrayBuffer()) }); map[k] = `audio/${k}.${ext}`;
      }
      const js = `/* Innspilte morsmålsopptak: lydnøkkel (RP.audioKey) → fil. Generert av opptaksstudioet. */\nwindow.RP = window.RP || {};\nRP.AUDIO = ${JSON.stringify(map, null, 1)};\n`;
      files.push({ name: 'js/data/audio.js', data: new TextEncoder().encode(js) });
      const a = document.createElement('a'); a.href = URL.createObjectURL(RP.makeZip(files)); a.download = `govorushka-opptak-${RP.today()}.zip`; a.click();
      q('#stmsg').textContent = `✅ Eksporterte ${keys.length} opptak. Pakk ut ZIP-filen i prosjektmappen (den lager audio/ og oppdaterer js/data/audio.js) og commit.`;
    },
    act(a, el) {
      if (a === 'sel') { this.sel = +el.dataset.i; this.draw(); }
      if (a === 'rec') this.toggleRec();
      if (a === 'play') this.play();
      if (a === 'nextmiss') { const n = this.list.findIndex((x, i) => i > this.sel && !this.has(x.k)); if (n >= 0) { this.sel = n; this.draw(); } }
      if (a === 'filter') { this.onlyMissing = !this.onlyMissing; this.draw(); }
      if (a === 'del') { const k = this.list[this.sel].k; idb.del(k).then(() => { this.rec.delete(k); this.draw(); }); }
      if (a === 'export') this.exportZip();
    },
    cleanup() { if (this.mr && this.mr.state === 'recording') this.mr.stop(); }
  };

  /* ================= FRI PRAT MED AI ================= */
  RP.sections.chat = {
    render(L) {
      this.L = L; this.msgs = []; this.turns = 0; this.busy = false; this.counted = false; this.started = false;
      const lvl = L.id <= 12 ? 'A1' : L.id <= 20 ? 'A2' : 'B1';
      this.lvl = lvl;
      q('#sec').innerHTML = `<div class="rp">
        <div class="rp-intro ornament"><div class="avatar big g-${RP.GENDER[L.rp.bot] || 'f'}">🤖</div><div>
          <h2>Fri prat med ${E(L.rp.bot)}</h2>
          <p>Snakk fritt på russisk om temaet «${E(L.no)}». ${E(L.rp.bot)} (spilt av Claude) svarer kort på nivå ${lvl}, med ordene fra leksjonen, og retter feilene dine på norsk.</p>
          <p class="muted small">Krever claude.ai. Hver replikk bruker en melding fra din Claude-kvote.</p>
          <button class="btn primary big" data-act="start">▶ Start samtalen</button></div></div>
        <div class="chat" id="chat"></div>
        <div class="rp-controls" id="rpc" hidden>
          <div class="hintbox" id="hint"></div>
          <div class="row">${RP.speech.sttOK ? `<button class="mic" data-act="mic" id="mic" title="Snakk">🎤</button>` : ''}
            <form id="chatform" class="qform"><input id="rpin" class="answer" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="Skriv på russisk …"><button class="btn">Send</button></form></div>
          <div class="row small-btns"><button class="btn ghost" data-act="again">🔊 Hør igjen</button><button class="btn ghost" data-act="trans">🇳🇴 Oversett</button></div>
        </div></div>`;
      q('#chatform').onsubmit = e => { e.preventDefault(); this.act('send'); };
    },
    bubble(who, html, cls = '') {
      const d = document.createElement('div'); d.className = `msg ${who} ${cls}`;
      d.innerHTML = who === 'bot' ? `<div class="avatar g-${RP.GENDER[this.L.rp.bot] || 'f'}">${E(this.L.rp.bot[0])}</div><div class="bubble">${html}</div>` : `<div class="bubble">${html}</div>`;
      q('#chat').appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' }); return d;
    },
    prompt() {
      const L = this.L, vocab = L.vocab.map(v => RP.unstress(v[0]) + ' = ' + v[1]).join('; ');
      const log = this.msgs.map(m => (m.role === 'bot' ? L.rp.bot : 'Elev') + ': ' + m.text).join('\n');
      return `Du er ${L.rp.bot}, en vennlig russisk samtalepartner i en språkapp for norske elever. Scenario: ${L.intro} Sted: ${L.place}.
Elevens nivå: ${this.lvl} (CEFR). Leksjonens ordforråd: ${vocab}. Grammatikk i leksjonen: ${L.grammar.title}.
Regler: Svar ALLTID på enkel russisk på elevens nivå, 1–2 korte setninger, og still gjerne et oppfølgingsspørsmål så samtalen går videre. Hold deg til scenariet. Bruk ordforrådet.
${log ? 'Samtalen så langt:\n' + log + '\n' : 'Start samtalen med en naturlig hilsen og et spørsmål som passer scenariet.\n'}
Svar KUN med JSON: {"ru": "din replikk på russisk", "no": "norsk oversettelse av replikken", "feedback": "${log ? 'kort, vennlig retting på norsk av feil i elevens SISTE replikk (grammatikk, ordvalg), eller tom streng hvis den var riktig' : ''}"}`;
    },
    async ask() {
      if (!RP.ai) { q('#hint').textContent = 'AI-samtale er bare tilgjengelig i claude.ai.'; return; }
      this.busy = true; const wait = this.bubble('bot', '<span class="rec">…</span>');
      try {
        const r = await RP.ai.json(this.prompt(), { modelTier: 'quick', cache: false });
        wait.remove();
        if (r.feedback && this.lastMe) this.lastMe.insertAdjacentHTML('beforeend', `<div class="fbk">💡 ${E(r.feedback)}</div>`);
        this.msgs.push({ role: 'bot', text: r.ru });
        this.bubble('bot', `<div class="ru">${E(r.ru)}</div>${tr(r.ru)}<div class="no" hidden>${E(r.no || '')}</div>`);
        q('#rpc').hidden = false;
        say(r.ru, { gender: RP.GENDER[this.L.rp.bot] || 'f', auto: true });
      } catch (e) {
        wait.remove();
        const c = e && e.code;
        q('#hint').textContent = c === 'not_granted' ? 'AI-samtale er slått av for denne siden.' : c === 'rate_limited' ? 'For mange forespørsler – vent litt og prøv igjen.' : 'Fikk ikke svar fra Claude. Prøv igjen.';
        q('#rpc').hidden = false;
      }
      this.busy = false;
    },
    send(text) {
      text = (text || '').trim(); if (!text || this.busy) return;
      this.lastMe = this.bubble('me', `<div class="ru">${E(text)}</div>`);
      this.msgs.push({ role: 'me', text }); this.turns++;
      if (this.turns <= 6) RP.addXP(5, 'Fri prat');
      if (this.turns === 4 && !this.counted) { this.counted = true; RP.state.stats.chats++; RP.save(); RP.checkBadges(); }
      this.ask();
    },
    async mic() {
      if (this.busy || !this.started) return;
      if (RP.speech.listening) { RP.speech.stopListening(); return; }
      const m = q('#mic'); m && m.classList.add('on');
      try { const alts = await RP.speech.listen(t => { q('#hint').innerHTML = `<span class="rec">● ${E(t)}</span>`; }); q('#hint').textContent = ''; if (alts.length) this.send(alts[0]); }
      catch (err) { RP.ui.toast(RP.micErrorText(err)); }
      m && m.classList.remove('on');
    },
    act(a) {
      if (a === 'start') { if (this.started) return; this.started = true; const b = q('.rp-intro button'); b && b.remove(); this.ask(); }
      if (a === 'send') { const i = q('#rpin'); this.send(i.value); i.value = ''; }
      if (a === 'mic') this.mic();
      if (a === 'again') { const m = [...this.msgs].reverse().find(x => x.role === 'bot'); m && say(m.text, { gender: RP.GENDER[this.L.rp.bot] || 'f' }); }
      if (a === 'trans') { const n = qa('#chat .msg.bot .no'); n.length && (n[n.length - 1].hidden = !n[n.length - 1].hidden); }
    },
  };
})();
