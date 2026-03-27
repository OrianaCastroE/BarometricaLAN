/* =========================================================
   BAROMÉTRICA LAN — main.js
   ========================================================= */

/* ── NAV sombra al hacer scroll ─────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('sombra', window.scrollY > 10);
}, { passive: true });

/* ── BOTÓN VOLVER ARRIBA ─────────────────────────────── */
const btnTop = document.getElementById('btnTop');
window.addEventListener('scroll', () => {
  btnTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

/* ── HAMBURGUESA ────────────────────────────────────────── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');

window.abrirMenu = () => {
  const open = mob.classList.toggle('open');
  ham.classList.toggle('abierto', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
window.cerrarMenu = () => {
  mob.classList.remove('open');
  ham.classList.remove('abierto');
  document.body.style.overflow = '';
};

/* Cerrar al hacer click fuera */
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !mob.contains(e.target)) cerrarMenu();
});

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const destino = document.querySelector(link.getAttribute('href'));
    if (!destino) return;
    e.preventDefault();
    cerrarMenu();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    window.scrollTo({
      top: destino.getBoundingClientRect().top + window.scrollY - navH,
      behavior: 'smooth'
    });
  });
});

/* ── ANIMACIÓN POR SECCIÓN (solo aparecen al llegar) ────── */
const animables = document.querySelectorAll('.animar');

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      /* Retirar clase al salir para re-animar → efecto "sección activa" */
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

animables.forEach((el, i) => {
  /* Escalonar tarjetas dentro de un mismo bloque */
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  obs.observe(el);
});

/* ── FORMULARIO ─────────────────────────────────────────── */
window.enviar = () => {
  const nombre = document.getElementById('fn')?.value.trim();
  const tel    = document.getElementById('ft')?.value.trim();
  if (!nombre || !tel) {
    alert('Por favor completá al menos el nombre y el teléfono.');
    return;
  }
  document.getElementById('cform').style.display = 'none';
  document.getElementById('cok').style.display   = 'block';
};

/* Carrusel de camiones */
(function () {
  var track  = document.getElementById('carruselTrack');
  var dotsEl = document.getElementById('carruselDots');
  if (!track) return;

  var slides = track.querySelectorAll('.carrusel-slide');
  var total  = slides.length;
  var current = 0;
  var timer;

  slides.forEach(function(_, i) {
    var d = document.createElement('button');
    d.setAttribute('aria-label', 'Foto ' + (i + 1));
    d.addEventListener('click', function() { ir(i); reiniciarTimer(); });
    dotsEl.appendChild(d);
  });

  function ir(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsEl.querySelectorAll('button').forEach(function(d, i) {
      d.classList.toggle('activo', i === current);
    });
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(function() { ir(current + 1); }, 4000);
  }

  window.moverCarrusel = function(dir) { ir(current + dir); reiniciarTimer(); };

  ir(0);
  reiniciarTimer();

  var carrusel = document.getElementById('carrusel');
  carrusel.addEventListener('mouseenter', function() { clearInterval(timer); });
  carrusel.addEventListener('mouseleave', reiniciarTimer);
})();

/* Lightbox */
(function () {
  var lb     = document.getElementById('lb');
  var lbImg  = document.getElementById('lbImg');
  var lbCerrar = document.getElementById('lbCerrar');

  function abrir(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('activo');
    document.body.style.overflow = 'hidden';
  }
  function cerrar() {
    lb.classList.remove('activo');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  /* Fotos del carrusel */
  document.querySelectorAll('.carrusel-slide img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) { e.stopPropagation(); abrir(img.src, img.alt); });
  });

  /* Fotos de empleados (tc-p usa background-image, abrimos desde data) */
  document.querySelectorAll('.tc-p').forEach(function(el) {
    var bg = el.style.backgroundImage.replace(/url\(['"]?|['"]?\)/g, '');
    if (!bg) return;
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function(e) { e.stopPropagation(); abrir(bg, el.closest('.tc')?.querySelector('strong')?.textContent || ''); });
  });

  /* Fotos de galería nos-foto */
  document.querySelectorAll('.nos-foto img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) { e.stopPropagation(); abrir(img.src, img.alt); });
  });

  /* Cerrar */
  lbCerrar.addEventListener('click', cerrar);
  lb.addEventListener('click', cerrar);
  lbImg.addEventListener('click', function(e) { e.stopPropagation(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') cerrar(); });
})();
