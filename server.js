const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Live visitor counter ----
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'visitors.json');
const ONLINE_WINDOW = 5 * 60 * 1000;
const COOKIE_NAME = 'gp_visit';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

let visitors = { total: 0 };
try {
  const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (typeof parsed.total === 'number') visitors.total = parsed.total;
} catch (e) {}

function saveVisitors() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(visitors));
  } catch (e) {}
}

const online = new Map();

function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie;
  if (!header) return out;
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > -1) out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

function setCookie(res, value) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Max-Age=${Math.floor(COOKIE_MAX_AGE / 1000)}; SameSite=Lax`);
}

function onlineCount() {
  const now = Date.now();
  let count = 0;
  online.forEach(lastSeen => {
    if (now - lastSeen <= ONLINE_WINDOW) count += 1;
  });
  return count;
}

app.use((req, res, next) => {
  let token = parseCookies(req)[COOKIE_NAME];
  if (!token) {
    token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    visitors.total += 1;
    saveVisitors();
    setCookie(res, token);
  }
  online.set(token, Date.now());
  next();
});

setInterval(() => {
  const now = Date.now();
  online.forEach((lastSeen, token) => {
    if (now - lastSeen > ONLINE_WINDOW) online.delete(token);
  });
}, 60 * 1000);

app.get('/api/visitors', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ total: visitors.total, online: onlineCount() });
});

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
