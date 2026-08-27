/* ============================================================
   Muhammad Kamal — portfolio interactions
   Vanilla JS, no dependencies
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader ---------- */
(function preloader() {
  const el = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  if (!el) return;

  if (reduceMotion) { el.classList.add('done'); startReveals(); return; }

  let p = 0;
  const tick = setInterval(() => {
    p += Math.max(1, Math.round((100 - p) * 0.12));
    if (p >= 100) { p = 100; clearInterval(tick); finish(); }
    fill.style.width = p + '%';
    pct.textContent = p;
  }, 90);

  function finish() {
    setTimeout(() => {
      el.classList.add('done');
      startReveals();
    }, 350);
  }
})();

/* ---------- Custom cursor ---------- */
(function cursor() {
  if (reduceMotion || window.matchMedia('(max-width: 900px)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ---------- Scroll progress + nav hide ---------- */
(function scrollUI() {
  const bar = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');
  let last = 0;

  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (bar) bar.style.width = (scrolled * 100) + '%';

    const y = h.scrollTop;
    if (nav) {
      if (y > last && y > 200) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
    }
    last = y;
  }, { passive: true });
})();

/* ---------- Reveal on scroll ---------- */
function startReveals() {
  const items = document.querySelectorAll('.reveal, .reveal-mask');
  if (reduceMotion) { items.forEach(i => i.classList.add('in')); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('in'), delay);
        io.unobserve(entry.target);
        if (entry.target.querySelector('[data-count]') || entry.target.hasAttribute('data-count')) {
          // handled by counters observer
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach(i => io.observe(i));
}

/* ---------- Animated counters ---------- */
(function counters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      io.unobserve(el);

      if (reduceMotion) { el.textContent = target + suffix; return; }

      const dur = 1400;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();

/* ---------- Rotating hero word ---------- */
(function rotator() {
  const el = document.getElementById('rotator');
  if (!el || reduceMotion) return;
  const words = ['MOBILE', 'THE WEB', 'THE CLOUD'];
  let i = 0;

  setInterval(() => {
    el.style.transition = 'transform .5s cubic-bezier(.22,.61,.36,1), opacity .5s';
    el.style.transform = 'translateY(-100%)';
    el.style.opacity = '0';
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.transition = 'none';
      el.style.transform = 'translateY(100%)';
      requestAnimationFrame(() => {
        el.style.transition = 'transform .5s cubic-bezier(.22,.61,.36,1), opacity .5s';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    }, 500);
  }, 2600);
})();

/* ---------- Magnetic buttons ---------- */
(function magnetic() {
  if (reduceMotion || window.matchMedia('(max-width: 900px)').matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ---------- Card tilt + spotlight ---------- */
(function cardTilt() {
  const cards = document.querySelectorAll('.card.tilt');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      if (reduceMotion) return;
      const rx = (py - 0.5) * -6;
      const ry = (px - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ---------- Hero photo parallax ---------- */
(function heroParallax() {
  if (reduceMotion || window.matchMedia('(max-width: 900px)').matches) return;
  const photo = document.getElementById('heroPhoto');
  const hero = document.querySelector('.hero');
  if (!photo || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photo.style.transform = `translate(${x * 18}px, ${y * 18}px) rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
  });
  hero.addEventListener('mouseleave', () => { photo.style.transform = ''; });
})();
