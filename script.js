'use strict';

const CFG = {
  name: 'dik',
  petThreshold: 5,
  easterEggPets: 20,
  sleepDelay: 10000,
  petCooldown: 400,
  messages: [
    'you got this, dik. for real.',
    'meow. (translation: bangga banget sama kamu)',
    'kamu lebih kuat dari yang kamu rasa, dik.',
    'sending calmest vibes your way ~',
    'hey, kamu udah hebat banget hari ini.',
    'istirahat dulu ya, dik.',
    'one step at a time. adik pasti bisa.',
    'meow meow. (= kamu luar biasa, dik!)',
    'kamu hebat, adik. always.',
    'tarik napas pelan... hembuskan, dik ~',
    'semangat ya, dik! tapi tetap santai aja.',
    "ga harus sempurna kok, dik. it's okay.",
    'everything is gonna be okay, dik.',
    'apapun hasilnya nanti, adik udah lakuin yang terbaik.',
    'tidur nyenyak ya nanti malam, dik.'
  ],
  snackMessages: [
    'nyam! makasih banyak ya, dik ~',
    'purr... enakk banget! <3',
    'meow! (senang makan bareng adik)'
  ],
  flowerMessages: [
    'ini buket bunga spesial buat kamu, dik',
    'semoga harimu seindah bunga ini ya, dik ~',
    'bunga kecil buat nemenin adik biar ga tegang',
    'kamu berhak dapet bunga hari ini, dik',
    'jangan lupa senyum ya, adik manis'
  ],
  finalMsg: 'good luck, dik'
};

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
let W, H, SC;

const bgCvs = document.createElement('canvas');
const bgCtx = bgCvs.getContext('2d');
let bgDirty = true;
let stars = [];

let windowBounds = { x: 0, y: 0, w: 0, h: 0 };
let plantBounds = { x: 0, y: 0, w: 0, h: 0 };
let lampBounds = { x: 0, y: 0, w: 0, h: 0 };
let shelfBounds = { x: 0, y: 0, w: 0, h: 0 };
let bowlBounds = { x: 0, y: 0, w: 0, h: 0 };

function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  SC = Math.max(2, Math.min(8, Math.floor(vw / 84)));
  W = Math.floor(vw / SC);
  H = Math.floor(vh / SC);
  cvs.width = W;
  cvs.height = H;
  cvs.style.width = (W * SC) + 'px';
  cvs.style.height = (H * SC) + 'px';
  ctx.imageSmoothingEnabled = false;
  bgDirty = true;
  updateUIPositions();
}
window.addEventListener('resize', resize);

let aCtx = null;
function initAudio() {
  if (aCtx) return;
  try {
    aCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    aCtx = null;
  }
}

function playBlip() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(520, t);
  o.frequency.exponentialRampToValueAtTime(780, t + 0.04);
  o.frequency.exponentialRampToValueAtTime(600, t + 0.08);
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.12);
}

function playMeow() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(460, t);
  o.frequency.exponentialRampToValueAtTime(740, t + 0.09);
  o.frequency.exponentialRampToValueAtTime(390, t + 0.28);
  g.gain.setValueAtTime(0.05, t);
  g.gain.linearRampToValueAtTime(0.05, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.35);
}

function playPurr() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(48, t);
  o.frequency.setValueAtTime(56, t + 0.15);
  o.frequency.setValueAtTime(46, t + 0.3);
  g.gain.setValueAtTime(0.022, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.4);
}

function playCrunch() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'triangle';
  o.frequency.setValueAtTime(320, t);
  o.frequency.exponentialRampToValueAtTime(140, t + 0.07);
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.08);
}

function playPounce() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(260, t);
  o.frequency.exponentialRampToValueAtTime(560, t + 0.12);
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.15);
}

function playTwinkle() {
  if (!aCtx || S.muted) return;
  const notes = [659, 784, 987, 1318];
  notes.forEach((freq, idx) => {
    const o = aCtx.createOscillator(), g = aCtx.createGain();
    const t = aCtx.currentTime + idx * 0.08;
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g); g.connect(aCtx.destination);
    o.start(t); o.stop(t + 0.25);
  });
}

function playLullaby() {
  if (!aCtx || S.muted) return;
  const notes = [440, 523, 659, 587];
  notes.forEach((freq, idx) => {
    const o = aCtx.createOscillator(), g = aCtx.createGain();
    const t = aCtx.currentTime + idx * 0.18;
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.025, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g); g.connect(aCtx.destination);
    o.start(t); o.stop(t + 0.35);
  });
}

function playBoop() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(800, t);
  o.frequency.exponentialRampToValueAtTime(1100, t + 0.06);
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.08);
}

function playClick() {
  if (!aCtx || S.muted) return;
  const o = aCtx.createOscillator(), g = aCtx.createGain();
  const t = aCtx.currentTime;
  o.type = 'triangle';
  o.frequency.setValueAtTime(600, t);
  o.frequency.setValueAtTime(300, t + 0.02);
  g.gain.setValueAtTime(0.04, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  o.connect(g); g.connect(aCtx.destination);
  o.start(t); o.stop(t + 0.04);
}

const S = {
  t: 0,
  catName: localStorage.getItem('cat_name') || 'Mochi',
  activeTool: 'pet',
  petCycleCount: 0,
  lastPetTime: -9999,
  lastMsgIdx: -1,
  catState: 'idle',
  stateTimer: 0,
  sleepClock: 0,
  breathPhase: 0,
  blinkTimer: 2 + Math.random() * 3,
  blinkLen: 0,
  tailPhase: 0,
  earTwitch: 0,
  earTwitchCd: 5 + Math.random() * 8,
  squish: 0,
  pointerX: -99,
  pointerY: -99,
  pointerDown: false,
  muted: false,
  particles: [],
  hasBlanket: false,
  holdingBouquet: false,
  lampOn: true,
  easterEggActive: false,
  easterEggTimer: 0,
  sparkleTimer: 0,
  snack: null,
  yarn: { x: -99, y: -99, vx: 0, vy: 0, active: false, held: false }
};

function catX() { return Math.floor((W - CAT_W) / 2); }
function catY() {
  const base = Math.floor(H * 0.42);
  const bob = REDUCED ? 0 : Math.sin(S.breathPhase) * 0.8;
  return base + Math.round(bob);
}
function catCenter() { return { x: catX() + CAT_W / 2, y: catY() + CAT_H / 2 }; }

function onCat(px, py) {
  const cx = catX(), cy = catY();
  return px >= cx && px < cx + CAT_W && py >= cy && py < cy + CAT_H;
}

function onCatNose(px, py) {
  const cx = catX(), cy = catY();
  return px >= cx + 9 && px <= cx + 13 && py >= cy + 8 && py <= cy + 11;
}

function px(x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function drawSprite(rows, pal, ox, oy) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      const color = pal[ch];
      if (color) px(ox + c, oy + r, color);
    }
  }
}

function drawMiniSprite(cvsEl, rows, pal, ox = 0, oy = 0) {
  if (!cvsEl) return;
  const c = cvsEl.getContext('2d');
  c.clearRect(0, 0, cvsEl.width, cvsEl.height);
  c.imageSmoothingEnabled = false;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let col = 0; col < row.length; col++) {
      const ch = row[col];
      const color = pal[ch];
      if (color) {
        c.fillStyle = color;
        c.fillRect(ox + col, oy + r, 1, 1);
      }
    }
  }
}

function buildBg() {
  bgCvs.width = W;
  bgCvs.height = H;
  bgCtx.imageSmoothingEnabled = false;
  const floorY = Math.floor(H * 0.62);

  bgCtx.fillStyle = C.wall;
  bgCtx.fillRect(0, 0, W, floorY);
  bgCtx.fillStyle = C.wallShadow;
  for (let y = 8; y < floorY; y += 12) bgCtx.fillRect(0, y, W, 1);

  bgCtx.fillStyle = C.floor;
  bgCtx.fillRect(0, floorY, W, H - floorY);
  bgCtx.fillStyle = C.baseboard;
  bgCtx.fillRect(0, floorY, W, 2);
  bgCtx.fillStyle = C.floorLine;
  for (let y = floorY + 8; y < H; y += 8) bgCtx.fillRect(0, y, W, 1);

  const ww = 18, wh = 16;
  const wx = Math.floor(W * 0.13), wy = 8;
  windowBounds = { x: wx, y: wy, w: ww, h: wh };

  bgCtx.fillStyle = C.winFrameDk;
  bgCtx.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
  bgCtx.fillStyle = C.winFrame;
  bgCtx.fillRect(wx - 1, wy - 1, ww + 2, wh + 2);
  bgCtx.fillStyle = C.nightSky;
  bgCtx.fillRect(wx, wy, ww, wh);
  bgCtx.fillStyle = C.winFrame;
  bgCtx.fillRect(wx + Math.floor(ww / 2), wy, 1, wh);
  bgCtx.fillRect(wx, wy + Math.floor(wh / 2), ww, 1);

  bgCtx.fillStyle = C.moon;
  bgCtx.fillRect(wx + 3, wy + 3, 2, 1);
  bgCtx.fillRect(wx + 2, wy + 4, 3, 1);
  bgCtx.fillRect(wx + 3, wy + 5, 2, 1);
  bgCtx.fillStyle = C.nightSky;
  bgCtx.fillRect(wx + 4, wy + 3, 1, 1);
  bgCtx.fillRect(wx + 4, wy + 4, 1, 1);

  stars = [];
  for (let i = 0; i < 6; i++) {
    let sx = wx + 1 + Math.floor(Math.random() * (ww - 2));
    let sy = wy + 1 + Math.floor(Math.random() * (wh - 2));
    if (Math.abs(sx - (wx + 3)) >= 3 || Math.abs(sy - (wy + 4)) >= 3) {
      stars.push({ x: sx, y: sy, phase: Math.random() * 6.28 });
    }
  }

  const clx = Math.floor(W * 0.76), cly = 8;
  for (let r = 0; r < CLOCK_SPR.length; r++) {
    for (let c = 0; c < CLOCK_SPR[r].length; c++) {
      const col = CLOCK_PAL[CLOCK_SPR[r][c]];
      if (col) {
        bgCtx.fillStyle = col;
        bgCtx.fillRect(clx + c, cly + r, 1, 1);
      }
    }
  }

  const shx = Math.floor(W * 0.64), shy = floorY - 26;
  shelfBounds = { x: shx, y: shy, w: SHELF_SPR[0].length, h: SHELF_SPR.length };
  for (let r = 0; r < SHELF_SPR.length; r++) {
    for (let c = 0; c < SHELF_SPR[r].length; c++) {
      const col = SHELF_PAL[SHELF_SPR[r][c]];
      if (col) {
        bgCtx.fillStyle = col;
        bgCtx.fillRect(shx + c, shy + r, 1, 1);
      }
    }
  }

  const px0 = Math.floor(W * 0.80), py0 = floorY - 14;
  plantBounds = { x: px0, y: py0, w: 9, h: 14 };
  bgCtx.fillStyle = C.potDk;
  bgCtx.fillRect(px0 + 1, py0 + 9, 6, 5);
  bgCtx.fillStyle = C.pot;
  bgCtx.fillRect(px0, py0 + 8, 8, 2);
  bgCtx.fillRect(px0 + 2, py0 + 10, 4, 3);
  bgCtx.fillStyle = C.plantDk;
  bgCtx.fillRect(px0 + 3, py0 + 4, 2, 5);
  bgCtx.fillStyle = C.plant;
  bgCtx.fillRect(px0 + 2, py0 + 3, 2, 2);
  bgCtx.fillRect(px0 + 4, py0 + 2, 2, 2);
  bgCtx.fillRect(px0 + 1, py0 + 5, 2, 2);
  bgCtx.fillRect(px0 + 5, py0 + 5, 2, 2);
  bgCtx.fillRect(px0 + 0, py0 + 7, 2, 1);
  bgCtx.fillRect(px0 + 6, py0 + 7, 2, 1);

  const bwx = Math.floor(W * 0.18), bwy = floorY + 4;
  bowlBounds = { x: bwx, y: bwy, w: BOWL_SPR[0].length, h: BOWL_SPR.length };
  for (let r = 0; r < BOWL_SPR.length; r++) {
    for (let c = 0; c < BOWL_SPR[r].length; c++) {
      const col = BOWL_PAL[BOWL_SPR[r][c]];
      if (col) {
        bgCtx.fillStyle = col;
        bgCtx.fillRect(bwx + c, bwy + r, 1, 1);
      }
    }
  }

  bgDirty = false;
}

function drawHangingLamp() {
  const lx = Math.floor(W * 0.49), ly = 0;
  lampBounds = { x: lx - 4, y: 0, w: 9, h: 14 };
  drawSprite(LAMP_SPR, LAMP_PAL, lx - 4, ly);

  if (S.lampOn) {
    const glowY = ly + 9;
    ctx.fillStyle = 'rgba(255, 240, 180, 0.08)';
    ctx.beginPath();
    ctx.moveTo(lx, glowY);
    ctx.lineTo(lx - 28, Math.floor(H * 0.64));
    ctx.lineTo(lx + 28, Math.floor(H * 0.64));
    ctx.closePath();
    ctx.fill();
  }
}

function addHeart(x, y) {
  S.particles.push({ type: 'heart', x, y, vx: (Math.random() - 0.5) * 8, vy: -16 - Math.random() * 8, life: 1.1 });
}
function addZzz(x, y) {
  S.particles.push({ type: 'zzz', x, y, vx: 3 + Math.random() * 3, vy: -9 - Math.random() * 3, life: 2.2 });
}
function addSparkle(x, y) {
  S.particles.push({ type: 'sparkle', x, y, vx: (Math.random() - 0.5) * 22, vy: (Math.random() - 0.5) * 22, life: 1.4 });
}
function addCrumb(x, y) {
  S.particles.push({ type: 'crumb', x, y, vx: (Math.random() - 0.5) * 14, vy: -8 - Math.random() * 6, life: 0.8 });
}
function addLeaf(x, y) {
  S.particles.push({ type: 'leaf', x, y, vx: -3 - Math.random() * 6, vy: 8 + Math.random() * 5, life: 1.2 });
}
function addPetal(x, y) {
  S.particles.push({
    type: 'petal',
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 8,
    vy: 10 + Math.random() * 8,
    life: 2.2,
    color: Math.random() > 0.4 ? '#F498A8' : '#FFF0F4'
  });
}

function updateParticles(dt) {
  for (let i = S.particles.length - 1; i >= 0; i--) {
    const p = S.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.type === 'crumb') p.vy += 30 * dt;
    if (p.type === 'petal') p.vx += Math.sin(S.t * 3 + p.y) * 12 * dt;
    if (p.life <= 0) S.particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of S.particles) {
    const alpha = Math.min(1, p.life * 2);
    if (alpha <= 0) continue;
    ctx.globalAlpha = alpha;
    if (p.type === 'heart') {
      drawSprite(HEART_SPR, { 'o': C.heart, '.': null }, Math.round(p.x) - 2, Math.round(p.y) - 2);
    } else if (p.type === 'zzz') {
      px(Math.round(p.x), Math.round(p.y), C.blush);
      px(Math.round(p.x) + 1, Math.round(p.y), C.blush);
      px(Math.round(p.x), Math.round(p.y) + 1, C.blush);
    } else if (p.type === 'sparkle') {
      const bright = Math.sin(S.t * 12 + p.x) > 0;
      px(Math.round(p.x), Math.round(p.y), bright ? '#FFFFFF' : C.sparkle);
      if (bright) {
        px(Math.round(p.x) - 1, Math.round(p.y), C.sparkle);
        px(Math.round(p.x) + 1, Math.round(p.y), C.sparkle);
        px(Math.round(p.x), Math.round(p.y) - 1, C.sparkle);
        px(Math.round(p.x), Math.round(p.y) + 1, C.sparkle);
      }
    } else if (p.type === 'crumb') {
      px(Math.round(p.x), Math.round(p.y), C.fish);
    } else if (p.type === 'leaf') {
      px(Math.round(p.x), Math.round(p.y), C.plant);
      px(Math.round(p.x) + 1, Math.round(p.y), C.plantDk);
    } else if (p.type === 'petal') {
      px(Math.round(p.x), Math.round(p.y), p.color);
      px(Math.round(p.x) + 1, Math.round(p.y), p.color);
    }
    ctx.globalAlpha = 1;
  }
}

let typewriterTimer = null;
const bubbleEl = document.getElementById('speech-bubble');
const bubbleTextEl = document.getElementById('bubble-text');
const easterBannerEl = document.getElementById('easter-banner');

function showBubble(text) {
  hideEasterBanner();
  bubbleEl.classList.add('visible');
  updateUIPositions();
  playMeow();

  if (typewriterTimer) clearInterval(typewriterTimer);
  bubbleTextEl.textContent = '';
  let i = 0;
  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      bubbleTextEl.textContent += text[i];
      i++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      setTimeout(() => {
        if (bubbleTextEl.textContent === text) {
          bubbleEl.classList.remove('visible');
        }
      }, 5000);
    }
  }, 32);
}

function hideBubble() {
  bubbleEl.classList.remove('visible');
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
}

function showEasterEgg() {
  hideBubble();
  S.easterEggActive = true;
  S.holdingBouquet = true;
  S.easterEggTimer = 7;
  S.sparkleTimer = 3.5;
  easterBannerEl.classList.add('visible');
  updateUIPositions();
  playMeow();
  playTwinkle();

  for (let i = 0; i < 25; i++) {
    addSparkle(Math.random() * W, Math.random() * H);
    addPetal(Math.random() * W, Math.random() * (H * 0.5));
  }

  setTimeout(() => {
    easterBannerEl.classList.remove('visible');
    S.easterEggActive = false;
    S.holdingBouquet = false;
  }, 6500);
}

function hideEasterBanner() {
  easterBannerEl.classList.remove('visible');
  S.easterEggActive = false;
}

function updateUIPositions() {
  const r = cvs.getBoundingClientRect();
  const cc = catCenter();
  const screenX = r.left + cc.x * SC;
  const screenY = r.top + (catY() - 8) * SC;

  if (bubbleEl) {
    bubbleEl.style.left = Math.round(screenX) + 'px';
    bubbleEl.style.top = Math.round(screenY) + 'px';
  }
  if (easterBannerEl) {
    easterBannerEl.style.left = Math.round(screenX) + 'px';
    easterBannerEl.style.top = Math.round(screenY) + 'px';
  }
}

function drawRug() {
  const cc = catCenter();
  const rx = 19, ry = 5;
  const cy = catY() + CAT_H - 2;
  for (let dy = -ry; dy <= ry; dy++) {
    for (let dx = -rx; dx <= rx; dx++) {
      const d = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (d <= 1) {
        const c = d > 0.75 ? C.rugDk : d > 0.38 ? C.rug : C.rugLt;
        px(cc.x + dx, cy + dy, c);
      }
    }
  }
  for (let dx = -rx + 3; dx <= rx - 3; dx += 4) {
    for (let dy = -ry + 1; dy <= ry - 1; dy++) {
      const d = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (d < 0.65) px(cc.x + dx, cy + dy, C.rugDk);
    }
  }
}

function drawCat() {
  const cx = catX(), cy = catY();

  let eyeKey = 'normal';
  if (S.blinkLen > 0) eyeKey = 'blink';
  else if (S.catState === 'petting' || S.catState === 'brushing' || S.holdingBouquet || S.easterEggActive) eyeKey = 'happy';
  else if (S.catState === 'sleeping' || S.catState === 'sleepy') eyeKey = 'sleepy';
  else if (S.catState === 'eating') eyeKey = 'happy';
  else if (S.catState === 'pouncing') eyeKey = 'excited';
  else if (S.catState === 'watching') {
    const cc = catCenter();
    const targetX = S.yarn.active ? S.yarn.x : S.pointerX;
    const dx = targetX - cc.x;
    eyeKey = dx < -5 ? 'left' : dx > 5 ? 'right' : 'normal';
  }

  const eyeRows = EYES[eyeKey] || EYES.normal;
  const squishY = S.squish > 0 ? 1 : 0;

  for (let r = 0; r < CAT_H; r++) {
    let rowStr;
    if (r === 6) rowStr = '.' + eyeRows[0] + '..';
    else if (r === 7) rowStr = '.' + eyeRows[1] + '..';
    else rowStr = CAT_BODY[r];

    if (S.earTwitch > 0 && r <= 1) {
      rowStr = '.' + rowStr.substring(0, rowStr.length - 1);
    }

    let drawY = cy + r;
    if (squishY && r === 0) continue;
    if (squishY && r > 0) drawY = cy + r - 1;

    for (let c = 0; c < rowStr.length; c++) {
      const ch = rowStr[c];
      const color = SP[ch];
      if (color) {
        let finalColor = color;
        if (ch === 'b' && (S.catState === 'petting' || S.catState === 'brushing')) {
          finalColor = '#E06878';
        }
        px(cx + c, drawY, finalColor);
      }
    }
  }

  const tailSpeed = (S.catState === 'petting' || S.catState === 'pouncing') ? 6 : (S.catState === 'sleeping' ? 0.6 : 2);
  S.tailPhase += 0.016 * tailSpeed;
  const tailIdx = Math.floor(S.tailPhase) % 4;
  const tail = TAIL_FRAMES[tailIdx];
  const tx = cx + CAT_W - 4, ty = cy + 12;
  for (let r = 0; r < tail.length; r++) {
    for (let c = 0; c < tail[r].length; c++) {
      const ch = tail[r][c];
      if (ch === 'o') px(tx + c, ty + r, C.outline);
      else if (ch === 'f') px(tx + c, ty + r, C.fur);
    }
  }

  if (S.catState === 'petting' || S.catState === 'brushing') {
    const my = cy + 11, mx = cx + 10;
    px(mx, my, C.nose); px(mx + 2, my, C.nose);
    px(mx + 1, my + 1, C.nose);
  } else if (S.catState === 'eating') {
    const my = cy + 11, mx = cx + 10;
    const chewing = Math.floor(S.t * 8) % 2 === 0;
    if (chewing) {
      rect(mx, my, 3, 2, C.outline);
      px(mx + 1, my + 1, '#D48070');
    }
  } else if (S.catState === 'sleepy') {
    const my = cy + 10, mx = cx + 10;
    rect(mx, my, 3, 2, C.outline);
    px(mx + 1, my, C.nose);
    px(mx + 1, my + 1, '#E0A0A0');
  }

  if (S.hasBlanket) {
    const bx = cx - 1, by = cy + 11;
    drawSprite(BLANKET_SPR, BLANKET_PAL, bx, by);
    px(bx + 6, by - 1, C.outline); px(bx + 7, by - 1, C.outline);
    px(bx + 6, by, C.fur); px(bx + 7, by, C.fur);
    px(bx + 16, by - 1, C.outline); px(bx + 17, by - 1, C.outline);
    px(bx + 16, by, C.fur); px(bx + 17, by, C.fur);
  }

  if (S.holdingBouquet || S.easterEggActive) {
    const bx = cx + 4, by = cy + 6;
    drawSprite(BOUQUET_SPR, BOUQUET_PAL, bx, by);
    px(bx + 1, by + 7, C.fur); px(bx + 2, by + 7, C.fur);
    px(bx + 1, by + 8, C.outline); px(bx + 2, by + 8, C.outline);
    px(bx + 12, by + 7, C.fur); px(bx + 13, by + 7, C.fur);
    px(bx + 12, by + 8, C.outline); px(bx + 13, by + 8, C.outline);
  }
}

function updateSnack(dt) {
  if (!S.snack) return;
  const s = S.snack;
  const floorY = Math.floor(H * 0.62) + 6;

  if (s.state === 'falling') {
    s.y += 40 * dt;
    if (s.y >= floorY) {
      s.y = floorY;
      s.state = 'floor';
      s.timer = 0;
    }
  } else if (s.state === 'floor') {
    s.timer += dt;
    if (s.timer > 0.4 && S.catState !== 'eating') {
      S.catState = 'eating';
      S.stateTimer = 2.4;
      playCrunch();
    }
    if (s.timer > 1.2) {
      s.state = 'eating';
      s.timer = 0;
    }
  } else if (s.state === 'eating') {
    s.timer += dt;
    if (Math.random() < dt * 6) {
      addCrumb(s.x + 4, s.y + 2);
      playCrunch();
    }
    if (s.timer > 1.5) {
      S.snack = null;
      S.catState = 'idle';
      const cc = catCenter();
      addHeart(cc.x, cc.y - 6);
      playMeow();
      const msg = CFG.snackMessages[Math.floor(Math.random() * CFG.snackMessages.length)];
      showBubble(msg);
    }
  }
}

function drawSnack() {
  if (!S.snack) return;
  drawSprite(FISH_SPR, FISH_PAL, Math.round(S.snack.x), Math.round(S.snack.y));
}

function updateYarn(dt) {
  if (!S.yarn.active) return;
  const y = S.yarn;
  const floorY = Math.floor(H * 0.62) + 8;

  if (!y.held) {
    y.x += y.vx * dt;
    y.y += y.vy * dt;
    y.vx *= 0.94;
    y.vy *= 0.94;

    if (y.y > floorY) { y.y = floorY; y.vy = 0; }
    if (y.y < floorY - 14) { y.vy += 30 * dt; }
    if (y.x < 10) { y.x = 10; y.vx = Math.abs(y.vx) * 0.7; }
    if (y.x > W - 18) { y.x = W - 18; y.vx = -Math.abs(y.vx) * 0.7; }
  }

  const cc = catCenter();
  const distToCat = Math.hypot(y.x - cc.x, y.y - cc.y);

  if (distToCat < 40 && S.catState !== 'eating' && !S.hasBlanket) {
    if (distToCat > 16) {
      S.catState = 'pouncing';
    } else {
      if (Math.abs(y.vx) < 5 && Math.random() < dt * 3) {
        y.vx = (y.x < cc.x ? -1 : 1) * (20 + Math.random() * 25);
        y.vy = -10;
        playPounce();
        addSparkle(y.x + 4, y.y + 4);
      }
    }
  }
}

function drawYarn() {
  if (!S.yarn.active) return;
  drawSprite(YARN_SPR, YARN_PAL, Math.round(S.yarn.x), Math.round(S.yarn.y));
  px(Math.round(S.yarn.x) - 1, Math.round(S.yarn.y) + 6, C.yarn);
  px(Math.round(S.yarn.x) - 2, Math.round(S.yarn.y) + 7, C.yarn);
}

function drawBrushCursor() {
  if (S.activeTool === 'brush' && S.pointerDown) {
    drawSprite(BRUSH_SPR, BRUSH_PAL, Math.round(S.pointerX) + 2, Math.round(S.pointerY) - 6);
  }
}

function doPet() {
  const now = performance.now();
  if (now - S.lastPetTime < CFG.petCooldown) return;
  S.lastPetTime = now;
  S.sleepClock = 0;
  S.squish = 0.22;
  playBlip();

  if (navigator.vibrate) try { navigator.vibrate(25); } catch (e) { }

  const cc = catCenter();
  addHeart(cc.x + (Math.random() - 0.5) * 12, cc.y - 4);

  if (S.catState === 'sleeping' || S.catState === 'sleepy' || S.hasBlanket) {
    S.hasBlanket = false;
    document.getElementById('btn-blanket').classList.remove('active');
    S.catState = 'idle';
  }
  if (S.holdingBouquet && !S.easterEggActive) {
    S.holdingBouquet = false;
    const flBtn = document.getElementById('btn-flowers');
    if (flBtn) flBtn.classList.remove('active');
  }

  S.petCycleCount++;

  if (S.petCycleCount === CFG.petThreshold) {
    triggerNextMessage();
  } else if (S.petCycleCount > CFG.petThreshold && S.petCycleCount < CFG.easterEggPets) {
    triggerNextMessage();
  } else if (S.petCycleCount >= CFG.easterEggPets) {
    showEasterEgg();
    S.petCycleCount = 0;
  }
}

function triggerNextMessage() {
  let idx;
  do {
    idx = Math.floor(Math.random() * CFG.messages.length);
  } while (idx === S.lastMsgIdx && CFG.messages.length > 1);
  S.lastMsgIdx = idx;
  showBubble(CFG.messages[idx]);
}

function toLogical(e) {
  const r = cvs.getBoundingClientRect();
  const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
  return {
    x: (clientX - r.left) / SC,
    y: (clientY - r.top) / SC
  };
}

function handlePointerDown(e) {
  initAudio();
  const p = toLogical(e);
  S.pointerX = p.x;
  S.pointerY = p.y;
  S.pointerDown = true;
  S.sleepClock = 0;

  if (p.x >= windowBounds.x && p.x <= windowBounds.x + windowBounds.w &&
    p.y >= windowBounds.y && p.y <= windowBounds.y + windowBounds.h) {
    playTwinkle();
    for (let i = 0; i < 15; i++) {
      addSparkle(windowBounds.x + 2 + Math.random() * (windowBounds.w - 4),
        windowBounds.y + 2 + Math.random() * (windowBounds.h - 4));
    }
    showBubble('kamu liat bintang itu, dik? make a wish ~');
    return;
  }

  if (p.x >= lampBounds.x && p.x <= lampBounds.x + lampBounds.w &&
    p.y >= lampBounds.y && p.y <= lampBounds.y + lampBounds.h) {
    S.lampOn = !S.lampOn;
    playClick();
    addSparkle(lampBounds.x + 4, lampBounds.y + 9);
    return;
  }

  if (p.x >= shelfBounds.x && p.x <= shelfBounds.x + shelfBounds.w &&
    p.y >= shelfBounds.y && p.y <= shelfBounds.y + shelfBounds.h) {
    playTwinkle();
    addSparkle(shelfBounds.x + 8, shelfBounds.y + 2);
    showBubble('ada buku dan foto kenangan kita di sini ~');
    return;
  }

  if (p.x >= bowlBounds.x && p.x <= bowlBounds.x + bowlBounds.w &&
    p.y >= bowlBounds.y && p.y <= bowlBounds.y + bowlBounds.h) {
    playBlip();
    addSparkle(bowlBounds.x + 8, bowlBounds.y + 2);
    showBubble('mangkuk makan milik si ' + S.catName + '!');
    return;
  }

  if (p.x >= plantBounds.x && p.x <= plantBounds.x + plantBounds.w &&
    p.y >= plantBounds.y && p.y <= plantBounds.y + plantBounds.h) {
    playBlip();
    addLeaf(plantBounds.x + 4, plantBounds.y + 6);
    return;
  }

  if (S.activeTool === 'snack') {
    S.snack = { x: p.x - 5, y: p.y - 3, state: 'falling', timer: 0 };
    playBlip();
    return;
  }

  if (S.activeTool === 'yarn') {
    S.yarn.active = true;
    S.yarn.x = p.x - 4;
    S.yarn.y = p.y - 4;
    S.yarn.held = true;
    playBlip();
    return;
  }

  if (S.activeTool === 'brush') {
    if (onCat(p.x, p.y)) {
      S.catState = 'brushing';
      playPurr();
      addSparkle(p.x, p.y);
    }
    return;
  }

  if (onCatNose(p.x, p.y)) {
    playBoop();
    const cc = catCenter();
    addHeart(cc.x, cc.y - 8);
    return;
  }

  if (onCat(p.x, p.y)) {
    S.catState = 'petting';
    doPet();
  }
}

function handlePointerMove(e) {
  const p = toLogical(e);
  S.pointerX = p.x;
  S.pointerY = p.y;

  if (S.pointerDown) {
    if (S.activeTool === 'yarn' && S.yarn.held) {
      S.yarn.x = p.x - 4;
      S.yarn.y = p.y - 4;
    } else if (S.activeTool === 'brush' && onCat(p.x, p.y)) {
      S.catState = 'brushing';
      if (Math.random() < 0.25) {
        addSparkle(p.x, p.y);
        playPurr();
      }
    } else if (S.activeTool === 'pet' && onCat(p.x, p.y)) {
      doPet();
    }
  }
}

function handlePointerUp() {
  S.pointerDown = false;
  if (S.yarn.held) {
    S.yarn.held = false;
    S.yarn.vx = (Math.random() - 0.5) * 15;
  }
  if (S.catState === 'petting' || S.catState === 'brushing') {
    S.catState = 'idle';
  }
}

cvs.addEventListener('pointerdown', e => { e.preventDefault(); handlePointerDown(e); }, { passive: false });
cvs.addEventListener('pointermove', e => { handlePointerMove(e); });
window.addEventListener('pointerup', handlePointerUp);
window.addEventListener('pointercancel', handlePointerUp);

cvs.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
cvs.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    initAudio();
    const tool = btn.dataset.tool;

    if (tool === 'blanket') {
      S.hasBlanket = !S.hasBlanket;
      if (S.hasBlanket) {
        btn.classList.add('active');
        S.holdingBouquet = false;
        const flBtn = document.getElementById('btn-flowers');
        if (flBtn) flBtn.classList.remove('active');
        S.catState = 'sleeping';
        playLullaby();
        showBubble('selamat istirahat, adik... mimpi indah ya ~');
      } else {
        btn.classList.remove('active');
        S.catState = 'idle';
        playMeow();
      }
      return;
    }

    if (tool === 'flowers') {
      S.holdingBouquet = true;
      S.hasBlanket = false;
      document.getElementById('btn-blanket').classList.remove('active');
      document.querySelectorAll('.tool-btn').forEach(b => {
        if (b.dataset.tool !== 'blanket') b.classList.remove('active');
      });
      btn.classList.add('active');
      S.activeTool = 'flowers';
      playTwinkle();

      for (let i = 0; i < 20; i++) {
        addPetal(Math.random() * W, Math.random() * (H * 0.6));
      }

      const msg = CFG.flowerMessages[Math.floor(Math.random() * CFG.flowerMessages.length)];
      showBubble(msg);
      return;
    }

    S.holdingBouquet = false;
    document.querySelectorAll('.tool-btn').forEach(b => {
      if (b.dataset.tool !== 'blanket') b.classList.remove('active');
    });
    btn.classList.add('active');
    S.activeTool = tool;

    if (tool === 'yarn') {
      S.yarn.active = true;
      S.yarn.x = Math.floor(W * 0.3);
      S.yarn.y = Math.floor(H * 0.62) + 6;
      playPounce();
    }
  });
});

function initMenuIcons() {
  for (const [key, item] of Object.entries(MENU_ICONS)) {
    const el = document.getElementById('icon-' + key);
    if (el) drawMiniSprite(el, item.spr, item.pal, item.ox, item.oy);
  }
  updateMuteIcon();
  const heartEl = document.getElementById('banner-heart-cvs');
  if (heartEl) drawMiniSprite(heartEl, BANNER_HEART_SPR, BANNER_HEART_PAL, 0, 0);
  const pawEl = document.getElementById('name-paw-cvs');
  if (pawEl) drawMiniSprite(pawEl, NAME_PAW_SPR, NAME_PAW_PAL, 0, 0);
}

function updateMuteIcon() {
  const el = document.getElementById('mute-canvas');
  if (!el) return;
  const spr = S.muted ? SPEAKER_OFF_SPR : SPEAKER_ON_SPR;
  drawMiniSprite(el, spr, SPEAKER_PAL, 1, 1);
  const textEl = document.getElementById('mute-text');
  if (textEl) textEl.textContent = S.muted ? 'Muted' : 'Sound';
}

const muteBtn = document.getElementById('mute-btn');
muteBtn.addEventListener('click', () => {
  initAudio();
  S.muted = !S.muted;
  updateMuteIcon();
});

const nameTagBtn = document.getElementById('name-tag-btn');
const catNameDisplay = document.getElementById('cat-name-display');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('name-input');
const nameCancelBtn = document.getElementById('name-cancel-btn');
const nameSaveBtn = document.getElementById('name-save-btn');

function updateNameDisplay() {
  catNameDisplay.textContent = S.catName;
}
updateNameDisplay();

nameTagBtn.addEventListener('click', () => {
  initAudio();
  nameInput.value = S.catName;
  nameModal.classList.remove('hidden');
  nameInput.focus();
  playBlip();
});

nameCancelBtn.addEventListener('click', () => {
  nameModal.classList.add('hidden');
  playClick();
});

nameSaveBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (val) {
    S.catName = val;
    localStorage.setItem('cat_name', val);
    updateNameDisplay();
    playTwinkle();
    showBubble('halo dik! namaku ' + S.catName + ' ~');
  }
  nameModal.classList.add('hidden');
});

nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') nameSaveBtn.click();
  if (e.key === 'Escape') nameCancelBtn.click();
});

function updateCat(dt) {
  S.breathPhase += dt * (REDUCED ? 0.6 : 2.2);

  S.blinkLen = Math.max(0, S.blinkLen - dt);
  S.blinkTimer -= dt;
  if (S.blinkTimer <= 0 && S.catState !== 'sleeping') {
    S.blinkLen = 0.16;
    S.blinkTimer = 2.5 + Math.random() * 4;
  }

  S.earTwitch = Math.max(0, S.earTwitch - dt);
  S.earTwitchCd -= dt;
  if (S.earTwitchCd <= 0 && S.catState !== 'sleeping') {
    S.earTwitch = 0.15;
    S.earTwitchCd = 4 + Math.random() * 7;
  }

  S.squish = Math.max(0, S.squish - dt * 2.2);

  if (S.catState === 'idle' || S.catState === 'watching') {
    S.sleepClock += dt * 1000;
  }

  switch (S.catState) {
    case 'idle':
      if (S.pointerX >= 0 && !S.pointerDown && !S.hasBlanket) {
        const cc = catCenter();
        const distSq = (S.pointerX - cc.x) ** 2 + (S.pointerY - cc.y) ** 2;
        if (distSq < 1000) S.catState = 'watching';
      }
      if (S.sleepClock > CFG.sleepDelay && !S.hasBlanket) {
        S.catState = 'sleepy';
        S.stateTimer = 1.6;
      }
      break;

    case 'watching':
      if (S.pointerDown || S.pointerX < 0) S.catState = 'idle';
      const cc2 = catCenter();
      if ((S.pointerX - cc2.x) ** 2 + (S.pointerY - cc2.y) ** 2 > 1400) S.catState = 'idle';
      break;

    case 'sleepy':
      S.stateTimer -= dt;
      if (S.stateTimer <= 0) S.catState = 'sleeping';
      break;

    case 'sleeping':
      if (Math.random() < dt * 0.9) {
        addZzz(catCenter().x + 5, catY() + 1);
      }
      break;

    case 'pouncing':
      if (!S.yarn.active) S.catState = 'idle';
      break;
  }
}

let lastT = 0, running = true;

function loop(ts) {
  if (!running) return;
  const dt = Math.min((ts - lastT) / 1000, 0.1);
  lastT = ts;

  if (bgDirty) buildBg();

  S.t += dt;
  updateCat(dt);
  updateSnack(dt);
  updateYarn(dt);
  updateParticles(dt);

  if (S.holdingBouquet || S.easterEggActive) {
    if (Math.random() < dt * 3.5) addPetal(Math.random() * W, 0);
  }

  ctx.drawImage(bgCvs, 0, 0);

  drawHangingLamp();

  for (const s of stars) {
    const twinkle = REDUCED ? 0.8 : 0.4 + 0.6 * Math.max(0, Math.sin(S.t * 1.8 + s.phase));
    ctx.globalAlpha = twinkle;
    px(s.x, s.y, twinkle > 0.7 ? C.star1 : C.star2);
  }
  ctx.globalAlpha = 1;

  drawRug();
  drawCat();
  drawSnack();
  drawYarn();
  drawParticles();
  drawBrushCursor();

  if (S.hasBlanket || !S.lampOn) {
    const darkAlpha = S.hasBlanket && !S.lampOn ? 0.45 : S.hasBlanket ? 0.25 : 0.28;
    ctx.fillStyle = 'rgba(25, 32, 64, ' + darkAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    running = false;
  } else {
    running = true;
    lastT = performance.now();
    requestAnimationFrame(loop);
  }
});

resize();
initMenuIcons();
requestAnimationFrame(ts => {
  lastT = ts;
  loop(ts);
});
