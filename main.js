/* ─────────────────────────────────────────
   VICTOR PELOUSE — PORTFOLIO SCRIPTS
   ─────────────────────────────────────────
   Sections:
   1. Custom Cursor
   2. Navbar (scroll + mobile toggle)
   3. Parallax Hero
   4. Scroll Reveal
   5. Counter Animations
   6. Skill Bars
   7. Noise Canvas
   8. Contact Form
   9. Init
───────────────────────────────────────── */


/* ─── 1. CUSTOM CURSOR ─── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0;    // mouse position
  let tx = 0, ty = 0;    // trail position

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth trailing effect via rAF
  function loopTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(loopTrail);
  }
  loopTrail();
}


/* ─── 2. NAVBAR ─── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  let menuOpen = false;
  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  toggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}


/* ─── 3. PARALLAX HERO ─── */
function initParallax() {
  const heroGrid    = document.querySelector('.hero-grid');
  const heroContent = document.querySelector('.hero-content');
  const heroTitle   = document.querySelector('.hero-title');

  if (!heroGrid) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGrid.style.transform    = `translateY(${y * 0.4}px)`;
    heroContent.style.transform = `translateY(${y * 0.2}px)`;
    heroContent.style.opacity   = 1 - y / 600;
  }, { passive: true });

  // Subtle mouse parallax in hero
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    if (heroTitle) {
      heroTitle.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
    }
    heroGrid.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  });
}


/* ─── 4. SCROLL REVEAL ─── */
function initReveal() {
  const els = document.querySelectorAll(
    '.about-grid, .project-card, .skill-item, .contact-layout, .about-card-inner, .skills-group'
  );

  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 60}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}


/* ─── 5. COUNTER ANIMATIONS ─── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start  = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


/* ─── 6. SKILL BARS ─── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width;
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}


/* ─── 7. NOISE CANVAS ─── */
function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let frame = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function renderNoise() {
    frame++;
    // Only update every 3 frames for perf
    if (frame % 3 !== 0) { requestAnimationFrame(renderNoise); return; }

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i]     = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(renderNoise);
  }

  renderNoise();
}


/* ─── 8. CONTACT FORM ─── */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const fb   = document.getElementById('formFeedback');

  btn.textContent = 'Envoi…';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      fb.textContent = '✓ Message envoyé — je te réponds rapidement !';
      fb.style.color = 'var(--accent)';
      form.reset();
    } else {
      fb.textContent = '⚠ Une erreur est survenue, réessaie.';
      fb.style.color = 'var(--accent-2)';
    }
  } catch {
    fb.textContent = '⚠ Pas de connexion, réessaie plus tard.';
    fb.style.color = 'var(--accent-2)';
  }

  btn.textContent = 'Envoyer →';
  btn.disabled = false;
});


/* ─── 9. INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initParallax();
  initReveal();
  initCounters();
  initSkillBars();
  initNoise();
});
