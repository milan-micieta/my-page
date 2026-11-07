import { useEffect, useRef } from 'react';

/**
 * Observes `.reveal-on-scroll` elements inside the returned container ref and adds `.is-visible`
 * using cubic-bezier(0.22, 1, 0.36, 1). Falls back to immediately visible in test/SSR environments.
 */
export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const elements = root.querySelectorAll('.reveal-on-scroll');
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
