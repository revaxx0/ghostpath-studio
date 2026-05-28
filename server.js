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
    descEN: 'A haunting psychological horror experience set in a world of static and silence.',
    descTR: 'Statik ve sessizlik dünyasında geçen ürkütücü bir psikolojik korku deneyimi.',
    descJP: '静寂とノイズの世界を舞台にした不気味なサイコロジカルホラー。',
    fullDescEN: 'Signal Zero is a first-person psychological horror game that plunges you into a world where reality and static collide. Explore abandoned frequencies, decode cryptic messages, and uncover the truth behind the signal. Every sound could be a clue — or a warning.',
    fullDescTR: 'Signal Zero, gerçeklik ve statik çarpışmasında geçen birinci şahıs psikolojik korku oyunudur. Terk edilmiş frekansları keşfedin, gizemli mesajları çözün ve sinyalin ardındaki gerçeği ortaya çıkarın. Her ses bir ipucu — ya da bir uyarı olabilir.',
    fullDescJP: 'Signal Zeroは、現実とノイズが衝突する世界に没入する一人称視点のサイコロジカルホラー。廃墟となった周波数を探索し、暗号メッセージを解読し、信号の背後にある真実を明らかにせよ。',
    releaseDate: 'TBA',
    image: '/images/SignalZero.jpg',
    gallery: ['/images/SignalZero.jpg'],
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開'
  },
  {
    id: 'backrooms-fractured-realities',
    title: 'Backrooms: Fractured Realities',
    tag: 'Survival Horror',
    descEN: 'A survival horror experience in the endless, decaying halls of the Backrooms.',
    descTR: 'Backrooms\'un sonsuz çürüyen koridorlarında geçen bir hayatta kalma korku oyunu.',
    descJP: 'バックルームの無限に広がる腐敗した廊下を舞台にしたサバイバルホラー。',
    fullDescEN: 'Backrooms: Fractured Realities is a survival horror game set in the infinite, liminal spaces of the Backrooms. Navigate shifting corridors, evade entities that lurk in the dark, and piece together how you ended up here. Reality is broken — and you are trapped within the fracture.',
    fullDescTR: 'Backrooms: Fractured Realities, Backrooms\'un sonsuz geçiş alanlarında geçen bir hayatta kalma korku oyunudur. Değişen koridorlarda ilerleyin, karanlıkta pusuya yatan varlıklardan kaçın ve buraya nasıl geldiğinizi keşfedin. Gerçeklik kırıldı — ve siz çatlağın içinde hapsoldunuz.',
    fullDescJP: 'Backrooms: Fractured Realitiesは、バックルームの無限のリミナルスペースを舞台にしたサバイバルホラー。移り変わる廊下を進み、暗闇に潜む存在から逃れ、ここに至った経緯を解き明かせ。',
    releaseDate: 'TBA',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop'],
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開'
  }
];

const news = [];

app.get('/', (req, res) => {
  res.render('index', {
    title: 'GhostPath Studio — Indie Horror Game Studio',
    currentPage: 'home',
    games,
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
