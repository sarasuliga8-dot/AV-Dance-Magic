const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const phoneReveal = document.getElementById('phoneReveal');

if (phoneReveal) {
  const revealPhone = () => {
    const link = document.createElement('a');
    link.href = 'tel:+447717380266';
    link.className = 'phone-link';
    link.textContent = '+44 7717 380266';
    phoneReveal.replaceWith(link);
  };

  phoneReveal.addEventListener('click', revealPhone);
  phoneReveal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealPhone();
    }
  });
}

document.querySelectorAll('.footer-phone-reveal').forEach((el) => {
  const revealFooterPhone = () => {
    const link = document.createElement('a');
    link.href = 'tel:+447717380266';
    link.textContent = '+44 7717 380266';
    el.replaceWith(link);
  };

  el.addEventListener('click', revealFooterPhone);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealFooterPhone();
    }
  });
});

/* Fading music notes: shared by the cursor trail and any future popup entrances */
const NOTE_CHARS = ['♪', '♫'];
let noteIndex = 0;

function spawnNote(x, y, size) {
  const side = noteIndex % 2 === 0 ? 1 : -1;
  noteIndex++;

  const note = document.createElement('span');
  note.className = 'cursor-note';
  note.textContent = NOTE_CHARS[noteIndex % NOTE_CHARS.length];
  note.style.left = `${x + side * 8}px`;
  note.style.top = `${y}px`;
  note.style.setProperty('--note-rot', `${side * 12}deg`);
  if (size) note.style.fontSize = `${size}px`;

  document.body.appendChild(note);
  note.addEventListener('animationend', () => note.remove());
}

/* Custom cursor trail: fading music notes follow the mouse */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const MIN_DISTANCE = 28;
  let lastX = null;
  let lastY = null;

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (lastX !== null) {
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < MIN_DISTANCE) return;
    }
    lastX = x;
    lastY = y;

    spawnNote(x, y);
  });
}
