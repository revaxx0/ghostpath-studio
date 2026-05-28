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

  // Update all data-* attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.dataset[lang];
    if (val) {
      el.innerHTML = val;
    }
  });

  // Toggle game description/status
  ['game-desc', 'game-status', 'game-detail-desc', 'game-detail-status'].forEach(cls => {
    document.querySelectorAll('[class*="' + cls + '-"]').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.' + cls + '-' + lang).forEach(el => {
      el.style.display = '';
    });
  });

  // Toggle about text blocks
  document.querySelectorAll('[class^="about-text-"]').forEach(el => {
    el.style.display = 'none';
  });
  const aboutEl = document.querySelector('.about-text-' + lang);
  if (aboutEl) aboutEl.style.display = '';

  // Update toggle UI
  document.querySelectorAll('.lang-en, .lang-tr, .lang-jp, .lang-ru').forEach(el => el.classList.remove('active-lang'));
  document.querySelector('.lang-' + lang)?.classList.add('active-lang');

  // Apply JP font when Japanese selected
  document.body.classList.toggle('lang-jp-active', lang === 'jp');
}

// Restore language from sessionStorage on page load
try {
  const saved = sessionStorage.getItem('ghostpath-lang');
  if (saved && langs.includes(saved)) {
    setLang(saved, false);
  }
} catch (e) {}

document.getElementById('langToggle')?.addEventListener('click', () => {
  const idx = langs.indexOf(currentLang);
  const next = langs[(idx + 1) % langs.length];
  setLang(next);
});

// Interactive sounds
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a, button, .btn, .btn-primary, .btn-outline, .nav-cta, .lang-toggle, .btn-trailer').forEach(el => {
    el.addEventListener('click', playClick);
    el.addEventListener('mouseenter', playHover);
  });

  document.querySelectorAll('.nav-links a, .game-card, .stat, .contact-card, .footer-links a, .footer-social a, .founder-card, .value-item').forEach(el => {
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
    '255, 60, 60',
    '200, 50, 50',
    '180, 80, 255',
    '140, 60, 220',
    '80, 140, 255',
    '120, 180, 255',
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

// Scroll reveal animations
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  // Observe all sections and game cards
  document.querySelectorAll('section, .game-card').forEach(el => {
    observer.observe(el);
  });
})();

// Theme toggle
(() => {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const iconDark = btn?.querySelector('.theme-icon-dark');
  const iconLight = btn?.querySelector('.theme-icon-light');

  // Load saved theme
  const saved = localStorage.getItem('ghostpath-theme');
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
    if (iconDark) iconDark.style.display = 'none';
    if (iconLight) iconLight.style.display = '';
  }

  btn?.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('ghostpath-theme', 'dark');
      if (iconDark) iconDark.style.display = '';
      if (iconLight) iconLight.style.display = 'none';
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('ghostpath-theme', 'light');
      if (iconDark) iconDark.style.display = 'none';
      if (iconLight) iconLight.style.display = '';
    }
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

