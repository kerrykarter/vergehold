document.addEventListener('DOMContentLoaded', function () {
  // Init scroll-reveal animations
  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-quart'
  });

  // Add shadow to nav once page is scrolled
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  });

  // Close mobile menu after clicking a link
  const navLinks = document.querySelectorAll('#navMenu .nav-link, #navMenu .btn');
  const collapseEl = document.getElementById('navMenu');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (collapseEl.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
        bsCollapse.hide();
      }
    });
  });
});


// Contact form: builds a mailto link from the form fields and opens it
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const location = form.location.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Inspection Request — ${service}`);
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone/WhatsApp: ${phone}` : null,
      `Service needed: ${service}`,
      location ? `Property location: ${location}` : null,
      '',
      message || '(No additional message provided)'
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = `mailto:vergehold@polsia.app?subject=${subject}&body=${body}`;
  });
});