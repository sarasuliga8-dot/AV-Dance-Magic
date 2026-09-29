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

const callbackToggle = document.getElementById('callback-toggle');
const callbackForm = document.getElementById('callback-form');
const callbackModal = document.getElementById('callback-modal');
const callbackClose = document.getElementById('callback-close');

if (callbackToggle && callbackModal) {
  callbackToggle.addEventListener('click', () => {
    openCallbackModal();
  });
}

if (callbackClose && callbackModal) {
  callbackClose.addEventListener('click', () => {
    callbackModal.close();
  });
}

if (callbackModal) {
  callbackModal.addEventListener('click', (e) => {
    if (e.target === callbackModal) callbackModal.close();
  });
}

const callbackSuccess = document.getElementById('callback-success');
const cbName = document.getElementById('cb-name');
const cbPhone = document.getElementById('cb-phone');
const cbSubmit = document.getElementById('callback-submit');

const isCallbackFormValid = () =>
  Boolean(cbName && cbPhone && cbName.value.trim().length > 0 && /^[0-9]{7,15}$/.test(cbPhone.value.trim()));

if (cbName && cbPhone && cbSubmit) {
  const updateSubmitState = () => {
    cbSubmit.disabled = !isCallbackFormValid();
  };

  cbName.addEventListener('input', updateSubmitState);
  cbPhone.addEventListener('input', updateSubmitState);
  updateSubmitState();
}

if (callbackModal) {
  callbackModal.addEventListener('close', () => {
    callbackForm.reset();
    callbackSuccess.hidden = true;
    cbSubmit.disabled = true;
  });
}

if (callbackForm) {
  callbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isCallbackFormValid()) return;

    const name = callbackForm['cb-name'].value;
    const phone = `${callbackForm['cb-phone-code'].value} ${callbackForm['cb-phone'].value}`;

    const subject = `Callback request from ${name}`;
    const body = `Name: ${name}\nPhone: ${phone}`;

    window.location.href =
      `mailto:info@avdancestudio.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    callbackForm.reset();
    cbSubmit.disabled = true;
    callbackSuccess.hidden = false;
  });
}

/* Fading music notes: shared by the cursor trail and the callback popup entrance */
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

/* Callback popup: slide in from the right, trailing music notes, settle centred */
function openCallbackModal() {
  const startX = window.innerWidth;
  const duration = 650;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  callbackModal.style.transform = `translateX(${startX}px)`;
  callbackModal.showModal();

  const startTime = performance.now();
  let lastSpawnX = null;

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const offset = startX * (1 - eased);

    callbackModal.style.transform = `translateX(${offset}px)`;

    const rect = callbackModal.getBoundingClientRect();
    if (lastSpawnX === null || Math.abs(rect.right - lastSpawnX) > 8) {
      for (let i = 0; i < 3; i++) {
        const y = rect.top + Math.random() * rect.height;
        spawnNote(rect.right, y, 30);
      }
      lastSpawnX = rect.right;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      callbackModal.style.transform = 'translateX(0)';
    }
  };

  requestAnimationFrame(step);
}
