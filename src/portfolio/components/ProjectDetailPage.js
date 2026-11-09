import React, { useEffect } from 'react';
import {
  ArrowLeft,
  GitBranch,
  Layers,
  Calendar,
  User,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PROJECT_THEMES = {
  'draven-sql-evaluation': {
    accent: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(14, 34, 53, 0.95) 0%, rgba(6, 17, 27, 0.98) 100%)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
  },
  'industrial-digital-twin': {
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(1, 63, 50, 0.95) 0%, rgba(0, 34, 27, 0.98) 100%)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
  },
  'mudblazor-oss': {
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(36, 20, 58, 0.95) 0%, rgba(18, 9, 32, 0.98) 100%)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
  },
  'stremio-streamcinema': {
    accent: '#f43f5e',
    gradient: 'linear-gradient(135deg, rgba(51, 16, 24, 0.95) 0%, rgba(23, 5, 9, 0.98) 100%)',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
  },
  'enterprise-planning-pwa': {
    accent: '#64748b',
    gradient: 'linear-gradient(135deg, rgba(24, 34, 48, 0.95) 0%, rgba(11, 17, 24, 0.98) 100%)',
    badgeBg: 'rgba(100, 116, 139, 0.15)',
  },
  'ticketlake-data-platform': {
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(45, 24, 8, 0.95) 0%, rgba(20, 9, 2, 0.98) 100%)',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
  },
  'predictive-maintenance-tpm': {
    accent: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(19, 36, 23, 0.95) 0%, rgba(8, 18, 11, 0.98) 100%)',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
  },
  'factory-energy-planner': {
    accent: '#eab308',
    gradient: 'linear-gradient(135deg, rgba(43, 31, 12, 0.95) 0%, rgba(20, 14, 4, 0.98) 100%)',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
  },
  'neighborhood-adventure-pwa': {
    accent: '#14b8a6',
    gradient: 'linear-gradient(135deg, rgba(14, 39, 44, 0.95) 0%, rgba(5, 20, 23, 0.98) 100%)',
    badgeBg: 'rgba(20, 184, 166, 0.15)',
  },
  'speech-analysis-tool': {
    accent: '#d946ef',
    gradient: 'linear-gradient(135deg, rgba(35, 18, 44, 0.95) 0%, rgba(16, 6, 21, 0.98) 100%)',
    badgeBg: 'rgba(217, 70, 239, 0.15)',
  },
};

export function ProjectDetailPage({ project, allProjects = [], onBack, onSelectProject }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [project.id]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const theme = PROJECT_THEMES[project.id] || {
    accent: '#e0683b',
    gradient: 'linear-gradient(135deg, rgba(26, 24, 21, 0.95) 0%, rgba(13, 12, 10, 0.98) 100%)',
    badgeBg: 'rgba(224, 104, 59, 0.15)',
  };

  return (
    <div className="project-detail-page" data-testid="project-detail-page">
      {/* TOP NAVIGATION BAR */}
      <header className="pdp-header">
        <div className="shell-container pdp-header-inner">
          <button
            type="button"
            className="pdp-back-btn"
            onClick={onBack}
            aria-label="Späť na vybrané práce"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Späť na vybrané práce</span>
          </button>

          <div className="pdp-header-meta">
            <span className="pdp-index-chip">{project.index}</span>
            <span className="pdp-header-title">{project.title.split('—')[0].trim()}</span>
          </div>

          <div className="pdp-header-actions">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary btn-compact"
                aria-label="Otvoriť GitHub repozitár"
              >
                <GitBranch size={14} />
                <span>GitHub</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* HERO BANNER WITH THEMATIC PALETTE */}
      <section
        className="pdp-hero"
        style={{
          background: theme.gradient,
        }}
      >
        <div className="shell-container pdp-hero-inner">
          <div className="pdp-hero-kicker-row">
            <span className="pdp-kicker">PRÍPADOVÁ ŠTÚDIA · PROJEKT {project.index}</span>
            <span className="pdp-cat-pill" style={{ backgroundColor: theme.badgeBg, color: theme.accent }}>
              {project.categoryLabel}
            </span>
          </div>

          <h1 className="pdp-title">{project.title}</h1>
          <p className="pdp-lead">{project.summary}</p>

          <div className="pdp-meta-grid">
            {project.role && (
              <div className="pdp-meta-card">
                <div className="pdp-meta-card-head">
                  <User size={14} strokeWidth={2} className="pdp-meta-icon" />
                  <span>Moja inžinierska rola</span>
                </div>
                <p className="pdp-meta-card-text">{project.role}</p>
              </div>
            )}

            <div className="pdp-meta-card">
              <div className="pdp-meta-card-head">
                <Calendar size={14} strokeWidth={2} className="pdp-meta-icon" />
                <span>Obdobie realizácie</span>
              </div>
              <p className="pdp-meta-card-text">{project.year}</p>
            </div>

            {project.metrics && (
              <div className="pdp-meta-card pdp-meta-card-highlight">
                <div className="pdp-meta-card-head">
                  <CheckCircle2 size={14} strokeWidth={2} className="pdp-meta-icon" style={{ color: theme.accent }} />
                  <span>{project.metrics.primaryLabel}</span>
                </div>
                <p className="pdp-metric-large" style={{ color: theme.accent }}>
                  {project.metrics.primaryValue}
                </p>
                {project.metrics.comparison && (
                  <span className="pdp-metric-sub">{project.metrics.comparison}</span>
                )}
              </div>
            )}
          </div>

          {project.repoUrl && (
            <div className="pdp-hero-cta-row">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <GitBranch size={16} />
                <span>Otvoriť repozitár a zdrojový kód</span>
                <ExternalLink size={14} />
              </a>
              <button type="button" className="btn-secondary" onClick={onBack}>
                Späť na prehľad portfólia
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="pdp-body">
        <div className="shell-container pdp-content-grid">
          {/* LEFT / PRIMARY COLUMN: ARCHITECTURE ARTIFACT & CODE SANDBOX */}
          <div className="pdp-main-col">
            {project.artifact && (
              <section className="pdp-section" aria-labelledby="artifact-heading">
                <div className="pdp-section-header">
                  <span className="pdp-section-kicker">01 / ARCHITEKTÚRA &amp; REÁLNY KÓD</span>
                  <h2 id="artifact-heading" className="pdp-section-title">
                    Architektonický artefakt a sandbox
                  </h2>
                </div>

                <div className="pdp-code-window">
                  <div className="pdp-code-bar">
                    <div className="sw__bar-dots" aria-hidden="true">
                      <i /><i /><i />
                    </div>
                    <span className="pdp-code-filename">{project.artifact.file}</span>
                    <span className="pdp-code-badge">{project.artifact.badge}</span>
                  </div>

                  <pre className="pdp-code-block">
                    <code>{project.artifact.code}</code>
                  </pre>

                  {project.artifact.tags && (
                    <div className="pdp-artifact-tags">
                      {project.artifact.tags.map((t) => (
                        <span key={t} className="pdp-artifact-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ENGINEERING HIGHLIGHTS & DEEP SOLUTIONS */}
            <section className="pdp-section" aria-labelledby="highlights-heading">
              <div className="pdp-section-header">
                <span className="pdp-section-kicker">02 / INŽINIERSKE RIEŠENIA</span>
                <h2 id="highlights-heading" className="pdp-section-title">
                  Konkrétne technické výzvy a riešenia
                </h2>
              </div>

              <div className="pdp-highlights-cards">
                {project.highlights.map((h, idx) => (
                  <article key={idx} className="pdp-solution-card">
                    <div className="pdp-solution-idx">0{idx + 1}</div>
                    <div className="pdp-solution-content">
                      <p className="pdp-solution-text">{h}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT / SIDEBAR COLUMN: TECH STACK & SPECS */}
          <aside className="pdp-side-col">
            <div className="pdp-sidebar-panel">
              <div className="pdp-side-header">
                <Layers size={16} strokeWidth={2} />
                <span>Použitý technologický stack</span>
              </div>

              <div className="pdp-stack-list">
                {project.stack.map((tech) => (
                  <span key={tech} className="tech-tag pdp-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pdp-side-divider" />

              <div className="pdp-side-meta-block">
                <span className="pdp-side-label">Kategória práce</span>
                <span className="pdp-side-val">{project.categoryLabel}</span>
              </div>

              <div className="pdp-side-meta-block">
                <span className="pdp-side-label">Rok vydania / nasadenia</span>
                <span className="pdp-side-val">{project.year}</span>
              </div>

              {project.repoUrl && (
                <div className="pdp-side-cta">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary btn-full-width"
                  >
                    <GitBranch size={15} />
                    <span>Pozrieť GitHub repozitár</span>
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* BOTTOM PAGINATION: PREVIOUS / NEXT PROJECT (Ksen Panchenko style) */}
        <section className="pdp-pagination shell-container">
          <div className="pdp-pagination-inner">
            {prevProject ? (
              <button
                type="button"
                className="pdp-nav-tile pdp-prev"
                onClick={() => onSelectProject(prevProject.id)}
              >
                <div className="pdp-nav-tile-icon">
                  <ChevronLeft size={20} strokeWidth={2} />
                </div>
                <div className="pdp-nav-tile-text">
                  <span className="pdp-nav-kicker">Predchádzajúci projekt · {prevProject.index}</span>
                  <span className="pdp-nav-title">{prevProject.title.split('—')[0].trim()}</span>
                </div>
              </button>
            ) : (
              <div className="pdp-nav-empty" />
            )}

            <button
              type="button"
              className="pdp-nav-all-btn btn-secondary"
              onClick={onBack}
            >
              Všetky vybrané práce
            </button>

            {nextProject ? (
              <button
                type="button"
                className="pdp-nav-tile pdp-next"
                onClick={() => onSelectProject(nextProject.id)}
              >
                <div className="pdp-nav-tile-text">
                  <span className="pdp-nav-kicker">Nasledujúci projekt · {nextProject.index}</span>
                  <span className="pdp-nav-title">{nextProject.title.split('—')[0].trim()}</span>
                </div>
                <div className="pdp-nav-tile-icon">
                  <ChevronRight size={20} strokeWidth={2} />
                </div>
              </button>
            ) : (
              <div className="pdp-nav-empty" />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
