/* ══════════════════════════════════════════
   PORTFOLIO — ANIMATIONS JS
   (Reveal Observer, Counters, Typed Text)
   ══════════════════════════════════════════ */

/* ─── SCROLL REVEAL OBSERVER ─────────────── */
function initReveal(container) {
  if (!container) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        // Animate skill bars
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.transform = `scaleX(${bar.dataset.width || 1})`;
        });
        obs.unobserve(e.target);
      }
    });
  }, {
    threshold: .1,
    rootMargin: '0px 0px -36px 0px',
    root: container
  });

  const targets = container.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger'
  );
  targets.forEach(el => {
    obs.observe(el);
    // Immediately trigger if in viewport
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.top > 0) {
      el.classList.add('on');
    }
  });
}


/* ─── HERO COUNTER ANIMATION ────────────── */
function animCounters() {
  // Use MutationObserver to wait until home page is populated
  const tryInit = () => {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) {
      setTimeout(tryInit, 200);
      return;
    }
    els.forEach(el => {
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 55));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 22);
    });
  };
  setTimeout(tryInit, 600);
}


/* ─── TYPED TEXT EFFECT ──────────────────── */
function initTyped() {
  const tryInit = () => {
    const el = document.getElementById('type-text');
    if (!el) { setTimeout(tryInit, 200); return; }

    const roles = [
      'Full Stack Developer',
      'Python Developer',
      'AI / ML Enthusiast',
      'Computer Vision Engineer',
      'Problem Solver',
      'B.Tech CSE @ JIIT',
      'MERN Stack Developer',
      'Cybersecurity Explorer'
    ];
    let ri = 0, ci = 0, deleting = false;

    function type() {
      const role = roles[ri];
      if (!deleting) {
        el.textContent = role.slice(0, ci + 1);
        ci++;
        if (ci === role.length) {
          deleting = true;
          setTimeout(type, 1700);
          return;
        }
      } else {
        el.textContent = role.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 42 : 85);
    }
    type();
  };
  setTimeout(tryInit, 400);
}


/* ─── 3D CARD TILT ───────────────────────── */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.project-card').forEach(card => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 320) {
      card.style.transform =
        `perspective(1200px) rotateX(${(y / 25) * .35}deg) rotateY(${(-x / 25) * .35}deg) translateY(-5px)`;
    } else {
      card.style.transform = '';
    }
  });
});
document.addEventListener('mouseleave', () => {
  document.querySelectorAll('.project-card').forEach(c => c.style.transform = '');
});


/* ─── MAGNETIC BUTTONS ───────────────────── */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.btn-primary, .btn-purple').forEach(btn => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      btn.style.transform = `translate(${dx * .2}px, ${dy * .2}px)`;
    } else {
      btn.style.transform = '';
    }
  });
});
