/* Glosebok (russisk–norsk ordbok) og Avis.
   Ordboka (data/dict.json) bygges fra OpenRussian.org (CC-BY-SA 4.0) med tools/build-dictionary.py og lastes ved behov.
   Hvert oppslagsord: w (med ' etter trykkvokal), p (n/v/a/o), no, en, g/an/ind (substantiv), asp/pr (verb), f (bøyning), x (ekstra former).
   Trykk på et russisk ord i avisa (eller lesetekster) viser ordkortet: grunnform, oversettelse og hvilken bøyningsform det er. */
(() => {
  const E = RP.esc, $ = s => document.querySelector(s);
  const ACUTE = '́';
  const bare = s => String(s).replace(/'/g, '').replace(/́/g, '').replace(/ё/g, 'е').toLowerCase().trim();
  const acc = s => String(s).replace(/'/g, ACUTE);
  const show = s => RP.state.settings.stress ? acc(s) : String(s).replace(/'/g, '');
  const keyOf = e => bare(e.w) + '|' + e.p;

  const CASES = ['Nominativ', 'Genitiv', 'Dativ', 'Akkusativ', 'Instrumental', 'Preposisjonal'];
  const CASE_SHORT = ['nom.', 'gen.', 'dat.', 'akk.', 'instr.', 'prep.'];
  const GENDER = { m: 'hankjønn', f: 'hunkjønn', n: 'intetkjønn' };
  const POS = { n: 'substantiv', v: 'verb', a: 'adjektiv', o: 'annet ord' };
  const VERB_SLOTS = ['я', 'ты', 'он/она', 'мы', 'вы', 'они', 'fortid hankjønn', 'fortid hunkjønn', 'fortid intetkjønn', 'fortid flertall', 'imperativ (du)', 'imperativ (dere/De)'];
  const ADJ_G = ['hankjønn', 'hunkjønn', 'intetkjønn', 'flertall'];

  // Navn på hver bøyningsform, brukt for å forklare hva et trykket ord er
  const slotName = (e, i) => {
    if (e.p === 'n') return `${CASE_SHORT[i % 6]} ${i < 6 ? 'entall' : 'flertall'}`;
    if (e.p === 'v') return i < 6 ? `${e.asp === 'pf' ? 'fremtid' : 'nåtid'}, ${VERB_SLOTS[i]}` : VERB_SLOTS[i];
    if (e.p === 'a') return i < 24 ? `${CASE_SHORT[i % 6]} ${ADJ_G[Math.floor(i / 6)]}` : ['kortform hankjønn', 'kortform hunkjønn', 'kortform intetkjønn', 'kortform flertall', 'komparativ', 'superlativ'][i - 24];
    return 'form';
  };

  const D = RP.dict = {
    entries: null, index: null, accent: null, loading: null,
    load() {
      if (D.entries) return Promise.resolve(D);
      return D.loading || (D.loading = fetch('data/dict.json').then(r => r.json()).then(j => {
        D.entries = j.e; D.index = new Map(); D.accent = new Map(); D.byKey = new Map();
        j.e.forEach((e, i) => {
          D.byKey.set(keyOf(e), i);
          const forms = [[e.w, -1], ...(e.f || []).flatMap((f, k) => f.split(/,\s*/).map(x => [x, k])), ...(e.x ? e.x.split(/,\s*/).map(x => [x, -2]) : [])];
          for (const [f, k] of forms) {
            const b = bare(f); if (!b) continue;
            if (!D.index.has(b)) D.index.set(b, []);
            const l = D.index.get(b); if (!l.some(h => h.i === i)) l.push({ i, k });
            // Trykkplassering for visning: bare når alle treff er enige
            const a = f.trim();
            if (a.includes("'")) { const prev = D.accent.get(b); D.accent.set(b, prev === undefined || prev === a ? a : null); }
          }
        });
        return D;
      }).catch(e => { D.loading = null; throw e; }));
    },
    /* Oppslag på en bøyd form. Sorterer slik at grunnform-treff og vanlige ord kommer først. */
    lookup(word) {
      if (!D.index) return [];
      const hits = D.index.get(bare(word)) || [];
      return hits.map(h => ({ e: D.entries[h.i], i: h.i, slot: h.k }))
        .sort((a, b) => (a.slot === -1 ? -1 : 0) - (b.slot === -1 ? -1 : 0) || a.i - b.i);
    },
    /* Hvilke bøyningsformer et ord kan være i et oppslagsord (f.eks. «gen. entall, nom. flertall») */
    forms(e, word) {
      const b = bare(word), out = [];
      if (bare(e.w) === b) out.push(e.p === 'v' ? 'infinitiv' : e.p === 'n' ? 'nom. entall' : e.p === 'a' ? 'nom. hankjønn' : 'grunnform');
      (e.f || []).forEach((f, k) => { if (f.split(/,\s*/).some(x => bare(x) === b)) { const n = slotName(e, k); if (!out.includes(n)) out.push(n); } });
      if (e.x && e.x.split(/,\s*/).some(x => bare(x) === b) && !out.length) out.push('bøyd form');
      return out;
    },
    stressed(word) { // legg på trykk fra ordboka når plasseringen er entydig
      if (!D.accent) return word;
      const a = D.accent.get(bare(word));
      if (!a || /ё/i.test(word) || (word.match(/[аеиоуыэюяё]/gi) || []).length < 2) return word; // ikke trykk på enstavelsesord
      const s = acc(a);
      return word[0] !== word[0].toLowerCase() ? s[0].toUpperCase() + s.slice(1) : s;
    },
    /* Gjør russisk tekst trykkbar: hvert ord blir en knapp som åpner ordkortet */
    tap(text) {
      return String(text).split(/([А-Яа-яЁё́]+(?:-[А-Яа-яЁё́]+)*)/).map((part, i) => {
        if (i % 2 === 0) return E(part);
        let w = part;
        if (RP.state.settings.stress && !w.includes(ACUTE)) w = D.stressed(w);
        if (!RP.state.settings.stress) w = RP.unstress(w);
        return `<span class="w" role="button" tabindex="0" data-w="${E(RP.unstress(part))}">${E(w)}</span>`;
      }).join('');
    },
    search(q) {
      q = q.trim(); if (!q || !D.entries) return [];
      const cyr = /[а-яё]/i.test(q), res = [], seen = new Set();
      const push = i => { if (!seen.has(i) && res.length < 60) { seen.add(i); res.push(i); } };
      if (cyr) {
        const b = bare(q);
        (D.index.get(b) || []).forEach(h => push(h.i)); // bøyd form → oppslagsord
        D.entries.forEach((e, i) => { if (bare(e.w).startsWith(b)) push(i); });
      } else {
        const n = RP.normalize(q), lq = q.toLowerCase().replace(/^å /, ''), esc = lq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Latinsk skrift kan være norsk eller translitterert russisk. Rangering: eksakt norsk betydning,
        // eksakt translitterasjon, norsk ordstart, translitterasjon som begynner med søket.
        const exactNo = new RegExp('(^|[,;]\\s*)(å )?' + esc + '($|[,;(])', 'i'), startNo = new RegExp('(^|[\\s,;(])(å )?' + esc, 'i');
        const tr = e => RP.normalize(bare(e.w));
        D.entries.forEach((e, i) => { if (e.no && exactNo.test(e.no)) push(i); });
        D.entries.forEach((e, i) => { if (tr(e) === n) push(i); });
        D.entries.forEach((e, i) => { if (e.no && startNo.test(e.no)) push(i); });
        D.entries.forEach((e, i) => { if (tr(e).startsWith(n)) push(i); });
      }
      return res;
    },
    saved() { const d = RP.state.dict || (RP.state.dict = { saved: [], hist: [] }); return d; },
    isSaved(k) { return D.saved().saved.includes(k); },
    toggleSave(e) {
      const d = D.saved(), k = keyOf(e), ru = acc(e.w);
      if (d.saved.includes(k)) { d.saved = d.saved.filter(x => x !== k); RP.ui.toast('Fjernet fra Mine ord'); }
      else {
        d.saved.unshift(k);
        if (e.no) RP.srsAdd('dict', [[ru, e.no]]); // kommer også i repetisjonsbunken
        RP.ui.toast('⭐ Lagt til i Mine ord og repetisjon');
      }
      RP.save();
    },
    visit(e) { const d = D.saved(), k = keyOf(e); d.hist = [k, ...d.hist.filter(x => x !== k)].slice(0, 30); RP.save(); },
    label(e) {
      const bits = [POS[e.p]];
      if (e.p === 'n') { if (GENDER[e.g]) bits.push(GENDER[e.g]); if (e.an) bits.push('levende'); if (e.ind) bits.push('ubøyelig'); }
      if (e.p === 'v' && e.asp) bits.push(e.asp === 'pf' ? 'perfektiv' : 'imperfektiv');
      return bits.join(' · ');
    },
    /* Sentenser fra kurset og avisa som inneholder ordet (eksempler, som i en ordbok) */
    examples(e, max = 4) {
      const forms = new Set([bare(e.w), ...(e.f || []).flatMap(f => f.split(/,\s*/).map(bare)), ...(e.x ? e.x.split(/,\s*/).map(bare) : [])].filter(Boolean));
      if (!D.sents) {
        D.sents = [];
        RP.LESSONS.forEach(L => L.dialog.forEach(([, ru, no]) => D.sents.push([ru, no, `Leksjon ${L.id}`])));
        (RP.READINGS || []).forEach(r => r.text.forEach(([ru, no]) => D.sents.push([ru, no, r.no])));
        (RP.NEWS || []).forEach(n => n.p.forEach(([ru, no]) => D.sents.push([ru, no, 'Avis'])));
      }
      const out = [];
      for (const s of D.sents) {
        const ws = (RP.unstress(s[0]).match(/[А-Яа-яЁё]+/g) || []).map(bare);
        if (ws.some(w => forms.has(w))) { out.push(s); if (out.length >= max) break; }
      }
      return out;
    }
  };

  /* ---------- Ordkort (ark nederst) ---------- */
  D.sheet = async (word, el) => {
    $$('.w.on').forEach(x => x.classList.remove('on')); el && el.classList.add('on');
    let sh = $('#wsheet');
    if (!sh) {
      sh = document.createElement('div'); sh.id = 'wsheet'; sh.className = 'wsheet';
      document.body.appendChild(sh);
      sh.addEventListener('click', ev => {
        const b = ev.target.closest('[data-wa]'); if (!b) { if (ev.target === sh) D.close(); return; }
        const a = b.dataset.wa, e = D.cur && D.cur.e;
        if (a === 'close') D.close();
        if (a === 'say') RP.speech.speak(b.dataset.t || word);
        if (a === 'save' && e) { D.toggleSave(e); b.textContent = D.isSaved(keyOf(e)) ? '★ Lagret' : '☆ Lagre'; }
        if (a === 'open' && e) { D.close(); location.hash = '#/dict/' + encodeURIComponent(keyOf(e)); }
        if (a === 'alt') { D.cur = D.cur.all[+b.dataset.i]; D.cur.all = D.curAll; draw(); }
      });
    }
    sh.innerHTML = '<div class="ws-card"><p class="muted">Slår opp …</p></div>'; sh.classList.add('show');
    try { await D.load(); } catch (e) { sh.innerHTML = '<div class="ws-card"><p>Glosebok kunne ikke lastes (krever nett første gang).</p><button class="btn" data-wa="close">Lukk</button></div>'; return; }
    const hits = D.lookup(word);
    D.curAll = hits; D.cur = hits[0] ? { ...hits[0], all: hits } : null; D.word = word;
    draw();
    function draw() {
      const c = D.cur;
      if (!c) {
        sh.innerHTML = `<div class="ws-card"><div class="ws-head"><b class="ws-w">${E(word)}</b><button class="ws-x" data-wa="close" aria-label="Lukk">✕</button></div>
          <p class="muted">Ordet finnes ikke i gloseboka (ofte et navn eller et sjeldent ord).</p>
          <div class="row"><button class="btn" data-wa="say" data-t="${E(word)}">🔊 Lytt</button></div></div>`;
        return;
      }
      const e = c.e, forms = D.forms(e, word);
      sh.innerHTML = `<div class="ws-card">
        <div class="ws-head"><span class="ws-form">${E(word)}${forms.length && bare(e.w) !== bare(word) ? ` <small>= ${E(forms.join(' / '))}</small>` : ''}</span><button class="ws-x" data-wa="close" aria-label="Lukk">✕</button></div>
        <div class="ws-lemma"><b class="ru">${E(show(e.w))}</b><button class="btn small" data-wa="say" data-t="${E(acc(e.w))}" aria-label="Lytt">🔊</button></div>
        <div class="ws-pos">${E(D.label(e))}${e.pr ? ` · par: ${E(e.pr)}` : ''}</div>
        <p class="ws-no">${E(e.no || e.en)}${e.no ? '' : ' <small class="muted">(eng.)</small>'}</p>
        ${D.curAll.length > 1 ? `<div class="ws-alt">Også: ${D.curAll.filter(h => h.i !== c.i).slice(0, 3).map(h => `<button class="chip" data-wa="alt" data-i="${D.curAll.indexOf(h)}">${E(show(h.e.w))} · ${E(POS[h.e.p])}</button>`).join('')}</div>` : ''}
        <div class="row"><button class="btn primary" data-wa="open">📕 Åpne i gloseboka</button><button class="btn" data-wa="save">${D.isSaved(keyOf(e)) ? '★ Lagret' : '☆ Lagre'}</button></div>
      </div>`;
    }
  };
  D.close = () => { const sh = $('#wsheet'); sh && sh.classList.remove('show'); $$('.w.on').forEach(x => x.classList.remove('on')); };
  const $$ = s => [...document.querySelectorAll(s)];
  // Trykk på ord hvor som helst i appen (avis, lesetekster, ordbokseksempler)
  document.addEventListener('click', ev => {
    const w = ev.target.closest('.w[data-w]');
    if (w && !ev.target.closest('#wsheet')) { ev.preventDefault(); ev.stopPropagation(); D.sheet(w.dataset.w, w); }
  }, true);
  window.addEventListener('hashchange', () => D.close());

  /* ---------- Bøyningstabeller ---------- */
  const cell = f => f ? f.split(/,\s*/).map(x => `<span>${E(show(x))}</span>`).join('<br>') : '–';
  D.tables = e => {
    const f = e.f || [];
    if (e.p === 'n' && !e.ind && f.some(Boolean)) return `<table class="dtab"><thead><tr><th></th><th>Entall</th><th>Flertall</th></tr></thead><tbody>
      ${CASES.map((c, i) => `<tr><th>${c}</th><td>${cell(f[i])}</td><td>${cell(f[i + 6])}</td></tr>`).join('')}</tbody></table>`;
    if (e.p === 'v' && f.some(Boolean)) return `<h3>${e.asp === 'pf' ? 'Fremtid' : 'Nåtid'}</h3><table class="dtab"><tbody>
      ${['я', 'ты', 'он / она́', 'мы', 'вы', 'они́'].map((p, i) => `<tr><th>${p}</th><td>${cell(f[i])}</td></tr>`).join('')}</tbody></table>
      <h3>Fortid</h3><table class="dtab"><tbody>${['hankjønn', 'hunkjønn', 'intetkjønn', 'flertall'].map((g, i) => `<tr><th>${g}</th><td>${cell(f[6 + i])}</td></tr>`).join('')}</tbody></table>
      <h3>Imperativ</h3><table class="dtab"><tbody><tr><th>du</th><td>${cell(f[10])}</td></tr><tr><th>dere / De</th><td>${cell(f[11])}</td></tr></tbody></table>`;
    if (e.p === 'a' && f.slice(0, 24).some(Boolean)) return `<table class="dtab adj"><thead><tr><th></th><th>m</th><th>f</th><th>n</th><th>fl.</th></tr></thead><tbody>
      ${CASES.map((c, i) => `<tr><th>${CASE_SHORT[i]}</th>${[0, 6, 12, 18].map(o => `<td>${cell(f[o + i])}</td>`).join('')}</tr>`).join('')}</tbody></table>
      ${f.slice(24, 28).some(Boolean) ? `<p><b>Kortform:</b> ${f.slice(24, 28).filter(Boolean).map(x => E(show(x))).join(' · ')}</p>` : ''}
      ${f[28] ? `<p><b>Komparativ:</b> ${E(show(f[28]))}${f[29] ? ` · <b>superlativ:</b> ${E(show(f[29]))}` : ''}</p>` : ''}`;
    if (e.x) return `<p><b>Former:</b> ${e.x.split(/,\s*/).map(x => E(show(x))).join(' · ')}</p>`;
    return '';
  };

  /* ---------- Visning: Glosebok ---------- */
  RP.views.dict = {
    async render([key]) {
      const main = $('#main');
      main.innerHTML = '<section class="card"><p class="muted">Laster gloseboka …</p></section>';
      try { await D.load(); } catch (err) { main.innerHTML = '<section class="card"><h1>📕 Glosebok</h1><p>Gloseboka kunne ikke lastes. Den krever nett første gang, deretter virker den offline.</p></section>'; return; }
      if (key) return this.entry(decodeURIComponent(key));
      const d = D.saved();
      main.innerHTML = `<section class="dict">
        <h1>📕 Glosebok</h1>
        <input id="dq" class="dsearch" type="search" inputmode="search" autocomplete="off" autocapitalize="off" spellcheck="false"
          placeholder="Søk på russisk, translitterert eller norsk" value="${E(this.q || '')}" enterkeyhint="search">
        <div id="dres"></div>
        <p class="muted small">${D.entries.length.toLocaleString('nb')} oppslagsord med bøyning og trykk · data fra <a href="https://en.openrussian.org" target="_blank" rel="noopener">OpenRussian.org</a> (CC-BY-SA 4.0)</p>
        <div class="row"><a class="btn" href="#/alphabet">Аа Alfabet</a><a class="btn" href="#/keyboard">⌨️ Tastaturtrener</a></div>
      </section>`;
      const inp = $('#dq'), list = ids => ids.map(i => {
        const e = D.entries[i];
        return `<a class="drow" href="#/dict/${encodeURIComponent(keyOf(e))}"><b class="ru">${E(show(e.w))}</b><span>${E(e.no || e.en)}</span><small>${E(POS[e.p])}</small></a>`;
      }).join('');
      const keys = ks => ks.map(k => D.byKey.get(k)).filter(i => i !== undefined);
      const draw = () => {
        const q = inp.value; this.q = q;
        if (q.trim()) { const r = D.search(q); $('#dres').innerHTML = r.length ? list(r) : '<p class="muted">Ingen treff.</p>'; return; }
        $('#dres').innerHTML = `<h2>⭐ Mine ord (${d.saved.length})</h2>${d.saved.length ? list(keys(d.saved)) : '<p class="muted">Trykk ☆ Lagre på et ord for å samle det her. Lagrede ord kommer også i repetisjonen.</p>'}
          ${d.hist.length ? `<h2>🕘 Sist sett</h2>${list(keys(d.hist.slice(0, 10)))}` : ''}`;
      };
      inp.addEventListener('input', draw); draw();
    },
    entry(k) {
      const i = D.byKey.get(k), e = D.entries[i];
      if (!e) { location.hash = '#/dict'; return; }
      D.visit(e);
      const ex = D.examples(e), pr = e.pr && D.search(e.pr).map(j => D.entries[j]).find(x => bare(x.w) === bare(e.pr) && x.p === e.p);
      $('#main').innerHTML = `<section class="dict entry">
        <a class="dback" href="#/dict">← Glosebok</a>
        <div class="ent-head"><h1 class="ru">${E(show(e.w))}</h1><button class="btn" data-act="say" data-t="${E(acc(e.w))}">🔊</button>
          <button class="btn" data-act="save">${D.isSaved(k) ? '★ Lagret' : '☆ Lagre'}</button></div>
        <p class="ent-pos">${E(D.label(e))}${RP.state.settings.translit ? ` · <i>${E(RP.translit(bare(e.w)))}</i>` : ''}</p>
        <p class="ent-no">${E(e.no || '')}</p>
        ${e.en ? `<p class="muted small">Engelsk: ${E(e.en)}</p>` : ''}
        ${e.pr ? `<p>Aspektpar: ${pr ? `<a href="#/dict/${encodeURIComponent(keyOf(pr))}" class="ru">${E(show(pr.w))}</a>` : `<span class="ru">${E(e.pr)}</span>`}</p>` : ''}
        ${D.tables(e)}
        ${ex.length ? `<h3>Eksempler fra kurset</h3><ul class="ex">${ex.map(([ru, no, src]) => `<li><span class="ru">${D.tap(ru)}</span><br><small>${E(no)} · ${E(src)}</small></li>`).join('')}</ul>` : ''}
      </section>`;
      this.e = e; this.k = k;
    },
    act(a, el) {
      if (a === 'say') RP.speech.speak(el.dataset.t);
      if (a === 'save') { D.toggleSave(this.e); el.textContent = D.isSaved(this.k) ? '★ Lagret' : '☆ Lagre'; }
    }
  };

  /* ---------- Visning: Avis ---------- */
  const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
  RP.views.news = {
    render([id]) {
      D.load().catch(() => { }); // last gloseboka i bakgrunnen, så ordkort og trykk er klare
      const read = RP.state.news || (RP.state.news = {});
      if (!id) {
        $('#main').innerHTML = `<section class="news">
          <h1>📰 Avis · <span class="ru">Новости</span></h1>
          <p class="muted">Utvalgte dagsaktuelle saker fra russiske og russiskspråklige medier, gjenfortalt på lett russisk med norsk oversettelse. Trykk på et ord for å slå det opp.</p>
          <div class="ncats">${['Alle', ...new Set(RP.NEWS.map(n => n.catNo))].map(c => `<button class="chip ${(this.cat || 'Alle') === c ? 'on' : ''}" data-act="cat" data-c="${E(c)}">${E(c)}</button>`).join('')}</div>
          ${RP.NEWS.filter(n => !this.cat || this.cat === 'Alle' || n.catNo === this.cat).map(n => `<a class="ncard ${read[n.id] ? 'read' : ''}" href="#/news/${n.id}">
            <span class="nicon">${n.icon}</span>
            <span class="nbody"><small>${E(n.catNo)} · ${fmtDate(n.date)} · ${E(n.src)}</small><b class="ru">${E(n.ru)}</b><span>${E(n.no)}</span></span>
            ${read[n.id] ? '<span class="ncheck">✓</span>' : ''}</a>`).join('')}
        </section>`;
        return;
      }
      const n = RP.NEWS.find(x => x.id === id); if (!n) { location.hash = '#/news'; return; }
      this.n = n;
      const side = RP.state.settings.newsSide !== false;
      $('#main').innerHTML = `<article class="news art ${side ? '' : 'ru-only'}">
        <a class="dback" href="#/news">← Avis</a>
        <small class="muted">${n.icon} ${E(n.cat)} · ${E(n.catNo)} · ${fmtDate(n.date)}</small>
        <h1 class="ru" id="ntitle">${D.tap(n.ru)}</h1><p class="nsub">${E(n.no)}</p>
        <div class="row"><button class="btn small" data-act="side">${side ? '🙈 Skjul norsk' : '👁️ Vis norsk side om side'}</button>
          <button class="btn small" data-act="all">🔊 Les opp alt</button></div>
        <div class="pairs" id="pairs">${n.p.map(([ru, no], i) => `<div class="pair"><p class="ru"><button class="pbtn" data-act="say" data-i="${i}" aria-label="Les opp avsnittet">🔊</button>${D.tap(ru)}</p><p class="no">${E(no)}</p></div>`).join('')}</div>
        <p class="small muted">Kilde: <a href="${E(n.url)}" target="_blank" rel="noopener">${E(n.src)}</a>. Gjenfortalt og forenklet for språklæring; ikke en direkte oversettelse.</p>
        <div class="sec-foot"><button class="btn primary big" data-act="done">${read[n.id] ? '✓ Lest' : '✓ Ferdig lest (+15 XP)'}</button></div>
      </article>`;
      // Når ordboka er lastet: tegn teksten på nytt med trykkmerker fra ordboka
      D.load().then(() => {
        if (RP.view !== this || this.n !== n) return;
        $('#ntitle').innerHTML = D.tap(n.ru);
        $$('#pairs .pair p.ru').forEach((p, i) => { p.innerHTML = `<button class="pbtn" data-act="say" data-i="${i}" aria-label="Les opp avsnittet">🔊</button>${D.tap(n.p[i][0])}`; });
      }).catch(() => { });
    },
    async act(a, el) {
      if (a === 'cat') { this.cat = el.dataset.c; this.render([]); return; }
      const n = this.n;
      if (a === 'say') RP.speech.speak(n.p[+el.dataset.i][0]);
      if (a === 'all') { for (const [ru] of n.p) { if (RP.view !== this) break; await RP.speech.speak(ru); } }
      if (a === 'side') { RP.state.settings.newsSide = RP.state.settings.newsSide === false; RP.save(); this.render([n.id]); }
      if (a === 'done') {
        const read = RP.state.news || (RP.state.news = {});
        if (!read[n.id]) { read[n.id] = Date.now(); RP.save(); RP.addXP(15, 'Avis'); }
        location.hash = '#/news';
      }
    },
    cleanup() { RP.speech.stop(); D.close(); }
  };
})();
