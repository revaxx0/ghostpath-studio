// Sound effects using Web Audio API
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration, volume, type) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = volume || 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playClick() {
  playTone(900, 0.06, 0.06, 'square');
}

function playHover() {
  playTone(500, 0.04, 0.03, 'sine');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (anchor.closest('.nav-menu')) return;
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Language switcher (EN / TR / JP / RU)
const langs = ['en', 'tr', 'jp', 'ru'];
let currentLang = 'en';

function setLang(lang, persist) {
  currentLang = lang;
  if (persist !== false) {
    try { sessionStorage.setItem('ghostpath-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.dataset[lang];
    if (val) {
      el.innerHTML = val;
    }
  });

  ['game-desc', 'game-status', 'game-detail-desc', 'game-detail-status'].forEach(cls => {
    document.querySelectorAll('[class*="' + cls + '-"]').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.' + cls + '-' + lang).forEach(el => {
      el.style.display = '';
    });
  });

  document.querySelectorAll('[class^="about-text-"]').forEach(el => {
    el.style.display = 'none';
  });
  const aboutEl = document.querySelector('.about-text-' + lang);
  if (aboutEl) aboutEl.style.display = '';

  document.querySelectorAll('.lang-en, .lang-tr, .lang-jp, .lang-ru').forEach(el => el.classList.remove('active-lang'));
  document.querySelectorAll('.lang-' + lang).forEach(el => el.classList.add('active-lang'));

  document.body.classList.toggle('lang-jp-active', lang === 'jp');
}

try {
  const saved = sessionStorage.getItem('ghostpath-lang');
  if (saved && langs.includes(saved)) {
    setLang(saved, false);
  }
} catch (e) {}

document.querySelectorAll('.lang-item').forEach(el => {
  el.addEventListener('click', () => setLang(el.dataset.lang));
});

// Mobile menu
(() => {
  const toggle = document.getElementById('menuToggle');
  const backdrop = document.getElementById('menuBackdrop');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const setMenu = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setMenu(!document.body.classList.contains('nav-open'));
    playClick();
  });

  backdrop?.addEventListener('click', () => setMenu(false));

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      setMenu(false);
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 330);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });
})();

// Interactive sounds
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a, button, .btn, .btn-primary, .btn-ghost, .nav-cta, .lang-toggle, .theme-toggle, .badge, .feature-chip, .role-badge').forEach(el => {
    el.addEventListener('click', playClick);
    el.addEventListener('mouseenter', playHover);
  });

  document.querySelectorAll('.nav-links a, .stat, .contact-card, .footer-links a, .footer-social a, .founder-card, .value-item, .media-stat, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', playHover);
  });
});

// Twinkling stars across the entire page
(() => {
  const container = document.getElementById('starsCanvas');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  const colors = [
    '255, 70, 60',
    '200, 60, 40',
    '255, 120, 80',
    '180, 90, 255',
    '140, 70, 220',
    '255, 100, 150'
  ];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((w * h) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() / 1000;
    stars.forEach(s => {
      const glow = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
      const alpha = s.baseAlpha * glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
      ctx.fill();

      if (glow > 0.7) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha * 0.12})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize();
  createStars();
  draw();
})();

// Rising embers in the hero
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, embers = [];

  const resize = () => {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  };

  const spawn = () => {
    embers = [];
    const count = Math.floor(w / 60);
    for (let i = 0; i < count; i++) {
      embers.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.8,
        vy: -(Math.random() * 0.6 + 0.25),
        vx: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() / 1000;
    embers.forEach(p => {
      p.x += p.vx + Math.sin(time * p.speed + p.phase) * 0.3;
      p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const flicker = 0.6 + 0.4 * Math.sin(time * 3 + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${80 + Math.floor(40 * flicker)}, 50, ${p.alpha * flicker})`;
      ctx.shadowColor = 'rgba(255, 90, 50, 0.9)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(tick);
  };

  window.addEventListener('resize', () => { resize(); spawn(); });
  resize();
  spawn();
  tick();
})();

// Scroll reveal animations
(() => {
  const sections = document.querySelectorAll('section:not(.hero)');

  if (!('IntersectionObserver' in window)) {
    sections.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(el => observer.observe(el));
})();

// Header shadow on scroll
(() => {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 3D tilt on featured media
(() => {
  const tiltables = document.querySelectorAll('.tilt');
  if (!tiltables.length) return;

  tiltables.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    });
  });
})();

// Theme toggle
(() => {
  const btns = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;

  const applyIcons = () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    document.querySelectorAll('.theme-icon-dark').forEach(i => {
      i.style.display = isLight ? 'none' : '';
    });
    document.querySelectorAll('.theme-icon-light').forEach(i => {
      i.style.display = isLight ? '' : 'none';
    });
  };

  const saved = localStorage.getItem('ghostpath-theme');
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
  }
  applyIcons();

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem('ghostpath-theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('ghostpath-theme', 'light');
      }
      applyIcons();
    });
  });
})();

// Lightbox
(() => {
  const overlay = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!overlay || !img) return;

  document.querySelectorAll('.gallery-item img').forEach(el => {
    el.addEventListener('click', () => {
      img.src = el.src;
      img.alt = el.alt;
      overlay.classList.add('active');
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('active');
  });
})();

// Game carousel
(() => {
  const track = document.getElementById('gameTrack');
  const prevBtn = document.getElementById('gamePrev');
  const nextBtn = document.getElementById('gameNext');
  const dotsWrap = document.getElementById('gameDots');
  if (!track) return;

  const slides = track.querySelectorAll('.feature-slide');
  const dots = dotsWrap ? dotsWrap.querySelectorAll('.carousel-dot') : [];
  let current = 0;
  let autoTimer;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { playClick(); goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { playClick(); goTo(current + 1); resetAuto(); });

  dots.forEach(d => {
    d.addEventListener('click', () => { playClick(); goTo(parseInt(d.dataset.slide)); resetAuto(); });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });

  resetAuto();
})();
