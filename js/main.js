
/* Dr Durai Foot Care — consolidated main.js
   Booking, validation, Google Apps Script submission,
   scroll effects, mobile navigation, animations, and contact button.
*/
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const REQ = 'This field is required.';
  const PHONE_ERROR = 'Please enter a valid contact number.';

  const scriptURL =
    'https://script.google.com/macros/s/AKfycbwyMqyLbMLvKALLlPYBc0fB36cVGBxK_8wxr_su6tXMZqPo818ZzbsOrLpZMh0aoq0c/exec';

  // ---------------- BOOKING MODAL ----------------

  const overlay = $('#ov');
  const mainContent = $('#main');
  const bookingForm = $('#fm');
  const header = $('header');
  const footer = $('footer');

  function openBooking() {
    if (!overlay) return;

    overlay.classList.add('on');
    overlay.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (mainContent) mainContent.inert = true;
    if (header) header.inert = true;
    if (footer) footer.inert = true;

    // Patient name field has been removed.
    window.setTimeout(() => $('#ph')?.focus(), 50);
  }

  function closeBooking() {
    if (!overlay) return;

    overlay.classList.remove('on');
    overlay.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (mainContent) mainContent.inert = false;
    if (header) header.inert = false;
    if (footer) footer.inert = false;

    try {
      sessionStorage.setItem('bk', '1');
    } catch (_) {}
  }

  $$('[data-open]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();

      if ($('#fw')) $('#fw').style.display = '';
      if ($('#ok')) $('#ok').style.display = 'none';
      if ($('#nv')) $('#nv').classList.remove('on');

      openBooking();
    });
  });

  ['#cl', '#ca', '#ok2'].forEach(selector => {
    $(selector)?.addEventListener('click', closeBooking);
  });

  overlay?.addEventListener('mousedown', event => {
    if (event.target === overlay) closeBooking();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay?.classList.contains('on')) {
      closeBooking();
    }
  });

  // ---------------- FORM VALIDATION ----------------

  function setError(element, message) {
    const error = element?.closest('.f')?.querySelector('.err');

    if (error) error.textContent = message || '';

    return !message;
  }

  function validateBookingForm() {
    let valid = true;

    // Phone number validation
    const phoneInput = $('#ph');
    const phone = (phoneInput?.value || '').replace(/[\s-]/g, '');

    // Accept 10-digit numbers and common Indian prefixes.
    const normalizedPhone = phone.replace(
      /^(?:\+91|91|0)(?=\d{10}$)/,
      ''
    );

    valid = setError(
      phoneInput,
      !phone
        ? REQ
        : /^[6-9]\d{9}$/.test(normalizedPhone)
          ? ''
          : PHONE_ERROR
    ) && valid;

    // Gender validation
    const genderField = $('#gn');

    valid = setError(
      genderField,
      $('input[name="g"]:checked') ? '' : REQ
    ) && valid;

    // Consultation mode validation
    const modeInput = $('#md');

    valid = setError(
      modeInput,
      modeInput?.value ? '' : REQ
    ) && valid;

    // Consent validation
    const consentInput = $('#cn');

    valid = setError(
      consentInput,
      consentInput?.checked ? '' : REQ
    ) && valid;

    return valid;
  }

  // ---------------- BRANCH DETECTION ----------------

  function getBranch() {
    const allowedBranches = {
      chennai: 'Chennai',
      madurai: 'Madurai',
      trichy: 'Trichy',
      pudukkottai: 'Pudukkottai'
    };

    const params = new URLSearchParams(window.location.search);

    const branchKey = (
      params.get('branch') || 'general'
    ).trim().toLowerCase();

    return allowedBranches[branchKey] || 'General';
  }

  // ---------------- APPOINTMENT SUBMISSION ----------------

  // This is the only submit handler for the appointment form.
  bookingForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const errorMessage = $('#errorMessage');

    if (errorMessage) {
      errorMessage.textContent = '';
      errorMessage.hidden = true;
    }

    if (!validateBookingForm()) {
      const invalidField = bookingForm.querySelector(
        '.err:not(:empty)'
      )?.closest('.f')?.querySelector('input, select, button');

      invalidField?.focus();
      return;
    }

    const submitButton = bookingForm.querySelector(
      '[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    const formData = new URLSearchParams();

    // No patient name is submitted.
    formData.append('phone', ($('#ph')?.value || '').trim());

    formData.append(
      'gender',
      $('input[name="g"]:checked')?.value || ''
    );

    formData.append('mode', $('#md')?.value || '');
    formData.append('branch', getBranch());

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData
      });

      const result = (await response.text()).trim();

      console.log('Apps Script response:', result);

      if (!response.ok || result !== 'Saved') {
        throw new Error(
          'Appointment submission failed: ' + result
        );
      }

      bookingForm.reset();

      // Show the existing success popup.
      if ($('#fw')) $('#fw').style.display = 'none';
      if ($('#ok')) $('#ok').style.display = 'block';

      console.log('Appointment saved successfully.');

    } catch (error) {
      console.error('Appointment submission error:', error);

      if (errorMessage) {
        errorMessage.textContent =
          'Unable to submit your appointment. Please try again.';

        errorMessage.hidden = false;
      } else {
        window.alert(
          'Unable to submit your appointment. Please try again.'
        );
      }

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });

  // Auto-open booking modal once per session.
  let bookingSeen = false;

  try {
    bookingSeen = sessionStorage.getItem('bk') === '1';
  } catch (_) {}

  if (!bookingSeen) openBooking();

  // ---------------- HEADER SCROLL PROGRESS ----------------

  (() => {
    const pageHeader = $('header');

    if (!pageHeader) return;

    const progress = document.createElement('div');
    progress.id = 'pg';

    pageHeader.appendChild(progress);

    function updateScrollState() {
      const y = window.scrollY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      pageHeader.classList.toggle('sc', y > 10);

      progress.style.transform =
        `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
    }

    window.addEventListener(
      'scroll',
      updateScrollState,
      { passive: true }
    );

    updateScrollState();
  })();

  // ---------------- REVEAL ANIMATIONS ----------------

  (() => {
    const groups = [
      ['.hl>div', 'z'],
      ['.cap', 'z'],
      ['.st', ''],
      ['.about .pic', 'l'],
      ['.about>div:last-child>*', 'r'],
      ['#faq h2', ''],
      ['details', ''],
      ['.ft>div', ''],
      ['.steps', '']
    ];

    groups.forEach(([selector, direction]) => {
      $$(selector).forEach((element, index) => {
        element.classList.add('rv');

        if (direction) {
          element.classList.add(direction);
        }

        if (selector !== '.steps') {
          element.style.setProperty(
            '--d',
            `${index * 0.12}s`
          );
        }
      });
    });

    const revealElements = $$('.rv');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -6% 0px'
      });

      revealElements.forEach(element => {
        observer.observe(element);
      });

    } else {
      revealElements.forEach(element => {
        element.classList.add('in');
      });
    }
  })();

  // ---------------- MOBILE NAVIGATION ----------------

  (() => {
    const nav = $('#nv');
    const navButton = $('#bg');

    if (!nav || !navButton) return;

    const syncNavButton = () => {
      const isOpen = nav.classList.contains('on');

      navButton.classList.toggle('open', isOpen);

      navButton.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      navButton.setAttribute(
        'aria-label',
        isOpen ? 'மெனுவை மூடு' : 'மெனு'
      );
    };

    new MutationObserver(syncNavButton).observe(nav, {
      attributes: true,
      attributeFilter: ['class']
    });

    syncNavButton();

    navButton.addEventListener('click', event => {
      event.stopPropagation();
      nav.classList.toggle('on');
    });

    $$('a:not(.btn)', nav).forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('on');
      });
    });

    document.addEventListener('click', event => {
      if (
        nav.classList.contains('on') &&
        !nav.contains(event.target) &&
        !navButton.contains(event.target)
      ) {
        nav.classList.remove('on');
      }
    });

    document.addEventListener('keydown', event => {
      if (
        event.key === 'Escape' &&
        nav.classList.contains('on')
      ) {
        nav.classList.remove('on');
        navButton.focus();
      }
    });

    window.addEventListener('scroll', () => {
      nav.classList.remove('on');
    }, { passive: true });

    window.addEventListener('resize', () => {
      nav.classList.remove('on');
    });

    const links = $$('a:not(.btn)', nav);

    const sections = links.map(link => {
      const href = link.getAttribute('href');

      return href?.startsWith('#') ? $(href) : null;
    }).filter(Boolean);

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(link => {
              link.classList.toggle(
                'act',
                link.getAttribute('href') ===
                  `#${entry.target.id}`
              );
            });
          }
        });
      }, {
        rootMargin: '-45% 0px -50% 0px'
      });

      sections.forEach(section => {
        sectionObserver.observe(section);
      });
    }
  })();

  // ---------------- ILLUSTRATION IMAGE ----------------

  (() => {
    const sourceImage = $('.doc img');
    const targetImage = $('#ill1');

    if (sourceImage && targetImage) {
      targetImage.src = sourceImage.src;
    }
  })();

  // ---------------- PROCESS PROGRESS RINGS ----------------

  (() => {
    const box = $('.process-rings');

    if (!box) return;

    const circumference = 314.16;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const rings = $$('.process-ring', box).map(ring => {
      const target =
        parseFloat(ring.style.getPropertyValue('--target')) || 0;

      const head = document.createElement('span');
      head.className = 'ring-head';

      const label = document.createElement('span');
      label.className = 'ring-pct';
      label.textContent = '0%';

      ring.append(head, label);

      return {
        ring,
        fill: $('.ring-fill', ring),
        percent: Math.round(
          (1 - target / circumference) * 100
        ),
        head,
        label,
        running: false,
        frame: 0,
        timer: 0
      };
    });

    function setRing(data, progress) {
      const value = progress * data.percent / 100;

      if (data.fill) {
        data.fill.style.strokeDashoffset =
          circumference * (1 - value);
      }

      data.head.style.transform =
        `rotate(${value * 360}deg)`;

      data.label.textContent =
        `${Math.round(progress * data.percent)}%`;
    }

    function playRing(data, delay) {
      clearTimeout(data.timer);
      cancelAnimationFrame(data.frame);

      data.timer = window.setTimeout(() => {
        const start = performance.now();
        const duration = 1700;

        const step = now => {
          const progress = Math.min(
            (now - start) / duration,
            1
          );

          setRing(
            data,
            1 - Math.pow(1 - progress, 3)
          );

          if (progress < 1) {
            data.frame = requestAnimationFrame(step);
          }
        };

        data.frame = requestAnimationFrame(step);
      }, delay);
    }

    function resetRing(data) {
      clearTimeout(data.timer);
      cancelAnimationFrame(data.frame);

      data.running = false;
      data.ring.classList.remove('on');

      setRing(data, 0);
    }

    box.classList.add('pr-js');

    if (
      reducedMotion ||
      !('IntersectionObserver' in window)
    ) {
      rings.forEach(data => {
        data.ring.classList.add('on');
        setRing(data, 1);
      });

      return;
    }

    rings.forEach(data => setRing(data, 0));

    const ringMap = new Map(
      rings.map(data => [data.ring, data])
    );

    const ringObserver = new IntersectionObserver(entries => {
      let stagger = 0;

      entries.forEach(entry => {
        const data = ringMap.get(entry.target);

        if (!data) return;

        if (
          entry.intersectionRatio >= 0.35 &&
          !data.running
        ) {
          data.running = true;

          data.ring.style.transitionDelay =
            `${stagger * 0.18}s`;

          data.ring.classList.add('on');

          playRing(data, stagger * 180 + 150);

          stagger++;

        } else if (
          entry.intersectionRatio === 0 &&
          data.running
        ) {
          data.ring.style.transitionDelay = '0s';
          resetRing(data);
        }
      });
    }, {
      threshold: [0, 0.35]
    });

    rings.forEach(data => {
      ringObserver.observe(data.ring);
    });
  })();

  // ---------------- FLOATING CONTACT BUTTON ----------------

  (() => {
    const button = $('#fcall');
    const popup = $('#fpop');
    const backdrop = $('#fbd');
    const fab = $('#fab');

    if (!button || !popup || !backdrop || !fab) return;

    function setContactOpen(open) {
      button.setAttribute(
        'aria-expanded',
        String(open)
      );

      fab.classList.toggle('open', open);

      popup.hidden = !open;
      backdrop.hidden = !open;

      if (open) {
        popup.querySelector('a')?.focus({
          preventScroll: true
        });
      }
    }

    button.addEventListener('click', () => {
      setContactOpen(
        button.getAttribute('aria-expanded') !== 'true'
      );
    });

    backdrop.addEventListener('click', () => {
      setContactOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !popup.hidden) {
        setContactOpen(false);
        button.focus();
      }
    });

    popup.addEventListener('click', event => {
      if (event.target.closest('a')) {
        window.setTimeout(() => {
          setContactOpen(false);
        }, 150);
      }
    });
  })();

})();
