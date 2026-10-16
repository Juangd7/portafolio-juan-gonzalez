/* =========================================================
   JUAN GONZÁLEZ — PORTAFOLIO | JS PRINCIPAL
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
  // Switch hero videos
  const dark = document.getElementById('video-dark');
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
  // Update btn text
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
    el.textContent = el.getAttribute('data-' + l) || el.textContent;
  });
  const btn = document.querySelector('.btn-lang');
  if (btn) btn.textContent = l === 'es' ? 'EN' : 'ES';
}
function toggleLang() { setLang(getLang() === 'es' ? 'en' : 'es'); }

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function loop() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a,button,.work-card,.service-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '48px'; ring.style.height = '48px'; ring.style.opacity = '1'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.opacity = '0.6'; });
  });
}

/* ── FTB CANVAS ──────────────────────────────────────────── */
function initFTB() {
  const canvas = document.getElementById('ftb-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const isDark = () => getTheme() !== 'light';
  const accent = () => isDark() ? '#FFED00' : '#662483';

  // Ring particles
  const N = 120;
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const radius = Math.min(W, H) * 0.38;
    particles.push({
      angle,
      radius: radius + (Math.random() - 0.5) * 30,
      speed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
    });
  }

  let rot = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    rot += 0.002;
    const cx = W / 2, cy = H / 2;
    const col = accent();
    particles.forEach(p => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle + rot) * p.radius;
      const y = cy + Math.sin(p.angle + rot) * (p.radius * 0.28);
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Text
    ctx.font = `900 ${Math.min(W * 0.08, 72)}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.12;
    ctx.fillText('JUAN GONZÁLEZ', cx, cy);
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── BIO PARTICLES ───────────────────────────────────────── */
function initBioParticles() {
  const canvas = document.getElementById('bio-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const isDark = () => getTheme() !== 'light';
  const pepitas = Array.from({length: 60}, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0008,
    vy: (Math.random() - 0.5) * 0.0008,
    r: Math.random() * 4 + 2,
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = isDark() ? '#FFED00' : '#662483';
    pepitas.forEach(p => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ── NAV MOBILE ──────────────────────────────────────────── */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  // Highlight active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/') {
      a.classList.add('active');
    } else if (a.getAttribute('href') === '/' && (path === '/' || path === '/index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── PROJECT FILTER ──────────────────────────────────────── */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card[data-cat]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Enviando…'; btn.disabled = true;
    // Formspree endpoint — replace XXXXXXXX with real ID
    const res = await fetch('https://formspree.io/f/XXXXXXXX', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    }).catch(() => ({ ok: false }));
    if (res.ok) {
      form.innerHTML = '<p style="text-align:center;padding:3rem;font-size:1.2rem;color:var(--accent)">✓ Mensaje enviado. Te responderé pronto.</p>';
    } else {
      btn.textContent = 'Error — intenta de nuevo'; btn.disabled = false;
    }
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTheme(getTheme());
  setLang(getLang());
  initCursor();
  initFTB();
  initBioParticles();
  initReveal();
  initNav();
  initFilter();
  initForm();

  document.querySelector('.btn-theme')?.addEventListener('click', toggleTheme);
  document.querySelector('.btn-lang')?.addEventListener('click', toggleLang);
});
