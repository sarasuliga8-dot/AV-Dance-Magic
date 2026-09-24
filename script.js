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

const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form['your-name'].value;
    const interest = form.interest.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const message = form.message.value;

    const subject = `New enquiry from ${name}`;
    const body =
      `Name: ${name}\n` +
      `Interested in: ${interest}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Message: ${message}`;

    window.location.href =
      `mailto:info@avdancestudio.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    success.hidden = false;
  });
}
