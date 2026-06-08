/* ══════════════════════════════════════════
   PORTFOLIO — INTERACTIONS JS
   (Project filter, card hover glows, misc)
   ══════════════════════════════════════════ */

/* ─── PROJECT FILTER ─────────────────────── */
function initProjectFilter() {
  // Wait for page content to load
  const tryInit = () => {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-cat]');
    if (!btns.length) { setTimeout(tryInit, 300); return; }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter || 'all';
        cards.forEach(card => {
          const cat = card.dataset.cat || '';
          const show = filter === 'all' || cat === filter;
          card.style.transition = 'opacity .35s, transform .35s';
          if (show) {
            card.style.opacity   = '1';
            card.style.transform = '';
            card.style.pointerEvents = 'all';
          } else {
            card.style.opacity   = '.18';
            card.style.transform = 'scale(.96)';
            card.style.pointerEvents = 'none';
          }
        });
      });
    });
  };
  setTimeout(tryInit, 800);
}


/* ─── SMOOTH HOVER GLOW ON CARDS ─────────── */
// Handled cleanly via event delegation in main.js


/* ─── CONTACT FORM INPUT GLOW ────────────── */
document.addEventListener('focusin', e => {
  if (e.target.matches('input, textarea')) {
    e.target.closest('.form-row')?.style.setProperty('opacity', '1');
  }
});


/* ─── KEYBOARD NAVIGATION ────────────────── */
document.addEventListener('keydown', e => {
  const pages = ['home','about','projects','experience','skills','contact'];
  if (e.altKey) {
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < pages.length) navigate(pages[idx]);
  }
});


/* ─── EASTER EGG — Konami Code ───────────── */
(function() {
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        triggerEasterEgg();
      }
    } else {
      idx = 0;
    }
  });
  function triggerEasterEgg() {
    const msg = document.createElement('div');
    msg.innerHTML = '🎮 CHEAT CODE ACTIVATED — You found the easter egg!';
    Object.assign(msg.style, {
      position:'fixed', bottom:'2rem', left:'50%',
      transform:'translateX(-50%)',
      background:'linear-gradient(135deg,#6366f1,#a855f7)',
      color:'#fff', padding:'.8rem 1.5rem', borderRadius:'12px',
      fontFamily:'var(--mono)', fontSize:'.8rem', letterSpacing:'.06em',
      zIndex:'9999', boxShadow:'0 10px 40px rgba(99,102,241,.5)',
      animation:'fadeInUp .5s ease both',
      whiteSpace:'nowrap'
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3500);
  }
})();


/* ─── TOOLTIP ON SOCIAL BUTTONS ──────────── */
document.addEventListener('mouseover', e => {
  const btn = e.target.closest('.social-btn[title]');
  if (!btn) return;
  let tip = document.getElementById('__tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = '__tooltip';
    Object.assign(tip.style, {
      position:'fixed', pointerEvents:'none', zIndex:'9990',
      background:'rgba(5,12,24,.95)', border:'1px solid rgba(99,102,241,.25)',
      color:'var(--white)', fontFamily:'var(--mono)', fontSize:'.65rem',
      letterSpacing:'.08em', padding:'.3rem .75rem', borderRadius:'6px',
      transition:'opacity .2s', opacity:'0'
    });
    document.body.appendChild(tip);
  }
  tip.textContent = btn.title;
  const r = btn.getBoundingClientRect();
  tip.style.left = (r.left + r.width / 2 - tip.offsetWidth / 2) + 'px';
  tip.style.top  = (r.top - 36) + 'px';
  tip.style.opacity = '1';
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('.social-btn')) {
    const tip = document.getElementById('__tooltip');
    if (tip) tip.style.opacity = '0';
  }
});
