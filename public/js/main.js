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

// Mobile menu toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
  playClick();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
    document.querySelector('.nav-links')?.classList.remove('open');
  });
});

// Language switcher
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    if (lang === 'en' && el.dataset.en) {
      el.innerHTML = el.dataset.en;
    } else if (lang === 'tr' && el.dataset.tr) {
      el.innerHTML = el.dataset.tr;
    }
  });

  document.querySelectorAll('.game-desc-en, .game-desc-tr').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.game-status, .game-status-tr').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.game-desc-' + lang).forEach(el => {
    el.style.display = '';
  });
  document.querySelectorAll('.game-status' + (lang === 'tr' ? '-tr' : '')).forEach(el => {
    el.style.display = '';
  });

  document.querySelectorAll('.about-text-en, .about-text-tr').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelector('.about-text-' + lang).style.display = '';

  document.querySelectorAll('.lang-en, .lang-tr').forEach(el => el.classList.remove('active-lang'));
  document.querySelector('.lang-' + lang)?.classList.add('active-lang');
}

document.getElementById('langToggle')?.addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'tr' : 'en');
});

// Interactive sounds for all clickable and hoverable elements
document.addEventListener('DOMContentLoaded', () => {
  // Add click sounds
  document.querySelectorAll('a, button, .btn, .btn-primary, .btn-outline, .nav-cta, .lang-toggle, .menu-toggle, .btn-trailer').forEach(el => {
    el.addEventListener('click', playClick);
    el.addEventListener('mouseenter', playHover);
  });

  // Hover for all nav-links, game cards, stat cards, contact cards, footer links, social links
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
