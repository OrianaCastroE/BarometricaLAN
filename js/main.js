/* =========================================================
   BAROMÉTRICA LAN — main.js
   ========================================================= */

/* ── NAV sombra al hacer scroll ─────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('sombra', window.scrollY > 10);
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
