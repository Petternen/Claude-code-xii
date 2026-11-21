/* Tale: opplesning (speechSynthesis) og talegjenkjenning (Web Speech API, ru-RU). Kun nettleserens innebygde motorer. */
window.RP = window.RP || {};

RP.speech = (() => {
  const synth = window.speechSynthesis;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let voices = [], rec = null, dict = null, dictStop = null, ttsC = null, audioEl = null, busy = 0;
  // Inne i en claude.ai-Artifact: plattformens diktering (nettleserens er blokkert) og Claudes stemme.
  if (window.claude && window.claude.use) {
    window.claude.use('dictation').then(d => { if (d) dict = d; }).catch(() => { });
    window.claude.use('tts').then(t => { if (t) ttsC = t; }).catch(() => { });
  }
  // iOS/Safari spiller bare lyd som starter i et trykk: lås opp tale og lyd ved første berøring
  const unlock = () => {
    try { if (synth) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } } catch (e) { }
    try { const a = new Audio(); a.muted = true; a.play().catch(() => { }); } catch (e) { }
    RP.unlockAudio && RP.unlockAudio();
  };
  ['touchend', 'click'].forEach(ev => document.addEventListener(ev, unlock, { once: true, capture: true }));
  const recorded = text => RP.AUDIO && RP.AUDIO[RP.audioKey(text)];
  const playFile = (url, slow) => new Promise(res => {
    audioEl = new Audio(url); audioEl.playbackRate = slow ? 0.75 : 1;
    audioEl.onended = audioEl.onerror = () => { audioEl = null; res(); };
    audioEl.play().catch(() => { audioEl = null; res('fail'); });
  });
  const browserSpeak = (text, gender, slow) => new Promise(res => {
    if (!synth) return res();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    const p = pickVoice(gender);
    if (p) { u.voice = p.v; u.pitch = p.pitch; }
    u.rate = slow ? 0.6 : RP.state.settings.rate;
    u.onend = u.onerror = () => res();
    synth.speak(u);
  });
  const inArtifact = () => !!dict;

  const loadVoices = () => { voices = synth ? synth.getVoices().filter(v => /^ru/i.test(v.lang)) : []; };
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  /* Velger stemme ut fra kjønn hvis mulig; ellers samme stemme med ulik tonehøyde. */
  const pickVoice = gender => {
    if (!voices.length) return null;
    const male = voices.filter(v => /male|муж|pavel|dmitri|yuri|maxim|man\b/i.test(v.name) && !/female/i.test(v.name));
    const female = voices.filter(v => !male.includes(v));
    if (gender === 'm' && male.length) return { v: male[0], pitch: 1 };
    if (gender === 'f' && female.length) return { v: female[0], pitch: 1.05 };
    return { v: voices[0], pitch: gender === 'm' ? 0.7 : 1.05 };
  };

  return {
    get ttsOK() { return !!synth || !!ttsC; },
    get hasRuVoice() { return voices.length > 0 || (!!ttsC && RP.state.settings.voice !== 'browser'); },
    get claudeVoice() { return !!ttsC; },
    get source() { return ttsC && RP.state.settings.voice !== 'browser' ? 'Claude-stemme' : voices.length ? 'Nettleserens stemme' : 'Ingen russisk stemme'; },
    recorded,
    get sttOK() { return !!SR || !!dict; },
    /* Prioritet: innspilt morsmålsopptak → Claude-stemme (i Artifact) → nettleserens stemme. */
    async speak(text, { gender = 'f', slow = false, auto = false } = {}) {
      if (auto && RP.silent()) return; // automatisk opplesning er av i lydfri modus
      text = RP.unstress(text);
      const mode = RP.state.settings.voice, my = ++busy;
      try {
        const file = mode !== 'browser' && recorded(text);
        if (file && (await playFile(file, slow)) !== 'fail') return;
        if (ttsC && mode !== 'browser') {
          const r = slow ? 0.7 : Math.min(1.5, Math.max(0.7, RP.state.settings.rate + 0.1));
          try { await ttsC.speak(text, { language: 'ru', voice: gender === 'm' ? 'rounded' : 'airy', rate: r }); return; }
          catch (e) { if (e && (e.code === 'viewer_stopped' || e.code === 'stopped')) return; }
        }
        await browserSpeak(text, gender, slow);
      } finally { if (my === busy) busy = 0; }
    },
    stop() {
      busy = 0; synth && synth.cancel();
      if (audioEl) { audioEl.pause(); audioEl = null; }
      if (ttsC) { try { ttsC.stop(); } catch (e) { } }
    },
    get speaking() { return busy > 0 || !!(synth && synth.speaking); },
    /* Lytter én gang. onInterim(text) får foreløpig tekst. Resolver med liste av alternativer. */
    listen(onInterim) {
      if (inArtifact()) return this.listenDictation(onInterim);
      return new Promise((resolve, reject) => {
        if (!SR) return reject(new Error('unsupported'));
        this.stop();
        rec = new SR();
        rec.lang = 'ru-RU'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
        let finalAlts = null, lastInterim = '';
        rec.onresult = e => {
          const r = e.results[e.results.length - 1];
          if (r.isFinal) finalAlts = Array.from(r).map(a => a.transcript.trim());
          else { lastInterim = Array.from(e.results).map(x => x[0].transcript).join(' '); onInterim && onInterim(lastInterim); }
        };
        rec.onerror = e => { rec = null; e.error === 'no-speech' || e.error === 'aborted' ? resolve(finalAlts || (lastInterim ? [lastInterim] : [])) : reject(new Error(e.error)); };
        rec.onend = () => { rec = null; resolve(finalAlts || (lastInterim ? [lastInterim] : [])); };
        try { rec.start(); } catch (err) { reject(err); }
      });
    },
    /* claude.ai-diktering: start() må kalles direkte fra klikk/tastetrykk, uten await før. */
    listenDictation(onInterim) {
      return new Promise((resolve, reject) => {
        this.stop();
        let text = '', done = false;
        const offs = [];
        const finish = () => {
          if (done) return; done = true; dictStop = null; clearTimeout(timer);
          offs.forEach(f => { try { f(); } catch (e) { } });
          dict.stop().catch(() => { }).finally(() => resolve(text.trim() ? [text.trim()] : []));
        };
        offs.push(dict.onPartial(({ text: t }) => onInterim && onInterim((text + ' ' + t).trim())));
        offs.push(dict.onFinal(({ text: t }) => { text += ' ' + t; setTimeout(finish, 700); }));
        offs.push(dict.onState(({ state }) => { if (state === 'idle' && text) finish(); }));
        const timer = setTimeout(finish, 10000);
        dictStop = finish;
        dict.start({ language: 'ru' }).catch(err => {
          if (done) return; done = true; clearTimeout(timer); dictStop = null;
          offs.forEach(f => { try { f(); } catch (e) { } });
          const c = err && err.code;
          reject(new Error(c === 'not_granted' ? 'not-allowed' : c === 'unavailable' ? 'dict-unavailable' : (c || 'dictation')));
        });
      });
    },
    stopListening() { rec && rec.stop(); dictStop && dictStop(); },
    get listening() { return !!rec || !!dictStop; }
  };
})();

RP.micErrorText = e => ({
  'not-allowed': 'Mikrofonen er blokkert. Gi nettleseren tilgang til mikrofonen og prøv igjen.',
  'service-not-allowed': 'Talegjenkjenning er ikke tillatt i denne nettleseren.',
  'network': 'Talegjenkjenningen trenger internett (Chrome sender lyden til Googles tjeneste).',
  'audio-capture': 'Fant ingen mikrofon.',
  'dict-unavailable': 'Russisk diktering er ikke tilgjengelig her. Skriv svaret, eller åpne appen lokalt i Chrome/Edge.',
  'unsupported': 'Nettleseren støtter ikke talegjenkjenning. Bruk Chrome, Edge eller Safari – eller skriv svaret.'
}[e && e.message] || 'Talegjenkjenningen feilet: ' + (e && e.message));
