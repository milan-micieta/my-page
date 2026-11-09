import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 16-tabs-sliding:
 * Measures the active tab ([aria-selected="true"] or .is-active) inside containerRef
 * and updates .t-tabs-pill's transform + width/height.
 * On first paint and window resize, updates without transition; on state change, tweens smoothly.
 */
export function useSlidingTabsPill(containerRef, activeKey) {
  const isFirstPaintRef = useRef(true);

  useEffect(() => {
    const bar = containerRef.current;
    if (!bar) return undefined;

    const pill = bar.querySelector('.t-tabs-pill');
    if (!pill) return undefined;

    const findActiveTab = () =>
      bar.querySelector('[aria-selected="true"]') ||
      bar.querySelector('.is-active') ||
      bar.querySelector('button');

    const moveTo = (tab, animate) => {
      if (!tab) return;
      const x = tab.offsetLeft || 0;
      const y = tab.offsetTop || 0;
      const w = tab.offsetWidth || 0;
      const h = tab.offsetHeight || 0;

      if (!animate) {
        const prev = pill.style.transition;
        pill.style.transition = 'none';
        pill.style.transform = `translate(${x}px, ${y}px)`;
        pill.style.width = `${w}px`;
        pill.style.height = `${h}px`;
        // Force reflow before restoring transition
        void pill.offsetWidth;
        pill.style.transition = prev;
      } else {
        pill.style.transform = `translate(${x}px, ${y}px)`;
        pill.style.width = `${w}px`;
        pill.style.height = `${h}px`;
      }
    };

    const activeTab = findActiveTab();
    if (isFirstPaintRef.current) {
      moveTo(activeTab, false);
      isFirstPaintRef.current = false;
    } else {
      moveTo(activeTab, true);
    }

    const handleResize = () => {
      moveTo(findActiveTab(), false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, activeKey]);
}

/**
 * 19-card-tilt:
 * Outer flat .t-tilt wrapper tracks pointer and updates --tilt-rx, --tilt-ry, --tilt-gx, --tilt-gy
 * on the inner .t-tilt-card with a cursor-tracked .t-tilt-glare overlay.
 */
export function TiltCard({
  children,
  className = '',
  innerClassName = '',
  maxTilt = 10,
  id,
  dataTestId,
}) {
  const tiltRef = useRef(null);
  const cardRef = useRef(null);

  const reset = () => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;
    tilt.classList.remove('is-hover');
    card.classList.remove('is-tilting');
    card.style.setProperty('--tilt-rx', '0deg');
    card.style.setProperty('--tilt-ry', '0deg');
  };

  const handlePointerMove = (e) => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const r = tilt.getBoundingClientRect();
    const width = r.width || 1;
    const height = r.height || 1;
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / height));

    tilt.classList.add('is-hover');
    card.classList.add('is-tilting');
    card.style.setProperty('--tilt-ry', `${((px - 0.5) * maxTilt).toFixed(2)}deg`);
    card.style.setProperty('--tilt-rx', `${((0.5 - py) * maxTilt).toFixed(2)}deg`);
  };

  const handlePointerDown = (e) => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    if (e.pointerType && e.pointerType !== 'mouse' && typeof tilt.setPointerCapture === 'function') {
      try {
        tilt.setPointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture errors
      }
    }
  };

  const handlePointerLeave = (e) => {
    if (!e.pointerType || e.pointerType === 'mouse') {
      reset();
    }
  };

  return (
    <div
      id={id}
      ref={tiltRef}
      data-testid={dataTestId}
      className={`t-tilt ${className}`.trim()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={reset}
      onPointerCancel={reset}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={cardRef} className={`t-tilt-card ${innerClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
}

/**
 * 02-number-pop-in:
 * Swaps changed digits on a 3D drum while keeping unchanged leading digits still.
 */
export function AnimatedNumber({ value, className = '' }) {
  const str = String(value);
  const prevStrRef = useRef(str);
  const [animState, setAnimState] = useState({
    prev: str,
    curr: str,
    key: 0,
    animating: false,
  });

  useEffect(() => {
    if (prevStrRef.current !== str) {
      const oldVal = prevStrRef.current;
      prevStrRef.current = str;
      setAnimState((prev) => ({
        prev: oldVal,
        curr: str,
        key: prev.key + 1,
        animating: true,
      }));
    }
  }, [str]);

  const { prev, curr, key, animating } = animState;
  let same = 0;
  while (same < prev.length && same < curr.length && prev[same] === curr[same]) {
    same += 1;
  }

  const chars = [...curr];

  return (
    <span
      key={key}
      className={`t-digit-group ${animating ? 'is-animating' : ''} ${className}`.trim()}
      aria-label={curr}
    >
      {chars.map((ch, i) => {
        const isSameOrNonDigit = !animating || i < same || !/\d/.test(ch);
        if (isSameOrNonDigit) {
          return (
            <span key={i} className="t-digit" data-same="">
              {ch}
            </span>
          );
        }

        const fromEnd = curr.length - 1 - i;
        const staggerAttr = fromEnd === 1 ? '1' : fromEnd === 0 ? '2' : undefined;
        const oldCh = prev[prev.length - (curr.length - i)];
        const hasOldDigit = oldCh && /\d/.test(oldCh);

        return (
          <span
            key={i}
            className="t-digit-slot"
            data-stagger={staggerAttr}
          >
            {hasOldDigit && (
              <span className="t-digit-old" aria-hidden="true">
                {oldCh}
              </span>
            )}
            <span className="t-digit">{ch}</span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * 24-learn-more-hover:
 * Two-arm chevron that slides right and spreads its arms into an arrow on hover.
 */
export function LearnMoreChevron() {
  return (
    <span className="t-learn-chevron" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
        <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
      </svg>
    </span>
  );
}

/**
 * Motion Lexicon: TextMorph
 * Smooth rotating pill that morphs between specialization phrases with directional blur & slide.
 */
export function TextMorph({
  phrases = [],
  label = 'Špecializácia',
  interval = 3800,
  initialIndex = 0,
  className = '',
  onChange,
}) {
  const rootRef = useRef(null);
  const visibleRef = useRef(true);
  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, phrases.length - 1))
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const triggerChange = (nextIndex) => {
    setIndex(nextIndex);
    onChange?.(phrases[nextIndex], nextIndex);
  };

  const next = () => {
    if (!phrases.length) return;
    triggerChange((index + 1) % phrases.length);
  };

  const prev = () => {
    if (!phrases.length) return;
    triggerChange((index - 1 + phrases.length) % phrases.length);
  };

  useEffect(() => {
    if (phrases.length < 2 || interval <= 0) return;
    const timer = window.setInterval(() => {
      if (!visibleRef.current) return;
      setIndex((curr) => {
        const nextIdx = (curr + 1) % phrases.length;
        onChange?.(phrases[nextIdx], nextIdx);
        return nextIdx;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, phrases, onChange]);

  const currentPhrase = phrases[index] ?? '';

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={label}
      className={`t-text-morph ${className}`.trim()}
    >
      <button
        type="button"
        onClick={prev}
        aria-label="Predchádzajúca špecializácia"
        className="t-morph-arrow-btn"
      >
        <ChevronLeft size={13} strokeWidth={2} aria-hidden="true" />
      </button>

      <div className="t-morph-viewport" aria-live="polite">
        <span key={index} className="t-morph-phrase is-entering">
          {currentPhrase}
        </span>
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Nasledujúca špecializácia"
        className="t-morph-arrow-btn"
      >
        <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
