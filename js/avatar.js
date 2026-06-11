/* ══════════════════════════════════════════
   IMAGE-BASED AVATAR ENGINE
   Premium 3D avatar with parallax + transitions
   ══════════════════════════════════════════ */

class AvatarEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mode      = 'hero';
    this.mouse     = { x: 0, y: 0 };
    this.tilt      = { x: 0, y: 0 };
    this._animId   = null;

    this._buildDOM();
    this._bindEvents();
    this._loop();
  }

  /* ── BUILD DOM ── */
  _buildDOM() {
    // Inner container for floating animation to avoid GSAP/CSS transform conflicts
    const inner = document.createElement('div');
    inner.id = 'avatar-inner';

    // Main image wrapper
    const wrap = document.createElement('div');
    wrap.id = 'avatar-img-wrap';

    const img = document.createElement('img');
    img.src = 'assets/avatar.jpg';
    img.alt = 'Saksham Kotia – Developer Avatar';
    img.draggable = false;
    this._img = img;
    wrap.appendChild(img);

    // Floating particles
    const particles = document.createElement('div');
    particles.id = 'avatar-particles';
    for (let i = 0; i < 5; i++) {
      particles.appendChild(document.createElement('span'));
    }
    this._particles = particles;

    inner.appendChild(wrap);
    inner.appendChild(particles);
    this.container.appendChild(inner);
  }

  /* ── EVENTS ── */
  _bindEvents() {
    // Mouse parallax tilt
    window.addEventListener('mousemove', e => {
      this.mouse.x = (e.clientX / innerWidth  - 0.5) * 2;
      this.mouse.y = (e.clientY / innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      if (this.mode === 'hero') this.toHero();
      else if (this.mode === 'corner') this.toCorner();
    });

    // Click corner → go home
    this.container.addEventListener('click', () => {
      if (this.mode === 'corner') {
        if (window.navigate) window.navigate('home');
      }
    });
  }

  /* ── ANIMATION LOOP (subtle parallax) ── */
  _loop() {
    this._animId = requestAnimationFrame(this._loop.bind(this));

    // Smooth lerp toward mouse position
    if (this.mode === 'hero') {
      const speed = 0.04;
      this.tilt.x += (this.mouse.y * 6 - this.tilt.x) * speed;
      this.tilt.y += (this.mouse.x * 8 - this.tilt.y) * speed;

      if (this._img) {
        this._img.style.transform =
          `perspective(1000px) rotateX(${-this.tilt.x}deg) rotateY(${this.tilt.y}deg) scale(1.03)`;
      }
    }
  }

  /* ── TO HERO ── */
  toHero() {
    this.mode = 'hero';
    const c = this.container;
    c.classList.remove('mode-corner');
    c.classList.add('mode-hero');

    let targetWidth = '520px';
    let targetHeight = '600px';
    let targetRight = 'auto';
    let targetLeft = 'calc(50% + 20px)';
    let targetTop = '50%';
    let targetYPercent = -50;
    let targetXPercent = 0;
    let targetBorderRadius = '22px';

    const w = window.innerWidth;
    if (w <= 600) {
      targetWidth = '165px';
      targetHeight = '192px';
      targetLeft = '50%';
      targetRight = 'auto';
      targetTop = 'calc(68px + 1rem)';
      targetYPercent = 0;
      targetXPercent = -50;
      targetBorderRadius = '16px';
    } else if (w <= 950) {
      targetWidth = '220px';
      targetHeight = '255px';
      targetLeft = '50%';
      targetRight = 'auto';
      targetTop = 'calc(68px + 1rem)';
      targetYPercent = 0;
      targetXPercent = -50;
      targetBorderRadius = '18px';
    } else if (w <= 1250) {
      targetWidth = '360px';
      targetHeight = '420px';
      targetRight = 'auto';
      targetLeft = 'calc(50% + 40px)';
      targetTop = '50%';
      targetYPercent = -50;
      targetXPercent = 0;
      targetBorderRadius = '22px';
    }

    if (window.gsap) {
      gsap.killTweensOf(c);
      gsap.to(c, {
        duration: 0.9,
        ease: 'power3.out',
        width: targetWidth,
        height: targetHeight,
        top: targetTop,
        right: targetRight,
        left: targetLeft,
        yPercent: targetYPercent,
        xPercent: targetXPercent,
        opacity: 1,
        borderRadius: targetBorderRadius,
      });
    }

    if (this._img) {
      this._img.style.objectPosition = 'center top';
      this._img.style.transform = '';
    }

    const label = document.getElementById('avatar-corner-label');
    if (label && window.gsap) gsap.to(label, { opacity: 0, duration: 0.3 });
  }

  /* ── TO CORNER ── */
  toCorner() {
    this.mode = 'corner';
    const c = this.container;
    c.classList.remove('mode-hero');
    c.classList.add('mode-corner');

    // Reset tilt
    this.tilt.x = 0;
    this.tilt.y = 0;
    if (this._img) this._img.style.transform = '';

    let targetWidth = '86px';
    let targetHeight = '86px';
    let targetTop = '76px';
    let targetLeft = '18px';

    const w = window.innerWidth;
    if (w <= 950) {
      targetWidth = '54px';
      targetHeight = '54px';
      targetTop = '80px';
      targetLeft = '16px';
    }

    if (window.gsap) {
      gsap.killTweensOf(c);
      gsap.to(c, {
        duration: 0.75,
        ease: 'power3.inOut',
        width:   targetWidth,
        height:  targetHeight,
        top:     targetTop,
        left:    targetLeft,
        right:   'auto',
        yPercent: 0,
        xPercent: 0,
        opacity: 0.92,
        borderRadius: '50%',
      });
    }

    const label = document.getElementById('avatar-corner-label');
    if (label && window.gsap) gsap.to(label, { opacity: 0, duration: 0.3, delay: 0.9 });
  }
}

/* ── GLOBAL INIT ── */
let _avatar = null;

function initAvatar() {
  if (_avatar) return; // already initialized
  _avatar = new AvatarEngine('avatar-container');
  // Start in hero mode (home page loads first)
  setTimeout(() => _avatar.toHero(), 100);
}

window.avatarNavigate = function(pageId) {
  if (!_avatar) return;
  if (pageId === 'home') _avatar.toHero();
  else                   _avatar.toCorner();
};
