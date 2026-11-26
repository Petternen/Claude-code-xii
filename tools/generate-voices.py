"""Genererer russiske stemmeopptak for hele kurset med OmniVoice (via VoiceStudio).

Hver figur får én designet stemme (voice design), som deretter klones for alle figurens
replikker, slik at stemmen er lik gjennom hele kurset. Resultatet blir MP3-filer i audio/
og oversikten js/data/audio.js (RP.AUDIO), som appen allerede bruker før syntetisk tale.

Lisens: OmniVoice-koden er Apache-2.0, men modellvektene (k2-fsa/OmniVoice) er CC-BY-NC.
Opptakene er derfor bare til ikke-kommersiell bruk.

Bruk:
  node tools/export-utterances.js > /tmp/utterances.json
  python tools/generate-voices.py --model /sti/til/OmniVoice --voicestudio /sti/til/VoiceStudio \
         --items /tmp/utterances.json --out . [--batch 4]
Skriptet kan avbrytes og startes igjen; ferdige filer hoppes over.
"""
import argparse, json, os, subprocess, sys, tempfile, time

# Stemmedesign per figur (OmniVoice-attributter: kjønn, alder, tonehøyde)
VOICES = {
    'Диктор': 'female, young adult, moderate pitch',
    'Анна': 'female, young adult, high pitch',
    'Максим': 'male, young adult, moderate pitch',
    'Ольга': 'female, middle-aged, moderate pitch',
    'Ларс': 'male, young adult, low pitch',
    'Ирина': 'female, young adult, moderate pitch',
    'Официант': 'male, middle-aged, moderate pitch',
    'Продавщица': 'female, elderly, moderate pitch',
    'Прохожая': 'female, middle-aged, high pitch',
    'Кассир': 'female, middle-aged, low pitch',
    'Администратор': 'female, young adult, high pitch',
    'Врач': 'male, middle-aged, low pitch',
    'Наталья': 'female, elderly, low pitch',
    'Продавец': 'male, young adult, moderate pitch',
    'Руслан': 'male, young adult, low pitch',
    'Тамара': 'female, elderly, moderate pitch',
    'Марина': 'female, young adult, high pitch',
    'Алексей': 'male, middle-aged, moderate pitch',
    'Сергей': 'male, middle-aged, low pitch',
    'Николай': 'male, elderly, low pitch',
    'Светлана': 'female, young adult, moderate pitch',
    'Пограничник': 'male, middle-aged, very low pitch',
}
# Referansesetning for å designe hver stemme (nøytral, naturlig intonasjon)
REF_TEXT = 'Здравствуйте! Сегодня хорошая погода, и я очень рад вас видеть.'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--voicestudio', required=True)
    ap.add_argument('--items', required=True)
    ap.add_argument('--out', default='.')
    ap.add_argument('--batch', type=int, default=4)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--seed', type=int, default=42, help='annen seed gir en ny variant (brukes ved omgenerering av svake klipp)')
    ap.add_argument('--steps', type=int, default=16, help='diffusjonssteg (32 = modellens standard, 16 = dobbelt så raskt)')
    a = ap.parse_args()

    sys.path.insert(0, a.voicestudio)
    import torch, soundfile as sf
    from omnivoice import OmniVoice
    from omnivoice.models.omnivoice import OmniVoiceGenerationConfig
    torch.set_num_threads(os.cpu_count() or 4)

    data = json.load(open(a.items))
    items = data['items'][: a.limit or None]
    audio_dir = os.path.join(a.out, 'audio'); os.makedirs(audio_dir, exist_ok=True)
    ref_dir = os.path.join(a.out, 'tools', 'voices'); os.makedirs(ref_dir, exist_ok=True)

    model = OmniVoice.from_pretrained(a.model, device_map='cpu', dtype=torch.float32)
    sr = getattr(model, 'sampling_rate', 24000)

    def to_mp3(wav, path):
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as t:
            sf.write(t.name, wav, sr)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', t.name, '-ac', '1', '-ar', '24000',
                        '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2',
                        '-b:a', '48k', path], check=True)
        os.unlink(t.name)

    def wav_of(x):
        return x.squeeze().detach().cpu().numpy() if hasattr(x, 'cpu') else x

    # 1) Design én referansestemme per figur (fast seed → reproduserbart)
    prompts = {}
    for who in sorted({it['who'] for it in items}):
        ins = VOICES.get(who, VOICES['Диктор'])
        ref = os.path.join(ref_dir, f'{who}.wav')
        if not os.path.exists(ref):
            w = model.generate(text=REF_TEXT, instruct=ins, seed=1234 + len(prompts))
            sf.write(ref, wav_of(w[0]), sr)
            print(f'stemme designet: {who} ({ins})', flush=True)
        prompts[who] = model.create_voice_clone_prompt(ref_audio=ref, ref_text=REF_TEXT)

    # 2) Generer alle klipp, gruppert per figur i batcher
    def min_dur(t):
        # Enkeltord blir ellers ofte estimert altfor kort og kommer ut som stillhet
        return max(0.9, min(2.2, 0.45 + 0.085 * len(t))) if len(t.split()) <= 2 else None

    todo = [it for it in items if not os.path.exists(os.path.join(audio_dir, it['k'] + '.mp3'))]
    print(f'{len(items) - len(todo)} ferdige, {len(todo)} igjen', flush=True)
    t0, done, secs = time.time(), 0, 0.0
    by_who = {}
    for it in todo: by_who.setdefault(it['who'], []).append(it)
    for who, lst in by_who.items():
        for i in range(0, len(lst), a.batch):
            chunk = lst[i:i + a.batch]
            outs = model.generate(text=[c['text'] for c in chunk], language='ru',
                                  voice_clone_prompt=[prompts[who]] * len(chunk), seed=a.seed,
                                  duration=[min_dur(c['text']) for c in chunk],
                                  generation_config=OmniVoiceGenerationConfig(num_step=a.steps))
            for c, w in zip(chunk, outs):
                wav = wav_of(w); secs += len(wav) / sr
                to_mp3(wav, os.path.join(audio_dir, c['k'] + '.mp3'))
            done += len(chunk)
            el = time.time() - t0
            print(f'[{done}/{len(todo)}] {who}: {el/done:.1f} s/klipp, {el/max(secs,1e-6):.1f}x sanntid, '
                  f'ca {(len(todo)-done)*el/done/60:.0f} min igjen', flush=True)

    # 3) Skriv oversikten appen leser
    have = {it['k']: f'audio/{it["k"]}.mp3' for it in data['items'] if os.path.exists(os.path.join(audio_dir, it['k'] + '.mp3'))}
    js = ('/* Russiske stemmeopptak: lydnøkkel (RP.audioKey) → fil. Generert av tools/generate-voices.py med\n'
          '   OmniVoice (k2-fsa, vekter CC-BY-NC: kun ikke-kommersiell bruk) via VoiceStudio. */\n'
          'window.RP = window.RP || {};\nRP.AUDIO = ' + json.dumps(have, indent=1) + ';\n')
    os.makedirs(os.path.join(a.out, 'js', 'data'), exist_ok=True)
    open(os.path.join(a.out, 'js', 'data', 'audio.js'), 'w').write(js)
    print(f'FERDIG: {len(have)} opptak i js/data/audio.js', flush=True)


if __name__ == '__main__':
    main()
