document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canRevealOnScroll = 'IntersectionObserver' in window;

  if (!prefersReducedMotion && canRevealOnScroll) {
    const heroElements = document.querySelectorAll(
      '.vh-home-hero__content, .vh-home-hero__image, .vh-about-hero__image, .vh-about-hero__content, .vh-page-header > .container, .vh-404 > .container'
    );
    heroElements.forEach(function (element, index) {
      element.classList.add('vh-motion-hero');
      element.style.setProperty('--vh-motion-delay', index % 2 ? '80ms' : '0ms');
    });

    const revealElements = document.querySelectorAll(
      'main > section, body > .vh-section, body > .vh-cta, body > .vh-404'
    );
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (element) {
      element.classList.add('vh-motion-reveal');
      revealObserver.observe(element);
    });

    document.body.classList.add('vh-motion-ready');
  }

  const nav = document.getElementById('mainNav');
  const collapseEl = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('#navMenu .nav-link, #navMenu .btn');
  const stickyCta = document.getElementById('stickyMobileCta');

  // Add the scrolled navigation style and reveal the mobile CTA as the user scrolls.
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);

    if (stickyCta) {
      stickyCta.classList.toggle('is-visible', window.scrollY > 100);
    }
  }, { passive: true });

  // Close the mobile navigation after a user selects a page or action.
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (collapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      }
    });
  });

  // Set the correct initial mobile CTA state when the page loads below the scroll threshold.
  if (stickyCta) {
    stickyCta.classList.toggle('is-visible', window.scrollY > 100);
  }

  // Keep the footer copyright year current without editing each HTML page annually.
  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = '© ' + currentYear;

  // Contact pages continue with form behavior; other pages only use the shared features above.
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Submit the contact request asynchronously and show the appropriate result to the user.
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
        // Reset the form and show a confirmation when the service accepts the request.
        if (response.ok) {
          form.reset();
          statusEl.className = 'mt-3 vh-form-success';
          statusEl.innerHTML = '<i class="bi bi-check-circle-fill"></i> Thanks - your request has been sent. We\'ll be in touch within 1-2 business days.';
          return;
        }

        // Convert server-side validation errors into a message for the error handler.
        return response.json().then(function (data) {
          const errors = data && data.errors;
          const message = errors ? errors.map(function (error) { return error.message; }).join(', ') : 'Something went wrong.';
          throw new Error(message);
        });
      })
      .catch(function () {
        // Show a recovery message when the request or response processing fails.
        statusEl.className = 'mt-3 vh-form-error';
        statusEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Something went wrong sending your request. Please try again, or email us directly at <a href="mailto:vergehold@polsia.app">vergehold@polsia.app</a>.';
      })
      .finally(function () {
        // Restore the submit button after either a success or failure.
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
      });
  });
});