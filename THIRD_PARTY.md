# Tredjepart og lisenser

## Hallmark: temaer
Temaene **Werkstatt, Solstice, Garden, Hedgerow, Dusk og Vantage** (`css/hallmark.css`) bygger på design-tokens fra
[Nutlope/hallmark](https://github.com/Nutlope/hallmark), lisensiert under **MIT** (© Hallmark contributors).
Tokens er oversatt til appens CSS-variabler. Brødtekstfonter uten kyrillisk er byttet ut: Karla og Archivo med Golos Text, og Hanken Grotesk med Manrope.

## VoiceStudio / OmniVoice: russiske stemmer
Lydfilene i `audio/` er generert med `tools/generate-voices.py`, som bruker OmniVoice-modellen fra
[debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio).
- VoiceStudio-applikasjonen er lisensiert under **AGPL-3.0**. Ingen VoiceStudio-kode er inkludert i appen. Den er kun brukt som verktøy for å generere lydfiler.
- OmniVoice-koden er lisensiert under **Apache-2.0**.
- Modellvektene [`k2-fsa/OmniVoice`](https://huggingface.co/k2-fsa/OmniVoice) er lisensiert under **CC-BY-NC**. **Lydfilene kan derfor bare brukes ikke-kommersielt.**

Skal appen brukes kommersielt, må lydfilene genereres på nytt med en modell som har kommersiell lisens, eller fjernes. Uten lydfilene faller appen automatisk tilbake til Claude-stemme eller nettleserens stemme.

## Fonter
Alle fonter lastes fra Google Fonts og er lisensiert under SIL Open Font License.
