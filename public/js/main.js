document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

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
