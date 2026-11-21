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
- ⌨️ **Tastaturtrener** for russisk ЙЦУКЕН-oppsett. Vanlig norsk tastatur tolkes som russisk
- 🤖 **Fri prat med AI** (bare i claude.ai-Artifacten): Claude spiller leksjonens figur, svarer på ditt nivå og retter feil på norsk
- 🎤 **Uttalescore per ord:** ordene markeres grønt, gult eller rødt, med russiske lydregler (akanje, ustemt utlyd)

## Lyd
Rekkefølgen er: **innspilt morsmålsopptak**, så **Claude-stemme** (i claude.ai-Artifacten), så **nettleserens stemme**.
**Opptaksstudio** (`#/studio`, lenke under Profil) lar en morsmålsbruker lese inn alle replikker, ord og lesetekster med tastaturet (`Space` tar opp, `N` går til neste). Eksporter ZIP og pakk den ut i prosjektmappen. Den lager `audio/` og `js/data/audio.js`. Commit, og opptakene brukes overalt.

## Publisering
- **GitHub Pages:** `.github/workflows/pages.yml` publiserer ved push til `main`. Engangsoppsett: *Settings → Pages → Source: GitHub Actions*. Da blir appen tilgjengelig på `https://<bruker>.github.io/<repo>/`
- **claude.ai-Artifact:** gir Claude-stemme, diktering og AI-samtale

## Spillelementer
XP, 10 nivåer (fra «Новичок» til «Жар-птица»), daglig mål, streak, stjerner per leksjon, opplåsing av steder på kartet og 14 merker.

## Temaer
Det er tre GUI-temaer. Du bytter med `Alt+T`, med 🎨-knappen eller under Profil (tast `1–3`):
| Tema | Stil | Nivåtitler |
|---|---|---|
| 🪆 Russisk nasjonal | Trikolor, gull, folkekunst (khokhloma), mørk modus i palekh-stil | Новичок → Жар-птица |
| ☭ Sovjetisk brutalisme | Betong, konstruktivisme, skarpe kanter, røde stjerner | Октябрёнок → Герой труда |
| 🎮 Gamer 1337 | Neon, pikselfont, CRT-scanlines | Нуб · n00b → 1337 · Elite |

## Tastatur
Hele appen kan styres fra tastaturet. Trykk `?` for full oversikt.
`Alt+T` Bytt tema · `M` Kart · `K` Tastatur · `R` Repetisjon · `A` Alfabet · `P` Profil · `Esc` Tilbake · `⇧←/→` Forrige/neste del · `N` Fullfør del ·
`Space` Spill av / snakk · `1–4` Svar · `H` Hint

Svar kan skrives med kyrillisk eller latinske bokstaver (`privet`, `spasibo`).

## Struktur
| Fil | Innhold |
|---|---|
| `js/data/lessons.js`, `lessons-b1.js` | Kursinnhold A1–A2 og B1 |
| `js/data/readings.js` | Lesetekster per region |
| `js/data/stress.js` | Trykkordbok for A1–A2-teksten |
| `js/data/audio.js` | Oversikt over innspilte opptak (fra opptaksstudioet) |
| `js/extra.js` | Lesetekst, tastaturtrener, opptaksstudio, fri AI-prat |
| `js/core.js` | Lagring, translitterasjon, svarvurdering, XP/nivå/streak, merker, SRS |
| `js/speech.js` | Web Speech API (opplesning + talegjenkjenning ru-RU) |
| `js/ui.js` | Alle visninger |
| `js/app.js` | Ruter og tastaturstyring |

Fremdriften lagres i `localStorage`. Under Profil kan du eksportere og importere den.
