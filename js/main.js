/* ══════════════════════════════════════════
   PORTFOLIO — MAIN JS (Router, Cursor, Canvas)
   ══════════════════════════════════════════ */

/* ─── PAGE LOADER ─────────────────────────
   Page elements are pre-inlined in index.html.
   Initialize home page effects directly.
──────────────────────────────────────────── */
const PAGE_IDS = ['home','about','projects','experience','skills','contact'];

function loadPages() {
  setTimeout(() => initReveal(document.getElementById('page-home')), 200);
  initTyped();
  animCounters();
  initProjectFilter();
}
loadPages();


/* ─── ROUTER ───────────────────────────── */
let currentPage = 'home';

window.navigate = function(pageId) {
  if (pageId === currentPage) return;

  const overlay = document.getElementById('trans-overlay');
  overlay.classList.add('loading');

  setTimeout(() => {
    const oldEl = document.getElementById('page-' + currentPage);
    oldEl.classList.remove('active');
    oldEl.classList.add('exit-up');

    const newEl = document.getElementById('page-' + pageId);
    newEl.classList.add('enter-up');
    newEl.classList.remove('exit-up', 'exit-down');

    requestAnimationFrame(() => {
      newEl.classList.add('active');
      requestAnimationFrame(() => {
        newEl.classList.remove('enter-up');
        newEl.scrollTop = 0;
      });
    });

    setTimeout(() => oldEl.classList.remove('exit-up','exit-down'), 700);

    currentPage = pageId;
    updateNav(pageId);

    // Avatar transition
    if (window.avatarNavigate) window.avatarNavigate(pageId);

    setTimeout(() => initReveal(newEl), 130);
    setTimeout(() => overlay.classList.remove('loading'), 540);
  }, 330);
};

function updateNav(pageId) {
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  document.querySelectorAll('.mobile-nav-link').forEach((l, i) => {
    l.classList.toggle('active', PAGE_IDS[i] === pageId);
  });
}


/* ─── NAVBAR SCROLL ──────────────────────── */
document.querySelectorAll('.page').forEach(page => {
  page.addEventListener('scroll', () => {
    if (!page.classList.contains('active')) return;
    document.getElementById('nav').classList.toggle('scrolled', page.scrollTop > 30);
    const pct = page.scrollTop / (page.scrollHeight - page.clientHeight);
    document.getElementById('scroll-progress').style.width = (pct * 100) + '%';

    // Fade out hero avatar on scroll down (mobile/tablet stacked view)
    if (page.id === 'page-home') {
      const avatar = document.getElementById('avatar-container');
      if (avatar && avatar.classList.contains('mode-hero')) {
        if (window.innerWidth <= 950) {
          const opacity = Math.max(0, 1 - page.scrollTop / 200);
          avatar.style.opacity = opacity;
          avatar.style.pointerEvents = opacity < 0.1 ? 'none' : 'all';
        } else {
          avatar.style.opacity = '';
          avatar.style.pointerEvents = '';
        }
      }
    }
  });
});


/* ─── MOBILE NAV ─────────────────────────── */
window.toggleMobileNav = function() {
  const mn = document.getElementById('mobile-nav');
  const hb = document.getElementById('hamburger');
  const open = mn.classList.toggle('open');
  hb.children[0].style.transform = open ? 'rotate(45deg) translateY(6.5px)' : '';
  hb.children[1].style.opacity   = open ? '0' : '1';
  hb.children[2].style.transform = open ? 'rotate(-45deg) translateY(-6.5px)' : '';
};


/* ─── CANVAS BACKGROUND ─────────────────── */
(function() {
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let W, H;

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  // Create particles with varied sizes and colors
  const COLORS = [
    [99,102,241],   // indigo
    [56,189,248],   // cyan
    [168,85,247],   // purple
    [56,189,248],   // cyan (more weight)
    [99,102,241],   // indigo (more weight)
  ];

  const pts = Array.from({ length: 100 }, (_, i) => {
    const isHub = i < 8; // First 8 are "hub" nodes — bigger, brighter
    const colorIdx = Math.floor(Math.random() * COLORS.length);
    return {
      x: Math.random() * 2000,
      y: Math.random() * 1100,
      vx: (Math.random() - .5) * (isHub ? .15 : .25),
      vy: (Math.random() - .5) * (isHub ? .15 : .25),
      r:  isHub ? Math.random() * 1.8 + 1.4 : Math.random() * 1.2 + .4,
      c:  COLORS[colorIdx],
      opacity: isHub ? Math.random() * .35 + .35 : Math.random() * .45 + .2,
      isHub
    };
  });

  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  const MAX_DIST = 130;
  const HUB_DIST = 200;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      // Mouse attraction
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attractDist = p.isHub ? 280 : 180;
      if (dist < attractDist) {
        p.vx += dx * (p.isHub ? .00006 : .00009);
        p.vy += dy * (p.isHub ? .00006 : .00009);
      }

      // Dampen velocity
      p.vx *= .997; p.vy *= .997;
      p.x += p.vx; p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.opacity})`;
      ctx.fill();

      // Hub glow ring
      if (p.isHub) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.06)`;
        ctx.fill();
      }
    });

    // Draw connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dxc = pts[i].x - pts[j].x, dyc = pts[i].y - pts[j].y;
        const d = Math.sqrt(dxc * dxc + dyc * dyc);
        const threshold = (pts[i].isHub || pts[j].isHub) ? HUB_DIST : MAX_DIST;
        if (d < threshold) {
          const alpha = (1 - d / threshold) * (pts[i].isHub || pts[j].isHub ? .5 : .38);
          const [r, g, b] = pts[i].c;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = pts[i].isHub || pts[j].isHub ? 1.1 : .8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ─── CURSOR ─────────────────────────────── */
(function() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  const dot  = document.getElementById('cur-dot');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left  = mx + 'px'; cur.style.top  = my + 'px';
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  });

  // Smooth lag on ring
  function animRing() {
    rx += (mx - rx) * .1; ry += (my - ry) * .1;
    ring.style.left = Math.round(rx) + 'px';
    ring.style.top  = Math.round(ry) + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover state detection using CSS class on body
  const HOVERABLE = 'a,button,.nav-link,.nav-cta,.filter-btn,.skill-chip-lg,.card,.social-btn,.project-card,.coding-card,.contact-link,.interest-pill,.hero-stat,.about-float-card,.tl-card,.proj-link,.rd-pill,.mobile-nav-link';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVERABLE)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVERABLE)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click shrink
  document.addEventListener('mousedown', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(.65)';
    ring.style.transform = 'translate(-50%,-50%) scale(.9)';
  });
  document.addEventListener('mouseup', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // Card mouse-tracking glow (set CSS vars for radial gradient)
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.card');
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
  });
})();
