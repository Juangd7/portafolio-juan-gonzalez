/* =========================================================
   JUAN GONZÁLEZ — PORTAFOLIO | JS v3
   ========================================================= */

/* ── THEME ──────────────────────────────────────────────── */
const THEME_KEY = 'jg-theme';

function getTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; }
}

function setTheme(t) {
  try { localStorage.setItem(THEME_KEY, t); } catch {}
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.className = t;

  const dark  = document.getElementById('video-dark');
  const light = document.getElementById('video-light');
  if (dark && light) {
    if (t === 'light') {
      dark.classList.remove('active');
      light.classList.add('active');
    } else {
      light.classList.remove('active');
      dark.classList.add('active');
    }
  }

  const btn = document.querySelector('.btn-theme');
  if (btn) btn.textContent = t === 'dark' ? '☀ Claro' : '☾ Oscuro';
}

function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

/* ── i18n ────────────────────────────────────────────────── */
const LANG_KEY = 'jg-lang';

function getLang() { try { return localStorage.getItem(LANG_KEY) || 'es'; } catch { return 'es'; } }

function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch {}
  document.documentElement.lang = l;
  document.querySelectorAll('[data-es],[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (val) el.textContent = val;
  });
  const btn = document.querySelector('.btn-lang');
  if (btn) btn.textContent = l === 'es' ? 'EN' : 'ES';
}

function toggleLang() { setLang(getLang() === 'es' ? 'en' : 'es'); }

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  const hoverEls = 'a, button, .work-card, .service-card, .filter-btn, .btn-primary, .btn-outline, .btn-dark';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width   = '50px';
      ring.style.height  = '50px';
      ring.style.opacity = '0.9';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width   = '32px';
      ring.style.height  = '32px';
      ring.style.opacity = '0.55';
    });
  });
}

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const selectors = '.reveal, .reveal-left, .reveal-scale';
  const els = document.querySelectorAll(selectors);
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    // Close on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === '/' && (path === '/' || path === '/index.html')) {
      a.classList.add('active');
    } else if (href !== '/' && path.startsWith(href)) {
      a.classList.add('active');
    }
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.style.background = window.scrollY > 60
        ? ''
        : '';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ── PROJECT FILTER ──────────────────────────────────────── */
function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card[data-cat]');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(c => {
        const show = cat === 'all' || c.dataset.cat === cat;
        c.style.display = show ? '' : 'none';
        if (show) c.classList.add('visible');
      });
    });
  });
}

/* ── SMOOTH VIDEO TRANSITION ─────────────────────────────── */
function initVideoTransition() {
  const dark  = document.getElementById('video-dark');
  const light = document.getElementById('video-light');
  if (!dark || !light) return;
  // Preload both
  dark.load();
  light.load();
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTheme(getTheme());
  setLang(getLang());
  initCursor();
  initReveal();
  initNav();
  initFilter();
  initVideoTransition();

  document.getElementById('btn-theme')?.addEventListener('click', toggleTheme);
  document.getElementById('btn-lang')?.addEventListener('click', toggleLang);
});
