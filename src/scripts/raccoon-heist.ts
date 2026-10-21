// Raccoon Heist game page. One night told by scrolling:
// dusk opening -> the Boss's catch -> the night (HUD fills) -> the floor -> the cast -> the casino grows -> dawn.
// Interactions (slot, lockbox, Deal cards) always work. With reduced motion nothing scrubs or flies:
// the CSS defaults are the composed final frames and interactions resolve instantly.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { SHEETS, SLOT, LOCKBOX, REELS, type Reel } from '../components/raccoon-heist/data';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

/** Deterministic scatter so the opening looks the same on every visit. */
const rand = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
function pick<T extends { weight: number }>(items: T[]): T {
  let r = Math.random() * items.reduce((n, i) => n + i.weight, 0);
  for (const i of items) { r -= i.weight; if (r < 0) return i; }
  return items[items.length - 1];
}
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

export function initRaccoonHeist() {
  loadSprites();
  slotMachine();
  lockbox();
  dealCards();
  if (reduce) return;
  smoothScroll();
  hero();
  catchLines();
  night();
  growCasino();
  dawnSignoff();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------- sprites */

/** Below-the-fold sprite sheets load once the hero is done, then as they come within reach of the screen. */
function loadSprites() {
  const imgs = $$<HTMLImageElement>('img[data-src]');
  const show = (img: HTMLImageElement) => { img.src = img.dataset.src!; img.removeAttribute('data-src'); };
  const start = () => {
    if (!('IntersectionObserver' in window)) { imgs.forEach(show); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { show(e.target as HTMLImageElement); io.unobserve(e.target); }
    }), { rootMargin: '1600px 0px' });
    imgs.forEach((img) => io.observe(img));
  };
  if (document.readyState === 'complete') window.setTimeout(start, 250);
  else window.addEventListener('load', () => window.setTimeout(start, 250), { once: true });
}

/* ---------------------------------------------------------------- scroll */

function smoothScroll() {
  if (!fine) return;
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------------------------------------------------------------- hero */

function hero() {
  const root = $('[data-hero]');
  const stage = $('[data-hero-stage]');
  if (!root || !stage) return;
  const L = (id: string) => $(`[data-layer="${id}"]`, stage)!;
  const bg = L('background'), eyes = L('eyes'), ratsL = L('rats-left'), ratsR = L('rats-right'), rocco = L('rocco');
  const rain = $('[data-hero-rain]', stage);
  const copy = $$('[data-hero-copy], [data-hero-sign]');

  // Dark room. The pre-paint CSS guard comes off first (same task, so nothing paints in between),
  // otherwise GSAP would read its transform as a starting offset.
  document.documentElement.classList.remove('rh-intro');
  gsap.set(bg, { filter: 'brightness(0.12)' });
  gsap.set(eyes, { opacity: 0 });
  gsap.set(rocco, { yPercent: -120 });
  gsap.set(ratsL, { xPercent: -14, opacity: 0 });
  gsap.set(ratsR, { xPercent: 14, opacity: 0 });

  gsap.timeline({ delay: 0.3 })
    // Eyes stutter on in the dark.
    .to(eyes, { opacity: 1, duration: 0.04 })
    .to(eyes, { opacity: 0, duration: 0.04 }, '+=0.12')
    .to(eyes, { opacity: 0.7, duration: 0.04 }, '+=0.1')
    .to(eyes, { opacity: 0, duration: 0.04 }, '+=0.08')
    .to(eyes, { opacity: 1, duration: 0.25 }, '+=0.14')
    // The spotlight clicks on: one hard cut.
    .set(bg, { filter: 'brightness(1)' }, '+=0.25')
    // Rocco drops into the light with one small bounce.
    .to(rocco, { yPercent: 0, duration: 0.4, ease: 'power3.in' }, '+=0.1')
    .to(rocco, { yPercent: -2.5, duration: 0.09, ease: 'power1.out' })
    .to(rocco, { yPercent: 0, duration: 0.11, ease: 'power1.in' })
    // The Rat Mob leans in.
    .to([ratsL, ratsR], { xPercent: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.1')
    .call(() => { if (rain) coinRain(stage, rain); }, [], '-=0.3')
    .call(() => blink(3));

  function blink(delay: number) {
    gsap.to(eyes, {
      opacity: 0.2, duration: 0.05, yoyo: true, repeat: 1, repeatDelay: 0.07, delay,
      onComplete: () => blink(2.5 + Math.random() * 3),
    });
  }

  // Depth on scroll: the room drifts slower than the cast; the title rises away.
  gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
    .to(bg, { y: () => stage.clientHeight * 0.16, ease: 'none' }, 0)
    .to(eyes, { y: () => stage.clientHeight * 0.12, ease: 'none' }, 0)
    .to(ratsL, { x: () => -stage.clientWidth * 0.05, y: () => stage.clientHeight * 0.06, ease: 'none' }, 0)
    .to(ratsR, { x: () => stage.clientWidth * 0.05, y: () => stage.clientHeight * 0.06, ease: 'none' }, 0)
    .to(copy, { y: -60, opacity: 0.2, ease: 'none' }, 0);

  // Depth on the pointer, through the independent `translate` property so it never fights the scroll.
  if (!fine) return;
  const depth: [HTMLElement, number][] = [[bg, 5], [eyes, 9], [ratsL, 14], [ratsR, 14], [rocco, 20]];
  let raf = 0, nx = 0, ny = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    nx = (e.clientX - r.left) / r.width - 0.5;
    ny = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      depth.forEach(([el, px]) => { el.style.translate = `${Math.round(-nx * px)}px ${Math.round(-ny * px * 0.5)}px`; });
    });
  });
}

/** Coins and cards fall into the spotlight once the cast is in place. */
function coinRain(stage: HTMLElement, layer: HTMLElement) {
  const s = parseInt(getComputedStyle(stage).getPropertyValue('--s')) || 1;
  const coin = SHEETS.coin, cards = SHEETS.cards;
  const w = layer.clientWidth, h = layer.clientHeight;
  const drops = Array.from({ length: 20 }, (_, i) => {
    const isCard = i % 4 === 3;
    const sh = isCard ? cards : coin;
    const d = document.createElement('div');
    d.className = isCard ? 'drop' : 'drop drop-coin';
    d.style.width = `${sh.cell[0] * s}px`;
    d.style.height = `${sh.cell[1] * s}px`;
    d.style.backgroundImage = `url(${sh.src})`;
    d.style.backgroundSize = `${sh.cell[0] * sh.frames * s}px ${sh.cell[1] * s}px`;
    d.style.backgroundPosition = isCard ? `${-sh.cell[0] * s * (i % 3)}px 0` : '0 0';
    d.style.setProperty('--cw', `${coin.cell[0] * coin.frames * s}px`);
    d.style.left = `${Math.round((0.18 + rand(i) * 0.64) * w)}px`;
    d.style.animationDelay = `${-rand(i + 7) * 0.6}s`;
    layer.appendChild(d);
    return d;
  });
  gsap.fromTo(drops, { y: () => -h * 0.25, rotation: (i) => rand(i + 40) * 60 - 30 }, {
    y: () => h * 1.1,
    rotation: (i) => (i % 4 === 3 ? rand(i + 80) * 540 - 270 : 0),
    duration: (i) => 1.2 + rand(i + 120) * 0.9,
    ease: 'power1.in',
    stagger: { each: 0.06, from: 'random' },
    onComplete: () => drops.forEach((d) => d.remove()),
  });
}

/* ---------------------------------------------------------------- Vermino's bust */

/** vermino_bust frames: 0 look, 1 blink, 2 brow, 3 steepled paws, 4-5 talking. Idles like a living
 *  portrait (holds his look, now and then a blink, a brow or the paws) and flaps only while he speaks. */
function bust(el: HTMLElement | null) {
  if (!el) return null;
  let idleT = 0, talkT = 0;
  const f = (n: number) => el.style.setProperty('--f', String(n));
  const idle = () => {
    window.clearTimeout(idleT);
    f(0);
    idleT = window.setTimeout(() => {
      const r = Math.random();
      const [frame, hold] = r < 0.6 ? [1, 140] : r < 0.85 ? [2, 700] : [3, 1400];
      f(frame);
      idleT = window.setTimeout(idle, hold);
    }, 1800 + Math.random() * 1800);
  };
  const talk = (on: boolean) => {
    window.clearTimeout(idleT);
    window.clearInterval(talkT);
    if (!on) { f(3); idleT = window.setTimeout(idle, 500); return; }
    let open = false;
    f(4);
    talkT = window.setInterval(() => { open = !open; f(open ? 5 : 4); }, 150);
  };
  idle();
  return { talk };
}

/* ---------------------------------------------------------------- the catch */

function catchLines() {
  const talk = $('[data-talk]');
  if (!talk) return;
  const lines = $$('[data-line]', talk).map((p) => {
    const text = p.textContent ?? '';
    p.textContent = '';
    const sr = Object.assign(document.createElement('span'), { className: 'visually-hidden', textContent: text });
    const ghost = Object.assign(document.createElement('span'), { className: 'type-ghost', textContent: text });
    const typed = Object.assign(document.createElement('span'), { className: 'type-live' });
    ghost.setAttribute('aria-hidden', 'true');
    typed.setAttribute('aria-hidden', 'true');
    p.append(sr, ghost, typed);
    p.dataset.state = 'wait';
    return { p, text, typed };
  });

  const boss = bust($('[data-bust="catch"]'));

  ScrollTrigger.create({
    trigger: talk, start: 'top 78%', once: true,
    onEnter: async () => {
      for (const l of lines) {
        l.p.dataset.state = 'typing';
        boss?.talk(true);
        for (let i = 1; i <= l.text.length; i++) {
          l.typed.textContent = l.text.slice(0, i);
          await wait(l.text[i - 1] === '.' || l.text[i - 1] === ',' ? 140 : 26);
        }
        l.p.dataset.state = 'done';
        boss?.talk(false);
        await wait(420);
      }
    },
  });
}

/* ---------------------------------------------------------------- the night */

function night() {
  const hud = $('[data-hud]');
  const fight = $('[data-beat="fight"]'), grab = $('[data-beat="grab"]'), pay = $('[data-beat="pay"]');
  if (!hud || !fight || !grab || !pay) return;

  const coinsEl = $('[data-hud-coins]', hud)!, protEl = $('[data-hud-prot]', hud)!, timeEl = $('[data-hud-time]', hud)!;
  const fill = $('[data-hud-fill]', hud)!;
  const p = { fight: 0, grab: 0, pay: 0 };
  const DEMAND = 500, NIGHT = 300;

  const renderHud = () => {
    const paid = p.pay >= 0.8;
    const gold = Math.round(120 * p.fight + (DEMAND - 120) * p.grab);
    const left = Math.max(0, Math.round(NIGHT * (1 - Math.min(1, (p.fight + p.grab + p.pay / 0.8) / 3))));
    coinsEl.textContent = String(paid ? 0 : gold);
    protEl.textContent = String(gold);
    fill.style.setProperty('--fill', String(gold / DEMAND));
    timeEl.textContent = left === 0 ? 'Dawn' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    hud.dataset.dawn = String(left === 0);
    hud.dataset.paid = String(paid);
  };
  renderHud();

  const beat = (el: HTMLElement, key: keyof typeof p) => gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el, start: 'top 78%', end: 'top 14%', scrub: 0.5,
      onUpdate: (self) => { p[key] = self.progress; renderHud(); },
    },
  });

  // 01 Fight: three cards, three hits (the ace crits), the thug drops, his pockets spill.
  {
    const cards = $$('[data-card]', fight);
    const spill = $$('[data-spill]', fight);
    const thug = $('[data-thug]', fight)!;
    const crit = $('[data-pop="crit"]', fight)!, hit = $('[data-pop="hit"]', fight)!, ko = $('[data-pop="ko"]', fight)!;
    gsap.set(cards, { '--t': 0 });
    gsap.set(spill, { '--t': 0 });
    gsap.set([crit, hit, ko], { '--o': 0, '--t': 0 });
    gsap.set(thug, { '--ko': 0, '--hit': 0 });
    const tl = beat(fight, 'fight');
    const flash = (at: number) => tl.to(thug, { '--hit': 1, duration: 0.02 }, at).to(thug, { '--hit': 0, duration: 0.04 }, at + 0.03);
    const popAt = (el: HTMLElement, at: number) => tl
      .set(el, { '--o': 1 }, at).fromTo(el, { '--t': 0 }, { '--t': 1, duration: 0.14 }, at).set(el, { '--o': 0 }, at + 0.15);
    // Card order in the markup: A spade (0), A diamond (1), K heart (2). Throw K, A, A.
    [2, 0, 1].forEach((ci, n) => tl.to(cards[ci], { '--t': 1, duration: 0.2 }, 0.04 + n * 0.22));
    flash(0.24); popAt(hit, 0.24);
    flash(0.46); popAt(crit, 0.46);
    flash(0.68); popAt(hit, 0.68);
    tl.to(thug, { '--ko': 1, duration: 0.12, ease: 'power2.in' }, 0.72);
    tl.set(ko, { '--o': 1 }, 0.74).fromTo(ko, { '--t': 0 }, { '--t': 1, duration: 0.2 }, 0.74);
    tl.to(spill, { '--t': 1, duration: 0.14, stagger: 0.025, ease: 'power1.in' }, 0.76);
    tl.to({}, { duration: 0.06 }, 0.94);
  }

  // 02 Grab the coins: they rain in from across the room and drop into the sack.
  {
    const rain = $$('[data-rain]', grab);
    const pop = $('[data-pop="gold"]', grab)!;
    gsap.set(rain, { '--t': 0 });
    gsap.set(pop, { '--o': 0, '--t': 0 });
    const tl = beat(grab, 'grab');
    rain.forEach((c, i) => tl.to(c, { '--t': 1, duration: 0.22, ease: 'power1.in' }, 0.02 + i * 0.075));
    for (let i = 0; i < 5; i++) {
      const at = 0.22 + i * 0.15;
      tl.set(pop, { '--o': 1 }, at).fromTo(pop, { '--t': 0 }, { '--t': 1, duration: 0.1 }, at).set(pop, { '--o': 0 }, at + 0.11);
    }
  }

  // 03 Pay by dawn: first light, the Boss's line, he tips his hat, PAID.
  {
    const light = $('[data-dawn]', pay)!, bubble = $('[data-bubble]', pay)!, stamp = $('[data-stamp]', pay)!;
    const boss = $('[data-boss-full] .px', pay)!;
    gsap.set(light, { '--dawn': 0 });
    gsap.set(bubble, { '--o': 0 });
    gsap.set(stamp, { '--o': 0, '--sc': 2.6 });
    gsap.set(boss, { '--f': 0 });
    const tl = beat(pay, 'pay');
    tl.to(light, { '--dawn': 1, duration: 0.7 }, 0)
      .to(bubble, { '--o': 1, duration: 0.05 }, 0.35)
      .set(boss, { '--f': 1 }, 0.72)
      .to(stamp, { '--o': 1, '--sc': 1, duration: 0.06, ease: 'power4.in' }, 0.8)
      .to({}, { duration: 0.14 }, 0.86);
  }
}

/* ---------------------------------------------------------------- dawn */

function dawnSignoff() {
  const boss = bust($('[data-bust="dawn"]'));
  if (!boss) return;
  ScrollTrigger.create({
    trigger: '#dawn', start: 'top 60%', once: true,
    onEnter: () => { boss.talk(true); window.setTimeout(() => boss.talk(false), 2200); },
  });
}

/* ---------------------------------------------------------------- grow */

function growCasino() {
  const rooms = $$('[data-room]');
  if (!rooms.length) return;
  const set = (n: number) => rooms.forEach((r, i) => { if (i === 0 || i < n) r.dataset.built = 'true'; else delete r.dataset.built; });
  set(1);
  ScrollTrigger.create({
    trigger: '[data-rooms]', start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: (self) => set(1 + Math.floor(self.progress * (rooms.length - 1) + 0.0001)),
  });
}

/* ---------------------------------------------------------------- interactions */

/** A small burst of spinning coins from a point. */
function burst(host: HTMLElement | null, n: number) {
  if (!host || reduce) return;
  const coins = Array.from({ length: n }, (_, i) => {
    const c = document.createElement('span');
    const [w, h] = SHEETS.coin.cell;
    c.className = 'bc';
    Object.assign(c.style, {
      width: `${w}px`, height: `${h}px`, left: `${-w / 2}px`, top: `${-h / 2}px`,
      backgroundImage: `url(${SHEETS.coin.src})`, backgroundSize: `${w * SHEETS.coin.frames}px ${h}px`,
      backgroundPosition: `${-w * (i % SHEETS.coin.frames)}px 0`,
    });
    host.appendChild(c);
    return c;
  });
  gsap.timeline({ onComplete: () => coins.forEach((c) => c.remove()) })
    .to(coins, {
      x: () => gsap.utils.random(-150, 150), y: () => gsap.utils.random(-170, -70),
      duration: 0.38, ease: 'power2.out', stagger: 0.012,
    })
    .to(coins, { y: '+=220', opacity: 0, duration: 0.55, ease: 'power2.in', stagger: 0.012 }, '>-0.05');
}

const SYMBOL_OF: Record<string, Reel> = { cherry: 'cherry', bell: 'bell', bar: 'bar', lemon: 'lemon', seven: 'seven' };

function slotMachine() {
  const root = $('[data-slot]');
  if (!root) return;
  const btn = $<HTMLButtonElement>('[data-pull]', root)!;
  const loan = $<HTMLButtonElement>('[data-loan]', root)!;
  const sackEl = $('[data-sack]', root)!;
  const result = $('[data-slot-result]', root)!;
  const px = $('[data-slot-px]', root)!;
  const art = $('.slot-art', root)!;
  const reels = $$('[data-reel]', root);
  let sack = SLOT.start;
  let busy = false;

  const show = (reel: HTMLElement, sym: Reel) => $$('[data-sym]', reel).forEach((s) => { s.hidden = s.dataset.sym !== sym; });
  const frame = (f: number) => { px.classList.remove('px-loop'); px.style.setProperty('--f', String(f)); };
  const idle = () => { px.style.setProperty('--f', '0'); px.classList.add('px-loop'); };
  const update = () => {
    sackEl.textContent = String(sack);
    const broke = sack < SLOT.cost;
    btn.disabled = broke || busy;
    loan.hidden = !broke;
  };

  const pull = async () => {
    if (busy || sack < SLOT.cost) return;
    busy = true;
    sack -= SLOT.cost;
    update();
    result.dataset.win = 'false';
    const out = pick(SLOT.outcomes);
    let finals: Reel[];
    if (out.id === 'bust') {
      do { finals = [0, 1, 2].map(() => REELS[Math.floor(Math.random() * REELS.length)]); }
      while (finals[0] === finals[1] && finals[1] === finals[2]);
    } else finals = [0, 1, 2].map(() => SYMBOL_OF[out.id]);

    if (!reduce) {
      result.textContent = 'Spinning...';
      for (const f of [2, 3, 4]) { frame(f); await wait(90); }
      const spin = window.setInterval(() => reels.forEach((r) => {
        if (!r.dataset.stopped) show(r, REELS[Math.floor(Math.random() * REELS.length)]);
      }), 70);
      for (let i = 0; i < 3; i++) {
        await wait(i === 0 ? 700 : 260);
        reels[i].dataset.stopped = '1';
        show(reels[i], finals[i]);
      }
      window.clearInterval(spin);
      reels.forEach((r) => delete r.dataset.stopped);
    } else reels.forEach((r, i) => show(r, finals[i]));

    sack += out.gold;
    result.textContent = out.text;
    result.dataset.win = out.id === 'seven' ? 'jackpot' : out.id === 'bust' ? 'false' : 'true';
    if (out.id !== 'bust') {
      if (!reduce) {
        burst($('[data-burst]', root), out.id === 'seven' ? 24 : out.gold ? 10 : 4);
        for (let i = 0; i < 6; i++) { frame(5 + (i % 2)); await wait(160); }
      } else frame(6);
    }
    if (!reduce) idle(); else if (out.id === 'bust') frame(0);
    busy = false;
    update();
  };

  btn.addEventListener('click', pull);
  art.addEventListener('click', pull);
  art.style.cursor = 'pointer';
  loan.addEventListener('click', () => {
    sack += 300;
    result.dataset.win = 'false';
    result.textContent = "The Boss's Loan: a pile of gold now. Next night's demand +25%.";
    update();
    btn.focus();
  });
  update();
}

function lockbox() {
  const btn = $<HTMLButtonElement>('[data-lockbox]');
  if (!btn) return;
  const px = $('[data-lockbox-px]', btn)!;
  const cta = $('[data-box-cta]', btn)!;
  const result = $('[data-box-result]')!;
  let open = false, busy = false;

  const openBox = async () => {
    if (open || busy) return;
    busy = true;
    const out = pick(LOCKBOX);
    // The last frame has gold in it: only a gold burst ends there; everything else stops on the open lid.
    const last = out.gold ? 4 : 3;
    if (!reduce) for (let f = 1; f <= last; f++) { px.style.setProperty('--f', String(f)); await wait(80); }
    px.style.setProperty('--f', String(last));
    result.textContent = out.text;
    if (out.gold) burst($('[data-burst]', btn), 12);
    cta.textContent = 'Another box';
    open = true;
    busy = false;
  };
  const close = () => {
    open = false;
    px.style.setProperty('--f', '0');
    cta.textContent = 'Open it';
    result.textContent = '';
  };
  btn.addEventListener('click', () => (open ? close() : openBox()));
  // Standing close is enough: hovering opens it, like walking up to it in the game.
  if (fine) btn.addEventListener('pointerenter', () => { if (!open) openBox(); });
}

function dealCards() {
  // Without JS the cards are dealt face up and the hidden text already reads the card.
  // With JS they start face down: the button says so, and turning it over reads the card.
  $$<HTMLButtonElement>('[data-deal]').forEach((card) => {
    const sr = $('[data-deal-sr]', card)!;
    const faceText = sr.textContent ?? '';
    const down = `Deal card ${card.dataset.n}, face down. Turn it over.`;
    sr.textContent = down;
    card.addEventListener('click', () => {
      const flipped = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', String(flipped));
      sr.textContent = flipped ? faceText : down;
    });
  });
}
