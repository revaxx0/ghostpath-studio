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

// Language switcher (EN / TR / JP)
const langs = ['en', 'tr', 'jp'];
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;

  // Update all data-* attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.dataset[lang];
    if (val) {
      el.innerHTML = val;
    }
  });

  // Toggle game description/status
  ['game-desc', 'game-status'].forEach(cls => {
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
  document.querySelectorAll('.lang-en, .lang-tr, .lang-jp').forEach(el => el.classList.remove('active-lang'));
  document.querySelector('.lang-' + lang)?.classList.add('active-lang');

  // Apply JP font when Japanese selected
  document.body.classList.toggle('lang-jp-active', lang === 'jp');
}

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

// Brick parallax scroll
(() => {
  const brickBg = document.querySelector('.brick-bg');
  if (!brickBg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY * 0.15;
        brickBg.style.backgroundPosition = '0 ' + y + 'px';
        ticking = false;
      });
      ticking = true;
    }
  });
})();

