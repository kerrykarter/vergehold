document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-quart'
  });

  const nav = document.getElementById('mainNav');
  const collapseEl = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('#navMenu .nav-link, #navMenu .btn');
  const stickyCta = document.getElementById('stickyMobileCta');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);

    if (stickyCta) {
      stickyCta.classList.toggle('is-visible', window.scrollY > 100);
    }
  }, { passive: true });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (collapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      }
    });
  });

  if (stickyCta) {
    stickyCta.classList.toggle('is-visible', window.scrollY > 100);
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.className = 'mt-3';
    statusEl.textContent = '';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          statusEl.className = 'mt-3 vh-form-success';
          statusEl.innerHTML = '<i class="bi bi-check-circle-fill"></i> Thanks - your request has been sent. We\'ll be in touch within 1-2 business days.';
          return;
        }

        return response.json().then(function (data) {
          const errors = data && data.errors;
          const message = errors ? errors.map(function (error) { return error.message; }).join(', ') : 'Something went wrong.';
          throw new Error(message);
        });
      })
      .catch(function () {
        statusEl.className = 'mt-3 vh-form-error';
        statusEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Something went wrong sending your request. Please try again, or email us directly at <a href="mailto:vergehold@polsia.app">vergehold@polsia.app</a>.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
      });
  });
});