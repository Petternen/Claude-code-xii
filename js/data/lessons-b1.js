window.RP = window.RP || {};
/* Kursinnhold: 12 leksjoner russisk for norsktalende (B1), id 21–32.
   Lastes etter lessons.js og bruker samme format. Russisk tekst i dialog, ordliste,
   rollespill-replikker (b / m) og titler har trykktegn (aksent over trykkstavelsen). */
RP.REGIONS.push(
  { id: 'kavkaz', ru: 'Кавказ', no: 'Kaukasus', from: 21, to: 24, color: 'var(--green)' },
  { id: 'kamchatka', ru: 'Камчатка', no: 'Kamtsjatka', from: 25, to: 28, color: 'var(--red-dark)' },
  { id: 'arktika', ru: 'Мурманск и Арктика', no: 'Murmansk og Arktis', from: 29, to: 32, color: 'var(--blue)' }
);

Object.assign(RP.GENDER, {
  'Руслан': 'm', 'Тамара': 'f', 'Марина': 'f', 'Алексей': 'm', 'Сергей': 'm',
  'Николай': 'm', 'Светлана': 'f', 'Пограничник': 'm'
});

RP.LESSONS.push(
  {
    id: 21, icon: '🏖️', ru: 'Ты уже́ купи́л?', no: 'Ferdig eller ikke? (aspekt)', place: 'Сочи',
    intro: 'Lars har kommet til Sotsji og skal på fjelltur med guiden Ruslan. Ruslan sjekker at alt er klart.',
    dialog: [
      ['Руслан', 'Ларс, ты уже́ купи́л биле́т на авто́бус?', 'Lars, har du allerede kjøpt bussbillett?'],
      ['Ларс', 'Да, купи́л вчера́. Я покупа́л биле́т це́лый час!', 'Ja, jeg kjøpte den i går. Jeg holdt på med å kjøpe billett i en hel time!'],
      ['Руслан', 'А ты прочита́л пра́вила для тури́стов?', 'Og har du lest reglene for turister?'],
      ['Ларс', 'Я чита́л их у́тром, но ещё не прочита́л до конца́.', 'Jeg leste i dem i morges, men har ikke lest dem ferdig ennå.'],
      ['Руслан', 'Ничего́. Прочита́й сего́дня ве́чером. А ма́ме ты написа́л?', 'Det går fint. Les dem ferdig i kveld. Og har du skrevet til mamma?'],
      ['Ларс', 'Да, я уже́ написа́л ей письмо́ и посла́л фо́то мо́ря.', 'Ja, jeg har allerede skrevet et brev til henne og sendt et bilde av havet.'],
      ['Руслан', 'Молоде́ц! За́втра в семь часо́в мы пое́дем в го́ры.', 'Flott! I morgen klokka sju drar vi til fjellet.']
    ],
    vocab: [['покупа́ть / купи́ть', 'å kjøpe (ipf. / pf.)'], ['писа́ть / написа́ть', 'å skrive (ferdig)'],
      ['чита́ть / прочита́ть', 'å lese (ferdig)'], ['де́лать / сде́лать', 'å gjøre (ferdig)'],
      ['посыла́ть / посла́ть', 'å sende'], ['уже́', 'allerede'], ['ещё не', 'ikke ennå'], ['пра́вило', 'regel'],
      ['письмо́', 'brev'], ['мо́ре', 'hav'], ['пляж', 'strand'], ['до конца́', 'til slutten, ferdig'],
      ['це́лый час', 'en hel time'], ['наконе́ц', 'endelig']],
    grammar: {
      title: 'Verbaspekt: imperfektiv og perfektiv',
      html: `<p>Nesten alle russiske verb kommer i <b>par</b>. Det <b>imperfektive</b> verbet beskriver en prosess, noe som gjentas, eller handlingen i seg selv. Det <b>perfektive</b> beskriver ett avsluttet resultat.</p>
      <table class="gtable"><tr><th>Imperfektiv (prosess)</th><th>Perfektiv (resultat)</th><th>Norsk</th></tr>
      <tr><td>читать</td><td>прочитать</td><td>lese / lese ferdig</td></tr>
      <tr><td>писать</td><td>написать</td><td>skrive / skrive ferdig</td></tr>
      <tr><td>делать</td><td>сделать</td><td>gjøre / få gjort</td></tr>
      <tr><td>покупать</td><td>купить</td><td>kjøpe</td></tr>
      <tr><td>смотреть</td><td>посмотреть</td><td>se (på)</td></tr></table>
      <p><b>Я читал книгу два часа.</b> = Jeg leste i boka i to timer (prosess). <b>Я прочитал книгу.</b> = Jeg leste ut boka (resultat).</p>
      <p>Perfektive verb har ingen presens: <b>я прочитаю</b> betyr «jeg skal lese ferdig» (framtid).</p>
      <p class="tip">💡 Ord som <b>часто, каждый день, долго</b> krever imperfektiv. <b>Уже</b> og <b>наконец</b> går ofte med perfektiv.</p>`
    },
    quiz: [
      ['«Jeg har lest ut boka»', 'Я прочитал книгу.', 'Я читал книгу.', 'Я читаю книгу.', 'Я буду читать книгу.'],
      ['Вчера я ___ письмо два часа (holdt på å skrive)', 'писал', 'написал', 'напишу', 'пишу'],
      ['Hvilket verb er perfektivt?', 'купить', 'покупать', 'читать', 'делать'],
      ['Завтра я ___ билет (skal kjøpe – én gang)', 'куплю', 'покупал', 'купил', 'покупаю']
    ],
    rp: {
      bot: 'Руслан', intro: 'Ruslan ringer deg kvelden før fjellturen.',
      steps: [
        { b: 'Ты уже́ купи́л биле́т?', bn: 'Har du allerede kjøpt billett?', h: 'Si ja, du har allerede kjøpt den (купил / купила).', m: 'Да, уже́ купи́л.', ok: ['да уже купил', 'да уже купила', 'да купил', 'да купила', 'уже купил', 'уже купила', 'купил', 'купила'] },
        { b: 'А ты прочита́л пра́вила?', bn: 'Og har du lest reglene?', h: 'Si at du har lest dem ferdig (прочитал / прочитала).', m: 'Да, я прочита́л пра́вила.', ok: ['да я прочитал правила', 'да я прочитала правила', 'да прочитал', 'да прочитала', 'я прочитал', 'я прочитала', 'прочитал', 'прочитала'] },
        { b: 'Что ты де́лал сего́дня?', bn: 'Hva gjorde du i dag?', h: 'Fortell hva du holdt på med (imperfektiv fortid: гулял, читал, отдыхал ...).', m: 'Я гуля́л по пля́жу и чита́л.', any: ['гулял', 'гуляла', 'читал', 'читала', 'отдыхал', 'отдыхала', 'плавал', 'плавала', 'писал', 'писала', 'смотрел', 'смотрела', 'купался', 'купалась', 'работал', 'работала', 'делал', 'делала', 'спал', 'спала'] },
        { b: 'Отли́чно! За́втра в семь. Не опа́здывай!', bn: 'Supert! I morgen klokka sju. Ikke kom for sent!', h: 'Si «greit, vi ses i morgen!»', m: 'Хорошо́, до за́втра!', ok: ['хорошо до завтра', 'до завтра', 'хорошо', 'ладно до завтра', 'ладно', 'договорились', 'хорошо спасибо', 'пока до завтра'] }
      ]
    }
  },
  {
    id: 22, icon: '🚡', ru: 'Куда́ ты идёшь?', no: 'Gå og kjøre (bevegelsesverb)', place: 'Красная Поляна',
    intro: 'Lars og Ruslan er i skisentret Krasnaja Poljana over Sotsji. De skal ta taubanen opp i fjellet.',
    dialog: [
      ['Ларс', 'Русла́н, куда́ мы сейча́с идём?', 'Ruslan, hvor går vi nå?'],
      ['Руслан', 'Мы идём к кана́тной доро́ге. Пото́м мы е́дем наве́рх.', 'Vi går til taubanen. Så kjører vi opp.'],
      ['Ларс', 'Ты ча́сто хо́дишь в го́ры?', 'Går du ofte i fjellet?'],
      ['Руслан', 'Да, ле́том я хожу́ в го́ры ка́ждый день. А зимо́й сюда́ е́здят лы́жники со всей Росси́и.', 'Ja, om sommeren går jeg i fjellet hver dag. Og om vinteren kommer skiløpere hit fra hele Russland.'],
      ['Ларс', 'В Норве́гии мы то́же ча́сто е́здим в го́ры на маши́не.', 'I Norge kjører vi også ofte til fjells med bil.'],
      ['Руслан', 'Смотри́, вот кана́тная доро́га! Ну, е́дем!', 'Se, der er taubanen! Nå, da kjører vi!']
    ],
    vocab: [['идти́', 'å gå (én retning, nå)'], ['ходи́ть', 'å gå (fram og tilbake, vane)'],
      ['е́хать', 'å kjøre, reise (én retning, nå)'], ['е́здить', 'å kjøre, reise (vane)'],
      ['кана́тная доро́га', 'taubane'], ['наве́рх', 'opp (retning)'], ['вниз', 'ned (retning)'], ['лы́жи', 'ski'],
      ['ката́ться на лы́жах', 'å gå / stå på ski'], ['лы́жник', 'skiløper'], ['маши́на', 'bil'], ['пешко́м', 'til fots'],
      ['обы́чно', 'vanligvis'], ['ка́ждое ле́то', 'hver sommer']],
    grammar: {
      title: 'Bevegelsesverb: идти / ходить, ехать / ездить',
      html: `<p>Russisk skiller mellom å bevege seg <b>til fots</b> (идти / ходить) og <b>med kjøretøy</b> (ехать / ездить). I tillegg har hvert par ett verb for <b>én retning nå</b> og ett for <b>vane / fram og tilbake</b>.</p>
      <table class="gtable"><tr><th></th><th>Én retning, nå</th><th>Vane, ofte, tur-retur</th></tr>
      <tr><td>Til fots</td><td>идти: иду, идёшь, идут</td><td>ходить: хожу, ходишь, ходят</td></tr>
      <tr><td>Med kjøretøy</td><td>ехать: еду, едешь, едут</td><td>ездить: езжу, ездишь, ездят</td></tr></table>
      <p><b>Сейчас я иду в музей.</b> = Jeg er på vei til museet nå. <b>Я часто хожу в музей.</b> = Jeg går ofte på museum.</p>
      <p><b>Мы едем в горы.</b> = Vi kjører til fjells (nå). <b>Каждое лето мы ездим в горы.</b> = Hver sommer reiser vi til fjells.</p>
      <p class="tip">💡 Retning (hvor hen?) tar akkusativ: в горы, в Москву, на работу. Til en person: <b>к</b> + dativ: к другу.</p>`
    },
    quiz: [
      ['Сейчас я ___ в магазин (går, akkurat nå)', 'иду', 'хожу', 'еду', 'езжу'],
      ['Каждое лето мы ___ в горы на машине', 'ездим', 'едем', 'ходим', 'идём'],
      ['«Han går ofte på kino»', 'Он часто ходит в кино.', 'Он часто идёт в кино.', 'Он часто едет в кино.', 'Он часто ходить в кино.'],
      ['Куда ты ___ на автобусе? (nå)', 'едешь', 'ездишь', 'идёшь', 'ходишь']
    ],
    rp: {
      bot: 'Руслан', intro: 'Du møter Ruslan i landsbyen Krasnaja Poljana.',
      steps: [
        { b: 'Приве́т! Куда́ ты идёшь?', bn: 'Hei! Hvor går du?', h: 'Si at du går til fjellet (Я иду в горы).', m: 'Я иду́ в го́ры.', ok: ['я иду в горы', 'иду в горы', 'в горы', 'я иду к канатной дороге', 'я иду гулять', 'я иду домой'], any: ['иду'] },
        { b: 'Ты е́дешь наве́рх на кана́тной доро́ге?', bn: 'Skal du kjøre opp med taubanen?', h: 'Si ja – eller at du går til fots (пешком).', m: 'Да, я е́ду на кана́тной доро́ге.', ok: ['да я еду на канатной дороге', 'да еду', 'да', 'нет я иду пешком', 'нет пешком', 'да на канатной дороге'], any: ['еду', 'пешком'] },
        { b: 'А в Норве́гии ты ча́сто хо́дишь в го́ры?', bn: 'Og går du ofte i fjellet i Norge?', h: 'Si at du ofte går i fjellet (Да, я часто хожу в горы).', m: 'Да, я ча́сто хожу́ в го́ры.', ok: ['да я часто хожу в горы', 'да часто', 'часто хожу', 'да хожу', 'иногда', 'нет редко', 'редко'], any: ['хожу', 'езжу', 'ходим', 'ездим'] },
        { b: 'Здо́рово! Ну, пое́хали!', bn: 'Kult! Nå, da kjører vi!', h: 'Si «ja, kom igjen!» (Давай! / Поехали!)', m: 'Пое́хали!', ok: ['поехали', 'давай', 'да поехали', 'давай поехали', 'пошли', 'хорошо', 'да давай'] }
      ]
    }
  },
  {
    id: 23, icon: '🏔️', ru: 'Восхожде́ние', no: 'Mot toppen av Elbrus', place: 'Терскол, Приэльбрусье',
    intro: 'Lars og Ruslan er i fjell-leiren under Elbrus, Europas høyeste fjell. Ruslan forklarer planen for i morgen.',
    dialog: [
      ['Руслан', 'За́втра в четы́ре утра́ мы вы́йдем из ла́геря.', 'I morgen klokka fire om morgenen går vi ut fra leiren.'],
      ['Ларс', 'Так ра́но! А когда́ мы придём на верши́ну?', 'Så tidlig! Og når kommer vi fram til toppen?'],
      ['Руслан', 'Ду́маю, в оди́ннадцать. Снача́ла мы перейдём ледни́к.', 'Jeg tror klokka elleve. Først går vi over breen.'],
      ['Ларс', 'А мо́жно зайти́ в кафе́ на ста́нции «Мир»?', 'Kan vi stikke innom kafeen på stasjonen «Mir»?'],
      ['Руслан', 'Мо́жно, но недо́лго. Мы должны́ уйти́ отту́да в шесть.', 'Ja, men ikke lenge. Vi må dra derfra klokka seks.'],
      ['Ларс', 'Поня́тно. А когда́ мы вернёмся в ла́герь?', 'Skjønner. Og når kommer vi tilbake til leiren?'],
      ['Руслан', 'Ве́чером. Когда́ мы придём, мы войдём в до́мик и бу́дем пить чай!', 'Om kvelden. Når vi kommer fram, går vi inn i hytta og drikker te!']
    ],
    vocab: [['прийти́', 'å komme (fram, til fots)'], ['уйти́', 'å gå (sin vei)'], ['войти́', 'å gå inn'],
      ['вы́йти', 'å gå ut'], ['зайти́', 'å stikke innom'], ['перейти́', 'å gå over, krysse'],
      ['прие́хать', 'å komme (fram, med kjøretøy)'], ['верши́на', 'topp (av et fjell)'], ['ледни́к', 'isbre'],
      ['ла́герь', 'leir'], ['до́мик', 'liten hytte'], ['ра́но', 'tidlig'], ['по́здно', 'sent'], ['должны́', 'må (flertall)']],
    grammar: {
      title: 'Bevegelsesverb med prefiks',
      html: `<p>Et <b>prefiks</b> gir retningen. Med prefiks blir verbene <b>perfektive</b>, og идти blir til <b>-йти</b>.</p>
      <table class="gtable"><tr><th>Prefiks</th><th>Betydning</th><th>Til fots</th><th>Med kjøretøy</th></tr>
      <tr><td>при-</td><td>komme fram</td><td>прийти</td><td>приехать</td></tr>
      <tr><td>у-</td><td>dra bort</td><td>уйти</td><td>уехать</td></tr>
      <tr><td>в-</td><td>inn</td><td>войти</td><td>въехать</td></tr>
      <tr><td>вы-</td><td>ut</td><td>выйти</td><td>выехать</td></tr>
      <tr><td>за-</td><td>stikke innom</td><td>зайти</td><td>заехать</td></tr>
      <tr><td>пере-</td><td>over, krysse</td><td>перейти</td><td>переехать</td></tr></table>
      <p>Framtid: я при<b>ду</b>, ты при<b>дёшь</b>, мы при<b>дём</b>. Fortid: он при<b>шёл</b>, она при<b>шла</b>, они при<b>шли</b>.</p>
      <p>Imperfektive par (vane, prosess): приходить, уходить, входить, выходить, заходить, переходить.</p>
      <p class="tip">💡 <b>вы-</b> har alltid trykket på seg selv: <b>вы</b>йти, <b>вы</b>шел.</p>`
    },
    quiz: [
      ['«å gå inn»', 'войти', 'выйти', 'уйти', 'прийти'],
      ['Мы ___ через улицу (krysser)', 'переходим', 'приходим', 'заходим', 'выходим'],
      ['Когда ты ___ домой? (kommer fram, til fots)', 'придёшь', 'уйдёшь', 'выйдешь', 'перейдёшь'],
      ['«Han dro (gikk sin vei) klokka fem»', 'Он ушёл в пять часов.', 'Он пришёл в пять часов.', 'Он вошёл в пять часов.', 'Он зашёл в пять часов.']
    ],
    rp: {
      bot: 'Руслан', intro: 'Det er kveld i leiren under Elbrus. Ruslan går gjennom planen.',
      steps: [
        { b: 'Мы вы́йдем в четы́ре утра́. Ты гото́в?', bn: 'Vi går ut klokka fire om morgenen. Er du klar?', h: 'Si ja, du er klar (Да, я готов / готова).', m: 'Да, я гото́в!', ok: ['да я готов', 'да я готова', 'готов', 'готова', 'да готов', 'да готова', 'конечно готов', 'конечно готова'] },
        { b: 'Мо́жно зайти́ в кафе́ по доро́ге. Хо́чешь?', bn: 'Vi kan stikke innom en kafé på veien. Vil du?', h: 'Si ja, la oss stikke innom (Давай зайдём).', m: 'Да, дава́й зайдём!', ok: ['да давай зайдём', 'давай зайдём', 'да зайдём', 'да хочу', 'хочу', 'да давай', 'давай', 'нет спасибо'] },
        { b: 'Слу́шай, а когда́ ты прие́хал в Терско́л?', bn: 'Hør, når kom du til Terskol?', h: 'Si at du kom i går (Я приехал / приехала вчера).', m: 'Я прие́хал вчера́.', ok: ['я приехал вчера', 'я приехала вчера', 'приехал вчера', 'приехала вчера', 'вчера'], any: ['приехал', 'приехала', 'пришёл', 'пришла'] },
        { b: 'Хорошо́. Тепе́рь иди́ спать!', bn: 'Greit. Gå og legg deg nå!', h: 'Si god natt (Спокойной ночи!).', m: 'Споко́йной но́чи!', ok: ['спокойной ночи', 'спокойной ночи до завтра', 'хорошо спокойной ночи', 'доброй ночи', 'до завтра', 'хорошо'] }
      ]
    }
  },
  {
    id: 24, icon: '🥘', ru: 'Засто́лье', no: 'Ved festbordet (-ся-verb)', place: 'Нальчик',
    intro: 'Etter fjellturen blir Lars invitert til Tamara. I Kaukasus er gjestfriheten legendarisk – og bordet er alltid fullt.',
    dialog: [
      ['Тамара', 'Ларс, проходи́те! Как вам нра́вится Кавка́з?', 'Lars, kom inn! Hvordan liker du Kaukasus?'],
      ['Ларс', 'О́чень нра́вится! Мне нра́вятся го́ры и лю́ди.', 'Veldig godt! Jeg liker fjellene og folket.'],
      ['Тамара', 'А чем вы занима́етесь в Норве́гии?', 'Og hva driver du med i Norge?'],
      ['Ларс', 'Я учу́сь в университе́те и занима́юсь спо́ртом.', 'Jeg studerer på universitetet og driver med idrett.'],
      ['Тамара', 'Молоде́ц! А где вы научи́лись говори́ть по-ру́сски?', 'Flott! Og hvor lærte du å snakke russisk?'],
      ['Ларс', 'Я занима́юсь ка́ждый день. Мне о́чень нра́вится ру́сский язы́к!', 'Jeg øver hver dag. Jeg liker russisk veldig godt!'],
      ['Тамара', 'Тогда́ угоща́йтесь! Пра́здник начина́ется!', 'Forsyn deg da! Festen begynner!']
    ],
    vocab: [['занима́ться', 'å drive med, trene, øve'], ['учи́ться', 'å studere, gå på skole'],
      ['нра́виться', 'å like (ordrett: å behage)'], ['начина́ться', 'å begynne'], ['конча́ться', 'å ta slutt'],
      ['улыба́ться', 'å smile'], ['познако́миться', 'å bli kjent med'], ['угоща́йтесь!', 'forsyn dere!'],
      ['пра́здник', 'fest, høytid'], ['гостеприи́мство', 'gjestfrihet'], ['тост', 'skåltale'], ['хозя́йка', 'vertinne'],
      ['университе́т', 'universitet'], ['спорт', 'idrett, sport']],
    grammar: {
      title: 'Refleksive verb på -ся',
      html: `<p>Mange verb har endelsen <b>-ся</b> (etter konsonant) eller <b>-сь</b> (etter vokal). Ofte svarer det til norsk «seg», men ikke alltid.</p>
      <table class="gtable"><tr><th>Person</th><th>заниматься</th><th>учиться</th></tr>
      <tr><td>я</td><td>занимаю<b>сь</b></td><td>учу<b>сь</b></td></tr>
      <tr><td>ты</td><td>занимаешь<b>ся</b></td><td>учишь<b>ся</b></td></tr>
      <tr><td>он / она</td><td>занимает<b>ся</b></td><td>учит<b>ся</b></td></tr>
      <tr><td>мы</td><td>занимаем<b>ся</b></td><td>учим<b>ся</b></td></tr>
      <tr><td>вы</td><td>занимаете<b>сь</b></td><td>учите<b>сь</b></td></tr>
      <tr><td>они</td><td>занимают<b>ся</b></td><td>учат<b>ся</b></td></tr></table>
      <p><b>заниматься</b> + instrumental: заниматься спорт<b>ом</b>, музык<b>ой</b>. <b>учиться</b> = gå på skole / studere: Я учусь в университете. (Men <b>учить</b> слова = pugge gloser.)</p>
      <p class="tip">💡 Fortid: он занимал<b>ся</b>, она занималась, они занимались. Праздник начинает<b>ся</b> = festen begynner (av seg selv).</p>`
    },
    quiz: [
      ['Я ___ спортом', 'занимаюсь', 'занимается', 'занимаюся', 'занимаю'],
      ['Вы ___ в университете?', 'учитесь', 'учитесься', 'учишься', 'учатся'],
      ['Праздник ___ в семь часов', 'начинается', 'начинаются', 'начинает', 'начинаешься'],
      ['Мне ___ горы', 'нравятся', 'нравится', 'нравлюсь', 'нравиться']
    ],
    rp: {
      bot: 'Тамара', intro: 'Tamara har dekket et stort festbord for deg.',
      steps: [
        { b: 'Здра́вствуйте! Как вам нра́вится Кавка́з?', bn: 'Goddag! Hvordan liker du Kaukasus?', h: 'Si at du liker det veldig godt.', m: 'О́чень нра́вится!', ok: ['очень нравится', 'мне очень нравится', 'нравится', 'мне нравится', 'мне очень нравится кавказ', 'очень', 'очень красиво'] },
        { b: 'А чем вы занима́етесь?', bn: 'Og hva driver du med?', h: 'Si hva du driver med (Я учусь ... / Я работаю ... / Я занимаюсь ...).', m: 'Я учу́сь в университе́те.', any: ['занимаюсь', 'учусь', 'работаю'] },
        { b: 'Вы занима́етесь спо́ртом?', bn: 'Driver du med idrett?', h: 'Svar ja eller nei (Да, я занимаюсь спортом).', m: 'Да, я занима́юсь спо́ртом.', ok: ['да я занимаюсь спортом', 'да занимаюсь', 'нет не занимаюсь', 'да', 'нет', 'иногда'], any: ['занимаюсь'] },
        { b: 'Угоща́йтесь! Вот хачапу́ри.', bn: 'Forsyn deg! Her er khatsjapuri.', h: 'Takk og si at det er veldig godt.', m: 'Спаси́бо! О́чень вку́сно!', ok: ['спасибо очень вкусно', 'очень вкусно', 'спасибо', 'вкусно', 'спасибо большое', 'большое спасибо'] }
      ]
    }
  },
  {
    id: 25, icon: '🌋', ru: 'Вулка́ны', no: 'Vulkaner (sammenligning)', place: 'Авачинский вулкан',
    intro: 'Lars har flydd til Kamtsjatka, landet med over 300 vulkaner. Guiden Marina tar ham med opp en vulkanskråning.',
    dialog: [
      ['Ларс', 'Како́й краси́вый вулка́н! Он вы́ше, чем Эльбру́с?', 'For en vakker vulkan! Er den høyere enn Elbrus?'],
      ['Марина', 'Нет, Эльбру́с вы́ше. Но э́тот вулка́н моло́же и акти́внее.', 'Nei, Elbrus er høyere. Men denne vulkanen er yngre og mer aktiv.'],
      ['Ларс', 'А како́й вулка́н са́мый высо́кий на Камча́тке?', 'Og hvilken vulkan er den høyeste på Kamtsjatka?'],
      ['Марина', 'Он на се́вере, далеко́ отсю́да. Туда́ лу́чше лете́ть на вертолёте.', 'Den ligger i nord, langt herfra. Dit er det best å fly med helikopter.'],
      ['Ларс', 'Здесь гора́здо холодне́е, чем в го́роде!', 'Her er det mye kaldere enn i byen!'],
      ['Марина', 'Коне́чно! Но вид отсю́да са́мый лу́чший на Камча́тке.', 'Selvfølgelig! Men utsikten herfra er den beste på Kamtsjatka.']
    ],
    vocab: [['вулка́н', 'vulkan'], ['вы́ше', 'høyere'], ['ни́же', 'lavere'], ['лу́чше', 'bedre'], ['ху́же', 'verre'],
      ['бо́льше', 'større, mer'], ['ме́ньше', 'mindre'], ['са́мый', 'den mest ...'], ['высо́кий', 'høy'],
      ['гора́здо', 'mye (+ komparativ)'], ['чем', 'enn'], ['вид', 'utsikt'], ['вертолёт', 'helikopter'], ['се́вер', 'nord']],
    grammar: {
      title: 'Komparativ og superlativ',
      html: `<p><b>Komparativ</b> (høyere, kaldere): de fleste adjektiv får <b>-ее</b>. Formen bøyes ikke.</p>
      <table class="gtable"><tr><th>Adjektiv</th><th>Komparativ</th><th>Norsk</th></tr>
      <tr><td>холодный</td><td>холодн<b>ее</b></td><td>kaldere</td></tr>
      <tr><td>интересный</td><td>интересн<b>ее</b></td><td>mer interessant</td></tr>
      <tr><td>высокий</td><td><b>выше</b></td><td>høyere</td></tr>
      <tr><td>хороший / плохой</td><td><b>лучше / хуже</b></td><td>bedre / verre</td></tr>
      <tr><td>большой / маленький</td><td><b>больше / меньше</b></td><td>større / mindre</td></tr>
      <tr><td>молодой</td><td><b>моложе</b></td><td>yngre</td></tr></table>
      <p>«enn»: <b>выше, чем Эльбрус</b> – eller kortere med genitiv: <b>выше Эльбруса</b>.</p>
      <p><b>Superlativ</b>: <b>самый</b> + adjektiv, og begge bøyes: самый высокий вулкан, самая красивая гора, самое холодное озеро.</p>
      <p class="tip">💡 <b>гораздо</b> = mye: гораздо холоднее (mye kaldere).</p>`
    },
    quiz: [
      ['«høyere enn Elbrus»', 'выше, чем Эльбрус', 'высокее, чем Эльбрус', 'больше высокий Эльбрус', 'самый высокий Эльбрус'],
      ['Сегодня ___, чем вчера (kaldere)', 'холоднее', 'холодный', 'самый холодный', 'холодно'],
      ['Это ___ красивая гора', 'самая', 'самый', 'самое', 'самые'],
      ['Komparativ av «хороший»', 'лучше', 'хорошее', 'хужее', 'больше']
    ],
    rp: {
      bot: 'Марина', intro: 'Du står på en vulkanskråning sammen med Marina.',
      steps: [
        { b: 'Как тебе́ вид? Краси́во?', bn: 'Hva synes du om utsikten? Vakkert?', h: 'Si at det er veldig vakkert – den beste utsikten!', m: 'О́чень краси́во! Э́то са́мый лу́чший вид.', ok: ['очень красиво', 'красиво', 'очень', 'это самый лучший вид', 'самый лучший вид', 'да очень красиво'], any: ['красиво', 'лучший', 'самый'] },
        { b: 'В Норве́гии го́ры вы́ше и́ли ни́же?', bn: 'Er fjellene i Norge høyere eller lavere?', h: 'Svar med komparativ (выше / ниже).', m: 'В Норве́гии го́ры ни́же.', any: ['ниже', 'выше', 'меньше', 'больше'] },
        { b: 'А где холодне́е – в Норве́гии и́ли на Камча́тке?', bn: 'Og hvor er det kaldere – i Norge eller på Kamtsjatka?', h: 'Si hvor det er kaldere (Холоднее в ... / на ...).', m: 'Холодне́е на Камча́тке.', ok: ['на камчатке', 'в норвегии', 'холоднее на камчатке', 'холоднее в норвегии'], any: ['холоднее', 'теплее'] },
        { b: 'Како́й вулка́н ты хо́чешь уви́деть за́втра?', bn: 'Hvilken vulkan vil du se i morgen?', h: 'Si at du vil se den høyeste vulkanen (самый высокий).', m: 'Я хочу́ уви́деть са́мый высо́кий вулка́н.', any: ['самый высокий', 'самый большой', 'самый активный', 'самый красивый', 'самый интересный'] }
      ]
    }
  },
  {
    id: 26, icon: '♨️', ru: 'Доли́на ге́йзеров', no: 'Geysirdalen (betinget form)', place: 'Долина гейзеров',
    intro: 'Lars flyr med helikopter til Geysirdalen. Ranger Aleksej passer på at turistene holder seg på stien.',
    dialog: [
      ['Алексей', 'Ларс, е́сли бы пого́да была́ плохо́й, мы бы не прилете́ли сюда́.', 'Lars, hvis været hadde vært dårlig, hadde vi ikke flydd hit.'],
      ['Ларс', 'Нам повезло́! Я бы хоте́л посмотре́ть на большо́й ге́йзер.', 'Vi var heldige! Jeg skulle gjerne sett den store geysiren.'],
      ['Алексей', 'Пойдём. Но, пожа́луйста, не уходи́те с тропы́.', 'Kom igjen. Men vær så snill, ikke gå av stien.'],
      ['Ларс', 'Почему́? Я бы сде́лал фо́то побли́же.', 'Hvorfor? Jeg skulle gjerne tatt et bilde litt nærmere.'],
      ['Алексей', 'Е́сли бы вы сошли́ с тропы́, вы могли́ бы упа́сть в горя́чую во́ду.', 'Hvis du gikk av stien, kunne du falle i det varme vannet.'],
      ['Ларс', 'Поня́тно. Тогда́ я лу́чше оста́нусь на тропе́!', 'Skjønner. Da blir jeg heller på stien!']
    ],
    vocab: [['е́сли бы', 'hvis (tenkt, uvirkelig)'], ['я бы хоте́л(а)', 'jeg skulle gjerne ...'], ['ге́йзер', 'geysir'],
      ['доли́на', 'dal'], ['тропа́', 'sti'], ['горя́чий', 'het, varm'], ['пар', 'damp'], ['повезло́', 'var heldig'],
      ['опа́сно', 'farlig'], ['упа́сть', 'å falle'], ['оста́ться', 'å bli (værende)'], ['побли́же', 'litt nærmere'],
      ['мочь', 'å kunne'], ['сфотографи́ровать', 'å ta bilde av']],
    grammar: {
      title: 'Betinget form med бы',
      html: `<p>Betinget form = <b>fortid + бы</b>. Formen er den samme for nåtid og fortid: «ville / ville ha».</p>
      <table class="gtable"><tr><th>Virkelig (kan skje)</th><th>Uvirkelig (tenkt)</th></tr>
      <tr><td>Если <b>будет</b> хорошая погода, мы <b>полетим</b>.<br>Hvis det blir fint vær, flyr vi.</td>
      <td>Если <b>бы была</b> хорошая погода, мы <b>бы полетели</b>.<br>Hvis det hadde vært fint vær, ville vi ha flydd.</td></tr></table>
      <p>Verbet bøyes i kjønn og tall som i fortid: я бы хотел (mann), я бы хотел<b>а</b> (kvinne), мы бы хотел<b>и</b>.</p>
      <p>Høflige ønsker og spørsmål: <b>Я бы хотел(а) чай.</b> = Jeg skulle gjerne hatt te. <b>Вы не могли бы мне помочь?</b> = Kunne De hjelpe meg?</p>
      <p class="tip">💡 <b>бы</b> kan stå nesten hvor som helst, men oftest etter verbet eller etter <b>если</b>.</p>`
    },
    quiz: [
      ['«Jeg skulle gjerne hatt te»', 'Я бы хотел чай.', 'Я хотел бы буду чай.', 'Я бы хочу чай.', 'Я буду бы чай.'],
      ['Если бы у меня было время, я ___ в долину гейзеров', 'поехал бы', 'поеду бы', 'еду бы', 'поехать бы'],
      ['Hvilken setning er tenkt (uvirkelig)?', 'Если бы шёл дождь, мы бы сидели дома.', 'Если идёт дождь, мы сидим дома.', 'Если будет дождь, мы будем дома.', 'Когда шёл дождь, мы сидели дома.'],
      ['Høflig: «Kunne De hjelpe meg?»', 'Вы не могли бы мне помочь?', 'Вы не можете бы мне помочь?', 'Вы бы помогите мне?', 'Вы мочь бы мне помочь?']
    ],
    rp: {
      bot: 'Алексей', intro: 'Ranger Aleksej viser deg rundt i Geysirdalen.',
      steps: [
        { b: 'Что вы хоте́ли бы уви́деть?', bn: 'Hva ville du gjerne se?', h: 'Si at du gjerne vil se den store geysiren (Я бы хотел / хотела ...).', m: 'Я бы хоте́л уви́деть большо́й ге́йзер.', any: ['бы хотел', 'бы хотела', 'хотел бы', 'хотела бы', 'гейзер', 'гейзеры'] },
        { b: 'Не уходи́те с тропы́, э́то опа́сно!', bn: 'Ikke gå av stien, det er farlig!', h: 'Si at du skjønner (Понятно / Хорошо).', m: 'Поня́тно, спаси́бо.', ok: ['понятно спасибо', 'понятно', 'хорошо', 'конечно', 'хорошо понятно', 'спасибо', 'ясно', 'хорошо спасибо'] },
        { b: 'Е́сли бы у вас бы́ло ещё вре́мя, куда́ бы вы пое́хали?', bn: 'Hvis du hadde mer tid, hvor ville du reist?', h: 'Svar med бы (Я бы поехал / поехала ...).', m: 'Я бы пое́хал на вулка́н.', any: ['бы поехал', 'бы поехала', 'поехал бы', 'поехала бы', 'бы пошёл', 'бы пошла', 'бы полетел', 'бы полетела', 'полетел бы', 'полетела бы'] },
        { b: 'Вы не могли́ бы сфотографи́ровать меня́ у ге́йзера?', bn: 'Kunne du ta et bilde av meg ved geysiren?', h: 'Si «ja, selvfølgelig».', m: 'Да, коне́чно!', ok: ['да конечно', 'конечно', 'с удовольствием', 'да', 'да могу', 'конечно могу'] }
      ]
    }
  },
  {
    id: 27, icon: '🐻', ru: 'Медве́ди и ры́ба', no: 'Bjørner og laks (который)', place: 'Курильское озеро',
    intro: 'Ved Kurilsjøen sør på Kamtsjatka fisker bjørnene laks. Lars ser på dem fra et trygt utsiktspunkt sammen med fiskeren Sergej.',
    dialog: [
      ['Сергей', 'Ви́дишь медве́дя, кото́рый ло́вит ры́бу в реке́?', 'Ser du bjørnen som fanger fisk i elva?'],
      ['Ларс', 'Ого́! Э́то тот медве́дь, о кото́ром ты расска́зывал?', 'Oi! Er det den bjørnen som du fortalte om?'],
      ['Сергей', 'Да. А ры́ба, кото́рую он ло́вит, – э́то ло́сось.', 'Ja. Og fisken som han fanger, er laks.'],
      ['Ларс', 'В Норве́гии то́же есть ре́ки, в кото́рых мно́го лосо́ся.', 'I Norge finnes det også elver med mye laks.'],
      ['Сергей', 'Тогда́ ты зна́ешь люде́й, кото́рые лю́бят рыба́лку!', 'Da kjenner du folk som elsker fiske!'],
      ['Ларс', 'Коне́чно! Мой брат – рыба́к, кото́рый ло́вит ры́бу ка́ждый день.', 'Selvfølgelig! Broren min er en fisker som fisker hver dag.'],
      ['Сергей', 'Отли́чно. Но здесь мы не подхо́дим бли́зко к медве́дям!', 'Flott. Men her går vi ikke nær bjørnene!']
    ],
    vocab: [['медве́дь', 'bjørn'], ['ры́ба', 'fisk'], ['лови́ть ры́бу', 'å fiske'], ['рыба́лка', 'fisketur, fiske'],
      ['рыба́к', 'fisker'], ['ло́сось', 'laks'], ['кото́рый', 'som (relativt pronomen)'], ['расска́зывать', 'å fortelle'],
      ['у́дочка', 'fiskestang'], ['бе́рег', 'bredd, strand'], ['подходи́ть', 'å gå nær, nærme seg'], ['ди́кий', 'vill'],
      ['приро́да', 'natur'], ['лес', 'skog']],
    grammar: {
      title: 'Relativsetninger med который',
      html: `<p><b>который</b> = «som». Det bøyes som et adjektiv: <b>kjønn og tall</b> får det fra ordet det viser til, men <b>kasus</b> fra sin egen rolle i leddsetningen.</p>
      <table class="gtable"><tr><th>Kasus</th><th>Hankjønn</th><th>Hunkjønn</th><th>Flertall</th></tr>
      <tr><td>Nominativ</td><td>который</td><td>которая</td><td>которые</td></tr>
      <tr><td>Akkusativ</td><td>который / которого*</td><td>которую</td><td>которые / которых*</td></tr>
      <tr><td>Genitiv</td><td>которого</td><td>которой</td><td>которых</td></tr>
      <tr><td>Preposisjonal</td><td>о котором</td><td>о которой</td><td>о которых</td></tr></table>
      <p>* levende vesener i akkusativ = genitivform.</p>
      <p>Медведь, <b>который</b> ловит рыбу (subjekt → nominativ). Рыба, <b>которую</b> он ловит (objekt → akkusativ). Река, о <b>которой</b> я рассказывал (о + preposisjonal).</p>
      <p class="tip">💡 På norsk kan «som» sløyfes («fisken han fanger»). På russisk må <b>который</b> alltid være med, og det står komma foran.</p>`
    },
    quiz: [
      ['Это медведь, ___ ловит рыбу', 'который', 'которая', 'которое', 'которые'],
      ['Рыба, ___ он поймал, очень большая', 'которую', 'которая', 'который', 'которой'],
      ['Это река, о ___ я рассказывал', 'которой', 'которая', 'которую', 'который'],
      ['Люди, ___ живут здесь, любят рыбалку', 'которые', 'который', 'которых', 'которая']
    ],
    rp: {
      bot: 'Сергей', intro: 'Du sitter med Sergej på bredden av Kurilsjøen.',
      steps: [
        { b: 'Смотри́! Ви́дишь медве́дя?', bn: 'Se! Ser du bjørnen?', h: 'Si ja, du ser bjørnen som fanger fisk.', m: 'Да, я ви́жу медве́дя, кото́рый ло́вит ры́бу.', ok: ['да я вижу медведя', 'да вижу', 'вижу', 'да', 'ого', 'да я вижу'], any: ['вижу'] },
        { b: 'Ты лю́бишь рыба́лку?', bn: 'Liker du å fiske?', h: 'Svar ja eller nei.', m: 'Да, о́чень люблю́!', ok: ['да очень люблю', 'да люблю', 'люблю', 'нет не люблю', 'да', 'нет', 'очень', 'не очень'] },
        { b: 'А кто у тебя́ в семье́ рыба́к?', bn: 'Og hvem i familien din er fisker?', h: 'Fortell, f.eks. «Broren min er en fisker som ...» (bruk который).', m: 'Мой брат – рыба́к, кото́рый лю́бит Камча́тку.', any: ['который', 'которая', 'брат', 'папа', 'отец', 'сестра', 'мама', 'дедушка', 'дядя', 'никто'] },
        { b: 'Вот ры́ба, кото́рую я пойма́л. Хо́чешь на у́жин?', bn: 'Her er fisken som jeg fanget. Vil du ha den til middag?', h: 'Si ja takk, gjerne.', m: 'Да, с удово́льствием!', ok: ['да с удовольствием', 'с удовольствием', 'да спасибо', 'да хочу', 'да пожалуйста', 'хочу', 'спасибо', 'нет спасибо'] }
      ]
    }
  },
  {
    id: 28, icon: '🦊', ru: 'Запове́дник', no: 'Naturreservatet (genitiv flertall)', place: 'Кроноцкий заповедник',
    intro: 'Kronotskij-reservatet er et av Russlands eldste naturreservater. Lars går en lang dag med forskeren Marina og teller dyr.',
    dialog: [
      ['Ларс', 'Мари́на, ско́лько здесь медве́дей?', 'Marina, hvor mange bjørner er det her?'],
      ['Марина', 'Мно́го! Здесь живёт мно́го медве́дей, лис и птиц.', 'Mange! Her bor det mange bjørner, rever og fugler.'],
      ['Ларс', 'А ско́лько тури́стов приезжа́ет сюда́?', 'Og hvor mange turister kommer hit?'],
      ['Марина', 'Немно́го – то́лько не́сколько ты́сяч в год.', 'Ikke mange – bare noen tusen i året.'],
      ['Ларс', 'Я сде́лал сто фотогра́фий и ви́дел пять медве́дей!', 'Jeg har tatt hundre bilder og sett fem bjørner!'],
      ['Марина', 'Пять медве́дей за оди́н день? Тебе́ повезло́!', 'Fem bjørner på én dag? Du var heldig!'],
      ['Ларс', 'Да! Но у меня́ уже́ нет сил – мы шли шесть часо́в.', 'Ja! Men nå orker jeg ikke mer – vi gikk i seks timer.']
    ],
    vocab: [['мно́го', 'mange, mye'], ['ма́ло', 'få, lite'], ['не́сколько', 'noen, flere'], ['пти́ца', 'fugl'],
      ['лиса́', 'rev'], ['живо́тное', 'dyr'], ['фотогра́фия', 'fotografi, bilde'], ['челове́к / лю́ди', 'menneske / folk'],
      ['гриб', 'sopp'], ['я́года', 'bær'], ['де́рево', 'tre'], ['тишина́', 'stillhet'], ['нет сил', 'orker ikke mer'],
      ['ви́деть', 'å se']],
    grammar: {
      title: 'Genitiv flertall',
      html: `<p>Etter <b>много, мало, несколько, сколько</b> og tall fra <b>5</b> og oppover står substantivet i <b>genitiv flertall</b>.</p>
      <table class="gtable"><tr><th>Type</th><th>Endelse</th><th>Eksempel</th></tr>
      <tr><td>Hankjønn, hard konsonant</td><td>-ов</td><td>турист → много турист<b>ов</b></td></tr>
      <tr><td>Hankjønn på -й</td><td>-ев</td><td>музей → пять музе<b>ев</b></td></tr>
      <tr><td>På -ь, -ж, -ш, -ч, -щ</td><td>-ей</td><td>медведь → пять медвед<b>ей</b>, ночь → ноч<b>ей</b></td></tr>
      <tr><td>Hunkjønn på -а</td><td>ingen endelse</td><td>птица → много птиц, книга → книг</td></tr>
      <tr><td>På -ия</td><td>-ий</td><td>фотография → сто фотограф<b>ий</b></td></tr>
      <tr><td>Intetkjønn på -о</td><td>ingen endelse</td><td>место → мест, озеро → озёр</td></tr></table>
      <p class="tip">⚠️ Uregelmessige: друг → пять <b>друзей</b>, человек → много <b>людей</b>, год → пять <b>лет</b>.</p>`
    },
    quiz: [
      ['пять ___ (venner)', 'друзей', 'другов', 'друга', 'друзья'],
      ['много ___ (bøker)', 'книг', 'книги', 'книгов', 'книга'],
      ['сколько ___ (turister)?', 'туристов', 'туристы', 'турист', 'туриста'],
      ['мало ___ (mennesker)', 'людей', 'люди', 'человеков', 'людях']
    ],
    rp: {
      bot: 'Марина', intro: 'Etter en lang dag i reservatet spør Marina hvordan det gikk.',
      steps: [
        { b: 'Ско́лько медве́дей ты ви́дел сего́дня?', bn: 'Hvor mange bjørner så du i dag?', h: 'Si hvor mange bjørner du så (пять медведей ...).', m: 'Я ви́дел пять медве́дей.', any: ['медведей', 'медведя', 'медведь', 'ни одного', 'одного', 'много', 'мало'], dig: true },
        { b: 'А ско́лько фотогра́фий ты сде́лал?', bn: 'Og hvor mange bilder tok du?', h: 'Si et antall bilder (сто фотографий ...).', m: 'Я сде́лал сто фотогра́фий.', any: ['фотографий', 'фотографии', 'фотографию', 'много', 'мало'], dig: true },
        { b: 'Каки́х живо́тных ты ещё ви́дел?', bn: 'Hvilke andre dyr så du?', h: 'Nevn noen dyr (лис, птиц ...).', m: 'Я ви́дел лис и птиц.', any: ['лис', 'лису', 'лиса', 'птиц', 'птицу', 'птицы', 'медведей', 'рыбу', 'рыб', 'оленей', 'оленя', 'орла', 'орлов', 'никаких'] },
        { b: 'Ты, наве́рное, уста́л?', bn: 'Du er sikkert sliten?', h: 'Si ja, du er veldig sliten – du orker ikke mer (сил нет).', m: 'Да, о́чень уста́л. Сил нет!', ok: ['да очень устал', 'да очень устала', 'очень устал', 'очень устала', 'сил нет', 'нет сил', 'у меня нет сил'], any: ['устал', 'устала'] }
      ]
    }
  },
  {
    id: 29, icon: '⚓', ru: 'Кем ты рабо́таешь?', no: 'Yrker og «å bli» (instrumental)', place: 'Морской порт Мурманска',
    intro: 'Lars har kommet til Murmansk, den største byen nord for polarsirkelen. I havna møter han kaptein Nikolaj.',
    dialog: [
      ['Николай', 'Ларс, кем ты рабо́таешь в Норве́гии?', 'Lars, hva jobber du som i Norge?'],
      ['Ларс', 'Я рабо́таю инжене́ром. А ра́ньше я был студе́нтом.', 'Jeg jobber som ingeniør. Før var jeg student.'],
      ['Николай', 'А я капита́н. Я рабо́таю капита́ном на ледоко́ле уже́ два́дцать лет.', 'Og jeg er kaptein. Jeg har jobbet som kaptein på en isbryter i tjue år.'],
      ['Ларс', 'Здо́рово! Ты всегда́ хоте́л стать моряко́м?', 'Kult! Har du alltid villet bli sjømann?'],
      ['Николай', 'Да, мой оте́ц то́же был моряко́м. А моя́ дочь хо́чет стать врачо́м.', 'Ja, faren min var også sjømann. Og datteren min vil bli lege.'],
      ['Ларс', 'А я в де́тстве хоте́л стать космона́втом!', 'Og jeg ville bli kosmonaut da jeg var barn!'],
      ['Николай', 'Ну, тепе́рь ты стал путеше́ственником!', 'Nå ja, nå har du blitt en eventyrer!']
    ],
    vocab: [['кем?', 'som hva? (instrumental av кто)'], ['стать', 'å bli'], ['быть', 'å være'], ['инжене́р', 'ingeniør'],
      ['капита́н', 'kaptein'], ['моря́к', 'sjømann'], ['ледоко́л', 'isbryter'], ['порт', 'havn'],
      ['журнали́ст', 'journalist'], ['программи́ст', 'programmerer'], ['медсестра́', 'sykepleier'],
      ['в де́тстве', 'som barn'], ['ра́ньше', 'før, tidligere'], ['профе́ссия', 'yrke']],
    grammar: {
      title: 'Instrumental: работать кем, стать кем',
      html: `<p>Etter <b>работать</b> (jobbe som), <b>стать</b> (bli) og <b>быть</b> i fortid og framtid står yrket i <b>instrumental</b>.</p>
      <table class="gtable"><tr><th>Nominativ</th><th>Instrumental</th><th>Regel</th></tr>
      <tr><td>инженер</td><td>инженер<b>ом</b></td><td>hankjønn + ом</td></tr>
      <tr><td>врач</td><td>врач<b>ом</b></td><td>(etter ж, ш, ч, щ, ц: -ом med trykk, ellers -ем)</td></tr>
      <tr><td>учитель</td><td>учител<b>ем</b></td><td>-ь → -ем</td></tr>
      <tr><td>медсестра</td><td>медсестр<b>ой</b></td><td>-а → -ой</td></tr>
      <tr><td>учительница</td><td>учительниц<b>ей</b></td><td>-а → -ей (etter ц uten trykk)</td></tr></table>
      <p><b>Он врач.</b> (presens, ingen verb – nominativ) · <b>Он был врачом.</b> · <b>Он будет врачом.</b> · <b>Он хочет стать врачом.</b></p>
      <p class="tip">💡 Spørsmålet heter <b>Кем</b> ты работаешь? (ikke «кто»).</p>`
    },
    quiz: [
      ['Он работает ___ (lege)', 'врачом', 'врач', 'врача', 'врачу'],
      ['Я хочу стать ___ (journalist)', 'журналистом', 'журналист', 'журналиста', 'журналисте'],
      ['Моя сестра работает ___ (sykepleier)', 'медсестрой', 'медсестра', 'медсестру', 'медсестры'],
      ['«Hva jobber du som?»', 'Кем ты работаешь?', 'Кто ты работаешь?', 'Кого ты работаешь?', 'Кому ты работаешь?']
    ],
    rp: {
      bot: 'Николай', intro: 'Kaptein Nikolaj byr deg på te i havna i Murmansk.',
      steps: [
        { b: 'Кем ты рабо́таешь?', bn: 'Hva jobber du som?', h: 'Si yrket ditt i instrumental (Я работаю инженером ...).', m: 'Я рабо́таю инжене́ром.', any: ['работаю', 'я студент', 'я студентка', 'учусь', 'на пенсии', 'не работаю'] },
        { b: 'А кем ты хоте́л стать в де́тстве?', bn: 'Og hva ville du bli som barn?', h: 'Si hva du ville bli (Я хотел / хотела стать ...).', m: 'Я хоте́л стать космона́втом.', any: ['стать', 'хотел', 'хотела'] },
        { b: 'Мой оте́ц то́же был капита́ном. А твой оте́ц?', bn: 'Faren min var også kaptein. Og faren din?', h: 'Si hva faren din jobber / jobbet som (Мой отец работает / был ...).', m: 'Мой оте́ц рабо́тает врачо́м.', any: ['работает', 'работал', 'был', 'отец', 'папа'] },
        { b: 'Хо́чешь посмотре́ть мой ледоко́л?', bn: 'Vil du se isbryteren min?', h: 'Si ja, gjerne!', m: 'Да, с удово́льствием!', ok: ['да с удовольствием', 'с удовольствием', 'да хочу', 'хочу', 'конечно', 'да конечно', 'очень хочу', 'да'] }
      ]
    }
  },
  {
    id: 30, icon: '🌌', ru: 'Се́верное сия́ние', no: 'Nordlyset (imperativ)', place: 'Териберка',
    intro: 'Det er polarnatt. Lars har dratt til fiskeværet Teriberka ved Barentshavet for å fotografere nordlyset sammen med fotografen Svetlana.',
    dialog: [
      ['Светлана', 'Ларс, иди́ сюда́! Посмотри́ на не́бо!', 'Lars, kom hit! Se på himmelen!'],
      ['Ларс', 'Ой, се́верное сия́ние! Како́е я́ркое!', 'Å, nordlys! Så sterkt!'],
      ['Светлана', 'Возьми́ фотоаппара́т и поста́вь его́ на штати́в.', 'Ta kameraet og sett det på stativet.'],
      ['Ларс', 'Гото́во. Что ещё сде́лать?', 'Ferdig. Hva mer skal jeg gjøre?'],
      ['Светлана', 'Не торопи́сь. Снима́й ме́дленно и не забу́дь вы́ключить вспы́шку!', 'Ikke stress. Fotografer rolig, og ikke glem å skru av blitsen!'],
      ['Ларс', 'У нас в Норве́гии то́же есть сия́ние, но здесь оно́ ещё краси́вее!', 'Vi har nordlys i Norge også, men her er det enda vakrere!'],
      ['Светлана', 'Тогда́ снима́й скоре́е, пока́ оно́ не ушло́!', 'Da får du fotografere fort, før det forsvinner!']
    ],
    vocab: [['се́верное сия́ние', 'nordlys'], ['не́бо', 'himmel'], ['звезда́', 'stjerne'], ['я́ркий', 'sterk, klar (om lys)'],
      ['фотоаппара́т', 'kamera'], ['штати́в', 'stativ'], ['снима́ть', 'å fotografere, filme'], ['возьми́(те)!', 'ta! (imperativ)'],
      ['посмотри́(те)!', 'se! (imperativ)'], ['не забу́дь(те)!', 'ikke glem!'], ['торопи́ться', 'å skynde seg'],
      ['скоре́е', 'fort, fortere'], ['поля́рная ночь', 'polarnatt'], ['темно́', 'mørkt']],
    grammar: {
      title: 'Imperativ – begge aspekter',
      html: `<p>Ta presensstammen (они-formen uten endelse) og legg til:</p>
      <table class="gtable"><tr><th>Stammen ender på</th><th>Endelse</th><th>Eksempel (ты / вы)</th></tr>
      <tr><td>vokal</td><td>-й</td><td>чита-ют → читай / читайте, снима-ют → снимай</td></tr>
      <tr><td>konsonant, trykk på endelsen</td><td>-и</td><td>смотр-ят → смотри, скаж-ут → скажи, возьм-ут → возьми</td></tr>
      <tr><td>konsonant, trykk på stammen</td><td>-ь</td><td>забуд-ут → забудь, постав-ят → поставь</td></tr></table>
      <p>Høflig form / flertall: + <b>-те</b>: посмотрите, возьмите. Refleksive: + <b>-ся / -сь</b>: не торопись, садитесь.</p>
      <p><b>Perfektiv</b> = én konkret handling: <b>Посмотри</b> на небо! <b>Возьми</b> штатив!<br><b>Imperfektiv</b> = generelt råd, invitasjon eller nektelse: <b>Снимай</b> медленно. <b>Проходите</b>! <b>Не торопись</b>!</p>
      <p class="tip">💡 Nektelse tar vanligvis imperfektiv: Не снимай! Men advarsler tar perfektiv: <b>Не забудь!</b> <b>Не упади!</b></p>`
    },
    quiz: [
      ['Imperativ av «читать» (ты)', 'читай', 'читаи', 'чить', 'читаю'],
      ['Imperativ av «сказать» (вы)', 'скажите', 'сказайте', 'скажьте', 'сказите'],
      ['«Ikke stress!» (ты)', 'Не торопись!', 'Не торопиться!', 'Не торопишь!', 'Не торопился!'],
      ['Du ber en venn én gang: «Se på himmelen!»', 'Посмотри на небо!', 'Смотреть на небо!', 'Посмотреть на небо!', 'Посмотрю на небо!']
    ],
    rp: {
      bot: 'Светлана', intro: 'Midt i polarnatta i Teriberka. Svetlana står ved siden av deg med kamera.',
      steps: [
        { b: 'Что там на не́бе?', bn: 'Hva er det der på himmelen?', h: 'Si «Se! Nordlys!» (Смотри! Северное сияние!)', m: 'Смотри́! Се́верное сия́ние!', ok: ['смотри северное сияние', 'посмотри северное сияние', 'смотри', 'посмотри', 'северное сияние', 'это северное сияние', 'смотрите', 'посмотрите'], any: ['смотри', 'посмотри', 'сияние'] },
        { b: 'Ой, я забы́ла штати́в в маши́не!', bn: 'Å nei, jeg glemte stativet i bilen!', h: 'Be henne ta ditt stativ (Возьми мой штатив!).', m: 'Возьми́ мой штати́в!', ok: ['возьми мой штатив', 'возьми', 'возьми штатив', 'бери мой штатив', 'бери', 'на возьми'], any: ['возьми', 'бери', 'возьмите'] },
        { b: 'Как лу́чше снима́ть?', bn: 'Hvordan er det best å fotografere?', h: 'Gi et råd i imperativ (Снимай медленно! / Не торопись!).', m: 'Не торопи́сь и снима́й ме́дленно.', any: ['не торопись', 'не спеши', 'снимай', 'подожди', 'выключи', 'поставь', 'смотри', 'медленно'] },
        { b: 'Спаси́бо! Как краси́во!', bn: 'Takk! Så vakkert!', h: 'Si «vær så god» – og be henne ta et bilde av deg også (Сфотографируй меня!).', m: 'Пожа́луйста! Сфотографи́руй и меня́!', ok: ['пожалуйста', 'пожалуйста сфотографируй меня', 'сфотографируй меня', 'не за что', 'да очень красиво', 'очень красиво'], any: ['сфотографируй', 'пожалуйста', 'не за что', 'красиво'] }
      ]
    }
  },
  {
    id: 31, icon: '🛂', ru: 'На грани́це', no: 'På grensa (indirekte tale)', place: 'Пункт пропуска Борисоглебский',
    intro: 'Lars kjører hjem over grensa ved Storskog, mellom Russland og Kirkenes. Grensevakten har noen spørsmål.',
    dialog: [
      ['Пограничник', 'До́брый день! Ваш па́спорт, пожа́луйста. Куда́ вы е́дете?', 'God dag! Passet ditt, takk. Hvor skal du?'],
      ['Ларс', 'Домо́й, в Норве́гию. Ма́ма проси́ла, что́бы я верну́лся до Рождества́.', 'Hjem, til Norge. Mamma ba meg komme hjem før jul.'],
      ['Пограничник', 'Поня́тно. Вы везёте ры́бу и́ли мя́со?', 'Skjønner. Har du med fisk eller kjøtt?'],
      ['Ларс', 'Нет. Друзья́ сказа́ли, что э́то нельзя́.', 'Nei. Vennene mine sa at det ikke er lov.'],
      ['Пограничник', 'Пра́вильно. Вы бы́ли в Мурма́нске?', 'Riktig. Har du vært i Murmansk?'],
      ['Ларс', 'Да. Капита́н Никола́й сказа́л, что я тепе́рь настоя́щий северя́нин!', 'Ja. Kaptein Nikolaj sa at jeg nå er en ekte nordbo!'],
      ['Пограничник', 'Всё в поря́дке. Счастли́вого пути́!', 'Alt er i orden. God tur!']
    ],
    vocab: [['грани́ца', 'grense'], ['пограни́чник', 'grensevakt'], ['тамо́жня', 'toll'], ['сказа́ть, что ...', 'å si at ...'],
      ['проси́ть, что́бы ...', 'å be (noen) om å ...'], ['хоте́ть, что́бы ...', 'å ville at (noen) ...'], ['нельзя́', 'det er ikke lov'],
      ['везти́', 'å frakte, ha med (i kjøretøy)'], ['бага́жник', 'bagasjerom'], ['мя́со', 'kjøtt'], ['Рождество́', 'jul'],
      ['настоя́щий', 'ekte'], ['счастли́вого пути́!', 'god tur!'], ['всё в поря́дке', 'alt er i orden']],
    grammar: {
      title: 'Indirekte tale: что og чтобы',
      html: `<p><b>что</b> gjengir et utsagn. Russisk beholder <b>tiden</b> fra den direkte talen – det gjør ikke norsk!</p>
      <table class="gtable"><tr><th>Direkte tale</th><th>Indirekte tale</th></tr>
      <tr><td>Он сказал: «Я живу в Осло».</td><td>Он сказал, <b>что живёт</b> в Осло.<br>Han sa at han bodde i Oslo.</td></tr>
      <tr><td>Она сказала: «Я устала».</td><td>Она сказала, <b>что устала</b>.</td></tr></table>
      <p><b>чтобы</b> gjengir et ønske eller en oppfordring. Hvis subjektet er et annet, står verbet i <b>fortid</b>:</p>
      <table class="gtable"><tr><th>Direkte tale</th><th>Indirekte tale</th></tr>
      <tr><td>Мама: «Вернись домой!»</td><td>Мама попросила, <b>чтобы я вернулся</b>.</td></tr>
      <tr><td>Пограничник: «Откройте багажник!»</td><td>Он сказал, <b>чтобы мы открыли</b> багажник.</td></tr></table>
      <p>Ja/nei-spørsmål får <b>ли</b>: Он спросил: «Вы были в Мурманске?» → Он спросил, <b>был ли</b> я в Мурманске.</p>
      <p class="tip">💡 Samme subjekt → infinitiv: Я хочу вернуться. Ulikt subjekt → чтобы + fortid: Я хочу, чтобы ты вернулся.</p>`
    },
    quiz: [
      ['Он сказал: «Я живу в Осло». → Он сказал, ___', 'что живёт в Осло', 'что жил в Осло', 'чтобы жил в Осло', 'живёт ли в Осло'],
      ['Мама хочет, ___ я вернулся домой', 'чтобы', 'что', 'если', 'который'],
      ['Она попросила, чтобы мы ___ дверь', 'открыли', 'откроем', 'открываем', 'открыть'],
      ['«Han spurte om jeg hadde vært i Murmansk»', 'Он спросил, был ли я в Мурманске.', 'Он спросил, что я был в Мурманске.', 'Он спросил, чтобы я был в Мурманске.', 'Он спросил, если я был в Мурманске.']
    ],
    rp: {
      bot: 'Пограничник', intro: 'Du står ved grenseovergangen mellom Russland og Norge.',
      steps: [
        { b: 'Куда́ вы е́дете?', bn: 'Hvor skal du?', h: 'Si at du skal hjem til Norge.', m: 'Домо́й, в Норве́гию.', ok: ['домой в норвегию', 'в норвегию', 'домой', 'я еду домой', 'я еду в норвегию', 'я еду домой в норвегию', 'в киркенес', 'я еду в киркенес'] },
        { b: 'Почему́ вы е́дете сего́дня?', bn: 'Hvorfor reiser du i dag?', h: 'Si at mamma ba deg komme hjem (Мама попросила, чтобы я вернулся / вернулась).', m: 'Ма́ма попроси́ла, что́бы я верну́лся.', ok: ['мама попросила чтобы я вернулся', 'мама попросила чтобы я вернулась', 'мама хочет чтобы я вернулся', 'мама хочет чтобы я вернулась'], any: ['чтобы', 'попросила', 'просила', 'мама хочет', 'работа', 'на работу'] },
        { b: 'Вы везёте ры́бу и́ли мя́со?', bn: 'Har du med fisk eller kjøtt?', h: 'Si nei – du har hørt at det ikke er lov (Мне сказали, что это нельзя).', m: 'Нет. Мне сказа́ли, что э́то нельзя́.', ok: ['нет мне сказали что это нельзя', 'нет', 'нет не везу', 'нет это нельзя', 'мне сказали что это нельзя'], any: ['нельзя', 'не везу'] },
        { b: 'Всё в поря́дке. Счастли́вого пути́!', bn: 'Alt er i orden. God tur!', h: 'Takk og si ha det.', m: 'Спаси́бо! До свида́ния!', ok: ['спасибо до свидания', 'спасибо', 'до свидания', 'большое спасибо', 'спасибо всего доброго', 'всего доброго'] }
      ]
    }
  },
  {
    id: 32, icon: '🚢', ru: 'Ледоко́л «Ле́нин»', no: 'Isbryteren – B1-finale', place: 'Ледокол «Ленин», Мурманск', boss: true,
    intro: 'Finalen for B1! Lars avslutter reisen på museumsisbryteren «Lenin» i Murmansk og ringer Olga. Her repeterer du aspekt, bevegelsesverb, komparativ, бы, который og indirekte tale.',
    dialog: [
      ['Ольга', 'Ларс! Где ты сейча́с?', 'Lars! Hvor er du nå?'],
      ['Ларс', 'Я на ледоко́ле «Ле́нин» – э́то пе́рвый в ми́ре а́томный ледоко́л.', 'Jeg er på isbryteren «Lenin» – verdens første atomdrevne isbryter.'],
      ['Ольга', 'Ничего́ себе́! А где ты был на про́шлой неде́ле?', 'Jøss! Og hvor var du forrige uke?'],
      ['Ларс', 'Я е́здил в Терибе́рку и ви́дел се́верное сия́ние. Э́то бы́ло са́мое краси́вое, что я ви́дел!', 'Jeg dro til Teriberka og så nordlyset. Det var det vakreste jeg har sett!'],
      ['Ольга', 'Как здо́рово! А когда́ ты уезжа́ешь в Норве́гию?', 'Så flott! Og når reiser du til Norge?'],
      ['Ларс', 'Послеза́втра. Ма́ма хо́чет, что́бы я прие́хал до Рождества́.', 'I overmorgen. Mamma vil at jeg skal komme før jul.'],
      ['Ольга', 'Е́сли бы ты оста́лся, мы бы пошли́ в теа́тр!', 'Hvis du hadde blitt, kunne vi ha gått i teateret!'],
      ['Ларс', 'Я обяза́тельно верну́сь ле́том. Обеща́ю!', 'Jeg kommer garantert tilbake i sommer. Jeg lover!']
    ],
    vocab: [['а́томный', 'atom-, atomdrevet'], ['про́шлый', 'forrige'], ['сле́дующий', 'neste'], ['послеза́втра', 'i overmorgen'],
      ['позавчера́', 'i forgårs'], ['обяза́тельно', 'garantert, absolutt'], ['обеща́ть', 'å love'],
      ['уезжа́ть / уе́хать', 'å reise bort'], ['возвраща́ться / верну́ться', 'å komme tilbake'], ['впечатле́ние', 'inntrykk'],
      ['на па́мять', 'som minne'], ['скуча́ть', 'å savne, kjede seg'], ['мир', 'verden; fred'], ['вспомина́ть', 'å minnes']],
    grammar: {
      title: 'Repetisjon: B1-grammatikken',
      html: `<table class="gtable"><tr><th>Tema</th><th>Eksempel</th></tr>
      <tr><td>Aspekt</td><td>Я читал книгу. · Я прочитал книгу.</td></tr>
      <tr><td>Bevegelsesverb</td><td>Сейчас я иду. · Я часто хожу в горы.</td></tr>
      <tr><td>Prefiks</td><td>Мы пришли на вершину. · Он ушёл.</td></tr>
      <tr><td>-ся-verb</td><td>Я занимаюсь спортом.</td></tr>
      <tr><td>Komparativ / superlativ</td><td>Эльбрус выше. · самый высокий вулкан</td></tr>
      <tr><td>Betinget form</td><td>Если бы была хорошая погода, мы бы полетели.</td></tr>
      <tr><td>который</td><td>медведь, который ловит рыбу</td></tr>
      <tr><td>Genitiv flertall</td><td>пять медведей, много фотографий</td></tr>
      <tr><td>Instrumental</td><td>Я работаю инженером. · Он стал капитаном.</td></tr>
      <tr><td>Imperativ</td><td>Посмотри! · Не торопись!</td></tr>
      <tr><td>Indirekte tale</td><td>Он сказал, что живёт в Осло. · Мама хочет, чтобы я вернулся.</td></tr></table>
      <p class="tip">🏆 Gratulerer – du har fullført B1-nivået! Du kan nå fortelle om reiser, sammenligne, ønske og gjengi hva andre sier.</p>`
    },
    quiz: [
      ['Вчера я ___ книгу и теперь знаю конец', 'прочитал', 'читал', 'читаю', 'буду читать'],
      ['Каждую зиму мы ___ в горы', 'ездим', 'едем', 'поедем', 'приедем'],
      ['Байкал ___, чем Ладожское озеро (dypere)', 'глубже', 'глубокее', 'самый глубокий', 'глубоко'],
      ['Я работаю ___ (ingeniør)', 'инженером', 'инженер', 'инженера', 'инженеру'],
      ['Если бы у меня было время, я ___ остался', 'бы', 'был', 'буду', 'что'],
      ['Там было пять ___ (bjørner)', 'медведей', 'медведи', 'медведя', 'медведь']
    ],
    rp: {
      bot: 'Ольга', intro: 'Siste videosamtale med Olga før du reiser hjem.',
      steps: [
        { b: 'Ларс, что ты де́лал на про́шлой неде́ле?', bn: 'Lars, hva gjorde du forrige uke?', h: 'Fortell hvor du dro (Я ездил / ездила в ...).', m: 'Я е́здил в Терибе́рку.', any: ['ездил', 'ездила', 'был', 'была', 'ходил', 'ходила', 'видел', 'видела', 'летал', 'летала'] },
        { b: 'Что тебе́ понра́вилось бо́льше всего́?', bn: 'Hva likte du best?', h: 'Si hva du likte best (Больше всего мне понравилось ...).', m: 'Бо́льше всего́ мне понра́вилось се́верное сия́ние.', any: ['понравилось', 'понравился', 'понравилась', 'понравились', 'больше всего', 'самое', 'самый', 'самая', 'сияние', 'вулканы', 'горы', 'медведи'] },
        { b: 'Е́сли бы у тебя́ бы́ло ещё вре́мя, куда́ бы ты пое́хал?', bn: 'Hvis du hadde mer tid, hvor ville du reist?', h: 'Svar med бы (Я бы поехал / поехала ...).', m: 'Я бы пое́хал на Камча́тку ещё раз.', any: ['бы поехал', 'бы поехала', 'поехал бы', 'поехала бы', 'бы полетел', 'бы полетела', 'бы остался', 'бы осталась', 'бы пошёл', 'бы пошла'] },
        { b: 'Обеща́й, что вернёшься!', bn: 'Lov at du kommer tilbake!', h: 'Lov at du kommer tilbake (Обещаю, что вернусь!).', m: 'Обеща́ю, что верну́сь!', ok: ['обещаю что вернусь', 'обещаю', 'обязательно вернусь', 'я обязательно вернусь', 'я вернусь', 'вернусь', 'конечно вернусь', 'обещаю вернусь'] }
      ]
    }
  }
);
