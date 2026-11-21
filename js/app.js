/* Ruter og oppstart. Appen er laget for mobil: all styring skjer med trykk og sveip. */
(() => {
  let view = null;
  // I leksjoner og lesetekster skjules bunnmenyen (fullskjerm-flyt som i en mobilapp)
  const IMMERSIVE = ['lesson', 'reading'];

  RP.route = () => {
    view && view.cleanup && view.cleanup();
    const [, name = 'map', ...params] = (location.hash || '#/map').split('/');
    view = RP.views[name] || RP.views.map;
    RP.view = view;
    document.body.classList.toggle('immersive', IMMERSIVE.includes(name));
    window.scrollTo(0, 0);
    view.render(params);
    RP.ui.renderTopbar();
  };

  // Trykk-delegering: elementer med data-act
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || !$('#main').contains(el) || !view || !view.act) return;
    e.preventDefault();
    view.act(el.dataset.act, el);
  });

  window.addEventListener('hashchange', RP.route);

  RP.load();
  RP.applySkin();
  RP.route();
  RP.checkBadges();

  // Første besøk: kort velkomst
  try {
    if (!localStorage.getItem('govorushka_seen')) {
      localStorage.setItem('govorushka_seen', '1');
      RP.ui.modal(`<h2>Добро пожаловать! 🪆</h2>
        <p>Velkommen til <b>Говорушка</b> – et russiskkurs på norsk med ${RP.LESSONS.length} leksjoner fra Moskva til Arktis.</p>
        <ul><li>🎧 Lytt til dialoger med russisk opplesning</li><li>🗣️ Snakk med figurene – mikrofonen sjekker svaret ditt</li>
        <li>🃏 Repeter ord med smart repetisjon</li><li>🔥 Samle XP, hold streaken og lås opp nye steder</li></ul>
        <p>Trykk på et sted på kartet for å starte. I leksjonene kan du også sveipe mellom delene.</p>
        <p>🎨 Bytt tema med 🎨-knappen øverst eller under Profil.</p>`);
    }
  } catch (e) { }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
