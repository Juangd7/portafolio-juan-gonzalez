/* =============================================
   JUAN GONZÁLEZ — PORTAFOLIO v3
   main.js
   ============================================= */

(function () {
  'use strict';

  /* ── TEMA (dark-only) ──────────────────────── */
  function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    try { localStorage.removeItem('jg-theme'); } catch {}
  }

  /* ── CURSOR ────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => { mx = -200; my = -200; });
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    function tick() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── REVEAL ────────────────────────────────── */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => io.observe(el));
  }

  /* ── NAVBAR ────────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    // Scroll effect
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // Active link
    const path = location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const href = link.getAttribute('href').replace(/\/+$/, '') || '/';
      if (href === path) link.classList.add('active');
    });
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', open);
      });
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
    // Dropdown disciplinas (desktop)
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      toggle.addEventListener('click', () => dropdown.classList.toggle('open'));
      toggle.addEventListener('keydown', e => {
        if (e.key === 'Escape') dropdown.classList.remove('open');
      });
      document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
      });
    }
  }

  /* ── VIDEO HERO (dark-only) ────────────────── */
  function initVideo() {
    const vd = document.getElementById('video-dark');
    if (!vd) return;
    vd.load();
    vd.muted = true;
    vd.playsInline = true;
    vd.loop = true;
    vd.classList.add('active');
    vd.play().catch(() => {});
    // Ocultar video-light si existe
    const vl = document.getElementById('video-light');
    if (vl) { vl.classList.remove('active'); vl.pause(); }
  }

  /* ── FILTROS PROYECTOS ─────────────────────── */
  function initFilter() {
    const bar = document.querySelector('.filter-bar');
    if (!bar) return;
    const cards = document.querySelectorAll('[data-cat]');
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards.forEach(card => {
          const show = cat === 'all' || (card.dataset.cat || '').includes(cat);
          card.style.display = show ? '' : 'none';
          card.style.opacity = show ? '1' : '0';
        });
      });
    });
  }

  /* ── IDIOMA ────────────────────────────────── */
  function initLang() {
    const stored = (() => { try { return localStorage.getItem('jg-lang'); } catch { return null; } })();
    let lang = stored || 'es';
    function setLang(l) {
      lang = l;
      try { localStorage.setItem('jg-lang', l); } catch {}
      document.querySelectorAll('[data-es]').forEach(el => {
        const val = el.getAttribute('data-' + l);
        if (val != null) el.textContent = val;
      });
      document.querySelectorAll('.lang-btn, .mobile-lang button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === l);
      });
    }
    document.querySelectorAll('.lang-btn, .mobile-lang button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    setLang(lang);
  }

  /* ── AUDIO PLAYER ──────────────────────────── */
  function initAudio() {
    const player = document.querySelector('.audio-player');
    if (!player) return;
    const audio = player.querySelector('audio');
    const btnPlay = player.querySelector('.audio-btn-play');
    const btnPause = player.querySelector('.audio-btn-pause');
    const btnRestart = player.querySelector('.audio-btn-restart');
    const bar = player.querySelector('.audio-bar');
    if (!audio || !btnPlay) return;
    audio.volume = 0.85;
    btnPlay.addEventListener('click', () => { audio.play(); btnPlay.style.display = 'none'; if (btnPause) btnPause.style.display = ''; });
    if (btnPause) btnPause.addEventListener('click', () => { audio.pause(); btnPause.style.display = 'none'; btnPlay.style.display = ''; });
    if (btnRestart) btnRestart.addEventListener('click', () => { audio.currentTime = 0; audio.play(); btnPlay.style.display = 'none'; if (btnPause) btnPause.style.display = ''; });
    if (bar) {
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
      });
    }
    audio.addEventListener('ended', () => { if (btnPause) btnPause.style.display = 'none'; btnPlay.style.display = ''; });
  }

  /* ── FORMULARIO ────────────────────────────── */
  function initForm() {
    const form = document.querySelector('form[data-netlify]');
    if (!form) return;
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (status) { status.className = 'form-status sending visible'; status.textContent = 'Enviando tu mensaje...'; }
      try {
        const data = new FormData(form);
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        if (res.ok) {
          if (status) { status.className = 'form-status success visible'; status.textContent = 'Tu mensaje fue enviado. Gracias por compartir tu idea. Me pondré en contacto contigo por el correo que indicaste.'; }
          form.reset();
        } else {
          throw new Error('Respuesta no exitosa: ' + res.status);
        }
      } catch {
        if (status) { status.className = 'form-status error visible'; status.textContent = 'No fue posible enviar el mensaje. Revisa los campos o inténtalo nuevamente. También puedes escribirme directamente a juanestebangd12@gmail.com.'; }
      }
    });
  }

  /* ── INIT ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCursor();
    initReveal();
    initNav();
    initVideo();
    initFilter();
    initLang();
    initAudio();
    initForm();
  });
})();
