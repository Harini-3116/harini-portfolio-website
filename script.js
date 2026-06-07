/* ============================================================
   Harini G – AWS Cloud Journey Portfolio
   script.js
   ============================================================ */

'use strict';

/* ── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2400);
});
document.body.style.overflow = 'hidden';

/* ── 2. MOUSE SPOTLIGHT ─────────────────────────────────────── */
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', e => {
  spotlight.style.left = e.clientX + 'px';
  spotlight.style.top  = e.clientY + 'px';
});

/* ── 3. BACKGROUND CANVAS ─────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], lines = [];
  const PARTICLE_COUNT = 60;
  const LINE_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.25 + 0.1;
      this.alpha = Math.random() * 0.4 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset(false);
      if (this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,198,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,198,255,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── 4. NAVBAR SCROLL EFFECT ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── 5. HAMBURGER MENU ────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── 6. TYPING EFFECT ─────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = [
    'B.Tech CSE Student',
    'AWS Cloud Learner',
    'Curious Problem Solver',
    'Passionate Builder'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 55 : 80);
  }
  setTimeout(type, 800);
})();

/* ── 7. HERO FLOATING PARTICLES ───────────────────────────── */
(function heroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const icons = ['☁', '⚡', '🔗', '⚙', '🌐', '📡', '🖥', '🔒'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      font-size:${12 + Math.random() * 14}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      opacity:${0.05 + Math.random() * 0.12};
      animation: heroFloat ${6 + Math.random() * 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      pointer-events:none;
      user-select:none;
    `;
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    container.appendChild(el);
  }
  if (!document.getElementById('heroFloatStyle')) {
    const style = document.createElement('style');
    style.id = 'heroFloatStyle';
    style.textContent = `
      @keyframes heroFloat {
        0%,100% { transform: translateY(0) rotate(0deg); }
        33% { transform: translateY(-18px) rotate(5deg); }
        66% { transform: translateY(10px) rotate(-5deg); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── 8. SCROLL REVEAL ─────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const idx = Array.from(els).indexOf(entry.target);
        const siblings = entry.target.closest('section')
          ? Array.from(entry.target.closest('section').querySelectorAll('.reveal'))
          : [];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ── 9. COUNTER ANIMATION ─────────────────────────────────── */
(function initCounters() {
  const cards = document.querySelectorAll('.dash-card[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card  = entry.target;
      const target = parseInt(card.dataset.count, 10);
      const el = card.querySelector('.counter');
      if (!el) return;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
      // Animate progress bars
      card.querySelectorAll('.dash-fill').forEach(bar => bar.classList.add('animated'));
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });
  cards.forEach(c => observer.observe(c));
})();

/* ── 10. SKILL BAR ANIMATION ──────────────────────────────── */
(function initSkillBars() {
  const section = document.getElementById('skills');
  if (!section) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  observer.observe(section);
})();

/* ── 11. CONCEPT CARD TOGGLE ──────────────────────────────── */
document.querySelectorAll('.concept-card').forEach(card => {
  card.addEventListener('click', () => {
    const wasActive = card.classList.contains('active');
    document.querySelectorAll('.concept-card').forEach(c => c.classList.remove('active'));
    if (!wasActive) card.classList.add('active');
  });
});

/* ── 12. PARALLAX EFFECT ──────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
  }
}, { passive: true });

/* ── 13. SMOOTH ACTIVE NAV HIGHLIGHT ──────────────────────── */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function update() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
      a.style.background = a.getAttribute('href') === '#' + current ? 'var(--blue-dim)' : '';
    });
  }
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── 14. TIMELINE ENTRANCE STAGGER ───────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(items).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
})();

/* ── 15. ROADMAP ENTRANCE STAGGER ────────────────────────── */
(function initRoadmap() {
  const items = document.querySelectorAll('.road-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(items).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
})();

/* ── 16. GLOW CARD HOVER EFFECT ──────────────────────────── */
document.querySelectorAll('.project-card, .dash-card, .skill-group, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,198,255,0.06), var(--glass) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ── 17. PAGE LOAD ENTRANCE ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 2600 + i * 150);
    });
  }, 0);
});
