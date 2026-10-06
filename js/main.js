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

  /* ---------- language (VI / EN) ---------- */
  const DICT = window.CHAMPASEN_I18N;
  const LANG_KEY = 'champasen-lang';
  function readLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (DICT[q]) return q;
    try { const s = localStorage.getItem(LANG_KEY); if (DICT[s]) return s; } catch (e) { /* storage blocked */ }
    return 'vi'; // Vietnamese is the default language
  }
  let lang = readLang();
  const i18n = k => (DICT[lang][k] !== undefined ? DICT[lang][k] : DICT.vi[k]);
  const langHooks = []; // re-render text that main.js builds itself
  const onLang = fn => { langHooks.push(fn); fn(); };
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = i18n('meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', i18n('meta.desc'));
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = i18n(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      el.setAttribute(attr, i18n(key));
    }));
    const sw = document.getElementById('langSwitch');
    sw.classList.toggle('is-en', lang === 'en');
    sw.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    langHooks.forEach(fn => fn());
    document.documentElement.classList.remove('lang-loading');
  }
  applyLang();

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
    const tones = ['#2a1d4c', '#251942', '#30225a'];
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

  /* ---------- HERO: zoom into the bubble, reveal media + statement ---------- */
  const hero = document.getElementById('hero');
  const stage = hero.querySelector('.hero__stage');
  const question = document.getElementById('heroQuestion');
  const bubble = document.getElementById('bubble');
  const media = document.getElementById('heroMedia');
  const mediaImg = media.querySelector('img');
  const shade = media.querySelector('.hero__shade');
  const pattern = document.getElementById('heroPattern');
  const lines = hero.querySelectorAll('.statement .line > span');
  const cue = document.getElementById('scrollCue');
  const geo = { cx: 0, cy: 0, r: 0, max: 1 };

  function measure() {
    const prev = question.style.transform;
    question.style.transform = 'none';
    const s = stage.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const ring = parseFloat(getComputedStyle(bubble).borderTopWidth) || 0;
    geo.cx = b.left - s.left + b.width / 2;
    geo.cy = b.top - s.top + b.height / 2;
    geo.r = Math.max(2, b.width / 2 - ring * 0.6);
    // scale needed for the ring to clear the furthest corner of the viewport
    const far = Math.max(
      Math.hypot(geo.cx, geo.cy), Math.hypot(s.width - geo.cx, geo.cy),
      Math.hypot(geo.cx, s.height - geo.cy), Math.hypot(s.width - geo.cx, s.height - geo.cy)
    );
    geo.max = (far / geo.r) * 1.08;
    question.style.transform = prev;
    question.style.transformOrigin = `${geo.cx}px ${geo.cy}px`;
  }
  const zoom = { p: 0 };
  const TEXT_CAP = 14; // max headline scale before it fades out
  const FACE = { x: 0.715, y: 0.24, w: 1440, h: 829 }; // focal point in hero-farmer.jpg
  function renderZoom() {
    const scale = Math.pow(geo.max, zoom.p); // exponential = even-feeling zoom
    // Cap the headline's scale: scaling text ~90x makes Chrome rasterise a gigantic
    // layer, which exhausts GPU tile memory and leaves the hero and the fixed menu tab
    // half-painted when scrolling back up. Past the cap the text fades out and only the
    // (cheap) clip-path circle keeps growing.
    const capP = Math.log(TEXT_CAP) / Math.log(geo.max);
    const fadeT = Math.min(1, Math.max(0, (zoom.p - capP * 0.7) / (capP * 0.3)));
    const textHidden = zoom.p >= capP;
    question.style.transform = `scale(${Math.min(scale, TEXT_CAP).toFixed(4)})`;
    question.style.opacity = (1 - fadeT * fadeT * (3 - 2 * fadeT)).toFixed(3);
    question.style.visibility = textHidden ? 'hidden' : 'visible';
    // where the face lands with object-fit: cover, then pull it under the bubble
    const sw = stage.clientWidth, sh = stage.clientHeight;
    const k = Math.max(sw / FACE.w, sh / FACE.h);
    const fx = (sw - FACE.w * k) / 2 + FACE.x * FACE.w * k;
    const fy = (sh - FACE.h * k) / 2 + FACE.y * FACE.h * k;
    const q = 1 - Math.min(1, zoom.p / 0.85);
    const ease = q * q * (3 - 2 * q);
    mediaImg.style.transformOrigin = `${fx}px ${fy}px`;
    mediaImg.style.transform = `translate(${((geo.cx - fx) * ease).toFixed(1)}px, ${((geo.cy - fy) * ease).toFixed(1)}px) scale(${(1 + 0.5 * ease).toFixed(3)})`;
    media.style.clipPath = `circle(${(geo.r * scale).toFixed(1)}px at ${geo.cx}px ${geo.cy}px)`;
  }
  measure(); renderZoom();
  addEventListener('load', () => { measure(); renderZoom(); });
  document.fonts && document.fonts.ready.then(() => { measure(); renderZoom(); ScrollTrigger.refresh(); });

  if (!reduceMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(cue, { opacity: 0, y: 20, duration: 0.08 }, 0)
      .to(zoom, { p: 1, duration: 0.5, ease: 'power2.in', onUpdate: renderZoom }, 0)
      .to(pattern, { scale: 1.4, rotation: 8, duration: 0.5, transformOrigin: '50% 50%' }, 0)
      .to(shade, { opacity: 1, duration: 0.12 }, 0.5)
      .to(lines, { yPercent: 0, duration: 0.14, stagger: 0.07, ease: 'power3.out' }, 0.55)
      .to({}, { duration: 0.18 }); // hold on the statement before release
    gsap.set(lines, { y: 0, yPercent: 110 });
    let clusterShown = false;
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=300%', pin: true, scrub: 0.8, animation: tl,
      invalidateOnRefresh: true,
      onRefreshInit: () => { zoom.p = 0; renderZoom(); },
      onRefresh: () => { measure(); renderZoom(); },
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
    const fmt = v => Math.round(v).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') + suffix;
    const o = { v: reduceMotion ? end : 0 };
    onLang(() => { el.textContent = fmt(o.v); });
    if (reduceMotion) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) })
    });
  });

  /* ---------- donut chart ---------- */
  (function donut() {
    const data = [[45, C.purple], [25, C.green], [18, C.gold], [12, C.lilac]]; // share %, colour
    const svg = document.getElementById('donut');
    const legend = document.getElementById('legend');
    const r = 46, circ = 2 * Math.PI * r, gap = 1.5;
    let start = 0;
    const segs = data.map(([v, col]) => {
      const len = (v / 100) * circ;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 60); c.setAttribute('cy', 60); c.setAttribute('r', r);
      c.setAttribute('stroke', col);
      c.style.strokeDashoffset = -start;
      c.style.strokeDasharray = `0 ${circ}`;
      c.dataset.len = Math.max(0, len - gap);
      svg.appendChild(c);
      start += len;
      return c;
    });
    onLang(() => {
      const names = i18n('chart.markets');
      legend.innerHTML = data.map(([v, col], i) => `<li><i style="background:${col}"></i>${v}% ${names[i]}</li>`).join('');
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

  /* ---------- language switch ---------- */
  document.querySelectorAll('#langSwitch [data-lang]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage blocked */ }
    applyLang();
    ScrollTrigger.refresh(); // text lengths changed, so re-measure the bubble, pins and positions
  }));

  /* ---------- misc ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  addEventListener('resize', () => gsap.set(tab, { scale: tabScale() }));
})();
