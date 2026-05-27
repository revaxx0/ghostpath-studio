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
    descEN: 'Coming soon',
    descTR: 'Çok yakında',
    image: '/images/SignalZero.jpg',
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında'
  },
  {
    id: 'backrooms-fractured-realities',
    title: 'Backrooms: Fractured Realities',
    tag: 'Survival Horror',
    descEN: 'Coming soon',
    descTR: 'Çok yakında',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında'
  }
];

app.get('/', (req, res) => {
  res.render('index', {
    title: 'GhostPath Studio — Indie Horror Game Studio',
    currentPage: 'home',
    games
  });
});

app.listen(PORT, () => {
  console.log(`GhostPath Studio running at http://localhost:${PORT}`);
});
