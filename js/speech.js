/* Tale: opplesning (speechSynthesis) og talegjenkjenning (Web Speech API, ru-RU). Kun nettleserens innebygde motorer. */
window.RP = window.RP || {};

RP.speech = (() => {
  const synth = window.speechSynthesis;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let voices = [], rec = null;

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
    get ttsOK() { return !!synth; },
    get hasRuVoice() { return voices.length > 0; },
    sttOK: !!SR,
    speak(text, { gender = 'f', slow = false } = {}) {
      return new Promise(res => {
        if (!synth) return res();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ru-RU';
        const p = pickVoice(gender);
        if (p) { u.voice = p.v; u.pitch = p.pitch; }
        u.rate = slow ? 0.6 : RP.state.settings.rate;
        u.onend = u.onerror = () => res();
        synth.speak(u);
      });
    },
    stop() { synth && synth.cancel(); },
    get speaking() { return !!(synth && synth.speaking); },
    /* Lytter én gang. onInterim(text) får foreløpig tekst. Resolver med liste av alternativer. */
    listen(onInterim) {
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
    stopListening() { rec && rec.stop(); },
    get listening() { return !!rec; }
  };
})();

RP.micErrorText = e => ({
  'not-allowed': 'Mikrofonen er blokkert. Gi nettleseren tilgang til mikrofonen og prøv igjen.',
  'service-not-allowed': 'Talegjenkjenning er ikke tillatt i denne nettleseren.',
  'network': 'Talegjenkjenningen trenger internett (Chrome sender lyden til Googles tjeneste).',
  'audio-capture': 'Fant ingen mikrofon.',
  'unsupported': 'Nettleseren støtter ikke talegjenkjenning. Bruk Chrome, Edge eller Safari – eller skriv svaret.'
}[e && e.message] || 'Talegjenkjenningen feilet: ' + (e && e.message));
