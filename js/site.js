let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  const assetVersion = window.__DINART_ASSET_VERSION__ || '20260408-01';
  const nav = document.getElementById('ftco-navbar');
  const navToggle = document.querySelector('.js-fh5co-nav-toggle');
  const navCollapse = document.getElementById('ftco-nav');
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const animatedItems = Array.from(document.querySelectorAll('.ftco-animate'));
  const counters = Array.from(document.querySelectorAll('.number[data-number]'));
  const progressBars = Array.from(document.querySelectorAll('.progress-bar[data-progress]'));
  const loader = document.getElementById('ftco-loader');
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const contactSubmitButton = document.getElementById('contactSubmitButton');
  const formStartedAt = document.getElementById('formStartedAt');

  function appendVersionToLocalUrl(url) {
    if (!url) {
      return url;
    }

    if (/^(?:[a-z]+:|\/\/|#|data:|mailto:|tel:)/i.test(url)) {
      return url;
    }

    try {
      const resolved = new URL(url, window.location.href);

      if (resolved.origin !== window.location.origin) {
        return url;
      }

      resolved.searchParams.set('v', assetVersion);
      return `${resolved.pathname}${resolved.search}${resolved.hash}`;
    } catch (error) {
      return url;
    }
  }

  function bustInlineBackgroundImages() {
    document.querySelectorAll('[style*="background-image"]').forEach((element) => {
      const backgroundImage = element.style.backgroundImage;

      if (!backgroundImage || backgroundImage === 'none') {
        return;
      }

      element.style.backgroundImage = backgroundImage.replace(
        /url\((['"]?)(.*?)\1\)/g,
        (match, quote, assetUrl) => `url("${appendVersionToLocalUrl(assetUrl)}")`,
      );
    });
  }

  function bustDirectAssetLinks() {
    document.querySelectorAll('img[src], source[src], video[poster]').forEach((element) => {
      if (element.hasAttribute('src')) {
        element.setAttribute('src', appendVersionToLocalUrl(element.getAttribute('src')));
      }

      if (element.hasAttribute('poster')) {
        element.setAttribute('poster', appendVersionToLocalUrl(element.getAttribute('poster')));
      }
    });

    document.querySelectorAll('a[href]').forEach((element) => {
      const href = element.getAttribute('href');

      if (!href || !/\.pdf(?:$|[?#])/i.test(href)) {
        return;
      }

      element.setAttribute('href', appendVersionToLocalUrl(href));
    });

    bustInlineBackgroundImages();
  }

  function setContactStatus(type, message) {
    if (!contactStatus) {
      return;
    }

    contactStatus.hidden = false;
    contactStatus.className = `contact-form__status is-${type}`;
    contactStatus.textContent = message;
  }

  function clearContactStatus() {
    if (!contactStatus) {
      return;
    }

    contactStatus.hidden = true;
    contactStatus.className = 'contact-form__status';
    contactStatus.textContent = '';
  }

  function setContactSubmitState(isLoading) {
    if (!contactSubmitButton) {
      return;
    }

    const defaultLabel = contactSubmitButton.dataset.defaultLabel || 'Send Message';
    const loadingLabel = contactSubmitButton.dataset.loadingLabel || 'Sending...';

    contactSubmitButton.disabled = isLoading;
    contactSubmitButton.textContent = isLoading ? loadingLabel : defaultLabel;
  }

  function syncContactStartedAt() {
    if (formStartedAt) {
      formStartedAt.value = String(Math.floor(Date.now() / 1000));
    }
  }

  function showContactStatusFromUrl() {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('contact');

    if (!status) {
      return;
    }

    const messages = {
      success: {
        type: 'success',
        text: 'Your message was sent successfully. A confirmation email is on the way.',
      },
      partial: {
        type: 'warning',
        text: 'Your message was sent, but the auto-reply email could not be sent.',
      },
      validation: {
        type: 'error',
        text: 'Please complete the required fields and try again.',
      },
      rate_limit: {
        type: 'error',
        text: 'Too many messages were sent recently. Please wait a few minutes and try again.',
      },
      error: {
        type: 'error',
        text: 'Sorry, something went wrong while sending your message. Please try again shortly.',
      },
    };

    const entry = messages[status] || messages.error;
    setContactStatus(entry.type, entry.text);
    url.searchParams.delete('contact');
    history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
  }

  function initContactForm() {
    if (!contactForm) {
      return;
    }

    syncContactStartedAt();
    showContactStatusFromUrl();

    contactForm.addEventListener('submit', async (event) => {
      if (!window.fetch || !window.FormData) {
        return;
      }

      event.preventDefault();
      clearContactStatus();
      setContactSubmitState(true);

      const formData = new FormData(contactForm);

      if (formStartedAt && !formData.get('form_started_at')) {
        formData.set('form_started_at', formStartedAt.value);
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        const data = await response.json().catch(() => ({
          ok: false,
          message: 'The server returned an unexpected response.',
        }));

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to send your message right now.');
        }

        const statusType = data.status === 'partial' ? 'warning' : 'success';
        setContactStatus(statusType, data.message || 'Your message was sent successfully.');
        contactForm.reset();
        syncContactStartedAt();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to send your message right now.';
        setContactStatus('error', message);
      } finally {
        setContactSubmitState(false);
      }
    });
  }

  function setFullHeight() {
    document.querySelectorAll('.js-fullheight').forEach((element) => {
      element.style.height = `${window.innerHeight}px`;
    });
  }

  function closeMobileMenu() {
    if (navCollapse) {
      navCollapse.classList.remove('show');
    }

    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function updateNavbarState() {
    const scrollY = window.scrollY;

    if (!nav) {
      return;
    }

    nav.classList.toggle('scrolled', scrollY > 150);
    nav.classList.toggle('awake', scrollY > 350);
    nav.classList.toggle('sleep', scrollY >= 150 && scrollY < 350);

    let activeId = sections.length ? sections[0].id : '';

    sections.forEach((section) => {
      if (scrollY + window.innerHeight * 0.35 >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);

      const navItem = link.closest('.nav-item');
      if (navItem) {
        navItem.classList.toggle('active', isActive);
      }
    });
  }

  function scrollToTarget(targetId) {
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function initSlider() {
    const slider = document.querySelector('.home-slider');
    if (!slider) {
      return;
    }

    const slides = Array.from(slider.querySelectorAll('.slider-item'));
    if (!slides.length) {
      return;
    }

    const dots = document.createElement('div');
    dots.className = 'owl-dots';

    let activeIndex = 0;
    let intervalId;

    function renderSlide(nextIndex) {
      activeIndex = nextIndex;

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      dots.querySelectorAll('.owl-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    }

    function startAutoPlay() {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => {
        renderSlide((activeIndex + 1) % slides.length);
      }, 5000);
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'owl-dot';
      dot.setAttribute('aria-label', `Show slide ${index + 1}`);
      dot.addEventListener('click', () => {
        renderSlide(index);
        startAutoPlay();
      });
      dots.appendChild(dot);
    });

    slider.appendChild(dots);
    renderSlide(0);
    startAutoPlay();
  }

  function initAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('fadeInUp', 'ftco-animated');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );

    animatedItems.forEach((item) => observer.observe(item));
  }

  function animateNumber(element, targetValue, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(targetValue * eased);

      element.textContent = value.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    }

    window.requestAnimationFrame(update);
  }

  function initCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.animated === 'true') {
            return;
          }

          entry.target.dataset.animated = 'true';
          animateNumber(entry.target, Number(entry.target.dataset.number), 2000);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function initProgressBars() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.animated === 'true') {
            return;
          }

          entry.target.dataset.animated = 'true';
          entry.target.style.width = `${entry.target.dataset.progress}%`;
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    progressBars.forEach((bar) => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  if (navToggle && navCollapse) {
    navToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = navCollapse.classList.toggle('show');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      return;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTarget(href);
      closeMobileMenu();
    });
  });

  bustDirectAssetLinks();
  setFullHeight();
  initSlider();
  initAnimations();
  initCounters();
  initProgressBars();
  applyLanguage();
  updateNavbarState();
  initContactForm();

  window.addEventListener('resize', setFullHeight);
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  window.setTimeout(() => {
    if (loader) {
      loader.classList.remove('show');
    }
  }, 150);
});

function updateLanguageAttributes() {
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    el.placeholder = currentLang === 'en' ? el.dataset.placeholderEn : el.dataset.placeholderId;
  });
  document.querySelectorAll('[data-value-en]').forEach(el => {
    el.value = currentLang === 'en' ? el.dataset.valueEn : el.dataset.valueId;
  });
}

function updateLanguageSwitcher() {
  const langEn = document.getElementById('langEn');
  const langId = document.getElementById('langId');

  if (langEn) {
    const isActive = currentLang === 'en';
    langEn.classList.toggle('is-active', isActive);
    langEn.setAttribute('aria-pressed', String(isActive));
  }

  if (langId) {
    const isActive = currentLang === 'id';
    langId.classList.toggle('is-active', isActive);
    langId.setAttribute('aria-pressed', String(isActive));
  }
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('.text-en').forEach(el => el.style.display = currentLang === 'en' ? '' : 'none');
  document.querySelectorAll('.text-id').forEach(el => el.style.display = currentLang === 'id' ? '' : 'none');
  updateLanguageAttributes();
  updateLanguageSwitcher();
}

function setLanguage(language) {
  if (language !== 'en' && language !== 'id') {
    return;
  }

  currentLang = language;
  applyLanguage();
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'id' : 'en';
  applyLanguage();
}
