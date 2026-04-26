/* ===========================================
   BAGWAN TRANSPORTS — Premium JavaScript
   Features: Canvas BG, Tilt, Parallax, AOS,
   Scroll Progress, Counter, Mobile Nav,
   Floating Particles, Loader, Micro-interactions
   =========================================== */

'use strict';

// ============================================
// 1. LOADING SCREEN
// ============================================
const Loader = (() => {
  const loader = document.getElementById('loader');
  
  function hide() {
    // Wait for fill animation + small buffer
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero animations
      initHeroAfterLoad();
    }, 2500);
  }
  
  function init() {
    document.body.style.overflow = 'hidden';
    hide();
  }
  
  return { init };
})();

// ============================================
// 2. HERO CANVAS — Animated particle network
// ============================================
const HeroCanvas = (() => {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, animId;
  const nodes = [];
  const NODE_COUNT = 55;
  const CONNECT_DIST = 160;
  const YELLOW = '#FFD600';
  
  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 214, 0, ${this.opacity})`;
      ctx.fill();
    }
  }
  
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  
  function createNodes() {
    nodes.length = 0;
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());
  }
  
  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255, 214, 0, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }
  
  // Road lines animation
  const roadLines = [];
  function createRoadLines() {
    for (let i = 0; i < 12; i++) {
      roadLines.push({
        x: Math.random() * width,
        y: height * 0.88 + Math.random() * 20 - 10,
        w: Math.random() * 60 + 30,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }
  
  function drawRoadLines() {
    roadLines.forEach(l => {
      ctx.beginPath();
      ctx.rect(l.x, l.y, l.w, 3);
      ctx.fillStyle = `rgba(255, 214, 0, ${l.opacity})`;
      ctx.fill();
      l.x -= l.speed;
      if (l.x + l.w < 0) {
        l.x = width + 20;
        l.w = Math.random() * 60 + 30;
      }
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    nodes.forEach(n => { n.update(); n.draw(); });
    drawRoadLines();
    animId = requestAnimationFrame(animate);
  }
  
  function init() {
    resize();
    createNodes();
    createRoadLines();
    animate();
    window.addEventListener('resize', () => {
      resize();
      createNodes();
      roadLines.length = 0;
      createRoadLines();
    });
  }
  
  return { init };
})();

// ============================================
// 3. FLOATING PARTICLES
// ============================================
const Particles = (() => {
  const container = document.getElementById('particles');
  const PARTICLE_COUNT = 25;
  
  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
  
  function init() {
    for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();
  }
  
  return { init };
})();

// ============================================
// 4. NAVBAR — Scroll detection & mobile menu
// ============================================
const Navbar = (() => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('.nav-link');
  
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }
  
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  }
  
  function toggleMenu() {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
  
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
  
  function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger.addEventListener('click', toggleMenu);
    links.forEach(l => l.addEventListener('click', closeMenu));
    handleScroll();
  }
  
  return { init };
})();

// ============================================
// 5. SCROLL PROGRESS INDICATOR
// ============================================
const ScrollProgress = (() => {
  const fill = document.getElementById('scroll-fill');
  
  function update() {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop || document.body.scrollTop;
    const max = doc.scrollHeight - doc.clientHeight;
    fill.style.width = `${(scrolled / max) * 100}%`;
  }
  
  function init() {
    window.addEventListener('scroll', update, { passive: true });
  }
  
  return { init };
})();

// ============================================
// 6. PARALLAX EFFECTS
// ============================================
const Parallax = (() => {
  const heroContent = document.getElementById('hero-content');
  const heroVehicle = document.getElementById('hero-vehicle');
  
  function update() {
    const scrollY = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.28}px)`;
      heroContent.style.opacity = `${1 - scrollY * 0.002}`;
    }
    if (heroVehicle) {
      heroVehicle.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
    }
  }
  
  function init() {
    window.addEventListener('scroll', update, { passive: true });
  }
  
  return { init };
})();

// ============================================
// 7. TILT EFFECT ON CARDS
// ============================================
const Tilt = (() => {
  const INTENSITY = 12;  // max degrees tilt
  const GLOSS_INTENSITY = 0.15;
  
  function onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    
    const rotX = -dy * INTENSITY;
    const rotY = dx * INTENSITY;
    
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    
    // Gloss effect
    const gloss = card.querySelector('.card-glow, .vm-glow, .contact-card-glow, .about-card-bg');
    if (gloss) {
      const glowX = (dx + 1) / 2 * 100;
      const glowY = (dy + 1) / 2 * 100;
      gloss.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,214,0,${GLOSS_INTENSITY}), transparent 60%)`;
    }
  }
  
  function onMouseLeave(card) {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    setTimeout(() => card.style.transition = '', 500);
  }
  
  function onMouseEnter(card) {
    card.style.transition = 'transform 0.1s ease';
  }
  
  function init() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => onMouseEnter(card));
      card.addEventListener('mousemove', e => onMouseMove(e, card));
      card.addEventListener('mouseleave', () => onMouseLeave(card));
    });
  }
  
  return { init };
})();

// ============================================
// 8. SCROLL REVEAL (AOS)
// ============================================
const AOS = (() => {
  const elements = document.querySelectorAll('[data-aos]');
  
  function checkVisible() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('aos-visible');
      }
    });
  }
  
  function init() {
    window.addEventListener('scroll', checkVisible, { passive: true });
    // Check on load too
    setTimeout(checkVisible, 100);
  }
  
  return { init };
})();

// ============================================
// 9. COUNTER ANIMATION
// ============================================
const Counter = (() => {
  const counters = document.querySelectorAll('.a-stat-num');
  const duration = 1800;
  const started = new Set();
  
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  
  function animateCounter(el) {
    if (started.has(el)) return;
    started.add(el);
    
    const target = parseInt(el.getAttribute('data-count'), 10);
    const start = performance.now();
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  
  function checkCounters() {
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        animateCounter(counter);
      }
    });
  }
  
  function init() {
    window.addEventListener('scroll', checkCounters, { passive: true });
    checkCounters();
  }
  
  return { init };
})();

// ============================================
// 10. MOUSE FOLLOWER GLOW (hero section)
// ============================================
const MouseGlow = (() => {
  const hero = document.querySelector('.hero');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let glowEl = null;
  
  function createGlow() {
    glowEl = document.createElement('div');
    glowEl.style.cssText = `
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,214,0,0.06) 0%, transparent 70%);
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: none;
      z-index: 1;
    `;
    hero.appendChild(glowEl);
  }
  
  function update() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (glowEl) {
      glowEl.style.left = `${glowX}px`;
      glowEl.style.top = `${glowY}px`;
    }
    requestAnimationFrame(update);
  }
  
  function init() {
    if (!hero) return;
    createGlow();
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    update();
  }
  
  return { init };
})();

// ============================================
// 11. HERO CTA — Ripple effect
// ============================================
const Ripple = (() => {
  function createRipple(e, el) {
    const existing = el.querySelector('.ripple-effect');
    if (existing) existing.remove();
    
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(0,0,0,0.15);
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
      z-index: 0;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
  
  function init() {
    // Inject ripple keyframe
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
    document.head.appendChild(style);
    
    document.querySelectorAll('.btn-primary, .card-cta, .contact-btn').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', e => createRipple(e, btn));
    });
  }
  
  return { init };
})();

// ============================================
// 12. HERO VEHICLE — Mouse tilt
// ============================================
const VehicleTilt = (() => {
  const vehicle = document.getElementById('hero-vehicle');
  if (!vehicle) return { init: () => {} };
  
  function init() {
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      
      vehicle.style.transform = `
        translateY(-50%)
        rotateY(${dx * 8}deg)
        rotateX(${-dy * 4}deg)
      `;
    });
  }
  
  return { init };
})();

// ============================================
// 13. FLOATING WHATSAPP — Show after scroll
// ============================================
const FloatWA = (() => {
  const btn = document.getElementById('float-wa');
  
  function init() {
    // Label collapses on scroll for subtlety
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }
  
  return { init };
})();

// ============================================
// 14. SMOOTH SCROLL
// ============================================
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  return { init };
})();

// ============================================
// 15. HERO TEXT GLITCH (micro-interaction on hover)
// ============================================
const TextGlitch = (() => {
  const title = document.querySelector('.t2');
  const GLITCH_CHARS = 'X@#$%&!?▓▒░█';
  let glitching = false;
  let interval;
  
  function glitch() {
    if (glitching) return;
    glitching = true;
    const original = title.textContent;
    let count = 0;
    interval = setInterval(() => {
      if (count >= 6) {
        clearInterval(interval);
        title.textContent = original;
        glitching = false;
        return;
      }
      const chars = original.split('');
      const pos = Math.floor(Math.random() * chars.length);
      chars[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      title.textContent = chars.join('');
      count++;
    }, 60);
  }
  
  function init() {
    if (!title) return;
    title.style.cursor = 'default';
    title.addEventListener('mouseenter', glitch);
  }
  
  return { init };
})();

// ============================================
// 16. WHEEL SPIN ANIMATION (continuous)
// ============================================
const WheelSpin = (() => {
  function init() {
    const wheels = document.querySelectorAll('.v-tire, .cv-wheel');
    let angle = 0;
    
    function spin() {
      angle += 2;
      wheels.forEach(w => { w.style.transform = `rotate(${angle}deg)`; });
      requestAnimationFrame(spin);
    }
    spin();
  }
  
  return { init };
})();

// ============================================
// 17. CARD ENTRANCE STAGGER (Services)
// ============================================
const CardEntrance = (() => {
  function init() {
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1)';
      observer.observe(card);
    });
  }
  
  return { init };
})();

// ============================================
// 18. NAVBAR LINK MAGNETIC EFFECT
// ============================================
const MagneticLinks = (() => {
  function init() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mousemove', e => {
        const rect = link.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
        link.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
      });
    });
  }
  
  return { init };
})();

// ============================================
// POST-LOAD HERO INIT
// ============================================
function initHeroAfterLoad() {
  // Stagger reveal hero elements
  const elements = [
    document.querySelector('.hero-badge'),
    document.querySelector('.title-line.t1'),
    document.querySelector('.title-line.t2'),
    document.querySelector('.hero-tagline'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-stats'),
  ];
  
  elements.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1)`;
      el.style.opacity = '';
      el.style.transform = '';
    }, 200 + i * 120);
  });
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  Loader.init();
  HeroCanvas.init();
  Particles.init();
  Navbar.init();
  ScrollProgress.init();
  Parallax.init();
  AOS.init();
  Counter.init();
  MouseGlow.init();
  Ripple.init();
  VehicleTilt.init();
  FloatWA.init();
  SmoothScroll.init();
  TextGlitch.init();
  WheelSpin.init();
  CardEntrance.init();
  MagneticLinks.init();
  Tilt.init();
  
  console.log(
    '%c BAGWAN TRANSPORTS %c Fast • Reliable • Affordable ',
    'background: #FFD600; color: #000; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 4px 0 0 4px;',
    'background: #111; color: #FFD600; font-weight: 600; font-size: 14px; padding: 6px 12px; border-radius: 0 4px 4px 0;'
  );
});
