const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==================== SECURITY ====================

// Content-Security-Policy
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-src https://www.youtube.com https://player.vimeo.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': CSP,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  next();
});

// Request payload cap (prevents oversized-body abuse)
app.use(express.json({ limit: '10kb' }));

// Basic WAF: block obvious attack signatures in URLs / query strings
const ATTACK_PATTERN = /(\%00)|(\.\.\/|\.\.%2f)|(<\s*script)|(javascript\s*:)|(on(load|error|click|mouseover|focus|submit)\s*=)|(<\s*iframe)|(<\s*object)|((\%27)|(\%22))|(\b(union|select|insert|update|delete|drop|alter|create|exec|xp_cmdshell|declare|waitfor|sleep)\b)|(\b\d+\s+or\s+1\s*=\s*1)|(\b\-\-\s)/i;

app.use((req, res, next) => {
  let haystack = req.originalUrl;
  try { haystack = decodeURIComponent(req.originalUrl); } catch (e) {}
  if (ATTACK_PATTERN.test(haystack)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// Simple in-memory rate limiter
const rateBuckets = new Map();

function rateLimit(windowMs, max) {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    let bucket = rateBuckets.get(key);
    if (!bucket || now - bucket.start > windowMs) {
      bucket = { start: now, count: 0 };
      rateBuckets.set(key, bucket);
    }
    bucket.count += 1;
    res.set('RateLimit-Limit', String(max));
    res.set('RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    if (bucket.count > max) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
}

setInterval(() => {
  const now = Date.now();
  rateBuckets.forEach((bucket, key) => {
    if (now - bucket.start > 60 * 1000) rateBuckets.delete(key);
  });
}, 60 * 1000);

app.use(rateLimit(60 * 1000, 600));

// ==================== ROUTES ====================

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
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開',
    statusRU: 'Скоро',
    extraBadges: [
      { en: 'Multiplayer', tr: 'Çok Oyunculu', jp: 'マルチプレイ', ru: 'Мультиплеер' }
    ],
    chips: [
      { icon: '👥', en: 'Multiplayer', tr: 'Çok Oyunculu', jp: 'マルチプレイ', ru: 'Мультиплеер' },
      { icon: '🎉', en: 'Party Game', tr: 'Parti Oyunu', jp: 'パーティーゲーム', ru: 'Партийная игра' },
      { icon: '😱', en: 'Horror & Fun', tr: 'Korku & Eğlence', jp: 'ホラー＆楽しさ', ru: 'Ужас и веселье' },
      { icon: '🤝', en: 'Teamwork', tr: 'Takım Çalışması', jp: 'チームワーク', ru: 'Командная работа' },
      { icon: '🗺️', en: 'Challenging & Eerie Maps', tr: 'Zorlayıcı ve Ürpertici Haritalar', jp: '難関で不気味なマップ', ru: 'Сложные и жуткие карты' }
    ]
  },
  {
    id: 'ghostseries-stay-inside',
    title: 'GhostSeries: Stay Inside',
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
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: 'Çok Yakında',
    statusJP: '近日公開',
    statusRU: 'Скоро',
    extraBadges: [
      { en: 'Singleplayer', tr: 'Tek Oyuncu', jp: 'シングルプレイ', ru: 'Одиночная игра' },
      { en: 'Horror Story', tr: 'Korku Hikayesi', jp: 'ホラーストーリー', ru: 'Хоррор-история' }
    ],
    chips: [
      { icon: '👁️', en: 'Singleplayer', tr: 'Tek Oyuncu', jp: 'シングルプレイ', ru: 'Одиночная игра' },
      { icon: '😱', en: 'Horror', tr: 'Korku', jp: 'ホラー', ru: 'Хоррор' },
      { icon: '📖', en: 'Story-driven', tr: 'Hikaye Odaklı', jp: 'ストーリー重視', ru: 'Сюжетная' },
      { icon: '🌫️', en: 'Atmospheric', tr: 'Atmosferik', jp: '雰囲気重視', ru: 'Атмосферная' }
    ]
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

// Generic error handler: never leak internals
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`GhostPath Studio running at http://localhost:${PORT}`);
});
