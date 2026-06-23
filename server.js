const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const games = [
  {
    id: 'signal-zero',
    title: 'Signal Zero',
    tag: 'Psychological Horror',
    descEN: 'A 4-6 player online co-op horror experience aboard the abandoned EREBUS-7 station.',
    descTR: 'Terk edilmiş EREBUS-7 istasyonunda geçen 4-6 oyunculu çevrimiçi ortak korku deneyimi.',
    descJP: '廃棄されたEREBUS-7基地を舞台にした4～6人オンライン協力ホラー。',
    descRU: 'Многопользовательский хоррор на 4–6 игроков на заброшенной станции EREBUS-7.',
    fullDescEN: 'SIGNAL ZERO is a 4-6 player online co-op horror experience set aboard the abandoned EREBUS-7 station.\n\nRestore power, survive dimensional anomalies, and escape before "THE RIFT" pulls your crew into the ghost dimension. Every sound matters. Every role is essential. And sometimes... the voice on the radio isn\'t your teammate.\n\nWork together to activate critical systems, rescue lost crew members, and reach the escape pod before the station consumes everyone.\n\nNo weapons. No heroes. Just panic, teamwork, and the dark.',
    fullDescTR: 'SIGNAL ZERO, terk edilmiş EREBUS-7 istasyonunda geçen 4-6 oyunculu çevrimiçi ortak korku deneyimidir.\n\nEnerjiyi geri yükleyin, boyutsal anormalliklerden sağ çıkın ve "THE RIFT" ekibinizi hayalet boyutuna çekmeden kaçın. Her ses önemlidir. Her rol hayatidir. Ve bazen... radyodaki ses takım arkadaşınıza ait değildir.\n\nKritik sistemleri aktive etmek, kayıp ekip üyelerini kurtarmak ve istasyon herkesi yutmadan kaçış kapsülüne ulaşmak için birlikte çalışın.\n\nSilah yok. Kahraman yok. Sadece panik, takım çalışması ve karanlık.',
    fullDescJP: 'SIGNAL ZEROは、廃棄されたEREBUS-7基地を舞台にした4～6人オンライン協力ホラーゲームです。\n\n電力を復旧し、次元異常を生き延び、「THE RIFT」があなたのクルーをゴースト次元に引きずり込む前に脱出せよ。すべての音が重要だ。すべての役割が不可欠だ。そして時々…無線の声はチームメイトのものではない。\n\n重要なシステムを起動し、行方不明のクルーを救出し、基地がすべてを飲み込む前に脱出ポッドへ到達せよ。\n\n武器なし。ヒーローなし。ただパニック、チームワーク、そして暗闇だけがそこにある。',
    fullDescRU: 'SIGNAL ZERO — это многопользовательский кооперативный хоррор на 4–6 игроков, действие которого разворачивается на заброшенной станции EREBUS-7.\n\nВосстановите питание, переживите пространственные аномалии и бегите, прежде чем «РАЗЛОМ» затянет ваш экипаж в призрачное измерение. Каждый звук имеет значение. Каждая роль важна. И иногда... голос в рации — это не ваш товарищ.\n\nРаботайте вместе, чтобы активировать критически важные системы, спасти потерянных членов экипажа и добраться до спасательной капсулы, прежде чем станция поглотит всех.\n\nНикакого оружия. Никаких героев. Только паника, командная работа и тьма.',
    releaseDate: 'TBA',
    image: '/images/SignalZero.jpg',
    gallery: ['/images/SignalZero.jpg'],
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開',
    statusRU: 'Скоро'
  },
  {
    id: 'backrooms-fractured-realities',
    title: 'Backrooms: Fractured Realities',
    tag: 'Survival Horror',
    descEN: 'Reality is breaking apart. Your memory is betraying you. And the only thing more dangerous than what lurks in the dark… is the noise you make.',
    descTR: 'Gerçeklik parçalanıyor. Hafızan sana ihanet ediyor. Ve karanlıkta pusuda bekleyenden daha tehlikeli olan tek şey… çıkardığın gürültüdür.',
    descJP: '現実が崩壊する。記憶が君を裏切る。暗闇に潜むものよりも危険なのは…君が立てる音だ。',
    descRU: 'Реальность рушится. Память предаёт тебя. И единственное, что опаснее того, что таится в темноте... это шум, который ты издаёшь.',
    fullDescEN: 'Reality is breaking apart. Your memory is betraying you. And the only thing more dangerous than what lurks in the dark... is the noise you make.\n\nBackrooms: Fractured Realities is a first-person psychological survival horror experience that reimagines the internet\'s most iconic liminal nightmare with deeper mechanics, immersive tension, and reality-warping fear unlike anything you\'ve experienced before.\n\nAre you ready to go beyond the yellow walls?',
    fullDescTR: 'Gerçeklik parçalanıyor. Hafızan sana ihanet ediyor. Ve karanlıkta pusuda bekleyenden daha tehlikeli olan tek şey... çıkardığın gürültüdür.\n\nBackrooms: Fractured Realities, internetin en ikonik liminal kabusunu daha derin mekanikler, sürükleyici gerilim ve daha önce deneyimlemediğiniz gerçeklik bükücü korkuyla yeniden hayal eden birinci şahıs psikolojik hayatta kalma korku deneyimidir.\n\nSarı duvarların ötesine geçmeye hazır mısın?',
    fullDescJP: '現実が崩壊する。記憶が君を裏切る。暗闇に潜むものよりも危険なのは...君が立てる音だ。\n\nBackrooms: Fractured Realitiesは、インターネットで最も象徴的なリミナル・ナイトメアを、より深いゲームメカニクス、没入感あふれる緊張、そしてかつてない現実歪曲の恐怖で再構築した、一人称視点の心理的サバイバルホラー体験です。\n\n黄色い壁の向こうへ進む覚悟はあるか？',
    fullDescRU: 'Реальность рушится. Память предаёт тебя. И единственное, что опаснее того, что таится в темноте... это шум, который ты издаёшь.\n\nBackrooms: Fractured Realities — это психологический хоррор на выживание от первого лица, который переосмысляет самый культовый лиминальный кошмар интернета с более глубокими механиками, захватывающим напряжением и искажающей реальность жутью, не похожей ни на что, что вы испытывали раньше.\n\nГотовы ли вы выйти за жёлтые стены?',
    releaseDate: 'TBA',
    image: '/images/BackroomsGameİmage.jpg',
    gallery: ['/images/BackroomsGameİmage.jpg'],
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開',
    statusRU: 'Скоро'
  },
  {
    id: 'dead-signal',
    title: 'Dead Signal',
    tag: 'Horror',
    descEN: 'Coming soon.',
    descTR: 'Çok yakında.',
    descJP: '近日公開。',
    descRU: 'Скоро.',
    fullDescEN: 'Coming soon.',
    fullDescTR: 'Çok yakında.',
    fullDescJP: '近日公開。',
    fullDescRU: 'Скоро.',
    releaseDate: 'TBA',
    image: '/images/GhostPath.jpg',
    gallery: ['/images/GhostPath.jpg'],
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開',
    statusRU: 'Скоро'
  }
];

const news = [];

app.get('/', (req, res) => {
  res.render('index', {
    title: 'GhostPath Studio — Indie Game Studio',
    currentPage: 'home',
    games,
    news
  });
});

app.get('/news', (req, res) => {
  res.render('news', {
    title: 'News & Updates — GhostPath Studio',
    currentPage: 'news',
    news
  });
});

app.get('/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.redirect('/');
  res.render('game', {
    title: game.title + ' — GhostPath Studio',
    currentPage: 'games',
    game
  });
});

app.listen(PORT, () => {
  console.log(`GhostPath Studio running at http://localhost:${PORT}`);
});
