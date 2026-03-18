const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
function Particle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.r = Math.random() * 1.5 + 0.5;
  this.a = Math.random() * 0.4 + 0.1;
}
for (let i = 0; i < 80; i++) particles.push(new Particle());
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const color = isDark ? '99,211,155' : '16,145,80';
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color},${p.a})`;
    ctx.fill();
  });
  particles.forEach((a, i) => {
    particles.slice(i+1).forEach(b => {
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${color},${0.08*(1-d/120)})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;
themeToggle.addEventListener('change', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
});
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backTop.classList.toggle('visible', window.scrollY > 400);
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    const bot = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < bot);
  });
});
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      e.target.querySelectorAll('.count').forEach(animateCount);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revObs.observe(el));
function animateCount(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = true;
  const target = +el.dataset.target;
  const duration = 1500;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
const roles = ['"Web & Android Developer"', '"BCA Student"', '"Problem Solver"', '"Quick Learner"'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedRole');
function type() {
  const cur = roles[ri];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 50 : 90);
}
setTimeout(type, 2000);
document.querySelectorAll('.exp-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.exp-nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    const panel = document.getElementById(item.dataset.panel);
    if (panel) panel.classList.add('active');
  });
});
document.getElementById('hamburger').addEventListener('click', () => {
  const navC = document.querySelector('.nav-center');
  navC.style.display = navC.style.display === 'flex' ? 'none' : 'flex';
  navC.style.position = 'absolute';
  navC.style.top = '70px'; navC.style.left = '0'; navC.style.right = '0';
  navC.style.flexDirection = 'column';
  navC.style.background = 'var(--nav-bg)';
  navC.style.padding = '1rem';
  navC.style.borderBottom = '1px solid var(--border)';
  navC.style.backdropFilter = 'blur(24px)';
});