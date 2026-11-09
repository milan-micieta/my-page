import { useEffect } from 'react';

/**
 * Clean native scroll setup with smooth anchor navigation.
 * Zero wheel-hijacking or scroll blocking, ensuring 100% natural 60/120fps browser physics.
 */
export function useLenisSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    // Smooth anchor navigation (#projekty, #o-mne, #schopnosti, etc.)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const rect = targetEl.getBoundingClientRect();
        const absoluteTop = rect.top + (window.scrollY || window.pageYOffset);
        window.scrollTo({
          top: Math.max(0, absoluteTop - 64),
          behavior: 'smooth',
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
}
