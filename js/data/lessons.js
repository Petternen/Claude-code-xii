/* Kursinnhold: 20 leksjoner russisk for norsktalende (A1–A2).
   Format per leksjon:
   dialog: [taler, russisk, norsk]
   vocab:  [russisk, norsk]
   grammar:{ title, html }
   quiz:   [spørsmål, riktig, ...feil]   (rekkefølgen stokkes ved visning)
   rp:     rollespill { bot, intro, steps:[{ b: bot-replikk, bn: norsk, h: hint, m: modellsvar,
           ok:[aksepterte setninger], any:[nøkkelord – minst ett må være med], dig:true (tall ok) }] } */
window.RP = window.RP || {};

RP.GENDER = {
  'Анна': 'f', 'Максим': 'm', 'Ольга': 'f', 'Ларс': 'm', 'Ирина': 'f', 'Официант': 'm',
  'Продавщица': 'f', 'Прохожая': 'f', 'Кассир': 'f', 'Администратор': 'f', 'Врач': 'm',
  'Наталья': 'f', 'Продавец': 'm'
};

RP.REGIONS = [
  { id: 'moskva', ru: 'Москва', no: 'Moskva', from: 1, to: 8, color: 'var(--red)' },
  { id: 'ring', ru: 'Золотое кольцо', no: 'Den gylne ring', from: 9, to: 12, color: 'var(--gold-dark)' },
  { id: 'spb', ru: 'Санкт-Петербург', no: 'St. Petersburg', from: 13, to: 16, color: 'var(--blue)' },
  { id: 'baikal', ru: 'Байкал', no: 'Bajkal og Sibir', from: 17, to: 20, color: 'var(--green)' }
];

const NUM_WORDS = ['ноль', 'один', 'одна', 'два', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь',
  'девять', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят',
  'девяносто', 'сто', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
  'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];

RP.LESSONS = [
  {
    id: 1, icon: '👋', ru: 'Привет!', no: 'Hilsener', place: 'Красная площадь',
    intro: 'Anna og Maksim møtes på Den røde plass. Lær å hilse og si ha det.',
    dialog: [
      ['Анна', 'Привет!', 'Hei!'],
      ['Максим', 'Привет! Как дела?', 'Hei! Hvordan går det?'],
      ['Анна', 'Хорошо, спасибо. А у тебя?', 'Bra, takk. Og med deg?'],
      ['Максим', 'Тоже хорошо.', 'Også bra.'],
      ['Анна', 'Ну, пока!', 'Nå, ha det!'],
      ['Максим', 'Пока! До завтра!', 'Ha det! Vi ses i morgen!']
    ],
    vocab: [['привет', 'hei'], ['здравствуйте', 'goddag (formelt)'], ['как дела?', 'hvordan går det?'],
      ['хорошо', 'bra'], ['спасибо', 'takk'], ['пожалуйста', 'vær så snill / vær så god'],
      ['пока', 'ha det (uformelt)'], ['до свидания', 'adjø (formelt)'], ['тоже', 'også'],
      ['да', 'ja'], ['нет', 'nei'], ['до завтра', 'vi ses i morgen']],
    grammar: {
      title: 'Ты og вы – du og De',
      html: `<p>Russisk skiller mellom <b>ты</b> (du – venner, familie, barn) og <b>вы</b> (De – høflig form, og «dere» i flertall).</p>
      <table class="gtable"><tr><th></th><th>Uformelt (ты)</th><th>Formelt (вы)</th></tr>
      <tr><td>Hei</td><td>Привет!</td><td>Здравствуйте!</td></tr>
      <tr><td>Ha det</td><td>Пока!</td><td>До свидания!</td></tr>
      <tr><td>Og du?</td><td>А у тебя?</td><td>А у вас?</td></tr></table>
      <p class="tip">💡 Ukjent med kyrillisk? Trykk «Alfabet» i menyen nederst for alle bokstavene med lyd.</p>`
    },
    quiz: [
      ['Du møter en ny lærer. Hva sier du?', 'Здравствуйте!', 'Привет!', 'Пока!', 'Тоже.'],
      ['Hva betyr «А у тебя?»', 'Og med deg?', 'Og hvem er du?', 'Hvor er du?', 'Ha det!'],
      ['Hvilket svar passer til «Как дела?»', 'Хорошо, спасибо.', 'До свидания.', 'Привет!', 'Да, пожалуйста.']
    ],
    rp: {
      bot: 'Максим', intro: 'Du møter vennen din Maksim på gata.',
      steps: [
        { b: 'Привет!', bn: 'Hei!', h: 'Hils tilbake.', m: 'Привет!', ok: ['привет', 'здравствуй', 'здравствуйте'] },
        { b: 'Как дела?', bn: 'Hvordan går det?', h: 'Si at det går bra, og takk.', m: 'Хорошо, спасибо.', ok: ['хорошо спасибо', 'хорошо', 'отлично', 'нормально', 'отлично спасибо'] },
        { b: 'Тоже хорошо. Ну, пока!', bn: 'Også bra. Nå, ha det!', h: 'Si ha det.', m: 'Пока!', ok: ['пока', 'до свидания', 'пока до завтра', 'до завтра'] }
      ]
    }
  },
  {
    id: 2, icon: '🙋', ru: 'Как тебя зовут?', no: 'Presentere seg', place: 'Арбат',
    intro: 'Lars fra Norge møter læreren Olga på Arbat-gata.',
    dialog: [
      ['Ольга', 'Здравствуйте! Меня зовут Ольга. А как вас зовут?', 'Goddag! Jeg heter Olga. Og hva heter De?'],
      ['Ларс', 'Меня зовут Ларс. Очень приятно!', 'Jeg heter Lars. Hyggelig å treffe deg!'],
      ['Ольга', 'Мне тоже очень приятно. Вы турист?', 'Hyggelig å treffe deg også. Er du turist?'],
      ['Ларс', 'Нет, я студент. А вы?', 'Nei, jeg er student. Og du?'],
      ['Ольга', 'Я учительница.', 'Jeg er lærer.'],
      ['Ларс', 'Как интересно!', 'Så interessant!']
    ],
    vocab: [['меня зовут', 'jeg heter'], ['как вас зовут?', 'hva heter De? (formelt)'], ['как тебя зовут?', 'hva heter du?'],
      ['очень приятно', 'hyggelig å treffe deg'], ['я', 'jeg'], ['ты', 'du'], ['вы', 'De / dere'],
      ['студент', 'student (mann)'], ['студентка', 'student (kvinne)'], ['учитель', 'lærer (mann)'],
      ['учительница', 'lærer (kvinne)'], ['турист', 'turist'], ['интересно', 'interessant']],
    grammar: {
      title: 'Ingen «er» og ingen artikler',
      html: `<p>I presens sløyfer russisk verbet «å være»: <b>Я студент.</b> = Jeg (er) student. Det finnes heller ingen artikler (en/et/-en).</p>
      <table class="gtable"><tr><th>Russisk</th><th>Norsk</th></tr>
      <tr><td>я</td><td>jeg</td></tr><tr><td>ты</td><td>du</td></tr><tr><td>он / она / оно</td><td>han / hun / den, det</td></tr>
      <tr><td>мы</td><td>vi</td></tr><tr><td>вы</td><td>dere / De</td></tr><tr><td>они</td><td>de</td></tr></table>`
    },
    quiz: [
      ['Hvordan sier du «Hun er lærer»?', 'Она учительница.', 'Она есть учительница.', 'Он учительница.', 'Она учитель есть.'],
      ['Hvilket pronomen betyr «vi»?', 'мы', 'вы', 'они', 'ты'],
      ['Fullfør: Меня ___ Ларс.', 'зовут', 'зову', 'звать', 'имя']
    ],
    rp: {
      bot: 'Ольга', intro: 'Du sitter ved siden av Olga på en kafé.',
      steps: [
        { b: 'Здравствуйте! Как вас зовут?', bn: 'Goddag! Hva heter De?', h: 'Si hva du heter.', m: 'Меня зовут Ларс.', any: ['меня зовут', 'я'] },
        { b: 'Очень приятно! Вы турист?', bn: 'Hyggelig! Er du turist?', h: 'Si nei, du er student.', m: 'Нет, я студент.', ok: ['нет я студент', 'нет я студентка', 'я студент', 'я студентка', 'да я турист'] },
        { b: 'А я учительница.', bn: 'Og jeg er lærer.', h: 'Si «så interessant!»', m: 'Как интересно!', ok: ['как интересно', 'интересно', 'очень приятно'] }
      ]
    }
  },
  {
    id: 3, icon: '🌍', ru: 'Откуда вы?', no: 'Hvor er du fra?', place: 'Тверская улица',
    intro: 'Irina spør Lars hvor han kommer fra og hvilke språk han snakker.',
    dialog: [
      ['Ирина', 'Ларс, откуда вы?', 'Lars, hvor er du fra?'],
      ['Ларс', 'Я из Норвегии, из Осло.', 'Jeg er fra Norge, fra Oslo.'],
      ['Ирина', 'О, Норвегия! Вы говорите по-русски?', 'Å, Norge! Snakker du russisk?'],
      ['Ларс', 'Да, немного. Я говорю по-норвежски и по-английски.', 'Ja, litt. Jeg snakker norsk og engelsk.'],
      ['Ирина', 'А я говорю только по-русски.', 'Og jeg snakker bare russisk.'],
      ['Ларс', 'Ничего страшного! Мы говорим по-русски.', 'Ikke noe problem! Vi snakker russisk.']
    ],
    vocab: [['откуда', 'hvorfra'], ['из', 'fra'], ['Норвегия', 'Norge'], ['Россия', 'Russland'],
      ['говорить', 'å snakke'], ['по-русски', 'på russisk'], ['по-норвежски', 'på norsk'], ['по-английски', 'på engelsk'],
      ['немного', 'litt'], ['только', 'bare'], ['понимать', 'å forstå'], ['норвежец', 'nordmann']],
    grammar: {
      title: 'из + genitiv: «fra» et sted',
      html: `<p>Etter <b>из</b> (fra) står substantivet i <b>genitiv</b>.</p>
      <table class="gtable"><tr><th>Grunnform</th><th>из + genitiv</th><th>Regel</th></tr>
      <tr><td>Москва</td><td>из Москвы</td><td>-а → -ы</td></tr>
      <tr><td>Норвегия</td><td>из Норвегии</td><td>-я → -и</td></tr>
      <tr><td>Россия</td><td>из России</td><td>-ия → -ии</td></tr>
      <tr><td>Осло</td><td>из Осло</td><td>bøyes ikke</td></tr></table>`
    },
    quiz: [
      ['«Fra Moskva»', 'из Москвы', 'из Москва', 'из Москве', 'из Москву'],
      ['«Fra Russland»', 'из России', 'из Россия', 'из Россию', 'из Росси'],
      ['«Jeg snakker litt russisk»', 'Я немного говорю по-русски.', 'Я говорю русский немного есть.', 'Я немного русски.', 'Я говорю по-русский.']
    ],
    rp: {
      bot: 'Ирина', intro: 'Irina vil bli kjent med deg.',
      steps: [
        { b: 'Откуда вы?', bn: 'Hvor er du fra?', h: 'Si at du er fra Norge.', m: 'Я из Норвегии.', ok: ['я из норвегии', 'из норвегии', 'я из осло'] },
        { b: 'Вы говорите по-русски?', bn: 'Snakker du russisk?', h: 'Si «ja, litt».', m: 'Да, немного.', ok: ['да немного', 'немного', 'да я немного говорю по-русски'] },
        { b: 'Отлично! А по-английски?', bn: 'Flott! Og engelsk?', h: 'Si at du snakker engelsk.', m: 'Да, я говорю по-английски.', ok: ['да я говорю по-английски', 'я говорю по-английски', 'да'] }
      ]
    }
  },
  {
    id: 4, icon: '👨‍👩‍👧', ru: 'Это моя семья', no: 'Familien', place: 'Квартира на Арбате',
    intro: 'Lars viser Olga et familiebilde.',
    dialog: [
      ['Ольга', 'Кто это на фото?', 'Hvem er dette på bildet?'],
      ['Ларс', 'Это моя семья. Это мой папа, а это моя мама.', 'Dette er familien min. Dette er pappa, og dette er mamma.'],
      ['Ольга', 'А кто это?', 'Og hvem er dette?'],
      ['Ларс', 'Это моя сестра. Её зовут Ингрид.', 'Dette er søsteren min. Hun heter Ingrid.'],
      ['Ольга', 'А у тебя есть брат?', 'Har du en bror?'],
      ['Ларс', 'Да, есть. Его зовут Эрик.', 'Ja. Han heter Erik.']
    ],
    vocab: [['семья', 'familie'], ['мама', 'mamma'], ['папа', 'pappa'], ['брат', 'bror'], ['сестра', 'søster'],
      ['сын', 'sønn'], ['дочь', 'datter'], ['муж', 'ektemann'], ['жена', 'kone'], ['кто', 'hvem'],
      ['это', 'dette / det er'], ['у меня есть', 'jeg har']],
    grammar: {
      title: 'Kjønn og «min» – мой, моя, моё, мои',
      html: `<p>Alle substantiv har kjønn. Endelsen avslører det oftest:</p>
      <table class="gtable"><tr><th>Kjønn</th><th>Endelse</th><th>«min»</th><th>Eksempel</th></tr>
      <tr><td>Hankjønn</td><td>konsonant</td><td>мой</td><td>мой брат</td></tr>
      <tr><td>Hunkjønn</td><td>-а / -я</td><td>моя</td><td>моя сестра</td></tr>
      <tr><td>Intetkjønn</td><td>-о / -е</td><td>моё</td><td>моё фото</td></tr>
      <tr><td>Flertall</td><td>-ы / -и</td><td>мои</td><td>мои братья</td></tr></table>
      <p class="tip">⚠️ <b>папа</b> ender på -а, men er hankjønn: <b>мой папа</b>.</p>
      <p><b>У меня есть брат.</b> = Jeg har en bror (ordrett: «hos meg finnes en bror»).</p>`
    },
    quiz: [
      ['___ сестра', 'моя', 'мой', 'моё', 'мои'],
      ['___ папа', 'мой', 'моя', 'моё', 'мои'],
      ['«Jeg har en bror»', 'У меня есть брат.', 'Я есть брат.', 'Меня брат есть.', 'У я есть брат.']
    ],
    rp: {
      bot: 'Ольга', intro: 'Olga ser på bildene på telefonen din.',
      steps: [
        { b: 'Кто это на фото?', bn: 'Hvem er dette på bildet?', h: 'Si «det er familien min».', m: 'Это моя семья.', ok: ['это моя семья', 'моя семья'] },
        { b: 'А это кто?', bn: 'Og hvem er dette?', h: 'Si at det er moren din.', m: 'Это моя мама.', ok: ['это моя мама', 'моя мама', 'это мама', 'это мой папа', 'мой папа'] },
        { b: 'У тебя есть брат или сестра?', bn: 'Har du bror eller søster?', h: 'Si at du har en søster (eller bror).', m: 'У меня есть сестра.', any: ['есть сестра', 'есть брат', 'нет'] }
      ]
    }
  },
  {
    id: 5, icon: '🔢', ru: 'Числа', no: 'Tall og alder', place: 'Почтамт',
    intro: 'Maksim ber om Annas telefonnummer – og spør hvor gammel hun er.',
    dialog: [
      ['Максим', 'Анна, какой у тебя номер телефона?', 'Anna, hva er telefonnummeret ditt?'],
      ['Анна', 'Восемь, девять, один, шесть...', 'Åtte, ni, en, seks ...'],
      ['Максим', 'Подожди! Медленно, пожалуйста.', 'Vent! Sakte, vær så snill.'],
      ['Анна', 'Восемь, девять, один, шесть, два, пять.', 'Åtte, ni, en, seks, to, fem.'],
      ['Максим', 'Спасибо! А сколько тебе лет?', 'Takk! Og hvor gammel er du?'],
      ['Анна', 'Мне двадцать лет.', 'Jeg er tjue år.']
    ],
    vocab: [['ноль', '0'], ['один', '1'], ['два', '2'], ['три', '3'], ['четыре', '4'], ['пять', '5'],
      ['шесть', '6'], ['семь', '7'], ['восемь', '8'], ['девять', '9'], ['десять', '10'], ['двадцать', '20'],
      ['номер телефона', 'telefonnummer'], ['сколько', 'hvor mange / hvor mye'], ['медленно', 'sakte']],
    grammar: {
      title: 'Alder: мне + tall + год / года / лет',
      html: `<p>«Jeg er 20 år» heter <b>Мне двадцать лет</b> (ordrett «til meg tjue år»). Ordet for «år» endrer seg etter siste siffer:</p>
      <table class="gtable"><tr><th>Slutter på</th><th>Form</th><th>Eksempel</th></tr>
      <tr><td>1</td><td>год</td><td>двадцать один год</td></tr>
      <tr><td>2, 3, 4</td><td>года</td><td>двадцать два года</td></tr>
      <tr><td>5–9, 0, 11–19</td><td>лет</td><td>двадцать пять лет</td></tr></table>
      <p>Мне (meg) · тебе (deg) · ему (ham) · ей (henne)</p>`
    },
    quiz: [
      ['Мне двадцать один ___', 'год', 'года', 'лет', 'годов'],
      ['Мне двадцать три ___', 'года', 'год', 'лет', 'годы'],
      ['Мне восемнадцать ___', 'лет', 'год', 'года', 'годов'],
      ['Hva er 7 på russisk?', 'семь', 'восемь', 'шесть', 'девять']
    ],
    rp: {
      bot: 'Максим', intro: 'Maksim vil holde kontakten med deg.',
      steps: [
        { b: 'Какой у тебя номер телефона?', bn: 'Hva er telefonnummeret ditt?', h: 'Si et telefonnummer – tall for tall.', m: 'Восемь, девять, один, шесть, два, пять.', any: NUM_WORDS, dig: true },
        { b: 'Спасибо! Сколько тебе лет?', bn: 'Takk! Hvor gammel er du?', h: 'Si alderen din: «Мне ... лет».', m: 'Мне двадцать пять лет.', any: ['лет', 'год', 'года'], dig: true },
        { b: 'Отлично! Ну, пока!', bn: 'Flott! Nå, ha det!', h: 'Si ha det.', m: 'Пока!', ok: ['пока', 'до свидания', 'пока до завтра'] }
      ]
    }
  },
  {
    id: 6, icon: '☕', ru: 'В кафе', no: 'På kafé', place: 'Кафе «Пушкин»',
    intro: 'Lars bestiller frokost på en klassisk Moskva-kafé.',
    dialog: [
      ['Официант', 'Добрый день! Что вы хотите?', 'God dag! Hva vil du ha?'],
      ['Ларс', 'Добрый день! Я хочу кофе и бутерброд, пожалуйста.', 'God dag! Jeg vil ha kaffe og et smørbrød, takk.'],
      ['Официант', 'Кофе с молоком?', 'Kaffe med melk?'],
      ['Ларс', 'Нет, чёрный кофе. И ещё воду.', 'Nei, svart kaffe. Og vann også.'],
      ['Официант', 'Хорошо. Что-нибудь ещё?', 'Greit. Noe mer?'],
      ['Ларс', 'Нет, спасибо. Счёт, пожалуйста!', 'Nei takk. Regningen, takk!']
    ],
    vocab: [['кофе', 'kaffe'], ['чай', 'te'], ['вода', 'vann'], ['молоко', 'melk'], ['бутерброд', 'smørbrød'],
      ['суп', 'suppe'], ['хочу', 'jeg vil (ha)'], ['добрый день', 'god dag'], ['с молоком', 'med melk'],
      ['ещё', 'mer / også'], ['счёт', 'regning'], ['меню', 'meny']],
    grammar: {
      title: 'Akkusativ – det du vil ha',
      html: `<p>Objektet (det du vil ha, ser, kjøper) står i <b>akkusativ</b>. Bare hunkjønnsord på -а/-я endrer seg:</p>
      <table class="gtable"><tr><th>Grunnform</th><th>Я хочу ...</th><th>Regel</th></tr>
      <tr><td>вода</td><td>воду</td><td>-а → -у</td></tr>
      <tr><td>пицца</td><td>пиццу</td><td>-а → -у</td></tr>
      <tr><td>кофе, чай, суп</td><td>кофе, чай, суп</td><td>uendret (ting, hankjønn)</td></tr>
      <tr><td>молоко</td><td>молоко</td><td>uendret (intetkjønn)</td></tr></table>
      <p>хотеть: я <b>хочу</b>, ты <b>хочешь</b>, вы <b>хотите</b></p>`
    },
    quiz: [
      ['Я хочу ___ (vann)', 'воду', 'вода', 'воды', 'воде'],
      ['Я хочу ___ (smørbrød)', 'бутерброд', 'бутерброда', 'бутерброду', 'бутерброде'],
      ['Я хочу ___ (pizza)', 'пиццу', 'пицца', 'пиццы', 'пицце'],
      ['«Regningen, takk!»', 'Счёт, пожалуйста!', 'Меню, пожалуйста!', 'Спасибо, счёт есть!', 'Счёт хочу есть!']
    ],
    rp: {
      bot: 'Официант', intro: 'Du er sulten og setter deg ned på kafeen.',
      steps: [
        { b: 'Добрый день! Что вы хотите?', bn: 'God dag! Hva vil du ha?', h: 'Bestill en kaffe.', m: 'Я хочу кофе, пожалуйста.', ok: ['я хочу кофе', 'кофе пожалуйста', 'хочу кофе', 'я хочу кофе пожалуйста', 'я хочу чай', 'чай пожалуйста'] },
        { b: 'С молоком?', bn: 'Med melk?', h: 'Si ja, med melk – eller nei, svart.', m: 'Да, с молоком.', ok: ['да с молоком', 'с молоком', 'нет чёрный', 'нет спасибо', 'да пожалуйста', 'нет чёрный кофе', 'да'] },
        { b: 'Что-нибудь ещё?', bn: 'Noe mer?', h: 'Bestill vann – eller si nei takk.', m: 'И воду, пожалуйста.', ok: ['воду пожалуйста', 'нет спасибо', 'я хочу воду', 'и воду', 'ещё воду', 'и воду пожалуйста'] },
        { b: 'Хорошо, одну минуту.', bn: 'Greit, et øyeblikk.', h: 'Be om regningen.', m: 'Счёт, пожалуйста!', ok: ['счёт пожалуйста', 'счёт'] }
      ]
    }
  },
  {
    id: 7, icon: '🛍️', ru: 'Сколько стоит?', no: 'Hva koster det?', place: 'Измайловский рынок',
    intro: 'Lars handler epler og honning på et marked.',
    dialog: [
      ['Ларс', 'Здравствуйте! Сколько стоят яблоки?', 'Goddag! Hva koster eplene?'],
      ['Продавщица', 'Сто рублей килограмм.', 'Hundre rubler kiloen.'],
      ['Ларс', 'А сколько стоит этот мёд?', 'Og hva koster denne honningen?'],
      ['Продавщица', 'Пятьсот рублей. Очень вкусный!', 'Fem hundre rubler. Veldig god!'],
      ['Ларс', 'Хорошо, дайте, пожалуйста, мёд и килограмм яблок.', 'Greit, gi meg honningen og en kilo epler, takk.'],
      ['Продавщица', 'Шестьсот рублей. Спасибо!', 'Seks hundre rubler. Takk!']
    ],
    vocab: [['сколько стоит?', 'hva koster?'], ['рубль', 'rubel'], ['сто', '100'], ['двести', '200'],
      ['триста', '300'], ['пятьсот', '500'], ['тысяча', '1000'], ['дорого', 'dyrt'], ['дёшево', 'billig'],
      ['яблоко', 'eple'], ['мёд', 'honning'], ['дайте', 'gi (meg) – høflig'], ['вкусный', 'god (på smak)']],
    grammar: {
      title: 'Tall + рубль',
      html: `<p>Samme mønster som med alder (год/года/лет):</p>
      <table class="gtable"><tr><th>Slutter på</th><th>Form</th><th>Eksempel</th></tr>
      <tr><td>1</td><td>рубль</td><td>двадцать один рубль</td></tr>
      <tr><td>2, 3, 4</td><td>рубля</td><td>три рубля</td></tr>
      <tr><td>5–9, 0, 11–19</td><td>рублей</td><td>пятьсот рублей</td></tr></table>
      <p><b>Сколько стоит</b> мёд? (entall) · <b>Сколько стоят</b> яблоки? (flertall)</p>`
    },
    quiz: [
      ['три ___', 'рубля', 'рубль', 'рублей', 'рубли'],
      ['пятьсот ___', 'рублей', 'рубля', 'рубль', 'рубли'],
      ['«Hva koster eplene?»', 'Сколько стоят яблоки?', 'Сколько стоит яблоки?', 'Как стоят яблоки?', 'Сколько яблоки есть?']
    ],
    rp: {
      bot: 'Продавщица', intro: 'Du står ved en markedsbod full av honning.',
      steps: [
        { b: 'Здравствуйте! Что вы хотите?', bn: 'Goddag! Hva vil du ha?', h: 'Spør hva honningen koster.', m: 'Сколько стоит мёд?', ok: ['сколько стоит мёд', 'сколько стоит этот мёд', 'здравствуйте сколько стоит мёд'] },
        { b: 'Пятьсот рублей.', bn: 'Fem hundre rubler.', h: 'Si at det er dyrt.', m: 'Это дорого!', ok: ['дорого', 'это дорого', 'очень дорого'] },
        { b: 'Хорошо, для вас – четыреста!', bn: 'Greit, for deg – fire hundre!', h: 'Si «greit, gi meg honningen, takk».', m: 'Хорошо, дайте, пожалуйста, мёд.', ok: ['хорошо дайте пожалуйста мёд', 'дайте пожалуйста мёд', 'хорошо дайте мёд', 'дайте мёд пожалуйста', 'хорошо спасибо'] }
      ]
    }
  },
  {
    id: 8, icon: '🚇', ru: 'Где метро?', no: 'Veibeskrivelse', place: 'Площадь Революции',
    intro: 'Lars har gått seg bort og spør en forbipasserende om veien.',
    dialog: [
      ['Ларс', 'Извините, где метро?', 'Unnskyld, hvor er T-banen?'],
      ['Прохожая', 'Метро? Идите прямо, потом направо.', 'T-banen? Gå rett fram, så til høyre.'],
      ['Ларс', 'Это далеко?', 'Er det langt?'],
      ['Прохожая', 'Нет, близко. Пять минут. Метро там, на площади.', 'Nei, nært. Fem minutter. T-banen er der, på plassen.'],
      ['Ларс', 'А где здесь музей?', 'Og hvor er museet her?'],
      ['Прохожая', 'Музей в центре, на Красной площади.', 'Museet er i sentrum, på Den røde plass.'],
      ['Ларс', 'Большое спасибо!', 'Tusen takk!']
    ],
    vocab: [['где', 'hvor'], ['извините', 'unnskyld'], ['метро', 'T-bane'], ['прямо', 'rett fram'],
      ['направо', 'til høyre'], ['налево', 'til venstre'], ['далеко', 'langt'], ['близко', 'nært'],
      ['здесь', 'her'], ['там', 'der'], ['музей', 'museum'], ['центр', 'sentrum'], ['площадь', 'plass, torg'],
      ['большое спасибо', 'tusen takk']],
    grammar: {
      title: 'Preposisjonal: в / на + -е (hvor noe er)',
      html: `<p>For å si <i>hvor</i> noe er, bruker du <b>в</b> (i, inne i) eller <b>на</b> (på – åpne steder, plasser, gater) + <b>preposisjonal</b>:</p>
      <table class="gtable"><tr><th>Grunnform</th><th>Hvor?</th><th>Regel</th></tr>
      <tr><td>центр</td><td>в центре</td><td>+ е</td></tr>
      <tr><td>Москва</td><td>в Москве</td><td>-а → -е</td></tr>
      <tr><td>музей</td><td>в музее</td><td>-й → -е</td></tr>
      <tr><td>площадь</td><td>на площади</td><td>-ь → -и</td></tr>
      <tr><td>Норвегия</td><td>в Норвегии</td><td>-ия → -ии</td></tr></table>`
    },
    quiz: [
      ['Я ___ (i Moskva)', 'в Москве', 'в Москва', 'на Москве', 'в Москву'],
      ['Музей на ___', 'площади', 'площадь', 'площаде', 'площадью'],
      ['«til venstre»', 'налево', 'направо', 'прямо', 'назад']
    ],
    rp: {
      bot: 'Прохожая', intro: 'Du er på vei til T-banen, men finner den ikke.',
      steps: [
        { b: 'Вы что-то ищете?', bn: 'Leter du etter noe?', h: 'Spør hvor T-banen er.', m: 'Извините, где метро?', ok: ['извините где метро', 'где метро', 'где здесь метро', 'да где метро'] },
        { b: 'Идите прямо, потом налево.', bn: 'Gå rett fram, så til venstre.', h: 'Spør om det er langt.', m: 'Это далеко?', ok: ['это далеко', 'далеко'] },
        { b: 'Нет, близко. Пять минут.', bn: 'Nei, nært. Fem minutter.', h: 'Takk pent.', m: 'Большое спасибо!', ok: ['большое спасибо', 'спасибо'] }
      ]
    }
  },
  {
    id: 9, icon: '🕰️', ru: 'Который час?', no: 'Hva er klokka?', place: 'Ростовский кремль',
    intro: 'Anna og Maksim er på tur i Rostov og må rekke toget.',
    dialog: [
      ['Максим', 'Анна, который час?', 'Anna, hva er klokka?'],
      ['Анна', 'Сейчас три часа.', 'Den er tre nå.'],
      ['Максим', 'Ой! Поезд в четыре часа.', 'Oi! Toget går klokka fire.'],
      ['Анна', 'Не волнуйся, у нас ещё есть время.', 'Ikke vær redd, vi har fortsatt tid.'],
      ['Максим', 'Хорошо. А когда мы будем дома?', 'Greit. Og når er vi hjemme?'],
      ['Анна', 'Вечером, в девять часов.', 'I kveld, klokka ni.']
    ],
    vocab: [['который час?', 'hva er klokka?'], ['час', 'time / klokka'], ['минута', 'minutt'], ['сейчас', 'nå'],
      ['утро', 'morgen'], ['день', 'dag'], ['вечер', 'kveld'], ['ночь', 'natt'], ['сегодня', 'i dag'],
      ['завтра', 'i morgen'], ['вчера', 'i går'], ['когда?', 'når?'], ['время', 'tid'], ['не волнуйся', 'ikke vær redd']],
    grammar: {
      title: 'Klokka og tider på døgnet',
      html: `<table class="gtable"><tr><th>Tall</th><th>Form</th><th>Eksempel</th></tr>
      <tr><td>1</td><td>час</td><td>Сейчас час.</td></tr>
      <tr><td>2, 3, 4</td><td>часа</td><td>Сейчас три часа.</td></tr>
      <tr><td>5–12</td><td>часов</td><td>Сейчас пять часов.</td></tr></table>
      <p><b>в</b> + klokkeslett = «klokka ...»: Поезд <b>в</b> четыре часа.</p>
      <p>Tider på døgnet (instrumental): <b>утром</b> (om morgenen) · <b>днём</b> (om dagen) · <b>вечером</b> (om kvelden) · <b>ночью</b> (om natta)</p>`
    },
    quiz: [
      ['Сейчас пять ___', 'часов', 'часа', 'час', 'часы'],
      ['Сейчас два ___', 'часа', 'часов', 'час', 'часы'],
      ['«om kvelden»', 'вечером', 'вечер', 'в вечер', 'вечеру']
    ],
    rp: {
      bot: 'Анна', intro: 'Anna har glemt klokka si og spør deg.',
      steps: [
        { b: 'Извините, который час?', bn: 'Unnskyld, hva er klokka?', h: 'Si hva klokka er (Сейчас ... часа/часов).', m: 'Сейчас три часа.', any: ['час', 'часа', 'часов'], dig: true },
        { b: 'Спасибо! А когда поезд?', bn: 'Takk! Og når går toget?', h: 'Si at toget går klokka fire.', m: 'Поезд в четыре часа.', ok: ['в четыре часа', 'поезд в четыре часа', 'в четыре'], dig: true },
        { b: 'Ой, у нас мало времени!', bn: 'Oi, vi har dårlig tid!', h: 'Si «ikke vær redd».', m: 'Не волнуйся!', ok: ['не волнуйся', 'не волнуйтесь', 'не волнуйся у нас есть время'] }
      ]
    }
  },
  {
    id: 10, icon: '🌅', ru: 'Мой день', no: 'Dagen min', place: 'Суздаль',
    intro: 'Olga spør Lars hvordan en vanlig dag ser ut.',
    dialog: [
      ['Ольга', 'Ларс, что ты делаешь утром?', 'Lars, hva gjør du om morgenen?'],
      ['Ларс', 'Утром я завтракаю и читаю новости.', 'Om morgenen spiser jeg frokost og leser nyheter.'],
      ['Ольга', 'А днём?', 'Og om dagen?'],
      ['Ларс', 'Днём я работаю. Я работаю в офисе.', 'Om dagen jobber jeg. Jeg jobber på et kontor.'],
      ['Ольга', 'А вечером?', 'Og om kvelden?'],
      ['Ларс', 'Вечером я ужинаю, слушаю музыку и отдыхаю.', 'Om kvelden spiser jeg middag, hører på musikk og slapper av.']
    ],
    vocab: [['делать', 'å gjøre'], ['работать', 'å jobbe'], ['читать', 'å lese'], ['слушать', 'å høre på'],
      ['знать', 'å vite, kjenne'], ['завтракать', 'å spise frokost'], ['обедать', 'å spise lunsj'],
      ['ужинать', 'å spise middag'], ['отдыхать', 'å slappe av'], ['музыка', 'musikk'], ['новости', 'nyheter'], ['офис', 'kontor']],
    grammar: {
      title: '1. konjugasjon: verb på -ать',
      html: `<p>Fjern <b>-ть</b> og legg til endelsen:</p>
      <table class="gtable"><tr><th>Person</th><th>работать</th><th>читать</th></tr>
      <tr><td>я</td><td>работа<b>ю</b></td><td>чита<b>ю</b></td></tr>
      <tr><td>ты</td><td>работа<b>ешь</b></td><td>чита<b>ешь</b></td></tr>
      <tr><td>он / она</td><td>работа<b>ет</b></td><td>чита<b>ет</b></td></tr>
      <tr><td>мы</td><td>работа<b>ем</b></td><td>чита<b>ем</b></td></tr>
      <tr><td>вы</td><td>работа<b>ете</b></td><td>чита<b>ете</b></td></tr>
      <tr><td>они</td><td>работа<b>ют</b></td><td>чита<b>ют</b></td></tr></table>`
    },
    quiz: [
      ['Ты ___ (jobber)', 'работаешь', 'работаю', 'работает', 'работают'],
      ['Они ___ (leser)', 'читают', 'читает', 'читаем', 'читаешь'],
      ['Мы ___ музыку (hører på)', 'слушаем', 'слушаете', 'слушают', 'слушаю']
    ],
    rp: {
      bot: 'Ольга', intro: 'Olga intervjuer deg om hverdagen din.',
      steps: [
        { b: 'Что ты делаешь утром?', bn: 'Hva gjør du om morgenen?', h: 'Si at du spiser frokost.', m: 'Утром я завтракаю.', ok: ['утром я завтракаю', 'я завтракаю', 'завтракаю', 'я читаю новости'] },
        { b: 'А где ты работаешь?', bn: 'Og hvor jobber du?', h: 'Si at du jobber på et kontor.', m: 'Я работаю в офисе.', ok: ['я работаю в офисе', 'в офисе'], any: ['работаю'] },
        { b: 'А что ты делаешь вечером?', bn: 'Og hva gjør du om kvelden?', h: 'Si at du slapper av eller hører på musikk.', m: 'Вечером я отдыхаю.', any: ['отдыхаю', 'слушаю', 'читаю', 'ужинаю', 'гуляю', 'работаю'] }
      ]
    }
  },
  {
    id: 11, icon: '🎨', ru: 'Я люблю...', no: 'Fritid og hobbyer', place: 'Владимир',
    intro: 'Maksim og Lars snakker om hva de liker å gjøre på fritiden.',
    dialog: [
      ['Максим', 'Ларс, что ты любишь делать?', 'Lars, hva liker du å gjøre?'],
      ['Ларс', 'Я люблю читать и гулять. А ты?', 'Jeg liker å lese og gå tur. Og du?'],
      ['Максим', 'Я люблю футбол. Я часто играю в футбол.', 'Jeg elsker fotball. Jeg spiller ofte fotball.'],
      ['Ларс', 'А ты любишь кино?', 'Liker du film?'],
      ['Максим', 'Да, очень! Я смотрю фильмы каждую неделю.', 'Ja, veldig! Jeg ser film hver uke.'],
      ['Ларс', 'Давай пойдём в кино в субботу!', 'La oss gå på kino på lørdag!'],
      ['Максим', 'С удовольствием!', 'Med glede!']
    ],
    vocab: [['любить', 'å like, elske'], ['гулять', 'å gå tur'], ['играть', 'å spille, leke'], ['смотреть', 'å se på'],
      ['футбол', 'fotball'], ['кино', 'kino'], ['фильм', 'film'], ['часто', 'ofte'], ['иногда', 'noen ganger'],
      ['никогда', 'aldri'], ['каждый день', 'hver dag'], ['давай', 'la oss'], ['с удовольствием', 'med glede, gjerne']],
    grammar: {
      title: '2. konjugasjon: verb på -ить / -еть',
      html: `<table class="gtable"><tr><th>Person</th><th>любить</th><th>смотреть</th></tr>
      <tr><td>я</td><td>люб<b>лю</b></td><td>смотр<b>ю</b></td></tr>
      <tr><td>ты</td><td>люб<b>ишь</b></td><td>смотр<b>ишь</b></td></tr>
      <tr><td>он / она</td><td>люб<b>ит</b></td><td>смотр<b>ит</b></td></tr>
      <tr><td>мы</td><td>люб<b>им</b></td><td>смотр<b>им</b></td></tr>
      <tr><td>вы</td><td>люб<b>ите</b></td><td>смотр<b>ите</b></td></tr>
      <tr><td>они</td><td>люб<b>ят</b></td><td>смотр<b>ят</b></td></tr></table>
      <p class="tip">⚠️ любить får en ekstra <b>л</b> i jeg-form: я любл<b>ю</b>.</p>
      <p>Sport: <b>играть в</b> + akkusativ: играть в футбол, в теннис.</p>`
    },
    quiz: [
      ['Он ___ кино', 'любит', 'люблю', 'любят', 'любишь'],
      ['Я ___ фильм', 'смотрю', 'смотрит', 'смотришь', 'смотрят'],
      ['«Jeg spiller fotball»', 'Я играю в футбол.', 'Я играю футбол в.', 'Я играю на футбол.', 'Я играть футбол.']
    ],
    rp: {
      bot: 'Максим', intro: 'Maksim vil finne på noe med deg i helga.',
      steps: [
        { b: 'Что ты любишь делать?', bn: 'Hva liker du å gjøre?', h: 'Si hva du liker å gjøre (Я люблю ...).', m: 'Я люблю читать и гулять.', any: ['люблю'] },
        { b: 'А ты любишь футбол?', bn: 'Liker du fotball?', h: 'Svar ja eller nei.', m: 'Да, люблю!', ok: ['да люблю', 'нет не люблю', 'да', 'нет', 'да очень', 'люблю', 'не люблю', 'иногда'] },
        { b: 'Давай пойдём в кино в субботу!', bn: 'La oss gå på kino på lørdag!', h: 'Si «ja, gjerne!»', m: 'Да, с удовольствием!', ok: ['да с удовольствием', 'с удовольствием', 'давай', 'да давай', 'хорошо', 'да'] }
      ]
    }
  },
  {
    id: 12, icon: '⛅', ru: 'Погода', no: 'Vær og årstider', place: 'Кострома на Волге',
    intro: 'Anna og Lars snakker om vær – og om norsk vinter.',
    dialog: [
      ['Анна', 'Какая сегодня погода?', 'Hvordan er været i dag?'],
      ['Ларс', 'Сегодня холодно и идёт снег.', 'I dag er det kaldt og det snør.'],
      ['Анна', 'Ты любишь зиму?', 'Liker du vinteren?'],
      ['Ларс', 'Да, я из Норвегии! Я люблю зиму и снег.', 'Ja, jeg er fra Norge! Jeg elsker vinter og snø.'],
      ['Анна', 'А я люблю лето. Летом тепло и светит солнце.', 'Og jeg liker sommeren. Om sommeren er det varmt og sola skinner.'],
      ['Ларс', 'Летом в Норвегии тоже хорошо!', 'Om sommeren er det også fint i Norge!']
    ],
    vocab: [['погода', 'vær'], ['холодно', 'kaldt'], ['тепло', 'varmt (behagelig)'], ['жарко', 'hett'],
      ['снег', 'snø'], ['дождь', 'regn'], ['солнце', 'sol'], ['идёт снег', 'det snør'], ['идёт дождь', 'det regner'],
      ['зима', 'vinter'], ['весна', 'vår'], ['лето', 'sommer'], ['осень', 'høst']],
    grammar: {
      title: 'Årstider og setninger uten subjekt',
      html: `<table class="gtable"><tr><th>Årstid</th><th>Når? (om ...)</th></tr>
      <tr><td>зима</td><td>зимой</td></tr><tr><td>весна</td><td>весной</td></tr>
      <tr><td>лето</td><td>летом</td></tr><tr><td>осень</td><td>осенью</td></tr></table>
      <p>Vær beskrives ofte uten subjekt: <b>Холодно.</b> = Det er kaldt. <b>Тепло.</b> = Det er varmt.</p>
      <p>Nedbør «går»: <b>Идёт дождь.</b> = Det regner. <b>Идёт снег.</b> = Det snør.</p>`
    },
    quiz: [
      ['«om sommeren»', 'летом', 'лето', 'в лето', 'летой'],
      ['«om vinteren»', 'зимой', 'зима', 'зиму', 'в зиме'],
      ['«Det regner»', 'Идёт дождь.', 'Дождь делает.', 'Есть дождь делать.', 'Дождь идёт снег.']
    ],
    rp: {
      bot: 'Анна', intro: 'Anna ringer deg fra Kostroma.',
      steps: [
        { b: 'Какая сегодня погода?', bn: 'Hvordan er været i dag?', h: 'Beskriv været (kaldt, varmt, regn, sol ...).', m: 'Сегодня тепло и светит солнце.', any: ['холодно', 'тепло', 'жарко', 'снег', 'дождь', 'солнце', 'хорошая', 'плохая'] },
        { b: 'Ты любишь зиму?', bn: 'Liker du vinteren?', h: 'Svar, og si hvilken årstid du liker.', m: 'Да, я люблю зиму.', any: ['зиму', 'лето', 'весну', 'осень', 'люблю', 'да', 'нет'] },
        { b: 'А что ты делаешь летом?', bn: 'Og hva gjør du om sommeren?', h: 'Si hva du gjør om sommeren.', m: 'Летом я гуляю и отдыхаю.', any: ['гуляю', 'отдыхаю', 'играю', 'читаю', 'плаваю', 'работаю', 'летом'] }
      ]
    }
  },
  {
    id: 13, icon: '🚆', ru: 'На вокзале', no: 'På togstasjonen', place: 'Ленинградский вокзал',
    intro: 'Lars kjøper togbillett fra Moskva til St. Petersburg.',
    dialog: [
      ['Ларс', 'Здравствуйте! Один билет до Санкт-Петербурга, пожалуйста.', 'Goddag! Én billett til St. Petersburg, takk.'],
      ['Кассир', 'На какое число?', 'For hvilken dato?'],
      ['Ларс', 'На завтра, на утро.', 'For i morgen, om morgenen.'],
      ['Кассир', 'Есть поезд «Сапсан» в семь часов. Билет туда и обратно?', 'Det går et «Sapsan»-tog klokka sju. Tur-retur?'],
      ['Ларс', 'Нет, только туда. Сколько стоит?', 'Nei, bare én vei. Hva koster det?'],
      ['Кассир', 'Четыре тысячи рублей. Вот ваш билет.', 'Fire tusen rubler. Her er billetten din.']
    ],
    vocab: [['вокзал', 'jernbanestasjon'], ['поезд', 'tog'], ['билет', 'billett'], ['касса', 'billettluke, kasse'],
      ['до', 'til (et sted)'], ['туда', 'dit'], ['обратно', 'tilbake'], ['туда и обратно', 'tur-retur'],
      ['вагон', 'vogn'], ['место', 'plass, sete'], ['платформа', 'plattform'], ['вот', 'her er']],
    grammar: {
      title: 'до + genitiv: «til» et sted',
      html: `<p><b>до</b> (til, helt til) tar genitiv – samme form som etter <b>из</b>:</p>
      <table class="gtable"><tr><th>Grunnform</th><th>до + genitiv</th><th>Regel</th></tr>
      <tr><td>Санкт-Петербург</td><td>до Санкт-Петербурга</td><td>hankjønn + а</td></tr>
      <tr><td>Москва</td><td>до Москвы</td><td>-а → -ы</td></tr>
      <tr><td>Казань</td><td>до Казани</td><td>-ь → -и</td></tr></table>`
    },
    quiz: [
      ['Билет до ___ (Moskva)', 'Москвы', 'Москва', 'Москве', 'Москву'],
      ['Билет до ___ (Novgorod)', 'Новгорода', 'Новгород', 'Новгороде', 'Новгороду'],
      ['«tur-retur»', 'туда и обратно', 'только туда', 'туда-сюда', 'обратно туда']
    ],
    rp: {
      bot: 'Кассир', intro: 'Du står i kø ved billettluka på stasjonen.',
      steps: [
        { b: 'Здравствуйте! Куда вы едете?', bn: 'Goddag! Hvor skal du?', h: 'Be om én billett til St. Petersburg.', m: 'Один билет до Санкт-Петербурга, пожалуйста.', ok: ['один билет до санкт-петербурга пожалуйста', 'билет до санкт-петербурга', 'один билет до петербурга', 'билет до петербурга', 'до санкт-петербурга'] },
        { b: 'Туда и обратно?', bn: 'Tur-retur?', h: 'Si: nei, bare én vei.', m: 'Нет, только туда.', ok: ['нет только туда', 'только туда', 'да туда и обратно', 'туда и обратно'] },
        { b: 'Четыре тысячи рублей.', bn: 'Fire tusen rubler.', h: 'Si «vær så god» mens du betaler.', m: 'Вот, пожалуйста.', ok: ['вот пожалуйста', 'пожалуйста', 'вот'] }
      ]
    }
  },
  {
    id: 14, icon: '🏨', ru: 'В гостинице', no: 'På hotellet', place: 'Невский проспект',
    intro: 'Lars sjekker inn på et hotell i St. Petersburg.',
    dialog: [
      ['Администратор', 'Добрый вечер! Чем могу помочь?', 'God kveld! Hva kan jeg hjelpe med?'],
      ['Ларс', 'Добрый вечер! У меня бронь. Моя фамилия Хансен.', 'God kveld! Jeg har en reservasjon. Etternavnet mitt er Hansen.'],
      ['Администратор', 'Да, одноместный номер на три ночи. Ваш паспорт, пожалуйста.', 'Ja, enkeltrom for tre netter. Passet ditt, takk.'],
      ['Ларс', 'Вот, пожалуйста. А в номере есть интернет?', 'Vær så god. Er det internett på rommet?'],
      ['Администратор', 'Да, есть. А завтрака, к сожалению, нет.', 'Ja. Men frokost er det dessverre ikke.'],
      ['Ларс', 'Ничего. Спасибо!', 'Det går fint. Takk!']
    ],
    vocab: [['гостиница', 'hotell'], ['номер', 'hotellrom / nummer'], ['бронь', 'reservasjon'], ['фамилия', 'etternavn'],
      ['паспорт', 'pass'], ['ключ', 'nøkkel'], ['этаж', 'etasje'], ['одноместный номер', 'enkeltrom'],
      ['двухместный номер', 'dobbeltrom'], ['завтрак', 'frokost'], ['к сожалению', 'dessverre'], ['ничего', 'det går fint / ingenting']],
    grammar: {
      title: 'нет + genitiv: «det finnes ikke»',
      html: `<p>Når noe <i>ikke finnes</i> eller du <i>ikke har</i> det, står det i genitiv etter <b>нет</b>:</p>
      <table class="gtable"><tr><th>Det finnes</th><th>Det finnes ikke</th></tr>
      <tr><td>Есть интернет.</td><td>Нет интернет<b>а</b>.</td></tr>
      <tr><td>Есть вода.</td><td>Нет вод<b>ы</b>.</td></tr>
      <tr><td>У меня есть ключ.</td><td>У меня нет ключ<b>а</b>.</td></tr></table>`
    },
    quiz: [
      ['В номере нет ___ (vann)', 'воды', 'вода', 'воду', 'воде'],
      ['У меня нет ___ (nøkkel)', 'ключа', 'ключ', 'ключе', 'ключу'],
      ['«dessverre»', 'к сожалению', 'ничего', 'пожалуйста', 'конечно']
    ],
    rp: {
      bot: 'Администратор', intro: 'Du kommer sliten fram til hotellresepsjonen.',
      steps: [
        { b: 'Добрый вечер! Чем могу помочь?', bn: 'God kveld! Hva kan jeg hjelpe med?', h: 'Si at du har en reservasjon.', m: 'У меня бронь.', ok: ['у меня бронь', 'добрый вечер у меня бронь'] },
        { b: 'Ваша фамилия?', bn: 'Etternavnet ditt?', h: 'Si etternavnet ditt: «Моя фамилия ...».', m: 'Моя фамилия Хансен.', any: ['фамилия', 'моя'] },
        { b: 'Вот ваш ключ. Номер на третьем этаже.', bn: 'Her er nøkkelen. Rommet er i tredje etasje.', h: 'Spør om det er internett på rommet.', m: 'А в номере есть интернет?', ok: ['в номере есть интернет', 'есть интернет', 'а в номере есть интернет', 'интернет есть'] }
      ]
    }
  },
  {
    id: 15, icon: '🩺', ru: 'У врача', no: 'Hos legen', place: 'Поликлиника на Мойке',
    intro: 'Lars har blitt forkjølet og går til legen.',
    dialog: [
      ['Врач', 'Здравствуйте! Что у вас болит?', 'Goddag! Hvor har du vondt?'],
      ['Ларс', 'У меня болит голова. И горло тоже.', 'Jeg har vondt i hodet. Og i halsen også.'],
      ['Врач', 'У вас есть температура?', 'Har du feber?'],
      ['Ларс', 'Да, тридцать восемь.', 'Ja, trettiåtte.'],
      ['Врач', 'Это простуда. Пейте чай с мёдом и отдыхайте.', 'Det er forkjølelse. Drikk te med honning og hvil.'],
      ['Ларс', 'Спасибо, доктор!', 'Takk, doktor!']
    ],
    vocab: [['врач', 'lege'], ['аптека', 'apotek'], ['голова', 'hode'], ['горло', 'hals'], ['живот', 'mage'],
      ['зуб', 'tann'], ['нога', 'bein, fot'], ['рука', 'arm, hånd'], ['болит', 'gjør vondt'],
      ['температура', 'feber, temperatur'], ['простуда', 'forkjølelse'], ['лекарство', 'medisin'], ['плохо', 'dårlig']],
    grammar: {
      title: '«Jeg har vondt i ...» og høflig imperativ',
      html: `<p><b>У меня болит</b> + kroppsdel (entall) · <b>У меня болят</b> + kroppsdeler (flertall)</p>
      <table class="gtable"><tr><th>Entall</th><th>Flertall</th></tr>
      <tr><td>У меня болит голова.</td><td>У меня болят ноги.</td></tr>
      <tr><td>У меня болит зуб.</td><td>У меня болят зубы.</td></tr></table>
      <p>Høflig imperativ ender på <b>-те</b>: пей<b>те</b> (drikk), отдыхай<b>те</b> (hvil), иди<b>те</b> (gå).</p>
      <p><b>Мне плохо.</b> = Jeg føler meg dårlig.</p>`
    },
    quiz: [
      ['У меня ___ зуб', 'болит', 'болят', 'болеть', 'больно'],
      ['У меня ___ ноги', 'болят', 'болит', 'болею', 'больной'],
      ['«Jeg føler meg dårlig»', 'Мне плохо.', 'Я плохо.', 'Мне плохой.', 'Меня плохо.']
    ],
    rp: {
      bot: 'Врач', intro: 'Du sitter på legekontoret.',
      steps: [
        { b: 'Здравствуйте! Что у вас болит?', bn: 'Goddag! Hvor har du vondt?', h: 'Si at du har vondt i hodet.', m: 'У меня болит голова.', any: ['болит', 'болят', 'голова', 'горло', 'живот', 'зуб'] },
        { b: 'У вас есть температура?', bn: 'Har du feber?', h: 'Svar ja eller nei.', m: 'Да, тридцать восемь.', ok: ['да есть', 'нет', 'да', 'нет температуры', 'да тридцать восемь'], dig: true },
        { b: 'Вот лекарство. Пейте чай с мёдом.', bn: 'Her er medisin. Drikk te med honning.', h: 'Takk legen.', m: 'Спасибо, доктор!', ok: ['спасибо доктор', 'спасибо', 'большое спасибо'] }
      ]
    }
  },
  {
    id: 16, icon: '📸', ru: 'Вчера', no: 'I går (fortid)', place: 'Эрмитаж',
    intro: 'Olga ringer Lars og spør hva han gjorde i går.',
    dialog: [
      ['Ольга', 'Ларс, что ты делал вчера?', 'Lars, hva gjorde du i går?'],
      ['Ларс', 'Вчера я был в Эрмитаже.', 'I går var jeg på Eremitasjen.'],
      ['Ольга', 'Здорово! Тебе понравилось?', 'Kult! Likte du det?'],
      ['Ларс', 'Очень! Я смотрел картины три часа. А ты?', 'Veldig! Jeg så på malerier i tre timer. Og du?'],
      ['Ольга', 'А я была дома, читала книгу и готовила ужин.', 'Jeg var hjemme, leste en bok og lagde middag.'],
      ['Ларс', 'Тоже неплохо!', 'Ikke verst det heller!']
    ],
    vocab: [['был', 'var (han)'], ['была', 'var (hun)'], ['были', 'var (flertall)'], ['делал', 'gjorde'],
      ['дома', 'hjemme'], ['картина', 'maleri'], ['книга', 'bok'], ['готовить', 'å lage mat'], ['ужин', 'middag, kveldsmat'],
      ['здорово', 'kult, flott'], ['понравилось', 'likte (det)'], ['неплохо', 'ikke verst'], ['экскурсия', 'omvisning, utflukt']],
    grammar: {
      title: 'Preteritum: -л, -ла, -ло, -ли',
      html: `<p>Fortid lages av infinitiv: fjern <b>-ть</b> og legg til <b>-л</b>. Formen følger <i>kjønnet</i> til den som gjør noe!</p>
      <table class="gtable"><tr><th>Subjekt</th><th>читать</th><th>быть</th></tr>
      <tr><td>я / ты / он (mann)</td><td>чита<b>л</b></td><td>бы<b>л</b></td></tr>
      <tr><td>я / ты / она (kvinne)</td><td>чита<b>ла</b></td><td>бы<b>ла</b></td></tr>
      <tr><td>оно</td><td>чита<b>ло</b></td><td>бы<b>ло</b></td></tr>
      <tr><td>мы / вы / они</td><td>чита<b>ли</b></td><td>бы<b>ли</b></td></tr></table>
      <p class="tip">💡 En kvinne sier <b>Я была дома</b>, en mann <b>Я был дома</b>.</p>`
    },
    quiz: [
      ['Ольга ___ дома', 'была', 'был', 'были', 'было'],
      ['Мы ___ фильм (så)', 'смотрели', 'смотрел', 'смотрела', 'смотрим'],
      ['Ларс ___ в музее', 'был', 'была', 'были', 'есть']
    ],
    rp: {
      bot: 'Ольга', intro: 'Olga ringer deg en søndag formiddag.',
      steps: [
        { b: 'Привет! Что ты делал вчера?', bn: 'Hei! Hva gjorde du i går?', h: 'Si hvor du var i går (Вчера я был/была в ...).', m: 'Вчера я был в музее.', any: ['был', 'была'] },
        { b: 'Интересно! А что ты там делал?', bn: 'Interessant! Hva gjorde du der?', h: 'Fortell hva du gjorde (bruk -л / -ла).', m: 'Я смотрел картины.', any: ['смотрел', 'смотрела', 'читал', 'читала', 'гулял', 'гуляла', 'фотографировал', 'фотографировала', 'отдыхал', 'отдыхала', 'слушал', 'слушала', 'играл', 'играла', 'ужинал', 'ужинала', 'обедал', 'обедала', 'работал', 'работала', 'готовил', 'готовила', 'делал', 'делала'] },
        { b: 'Здорово! Тебе понравилось?', bn: 'Kult! Likte du det?', h: 'Si «ja, veldig!»', m: 'Да, очень!', ok: ['да очень', 'очень', 'да очень понравилось', 'да понравилось', 'да', 'нет'] }
      ]
    }
  },
  {
    id: 17, icon: '🗓️', ru: 'Планы', no: 'Planer for helga', place: 'Иркутск',
    intro: 'Lars forteller Maksim om planene sine i Sibir.',
    dialog: [
      ['Максим', 'Что ты будешь делать в выходные?', 'Hva skal du gjøre i helga?'],
      ['Ларс', 'В субботу я поеду на Байкал.', 'På lørdag reiser jeg til Bajkal.'],
      ['Максим', 'Здорово! Что ты будешь там делать?', 'Flott! Hva skal du gjøre der?'],
      ['Ларс', 'Я буду гулять, фотографировать и отдыхать.', 'Jeg skal gå tur, ta bilder og slappe av.'],
      ['Максим', 'А когда ты вернёшься?', 'Og når kommer du tilbake?'],
      ['Ларс', 'В понедельник вечером.', 'Mandag kveld.']
    ],
    vocab: [['выходные', 'helg'], ['понедельник', 'mandag'], ['вторник', 'tirsdag'], ['среда', 'onsdag'],
      ['четверг', 'torsdag'], ['пятница', 'fredag'], ['суббота', 'lørdag'], ['воскресенье', 'søndag'],
      ['планы', 'planer'], ['поехать', 'å reise, dra (av sted)'], ['вернуться', 'å komme tilbake'], ['буду', 'jeg skal / vil']],
    grammar: {
      title: 'Framtid: буду + infinitiv',
      html: `<table class="gtable"><tr><th>Person</th><th>быть (framtid)</th><th>Eksempel</th></tr>
      <tr><td>я</td><td>буду</td><td>Я буду гулять.</td></tr>
      <tr><td>ты</td><td>будешь</td><td>Ты будешь читать?</td></tr>
      <tr><td>он / она</td><td>будет</td><td>Она будет работать.</td></tr>
      <tr><td>мы</td><td>будем</td><td>Мы будем отдыхать.</td></tr>
      <tr><td>вы</td><td>будете</td><td>Вы будете ужинать?</td></tr>
      <tr><td>они</td><td>будут</td><td>Они будут играть.</td></tr></table>
      <p><i>Perfektive</i> verb i presensform betyr framtid: я <b>поеду</b> (jeg skal reise), я <b>вернусь</b> (jeg kommer tilbake).</p>
      <p>Ukedager: <b>в</b> + akkusativ: в субботу, в пятницу, в понедельник, <b>во</b> вторник.</p>`
    },
    quiz: [
      ['Мы ___ отдыхать', 'будем', 'будут', 'буду', 'будешь'],
      ['«på fredag»', 'в пятницу', 'в пятница', 'на пятницу', 'пятницей'],
      ['Они ___ гулять', 'будут', 'будет', 'будем', 'буду']
    ],
    rp: {
      bot: 'Максим', intro: 'Maksim lurer på hva du skal i helga.',
      steps: [
        { b: 'Что ты будешь делать в выходные?', bn: 'Hva skal du gjøre i helga?', h: 'Fortell om planene dine (Я буду ... / Я поеду ...).', m: 'Я буду отдыхать.', any: ['буду', 'поеду', 'пойду'] },
        { b: 'Здорово! А в какой день?', bn: 'Flott! Hvilken dag?', h: 'Si hvilken dag (в субботу ...).', m: 'В субботу.', any: ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье'] },
        { b: 'Хорошо тебе отдохнуть!', bn: 'Ha en god tur!', h: 'Takk og si ha det.', m: 'Спасибо! Пока!', ok: ['спасибо пока', 'спасибо', 'спасибо до свидания', 'пока'] }
      ]
    }
  },
  {
    id: 18, icon: '🥟', ru: 'В гостях', no: 'På besøk', place: 'Листвянка',
    intro: 'Lars er invitert hjem til Natalja i en landsby ved Bajkal.',
    dialog: [
      ['Наталья', 'Ларс, проходите! Мы очень рады вас видеть.', 'Lars, kom inn! Vi er så glade for å se deg.'],
      ['Ларс', 'Спасибо за приглашение! Это вам – цветы.', 'Takk for invitasjonen! Disse er til deg – blomster.'],
      ['Наталья', 'Какие красивые! Садитесь, пожалуйста. Вот пельмени и борщ.', 'Så vakre! Sett deg. Her er pelmeni og borsjtsj.'],
      ['Ларс', 'Очень вкусно! Мне очень нравится борщ.', 'Veldig godt! Jeg liker borsjtsj veldig godt.'],
      ['Наталья', 'Хотите ещё?', 'Vil du ha mer?'],
      ['Ларс', 'Спасибо, я уже сыт. Всё было очень вкусно!', 'Takk, jeg er mett. Alt var veldig godt!']
    ],
    vocab: [['в гостях', 'på besøk'], ['приглашение', 'invitasjon'], ['цветы', 'blomster'], ['подарок', 'gave'],
      ['красивый', 'vakker, pen'], ['вкусно', 'godt (smak)'], ['нравится', 'liker (ordrett: behager)'],
      ['садитесь', 'sett deg / dere'], ['проходите', 'kom inn'], ['пельмени', 'pelmeni (russiske dumplings)'],
      ['борщ', 'borsjtsj (rødbetsuppe)'], ['сыт / сыта', 'mett (m / k)'], ['рад / рада', 'glad (m / k)']],
    grammar: {
      title: 'Dativ + нравится: «jeg liker»',
      html: `<p>Ordrett sier russisk «X behager meg»: <b>Мне нравится борщ.</b> Den som liker, står i <b>dativ</b>.</p>
      <table class="gtable"><tr><th>Nominativ</th><th>Dativ</th><th>Eksempel</th></tr>
      <tr><td>я</td><td>мне</td><td>Мне нравится чай.</td></tr>
      <tr><td>ты</td><td>тебе</td><td>Тебе нравится?</td></tr>
      <tr><td>он / она</td><td>ему / ей</td><td>Ей нравится Москва.</td></tr>
      <tr><td>мы / вы / они</td><td>нам / вам / им</td><td>Нам нравится борщ.</td></tr></table>
      <p>Flertall: Мне <b>нравятся</b> пельмени.</p>`
    },
    quiz: [
      ['___ нравится чай (henne)', 'ей', 'её', 'она', 'ею'],
      ['Мне нравятся ___', 'пельмени', 'борщ', 'чай', 'суп'],
      ['Нам ___ Москва', 'нравится', 'нравятся', 'нравлюсь', 'нравит']
    ],
    rp: {
      bot: 'Наталья', intro: 'Du banker på døra til Natalja med blomster i hånda.',
      steps: [
        { b: 'Проходите! Мы очень рады вас видеть.', bn: 'Kom inn! Vi er så glade for å se deg.', h: 'Takk for invitasjonen.', m: 'Спасибо за приглашение!', ok: ['спасибо за приглашение', 'спасибо'] },
        { b: 'Садитесь, пожалуйста! Вот борщ. Вам нравится?', bn: 'Sett deg! Her er borsjtsj. Liker du det?', h: 'Si at det er veldig godt / at du liker det.', m: 'Очень вкусно! Мне очень нравится.', ok: ['очень вкусно', 'мне очень нравится', 'мне нравится', 'да очень вкусно', 'да мне нравится', 'вкусно'] },
        { b: 'Хотите ещё?', bn: 'Vil du ha mer?', h: 'Si «nei takk, jeg er mett» (Спасибо, я сыт / сыта).', m: 'Спасибо, я сыт.', ok: ['спасибо я сыт', 'спасибо я сыта', 'нет спасибо', 'нет спасибо я сыт', 'нет спасибо я сыта', 'я сыт', 'я сыта', 'да пожалуйста'] }
      ]
    }
  },
  {
    id: 19, icon: '🧥', ru: 'Одежда', no: 'Kjøpe klær', place: 'Улан-Удэ',
    intro: 'Det er kaldt i Sibir – Lars trenger en varm jakke.',
    dialog: [
      ['Продавец', 'Добрый день! Вам помочь?', 'God dag! Kan jeg hjelpe deg?'],
      ['Ларс', 'Да, я ищу тёплую куртку.', 'Ja, jeg leter etter en varm jakke.'],
      ['Продавец', 'Какой у вас размер?', 'Hvilken størrelse har du?'],
      ['Ларс', 'Пятьдесят второй. Можно примерить эту синюю куртку?', 'Femtito. Kan jeg prøve denne blå jakken?'],
      ['Продавец', 'Конечно. Примерочная там.', 'Selvfølgelig. Prøverommet er der.'],
      ['Ларс', 'Отлично, я беру её!', 'Perfekt, jeg tar den!']
    ],
    vocab: [['одежда', 'klær'], ['куртка', 'jakke'], ['шапка', 'lue'], ['рубашка', 'skjorte'], ['брюки', 'bukser'],
      ['ботинки', 'støvletter, sko'], ['размер', 'størrelse'], ['искать', 'å lete etter'], ['примерить', 'å prøve (klær)'],
      ['можно', 'kan jeg / er det lov'], ['конечно', 'selvfølgelig'], ['синий', 'blå'], ['красный', 'rød'], ['тёплый', 'varm']],
    grammar: {
      title: 'Adjektiv bøyes etter kjønn',
      html: `<table class="gtable"><tr><th>Kjønn</th><th>новый (ny)</th><th>синий (blå)</th></tr>
      <tr><td>Hankjønn</td><td>нов<b>ый</b> шарф</td><td>син<b>ий</b> шарф</td></tr>
      <tr><td>Hunkjønn</td><td>нов<b>ая</b> куртка</td><td>син<b>яя</b> куртка</td></tr>
      <tr><td>Intetkjønn</td><td>нов<b>ое</b> пальто</td><td>син<b>ее</b> пальто</td></tr>
      <tr><td>Flertall</td><td>нов<b>ые</b> брюки</td><td>син<b>ие</b> брюки</td></tr></table>
      <p>Akkusativ hunkjønn: <b>-ую / -юю</b>: Я ищу тёпл<b>ую</b> куртку / син<b>юю</b> шапку.</p>`
    },
    quiz: [
      ['___ куртка (rød)', 'красная', 'красный', 'красное', 'красные'],
      ['Я ищу ___ шапку (varm)', 'тёплую', 'тёплая', 'тёплый', 'тёплой'],
      ['___ брюки (nye)', 'новые', 'новый', 'новая', 'новое']
    ],
    rp: {
      bot: 'Продавец', intro: 'Du går inn i en klesbutikk. Det er –25 °C ute.',
      steps: [
        { b: 'Добрый день! Вам помочь?', bn: 'God dag! Kan jeg hjelpe deg?', h: 'Si at du leter etter en varm jakke (eller lue).', m: 'Да, я ищу тёплую куртку.', any: ['ищу'] },
        { b: 'Какой у вас размер?', bn: 'Hvilken størrelse har du?', h: 'Si størrelsen din (et tall).', m: 'Пятьдесят второй.', any: NUM_WORDS.concat(['второй', 'четвёртый', 'шестой', 'восьмой', 'размер']), dig: true },
        { b: 'Вот, пожалуйста. Примерьте!', bn: 'Vær så god. Prøv den!', h: 'Si at du tar den.', m: 'Отлично, я беру её!', ok: ['я беру её', 'беру', 'я беру', 'отлично я беру её', 'хорошо я беру'] }
      ]
    }
  },
  {
    id: 20, icon: '🏆', ru: 'Путешествие', no: 'Reisen – finale', place: 'Озеро Байкал', boss: true,
    intro: 'Finalen! Lars har nådd Bajkal og ringer Olga. Her repeterer du alt.',
    dialog: [
      ['Ольга', 'Ларс, где ты сейчас?', 'Lars, hvor er du nå?'],
      ['Ларс', 'Я на Байкале! Я приехал сюда на поезде с другом.', 'Jeg er ved Bajkal! Jeg kom hit med tog sammen med en venn.'],
      ['Ольга', 'Ничего себе! Какое красивое озеро!', 'Wow! For en vakker innsjø!'],
      ['Ларс', 'Да, вода очень чистая. Я так рад, что говорю по-русски!', 'Ja, vannet er veldig rent. Jeg er så glad for at jeg snakker russisk!'],
      ['Ольга', 'Ты молодец! Ты говоришь очень хорошо.', 'Du er flink! Du snakker veldig bra.'],
      ['Ларс', 'Спасибо! Скоро я поеду домой, в Норвегию.', 'Takk! Snart reiser jeg hjem, til Norge.']
    ],
    vocab: [['путешествие', 'reise'], ['путешествовать', 'å reise'], ['озеро', 'innsjø'], ['река', 'elv'], ['гора', 'fjell'],
      ['друг', 'venn'], ['подруга', 'venninne'], ['с другом', 'med en venn'], ['на поезде', 'med tog'],
      ['на самолёте', 'med fly'], ['молодец', 'flink (ros)'], ['ничего себе!', 'wow! / jøss!'], ['скоро', 'snart'], ['домой', 'hjem (retning)']],
    grammar: {
      title: 'Instrumental med с + oversikt over kasus',
      html: `<p><b>с</b> (med, sammen med) + <b>instrumental</b>: с друг<b>ом</b>, с сестр<b>ой</b>, с мам<b>ой</b>, кофе с молок<b>ом</b>.</p>
      <p>Transport: <b>на</b> + preposisjonal: на поезде, на самолёте, на машине, на автобусе.</p>
      <table class="gtable"><tr><th>Kasus</th><th>Brukes til</th><th>Eksempel fra kurset</th></tr>
      <tr><td>Nominativ</td><td>subjekt</td><td>Это моя сестра.</td></tr>
      <tr><td>Genitiv</td><td>из, до, нет</td><td>из Норвегии, нет воды</td></tr>
      <tr><td>Dativ</td><td>alder, нравится</td><td>Мне нравится борщ.</td></tr>
      <tr><td>Akkusativ</td><td>objekt, в + dag</td><td>Я хочу воду. в субботу</td></tr>
      <tr><td>Instrumental</td><td>с (med), tid</td><td>с другом, летом</td></tr>
      <tr><td>Preposisjonal</td><td>в / на (hvor)</td><td>в Москве, на поезде</td></tr></table>`
    },
    quiz: [
      ['Я гуляю с ___ (søster)', 'сестрой', 'сестра', 'сестру', 'сестры'],
      ['Мы едем на ___ (tog)', 'поезде', 'поезд', 'поезда', 'поездом'],
      ['Кофе с ___', 'молоком', 'молоко', 'молока', 'молоке'],
      ['«Du er flink!»', 'Ты молодец!', 'Ты молодеца!', 'Ты есть молодец есть!', 'Молодец тебе!'],
      ['Мне двадцать два ___', 'года', 'год', 'лет', 'годов'],
      ['Вчера она ___ в кино', 'была', 'был', 'будет есть', 'были']
    ],
    rp: {
      bot: 'Ольга', intro: 'Videosamtale med Olga fra bredden av Bajkal.',
      steps: [
        { b: 'Ларс, где ты сейчас?', bn: 'Hvor er du nå?', h: 'Si at du er ved Bajkal.', m: 'Я на Байкале!', ok: ['я на байкале', 'на байкале'] },
        { b: 'Как ты приехал?', bn: 'Hvordan kom du dit?', h: 'Si at du kom med tog (на поезде).', m: 'Я приехал на поезде.', any: ['на поезде', 'на самолёте', 'на машине', 'на автобусе'] },
        { b: 'С кем ты путешествуешь?', bn: 'Hvem reiser du med?', h: 'Si at du reiser med en venn (с другом / с подругой).', m: 'Я путешествую с другом.', any: ['с другом', 'с подругой', 'с сестрой', 'с братом', 'с мамой', 'с папой', 'с женой', 'с мужем', 'один', 'одна'] },
        { b: 'Ты молодец! Ты говоришь по-русски очень хорошо!', bn: 'Du er flink! Du snakker russisk veldig bra!', h: 'Takk for komplimentet.', m: 'Большое спасибо!', ok: ['спасибо', 'большое спасибо', 'спасибо большое'] }
      ]
    }
  }
];

RP.ALPHABET = [
  ['А а', 'a', 'som i «katt»', 'мама'], ['Б б', 'b', 'som norsk b', 'банк'], ['В в', 'v', '⚠️ ser ut som B, men er v', 'вода'],
  ['Г г', 'g', 'som i «gå»', 'газета'], ['Д д', 'd', 'som norsk d', 'дом'], ['Е е', 'je', 'som i «jeg»', 'есть'],
  ['Ё ё', 'jo', 'som i «jo»', 'ёлка'], ['Ж ж', 'zj', 'som engelsk «vision»', 'журнал'], ['З з', 'z', 'stemt s (summende)', 'зима'],
  ['И и', 'i', 'som i «is»', 'игра'], ['Й й', 'j', 'kort j', 'чай'], ['К к', 'k', 'som norsk k', 'кофе'],
  ['Л л', 'l', 'mørk l', 'лампа'], ['М м', 'm', 'som norsk m', 'метро'], ['Н н', 'n', '⚠️ ser ut som H, men er n', 'нет'],
  ['О о', 'o', 'o når trykksterk, ellers nesten «a»', 'окно'], ['П п', 'p', 'som norsk p', 'папа'], ['Р р', 'r', '⚠️ ser ut som P, men er rullende r', 'рыба'],
  ['С с', 's', '⚠️ ser ut som C, men er s', 'суп'], ['Т т', 't', 'som norsk t', 'такси'], ['У у', 'u', '⚠️ som norsk «o» i «bok»', 'утро'],
  ['Ф ф', 'f', 'som norsk f', 'фото'], ['Х х', 'kh', '⚠️ som tysk «ach»', 'хлеб'], ['Ц ц', 'ts', 'som i «katts»', 'центр'],
  ['Ч ч', 'tsj', 'som «tsj»', 'час'], ['Ш ш', 'sj', 'hard sj', 'школа'], ['Щ щ', 'sjsj', 'lang, myk sj', 'борщ'],
  ['Ъ ъ', '–', 'hardt tegn (stumt skilletegn)', 'объект'], ['Ы ы', 'y', 'mellom i og u – ingen norsk lyd', 'мы'],
  ['Ь ь', "'", 'mykt tegn – gjør konsonanten foran myk', 'день'], ['Э э', 'e', 'som i «elg»', 'это'],
  ['Ю ю', 'ju', 'som i «ju»', 'юг'], ['Я я', 'ja', 'som i «ja»', 'я']
];
