/* ---------- Night sky: stars + bats ---------- */
const cv = document.getElementById('sky');
const ctx = cv.getContext('2d');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let W, H, stars = [], bats = [];

function resize() {
  const d = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  cv.width = W * d;
  cv.height = H * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  stars = Array.from({ length: Math.round((W * H) / 9000) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.7,
    r: Math.random() * 1.3 + 0.3,
    p: Math.random() * 6.28
  }));
}

function makeBats() {
  bats = Array.from({ length: 5 }, () => ({
    x: Math.random() * window.innerWidth,
    y: 60 + Math.random() * window.innerHeight * 0.45,
    s: 0.8 + Math.random() * 1.0,
    v: 0.6 + Math.random() * 1.0,
    f: Math.random() * 6,
    ph: Math.random() * 6
  }));
}

function drawBat(x, y, s, f) {
  const w = Math.sin(f);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#07030f';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(10, -12 - 8 * w, 24, -6 - 14 * w);
  ctx.quadraticCurveTo(20, -4 * w, 16, 4 - 4 * w);
  ctx.quadraticCurveTo(12, 0, 8, 6);
  ctx.quadraticCurveTo(4, 2, 0, 6);
  ctx.quadraticCurveTo(-4, 2, -8, 6);
  ctx.quadraticCurveTo(-12, 0, -16, 4 - 4 * w);
  ctx.quadraticCurveTo(-20, -4 * w, -24, -6 - 14 * w);
  ctx.quadraticCurveTo(-10, -12 - 8 * w, 0, 0);
  ctx.fill();
  ctx.beginPath(); // ears
  ctx.moveTo(-3, -1); ctx.lineTo(-2, -7); ctx.lineTo(0, -2);
  ctx.lineTo(2, -7); ctx.lineTo(3, -1);
  ctx.fill();
  ctx.restore();
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t / 900 + s.p));
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 6.28);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (!reduce) {
    for (const b of bats) {
      b.x -= b.v;
      b.f += 0.22;
      if (b.x < -40) { b.x = W + 40; b.y = 60 + Math.random() * H * 0.45; }
      drawBat(b.x, b.y + Math.sin(t / 600 + b.ph) * 18, b.s, b.f);
    }
    requestAnimationFrame(frame);
  }
}

window.addEventListener('resize', () => { resize(); if (reduce) frame(0); });
resize();
makeBats();
requestAnimationFrame(frame);

/* ---------- Terminal ---------- */
const term = document.getElementById('term');
const actions = document.getElementById('actions');
const countEl = document.getElementById('count');
const mainEl = document.getElementById('main');
const pumpkin = document.getElementById('pumpkin');
const face = document.getElementById('face');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Personal links: ...?name=Sipho
const name = (new URLSearchParams(location.search).get('name') || '').trim().slice(0, 20) || 'friend';

const treats = [
  ['1 clean merge with zero conflicts', '🍬'],
  ['code that works on the first run', '🍫'],
  ['a green CI pipeline', '✅'],
  ['a Friday deploy that just works', '🍭'],
  ['infinite coffee', '☕'],
  ['a Stack Overflow answer that actually works', '🎁'],
  ['a bug that fixed itself', '🪄'],
  ['a code review that says "LGTM"', '👍']
];

const tricks = [
  ['Your code works... but you have no idea why.', '😱'],
  ['Someone ran git push --force on main.', '💀'],
  ['"It works on my machine."', '👻'],
  ['A missing semicolon is hiding in line 1.', '🧟'],
  ['Your CSS is no longer centered.', '🦇'],
  ['node_modules just grew to 4 GB.', '🕷️'],
  ['The bug only shows up in production.', '🔥'],
  ['Merge conflict in 47 files.', '🧛']
];

async function line(segs, speed = 22) {
  const div = document.createElement('div');
  term.appendChild(div);
  for (const [cls, text] of segs) {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    div.appendChild(span);
    if (reduce) { span.textContent = text; continue; }
    for (const ch of text) {
      span.textContent += ch;
      await sleep(speed);
    }
  }
  term.scrollTop = term.scrollHeight;
}

function rain(list, n = 8) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = 'fly';
    el.textContent = list[Math.floor(Math.random() * list.length)];
    el.style.left = 8 + Math.random() * 84 + 'vw';
    el.style.bottom = '6vh';
    el.style.animationDelay = i * 0.08 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2700);
  }
}

async function intro() {
  await line([['p', '$ '], ['', './trick-or-treat.sh --user="' + name + '"']]);
  await sleep(300);
  await line([['d', 'Knock knock... 🚪']]);
  await sleep(250);
  await line([['g', 'Happy Halloween, ' + name + '! 🎃']], 30);
  await line([['d', 'Choose your fate:']]);
  actions.hidden = false;
}

let treatCount = 0;
const last = { treat: -1, trick: -1 };

function pick(kind) {
  const pool = kind === 'treat' ? treats : tricks;
  let i;
  do { i = Math.floor(Math.random() * pool.length); } while (i === last[kind] && pool.length > 1);
  last[kind] = i;
  return pool[i];
}

actions.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const kind = btn.dataset.kind;
  const buttons = actions.querySelectorAll('button');
  buttons.forEach((b) => (b.disabled = true));

  await line([['p', '$ '], ['', './choose --' + kind]], 14);
  const [text, emoji] = pick(kind);

  if (kind === 'treat') {
    treatCount++;
    countEl.textContent = '🍬 ' + treatCount;
    rain(['🍬', '🍫', '🍭', '🎃', '⭐']);
    await line([['g', 'TREAT! You get: '], ['o', text + ' ' + emoji]]);
  } else {
    mainEl.classList.remove('shake');
    void mainEl.offsetWidth;
    mainEl.classList.add('shake');
    rain(['🦇', '👻', '💀', '🕷️']);
    if (!pumpkin.classList.contains('off')) {
      pumpkin.classList.add('off');
      setTimeout(() => pumpkin.classList.remove('off'), 700);
    }
    await line([['p', 'TRICK! '], ['o', text + ' ' + emoji]]);
  }
  buttons.forEach((b) => (b.disabled = false));
});

intro();

/* ---------- Pumpkin: eyes follow, tap to toggle ---------- */
function look(x, y) {
  const r = pumpkin.getBoundingClientRect();
  const dx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / 200)) * 6;
  const dy = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / 200)) * 4;
  face.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
}
window.addEventListener('pointermove', (e) => look(e.clientX, e.clientY));

function toggleLight() {
  pumpkin.classList.toggle('off');
  if (!pumpkin.classList.contains('off')) rain(['🦇', '👻', '🎃'], 6);
}
pumpkin.addEventListener('click', toggleLight);
pumpkin.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLight(); }
});

/* ---------- Share a personal link ---------- */
document.getElementById('share').addEventListener('click', async () => {
  const friend = prompt("Friend's name?");
  if (friend === null) return;
  const url = new URL(location.href.split('?')[0].split('#')[0]);
  if (friend.trim()) url.searchParams.set('name', friend.trim().slice(0, 20));
  const link = url.toString();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Happy Halloween 🎃', text: 'A haunted terminal just for you 👻', url: link });
      return;
    }
    await navigator.clipboard.writeText(link);
    await line([['g', 'Link copied! Paste it in WhatsApp 📋']]);
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    prompt('Copy this link:', link);
  }
});