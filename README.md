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
- **20 leksjoner (A1–A2)** fordelt på fire regioner: Moskva → Den gylne ring → St. Petersburg → Bajkal
- Hver leksjon har:
  1. 🎧 **Dialog** med opplesning, sakte modus, translitterasjon og oversettelse
  2. 📜 **Ordforråd** med lyd og uttalesjekk via mikrofon
  3. 📖 **Grammatikk** med tabeller du kan klikke for å høre
  4. ⚔️ **Quiz** med flervalg, lytting, skriving og ordrekkefølge, pluss combo-bonus
  5. 🗣️ **Samtale (rollespill)** der du svarer muntlig eller skriftlig, med hint og fasit
- 🃏 **Repetisjon** av ordene med spaced repetition (forenklet SM-2)
- 🔤 **Alfabet** med alle 33 kyrilliske bokstaver, «falske venner» og lyd

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
`Alt+T` Bytt tema · `M` Kart · `R` Repetisjon · `A` Alfabet · `P` Profil · `Esc` Tilbake · `⇧←/→` Forrige/neste del · `N` Fullfør del ·
`Space` Spill av / snakk · `1–4` Svar · `H` Hint

Svar kan skrives med kyrillisk eller latinske bokstaver (`privet`, `spasibo`).

## Struktur
| Fil | Innhold |
|---|---|
| `js/data/lessons.js` | Alt kursinnhold (enkelt å utvide) |
| `js/core.js` | Lagring, translitterasjon, svarvurdering, XP/nivå/streak, merker, SRS |
| `js/speech.js` | Web Speech API (opplesning + talegjenkjenning ru-RU) |
| `js/ui.js` | Alle visninger |
| `js/app.js` | Ruter og tastaturstyring |

Fremdriften lagres i `localStorage`. Under Profil kan du eksportere og importere den.
