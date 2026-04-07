document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('ftco-navbar');
  const navToggle = document.querySelector('.js-fh5co-nav-toggle');
  const navCollapse = document.getElementById('ftco-nav');
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const animatedItems = Array.from(document.querySelectorAll('.ftco-animate'));
  const counters = Array.from(document.querySelectorAll('.number[data-number]'));
  const loader = document.getElementById('ftco-loader');

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

  setFullHeight();
  initSlider();
  initAnimations();
  initCounters();
  updateNavbarState();

  window.addEventListener('resize', setFullHeight);
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  window.setTimeout(() => {
    if (loader) {
      loader.classList.remove('show');
    }
  }, 150);
});

