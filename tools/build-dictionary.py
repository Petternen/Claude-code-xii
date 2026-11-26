"""Bygger glosebokas data (data/dict.json) fra OpenRussian-ordboka (CC-BY-SA 4.0).

  git clone https://github.com/Badestrand/russian-dictionary /tmp/openrussian
  python tools/build-dictionary.py --src /tmp/openrussian [--top 2500] [--todo /tmp/todo.json]

Utvalg: alle oppslagsord som forekommer i kursets tekster (leksjoner, lesetekster, avis), pluss de vanligste
ordene i ordboka (filene er sortert etter frekvens). Norske oversettelser hentes fra tools/dict-no.json
(håndoversatt/kvalitetssikret) og kursets egne gloser; ord som mangler norsk, skrives til --todo.
"""
import argparse, csv, json, os, re, subprocess, sys
from collections import OrderedDict

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--src', required=True)
ap.add_argument('--top', type=int, default=1500, help='antall vanlige ord i tillegg til kursets ord')
ap.add_argument('--todo', help='skriv oppslagsord uten norsk oversettelse hit (JSON)')
ap.add_argument('--out', default=os.path.join(root, 'data', 'dict.json'))
a = ap.parse_args()
csv.field_size_limit(10 ** 7)

def rows(name):
    with open(os.path.join(a.src, name + '.csv'), encoding='utf-8') as f:
        yield from csv.DictReader(f, delimiter='\t')

bare = lambda s: s.replace("'", '').replace('ё', 'е').lower().strip()
NOUN = ['sg_nom', 'sg_gen', 'sg_dat', 'sg_acc', 'sg_inst', 'sg_prep', 'pl_nom', 'pl_gen', 'pl_dat', 'pl_acc', 'pl_inst', 'pl_prep']
VERB = ['presfut_sg1', 'presfut_sg2', 'presfut_sg3', 'presfut_pl1', 'presfut_pl2', 'presfut_pl3',
        'past_m', 'past_f', 'past_n', 'past_pl', 'imperative_sg', 'imperative_pl']
ADJ = [f'decl_{g}_{c}' for g in ('m', 'f', 'n', 'pl') for c in ('nom', 'gen', 'dat', 'acc', 'inst', 'prep')] + \
      ['short_m', 'short_f', 'short_n', 'short_pl', 'comparative', 'superlative']

# 1) Les hele ordboka
entries = []  # (rank_i_sin_klasse, entry)
for pos, name, cols in (('n', 'nouns', NOUN), ('v', 'verbs', VERB), ('a', 'adjectives', ADJ), ('o', 'others', [])):
    for i, r in enumerate(rows(name)):
        if not r['bare'] or ' ' in r['bare'].strip() and pos != 'o': continue
        e = OrderedDict(w=r['accented'] or r['bare'], p=pos, en=(r['translations_en'] or '').strip())
        if pos == 'n':
            e['g'] = r['gender'] or ''
            if r['animate'] == '1': e['an'] = 1
            if r['indeclinable'] == '1': e['ind'] = 1
            if r['partner']: e['pr'] = r['partner']
        if pos == 'v':
            e['asp'] = {'imperfective': 'ipf', 'perfective': 'pf'}.get(r['aspect'], r['aspect'] or '')
            if r['partner']: e['pr'] = r['partner']
        if cols: e['f'] = [r.get(c) or '' for c in cols]
        entries.append((i, e))

# Uregelmessige former og oppslagsord som mangler i OpenRussian (med trykk)
EXTRA_FORMS = {  # oppslagsord|klasse → ekstra former (vises som «Former»)
    'я|o': "меня', мне', меня', мно'й, мне'", 'ты|o': "тебя', тебе', тебя', тобо'й, тебе'",
    'он|o': "его', ему', его', им, нём, него', нему', ним", 'она|o': "её, ей, её, е'й, ней, неё", 'мы|o': "нас, нам, нас, на'ми, нас",
    'вы|o': "вас, вам, вас, ва'ми, вас", 'они|o': "их, им, их, и'ми, них, ним, ни'ми", 'в|o': "во", 'с|o': "со", 'к|o': "ко",
    'кто|o': "кого', кому', кого', кем, ком", 'что|o': "чего', чему', что, чем, чём",
    'быть|v': "бу'ду, бу'дешь, бу'дет, бу'дем, бу'дете, бу'дут, есть", 'год|n': "го'ды, годо'в, года'м, года'ми, года'х",
}
POSS = {  # eiendomspronomen: m, f, n, pl × 6 kasus (nom, gen, dat, acc, inst, prep)
    'ваш': ["ваш", "ва'шего", "ва'шему", "ваш, ва'шего", "ва'шим", "ва'шем", "ва'ша", "ва'шей", "ва'шей", "ва'шу", "ва'шей", "ва'шей",
            "ва'ше", "ва'шего", "ва'шему", "ва'ше", "ва'шим", "ва'шем", "ва'ши", "ва'ших", "ва'шим", "ва'ши, ва'ших", "ва'шими", "ва'ших"],
    'наш': ["наш", "на'шего", "на'шему", "наш, на'шего", "на'шим", "на'шем", "на'ша", "на'шей", "на'шей", "на'шу", "на'шей", "на'шей",
            "на'ше", "на'шего", "на'шему", "на'ше", "на'шим", "на'шем", "на'ши", "на'ших", "на'шим", "на'ши, на'ших", "на'шими", "на'ших"],
}
have = {(bare(e['w']), e['p']) for _, e in entries}
for w, f in POSS.items():
    if (w, 'a') not in have:
        entries.append((5, OrderedDict(w=w, p='a', en='your' if w == 'ваш' else 'our', f=f + [''] * 6)))
for _, e in entries:
    x = EXTRA_FORMS.get(bare(e['w']) + '|' + e['p'])
    if x: e['x'] = x

# 2) Formindeks: bøyd form → oppslagsord
index = {}
for k, (_, e) in enumerate(entries):
    forms = {bare(e['w'])}
    for f in e.get('f', []) + ([e['x']] if e.get('x') else []):
        for x in re.split(r'[,;/]', f): forms.add(bare(x))
    for f in forms:
        if f: index.setdefault(f, []).append(k)

# 3) Kursets ord
corpus = json.loads(subprocess.run(['node', os.path.join(root, 'tools', 'corpus.js')], capture_output=True, text=True, check=True).stdout)
tokens = set()
for t in corpus['texts']:
    for w in re.findall(r'[А-Яа-яЁё]+(?:-[А-Яа-яЁё]+)*', t): tokens.add(bare(w))
need, missing = set(), []
for t in tokens:
    if t in index:
        # Foretrekk den vanligste kandidaten i hver ordklasse
        for k in index[t]: need.add(k)
    else: missing.append(t)

# Kursets egne norske gloser (oppslagsform → norsk)
course_no = {}
for ru, no in corpus['pairs']:
    w = bare(re.sub(r'\s*\(.*?\)', '', ru)).strip(' ?!.')
    if w and ' ' not in w and '/' not in w: course_no.setdefault(w, no)

# 4) Vanlige ord
by_rank = sorted(range(len(entries)), key=lambda k: entries[k][0])
keep = set(need)
for k in by_rank:
    if len(keep) >= len(need) + a.top: break
    keep.add(k)
# Begrens tvetydige formtreff til de mest relevante: dropp sjeldne ord (rank > 15000) som bare kom inn via formtreff
keep = {k for k in keep if entries[k][0] < 15000 or bare(entries[k][1]['w']) in tokens}

# 5) Norsk
no_file = os.path.join(root, 'tools', 'dict-no.json')
manual = json.load(open(no_file, encoding='utf-8')) if os.path.exists(no_file) else {}
out, todo = [], []
for k in sorted(keep, key=lambda k: (entries[k][0], entries[k][1]['p'])):
    e = dict(entries[k][1]); key = bare(e['w']) + '|' + e['p']
    no = manual.get(key) or course_no.get(bare(e['w']))
    if no: e['no'] = no
    else: todo.append({'k': key, 'ru': e['w'].replace("'", '́'), 'en': e['en']})
    out.append(e)

os.makedirs(os.path.dirname(a.out), exist_ok=True)
with open(a.out, 'w', encoding='utf-8') as f:
    json.dump({'src': 'OpenRussian.org (CC-BY-SA 4.0)', 'e': out}, f, ensure_ascii=False, separators=(',', ':'))
if a.todo: json.dump(todo, open(a.todo, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(f'{len(out)} oppslagsord ({len(need)} fra kurset), {len(todo)} uten norsk, '
      f'{len(missing)} ord i kurset uten treff, {os.path.getsize(a.out) // 1024} KB', file=sys.stderr)
print('uten treff (utdrag):', ' '.join(sorted(missing)[:80]), file=sys.stderr)
