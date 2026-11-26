# Говорушка – russisk på norsk

Et spillifisert russiskkurs for norsktalende, inspirert av RussianPod101. Det er laget som en PWA i ren HTML/JS, uten byggesteg og uten backend.

## Kom i gang
```bash
python3 -m http.server 8000   # eller: npx serve
# åpne http://localhost:8000
```
Appen kan også åpnes direkte fra `index.html`. Da virker likevel ikke offline-modus/installasjon, fordi service worker krever http(s).
For best tale: **Chrome eller Edge** (russisk stemme + talegjenkjenning). Safari virker også. Firefox mangler talegjenkjenning, så der skriver du svarene i stedet.

## Innhold
- **32 leksjoner (A1–B1)** fordelt på sju regioner: Moskva → Den gylne ring → St. Petersburg → Bajkal → Kaukasus → Kamtsjatka → Murmansk og Arktis
- 📜 **Lesetekster**, én per region, med opplesning, oversettelse og forståelsesspørsmål
- **Trykkmerker** (молоко́) i all russisk tekst. Kan slås av under Profil
- Hver leksjon har:
  1. 🎧 **Dialog** med opplesning, sakte modus, translitterasjon og oversettelse
  2. 📜 **Ordforråd** med lyd og uttalesjekk via mikrofon
  3. 📖 **Grammatikk** med tabeller du kan klikke for å høre
  4. ⚔️ **Quiz** med flervalg, lytting, skriving og ordrekkefølge, pluss combo-bonus
  5. 🗣️ **Samtale (rollespill)** der du svarer muntlig eller skriftlig, med hint og fasit
- 🃏 **Repetisjon** av ordene med spaced repetition (forenklet SM-2)
- 🔤 **Alfabet** med alle 33 kyrilliske bokstaver, «falske venner» og lyd
- ⌨️ **Tastaturtrener** for russisk ЙЦУКЕН-oppsett (samme som russisk mobiltastatur). Trykk tastene på skjermen
- 🤖 **Fri prat med AI** (bare i claude.ai-Artifacten): Claude spiller leksjonens figur, svarer på ditt nivå og retter feil på norsk
- 🎤 **Uttalescore per ord:** ordene markeres grønt, gult eller rødt, med russiske lydregler (akanje, ustemt utlyd)

## Lyd
Rekkefølgen er: **innspilt morsmålsopptak**, så **Claude-stemme** (i claude.ai-Artifacten), så **nettleserens stemme**.
**Opptaksstudio** (`#/studio`, lenke under Profil) lar en morsmålsbruker lese inn alle replikker, ord og lesetekster: trykk ● for å ta opp, og studioet hopper videre til neste av seg selv. Eksporter ZIP og pakk den ut i prosjektmappen. Den lager `audio/` og `js/data/audio.js`. Commit, og opptakene brukes overalt.

### Genererte morsmålslignende stemmer
`tools/generate-voices.py` genererer alle ~900 russiske replikker, ord og setninger med OmniVoice fra [VoiceStudio](https://github.com/debpalash/VoiceStudio). Hver figur får sin egen stemme (Anna, Maksim, Olga …), som klones for alle figurens replikker:
```bash
node tools/export-utterances.js > /tmp/utterances.json
python tools/generate-voices.py --model <OmniVoice-mappe> --voicestudio <VoiceStudio-mappe> --items /tmp/utterances.json --out .
```
**Kvalitetssjekk:** alle klipp er transkribert med Whisper og sammenlignet med teksten. Svake klipp ble generert på nytt med andre seeds (opptil tre runder), og klipp som fortsatt ikke besto (26 enkeltord), er utelatt. For dem bruker appen Claude- eller nettleserstemme. 871 av 897 klipp er med, og snittlikheten er 98 %.

**claude.ai-Artifacten** tillater ikke så mange filer, så der pakkes lydene i én pakke per leksjon med `python tools/pack-audio.py <byggemappe>`. Pakken hentes når leksjonen åpnes.

**Lisens:** OmniVoice-vektene er CC-BY-NC, så stemmene kan bare brukes ikke-kommersielt. Se `THIRD_PARTY.md`.

## Publisering
- **GitHub Pages:** `.github/workflows/pages.yml` publiserer ved push til `main`. Engangsoppsett: *Settings → Pages → Source: GitHub Actions*. Da blir appen tilgjengelig på `https://<bruker>.github.io/<repo>/`
- **claude.ai-Artifact:** gir Claude-stemme, diktering og AI-samtale

## Spillelementer
XP, nivåer (fra «Новичок» til «Жар-птица»), daglig mål, streak, stjerner per leksjon og merker.

**Opplåsing etter nivå:** leksjonene åpnes fire og fire. Alle åpne leksjoner kan tas i valgfri rekkefølge, men neste gruppe krever et nivå (nivå 4, 6, 7, 8, 9, 10 og 11). Kravene er satt slik at man omtrent må fullføre de åpne leksjonene med rundt 75 % riktige. Man kan også samle XP med lesetekster, repetisjon, tastaturtrening eller ved å ta en quiz på nytt. Kartet viser nivåkravet og hvor mye XP som gjenstår.

**Uten tale og lyd:** en leksjon er fullført når quizen er bestått. Samtalen (rollespill) er valgfri og gir bonus-XP. I lydfri modus kommer det ingen lytteoppgaver.

## Temaer
Det er tre GUI-temaer. Du bytter med 🎨-knappen øverst eller under Profil:
| Tema | Stil | Nivåtitler |
|---|---|---|
| 🪆 Russisk nasjonal | Trikolor, gull, folkekunst (khokhloma), mørk modus i palekh-stil | Новичок → Жар-птица |
| ☭ Sovjetisk brutalisme | Betong, konstruktivisme, skarpe kanter, røde stjerner | Октябрёнок → Герой труда |
| 🎮 Gamer 1337 | Neon, pikselfont, CRT-scanlines | Нуб · n00b → 1337 · Elite |
| 📐 Werkstatt · ☀️ Solstice · 🌿 Garden | Lyse Hallmark-temaer: verksted, krem og gull, havre og grønt | som Russisk nasjonal |
| 🌲 Hedgerow · 🌆 Dusk · 🧭 Vantage | Mørke Hallmark-temaer: løvgrønn, skifer, blåsvart og lime | som Russisk nasjonal |

De seks siste bygger på [Hallmark](https://github.com/Nutlope/hallmark) (MIT). Se `THIRD_PARTY.md`.

## Mobil først
Appen er laget for mobil og styres bare med trykk og sveip:
- Bunnmeny med Kart, Repetisjon, Alfabet, Tastatur og Profil.
- Leksjoner og lesetekster åpnes i fullskjerm med en fast «Fortsett»-knapp i tommelhøyde. Du kan sveipe mellom delene.
- Riktige quizsvar går automatisk videre. Ved feil svar glir et ark opp med fasit og en stor «Fortsett»-knapp.
- Ordrekkefølge sjekkes av seg selv når alle ord er brukt, og et valgt ord fjernes med ett trykk.
- Kan installeres på hjemskjermen (PWA) og virker offline.

Svar kan skrives med kyrillisk eller latinske bokstaver (`privet`, `spasibo`).

## Struktur
| Fil | Innhold |
|---|---|
| `js/data/lessons.js`, `lessons-b1.js` | Kursinnhold A1–A2 og B1 |
| `js/data/readings.js` | Lesetekster per region |
| `js/data/stress.js` | Trykkordbok for A1–A2-teksten |
| `js/data/audio.js` | Oversikt over lydfiler i `audio/` (genererte stemmer eller opptak fra studioet) |
| `js/extra.js` | Lesetekst, tastaturtrener, opptaksstudio, fri AI-prat |
| `js/core.js` | Lagring, translitterasjon, svarvurdering, XP/nivå/streak, merker, SRS |
| `js/speech.js` | Web Speech API (opplesning + talegjenkjenning ru-RU) |
| `js/ui.js` | Alle visninger |
| `js/app.js` | Ruter og tastaturstyring |

Fremdriften lagres i `localStorage`. Under Profil kan du eksportere og importere den.
