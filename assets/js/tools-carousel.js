/**
 * Tools Carousel — JEGD Portfolio
 * Cinta infinita de logos con microanimación individual en hover.
 * CSS puro para el scroll; JS solo para duplicar la pista si es necesario
 * y para manejar el tooltip accesible.
 *
 * Regla clave: hover en un logo NO detiene el carrusel.
 */
(function () {
  'use strict';

  const track = document.querySelector('.tools-track');
  if (!track) return;

  // Duplicar la pista para garantizar el loop sin saltos
  // (el CSS ya espera dos copias)
  const original = track.querySelector('.tools-strip');
  if (original && !track.querySelector('.tools-strip--clone')) {
    const clone = original.cloneNode(true);
    clone.classList.add('tools-strip--clone');
    clone.setAttribute('aria-hidden', 'true');
    // Quitar atributos de accesibilidad de los ítems clonados
    clone.querySelectorAll('[role]').forEach(el => el.removeAttribute('role'));
    clone.querySelectorAll('[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
    track.appendChild(clone);
  }

  // ── Tooltip accesible ─────────────────────────────────────────────────────
  const tooltip = document.getElementById('tools-tooltip');
  if (!tooltip) return;

  let tooltipTimer = null;

  document.querySelectorAll('.tools-logo').forEach(el => {
    const name = el.dataset.tool || el.getAttribute('aria-label') || '';

    el.addEventListener('pointerenter', function (e) {
      if (window.matchMedia('(pointer: coarse)').matches) return; // táctil: no tooltip hover
      clearTimeout(tooltipTimer);
      tooltip.textContent = name;
      tooltip.hidden = false;
      positionTooltip(e);
    });

    el.addEventListener('pointermove', positionTooltip);

    el.addEventListener('pointerleave', function () {
      tooltipTimer = setTimeout(() => { tooltip.hidden = true; }, 120);
    });

    el.addEventListener('focus', function () {
      tooltip.textContent = name;
      const r = el.getBoundingClientRect();
      tooltip.style.left = (r.left + r.width / 2 + window.scrollX) + 'px';
      tooltip.style.top  = (r.top  - 10          + window.scrollY) + 'px';
      tooltip.hidden = false;
    });

    el.addEventListener('blur', function () {
      tooltip.hidden = true;
    });
  });

  function positionTooltip(e) {
    tooltip.style.left = (e.clientX + window.scrollX) + 'px';
    tooltip.style.top  = (e.clientY + window.scrollY - 44) + 'px';
  }

})();
