const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure all responses use UTF-8 charset
app.use((req, res, next) => {
  res.set('charset', 'utf-8');
  next();
});

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
    descTR: '├çok yak─▒nda.',
    descJP: '×┐æµùÑÕà¼ÚûïÒÇé',
    descRU: 'ºíº║º¥ªÇº¥.',
    fullDescEN: 'Coming soon.',
    fullDescTR: '├çok yak─▒nda.',
    fullDescJP: '×┐æµùÑÕà¼ÚûïÒÇé',
    fullDescRU: 'ºíº║º¥ªÇº¥.',
    releaseDate: 'TBA',
    image: '/images/GhostPath.jpg',
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: '├çok Yak─▒nda',
    statusJP: '×┐æµùÑÕà¼Úûï',
    statusRU: 'ºíº║º¥ªÇº¥',
    extraBadges: [
      { en: 'Multiplayer', tr: '├çok Oyunculu', jp: 'ÒâŞÒâ½ÒâüÒâùÒâ¼Òéñ', ru: 'º£ªâº╗ªîªéº©º┐º╗ºÁºÁªÇ' }
    ],
    chips: [
      { icon: '­şæÑ', en: 'Multiplayer', tr: '├çok Oyunculu', jp: 'ÒâŞÒâ½ÒâüÒâùÒâ¼Òéñ', ru: 'º£ªâº╗ªîªéº©º┐º╗ºÁºÁªÇ' },
      { icon: '­şÄë', en: 'Party Game', tr: 'Parti Oyunu', jp: 'ÒâæÒâ╝ÒâåÒéúÒâ╝Òé▓Òâ╝Òâá', ru: 'ºşº░ªÇªéº©º╣º¢º░ªÅ º©º│ªÇº░' },
      { icon: '­şİ▒', en: 'Horror & Fun', tr: 'Korku & E─şlence', jp: 'ÒâøÒâ®Òâ╝´╝åµÑ¢ÒüùÒüò', ru: 'ºúºÂº░ªü º© º▓ºÁªüºÁº╗ªîºÁ' },
      { icon: '­şñØ', en: 'Teamwork', tr: 'Tak─▒m ├çal─▒┼şmas─▒', jp: 'ÒâüÒâ╝ÒâáÒâ»Òâ╝Òé»', ru: 'ºÜº¥º╝º░º¢º┤º¢º░ªÅ ªÇº░º▒º¥ªéº░' },
      { icon: '­şù║´©Å', en: 'Challenging & Eerie Maps', tr: 'Zorlay─▒c─▒ ve ├£rpertici Haritalar', jp: 'ÚøúÚûóÒüğõ©ıµ░ùÕæ│Òü¬ÒâŞÒââÒâù', ru: 'ºíº╗º¥ºÂº¢ªïºÁ º© ºÂªâªéº║º©ºÁ º║º░ªÇªéªï' }
    ]
  },
  {
    id: 'ghostseries-stay-inside',
    title: 'GhostSeries: Stay Inside',
    tag: 'Horror',
    descEN: 'Coming soon.',
    descTR: '├çok yak─▒nda.',
    descJP: '×┐æµùÑÕà¼ÚûïÒÇé',
    descRU: 'ºíº║º¥ªÇº¥.',
    fullDescEN: 'Coming soon.',
    fullDescTR: '├çok yak─▒nda.',
    fullDescJP: '×┐æµùÑÕà¼ÚûïÒÇé',
    fullDescRU: 'ºíº║º¥ªÇº¥.',
    releaseDate: 'TBA',
    image: '/images/GhostPath.jpg',
    trailer: 'https://www.youtube.com/watch?v=',
    statusEN: 'Coming Soon',
    statusTR: '├çok Yak─▒nda',
    statusJP: '×┐æµùÑÕà¼Úûï',
    statusRU: 'ºíº║º¥ªÇº¥',
    extraBadges: [
      { en: 'Singleplayer', tr: 'Tek Oyuncu', jp: 'ÒéÀÒâ│Òé░Òâ½ÒâùÒâ¼Òéñ', ru: 'ºŞº┤º©º¢º¥ªçº¢º░ªÅ º©º│ªÇº░' },
      { en: 'Horror Story', tr: 'Korku Hikayesi', jp: 'ÒâøÒâ®Òâ╝Òé╣ÒâêÒâ╝Òâ¬Òâ╝', ru: 'ºÑº¥ªÇªÇº¥ªÇ-º©ªüªéº¥ªÇº©ªÅ' }
    ],
    chips: [
      { icon: '­şæü´©Å', en: 'Singleplayer', tr: 'Tek Oyuncu', jp: 'ÒéÀÒâ│Òé░Òâ½ÒâùÒâ¼Òéñ', ru: 'ºŞº┤º©º¢º¥ªçº¢º░ªÅ º©º│ªÇº░' },
      { icon: '­şİ▒', en: 'Horror', tr: 'Korku', jp: 'ÒâøÒâ®Òâ╝', ru: 'ºÑº¥ªÇªÇº¥ªÇ' },
      { icon: '­şôû', en: 'Story-driven', tr: 'Hikaye Odakl─▒', jp: 'Òé╣ÒâêÒâ╝Òâ¬Òâ╝Úçı×Ğû', ru: 'ºíªÄºÂºÁªéº¢º░ªÅ' },
      { icon: '­şî½´©Å', en: 'Atmospheric', tr: 'Atmosferik', jp: 'Úø░Õø▓µ░ùÚçı×Ğû', ru: 'ºÉªéº╝º¥ªüªäºÁªÇº¢º░ªÅ' }
    ]
  }
];

const news = [
  {
    id: 'welcome-001',
    date: '2026-08-20',
    tag: 'Announcement',
    titleEN: 'Welcome to GhostPath Studio',
    titleTR: 'GhostPath Studio\'ya Ho┼ş Geldiniz',
    titleJP: 'GhostPath StudioÒü©ÒéêÒüåÒüôÒüØ',
    titleRU: 'ºöº¥º▒ªÇº¥ º┐º¥ºÂº░º╗º¥º▓º░ªéªî º▓ GhostPath Studio',
    descEN: 'We are an indie game development studio driven by passion, creativity, and the belief that every shadow tells a story. This website was built with our own hands to share our journey with you. We create atmospheric horror experiences where fear meets emotion. If you believe in indie spirit and raw, heartfelt game development ÔÇö support us, follow us, and walk the path with us.',
    descTR: 'Tutku, yarat─▒c─▒l─▒k ve her g├Âlgenin bir hikaye anlatt─▒─ş─▒na dair inan├ğla hareket eden ba─ş─▒ms─▒z bir oyun geli┼ştirme st├╝dyosuyuz. Bu web sitesini sizinle yolculu─şumuzu payla┼şmak i├ğin kendi ellerimizle in┼şa ettik. Korkunun duyguyla bulu┼ştu─şu atmosferik horror deneyimleri yarat─▒yoruz. Ba─ş─▒ms─▒z ruha ve i├ğten, samimi oyun geli┼ştirme s├╝recine inan─▒yorsan─▒z bizi destekleyin, takip edin ve bu yolda bizimle y├╝r├╝y├╝n.',
    descJP: 'µâàå▒ÒÇüÕëÁÚÇáÕèøÒÇüÒüØÒüùÒüĞÒüÖÒü╣ÒüĞÒü«Õ¢▒Òüîë®×¬ŞÒéÆ×¬ŞÒéïÒü¿õ┐íÒüİÒéïğüÒüşÒüíÒüîÚüïÕûÂÒüÖÒéïÒéñÒâ│ÒâçÒéúÒâ╝Òé▓Òâ╝ÒâáÚûïÖ║Òé╣Òé┐Òé©Òé¬ÒüğÒüÖÒÇéÒüôÒü«ÒéĞÒéğÒâûÒéÁÒéñÒâêÒü»ÒÇüÜåµğİÒü¿ğüÒüşÒüíÒü«µ¡®Òü┐ÒéÆÕêåÒüïÒüíÕÉêÒüåÒüşÒéüÒü½ÒÇü×ç¬ÒéëÒü«µëïÒüğõ¢£Òéèõ©èÒüÆÒü¥ÒüùÒüşÒÇéµüÉµÇûÒü¿µäşµâàÒüî×ŞıÕÉêÒüÖÒéïÒéóÒâêÒâóÒé╣ÒâòÒéğÒéóÒâ¬ÒââÒé»Òü¬ÒâøÒâ®Òâ╝Òé¿Òé»Òé╣ÒâÜÒâ¬Òé¿Òâ│Òé╣ÒéÆÕëÁÚÇáÒüùÒüĞÒüäÒü¥ÒüÖÒÇéÒéñÒâ│ÒâçÒéúÒâ╝Òé╣ÒâöÒâ¬ÒââÒâêÒü¿Õ┐âÒü«ÒüôÒééÒüúÒüşÒé▓Òâ╝ÒâáÚûïÖ║ÒéÆõ┐íÒüİÒéïµû╣Òü»ÒÇüğüÒüşÒüíÒéÆÕ┐£µÅ┤ÒüùÒÇüÒâòÒé®Òâ¡Òâ╝ÒüùÒÇüÕà▒Òü½ÒüôÒü«ÚüôÒéÆµ¡®ÒéôÒüğÒüÅÒüáÒüòÒüäÒÇé',
    descRU: 'º£ªï ÔÇö ªüªéªâº┤º©ªÅ º©º¢º┤º©-ªÇº░ºÀªÇº░º▒º¥ªéº║º© º©º│ªÇ, º┤º▓º©ºÂº©º╝º░ªÅ ªüªéªÇº░ªüªéªîªÄ, ªéº▓º¥ªÇªçºÁªüªéº▓º¥º╝ º© º▓ºÁªÇº¥º╣ º▓ ªéº¥, ªçªéº¥ º║º░ºÂº┤º░ªÅ ªéºÁº¢ªî ªÇº░ªüªüº║º░ºÀªïº▓º░ºÁªé ªüº▓º¥ªÄ º©ªüªéº¥ªÇº©ªÄ. º¡ªéº¥ªé ªüº░º╣ªé ªüº¥ºÀº┤º░º¢ º¢º░ªêº©º╝º© ªüº¥º▒ªüªéº▓ºÁº¢º¢ªïº╝º© ªÇªâº║º░º╝º©, ªçªéº¥º▒ªï º┐º¥º┤ºÁº╗º©ªéªîªüªÅ ªü º▓º░º╝º© º¢º░ªêº©º╝ º┐ªâªéªæº╝. º£ªï ªüº¥ºÀº┤º░ªæº╝ º░ªéº╝º¥ªüªäºÁªÇº¢ªïºÁ ªàº¥ªÇªÇº¥ªÇ-º┐ºÁªÇºÁºÂº©º▓º░º¢º©ªÅ, º│º┤ºÁ ªüªéªÇº░ªà º▓ªüªéªÇºÁªçº░ºÁªéªüªÅ ªü ªıº╝º¥ªåº©ºÁº╣. ºòªüº╗º© º▓ªï º▓ºÁªÇº©ªéºÁ º▓ º©º¢º┤º©-º┤ªâªà º© º©ªüº║ªÇºÁº¢º¢ªÄªÄ, heartfelt ªÇº░ºÀªÇº░º▒º¥ªéº║ªâ º©º│ªÇ ÔÇö º┐º¥º┤º┤ºÁªÇºÂº©ªéºÁ º¢º░ªü, ªüº╗ºÁº┤º©ªéºÁ ºÀº░ º¢º░º╝º© º© º©º┤º©ªéºÁ ªıªéº©º╝ º┐ªâªéªæº╝ º▓º╝ºÁªüªéºÁ ªü º¢º░º╝º©.'
  }
];

app.get('/', (req, res) => {
  res.render('index', {
    title: 'GhostPath Studio ÔÇö Indie Game Studio',
    currentPage: 'home',
    games,
    news
  });
});

app.get('/news', (req, res) => {
  res.render('news', {
    title: 'News & Updates ÔÇö GhostPath Studio',
    currentPage: 'news',
    news
  });
});

app.get('/api/news', (req, res) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.json(news.map((item, i) => ({
    id: item.id || i,
    date: item.date,
    tag: item.tag,
    titleEN: item.titleEN,
    titleTR: item.titleTR,
    titleJP: item.titleJP,
    titleRU: item.titleRU,
    descEN: item.descEN,
    descTR: item.descTR,
    descJP: item.descJP,
    descRU: item.descRU
  })));
});

app.get('/api/news/:id', (req, res) => {
  const item = news.find(n => String(n.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.json({
    id: item.id,
    date: item.date,
    tag: item.tag,
    titleEN: item.titleEN,
    titleTR: item.titleTR,
    titleJP: item.titleJP,
    titleRU: item.titleRU,
    descEN: item.descEN,
    descTR: item.descTR,
    descJP: item.descJP,
    descRU: item.descRU
  });
});

app.get('/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.redirect('/');
  res.render('game', {
    title: game.title + ' ÔÇö GhostPath Studio',
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
