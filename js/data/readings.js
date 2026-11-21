window.RP = window.RP || {};
/* Lese- og lyttetekster: én per region. Nivået følger leksjonene i regionen.
   text: [russisk setning (med trykktegn), norsk oversettelse]
   quiz: [spørsmål, riktig, ...feil]   (rekkefølgen stokkes ved visning) */
RP.READINGS = [
  {
    id: 'r-moskva', region: 'moskva', icon: '📜', ru: 'Ларс в Москве́', no: 'Lars i Moskva',
    text: [
      ['Приве́т! Меня́ зову́т Ларс.', 'Hei! Jeg heter Lars.'],
      ['Я из Норве́гии, из О́сло.', 'Jeg er fra Norge, fra Oslo.'],
      ['Сейча́с я в Москве́.', 'Nå er jeg i Moskva.'],
      ['Я студе́нт и немно́го говорю́ по-ру́сски.', 'Jeg er student og snakker litt russisk.'],
      ['У меня́ есть сестра́. Её зову́т И́нгрид.', 'Jeg har en søster. Hun heter Ingrid.'],
      ['Здесь, на Арба́те, есть хоро́шее кафе́.', 'Her på Arbat er det en god kafé.'],
      ['Я хочу́ ко́фе с молоко́м и бутербро́д.', 'Jeg vil ha kaffe med melk og et smørbrød.'],
      ['Ко́фе сто́ит сто рубле́й. Э́то не до́рого.', 'Kaffen koster hundre rubler. Det er ikke dyrt.'],
      ['Пото́м я иду́ в музе́й на Кра́сной пло́щади.', 'Så går jeg til museet på Den røde plass.'],
      ['Музе́й бли́зко: пря́мо, пото́м напра́во.', 'Museet er nært: rett fram, så til høyre.'],
      ['Москва́ – о́чень интере́сный го́род!', 'Moskva er en veldig interessant by!']
    ],
    quiz: [
      ['Откуда Ларс?', 'Из Норвегии', 'Из России', 'Из Москвы', 'Из Англии'],
      ['Как зовут сестру Ларса?', 'Ингрид', 'Анна', 'Ольга', 'Ирина'],
      ['Hva bestiller Lars på kafeen?', 'Kaffe med melk og et smørbrød', 'Te og suppe', 'Svart kaffe og vann', 'Pizza og vann'],
      ['Hvor ligger museet?', 'På Den røde plass', 'På Arbat', 'Langt fra sentrum', 'Ved siden av kafeen']
    ]
  },
  {
    id: 'r-ring', region: 'ring', icon: '✉️', ru: 'Письмо́ из Су́здаля', no: 'Brev fra Suzdal',
    text: [
      ['Приве́т, А́нна!', 'Hei, Anna!'],
      ['Сейча́с я в Су́здале. Здесь о́чень хорошо́.', 'Nå er jeg i Suzdal. Her er det veldig fint.'],
      ['У́тром я за́втракаю и чита́ю но́вости.', 'Om morgenen spiser jeg frokost og leser nyheter.'],
      ['Днём я гуля́ю, а ве́чером отдыха́ю.', 'Om dagen går jeg tur, og om kvelden slapper jeg av.'],
      ['Сего́дня хо́лодно и идёт снег.', 'I dag er det kaldt og det snør.'],
      ['Но я из Норве́гии, и я люблю́ зи́му!', 'Men jeg er fra Norge, og jeg elsker vinteren!'],
      ['За́втра в де́вять часо́в я е́ду во Влади́мир.', 'I morgen klokka ni reiser jeg til Vladimir.'],
      ['Там сейча́с Макси́м.', 'Maksim er der nå.'],
      ['Мы лю́бим футбо́л и ча́сто игра́ем в футбо́л.', 'Vi liker fotball og spiller ofte fotball.'],
      ['А что ты де́лаешь ве́чером?', 'Og hva gjør du om kvelden?'],
      ['Дава́й пойдём в кино́ в суббо́ту!', 'La oss gå på kino på lørdag!'],
      ['Пока́! Твой Ларс', 'Ha det! Hilsen Lars']
    ],
    quiz: [
      ['Hvor er Lars nå?', 'I Suzdal', 'I Moskva', 'I Vladimir', 'I Oslo'],
      ['Какая сегодня погода?', 'Холодно и идёт снег', 'Тепло и светит солнце', 'Жарко', 'Идёт дождь'],
      ['Hva gjør Lars om kvelden?', 'Han slapper av', 'Han jobber', 'Han spiller fotball', 'Han leser nyheter'],
      ['Куда Ларс едет завтра?', 'Во Владимир', 'В Москву', 'В Кострому', 'В Норвегию']
    ]
  },
  {
    id: 'r-spb', region: 'spb', icon: '🏛️', ru: 'Оди́н день в Петербу́рге', no: 'En dag i St. Petersburg',
    text: [
      ['Вчера́ Ларс был в Санкт-Петербу́рге.', 'I går var Lars i St. Petersburg.'],
      ['У́тром он купи́л биле́т на вокза́ле в Москве́.', 'Om morgenen kjøpte han billett på stasjonen i Moskva.'],
      ['В по́езде он чита́л кни́гу и слу́шал му́зыку.', 'På toget leste han en bok og hørte på musikk.'],
      ['Пото́м он был в гости́нице на Не́вском проспе́кте.', 'Så var han på hotellet på Nevskij prospekt.'],
      ['Его́ но́мер был на тре́тьем этаже́.', 'Rommet hans var i tredje etasje.'],
      ['К сожале́нию, интерне́т в но́мере не рабо́тал.', 'Dessverre virket ikke internettet på rommet.'],
      ['Днём Ларс был в Эрмита́же.', 'Om dagen var Lars på Eremitasjen.'],
      ['Он смотре́л карти́ны три часа́.', 'Han så på malerier i tre timer.'],
      ['Ве́чером у него́ боле́ла голова́, и он пил чай с мёдом.', 'Om kvelden hadde han vondt i hodet, og han drakk te med honning.'],
      ['Но день был о́чень хоро́ший!', 'Men dagen var veldig fin!']
    ],
    quiz: [
      ['Hvor kjøpte Lars billetten?', 'På stasjonen i Moskva', 'På hotellet', 'På Eremitasjen', 'På toget'],
      ['Что не работало в номере?', 'Интернет', 'Телефон', 'Ключ', 'Душ'],
      ['Сколько часов Ларс смотрел картины?', 'Три часа', 'Два часа', 'Пять часов', 'Один час'],
      ['Hva gjorde Lars om kvelden?', 'Drakk te med honning', 'Gikk på kino', 'Spiste borsjtsj', 'Hørte på musikk på toget']
    ]
  },
  {
    id: 'r-baikal', region: 'baikal', icon: '🌊', ru: 'Письмо́ с Байка́ла', no: 'Brev fra Bajkal',
    text: [
      ['Дорога́я О́льга!', 'Kjære Olga!'],
      ['Я пишу́ тебе́ с Байка́ла.', 'Jeg skriver til deg fra Bajkal.'],
      ['Я прие́хал сюда́ на по́езде с дру́гом.', 'Jeg kom hit med tog sammen med en venn.'],
      ['О́зеро о́чень большо́е, а вода́ о́чень чи́стая.', 'Innsjøen er veldig stor, og vannet er veldig rent.'],
      ['Вчера́ мы бы́ли в гостя́х у Ната́льи в Листвя́нке.', 'I går var vi på besøk hos Natalja i Listvjanka.'],
      ['Она́ пригото́вила пельме́ни и борщ. Бы́ло о́чень вку́сно!', 'Hun lagde pelmeni og borsjtsj. Det var veldig godt!'],
      ['Здесь хо́лодно, поэ́тому я купи́л тёплую ку́ртку и ша́пку.', 'Det er kaldt her, så jeg kjøpte en varm jakke og en lue.'],
      ['В суббо́ту мы бу́дем гуля́ть в гора́х.', 'På lørdag skal vi gå tur i fjellet.'],
      ['А в понеде́льник я пое́ду в Ирку́тск.', 'Og på mandag reiser jeg til Irkutsk.'],
      ['Ско́ро я пое́ду домо́й, в Норве́гию.', 'Snart reiser jeg hjem, til Norge.'],
      ['Мне о́чень нра́вится Росси́я! Твой Ларс', 'Jeg liker Russland veldig godt! Hilsen Lars']
    ],
    quiz: [
      ['Как Ларс приехал на Байкал?', 'На поезде', 'На самолёте', 'На машине', 'На автобусе'],
      ['Hva lagde Natalja?', 'Pelmeni og borsjtsj', 'Pizza og suppe', 'Smørbrød og te', 'Fisk og poteter'],
      ['Что Ларс купил?', 'Тёплую куртку и шапку', 'Красную рубашку', 'Новые брюки', 'Ботинки и шапку'],
      ['Hva skal Lars gjøre på mandag?', 'Reise til Irkutsk', 'Gå tur i fjellet', 'Reise hjem til Norge', 'Besøke Natalja']
    ]
  },
  {
    id: 'r-kavkaz', region: 'kavkaz', icon: '🏔️', ru: 'Восхожде́ние на Эльбру́с', no: 'Opp på Elbrus',
    text: [
      ['В пя́тницу Ларс прие́хал из Со́чи в Терско́л.', 'På fredag kom Lars fra Sotsji til Terskol.'],
      ['Там он познако́мился с ги́дом Русла́ном.', 'Der ble han kjent med guiden Ruslan.'],
      ['Русла́н хо́дит в го́ры ка́ждое ле́то, а зимо́й ката́ется на лы́жах.', 'Ruslan går i fjellet hver sommer, og om vinteren står han på ski.'],
      ['В суббо́ту они́ вы́шли из ла́геря в четы́ре часа́ утра́.', 'På lørdag gikk de ut fra leiren klokka fire om morgenen.'],
      ['Снача́ла они́ перешли́ большо́й ледни́к.', 'Først gikk de over en stor isbre.'],
      ['Бы́ло о́чень хо́лодно, но Ларс не жа́ловался.', 'Det var veldig kaldt, men Lars klagde ikke.'],
      ['В оди́ннадцать часо́в они́ пришли́ на верши́ну.', 'Klokka elleve kom de fram til toppen.'],
      ['Ларс сде́лал фо́то и написа́л ма́ме: «Я на Эльбру́се!»', 'Lars tok et bilde og skrev til mamma: «Jeg er på Elbrus!»'],
      ['Ве́чером они́ зашли́ к Тама́ре на у́жин.', 'Om kvelden stakk de innom Tamara til middag.'],
      ['Тама́ра улыба́лась и угоща́ла их хачапу́ри.', 'Tamara smilte og bød dem på khatsjapuri.'],
      ['Ла́рсу о́чень понра́вился Кавка́з.', 'Lars likte Kaukasus veldig godt.']
    ],
    quiz: [
      ['С кем Ларс познакомился в Терсколе?', 'С гидом Русланом', 'С Тамарой', 'С Ольгой', 'С Максимом'],
      ['Во сколько они вышли из лагеря?', 'В четыре часа утра', 'В одиннадцать часов', 'В семь часов вечера', 'В шесть часов утра'],
      ['Hva gjør Ruslan om vinteren?', 'Står på ski', 'Fisker', 'Jobber som kaptein', 'Studerer på universitetet'],
      ['Hva gjorde de om kvelden?', 'Spiste middag hos Tamara', 'Gikk opp på toppen igjen', 'Tok taubanen ned til Sotsji', 'Så på nordlyset']
    ]
  },
  {
    id: 'r-kamchatka', region: 'kamchatka', icon: '🌋', ru: 'Дневни́к с Камча́тки', no: 'Dagbok fra Kamtsjatka',
    text: [
      ['Понеде́льник. Сего́дня я прилете́л на Камча́тку.', 'Mandag. I dag flydde jeg til Kamtsjatka.'],
      ['Отсю́да ви́дно вулка́ны, кото́рые вы́ше, чем го́ры в Норве́гии.', 'Herfra kan man se vulkaner som er høyere enn fjellene i Norge.'],
      ['Вто́рник. Мы лете́ли на вертолёте в Доли́ну ге́йзеров.', 'Tirsdag. Vi fløy med helikopter til Geysirdalen.'],
      ['Е́сли бы пого́да была́ плохо́й, мы бы не полете́ли.', 'Hvis været hadde vært dårlig, hadde vi ikke flydd.'],
      ['Са́мый большо́й ге́йзер был о́чень краси́вый, но там бы́ло мно́го па́ра.', 'Den største geysiren var veldig vakker, men det var mye damp der.'],
      ['Среда́. Мы с Серге́ем лови́ли ры́бу на Кури́льском о́зере.', 'Onsdag. Sergej og jeg fisket på Kurilsjøen.'],
      ['Я пойма́л пять лососе́й!', 'Jeg fikk fem laks!'],
      ['Ря́дом с на́ми медве́ди то́же лови́ли ры́бу.', 'Ved siden av oss fisket bjørnene også.'],
      ['Четве́рг. Я о́чень уста́л, но я сча́стлив.', 'Torsdag. Jeg er veldig sliten, men jeg er lykkelig.'],
      ['Камча́тка – са́мое интере́сное ме́сто, где я был.', 'Kamtsjatka er det mest interessante stedet jeg har vært.']
    ],
    quiz: [
      ['Как Ларс летел в Долину гейзеров?', 'На вертолёте', 'На самолёте', 'На поезде', 'На машине'],
      ['Hva skriver Lars om vulkanene?', 'De er høyere enn fjellene i Norge', 'De er lavere enn fjellene i Norge', 'De er farlige for helikoptre', 'De er like høye som Elbrus'],
      ['Сколько лососей поймал Ларс?', 'Пять', 'Два', 'Десять', 'Ни одного'],
      ['Hvem fisket også ved siden av dem?', 'Bjørner', 'Andre turister', 'Marina', 'Barn fra landsbyen']
    ]
  },
  {
    id: 'r-arktika', region: 'arktika', icon: '❄️', ru: 'Поля́рная ночь', no: 'Polarnatt',
    text: [
      ['В декабре́ в Мурма́нске поля́рная ночь.', 'I desember er det polarnatt i Murmansk.'],
      ['Со́лнце не встаёт со́рок дней, но го́род не спит.', 'Sola står ikke opp på førti dager, men byen sover ikke.'],
      ['Ларс познако́мился с капита́ном Никола́ем, кото́рый рабо́тает на ледоко́ле.', 'Lars ble kjent med kaptein Nikolaj, som jobber på en isbryter.'],
      ['Никола́й сказа́л, что ледоко́лы мо́гут идти́ да́же че́рез то́лстый лёд.', 'Nikolaj sa at isbrytere kan gå selv gjennom tykk is.'],
      ['Пото́м Ларс пое́хал в Терибе́рку, ма́ленькую дере́вню на берегу́ мо́ря.', 'Så dro Lars til Teriberka, en liten landsby ved havet.'],
      ['Но́чью он уви́дел се́верное сия́ние.', 'Om natta så han nordlyset.'],
      ['Его́ подру́га Светла́на сказа́ла: «Возьми́ штати́в и не торопи́сь!»', 'Venninnen hans Svetlana sa: «Ta stativet og ikke stress!»'],
      ['Ларс сде́лал сто фотогра́фий.', 'Lars tok hundre bilder.'],
      ['Е́сли бы у него́ бы́ло бо́льше вре́мени, он бы оста́лся здесь на всю зи́му.', 'Hvis han hadde hatt mer tid, ville han blitt her hele vinteren.'],
      ['Но ма́ма хо́чет, что́бы он верну́лся домо́й до Рождества́.', 'Men mamma vil at han skal komme hjem før jul.'],
      ['От Мурма́нска до грани́цы с Норве́гией совсе́м недалеко́.', 'Fra Murmansk er det ikke langt til grensa mot Norge.']
    ],
    quiz: [
      ['Hva betyr polarnatt i Murmansk?', 'Sola står ikke opp på førti dager', 'Sola går aldri ned', 'Det er nordlys hver natt', 'Byen sover hele vinteren'],
      ['Где работает Николай?', 'На ледоколе', 'В музее', 'В гостинице', 'На границе'],
      ['Что сказала Светлана?', 'Возьми штатив и не торопись!', 'Не забудь фотоаппарат!', 'Иди домой, уже поздно!', 'Посмотри на солнце!'],
      ['Hvorfor blir ikke Lars hele vinteren?', 'Mamma vil at han skal komme hjem før jul', 'Han har ikke flere penger', 'Det er for kaldt i Murmansk', 'Isbryteren drar til Norge']
    ]
  }
];
