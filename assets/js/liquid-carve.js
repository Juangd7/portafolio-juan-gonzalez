/**
 * Liquid Carve Button — Vanilla JS + SVG
 * Portafolio JEGD · Sin React ni Framer Motion
 *
 * Targets: .btn-primary, .btn-outline, .btn-text, button[type="submit"],
 *          .filter-btn, .contact-direct-link
 * Excluded: nav *, .hamburger, .lang-btn, .nav-logo, .mobile-nav *
 *
 * Palette:
 *   btn-primary  → blob #000  (carve negro sobre amarillo)
 *   btn-outline  → blob #FFED00 (carve amarillo sobre oscuro)
 *   btn-text     → blob #662483 (carve morado sutil)
 *   filter-btn   → blob #FFED00
 *   contact-direct-link → blob #662483
 */

(function () {
  'use strict';

  // ─── Constantes de física ──────────────────────────────────────────────
  const GOO_STD   = 7;          // blur del filtro gooey
  const TAU_MIN   = 0.025;      // suavizado mínimo (lag)
  const TAU_MAX   = 0.38;       // suavizado máximo
  const SQUASH_TAU         = 0.08;
  const SQUASH_PER_PX_S    = 0.0012;
  const SQUASH_MAX         = 1.55;
  const SMOOTHNESS         = 0.55; // 0=brusco 1=muy suave

  // ─── Mapa de variantes → color de blob ────────────────────────────────
  const BLOB_COLORS = {
    'btn-primary':        '#000000',
    'btn-outline':        '#FFED00',
    'btn-text':           '#662483',
    'filter-btn':         '#FFED00',
    'contact-direct-link':'#662483',
    'submit':             '#000000',   // submit dentro de btn-primary
  };

  // ─── Detectar prefers-reduced-motion ──────────────────────────────────
  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Generar ID único ──────────────────────────────────────────────────
  let _uid = 0;
  const uid = () => `lc${++_uid}`;

  // ─── Determinar color del blob según clase del botón ──────────────────
  function blobColor(el) {
    if (el.matches('.btn-primary, [type="submit"]')) return BLOB_COLORS['btn-primary'];
    if (el.matches('.btn-outline'))                  return BLOB_COLORS['btn-outline'];
    if (el.matches('.btn-text'))                     return BLOB_COLORS['btn-text'];
    if (el.matches('.filter-btn'))                   return BLOB_COLORS['filter-btn'];
    if (el.matches('.contact-direct-link'))          return BLOB_COLORS['contact-direct-link'];
    return '#FFED00';
  }

  // ─── Determinar radio del blob (relativo al botón) ────────────────────
  function blobRadius(el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    // btn-text es más pequeño, blob más chico
    if (el.matches('.btn-text, .contact-direct-link')) return Math.min(w, h) * 0.9;
    return Math.max(w, h) * 0.7;
  }

  // ─── Crear SVG overlay ────────────────────────────────────────────────
  function buildSVG(el) {
    const id      = uid();
    const filtId  = `lc-f-${id}`;
    const maskId  = `lc-m-${id}`;
    const color   = blobColor(el);
    const r       = blobRadius(el);
    const rad     = parseInt(getComputedStyle(el).borderRadius) || 0;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      overflow:visible;pointer-events:none;z-index:0;
    `;

    svg.innerHTML = `
      <defs>
        <filter id="${filtId}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${GOO_STD}" result="blur"/>
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"/>
        </filter>
        <mask id="${maskId}">
          <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
          <g class="lc-follow" style="will-change:transform;">
            <g class="lc-squash" style="transform-origin:center;will-change:transform;">
              <g class="lc-bite" style="transform-origin:center;transform:scale(0);will-change:transform;">
                <circle cx="0" cy="0" r="${r / 2}" fill="#000"/>
              </g>
            </g>
          </g>
        </mask>
      </defs>

      <g filter="url(#${filtId})" class="lc-bg-layer">
        <rect x="0" y="0" width="100%" height="100%"
          rx="${rad}" ry="${rad}" fill="${color}" class="lc-bg-rect"/>
      </g>

      <g filter="url(#${filtId})" class="lc-fill-layer">
        <rect x="0" y="0" width="100%" height="100%"
          rx="${rad}" ry="${rad}" class="lc-fill-rect"
          mask="url(#${maskId})"/>
      </g>
    `;

    return svg;
  }

  // ─── Calcular fill rect color (bg del botón sin hover) ────────────────
  function fillColor(el) {
    const cs = getComputedStyle(el);
    // Leer el background real computado
    const bg = cs.backgroundColor;
    // Si es transparente, usar el color de texto como indicador
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      // btn-text / contact-direct-link: no tiene bg
      return 'transparent';
    }
    return bg;
  }

  // ─── Inicializar un botón ─────────────────────────────────────────────
  function init(el) {
    if (el.dataset.lcInit) return;
    el.dataset.lcInit = '1';

    // Asegurar position:relative para el overlay
    const pos = getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    // overflow hidden rompe la máscara, necesitamos visible en el botón
    el.style.overflow = 'visible';

    const svg   = buildSVG(el);
    el.prepend(svg);

    // Referencias a los grupos del SVG
    const follow = svg.querySelector('.lc-follow');
    const squash = svg.querySelector('.lc-squash');
    const bite   = svg.querySelector('.lc-bite');
    const fillRect = svg.querySelector('.lc-fill-rect');

    // Pintar fill-rect con el color real de fondo del botón
    // Se hace después de insertar en DOM para que getComputedStyle funcione
    requestAnimationFrame(() => {
      const fc = fillColor(el);
      if (fc && fc !== 'transparent') {
        fillRect.setAttribute('fill', fc);
      } else {
        // Sin fondo sólido: no usar fill-layer
        svg.querySelector('.lc-fill-layer').style.display = 'none';
        svg.querySelector('.lc-bg-layer').style.opacity = '0.18';
      }
    });

    // ── Estado de física ─────────────────────────────────────────────────
    const state = {
      x: 0, y: 0,    // posición actual del blob (centro del botón = 0,0)
      tx: 0, ty: 0,  // posición objetivo
      squash: 1,
      angle: 0,
      hovered: false,
      biteScale: 0,
    };

    // ── Loop rAF ──────────────────────────────────────────────────────────
    let rafId = null;
    let lastTime = 0;

    function tick(now) {
      rafId = requestAnimationFrame(tick);
      const dt  = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 1 / 60;
      lastTime  = now;

      if (prefersReduced()) {
        follow.style.transform = `translate(${state.tx}px, ${state.ty}px)`;
        return;
      }

      const tau = TAU_MIN + SMOOTHNESS * (TAU_MAX - TAU_MIN);
      const k   = 1 - Math.exp(-dt / tau);
      const dx  = (state.tx - state.x) * k;
      const dy  = (state.ty - state.y) * k;
      state.x  += dx;
      state.y  += dy;

      // Squash & stretch
      const speed = Math.hypot(dx, dy) / dt;
      const want  = Math.min(SQUASH_MAX, 1 + speed * SQUASH_PER_PX_S);
      state.squash += (want - state.squash) * (1 - Math.exp(-dt / SQUASH_TAU));
      if (speed > 6) state.angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Animación del bite (aparece/desaparece)
      const targetBite = state.hovered ? 1 : 0;
      const biteK      = 1 - Math.exp(-dt / 0.12);
      state.biteScale += (targetBite - state.biteScale) * biteK;

      follow.style.transform = `translate(${state.x}px, ${state.y}px)`;
      squash.style.transform = `rotate(${state.angle}deg) scale(${state.squash}, ${1 / state.squash})`;
      bite.style.transform   = `scale(${state.biteScale})`;
    }

    // ── Helpers de offset ─────────────────────────────────────────────────
    function getOffset(e) {
      const r = el.getBoundingClientRect();
      return {
        dx: e.clientX - (r.left + r.width  / 2),
        dy: e.clientY - (r.top  + r.height / 2),
      };
    }

    // ── Eventos de puntero ────────────────────────────────────────────────
    function onEnter(e) {
      state.hovered = true;
      const o = getOffset(e);
      // Posicionar blob instantáneo para evitar "salto"
      state.x = o.dx; state.tx = o.dx;
      state.y = o.dy; state.ty = o.dy;
    }

    function onMove(e) {
      if (!state.hovered) return;
      const o = getOffset(e);
      state.tx = o.dx;
      state.ty = o.dy;
    }

    function onLeave() {
      state.hovered = false;
    }

    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointermove',  onMove,  { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    // ── IntersectionObserver: pausa cuando fuera de pantalla ─────────────
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    }, { threshold: 0 });
    io.observe(el);

    // Foco visible (accesibilidad teclado)
    el.addEventListener('focus', () => {
      el.style.outline = '2px solid #FFED00';
      el.style.outlineOffset = '3px';
    });
    el.addEventListener('blur', () => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  }

  // ─── Selectores a inicializar ──────────────────────────────────────────
  // Excluidos explícitamente: nav a, .nav-link, .nav-logo, .lang-btn,
  //   .hamburger, .mobile-nav *, footer a sin clase btn
  const SELECTOR = [
    '.btn.btn-primary',
    '.btn.btn-outline',
    '.btn.btn-text',
    'button[type="submit"].btn',
    '.filter-btn',
    '.contact-direct-link',
  ].join(', ');

  // ─── Excluir navbar explícitamente ────────────────────────────────────
  const EXCLUDE_SELECTOR = [
    'nav *',
    '.nav-logo',
    '.nav-link',
    '.lang-btn',
    '.hamburger',
    '#mobile-nav *',
    '.mobile-nav *',
    '.mobile-lang *',
  ].join(', ');

  function isExcluded(el) {
    // Verificar que el elemento no está dentro de nav ni es un control de nav
    return el.closest('nav, #mobile-nav, .mobile-nav, .mobile-lang') !== null
        || el.matches('.nav-logo, .nav-link, .lang-btn, .hamburger');
  }

  // ─── Inicialización ───────────────────────────────────────────────────
  function initAll() {
    document.querySelectorAll(SELECTOR).forEach(el => {
      if (!isExcluded(el)) init(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Re-inicializar si se añaden botones dinámicamente (e.g. lazy content)
  const mo = new MutationObserver(() => {
    document.querySelectorAll(`${SELECTOR}:not([data-lc-init])`).forEach(el => {
      if (!isExcluded(el)) init(el);
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });

})();
