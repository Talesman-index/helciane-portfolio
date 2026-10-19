/* =========================================================
   Portfolio Camille Chesneau — animations
   Bibliothèques chargées depuis un CDN (facultatives) :
   - Lenis : défilement fluide
   - GSAP + SplitText : titres, animation d'arrivée, transitions
   Sans connexion, le site fonctionne quand même, avec des effets plus simples.
   ========================================================= */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const G = window.gsap || null;
  const Split = window.SplitText || null;
  if (G && Split) G.registerPlugin(Split);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const isMobile = () => innerWidth <= 760;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- 0a. Palettes chromatiques & Thèmes ---------- */
  const PALETTES = [
    { id: 'matcha', label: 'Matcha & Sorbet', desc: 'Organique, sauge & sorbet framboise', swatch: 'matcha' }
  ];

  const getSavedPalette = () => 'matcha';

  const applyPalette = (id = 'matcha', save = true) => {
    root.setAttribute('data-palette', 'matcha');
    if (save) {
      try { localStorage.setItem('cc-palette', 'matcha'); } catch (e) {}
    }
  };

  // Restauration immédiate (palette Matcha & Sorbet active par défaut)
  applyPalette('matcha', true);
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(1500)]);
  // « gate » s'ouvre quand l'animation d'arrivée / la transition laisse voir la page
  let openGate; const gate = new Promise(r => { openGate = r; });

  /* ---------- 0. Calques révélés par la bulle (copies inversées) ---------- */
  const fluid = () => { const f = document.createElement('div'); f.className = 'fluid'; f.setAttribute('aria-hidden', 'true'); return f; };
  if (!reduce) {
    [$('.intro .scene')].forEach(src => {
      if (!src) return;
      const c = src.cloneNode(true);
      c.classList.add('reveal-layer', src.classList.contains('scene') ? 'scene-reveal' : 'title-reveal');
      c.setAttribute('aria-hidden', 'true');
      $$('.halo', c).forEach(n => n.remove());
      $$('img', c).forEach(n => { n.alt = ''; });
      $$('[data-cursor]', c).forEach(n => n.removeAttribute('data-cursor'));
      c.prepend(fluid());
      src.after(c);
    });
  }

  /* ---------- 1. Effets sonores (synthétisés, désactivés : plus de bouton son dans le menu) ---------- */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master = null, noise = null, on = false, last = 0;
    function ensure() {
      if (!AC) return null;
      // le navigateur n'autorise le son qu'après un premier clic ou une touche
      if (!ctx && navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
      if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(f1, f2, dur, vol, type = 'sine', delay = 0) {
      const c = ensure(); if (!c) return;
      const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(master); o.start(t); o.stop(t + dur + .02);
    }
    function whoosh(dur = .75, vol = .07) {
      const c = ensure(); if (!c) return;
      if (!noise) {
        noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
        const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = noise; f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(280, t); f.frequency.exponentialRampToValueAtTime(2400, t + dur * .6); f.frequency.exponentialRampToValueAtTime(800, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .35); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur);
    }
    const buttons = [];
    const sync = () => buttons.forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (on) ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, ensure, { once: true, passive: true }));
    return {
      get on() { return on; },
      hover() { if (!on) return; const n = performance.now(); if (n - last < 70) return; last = n; tone(2300, 1500, .05, .016); },
      click() { if (on) { tone(620, 520, .12, .045, 'triangle'); tone(930, 880, .16, .03, 'sine', .05); } },
      whoosh() { if (on) whoosh(); },
      toggle() {
        on = !on; sync();
        try { localStorage.setItem('cc-sound', on ? '1' : '0'); } catch (e) {}
        if (on) { tone(523, 523, .3, .04); tone(784, 784, .4, .03, 'sine', .08); tone(1047, 1047, .5, .022, 'sine', .16); }
      },
      bind(b) { buttons.push(b); sync(); b.addEventListener('click', () => this.toggle()); }
    };
  })();
  const nav = $('.nav');
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target.closest('a, button, .skill, [data-lightbox] figure');
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) Sound.hover();
  });
  document.addEventListener('click', e => {
    if (e.target.closest('button:not(.sound), a[href^="mailto"]')) Sound.click();
  });

  /* ---------- 2. Défilement fluide (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .085, autoRaf: !G });
    if (G) { G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0); }
  }
  const stopScroll = () => lenis && lenis.stop();
  const startScroll = () => lenis && lenis.start();

  /* ---------- 3. Arrivée sur la page ---------- */
  // a) première visite : sur l'accueil, on arrive ultra zoomé dans une lettre du nom et on dézoome jusqu'au nom entier,
  //    puis la petite phrase, le menu et l'invitation à défiler arrivent (ailleurs : le rideau se lève)
  let arrive = 0;   // 1 = zoom maximal dans le nom, 0 = nom entier (combiné au zoom du défilement)
  function plainArrival() {
    store.set('cc-visited', '1');
    root.classList.remove('boot', 'first');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));
    return wait(380);
  }
  function bootIntro() {
    const box = $('.intro');
    if (!box || !$('.intro-cover', box) || location.hash) return plainArrival();
    store.set('cc-visited', '1');
    stopScroll();
    arrive = 1;
    // petits éléments : ils glissent et apparaissent (propriétés à part, pour ne pas gêner le zoom au défilement)
    const ui = [...$$('.cover-kicker', box).map(el => ({ el, d: 22, p: 0 })), ...$$('.intro-hint', box).map(el => ({ el, d: 16, p: 0 })), ...$$('.nav').map(el => ({ el, d: -28, p: 0 }))];
    const show = u => { u.el.style.translate = u.p < 1 ? `0 ${((1 - u.p) * u.d).toFixed(1)}px` : ''; u.el.style.filter = u.p < 1 ? `opacity(${u.p.toFixed(3)})` : ''; };
    // le décor vu à travers les lettres recule lui aussi
    const scenes = $$('.scene', box), back = { s: 1.3 };
    const depth = () => scenes.forEach(sc => { sc.style.scale = back.s === 1 ? '' : back.s.toFixed(4); });
    ui.forEach(show); depth();
    root.classList.remove('boot', 'first'); root.classList.add('loaded');
    return new Promise(resolve => {
      Promise.race([Promise.all(['800 1em Unbounded', 'italic 1em "Instrument Serif"'].map(f => document.fonts ? document.fonts.load(f) : 0)), wait(1200)])
        .catch(() => {}).then(() => {
          const z = { v: 1 }, D = 2.6;
          G.timeline({ delay: .15, onComplete: startScroll })
            .to(z, { v: 0, duration: D, ease: 'power3.out', onUpdate: () => { arrive = z.v; update(); } }, 0)
            .to(back, { s: 1, duration: D, ease: 'power3.out', onUpdate: depth }, 0)
            .to(ui.filter(u => u.d === 22), { p: 1, duration: 1, ease: 'power3.out', onUpdate() { this.targets().forEach(show); } }, 1.2)
            .to(ui.filter(u => u.d < 0), { p: 1, duration: 1, ease: 'power3.out', onUpdate() { this.targets().forEach(show); } }, 1.35)
            .add(resolve, 1.3)
            .to(ui.filter(u => u.d === 16), { p: 1, duration: .9, ease: 'power2.out', onUpdate() { this.targets().forEach(show); } }, 1.75);
        });
    });
  }
  // b) on arrive depuis une carte : l'image s'est agrandie, elle se pose sur la couverture
  function arriveFromCard() {
    const src = store.get('cc-vt'); store.del('cc-vt');
    const cover = $('.cover'), img = cover && $('img', cover);
    root.classList.add('loaded');
    if (!G || !img || !src) { root.classList.remove('boot', 'vt'); return Promise.resolve(); }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true });
    stopScroll();
    const ov = document.createElement('div');
    ov.className = 'vt-overlay';
    ov.innerHTML = `<img src="${img.currentSrc || img.src}" alt="">`;
    document.body.append(ov);
    root.classList.remove('boot');
    return new Promise(resolve => {
      Promise.race([Promise.all([img.decode ? img.decode().catch(() => {}) : 0, fontsReady]), wait(1200)]).then(() => {
        update();
        const r = cover.getBoundingClientRect(), k = r.width / (cover.offsetWidth || 1);
        const cs = getComputedStyle(cover);
        const rad = (parseFloat(cs.borderTopLeftRadius) || 0) * k;
        // couverture encadrée (pages réalisations) : le cadre rose se dessine pendant que l'image se pose
        const bw = (parseFloat(cs.borderTopWidth) || 0) * k, frame = {};
        if (bw) {
          Object.assign(ov.style, { borderStyle: 'solid', borderColor: cs.borderTopColor, borderWidth: '0px', background: cs.borderTopColor });
          ['Top', 'Right', 'Bottom', 'Left'].forEach(s => { frame['border' + s + 'Width'] = bw; });
        }
        G.timeline({ delay: .1, onComplete: () => { root.classList.remove('vt'); ov.remove(); startScroll(); } })
          .to(ov, { top: r.top, left: r.left, width: r.width, height: r.height, borderRadius: rad, ...frame, duration: 1.25, ease: 'expo.inOut' })
          .add(resolve, .45);
      });
    });
  }
  let entry;
  if (reduce) {
    root.classList.remove('boot', 'first', 'vt'); root.classList.add('loaded'); store.set('cc-visited', '1');
    entry = Promise.resolve();
  } else if (root.classList.contains('first') && G) {
    entry = bootIntro();
  } else if (root.classList.contains('vt')) {
    entry = arriveFromCard();
  } else {
    entry = plainArrival();
  }
  entry.then(openGate);

  /* ---------- 4. Départ vers une autre page ---------- */
  // une image s'agrandit jusqu'à remplir l'écran, puis la page suivante s'ouvre (elle s'y pose en couverture)
  function morph(href, src, r, radius, rot = 0) {
    const ov = document.createElement('div');
    ov.className = 'vt-overlay';
    Object.assign(ov.style, { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: radius + 'px' });
    ov.innerHTML = `<img src="${src}" alt="">`;
    document.body.append(ov);
    stopScroll(); Sound.whoosh();
    store.set('cc-vt', src);
    G.to('.nav', { autoAlpha: 0, y: -24, duration: .5, ease: 'power2.in' });
    G.fromTo(ov, { rotation: rot }, { top: 0, left: 0, width: innerWidth, height: innerHeight, borderRadius: 0, rotation: 0, duration: 1, ease: 'expo.inOut', onComplete: () => { location.href = href; } });
    return true;
  }
  // carte de l'accueil
  function leaveViaCard(card) {
    const media = $('.media', card), img = media && $('img', media);
    if (!G || !img || !img.naturalWidth) return false;
    return morph(card.href, img.currentSrc || img.src, media.getBoundingClientRect(), 18);
  }
  // lien « catégorie suivante » : la carte d'aperçu (à droite du titre) s'agrandit
  function leaveViaNext(a) {
    const pv = $('.next-preview', a), img = pv && $('img', pv);
    if (!G || !img || !img.complete || !img.naturalWidth) return false;
    return morph(a.href, img.currentSrc || img.src, pv.getBoundingClientRect(), 14);
  }
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    root.classList.remove('leaving', 'vt', 'boot'); root.classList.add('loaded');
    $$('.vt-overlay').forEach(n => n.remove());
    if (G) G.set('.nav', { clearProps: 'opacity,visibility,transform' });
    startScroll();
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host) return;
    const page = p => p.replace(/index\.html$/, '');
    if (page(url.pathname) === page(location.pathname)) {
      // même page : défilement fluide vers l'ancre (ou vers le haut)
      const t = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : 0;
      if (lenis && t !== null) { e.preventDefault(); Sound.click(); lenis.scrollTo(t, { duration: 1.6 }); }
      return;
    }
    if (reduce) return;
    if (a.matches('.card') && leaveViaCard(a)) { e.preventDefault(); return; }
    if (a.matches('.next') && leaveViaNext(a)) { e.preventDefault(); return; }
    e.preventDefault();
    Sound.whoosh(); stopScroll();
    root.classList.add('leaving');
    setTimeout(() => { location.href = a.href; }, 700);
  });

  /* ---------- 5. Texte mot par mot, couleur de fond, apparitions ---------- */
  const wordBlocks = $$('[data-words]').map(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    return { el, words: $$('.w', el), lit: -1 };
  });
  const themeIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) document.body.dataset.theme = e.target.dataset.theme; });
  }, { rootMargin: '-50% 0px -50% 0px' });
  $$('[data-theme]:not(body)').forEach(s => themeIO.observe(s));
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { const t = e.target; revealIO.unobserve(t); gate.then(() => t.classList.add('in')); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal]').forEach(el => revealIO.observe(el));

  /* ---------- 6. Titres révélés lettre par lettre (SplitText) ---------- */
  // (sauf le titre du haut des pages réalisations, affiché tout de suite)
  const titles = $$('.t-title, .t-big, .p-hero h1, .proj-title').filter(el => !el.closest('.p-hero--v2'));
  if (G && Split && !reduce) {
    fontsReady.then(() => {
      const io = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const chars = en.target._chars;
        gate.then(() => G.to(chars, { yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: .024 }));
      }), { rootMargin: '0px 0px -8% 0px' });
      titles.forEach(el => {
        el.removeAttribute('data-reveal');
        const s = Split.create(el, { type: 'words,chars', mask: 'words', wordsClass: 'sw', charsClass: 'sc' });
        el._chars = s.chars;
        G.set(s.chars, { yPercent: 118, rotate: 7, transformOrigin: '0% 100%' });
        el.classList.add('split-ready');
        io.observe(el);
      });
    });
  } else {
    titles.forEach(el => el.classList.add('split-ready'));
  }

  /* ---------- 7. Éléments pilotés par le scroll ---------- */
  const hs = $$('.hscroll').map(sec => ({ sec, track: $('.track', sec), items: $$('.card', sec), count: $('[data-count]', sec), max: 0 }));
  hs.forEach(h => { const t = $('[data-total]', h.sec); if (t) t.textContent = h.items.length; });
  // mobile : carrousel au doigt, le compteur suit
  hs.forEach(h => h.track.addEventListener('scroll', () => {
    if (!isMobile() || !h.count || !h.items[0]) return;
    const step = h.items[0].offsetWidth + (parseFloat(getComputedStyle(h.track).columnGap) || 0);
    h.count.textContent = clamp(Math.round(h.track.scrollLeft / step) + 1, 1, h.items.length);
  }, { passive: true }));
  function coverLayout() {
    if (!I) return;
    const st = $('.intro-sticky'), w = st.clientWidth, h = st.clientHeight;
    $$('.cover-svg', intro).forEach(svg => svg.setAttribute('viewBox', `0 0 ${w} ${h}`));
    $$('.cover-rect', intro).forEach(rc => { rc.setAttribute('width', w); rc.setAttribute('height', h); });
    const texts = $$('.cover-text', intro);
    // on mesure le nom sans zoom : très agrandi, le navigateur le mesure mal (update() remet le zoom juste après)
    I.zooms.forEach(g => g.removeAttribute('transform'));
    let fs = Math.min(w * .11, h * .3);
    texts.forEach(t => { t.setAttribute('font-size', fs); t.setAttribute('x', w / 2); t.setAttribute('y', h / 2 + fs * .36); });
    const len = texts[0].getComputedTextLength();
    if (len) { fs = fs * (w * .86) / len; fs = Math.min(fs, h * .3); }
    texts.forEach(t => { t.setAttribute('font-size', fs); t.setAttribute('y', h / 2 + fs * .36); });
    // point de zoom : dans le trait gauche du « C » de Chesneau
    try { const b = texts[0].getExtentOfChar(8); I.o.x = b.x + b.width * .17; } catch (err) { I.o.x = w / 2; }
    I.o.y = h / 2;
    $$('.cover-kicker', intro).forEach(k => { k.style.top = `${h / 2 - fs * .62 - 40}px`; });
  }
  function layout() {
    coverLayout();
    hs.forEach(h => {
      if (isMobile() || reduce) { h.sec.style.height = ''; h.track.style.transform = ''; h.max = 0; if (reduce) h.track.style.overflowX = 'auto'; return; }
      h.max = Math.max(0, h.track.scrollWidth - innerWidth);
      h.sec.style.height = (h.max + innerHeight) + 'px';
    });
  }

  const bar = $('.progress');
  const intro = $('.intro');
  const I = intro && {
    cover: $$('.intro-cover, .cover-reveal', intro), zooms: $$('.zoom', intro), kick: $$('.cover-kicker, .intro-hint', intro),
    scene: $$('.scene', intro), text: $$('.scene-text', intro), photo: $$('.portrait-wrap', intro), o: { x: 0, y: 0 }
  };
  const timelines = $$('.timeline').map(t => ({ t, fill: $('.timeline-fill', t), steps: $$('.step', t) }));
  const parallax = $$('[data-parallax]');
  const covers = $$('[data-cover]');
  const vfulls = $$('.vfull').map(sec => ({ sec, media: $('.vfull-media', sec), video: $('video', sec), head: $('.vfull-head', sec), cap: $('.vfull-cap', sec), sound: $('.vfull-sound', sec) }));

  const css = (els, prop, v) => els.forEach(el => { el.style[prop] = v; });
  let ticking = false;
  function update() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (bar) bar.style.transform = `scaleX(${clamp(y / (document.documentElement.scrollHeight - vh || 1), 0, 1)})`;

    // Écran d'entrée : zoom à travers les lettres du nom
    if (I && !reduce) {
      const r = intro.getBoundingClientRect();
      const p = clamp(-r.top / (intro.offsetHeight - vh), 0, 1);
      const e0 = ease(clamp(p / .7, 0, 1)), e = Math.max(e0, arrive);
      const s = Math.pow(90, e);
      const tr = `translate(${I.o.x} ${I.o.y}) scale(${s.toFixed(4)}) translate(${-I.o.x} ${-I.o.y})`;
      I.zooms.forEach(g => g.setAttribute('transform', tr));
      const fade = 1 - clamp((e - .55) / .35, 0, 1);
      css(I.cover, 'opacity', fade.toFixed(3));
      css(I.cover, 'visibility', fade > 0 ? 'visible' : 'hidden');
      css(I.kick, 'opacity', (1 - clamp(p / .12, 0, 1)).toFixed(3));
      css(I.scene, 'transform', `scale(${(1.25 - e0 * .25).toFixed(4)})`);
      // les éléments arrivent par les côtés
      const e2 = ease(clamp((p - .35) / .4, 0, 1));
      css(I.text, 'transform', `translate3d(${(1 - e2) * -45}vw,0,0)`);
      css(I.text, 'opacity', e2.toFixed(3));
      css(I.photo, 'transform', `translate3d(${(1 - e2) * 45}vw,0,0) rotate(${(1 - e2) * 8}deg)`);
      css(I.photo, 'opacity', e2.toFixed(3));
    }

    if (!reduce) {
      wordBlocks.forEach(b => {
        const r = b.el.getBoundingClientRect();
        const n = Math.floor(clamp((vh * .85 - r.top) / (r.height + vh * .3), 0, 1) * b.words.length);
        if (n !== b.lit) { b.words.forEach((w, k) => w.classList.toggle('on', k < n)); b.lit = n; }
      });
      timelines.forEach(({ t, fill, steps }) => {
        const r = t.getBoundingClientRect();
        fill.style.transform = `scaleY(${clamp((vh * .6 - r.top) / r.height, 0, 1)})`;
        steps.forEach(s => s.classList.toggle('passed', s.getBoundingClientRect().top < vh * .6));
      });
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const s = parseFloat(el.dataset.parallax) || .1;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -s).toFixed(1)}px`;
      });
      covers.forEach(el => {
        const p = clamp((vh - el.getBoundingClientRect().top) / (vh * .9), 0, 1);
        el.style.transform = `scale(${.86 + p * .14})`;
        el.style.borderRadius = `${40 - p * 28}px`;
      });
      // Vidéo qui s'agrandit jusqu'au plein écran
      vfulls.forEach(v => {
        const r = v.sec.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = clamp(-r.top / (v.sec.offsetHeight - vh || 1), 0, 1);
        const e = ease(clamp(p / .55, 0, 1)), k = 1 - e, m = isMobile();
        v.media.style.clipPath = `inset(${(k * (m ? 34 : 30)).toFixed(2)}% ${(k * (m ? 6 : 22)).toFixed(2)}% ${(k * (m ? 22 : 10)).toFixed(2)}% round ${(k * 28).toFixed(1)}px)`;
        if (v.video) v.video.style.transform = `scale(${(1.18 - e * .18).toFixed(4)})`;
        if (v.head) { v.head.style.opacity = clamp(1 - e * 1.6, 0, 1).toFixed(3); v.head.style.transform = `translate3d(0,${(-e * 12).toFixed(2)}vh,0)`; }
        if (v.cap) v.cap.style.opacity = clamp((p - .62) / .18, 0, 1).toFixed(3);
        if (v.sound) { const o = clamp((e - .6) / .3, 0, 1); v.sound.style.opacity = o.toFixed(3); v.sound.style.visibility = o > 0 ? 'visible' : 'hidden'; }
      });
    }

    hs.forEach(h => {
      if (!h.max) return;
      const r = h.sec.getBoundingClientRect();
      const p = clamp(-r.top / (h.sec.offsetHeight - vh), 0, 1);
      h.track.style.transform = `translate3d(${-p * h.max}px,0,0)`;
      if (h.count) h.count.textContent = Math.round(p * (h.items.length - 1)) + 1;
    });
  }
  // avec Lenis, on recalcule dans la même image que le défilement (pas de décalage)
  if (lenis) lenis.on('scroll', update);
  else addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { layout(); update(); });
  addEventListener('load', () => { layout(); update(); });
  if (document.fonts) document.fonts.ready.then(() => { layout(); update(); });
  layout(); update();

  /* ---------- 8. Curseur + liens magnétiques ---------- */
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    const cur = $('.cursor'), label = $('span', cur);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); })();
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor || 'Voir'; cur.classList.add('big'); });
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });
    $$('.nav ul a, .nav .brand, .nav .cta, .sound, .btn, .mail, .back, .contact-links a, .foot a').forEach(el => {
      el.classList.add('is-magnetic');
      const k = el.matches('.mail') ? .4 : .32;
      const move = G
        ? (() => { const xTo = G.quickTo(el, 'x', { duration: .7, ease: 'elastic.out(1,.45)' }), yTo = G.quickTo(el, 'y', { duration: .7, ease: 'elastic.out(1,.45)' }); return (x, y) => { xTo(x); yTo(y); }; })()
        : (x, y) => { el.style.transform = `translate(${x}px,${y}px)`; };
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        move((e.clientX - r.left - r.width / 2) * k, (e.clientY - r.top - r.height / 2) * k);
      });
      el.addEventListener('mouseleave', () => move(0, 0));
    });
  }

  /* ---------- 9. Bulle liquide qui suit la souris et révèle les calques inversés ---------- */
  const stage = $('.intro-sticky'), baseScene = $('.intro .scene:not(.reveal-layer)'), halo = $('.halo');
  const layers = $$('.reveal-layer');
  if (stage && layers.length && !reduce) {
    let mx = 0, my = 0, active = false, hx = 0, hy = 0, R = 0, t = 0, vx = 0, vy = 0, ax = 0, ay = 0;
    const hist = [];
    const set = (cx, cy) => { mx = cx; my = cy; if (!active) { hx = cx; hy = cy; hist.length = 0; } active = true; };
    stage.addEventListener('mousemove', e => set(e.clientX, e.clientY));
    stage.addEventListener('mouseleave', () => { active = false; });
    stage.addEventListener('touchstart', e => set(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    stage.addEventListener('touchmove', e => set(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    stage.addEventListener('touchend', () => { active = false; });

    // le survol de la photo et du nom est recopié sur le calque inversé
    const sync = (sel) => {
      const base = $(sel, baseScene), copy = $('.scene-reveal ' + sel);
      if (!base || !copy) return;
      base.addEventListener('mouseenter', () => copy.classList.add('is-hover'));
      base.addEventListener('mouseleave', () => copy.classList.remove('is-hover'));
    };
    sync('.portrait'); sync('h1');

    const circle = (x, y, r) => `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 1 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 1 ${(-2 * r).toFixed(1)} 0Z`;
    (function loop() {
      t += .016;
      const px = hx, py = hy;
      hx += (mx - hx) * .18; hy += (my - hy) * .18;
      vx = hx - px; vy = hy - py;
      ax += (vx - ax) * .2; ay += (vy - ay) * .2;
      const speed = Math.hypot(ax, ay), ang = Math.atan2(ay, ax);
      const base = clamp(innerWidth * .085, 70, 140);
      R += ((active ? base + Math.min(speed, 30) * .8 : 0) - R) * .12;
      hist.unshift({ x: hx, y: hy }); if (hist.length > 26) hist.pop();

      const visible = R > .5;
      layers.forEach(L => {
        if (!visible) { L.style.clipPath = 'circle(0px at 50% 50%)'; return; }
        const r = L.getBoundingClientRect(), s = (r.width / L.offsetWidth) || 1;
        const lx = x => (x - r.left) / s, ly = y => (y - r.top) / s, rr = R / s;
        // tête : forme molle qui s'étire dans le sens du mouvement
        const stretch = Math.min(speed / 25, 1) * .35;
        let d = '';
        for (let k = 0; k <= 48; k++) {
          const th = k / 48 * Math.PI * 2;
          const wob = 1 + .07 * Math.sin(3 * th + t * 1.6) + .05 * Math.sin(5 * th - t * 2.1) + .03 * Math.sin(7 * th + t);
          const st = 1 + stretch * Math.cos(th - ang) * Math.cos(th - ang) - stretch * .4;
          const x = lx(hx) + Math.cos(th) * rr * wob * st, y = ly(hy) + Math.sin(th) * rr * wob * st;
          d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        d += 'Z';
        // queue : gouttes de plus en plus petites
        [[3, .62], [6, .46], [9, .34], [13, .24], [17, .16], [22, .1]].forEach(([i, f]) => {
          const p = hist[Math.min(i, hist.length - 1)];
          if (p) d += circle(lx(p.x), ly(p.y), rr * f * (.6 + Math.min(speed, 20) / 50));
        });
        L.style.clipPath = `path('${d}')`;
      });

      if (halo && baseScene && active) {
        const sr = baseScene.getBoundingClientRect();
        halo.style.transform = `translate3d(${mx - sr.left}px,${my - sr.top}px,0)`;
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 10. Cartes réalisations : image liquide au survol (WebGL) ---------- */
  // Une bulle suit la souris sur l'image : ondulations, décalage des couleurs
  // et version marine/pervenche/rose à l'intérieur, comme la bulle de l'accueil.
  // Le WebGL a besoin que le site soit servi (en ligne ou aperçu local) :
  // ouvert en double-clic, on garde le simple zoom en CSS.
  if (fine && !reduce) {
    const VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
    const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uTex;
uniform vec2 uRes,uImg,uMouse,uVel;
uniform float uHover,uTime;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
vec2 cov(vec2 uv){float rs=uRes.x/uRes.y,ri=uImg.x/uImg.y;vec2 s=rs<ri?vec2(rs/ri,1.):vec2(1.,ri/rs);return (uv-.5)*s+.5;}
void main(){
  vec2 asp=vec2(uRes.x/uRes.y,1.);
  vec2 d=(v-uMouse)*asp;
  float dist=length(d);
  float wob=(n(v*3.5+uTime*.35)-.5)+(n(v*7.-uTime*.5)-.5)*.5;
  float r=(.24+min(length(uVel),.05)*2.)*uHover;
  float edge=dist+wob*.16;
  float blob=smoothstep(r+.02,r-.02,edge);
  float rim=smoothstep(r+.022,r+.006,edge)-blob;
  float ripple=sin(dist*34.-uTime*5.)*.005*uHover*smoothstep(.8,0.,dist);
  vec2 flow=vec2(n(v*5.+uTime*.5),n(v*5.+7.3-uTime*.45))-.5;
  vec2 uv=(v-.5)*(1.-.06*uHover)+.5;
  uv+=normalize(d+.0001)*ripple/asp+flow*.04*blob-uVel*.6*blob;
  float sh=.003*uHover+.01*blob;
  vec3 c=vec3(texture2D(uTex,cov(uv+vec2(sh,0.))).r,texture2D(uTex,cov(uv)).g,texture2D(uTex,cov(uv-vec2(sh,0.))).b);
  float l=dot(c,vec3(.299,.587,.114));
  vec3 duo=mix(vec3(.059,.102,.29),vec3(.604,.651,.949),smoothstep(.08,.85,l));
  duo=mix(duo,vec3(1.,.561,.694),smoothstep(.6,1.,l)*.9);
  c=mix(c,duo,blob);
  c=mix(c,vec3(1.,.561,.694),clamp(rim,0.,1.)*.9);
  gl_FragColor=vec4(c,1.);
}`;
    $$('.card .media').forEach(media => {
      const img = $('img', media), anim = /\.gif($|\?)/i.test(img.getAttribute('src'));
      let st = null, ok = null, hover = 0, target = 0, mx = .5, my = .5, sx = .5, sy = .5, vx = 0, vy = 0, raf = 0, t = 0;
      function init() {
        const canvas = document.createElement('canvas');
        canvas.className = 'gl'; canvas.setAttribute('aria-hidden', 'true');
        const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
        if (!gl) return false;
        try {
          const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
          const pr = gl.createProgram();
          gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
          gl.linkProgram(pr); gl.useProgram(pr);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
          const loc = gl.getAttribLocation(pr, 'p');
          gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); // refusé en double-clic (file://)
          const u = {};
          ['uRes', 'uImg', 'uMouse', 'uVel', 'uHover', 'uTime'].forEach(k => { u[k] = gl.getUniformLocation(pr, k); });
          media.append(canvas); media.classList.add('has-gl');
          st = { canvas, gl, u };
          return true;
        } catch (err) { return false; }
      }
      function size() {
        const r = media.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
        st.canvas.width = Math.round(r.width * dpr); st.canvas.height = Math.round(r.height * dpr);
      }
      function render() {
        raf = 0;
        hover += (target - hover) * .07;
        const px = sx, py = sy;
        sx += (mx - sx) * .14; sy += (my - sy) * .14;
        vx += ((sx - px) - vx) * .2; vy += ((sy - py) - vy) * .2;
        t += .016;
        const { gl, u, canvas } = st;
        // image animée (GIF) : on recopie l'image à chaque fois pour que l'animation continue sous la bulle
        if (anim) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.uRes, canvas.width, canvas.height); gl.uniform2f(u.uImg, img.naturalWidth, img.naturalHeight);
        gl.uniform2f(u.uMouse, sx, sy); gl.uniform2f(u.uVel, vx, vy);
        gl.uniform1f(u.uHover, hover); gl.uniform1f(u.uTime, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (target === 0 && hover < .003) { media.classList.remove('gl-on'); return; }
        raf = requestAnimationFrame(render);
      }
      const point = e => { const r = media.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
      media.addEventListener('mouseenter', e => {
        if (ok === null) { if (!img.complete || !img.naturalWidth) return; ok = init(); }
        if (!ok) return;
        size(); point(e);
        if (hover < .01) { sx = mx; sy = my; }
        target = 1; media.classList.add('gl-on');
        if (!raf) raf = requestAnimationFrame(render);
      });
      media.addEventListener('mousemove', point);
      media.addEventListener('mouseleave', () => { target = 0; });
    });
  }

  /* ---------- 11. Galeries qu'on fait glisser (page passions) ---------- */
  $$('.drag').forEach(d => {
    const track = $('.drag-track', d), figs = $$('figure', track), line = $('.drag-bar i', d.parentNode);
    $$('img', track).forEach(i => { i.draggable = false; });
    if (!fine || reduce) {
      // au doigt : défilement natif avec aimantation
      d.classList.add('native');
      if (line) d.addEventListener('scroll', () => { const m = d.scrollWidth - d.clientWidth; line.style.transform = `scaleX(${m ? (d.scrollLeft / m).toFixed(3) : 1})`; }, { passive: true });
      return;
    }
    let x = 0, tx = 0, max = 0, down = false, sx = 0, st = 0, moved = 0, lastX = 0, v = 0, raf = 0;
    const measure = () => { max = Math.max(0, track.offsetWidth - d.clientWidth); tx = clamp(tx, -max, 0); kick(); };
    function loop() {
      raf = 0;
      x += (tx - x) * .09;
      const vel = tx - x;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      const sk = clamp(vel * .01, -3.5, 3.5).toFixed(3);
      figs.forEach(f => {
        f.style.transform = `skewX(${sk}deg)`;
        const r = f.getBoundingClientRect(), c = (r.left + r.width / 2) / innerWidth - .5;
        f.firstElementChild.style.transform = `translate3d(${(-c * 3.5).toFixed(2)}%,0,0) scale(1.08)`;
      });
      if (line) line.style.transform = `scaleX(${max ? clamp(-x / max, 0, 1).toFixed(3) : 1})`;
      if (down || Math.abs(tx - x) > .1) raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    d.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; moved = 0; sx = lastX = e.clientX; st = tx; v = 0;
      d.classList.add('grabbing'); kick();
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      let n = st + dx;
      if (n > 0) n *= .35;                       // élastique aux extrémités
      if (n < -max) n = -max + (n + max) * .35;
      tx = n; v = e.clientX - lastX; lastX = e.clientX; kick();
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = false; d.classList.remove('grabbing');
      tx = clamp(tx + v * 14, -max, 0); kick();  // lancer avec inertie
    });
    // un glisser n'ouvre pas la visionneuse
    d.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    d.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); tx = clamp(tx - e.deltaX, -max, 0); kick();
    }, { passive: false });
    // au clavier : la photo qui reçoit le focus revient dans le cadre
    d.addEventListener('focusin', e => {
      const f = e.target.closest('figure'); if (!f) return;
      d.scrollLeft = 0;
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      tx = clamp(-(f.offsetLeft - pad), -max, 0); kick();
    });
    addEventListener('resize', measure);
    addEventListener('load', measure);
    measure();
  });

  /* ---------- 12. Galerie & Visionneuse de Projets ---------- */
  let lb = $('.lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galerie de projets');
    lb.setAttribute('data-lenis-prevent', '');
    document.body.appendChild(lb);
  }

  // Structure HTML interne de la visionneuse
  lb.innerHTML = `
    <div class="lb-header">
      <div class="lb-meta">
        <div class="lb-meta-row">
          <span class="lb-badge">✦ Galerie</span>
          <h2 class="lb-title"></h2>
        </div>
        <p class="lb-caption"></p>
      </div>
      <div class="lb-actions">
        <button type="button" class="lb-btn lb-zoom" aria-label="Agrandir / Réduire le visuel" title="Zoomer (Z)">⤢</button>
        <button type="button" class="lb-btn lb-close" aria-label="Fermer la galerie (Échap)" title="Fermer (Échap)">
          <span class="lb-close-icon" aria-hidden="true">✕</span>
          <span class="lb-close-text">Fermer</span>
        </button>
      </div>
    </div>
    <div class="lb-stage">
      <button type="button" class="lb-prev" aria-label="Visuel précédent (←)" title="Précédent (←)">‹</button>
      <div class="lb-media-wrap">
        <img class="lb-img" alt="" src="" style="display:none">
        <video class="lb-video" controls playsinline loop style="display:none"></video>
      </div>
      <button type="button" class="lb-next" aria-label="Visuel suivant (→)" title="Suivant (→)">›</button>
    </div>
    <div class="lb-footer">
      <div class="lb-count-pill">
        <span class="lb-current">1</span> / <span class="lb-total">1</span>
      </div>
      <div class="lb-thumbs" aria-label="Vignettes de la galerie"></div>
      <span class="lb-hint">Naviguer avec ← / → · Fermer avec Échap</span>
    </div>
  `;

  const lbImg = $('.lb-img', lb);
  const lbVideo = $('.lb-video', lb);
  const lbWrap = $('.lb-media-wrap', lb);
  const lbTitle = $('.lb-title', lb);
  const lbCaption = $('.lb-caption', lb);
  const lbCur = $('.lb-current', lb);
  const lbTot = $('.lb-total', lb);
  const lbThumbs = $('.lb-thumbs', lb);
  const lbZoom = $('.lb-zoom', lb);
  const lbCloseBtn = $('.lb-close', lb);

  let galleryList = [];
  let currentIdx = 0;
  let previousFocus = null;

  const renderThumbs = () => {
    if (!lbThumbs) return;
    lbThumbs.innerHTML = '';
    if (galleryList.length <= 1) return;
    galleryList.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `lb-thumb ${idx === currentIdx ? 'is-active' : ''}`;
      btn.setAttribute('aria-label', `Voir visuel ${idx + 1} sur ${galleryList.length}`);
      const thumbSrc = item.thumb || item.src;
      btn.innerHTML = `<img src="${thumbSrc}" alt="">`;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        showItem(idx);
      });
      lbThumbs.appendChild(btn);
    });
  };

  const showItem = i => {
    if (!galleryList.length) return;
    currentIdx = (i + galleryList.length) % galleryList.length;
    const item = galleryList[currentIdx];

    lbWrap.classList.remove('is-zoomed');
    lbTitle.textContent = item.projectTitle || 'Projet';
    lbCaption.textContent = item.caption || '';
    lbCur.textContent = String(currentIdx + 1);
    lbTot.textContent = String(galleryList.length);

    if (item.type === 'video') {
      lbImg.style.display = 'none';
      lbImg.src = '';
      lbVideo.style.display = 'block';
      lbVideo.src = item.src;
      if (item.poster) lbVideo.poster = item.poster;
      const p = lbVideo.play();
      if (p) p.catch(() => {});
    } else {
      if (lbVideo) {
        lbVideo.pause();
        lbVideo.style.display = 'none';
        lbVideo.src = '';
      }
      lbImg.style.display = 'block';
      lbImg.style.opacity = '';
      lbImg.src = item.src;
      lbImg.alt = item.caption || item.projectTitle || '';
    }

    $$('.lb-thumb', lbThumbs).forEach((th, idx) => {
      const isAct = idx === currentIdx;
      th.classList.toggle('is-active', isAct);
      if (isAct) th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  };

  let lastOpenTime = 0;

  const openGallery = (items, startIdx = 0) => {
    if (!items || !items.length) return;
    galleryList = items;
    previousFocus = document.activeElement;
    lastOpenTime = Date.now();
    renderThumbs();
    showItem(startIdx);
    lb.classList.add('open');
    stopScroll();
    if (Sound && Sound.whoosh) Sound.whoosh();
    lbCloseBtn.focus({ preventScroll: true });
  };

  const closeGallery = () => {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lbWrap.classList.remove('is-zoomed');
    if (lbImg) {
      lbImg.style.display = 'none';
      lbImg.src = '';
    }
    if (lbVideo) {
      lbVideo.pause();
      lbVideo.src = '';
    }
    startScroll();
    if (Sound && Sound.whoosh) Sound.whoosh();
    if (previousFocus && previousFocus.focus) previousFocus.focus({ preventScroll: true });
  };

  const toggleZoom = () => {
    if (galleryList[currentIdx]?.type === 'video') return;
    lbWrap.classList.toggle('is-zoomed');
  };

  lb.addEventListener('click', e => {
    if (Date.now() - lastOpenTime < 280) return; // Eviter fermeture instantanee sur le clic d'ouverture
    if (e.target.closest('.lb-close')) {
      closeGallery();
    } else if (e.target.closest('.lb-prev')) {
      showItem(currentIdx - 1);
      if (Sound && Sound.click) Sound.click();
    } else if (e.target.closest('.lb-next')) {
      showItem(currentIdx + 1);
      if (Sound && Sound.click) Sound.click();
    } else if (e.target.closest('.lb-zoom')) {
      toggleZoom();
    } else if (e.target === lbImg) {
      toggleZoom();
    } else if (!e.target.closest('.lb-header') && !e.target.closest('.lb-footer') && (e.target === lb || e.target.classList.contains('lb-stage'))) {
      closeGallery();
    }
  });

  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeGallery();
    } else if (e.key === 'ArrowLeft') {
      showItem(currentIdx - 1);
    } else if (e.key === 'ArrowRight') {
      showItem(currentIdx + 1);
    } else if (e.key === 'z' || e.key === 'Z') {
      toggleZoom();
    }
  });

  let touchStartX = 0, touchStartY = 0;
  lb.addEventListener('touchstart', e => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    if (e.changedTouches && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) showItem(currentIdx + 1);
        else showItem(currentIdx - 1);
      }
    }
  }, { passive: true });

  const bindGalleryTriggers = () => {
    const projects = $$('article.proj');
    if (projects.length) {
      projects.forEach(proj => {
        const titleEl = proj.querySelector('.proj-title') || proj.querySelector('h2');
        const projTitle = titleEl ? titleEl.textContent.trim() : 'Projet';

        const visualFigures = $$('.gal-item, .gal-item--video, .poster, .anim, figure', proj)
          .filter(f => !f.closest('[data-clone]') && !!($('img', f) || $('video', f)));

        const projectItems = [];
        visualFigures.forEach(fig => {
          const v = $('video', fig);
          const im = $('img', fig);
          if (v) {
            const vSrc = v.currentSrc || $('source', v)?.src || v.src;
            if (vSrc) {
              projectItems.push({
                type: 'video',
                src: vSrc,
                poster: v.poster || (im ? im.src : ''),
                thumb: v.poster || (im ? im.src : ''),
                projectTitle,
                caption: `${projTitle} · Vidéo Motion / Animation`,
                fig
              });
            }
          } else if (im) {
            const imSrc = im.dataset.full || im.currentSrc || im.src;
            if (imSrc) {
              projectItems.push({
                type: 'image',
                src: imSrc,
                thumb: imSrc,
                projectTitle,
                caption: im.alt || `${projTitle} · Visuel`,
                fig
              });
            }
          }
        });

        projectItems.forEach((item, itemIdx) => {
          const fig = item.fig;
          if (!fig) return;
          const isVideoFigure = !!fig.querySelector('.player, video');

          fig.tabIndex = 0;
          fig.setAttribute('role', 'button');
          if (!isVideoFigure) {
            fig.setAttribute('data-cursor', 'Agrandir');
          }
          fig.setAttribute('aria-label', `Ouvrir dans la galerie : ${item.caption}`);

          const clickHandler = e => {
            if (e.target.closest('.player-ui, .pl-sound, .pl-seek, .pl-play, .play')) return;
            if (isVideoFigure && e.target.closest('.player, video')) return;
            e.preventDefault();
            e.stopPropagation();
            openGallery(projectItems, itemIdx);
          };

          fig.addEventListener('click', clickHandler);
          fig.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (isVideoFigure && e.target.closest('.player, video')) return;
              e.preventDefault();
              openGallery(projectItems, itemIdx);
            }
          });
        });
      });
    }

    $$('.drag-track, [data-lightbox]').forEach(track => {
      if (track.closest('article.proj')) return;
      const trackImgs = $$('img', track).filter(x => !x.closest('[data-clone]'));
      if (!trackImgs.length) return;
      const trackItems = trackImgs.map(im => ({
        type: 'image',
        src: im.dataset.full || im.currentSrc || im.src,
        thumb: im.dataset.full || im.currentSrc || im.src,
        projectTitle: document.title.split('·')[0].trim() || 'Création',
        caption: im.alt || 'Visuel artistique'
      }));

      trackImgs.forEach((im, idx) => {
        const fig = im.closest('figure') || im;
        fig.tabIndex = 0;
        fig.setAttribute('role', 'button');
        fig.setAttribute('data-cursor', 'Agrandir');
        fig.setAttribute('aria-label', `Agrandir : ${im.alt}`);
        const handler = e => {
          e.preventDefault();
          openGallery(trackItems, idx);
        };
        fig.addEventListener('click', handler);
        fig.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery(trackItems, idx);
          }
        });
      });
    });

    $$('.ph-visual .cover').forEach(cov => {
      const im = $('img', cov);
      if (!im) return;
      cov.tabIndex = 0;
      cov.setAttribute('role', 'button');
      cov.setAttribute('data-cursor', 'Agrandir');
      cov.setAttribute('aria-label', `Agrandir la couverture : ${im.alt}`);
      const covHandler = e => {
        e.preventDefault();
        openGallery([{
          type: 'image',
          src: im.dataset.full || im.currentSrc || im.src,
          thumb: im.dataset.full || im.currentSrc || im.src,
          projectTitle: $('h1')?.textContent.trim() || 'Projet',
          caption: im.alt || 'Visuel de présentation'
        }], 0);
      };
      cov.addEventListener('click', covHandler);
      cov.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          covHandler(e);
        }
      });
    });
  };

  bindGalleryTriggers();

  // Delegation globale infaillible pour agrandir tous les visuels et projets au clic
  document.addEventListener('click', e => {
    // Si la visionneuse est ouverte, ne pas reimporter
    if (lb && lb.classList.contains('open')) return;

    // Ne pas intercepter les controles video, sons ou liens
    if (e.target.closest('.player-ui, .pl-sound, .pl-seek, .pl-play, .play, video, a, button')) return;

    // Detecter tout element visuel d'un projet
    const visual = e.target.closest('.gal-item, .gal-media, .proj-media figure, .ph-visual .cover, [data-lightbox] figure, .poster, .anim');
    if (!visual) return;

    // Cas 1 : Couverture en en-tete de page de projet (.ph-visual .cover)
    if (visual.closest('.ph-visual')) {
      const im = $('img', visual.closest('.cover') || visual);
      if (!im) return;
      e.preventDefault();
      e.stopPropagation();
      openGallery([{
        type: 'image',
        src: im.dataset.full || im.currentSrc || im.src,
        thumb: im.dataset.full || im.currentSrc || im.src,
        projectTitle: $('h1')?.textContent.trim() || document.title.split('·')[0].trim() || 'Projet',
        caption: im.alt || 'Visuel de présentation'
      }], 0);
      return;
    }

    // Cas 2 : Visuel dans la galerie d'un projet
    const proj = visual.closest('article.proj') || visual.closest('section.projects') || visual.closest('.proj-media') || document;
    const figs = $$('.gal-item, .proj-media figure, [data-lightbox] figure, .poster, .anim', proj)
      .filter(f => !f.closest('[data-clone]') && !!($('img', f) || $('video', f)));

    if (!figs.length) return;

    const titleEl = proj.querySelector?.('.proj-title') || proj.querySelector?.('h2') || $('h1');
    const projTitle = titleEl ? titleEl.textContent.trim() : document.title.split('·')[0].trim();

    const items = [];
    figs.forEach(f => {
      const v = $('video', f);
      const im = $('img', f);
      if (v) {
        const vSrc = v.currentSrc || $('source', v)?.src || v.src;
        if (vSrc) {
          items.push({
            type: 'video',
            src: vSrc,
            poster: v.poster || (im ? im.src : ''),
            thumb: v.poster || (im ? im.src : ''),
            projectTitle: projTitle,
            caption: `${projTitle} · Vidéo Motion / Animation`,
            fig: f
          });
        }
      } else if (im) {
        const imSrc = im.dataset.full || im.currentSrc || im.src;
        if (imSrc) {
          items.push({
            type: 'image',
            src: imSrc,
            thumb: imSrc,
            projectTitle: projTitle,
            caption: im.alt || `${projTitle} · Visuel`,
            fig: f
          });
        }
      }
    });

    const targetFig = visual.closest('figure') || visual;
    let clickedIdx = items.findIndex(it => it.fig === targetFig || it.fig?.contains(targetFig) || targetFig.contains(it.fig));
    if (clickedIdx < 0) clickedIdx = 0;

    e.preventDefault();
    e.stopPropagation();
    openGallery(items, clickedIdx);
  });

  /* ---------- 13. Vidéos : lecture quand elles sont visibles ---------- */
  const vIO = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target; if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause();
  }), { threshold: .25 });
  $$('video[data-autoplay]').forEach(v => { v.muted = true; vIO.observe(v); });
  $$('.vfull-sound').forEach(b => {
    const v = $('video', b.closest('.vfull'));
    b.addEventListener('click', () => {
      v.muted = !v.muted;
      b.setAttribute('aria-pressed', !v.muted);
      b.textContent = v.muted ? 'Activer le son' : 'Couper le son';
      if (!v.muted) { const p = v.play(); if (p) p.catch(() => {}); }
    });
  });

  // Passions › Filmer et monter : choisir une vidéo dans la pellicule, changer de série
  $$('[data-yt]').forEach(yt => {
    const screen = $('[data-yt-screen]', yt), img = $('img', screen), title = $('.yt-title', screen), dur = $('.yt-dur--big', screen), now = $('.yt-now', screen);
    const items = $$('.yt-item', yt), tabs = $$('.yt-tab', yt);
    const show = btn => {
      $$('.yt-item button', yt).forEach(b => b.setAttribute('aria-pressed', b === btn));
      screen.classList.add('swap');
      const pre = new Image(); pre.src = `https://i.ytimg.com/vi/${btn.dataset.id}/maxresdefault.jpg`;
      const put = () => {
        img.src = pre.src; img.alt = `Miniature de la vidéo « ${btn.dataset.title} »`;
        title.textContent = btn.dataset.title; dur.textContent = btn.dataset.dur;
        screen.href = `https://www.youtube.com/watch?v=${btn.dataset.id}`;
        requestAnimationFrame(() => screen.classList.remove('swap'));
      };
      pre.decode ? pre.decode().then(put, put) : (pre.onload = put);
    };
    $$('.yt-item button', yt).forEach(b => b.addEventListener('click', () => show(b)));
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(o => o.setAttribute('aria-pressed', o === t));
      items.forEach(li => { li.hidden = li.dataset.set !== t.dataset.set; });
      now.textContent = t.firstChild.textContent.trim();
      const first = items.find(li => !li.hidden);
      if (first) { show($('button', first)); $('.yt-list', yt).scrollTo({ left: 0, behavior: 'smooth' }); }
    }));
  });
  // Passions › La photographie : les bandes défilent toutes seules, on peut les attraper pour les faire défiler (avec élan)
  $$('.photo-wall .pw-row').forEach(row => {
    const track = $('.pw-track', row), base = parseFloat(row.dataset.speed) || 40;
    let half = 0, x = 0, v = -base, down = false, moved = 0, sx = 0, x0 = 0, lx = 0, lt = 0, dv = 0, visible = true, prev = performance.now();
    const measure = () => { half = track.scrollWidth / 2; };
    measure(); addEventListener('resize', measure);
    $$('img', track).forEach(im => im.complete || im.addEventListener('load', measure, { once: true }));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(row);
    row.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; moved = 0; sx = lx = e.clientX; x0 = x; lt = performance.now(); dv = 0;
      row.classList.add('grabbing');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const now = performance.now(), dt = Math.max(8, now - lt);
      dv = dv * .5 + (e.clientX - lx) / dt * 1000 * .5; lx = e.clientX; lt = now;
      moved = Math.max(moved, Math.abs(e.clientX - sx));
      x = x0 + (e.clientX - sx);
    });
    const up = () => { if (!down) return; down = false; row.classList.remove('grabbing'); v = clamp(dv, -4000, 4000); };
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
    // après un glissé, le clic ne doit pas ouvrir la photo
    row.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
    (function loop(now) {
      const dt = Math.min(.05, (now - prev) / 1000); prev = now;
      if (!down && !reduce) { v += (-base - v) * (1 - Math.exp(-dt * 2.5)); x += v * dt; }   // revient doucement à sa vitesse
      if (half && visible) {
        x = ((x % half) + half) % half - half;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      }
      requestAnimationFrame(loop);
    })(prev);
  });
  // Passions › Le sport : les polaroïds tombent en place quand on arrive sur le mur
  $$('.collage').forEach(c => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gate.then(() => { c.classList.add('in'); setTimeout(() => c.classList.add('settled'), 1800); });
    }, { threshold: .2 });
    io.observe(c);
  });
  /* ---------- 13 ter. Mes outils du quotidien : les logos montent un par un pendant le défilement ---------- */
  $$('[data-tools-rise]').forEach(pin => {
    const chips = $$('.tool-chip', pin);
    if (reduce || !chips.length) return;
    const n = chips.length, span = .2, step = (.9 - span) / Math.max(1, n - 1);
    const ease = t => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = pin.getBoundingClientRect();
      const p = clamp(-r.top / ((pin.offsetHeight - innerHeight) || 1), 0, 1);
      chips.forEach(c => {
        const o = parseFloat(c.style.getPropertyValue('--o')) || 0;
        const t = clamp((p - .04 - o * step) / span, 0, 1);
        c.style.setProperty('--t', ease(t).toFixed(4));
      });
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', ask);
    paint();
  });

  /* ---------- 13 bis. Bande des outils : bloquée pendant le scroll, défilement continu, à glisser ---------- */
  $$('.marquee').forEach(m => {
    const track = $('.marquee-track', m), set = [...track.children], pin = m.closest('.marquee-pin');
    let setW = 0;
    // on recopie la liste autant de fois que nécessaire pour que la boucle soit invisible
    const build = () => {
      $$('[data-clone]', track).forEach(n => n.remove());
      setW = track.scrollWidth;
      for (let w = setW; setW && w < setW + m.clientWidth + 200; w += setW) {
        set.forEach(n => { const c = n.cloneNode(true); c.dataset.clone = ''; c.setAttribute('aria-hidden', 'true'); track.append(c); });
      }
    };
    build();
    addEventListener('resize', build);
    fontsReady.then(build);
    if (reduce) { m.style.overflowX = 'auto'; return; }
    const BASE = -60;                  // vitesse de croisière (px/s, vers la gauche)
    let x = 0, speed = BASE, dir = 1, down = false, sx = 0, x0 = 0, lastX = 0, lastT = 0, dragV = 0, visible = true, prev = performance.now(), pPrev = null, sv = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(m);
    m.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; sx = lastX = e.clientX; x0 = x; lastT = performance.now(); dragV = 0;
      m.classList.add('grabbing');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const now = performance.now(), dt = Math.max(8, now - lastT);
      dragV = dragV * .5 + (e.clientX - lastX) / dt * 1000 * .5;
      lastX = e.clientX; lastT = now;
      x = x0 + (e.clientX - sx);
    });
    const release = throwIt => {
      if (!down) return;
      down = false; m.classList.remove('grabbing');
      if (!throwIt) return;
      speed = clamp(dragV, -5000, 5000);      // on lance la bande, elle garde ce sens
      if (Math.abs(dragV) > 40) dir = dragV < 0 ? 1 : -1;
    };
    addEventListener('pointerup', () => release(true));
    addEventListener('pointercancel', () => release(false));
    (function loop(now) {
      const dt = Math.min(.05, (now - prev) / 1000); prev = now;
      if (!down) {
        speed += (BASE * dir - speed) * (1 - Math.exp(-dt * 3));   // revient en douceur à sa vitesse de croisière
        x += speed * dt;
        if (setW) x = ((x % setW) + setW) % setW - setW;
      }
      if (visible && setW) {
        // pendant que la section est bloquée, le scroll fait avancer la bande (un tour complet de logos)
        let p = 0;
        if (pin) { const r = pin.getBoundingClientRect(); p = clamp(-r.top / ((pin.offsetHeight - innerHeight) || 1), 0, 1); }
        const rx = (((x - p * setW) % setW) + setW) % setW - setW;
        // les logos s'inclinent selon la vitesse (glisser, élan ou scroll)
        sv += ((dt && pPrev !== null ? -(p - pPrev) * setW / dt : 0) - sv) * .15; pPrev = p;
        const sk = clamp(((down ? dragV : speed) + sv) * -.0025, -10, 10);
        track.style.transform = `translate3d(${rx.toFixed(2)}px,0,0) skewX(${sk.toFixed(2)}deg)`;
      }
      requestAnimationFrame(loop);
    })(prev);
  });

  /* ---------- 14. Pages catégories ---------- */
  // nombre de projets affiché en haut de page
  $$('[data-proj-count]').forEach(el => { el.textContent = $$('.proj').length; });
  // sommaire du haut de page : un bouton par projet (se met à jour tout seul)
  $$('[data-toc]').forEach(nav => {
    const items = $$('.proj[id]').map(p => {
      const n = $('.proj-n', p), t = $('.proj-title', p);
      return t ? `<a href="#${p.id}"><span>${n ? n.textContent.trim() : ''}</span>${t.textContent.trim()}</a>` : '';
    }).join('');
    if (items) nav.innerHTML = `<span class="ph-toc-label">À découvrir</span><div class="ph-toc-list">${items}</div>`;
  });
  // logos des outils utilisés dans les projets de la page (sans doublon)
  $$('[data-tools]').forEach(box => {
    const seen = new Set();
    $$('.proj-tools img').forEach(img => {
      const k = img.getAttribute('src');
      if (seen.has(k)) return; seen.add(k);
      const c = img.cloneNode(); c.removeAttribute('width'); c.removeAttribute('height'); box.append(c);
    });
    if (!seen.size) box.remove();
  });

  /* ---------- 14.b Affichage projet unique & Suggestions de réalisations ---------- */
  const pageProjs = $$('.proj[id]');
  if (pageProjs.length) {
    const projContainer = $('.projects');
    const heroSection = $('.p-hero');
    const heroCoverImg = $('.p-hero .cover img') || $('.ph-visual .cover img');
    const catCoverSrc = (heroSection && heroSection.dataset.catCover) ||
                        (heroCoverImg ? (heroCoverImg.getAttribute('src') || heroCoverImg.src) : '');
    const catCoverAlt = (heroSection && heroSection.dataset.catTitle) ? `${heroSection.dataset.catTitle}, aperçu des réalisations` : (heroCoverImg ? (heroCoverImg.getAttribute('alt') || '') : '');
    const heroBadgeText = $('.ph-badge textPath');
    const catBadgeText = heroBadgeText ? heroBadgeText.textContent : '';
    const heroTools = $('[data-tools]');
    const catToolsHtml = heroTools ? heroTools.innerHTML : '';
    let isInitialProjectLoad = true;

    // Catalogue des projets pour suggestions riches
    const CATALOGUE_SUGGESTIONS = [
      { id: 'solar-stark', page: 'solar-stark.html', cat: 'Branding', title: 'Solar Stark Club', sub: 'Tennis & Lifestyle', img: 'images/realisations/solar-stark-couverture.png' },
      { id: 'sorberro', page: 'sorberro.html', cat: 'Packagings', title: 'Sorberro · Pure Freeze', sub: 'Glaces Artisanales & Food Truck', img: 'images/realisations/sorberro-couverture.png' },
      { id: 'demeter-bowl', page: 'demeter-bowl.html', cat: 'Packagings', title: "Demeter's Bowl", sub: 'Salad Bar & Bols Fraîcheur', img: 'images/realisations/demeter-bowl-couverture.png' },
      { id: 'coffee-lofee', page: 'coffee-lofee.html', cat: 'Branding', title: 'Coffee Lofee', sub: 'Coffee Shop & Univers Graphique', img: 'MES%20PROJETS/COFFEE%20LOFEE/coffeeloffee%20copie-01.png' },
      { id: 'peace-page', page: 'peace-page.html', cat: 'Design Social', title: 'Peace Page', sub: 'Santé Mentale & Carnet Introspectif', img: 'images/realisations/peace-page-couverture.jpg' },
      { id: 'trellix-iconic', page: 'iconic-love.html', cat: 'Cosmétiques & UI', title: 'Iconic Love · Trellix', sub: 'Cosmétiques & Beans UI', img: 'images/realisations/trellix-couverture.png' },
      { id: 'waste-tobag', page: 'waste-tobag.html', cat: 'Design Social', title: 'Waste Tobag', sub: 'Sensibilisation Urbaine & Éco-citoyenneté', img: 'MES%20PROJETS/WASTE%20TOBAG/%20WASTE%20TOBAG.png' },
      { id: 'home-residence', page: 'home-residence.html', cat: 'Direction Artistique', title: 'HOME Residence Hotel', sub: 'Soirées Prestige & Scénographie', img: 'MES%20PROJETS/HOME/HOME-01.png' },
      { id: 'canalbox', page: 'canalbox.html', cat: 'Événementiel & Campagnes', title: 'Canalbox Bénin', sub: 'Inauguration & Fibre Optique', img: 'MES%20PROJETS/CANALBOX%20PROJECTS/CANALBOX-01.png' },
      { id: 'canal-plus', page: 'canal-plus.html', cat: 'Campagnes', title: 'Canal+ Bénin', sub: 'Campagnes Digitales 360°', img: 'MES%20PROJETS/CANAL+PROJECTS/CANAL+PROJECTS-01.png' },
      { id: 'baudelaire', page: 'baudelaire.html', cat: 'Signalétique', title: 'Bibliothèque Baudelaire', sub: "Design d'Espace & Pictogrammes", img: 'MES%20PROJETS/BAUDELAIRE/BAUDELAIRE-01.png' }
    ];

    // Création du bloc suggestions
    let sugSection = $('.proj-suggestions');
    if (!sugSection && projContainer) {
      sugSection = document.createElement('section');
      sugSection.className = 'proj-suggestions';
      projContainer.after(sugSection);
    }

    function renderSuggestions(activeProj) {
      if (!sugSection) return;
      const curFile = location.pathname.split('/').pop() || 'branding.html';
      const activeId = activeProj ? activeProj.id : '';

      // Suggestions issues de la même page (autres projets)
      const samePage = pageProjs.filter(p => p.id !== activeId).map(p => {
        const n = $('.proj-n', p)?.textContent.trim() || '';
        const title = $('.proj-title', p)?.textContent.trim() || '';
        const sub = $('.proj-meta dd', p)?.textContent.trim() || 'Réalisation Helciane Houngbadji';
        const img = p.dataset.cover || $('img', p)?.getAttribute('src') || '';
        return {
          page: `#${p.id}`,
          cat: n ? `Projet ${n}` : 'Projet',
          title,
          sub,
          img
        };
      });

      // Suggestions croisées
      const crossPage = CATALOGUE_SUGGESTIONS.filter(item => {
        const itemFile = item.page.split('#')[0];
        const itemId = item.page.split('#')[1];
        if (itemFile === curFile && itemId === activeId) return false;
        if (samePage.some(s => s.title.toLowerCase().includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(s.title.toLowerCase()))) return false;
        return true;
      });

      const list = [...samePage, ...crossPage].slice(0, 3);

      sugSection.innerHTML = `
        <div class="sug-wrap">
          <div class="sug-head">
            <p class="ph-kicker">Continuer l'exploration</p>
            <h3 class="sug-title">Suggestions d'autres <em>réalisations</em></h3>
          </div>
          <div class="sug-grid">
            ${list.map(s => `
              <a class="sug-card" href="${s.page}">
                <div class="sug-media">
                  <span class="sug-pill">${s.cat}</span>
                  <img src="${s.img}" alt="${s.title}" loading="lazy">
                </div>
                <div class="sug-info">
                  <h4 class="sug-card-title">${s.title}</h4>
                  <p class="sug-card-sub">${s.sub}</p>
                  <span class="sug-arrow">Découvrir le projet →</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;

      // Clics sur les cartes de la même page
      $$('.sug-card[href^="#"]', sugSection).forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const targetId = a.getAttribute('href').replace('#', '');
          history.pushState(null, '', `#${targetId}`);
          showSingleProject(targetId);
          const el = document.getElementById(targetId);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }
        });
      });
    }

    function showSingleProject(targetId) {
      if (targetId === 'tous') {
        pageProjs.forEach(p => { p.style.display = ''; });
        if (sugSection) sugSection.style.display = 'none';
        $$('.ph-toc a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#tous'));

        // Restaurer la couverture par défaut de la catégorie
        if (heroCoverImg && catCoverSrc && heroCoverImg.getAttribute('src') !== catCoverSrc) {
          heroCoverImg.classList.add('is-switching');
          const pre = new Image();
          pre.onload = () => {
            heroCoverImg.src = catCoverSrc;
            heroCoverImg.alt = catCoverAlt;
            setTimeout(() => heroCoverImg.classList.remove('is-switching'), 50);
          };
          pre.onerror = () => {
            heroCoverImg.src = catCoverSrc;
            heroCoverImg.classList.remove('is-switching');
          };
          pre.src = catCoverSrc;
        }
        if (heroBadgeText && catBadgeText) {
          heroBadgeText.textContent = catBadgeText;
        }
        if (heroTools && catToolsHtml) {
          heroTools.innerHTML = catToolsHtml;
        }
        return;
      }

      let active = pageProjs.find(p => p.id === targetId);
      if (!active) active = pageProjs[0];

      // Masquer tous les projets sauf l'actif
      pageProjs.forEach(p => {
        p.style.display = (p === active) ? '' : 'none';
      });

      // Appliquer le thème du projet actif
      if (active.dataset.theme) {
        document.body.dataset.theme = active.dataset.theme;
      }

      // Mettre en valeur le bouton du projet actif dans le sommaire
      $$('.ph-toc a').forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${active.id}`);
      });

      // Mettre à jour l'image de couverture du hero avec celle du projet actif
      const titleEl = $('.proj-title', active);
      const activeTitle = titleEl ? titleEl.textContent.trim() : '';
      const activeCover = active.dataset.cover ||
        ($('.gal-media img', active) && ($('.gal-media img', active).dataset.full || $('.gal-media img', active).getAttribute('src'))) ||
        ($('img', active) && ($('img', active).dataset.full || $('img', active).getAttribute('src')));

      if (heroCoverImg && activeCover) {
        if (isInitialProjectLoad) {
          heroCoverImg.src = activeCover;
          heroCoverImg.alt = activeTitle ? `${activeTitle} - Aperçu` : catCoverAlt;
        } else if (heroCoverImg.getAttribute('src') !== activeCover) {
          heroCoverImg.classList.add('is-switching');
          const pre = new Image();
          pre.onload = () => {
            heroCoverImg.src = activeCover;
            heroCoverImg.alt = activeTitle ? `${activeTitle} - Aperçu` : catCoverAlt;
            setTimeout(() => heroCoverImg.classList.remove('is-switching'), 50);
          };
          pre.onerror = () => {
            heroCoverImg.src = activeCover;
            heroCoverImg.classList.remove('is-switching');
          };
          pre.src = activeCover;
        }
      }

      // Mettre à jour le texte du badge circulaire
      if (heroBadgeText && activeTitle) {
        heroBadgeText.textContent = `Helciane Houngbadji ✦ ${activeTitle} ✦ Portfolio ✦ `;
      }

      // Mettre à jour les outils du hero avec ceux du projet actif
      const projTools = $('.proj-tools', active);
      if (projTools && heroTools) {
        heroTools.innerHTML = projTools.innerHTML;
      }

      // Mettre à jour les suggestions
      if (sugSection) {
        sugSection.style.display = '';
        renderSuggestions(active);
      }

      isInitialProjectLoad = false;

      if (window.lenis && typeof window.lenis.resize === 'function') {
        window.lenis.resize();
      }
    }

    function handleHash(scroll = false) {
      const hash = location.hash.replace('#', '');
      const valid = pageProjs.some(p => p.id === hash) || hash === 'tous';
      const targetId = valid ? hash : pageProjs[0].id;
      showSingleProject(targetId);
      if (scroll && targetId !== 'tous') {
        const el = document.getElementById(targetId);
        if (el) {
          if (window.scrollY > 250) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }
        }
      }
    }

    window.addEventListener('hashchange', () => handleHash(true));
    handleHash(false);

    // Clic sur un bouton du sommaire du haut
    $$('.ph-toc a').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.replace('#', '');
          history.pushState(null, '', `#${targetId}`);
          handleHash(true);
        }
      });
    });
  }
  // lecteur vidéo : lecture automatique quand la vidéo est à l'écran, pause dès qu'on passe à une autre ;
  // boutons « son » et « plein écran »
  // Page Montage (data-son-auto) : la vidéo se lance avec le son, et en passant à la suivante le son suit.
  // Les navigateurs n'autorisent le son qu'après un premier clic sur le site : en attendant, la vidéo tourne
  // sans le son et le bouton « Activer le son » pulse ; le premier clic (ou touche) sur la page lance le son.
  const players = $$('.player');
  const autoSound = !!$('[data-son-auto]');
  let wantSound = autoSound, current = null;
  const hasSound = p => !!$('.pl-sound', p);
  const blocked = (p, on) => p.classList.toggle('sound-blocked', on);
  function startPlayer(p) {
    const v = $('video', p);
    if (!v) return;
    players.forEach(o => { if (o !== p) { const ov = $('video', o); if (ov) { ov.pause(); if (autoSound) ov.muted = true; blocked(o, false); } } });
    current = p; p.classList.remove('user-paused'); p.retries = 0;
    if (autoSound && wantSound && hasSound(p)) {
      v.muted = false;
      const pr = v.play();
      if (pr) pr.then(() => blocked(p, false)).catch(err => {
        if (!err || err.name !== 'NotAllowedError') return;
        v.muted = true; blocked(p, true);   // son refusé par le navigateur : on joue sans le son
        const p2 = v.play(); if (p2) p2.catch(() => {});
      });
    } else {
      v.muted = true;
      const pr = v.play(); if (pr) pr.catch(() => {});
    }
  }
  // Seuil souple pour démarrer à l'écran et ne couper que quand la vidéo quitte réellement la vue
  const playerIO = new IntersectionObserver(entries => entries.forEach(e => {
    const p = e.target, v = $('video', p);
    if (!v) return;
    if (e.isIntersecting && e.intersectionRatio >= .25) {
      if (current !== p && !p.classList.contains('user-paused')) startPlayer(p);
      else if (v.paused && !v.ended && !p.classList.contains('user-paused')) { const pr = v.play(); if (pr) pr.catch(() => {}); }
    } else if (!e.isIntersecting || e.intersectionRatio < .15) {
      v.pause(); blocked(p, false);
      if (autoSound) v.muted = true;
      if (current === p) current = null;
    }
  }), { threshold: [0.15, 0.25, 0.7] });
  if (autoSound) {
    // premier clic ou touche ailleurs sur la page : le son de la vidéo à l'écran démarre
    const unlock = e => {
      if (!wantSound || !current || !current.classList.contains('sound-blocked') || e.target.closest('.player, a')) return;
      const p = current, v = $('video', p);
      if (!v) return;
      v.muted = false; blocked(p, false);
      const pr = v.play(); if (pr) pr.catch(() => { v.muted = true; blocked(p, true); const p2 = v.play(); if (p2) p2.catch(() => {}); });
    };
    ['pointerdown', 'touchend', 'keydown'].forEach(t => addEventListener(t, unlock, true));
  }
  players.forEach(p => {
    const v = $('video', p), snd = $('.pl-sound', p), full = $('.pl-full', p), centerPlay = $('.play', p), playBtn = $('.pl-play', p);
    if (!v) return;
    v.addEventListener('error', () => p.classList.add('missing'), true);

    const syncState = () => {
      const isPaused = v.paused;
      p.classList.toggle('playing', !isPaused);
      p.classList.toggle('is-playing', !isPaused);
      if (playBtn) playBtn.setAttribute('aria-label', isPaused ? 'Lire la vidéo' : 'Mettre en pause');
    };

    const syncSound = () => {
      if (!snd) return;   // vidéo sans son : pas de bouton son
      snd.setAttribute('aria-pressed', !v.muted);
      const txt = $('.pl-txt', snd);
      if (txt) txt.textContent = v.muted ? 'Activer le son' : 'Couper le son';
      p.classList.toggle('sound-on', !v.muted);
    };

    const togglePlay = () => {
      if (v.paused) {
        p.classList.remove('user-paused');
        players.forEach(o => {
          if (o !== p) {
            const ov = $('video', o);
            if (ov) ov.pause();
            o.classList.remove('playing', 'is-playing');
          }
        });
        const pr = v.play();
        if (pr) {
          pr.then(() => {
            syncState();
          }).catch(err => {
            console.warn('Lecture vidéo avec son bloquée par le navigateur, tentative en muet :', err);
            v.muted = true;
            syncSound();
            v.play().then(syncState).catch(() => {});
          });
        }
      } else {
        p.classList.add('user-paused');
        v.pause();
        syncState();
      }
    };

    const toggleSound = () => {
      v.muted = !v.muted;
      if (autoSound) { wantSound = !v.muted; blocked(p, false); }
      if (!v.muted) {
        players.forEach(o => {
          if (o !== p) {
            const ov = $('video', o);
            if (ov) { ov.muted = true; o.classList.remove('sound-on'); }
          }
        });
      }
      syncSound();
      if (v.paused) {
        const pr = v.play();
        if (pr) pr.catch(() => {});
      }
    };

    // Le clic sur le bouton central, sur la vidéo ou sur le bouton de barre lance / met en pause
    if (centerPlay) centerPlay.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); togglePlay(); });
    v.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); togglePlay(); });
    if (playBtn) playBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); togglePlay(); });

    if (snd) {
      snd.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleSound(); });
    }

    v.addEventListener('play', syncState);
    v.addEventListener('pause', syncState);
    v.addEventListener('volumechange', syncSound);

    // le navigateur peut mettre en pause une vidéo sans le son pendant le défilement : on la relance si pas user-paused
    v.addEventListener('pause', () => {
      syncState();
      if (current !== p || p.classList.contains('user-paused') || v.controls || v.ended || (p.retries = (p.retries || 0) + 1) > 3) return;
      setTimeout(() => { if (current === p && v.paused && !p.classList.contains('user-paused')) { const pr = v.play(); if (pr) pr.catch(() => {}); } }, 400);
    });

    if (full) {
      full.addEventListener('click', e => {
        e.stopPropagation();
        if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
        else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();   // iPhone
        const pr = v.play(); if (pr) pr.catch(() => {});
      });
      // en plein écran : les commandes habituelles apparaissent
      const onFs = () => { const fs = (document.fullscreenElement || document.webkitFullscreenElement) === v; v.controls = fs; };
      document.addEventListener('fullscreenchange', onFs);
      document.addEventListener('webkitfullscreenchange', onFs);
      v.addEventListener('webkitendfullscreen', () => { v.controls = false; });
    }

    // barre de temps : curseur pour avancer ou reculer
    const seek = $('.pl-seek', p), tCur = $('.pl-time', p), tDur = $('.pl-dur', p);
    if (seek) {
      const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
      let dragging = false, raf = 0;
      const paint = () => {
        const d = v.duration;
        if (d && isFinite(d)) {
          if (!dragging) seek.value = Math.round(v.currentTime / d * 1000);
          if (tCur) tCur.textContent = fmt(dragging ? seek.value / 1000 * d : v.currentTime);
          if (tDur) tDur.textContent = fmt(d);
        }
        seek.style.setProperty('--p', seek.value / 10 + '%');
      };
      const loop = () => { paint(); raf = v.paused ? 0 : requestAnimationFrame(loop); };
      v.addEventListener('loadedmetadata', paint);
      v.addEventListener('timeupdate', paint);
      v.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); });
      const jump = () => { const d = v.duration; if (d && isFinite(d)) v.currentTime = seek.value / 1000 * d; paint(); };
      seek.addEventListener('pointerdown', () => { dragging = true; });
      seek.addEventListener('input', () => { dragging = true; jump(); });
      seek.addEventListener('change', () => { dragging = false; jump(); });
      seek.addEventListener('pointerup', () => { dragging = false; });
      if (!v.duration) { v.preload = 'auto'; }   // précharger pour connaître la durée avant la lecture
      paint();
    }
    syncSound();
    syncState();
    playerIO.observe(p);
  });
  // motion design : un clic active ou coupe le son de l'animation
  $$('.loop:not(.silent)').forEach(l => {
    const v = $('video', l), tag = $('.loop-tag', l);
    l.addEventListener('click', () => {
      v.muted = !v.muted;
      if (tag) tag.lastChild.textContent = v.muted ? 'En boucle · son coupé' : 'En boucle · son activé';
      const pr = v.play(); if (pr) pr.catch(() => {});
    });
  });
  // affiches : inclinaison 3D et reflet qui suivent la souris
  if (fine && !reduce) {
    $$('.poster, .gal-item').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('tilting');
        el.style.transform = `rotateX(${((.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - .5) * 14).toFixed(2)}deg) scale(1.03)`;
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });
      el.addEventListener('mouseleave', () => { el.classList.remove('tilting'); el.style.transform = ''; });
    });
  }

  /* ---------- 14 bis. Lien « suivant » en bas de page : les lettres du titre montent une à une ---------- */
  $$('.next').forEach(n => {
    const t = $('.next-title', n);
    if (!t) return;
    const text = t.textContent.trim();
    let i = 0;
    t.setAttribute('aria-label', text);
    t.innerHTML = text.split(/\s+/).map(w => `<span class="nw" aria-hidden="true">${[...w].map(ch =>
      `<span class="nc" style="--i:${i++}"><span class="nc-e">${ch}</span></span>`).join('')}</span>`).join(' ');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); gate.then(() => n.classList.add('in')); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(n);
  });

  /* ---------- 15. Menu plein écran (mobile) ---------- */
  if (nav) {
    const links = [['À propos', 'index.html#apropos'], ['Parcours', 'index.html#parcours'], ['Réalisations', 'index.html#realisations'],
      ['Passions', 'passions.html'], ['Contact', 'index.html#contact']];
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'burger';
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mmenu');
    btn.innerHTML = '<span class="burger-label">Menu</span><span class="burger-icon" aria-hidden="true"><i></i><i></i></span>';
    nav.append(btn); nav.classList.add('has-burger');
    const m = document.createElement('div');
    m.id = 'mmenu'; m.className = 'mmenu'; m.hidden = true; m.setAttribute('data-lenis-prevent', '');
    m.innerHTML = `<ul>${links.map(([t, h], i) => `<li style="--i:${i}"><a href="${h}"><span class="mm-in"><span class="mm-n">0${i + 1}</span>${t}</span></a></li>`).join('')}</ul>
      <p class="mmenu-foot"><span>Nantes, Loire-Atlantique</span><span class="serif">Communication et événementiel</span></p>`;
    nav.after(m);
    let opened = false;
    const set = v => {
      opened = v;
      btn.setAttribute('aria-expanded', v);
      $('.burger-label', btn).textContent = v ? 'Fermer' : 'Menu';
      root.classList.toggle('menu-open', v);
      if (v) {
        m.hidden = false; stopScroll();
        requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('open')));
      } else {
        m.classList.remove('open'); startScroll();
        setTimeout(() => { if (!opened) m.hidden = true; }, 800);
      }
    };
    btn.addEventListener('click', () => set(!opened));
    m.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && opened) { set(false); btn.focus(); } });
    addEventListener('resize', () => { if (opened && !isMobile()) set(false); });
  }

  /* ---------- 16. Sélecteur interactif de palettes chromatiques ---------- */
  const initPaletteSwitcher = () => {
    // Désactivé : seule la palette Matcha & Sorbet est conservée pour l'instant
    const existing = $('.palette-switcher');
    if (existing) existing.remove();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaletteSwitcher);
  } else {
    initPaletteSwitcher();
  }
})();
