"""Pakker audio/*.mp3 i én lydpakke per leksjon/lesetekst for claude.ai-Artifacten, som tillater høyst ~500 filer per versjon.

  python tools/pack-audio.py <utmappe>

Skriver <utmappe>/audio/packs/<sted>.json (f.eks. L1.json, r-moskva.json) ({nøkkel: base64-mp3}) og <utmappe>/js/data/audio.js der hver
oppføring er «pack:<sted>:nøkkel». Et klipp legges i pakken der det brukes først. js/speech.js laster pakkene ved behov. GitHub Pages bruker fortsatt enkeltfilene.
"""
import base64, json, os, subprocess, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]
src = open(os.path.join(root, 'js', 'data', 'audio.js'), encoding='utf-8').read()
head, body = src.split('RP.AUDIO = ', 1)
audio = json.loads(body.rstrip().rstrip(';'))
items = json.loads(subprocess.run(['node', os.path.join(root, 'tools', 'export-utterances.js')],
                                  capture_output=True, text=True, check=True).stdout)['items']
where = {}
for it in items: where.setdefault(it['k'], it['where'].split()[0])
packs, mapping = {}, {}
for k, path in audio.items():
    p = where.get(k, 'annet')
    packs.setdefault(p, {})[k] = base64.b64encode(open(os.path.join(root, path), 'rb').read()).decode()
    mapping[k] = f'pack:{p}:{k}'
os.makedirs(os.path.join(out, 'audio', 'packs'), exist_ok=True)
os.makedirs(os.path.join(out, 'js', 'data'), exist_ok=True)
for p, d in packs.items():
    json.dump(d, open(os.path.join(out, 'audio', 'packs', p + '.json'), 'w'), separators=(',', ':'))
open(os.path.join(out, 'js', 'data', 'audio.js'), 'w', encoding='utf-8').write(
    head + 'RP.AUDIO = ' + json.dumps(mapping, indent=1) + ';\n')
print(f'{len(mapping)} klipp i {len(packs)} pakker → {out}')
