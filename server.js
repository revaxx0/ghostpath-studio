const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const games = [
  {
    id: 'mawbound',
    title: 'Mawbound',
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
