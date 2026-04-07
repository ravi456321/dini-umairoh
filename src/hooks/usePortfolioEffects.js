import { useCallback, useEffect, useMemo, useState } from 'react';

const NAV_OFFSET = 70;

function animateNumber(element, targetValue, duration = 2000) {
  const startTime = performance.now();

  function updateFrame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    const value = Math.round(targetValue * easedProgress);

    element.textContent = value.toLocaleString();

    if (progress < 1) {
      window.requestAnimationFrame(updateFrame);
    }
  }

  window.requestAnimationFrame(updateFrame);
}

export function usePortfolioEffects(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const currentSection =
        [...sectionIds]
          .reverse()
          .find((sectionId) => {
            const section = document.getElementById(sectionId);
            return section && window.scrollY + window.innerHeight * 0.35 >= section.offsetTop;
          }) ?? sectionIds[0] ?? '';

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  useEffect(() => {
    const animatedElements = document.querySelectorAll('.ftco-animate');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const animationClass = entry.target.dataset.animateEffect || 'fadeInUp';
          entry.target.classList.add(animationClass, 'ftco-animated');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.number[data-number]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.animated === 'true') {
            return;
          }

          entry.target.dataset.animated = 'true';
          animateNumber(entry.target, Number(entry.target.dataset.number));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const navbarState = useMemo(
    () => ({
      scrolled: scrollY > 150,
      awake: scrollY > 350,
      sleep: scrollY >= 150 && scrollY < 350,
    }),
    [scrollY],
  );

  return { activeSection, navbarState, scrollToSection };
}
