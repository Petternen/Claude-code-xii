/* Ruter, global tastaturstyring og oppstart. */
(() => {
  let view = null;

  RP.route = () => {
    view && view.cleanup && view.cleanup();
    const [, name = 'map', ...params] = (location.hash || '#/map').split('/');
    view = RP.views[name] || RP.views.map;
    RP.view = view;
    window.scrollTo(0, 0);
    view.render(params);
    RP.ui.renderTopbar();
    const h = $('#main h1'); if (h) h.setAttribute('tabindex', '-1');
  };

  // Klikk-delegering: elementer med data-act
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || !$('#main').contains(el) || !view || !view.act) return;
    e.preventDefault();
    view.act(el.dataset.act, el);
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) return;
    if (RP.modalOpen) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); RP.closeModal(); } return; }
    const inInput = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
    if (inInput && e.key === 'Escape') { e.target.blur(); return; }
    // Knapper og lenker som har fokus skal fortsatt kunne aktiveres med Enter via Tab-navigasjon
    if (!inInput && e.key === 'Enter' && /BUTTON|A/.test(e.target.tagName) && e.target !== document.body && e.target.closest('#topbar')) return;
    if (view && view.key && view.key(e)) { e.preventDefault(); return; }
    if (inInput || e.altKey) return;
    const k = e.key.toLowerCase();
    const go = h => { e.preventDefault(); location.hash = h; };
    if (k === 'm') return go('#/map');
    if (k === 'r') return go('#/review');
    if (k === 'a') return go('#/alphabet');
    if (k === 'p') return go('#/profile');
    if (e.key === '?') { e.preventDefault(); RP.ui.help(); return; }
    if (e.key === 'Escape') {
      e.preventDefault();
      const name = location.hash.split('/')[1];
      if (name && name !== 'map') location.hash = '#/map';
    }
  });

  window.addEventListener('hashchange', RP.route);

  RP.load();
  RP.route();
  RP.checkBadges();

  // Første besøk: kort velkomst
  try {
    if (!localStorage.getItem('govorushka_seen')) {
      localStorage.setItem('govorushka_seen', '1');
      RP.ui.modal(`<h2>Добро пожаловать! 🪆</h2>
        <p>Velkommen til <b>Говорушка</b> – et russiskkurs på norsk med 20 leksjoner fra Moskva til Bajkal.</p>
        <ul><li>🎧 Lytt til dialoger med russisk opplesning</li><li>🗣️ Snakk med figurene – mikrofonen sjekker svaret ditt</li>
        <li>🃏 Repeter ord med smart repetisjon</li><li>🔥 Samle XP, hold streaken og lås opp nye steder</li></ul>
        <p>Alt kan styres med tastaturet. Trykk <kbd>?</kbd> når som helst for snarveier.</p>`);
    }
  } catch (e) { }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
