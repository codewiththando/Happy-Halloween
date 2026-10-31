// The code that "types itself" in the window
const lines = [
  '<span class="k">const</span> night = {',
  '  mood: <span class="s">"happy"</span>,',
  '  bugs: <span class="n">0</span>, <span class="c">// only ghosts in prod 👻</span>',
  '  treats: <span class="n">Infinity</span>,',
  '};',
  '',
  '<span class="k">if</span> (night.mood === <span class="s">"happy"</span>) {',
  '  console.log(<span class="s">"Happy Halloween 🎃"</span>);',
  '}'
];

const code = document.getElementById('code');
const out = document.getElementById('out');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const stripTags = (html) => html.replace(/<[^>]+>/g, '');

function typeLine(i) {
  if (i >= lines.length) {
    out.innerHTML = '&gt; Happy Halloween 🎃 <span class="cur"></span>';
    return;
  }

  const full = lines[i];
  const plain = stripTags(full);
  const base = lines.slice(0, i).join('\n') + (i ? '\n' : '');
  let n = 0;

  if (reduceMotion) {
    code.innerHTML = base + full;
    typeLine(i + 1);
    return;
  }

  (function step() {
    n += 3;
    if (n >= plain.length) {
      code.innerHTML = base + full + '<span class="cur"></span>';
      setTimeout(() => typeLine(i + 1), 120);
      return;
    }
    code.innerHTML =
      base + '<span class="c">' + plain.slice(0, n).replace(/</g, '&lt;') + '</span><span class="cur"></span>';
    setTimeout(step, 28);
  })();
}

typeLine(0);

// Tap the pumpkin: toggle the light and release floating emojis
const pumpkin = document.getElementById('pumpkin');
const emojis = ['🦇', '👻', '🎃', '🕸️', '🍬'];

function pop() {
  pumpkin.classList.toggle('off');
  if (pumpkin.classList.contains('off')) return;

  for (let i = 0; i < 7; i++) {
    const el = document.createElement('span');
    el.className = 'fly';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = 10 + Math.random() * 80 + 'vw';
    el.style.bottom = '8vh';
    el.style.animationDelay = i * 0.08 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}

pumpkin.addEventListener('click', pop);
pumpkin.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    pop();
  }
});