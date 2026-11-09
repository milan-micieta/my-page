import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, Layers, Eye, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import { LearnMoreChevron, AnimatedNumber } from './MotionPrimitives';

const PROJECT_THEMES = {
  'draven-sql-evaluation': {
    bgDark: 'linear-gradient(135deg, #0b1a29 0%, #050d15 100%)',
    bgLight: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    accent: '#38bdf8',
  },
  'industrial-digital-twin': {
    bgDark: 'linear-gradient(135deg, #013f32 0%, #00221b 100%)', // Ksen Panchenko inspired Emerald
    bgLight: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    accent: '#10b981',
  },
  'mudblazor-oss': {
    bgDark: 'linear-gradient(135deg, #24143a 0%, #120920 100%)',
    bgLight: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accent: '#a855f7',
  },
  'stremio-streamcinema': {
    bgDark: 'linear-gradient(135deg, #331018 0%, #170509 100%)',
    bgLight: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    accent: '#f43f5e',
  },
  'enterprise-planning-pwa': {
    bgDark: 'linear-gradient(135deg, #182230 0%, #0b1118 100%)',
    bgLight: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    accent: '#64748b',
  },
  'ticketlake-data-platform': {
    bgDark: 'linear-gradient(135deg, #2d1808 0%, #140902 100%)',
    bgLight: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    accent: '#f97316',
  },
  'predictive-maintenance-tpm': {
    bgDark: 'linear-gradient(135deg, #132417 0%, #08120b 100%)',
    bgLight: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    accent: '#22c55e',
  },
  'factory-energy-planner': {
    bgDark: 'linear-gradient(135deg, #2b1f0c 0%, #140e04 100%)',
    bgLight: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    accent: '#eab308',
  },
  'neighborhood-adventure-pwa': {
    bgDark: 'linear-gradient(135deg, #0e272c 0%, #051417 100%)',
    bgLight: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    accent: '#14b8a6',
  },
  'speech-analysis-tool': {
    bgDark: 'linear-gradient(135deg, #23122c 0%, #100615 100%)',
    bgLight: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
    accent: '#d946ef',
  },
};

const PROJECT_EDITORIAL_BRIEFS = {
  'draven-sql-evaluation': {
    pitch: 'Automatizované vyhodnocovanie SQL dopytov s read-only sandboxom a DataGrip pluginom.',
    domain: 'EdTech & Výskum · 2026',
    tools: 'IntelliJ SDK · Spring Boot · PostgreSQL',
  },
  'industrial-digital-twin': {
    pitch: 'Izometrické 3D digitálne dvojča strojárskeho závodu so stavovou telemetriou v reálnom čase.',
    domain: 'Priemyselné 3D · 2026',
    tools: 'Three.js · WebGL · Orthographic Camera',
  },
  'rails-sails-graph': {
    pitch: 'Strategická dosková hra s multigrafovým modelom a heuristickou navigáciou v NetworkX.',
    domain: 'Graph ML & AI · 2025',
    tools: 'Python · NetworkX · Pygame Engine',
  },
  'neighborhood-adventure-pwa': {
    pitch: 'Geolokačná komunitná PWA pre objavovanie lokálnych aktivít so spatial dopytmi v PostGIS.',
    domain: 'Geolokačná PWA · 2026',
    tools: 'React · Leaflet · Supabase PostGIS',
  },
};

function getProjectBrief(p) {
  if (!p) return null;
  if (PROJECT_EDITORIAL_BRIEFS[p.id]) {
    return PROJECT_EDITORIAL_BRIEFS[p.id];
  }
  return {
    pitch: p.summary,
    domain: `${p.categoryLabel?.split('·')[0]?.trim() || 'Projekt'} · ${p.year || '2026'}`,
    tools: (p.stack || []).slice(0, 3).join(' · '),
  };
}

function getProjectBackdrop(projectId, surfaceTone) {
  const theme = PROJECT_THEMES[projectId];
  const accent = theme ? theme.accent : '#f97316';
  const isLight = surfaceTone === 'paper';
  if (isLight) {
    return `radial-gradient(ellipse 75% 65% at 50% 50%, ${accent}20 0%, #f7f6f4 100%)`;
  }
  return `radial-gradient(ellipse 75% 65% at 50% 50%, ${accent}28 0%, #0d0c0b 100%)`;
}

function computeCardDeckStates(p, totalCount) {
  if (p <= 0) return { k: 0, t: 0 };
  const maxIdx = totalCount - 1;
  if (p >= maxIdx) return { k: maxIdx, t: 0 };

  const k = Math.min(maxIdx - 1, Math.max(0, Math.floor(p)));
  const frac = p - k;

  // Plateau from 0.0 to 0.18: rest at project k
  // Plateau from 0.82 to 1.0: rest at project k + 1
  // Smooth continuous transition from 0.18 to 0.82
  let t = 0;
  if (frac <= 0.18) {
    t = 0;
  } else if (frac >= 0.82) {
    t = 1;
  } else {
    const rawT = (frac - 0.18) / 0.64;
    t = rawT * rawT * (3 - 2 * rawT);
  }

  if (t >= 0.999) {
    return { k: Math.min(maxIdx, k + 1), t: 0 };
  }

  return { k, t };
}

function ProjectCaseCard({ project, onSelectProject }) {
  return (
    <article
      className="project-case-card"
      data-testid={`project-card-${project.id}`}
    >
      <div className="project-card-split">
        <div className="project-left-col">
          <div className="project-meta-top">
            <div className="project-meta-left">
              <span className="project-index">{project.index}</span>
              <span className="project-category">{project.categoryLabel}</span>
            </div>
            <span className="project-year">{project.year}</span>
          </div>

          <h3
            className="project-title project-title-clickable"
            onClick={() => onSelectProject?.(project.id)}
          >
            {project.title}
          </h3>
          <p className="project-summary">{project.summary}</p>

          <div className="project-stack-row" aria-label="Použité technológie">
            {project.stack.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-bottom-row">
            {project.metrics && (
              <div className="metric-chip">
                <span className="metric-chip-label">{project.metrics.primaryLabel}:</span>
                <span className="metric-chip-value">{project.metrics.primaryValue}</span>
              </div>
            )}

            <div className="project-card-actions">
              <button
                type="button"
                className="btn-secondary btn-compact project-detail-trigger"
                onClick={() => onSelectProject?.(project.id)}
                aria-label={`Zobraziť stránku projektu ${project.title}`}
              >
                <Eye size={13} strokeWidth={2} />
                <span>Stránka projektu</span>
                <ArrowRight size={13} strokeWidth={2} />
              </button>

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-external-link t-learn"
                  aria-label={`${project.title} — Repozitár`}
                >
                  <GitBranch size={14} strokeWidth={1.5} />
                  <span>Repozitár</span>
                  <LearnMoreChevron />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="project-right-col">
          <div className="project-engineering-panel">
            <div className="engineering-panel-header">
              <div className="engineering-header-left">
                <Layers size={14} strokeWidth={2} className="engineering-header-icon" aria-hidden="true" />
                <span className="engineering-header-title">Čo som na projekte robil</span>
              </div>
              <span className="engineering-count-badge">
                {project.highlights.length} riešenia
              </span>
            </div>

            <ul className="engineering-highlights-list">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="engineering-highlight-item">
                  <span className="engineering-index">0{idx + 1}</span>
                  <p className="engineering-text">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection({
  projects = [],
  categories = [],
  surfaceTone,
  onInProjectsZoneChange,
  onSelectProject,
  onNavigateToWork,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef(null);
  const deskRef = useRef(null);
  const stickyRef = useRef(null);

  const lastInZoneRef = useRef(false);

  const revealed = useScrollReveal(sectionRef);

  const visibleProjects = projects;
  const { k, t } = computeCardDeckStates(scrollProgress, visibleProjects.length);
  const activeIndex = t >= 0.5 ? Math.min(visibleProjects.length - 1, k + 1) : k;
  const activeProject = visibleProjects[activeIndex] || visibleProjects[0];

  // Continuous physics-based scrollytelling: continuous scroll drives buttery fluid transitions
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateScrollState = () => {
      const section = sectionRef.current;
      const desk = deskRef.current;
      const sticky = stickyRef.current;
      if (!section || !desk || !sticky) return;

      const windowH = window.innerHeight;
      const sectionRect = section.getBoundingClientRect();

      // Dynamic theme/background morphing
      const inZone = sectionRect.top <= windowH * 0.55 && sectionRect.bottom >= windowH * 0.25;
      if (inZone !== lastInZoneRef.current) {
        lastInZoneRef.current = inZone;
        onInProjectsZoneChange?.(inZone);
      }

      if (window.innerWidth < 900 || visibleProjects.length <= 1) {
        return;
      }

      const deskRect = desk.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 72;
      const totalScrollable = desk.offsetHeight - sticky.offsetHeight;

      if (totalScrollable <= 0) return;

      // Exit runway: provides a 90vh resting plateau so the final project stays in full view before unpinning
      const exitBufferPx = windowH * 0.90;
      const transitionScrollable = Math.max(1, totalScrollable - exitBufferPx);

      const scrollOffset = stickyTop - deskRect.top;
      const transitionProgress = Math.min(1, Math.max(0, scrollOffset / transitionScrollable));
      const targetProgress = transitionProgress * (visibleProjects.length - 1);
      setScrollProgress(targetProgress);
    };

    updateScrollState();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      onInProjectsZoneChange?.(false);
    };
  }, [visibleProjects.length, onInProjectsZoneChange]);

  // Reset progress if projects change
  useEffect(() => {
    setScrollProgress(0);
  }, [projects]);

  const scrollToProjectIndex = (index) => {
    const targetIdx = Math.max(0, Math.min(visibleProjects.length - 1, index));
    const desk = deskRef.current;
    const sticky = stickyRef.current;
    if (!desk || !sticky) {
      setScrollProgress(targetIdx);
      return;
    }

    const totalScrollable = desk.offsetHeight - sticky.offsetHeight;
    if (totalScrollable <= 0) {
      setScrollProgress(targetIdx);
      return;
    }

    const stickyTop = parseFloat(getComputedStyle(sticky).top) || 72;
    const deskAbsoluteTop = desk.getBoundingClientRect().top + window.scrollY;

    const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const exitBufferPx = windowH * 0.90;
    const transitionScrollable = Math.max(1, totalScrollable - exitBufferPx);

    const targetRatio = visibleProjects.length > 1 ? targetIdx / (visibleProjects.length - 1) : 0;
    const targetScrollY = deskAbsoluteTop - stickyTop + targetRatio * transitionScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const scrollDeskHeight =
    visibleProjects.length > 1 && typeof window !== 'undefined' && window.innerWidth >= 900
      ? `calc(var(--stage-h) + ${(visibleProjects.length - 1) * 85 + 90}vh)`
      : 'auto';

  return (
    <section
      id="projekty"
      ref={sectionRef}
      className={`projects-section ${revealed ? 'is-revealed' : ''}`}
      aria-labelledby="projects-heading"
    >
      {/* SINGLE DOM TREE — KSEN PANCHENKO SCROLLYTELLING DESK */}
      <div
        ref={deskRef}
        className="sw__desk"
        style={{ height: scrollDeskHeight }}
      >
          <div ref={stickyRef} className="sw__sticky sw__layout">
            {/* LEFT COLUMN: Pinned Heading, Project Index, Dynamic Brief, Huge Animated Counter */}
            <div className="sw__left">
              {/* PINNED SECTION HEADING */}
              <div className="sw__heading-block">
                <span className="sw__kicker">02 / Vybrané práce</span>
                <h2 id="projects-heading" className="sw__title">
                  Selected work
                </h2>
                <span className="sw__subtitle">Inžinierske projekty &amp; systémová architektúra</span>
              </div>

              {/* ULTRA-MINIMAL SWISS PROJECT INDEX (Pure typography, no boxes, no left borders) */}
              <ol className="sw__index" role="tablist" aria-label="Zoznam projektov">
                {visibleProjects.map((p, idx) => {
                  const isActive = activeIndex === idx;
                  const itemLabel = p.shortTitle || p.title.split('—')[0].trim();
                  return (
                    <li
                      key={p.id}
                      role="tab"
                      tabIndex={0}
                      aria-selected={isActive}
                      className={`sw__index-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => scrollToProjectIndex(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          scrollToProjectIndex(idx);
                        }
                      }}
                    >
                      <span className="sw__num">{p.index || `0${idx + 1}`}</span>
                      <span className="sw__name">
                        {itemLabel}
                        {isActive && <span className="sw__active-dot-inline" aria-hidden="true" />}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* ACTIVE PROJECT EDITORIAL BRIEF (Ksenia Panchenko style: concise, perfectly aligned, uniform) */}
              {activeProject && (() => {
                const brief = getProjectBrief(activeProject);
                return (
                  <div className="sw__active-brief" key={activeProject.id}>
                    <p className="sw__brief-pitch">{brief.pitch}</p>
                    <div className="sw__brief-domain">{brief.domain}</div>
                    <div className="sw__brief-tools">
                      <span className="sw__brief-label">Tools</span>
                      {brief.tools}
                    </div>
                  </div>
                );
              })()}

              {/* MINIMAL FOOTER WITH HUGE KINETIC DIGIT & SEGMENTED TRACK (Arrows removed) */}
              <div className="sw__footer">
                <div
                  className="sw__big-counter"
                  aria-label={`Projekt ${activeIndex + 1} z ${visibleProjects.length}`}
                >
                  <div className="sw__huge-counter">
                    <AnimatedNumber
                      value={String(activeIndex + 1).padStart(2, '0')}
                      className="sw__huge-num"
                    />
                    <span className="sw__huge-total">
                      / {String(visibleProjects.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div
                  className="sw__segmented-track"
                  role="progressbar"
                  tabIndex={0}
                  aria-label="Rýchly presun medzi projektmi"
                  aria-valuenow={activeIndex + 1}
                  aria-valuemin={1}
                  aria-valuemax={visibleProjects.length}
                >
                  {visibleProjects.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`sw__segment ${idx === activeIndex ? 'is-active' : ''} ${idx < activeIndex ? 'is-completed' : ''}`}
                      onClick={() => scrollToProjectIndex(idx)}
                      aria-label={`Prejsť na projekt 0${idx + 1}`}
                    >
                      <span className="sw__segment-fill" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stage Showcase with Apple-grade Smooth Depth Crossfade */}
            <div
              className="sw__stage"
              style={{
                background: getProjectBackdrop(activeProject?.id, surfaceTone),
              }}
            >
              {visibleProjects.map((p, idx) => {
                let reelStyle = {};
                let isCardActive = false;

                if (idx === k) {
                  // Current active card or receding into depth
                  isCardActive = t < 0.5;
                  const recedingScale = 1 - 0.05 * t;
                  const recedingOpacity = Math.max(0, 1 - t * 1.4);
                  const recedingBlur = t * 6;
                  const recedingShiftY = -t * 14;

                  reelStyle = {
                    transform: `translate3d(0, ${recedingShiftY}px, 0) scale(${recedingScale})`,
                    filter: `blur(${recedingBlur}px) brightness(${1 - 0.25 * t})`,
                    opacity: recedingOpacity,
                    zIndex: 10,
                    pointerEvents: t < 0.5 ? 'auto' : 'none',
                  };
                } else if (idx === k + 1) {
                  // Incoming card rising smoothly from subtle depth
                  isCardActive = t >= 0.5;
                  const risingY = (1 - t) * 22;
                  const risingScale = 0.96 + 0.04 * t;
                  const risingOpacity = Math.min(1, Math.max(0, t * 1.5));
                  const risingBlur = (1 - t) * 6;

                  reelStyle = {
                    transform: `translate3d(0, ${risingY}px, 0) scale(${risingScale})`,
                    filter: `blur(${risingBlur}px) brightness(${0.75 + 0.25 * t})`,
                    opacity: risingOpacity,
                    zIndex: 20,
                    pointerEvents: t >= 0.5 ? 'auto' : 'none',
                  };
                } else if (idx > k + 1) {
                  // Future cards quiet in depth
                  reelStyle = {
                    transform: 'translate3d(0, 24px, 0) scale(0.94)',
                    filter: 'blur(8px)',
                    opacity: 0,
                    zIndex: 5,
                    pointerEvents: 'none',
                  };
                } else {
                  // Past cards receded
                  reelStyle = {
                    transform: 'translate3d(0, -18px, 0) scale(0.94)',
                    filter: 'blur(8px)',
                    opacity: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                  };
                }

                return (
                  <div
                    key={p.id}
                    className={`sw__reel ${isCardActive ? 'is-active' : ''}`}
                    style={reelStyle}
                  >
                    <div className="sw__win">
                      <div className="sw__bar">
                        <span className="sw__bar-dots" aria-hidden="true">
                          <i /><i /><i />
                        </span>
                        <span className="sw__bar-title">
                          {p.title.split('—')[0].trim()} — Case Study
                        </span>
                        <button
                          type="button"
                          className="sw__bar-action-btn"
                          onClick={() => onSelectProject?.(p.id)}
                          aria-label={`Otvoriť stránku projektu ${p.title}`}
                        >
                          <Eye size={12} />
                          <span>Stránka projektu →</span>
                        </button>
                      </div>

                      <div className="sw__screen">
                        <ProjectCaseCard
                          project={p}
                          onSelectProject={onSelectProject}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </section>
  );
}
