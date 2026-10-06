/* Champasen — site interactions (GSAP + ScrollTrigger) */
(() => {
  document.documentElement.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);

  const C = {
    ink: '#1d1335', purple: '#482e87', lilac: '#beacec', green: '#13a052',
    greenLight: '#7fd39c', gold: '#e9a631', goldLight: '#f6cf7c', cream: '#fbf7ef'
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- shape library (petal motif from the Champasen mark) ---------- */
  const SHAPES = {
    petal: 'M0-18C7-10 12-3 11 5C10 13 5 18 0 18C-5 18-10 13-11 5C-12-3-7-10 0-18Z',
    leaf: 'M-18 0C-11-11 11-11 18 0C11 11-11 11-18 0Z',
    hook: 'M-2-18C8-12 14-2 12 7C10 15 2 19-5 16C-11 13-12 5-8 0C-4-5 3-4 3 1C3 4 0 5-2 4C1 8 7 6 8 0C9-7 4-14-2-18Z',
    grain: 'M0-14C5-9 6-3 6 2C6 9 3 14 0 14C-3 14-6 9-6 2C-6-3-5-9 0-14Z',
    pellet: 'M-10-6H10A6 6 0 0 1 10 6H-10A6 6 0 0 1-10-6Z',
    flower: 'M0 0C-3-6-3-14 0-19C3-14 3-6 0 0ZM0 0C6-3 13-1 17 3C11 6 4 5 0 0ZM0 0C-6-3-13-1-17 3C-11 6-4 5 0 0Z'
  };
  const makeSvg = (w, h) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', w); s.setAttribute('height', h);
    s.setAttribute('viewBox', `${-w / 2} ${-h / 2} ${w} ${h}`);
    return s;
  };
  const shapeEl = (name, color, size = 40) => {
    const s = makeSvg(size, size);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', SHAPES[name]);
    p.setAttribute('fill', color);
    p.setAttribute('transform', `scale(${size / 40})`);
    s.appendChild(p);
    s.style.marginLeft = s.style.marginTop = `${-size / 2}px`;
    return s;
  };
  // seeded random so the pattern is the same on every visit
  const rng = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(20260);

  /* ---------- hero background pattern ---------- */
  (function buildPattern() {
    const svg = document.getElementById('heroPattern');
    const W = 1600, H = 1000;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const tones = ['#efe7d6', '#ebe4f7', '#e2f1e7'];
    const names = ['petal', 'leaf', 'hook', 'flower', 'petal', 'leaf'];
    const placed = [];
    let tries = 0;
    while (placed.length < 95 && tries++ < 4000) {
      const x = rng() * W, y = rng() * H, s = 1.6 + rng() * 2.6;
      if (placed.some(p => Math.hypot(p.x - x, p.y - y) < (p.s + s) * 17)) continue;
      placed.push({ x, y, s });
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', SHAPES[names[Math.floor(rng() * names.length)]]);
      p.setAttribute('fill', tones[Math.floor(rng() * tones.length)]);
      p.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${Math.floor(rng() * 360)}) scale(${s.toFixed(2)})`);
      svg.appendChild(p);
    }
  })();

  /* ---------- burst helper: shapes that spring out from a point ---------- */
  function makeBurst(container, items) {
    const els = items.map(([name, color, size]) => {
      const el = shapeEl(name, color, size);
      container.appendChild(el);
      return el;
    });
    gsap.set(els, { scale: 0, x: 0, y: 0, rotation: 0 });
    return {
      show(delay = 0) {
        els.forEach((el, i) => {
          const [, , , x, y, r] = items[i];
          gsap.to(el, { x, y, rotation: r, scale: 1, duration: 1.3, delay: delay + i * 0.025, ease: 'elastic.out(1, 0.45)', overwrite: true });
        });
      },
      hide() {
        gsap.to(els, { x: 0, y: 0, rotation: 0, scale: 0, duration: 0.35, ease: 'power2.in', stagger: 0.01, overwrite: true });
      }
    };
  }
  // [shape, colour, size, x, y, rotation]
  const tabBurst = makeBurst(document.querySelector('.menu-tab__burst'), [
    ['leaf', C.greenLight, 50, -168, 2, -20], ['petal', C.gold, 54, -132, 40, -60],
    ['flower', C.green, 66, -90, 74, 15], ['pellet', C.goldLight, 38, -46, 94, 25],
    ['hook', C.lilac, 56, -4, 104, 160], ['petal', C.green, 52, 42, 96, 40],
    ['flower', C.gold, 62, 86, 74, -20], ['leaf', C.lilac, 50, 128, 42, 30],
    ['grain', C.goldLight, 40, 164, 8, 50], ['petal', C.greenLight, 36, 190, -8, 110]
  ]);
  const heroCluster = makeBurst(document.getElementById('heroCluster'), [
    ['flower', C.gold, 80, -40, -260, 10], ['leaf', C.green, 70, 10, -170, -25],
    ['petal', C.lilac, 64, -90, -120, -50], ['hook', C.goldLight, 60, 40, -80, 20],
    ['flower', C.green, 76, -60, -20, 45], ['pellet', C.gold, 40, 30, 20, -20],
    ['leaf', C.greenLight, 58, -120, 50, 35], ['grain', C.cream, 40, -10, 70, 60],
    ['petal', C.gold, 54, 60, 90, 140]
  ]);

  /* ---------- menu tab + panel ---------- */
  const tab = document.getElementById('menuTab');
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  const panelBg = panel.querySelector('.menu-panel__bg');
  const panelItems = panel.querySelectorAll('.menu-panel__logo, .menu-links li');
  panelItems.forEach(el => el.setAttribute('data-menu-item', ''));
  let menuOpen = false;

  const tabScale = () => (innerWidth < 768 ? 0.8 : 1);
  gsap.set(tab, { xPercent: -50, x: 0, y: 0, scale: tabScale(), transformOrigin: '50% 0' });

  tab.addEventListener('mouseenter', () => { tab.classList.add('is-hover'); if (!menuOpen) tabBurst.show(); });
  tab.addEventListener('mouseleave', () => { tab.classList.remove('is-hover'); if (!menuOpen) tabBurst.hide(); });

  function openMenu() {
    menuOpen = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    tab.classList.add('is-open');
    document.body.classList.add('menu-open');
    // full-screen panel on small screens: keep the tab (now "Close") at the top
    const h = innerWidth < 1024 ? 0 : panel.offsetHeight;
    gsap.to(panelBg, { yPercent: 0, duration: 0.9, ease: 'power4.out', overwrite: true });
    gsap.to(tab, { y: h - 2, duration: 0.9, ease: 'power4.out', overwrite: true });
    gsap.fromTo(panelItems, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, delay: 0.25, ease: 'power3.out', overwrite: true });
    if (innerWidth >= 1024) tabBurst.show(0.2); else tabBurst.hide();
  }
  function closeMenu() {
    menuOpen = false;
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    tab.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    gsap.to(panelItems, { opacity: 0, duration: 0.2, overwrite: true });
    gsap.to(panelBg, { yPercent: -101, duration: 0.6, ease: 'power3.inOut', overwrite: true });
    gsap.to(tab, { y: 0, duration: 0.6, ease: 'power3.inOut', overwrite: true, onComplete: () => { if (!menuOpen) panel.classList.remove('is-open'); } });
    if (!tab.matches(':hover')) tabBurst.hide();
  }
  gsap.set(panelBg, { y: 0, yPercent: -101 }); // hidden above the viewport
  btn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { closeMenu(); btn.focus(); } });
  panel.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => menuOpen && closeMenu()));

  /* ---------- social icons ---------- */
  const ICONS = {
    Facebook: '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z"/>',
    Instagram: '<path fill-rule="evenodd" d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8a2.7 2.7 0 0 0-2.7 2.7v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7zM12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 1.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2zM17 5.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/>',
    YouTube: '<path fill-rule="evenodd" d="M6 5.5h12A3.5 3.5 0 0 1 21.5 9v6a3.5 3.5 0 0 1-3.5 3.5H6A3.5 3.5 0 0 1 2.5 15V9A3.5 3.5 0 0 1 6 5.5zM10 9v6l5-3z"/>',
    LinkedIn: '<path d="M4.5 9h3v10.5h-3zM6 3.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h2.9v1.5c.5-.9 1.6-1.8 3.3-1.8 3.1 0 3.8 2 3.8 4.7v6.1h-3v-5.4c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8v5.5H10z"/>',
    TikTok: '<path d="M14 3h2.9c.2 2.1 1.6 3.6 3.6 3.8v2.9c-1.4 0-2.7-.4-3.6-1.1v6.4A5.5 5.5 0 1 1 11.4 9.6v3a2.6 2.6 0 1 0 2.6 2.4z"/>'
  };
  document.querySelectorAll('.socials').forEach(wrap => {
    wrap.innerHTML = Object.entries(ICONS).map(([n, d]) => `<a href="#" aria-label="${n}"><svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg></a>`).join('');
  });

  /* ---------- hand-drawn underline on highlighted words ---------- */
  const MARK_D = 'M2 13C28 7 62 5 100 7.5C138 10 170 9 198 5';
  document.querySelectorAll('.mark').forEach(m => {
    m.insertAdjacentHTML('beforeend', `<svg class="mark__line" viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true"><path d="${MARK_D}" pathLength="1"/></svg>`);
  });
  const markPath = m => m.querySelector('.mark__line path');
  if (reduceMotion) {
    gsap.set('.mark__line path', { strokeDashoffset: 0 });
  } else {
    document.querySelectorAll('.mark:not(.mark--hero)').forEach(m => {
      const inHero = m.closest('.hero');
      if (inHero) { gsap.to(markPath(m), { strokeDashoffset: 0, duration: 1.1, delay: 0.7, ease: 'power2.inOut' }); return; }
      ScrollTrigger.create({
        trigger: m, start: 'top 82%', once: true,
        onEnter: () => gsap.to(markPath(m), { strokeDashoffset: 0, duration: 1.1, delay: 0.3, ease: 'power2.inOut' })
      });
    });
  }

  /* ---------- product strip (marquee) ---------- */
  (function marquee() {
    const track = document.querySelector('.marquee__track');
    const items = ['Poultry feed', 'Cattle & livestock feed', 'Aquaculture feed', 'Export & logistics', 'Tested in every batch', 'Made to grow'];
    const sep = `<svg viewBox="-20 -20 40 40"><path d="${SHAPES.petal}" fill="${C.purple}"/></svg>`;
    const set = items.map(t => `<span class="marquee__item">${t}${sep}</span>`).join('');
    track.innerHTML = set + set; // two copies so the loop is seamless
  })();

  /* ---------- HERO: photo in a petal that opens to full screen ---------- */
  const hero = document.getElementById('hero');
  const stage = hero.querySelector('.hero__stage');
  const copyParts = document.getElementById('heroCopy').children;
  const slot = document.getElementById('heroSlot');
  const petal = document.getElementById('heroPetalPath');
  const media = document.getElementById('heroMedia');
  const mediaImg = media.querySelector('img');
  const shade = media.querySelector('.hero__shade');
  const pattern = document.getElementById('heroPattern');
  const lines = hero.querySelectorAll('.statement .line > span');
  const cue = document.getElementById('scrollCue');
  const logoDark = hero.querySelector('.hero__logo-set--dark');
  const logoLight = document.getElementById('heroLogoLight');
  const marqueeBand = document.getElementById('heroMarquee');
  const statementMark = markPath(document.getElementById('statementMark'));
  // the petal path lives in a 100x100 box; this circle always fits inside it
  const PETAL = { cx: 50, cy: 62, r: 34 };
  const geo = { x0: 0, y0: 0, sx0: 1, sy0: 1, W: 0, H: 0, k1: 1, fx: 0, fy: 0, tx: 0, ty: 0, s0: 1.12 };
  const FACE = { x: 0.715, y: 0.24, w: 1440, h: 829 }; // focal point in hero-farmer.jpg

  function measure() {
    const s = stage.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    geo.W = s.width; geo.H = s.height;
    geo.x0 = b.left - s.left + b.width * PETAL.cx / 100;
    geo.y0 = b.top - s.top + b.height * PETAL.cy / 100;
    geo.sx0 = b.width / 100; geo.sy0 = b.height / 100;
    // uniform scale at which the petal's inner circle covers the whole viewport
    geo.k1 = (Math.hypot(s.width, s.height) / 2 / PETAL.r) * 1.06;
    // where the face lands with object-fit: cover + the CSS object-position
    const k = Math.max(s.width / FACE.w, s.height / FACE.h);
    const dw = FACE.w * k, dh = FACE.h * k;
    const [px, py] = getComputedStyle(mediaImg).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    geo.fx = (s.width - dw) * px + FACE.x * dw;
    geo.fy = (s.height - dh) * py + FACE.y * dh;
    // at rest, pull the face into the wide part of the petal
    geo.tx = (b.left - s.left + b.width / 2) - geo.fx;
    geo.ty = (b.top - s.top + b.height * 0.45) - geo.fy;
    // smallest zoom that keeps the shifted photo covering the whole petal slot
    const L = b.left - s.left, T = b.top - s.top, R = L + b.width, B = T + b.height;
    geo.s0 = Math.max(1.12,
      (geo.fy + geo.ty - T) / geo.fy,
      (B - geo.fy - geo.ty) / (s.height - geo.fy),
      (geo.fx + geo.tx - L) / geo.fx,
      (R - geo.fx - geo.tx) / (s.width - geo.fx)) * 1.03;
    mediaImg.style.transformOrigin = `${geo.fx}px ${geo.fy}px`;
  }
  const open = { p: 0 };
  function renderOpen() {
    const e = open.p;
    const x = geo.x0 + (geo.W / 2 - geo.x0) * e;
    const y = geo.y0 + (geo.H / 2 - geo.y0) * e;
    // geometric interpolation keeps the growth feeling even
    const sx = geo.sx0 * Math.pow(geo.k1 / geo.sx0, e);
    const sy = geo.sy0 * Math.pow(geo.k1 / geo.sy0, e);
    const rot = -10 * (1 - e);
    petal.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-PETAL.cx} ${-PETAL.cy})`);
    const rest = 1 - Math.min(1, e / 0.85);
    const q = rest * rest * (3 - 2 * rest);
    mediaImg.style.transform = `translate(${(geo.tx * q).toFixed(1)}px, ${(geo.ty * q).toFixed(1)}px) scale(${(1 + (geo.s0 - 1) * q).toFixed(4)})`;
  }
  measure(); renderOpen();
  addEventListener('load', () => { measure(); renderOpen(); });
  document.fonts && document.fonts.ready.then(() => { measure(); renderOpen(); ScrollTrigger.refresh(); });

  if (!reduceMotion) {
    gsap.set(lines, { y: 0, yPercent: 110 });
    gsap.set(marqueeBand, { y: 0, yPercent: 101 });
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(cue, { opacity: 0, y: 20, duration: 0.08 }, 0)
      .to(copyParts, { opacity: 0, x: -80, duration: 0.2, stagger: 0.015, ease: 'power1.in' }, 0)
      .to(open, { p: 1, duration: 0.5, ease: 'power2.inOut', onUpdate: renderOpen }, 0)
      .to(pattern, { scale: 1.25, rotation: 6, duration: 0.5, transformOrigin: '50% 50%' }, 0)
      .to(shade, { opacity: 1, duration: 0.12 }, 0.42)
      .to(logoDark, { opacity: 0, duration: 0.1 }, 0.42)
      .to(logoLight, { opacity: 1, duration: 0.1 }, 0.42)
      .to(lines, { yPercent: 0, duration: 0.14, stagger: 0.07, ease: 'power3.out' }, 0.52)
      .to(statementMark, { strokeDashoffset: 0, duration: 0.12, ease: 'power2.inOut' }, 0.68)
      .to(marqueeBand, { yPercent: 0, duration: 0.1, ease: 'power2.out' }, 0.74)
      .to({}, { duration: 0.16 }); // hold on the statement before release
    let clusterShown = false;
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=300%', pin: true, scrub: 0.8, animation: tl,
      invalidateOnRefresh: true,
      onRefresh: () => { measure(); renderOpen(); },
      onUpdate: self => {
        const want = self.progress > 0.62;
        if (want !== clusterShown) { clusterShown = want; want ? heroCluster.show() : heroCluster.hide(); }
      }
    });
    cue.addEventListener('click', () => {
      const st = ScrollTrigger.getAll().find(t => t.trigger === hero);
      scrollTo({ top: st ? st.end : innerHeight, behavior: 'smooth' });
    });
  } else {
    cue.addEventListener('click', () => scrollTo({ top: innerHeight, behavior: 'smooth' }));
  }

  /* ---------- OUR JOURNEY: pinned horizontal timeline ---------- */
  (function journey() {
    const section = document.getElementById('journey');
    const track = document.getElementById('journeyTrack');
    const fill = document.getElementById('journeyFill');
    const line = track.querySelector('.journey__line');
    const items = [...track.querySelectorAll('.milestone')];
    const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    // fill the line to 60% across the screen (100% by the end) and light up the dots it has passed
    function progress(x) {
      const t = distance() ? Math.min(1, -x / distance()) : 1;
      const reach = -x + innerWidth * (0.6 + 0.4 * t) - line.offsetLeft;
      gsap.set(fill, { scaleX: Math.min(1, Math.max(0, reach / line.offsetWidth)) });
      items.forEach(m => m.classList.toggle('is-active', reach >= m.offsetLeft - line.offsetLeft));
    }
    if (reduceMotion) {
      track.parentElement.style.overflowX = 'auto';
      items.forEach(m => m.classList.add('is-active'));
      gsap.set(fill, { scaleX: 1 });
      return;
    }
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      // runs on every frame of the smoothed (scrubbed) motion, not just on scroll events
      onUpdate: () => progress(gsap.getProperty(track, 'x')),
      scrollTrigger: {
        trigger: section, start: 'top top', end: () => '+=' + distance(),
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onRefresh: () => progress(gsap.getProperty(track, 'x'))
      }
    });
    progress(0);
  })();

  /* ---------- reveal on scroll ---------- */
  if (!reduceMotion) {
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })
    });
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  /* ---------- image parallax ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-parallax]').forEach(img => {
      const n = +img.dataset.parallax;
      gsap.fromTo(img, { yPercent: -n }, {
        yPercent: n, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.to('.impact__mark', {
      rotation: 120, ease: 'none',
      scrollTrigger: { trigger: '.impact', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    const fmt = v => Math.round(v).toLocaleString('en-US') + suffix;
    if (reduceMotion) { el.textContent = fmt(end); return; }
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) })
    });
  });

  /* ---------- donut chart ---------- */
  (function donut() {
    const data = [
      ['Vietnam', 45, C.purple], ['Laos', 25, C.green],
      ['Cambodia', 18, C.gold], ['Other markets', 12, C.lilac]
    ];
    const svg = document.getElementById('donut');
    const legend = document.getElementById('legend');
    const r = 46, circ = 2 * Math.PI * r, gap = 1.5;
    let start = 0;
    const segs = data.map(([label, v, col]) => {
      const len = (v / 100) * circ;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 60); c.setAttribute('cy', 60); c.setAttribute('r', r);
      c.setAttribute('stroke', col);
      c.style.strokeDashoffset = -start;
      c.style.strokeDasharray = `0 ${circ}`;
      c.dataset.len = Math.max(0, len - gap);
      svg.appendChild(c);
      start += len;
      legend.insertAdjacentHTML('beforeend', `<li><i style="background:${col}"></i>${v}% ${label}</li>`);
      return c;
    });
    const draw = () => segs.forEach((c, i) => gsap.to(c, { strokeDasharray: `${c.dataset.len} ${circ}`, duration: 1.2, delay: i * 0.15, ease: 'power3.out' }));
    if (reduceMotion) segs.forEach(c => (c.style.strokeDasharray = `${c.dataset.len} ${circ}`));
    else ScrollTrigger.create({ trigger: svg, start: 'top 80%', once: true, onEnter: draw });
  })();

  /* ---------- floating petals (about + CTA band) ---------- */
  function scatter(container, count, palette, area) {
    for (let i = 0; i < count; i++) {
      const names = Object.keys(SHAPES);
      const el = shapeEl(names[i % names.length], palette[i % palette.length], 30 + rng() * 50);
      el.style.left = `${area.x + rng() * area.w}%`;
      el.style.top = `${area.y + rng() * area.h}%`;
      el.style.position = 'absolute';
      el.style.opacity = area.o ?? 1;
      container.appendChild(el);
      gsap.set(el, { rotation: rng() * 360 });
      if (!reduceMotion) {
        gsap.to(el, { y: '+=18', rotation: '+=14', duration: 3 + rng() * 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(el, { yPercent: -150 - rng() * 150, ease: 'none', scrollTrigger: { trigger: container.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }
  }
  scatter(document.querySelector('.cta-band__petals'), 12, [C.greenLight, C.gold, '#0e8c47', C.goldLight], { x: 2, y: 5, w: 96, h: 90, o: 0.9 });
  const aboutPetals = document.querySelector('.about__petals');
  [['flower', C.gold, 120, -60, 0, 10], ['leaf', C.green, 90, -10, 110, -30], ['petal', C.lilac, 80, -120, 120, 40]].forEach(([n, col, s, x, y, r]) => {
    const el = shapeEl(n, col, s);
    aboutPetals.appendChild(el);
    gsap.set(el, { x, y, rotation: r, position: 'absolute' });
    if (!reduceMotion) gsap.to(el, { y: y - 120, rotation: r + 40, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- misc ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  addEventListener('resize', () => gsap.set(tab, { scale: tabScale() }));
})();
