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

/* Validacion de formulario de contacto */
(function () {
  var form = document.querySelector('.formspree-form');
  if (!form) return;

  var emailInput = form.querySelector('#form-email');
  var phoneInput = form.querySelector('#form-phone');
  if (!emailInput || !phoneInput) return;

  function isValidEmail(value) {
    var email = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (/^09\d{7}$/.test(digits)) return true;
    if (/^9\d{7}$/.test(digits)) return true;
    if (/^5989\d{7}$/.test(digits)) return true;
    return false;
  }

  function setFieldError(input, message) {
    input.setCustomValidity(message || '');
    var group = input.closest('.fg');
    if (!group) return;

    group.classList.toggle('fg-error', Boolean(message));

    var help = group.querySelector('.fg-help');
    if (!help) {
      help = document.createElement('small');
      help.className = 'fg-help';
      group.appendChild(help);
    }
    help.textContent = message || '';
    help.hidden = !message;
  }

  function setFormFeedback(message, type) {
    var feedback = form.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      form.appendChild(feedback);
    }

    if (!message) {
      feedback.hidden = true;
      feedback.textContent = '';
      feedback.classList.remove('ok', 'error');
      return;
    }

    feedback.textContent = message;
    feedback.hidden = false;
    feedback.classList.remove('ok', 'error');
    feedback.classList.add(type === 'ok' ? 'ok' : 'error');
  }

  function validateEmail(showMessage) {
    var value = emailInput.value.trim();
    if (!value) {
      setFieldError(emailInput, '');
      return true;
    }

    var ok = isValidEmail(value);
    setFieldError(emailInput, ok ? '' : (showMessage ? 'Ingresa un email valido.' : ''));
    return ok;
  }

  function validatePhone(showMessage) {
    var value = phoneInput.value.trim();
    if (!value) {
      setFieldError(phoneInput, '');
      return true;
    }

    var ok = isValidPhone(value);
    setFieldError(phoneInput, ok ? '' : (showMessage ? 'Ingresa un celular valido.' : ''));
    return ok;
  }

  emailInput.addEventListener('input', function () { validateEmail(false); });
  phoneInput.addEventListener('input', function () { validatePhone(false); });

  emailInput.addEventListener('blur', function () { validateEmail(true); });
  phoneInput.addEventListener('blur', function () { validatePhone(true); });

  form.addEventListener('submit', async function (e) {
    var emailOk = validateEmail(true);
    var phoneOk = validatePhone(true);
    setFormFeedback('', 'ok');

    if (!emailOk || !phoneOk) {
      e.preventDefault();
      (emailOk ? phoneInput : emailInput).reportValidity();
      return;
    }

    e.preventDefault();

    var btn = form.querySelector('.btn-form');
    var oldText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando...';
    }

    try {
      var response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('No se pudo enviar el formulario');

      form.reset();
      setFieldError(emailInput, '');
      setFieldError(phoneInput, '');
      setFormFeedback('Gracias. Recibimos tu solicitud y te contactaremos a la brevedad.', 'ok');
    } catch (error) {
      setFormFeedback('Hubo un problema al enviar. Intenta nuevamente en unos minutos.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText || 'Enviar';
      }
    }
  });
})();
