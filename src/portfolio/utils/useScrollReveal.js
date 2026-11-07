import { useState, useEffect } from 'react';

/**
 * Observes a section or card ref and returns `revealed` boolean.
 * Repeats the animation smoothly whenever the element enters or leaves the viewport
 * (both when scrolling down and when scrolling back up).
 * Falls back to immediately revealed in test/SSR environments without IntersectionObserver.
 */
export function useScrollReveal(sectionRef, options = {}) {
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = sectionRef && sectionRef.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      const childCards = el.querySelectorAll('.scroll-reveal-card');
      childCards.forEach((card) => card.classList.add('is-card-visible'));
      return undefined;
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setRevealed(entry.isIntersecting);
        });
      },
      {
        threshold: options.threshold ?? 0.08,
        rootMargin: options.rootMargin ?? '0px 0px -36px 0px',
      }
    );

    sectionObserver.observe(el);

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-card-visible');
          } else {
            entry.target.classList.remove('is-card-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -28px 0px',
      }
    );

    const childCards = el.querySelectorAll('.scroll-reveal-card');
    childCards.forEach((card) => cardObserver.observe(card));

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
    };
  }, [sectionRef, options.threshold, options.rootMargin]);

  return revealed;
}
