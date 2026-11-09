import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Sun,
  Moon,
  Monitor,
  Code2,
  Box,
  GitPullRequest,
  Zap,
  Cpu,
  Database,
  GitBranch,
  Activity,
  Server,
  MapPin,
} from 'lucide-react';
import { filterProjects } from '../utils/craftMath';
import { useSlidingTabsPill } from './MotionPrimitives';
import avatarImg from '../../assets/avatar.jpg';

const PROJECT_MEDIA_CONFIG = {
  'draven-sql-evaluation': {
    accent: '#38bdf8',
    bg: 'linear-gradient(135deg, #0b1a29 0%, #050d15 100%)',
    icon: Code2,
    badge: 'JetBrains DataGrip + Spring Boot',
    previewLine1: 'SELECT student_id, task_id, execution_time_ms',
    previewLine2: 'FROM evaluate_submission(attempt_no => 1);',
    metricLabel: 'Overenie v praxi',
    metricVal: 'SUS 84.5 / 100',
  },
  'industrial-digital-twin': {
    accent: '#10b981',
    bg: 'linear-gradient(135deg, #013f32 0%, #00221b 100%)',
    icon: Box,
    badge: 'Three.js · Orthographic WebGL',
    previewLine1: 'const hall = new THREE.ExtrudeGeometry(hall2DPolygon);',
    previewLine2: 'label = new CSS2DObject(createMachineTag("CNC-04"));',
    metricLabel: 'Modelovaný pôdorys',
    metricVal: '3422 × 1382 px',
  },
  'mudblazor-oss': {
    accent: '#a855f7',
    bg: 'linear-gradient(135deg, #24143a 0%, #120920 100%)',
    icon: GitPullRequest,
    badge: 'github.com/MudBlazor/MudBlazor · Merged',
    previewLine1: 'var zoom = await _jsRuntime.InvokeAsync<double>("mudWindow.getZoom");',
    previewLine2: 'var left = (clientRect.Left / zoom) + windowScrollX;',
    metricLabel: 'Začlenené PRs',
    metricVal: 'PR #14074 & #13946',
  },
  'stremio-streamcinema': {
    accent: '#f43f5e',
    bg: 'linear-gradient(135deg, #331018 0%, #170509 100%)',
    icon: Zap,
    badge: 'Vercel Serverless · HTTP 302 Edge',
    previewLine1: 'const stream = await resolveBestCdnStream(req.query.imdbId);',
    previewLine2: 'return res.redirect(302, stream.directCdnUrl);',
    metricLabel: 'Režim prevádzky',
    metricVal: '< 15 ms · Stateless',
  },
  'enterprise-planning-pwa': {
    accent: '#64748b',
    bg: 'linear-gradient(135deg, #182230 0%, #0b1118 100%)',
    icon: Cpu,
    badge: 'ASP.NET Core & Blazor · PWA',
    previewLine1: 'if (!networkService.IsOnline) {',
    previewLine2: '  await localIndexedDb.EnqueueDowntimeEventAsync(report);',
    metricLabel: 'Architektúra synchronizácie',
    metricVal: 'Offline-First PWA',
  },
  'ticketlake-data-platform': {
    accent: '#f97316',
    bg: 'linear-gradient(135deg, #2d1808 0%, #140902 100%)',
    icon: Database,
    badge: 'Apache Kafka · MQTT/TLS · RabbitMQ',
    previewLine1: 'for flight in scrape_flight_matrix(["VIE", "BUD", "BTS", "KSC"]):',
    previewLine2: '  kafka_producer.send("flights.price.updates", key=flight.route);',
    metricLabel: 'Streaming pipeline',
    metricVal: 'Kafka · MQTT · RabbitMQ',
  },
  'rails-sails-ml-generator': {
    accent: '#818cf8',
    bg: 'linear-gradient(135deg, #181b36 0%, #0c0d1c 100%)',
    icon: GitBranch,
    badge: 'NetworkX & Graph ML · Python',
    previewLine1: 'features = extract_graph_features(G, node_u, node_v)',
    previewLine2: 'score = gradient_boosting_model.predict(features)',
    metricLabel: 'Modelovanie a validácia',
    metricVal: '7 Regresorov · K-Fold',
  },
  'tpm-maintenance-telemetry': {
    accent: '#22c55e',
    bg: 'linear-gradient(135deg, #132417 0%, #08120b 100%)',
    icon: Activity,
    badge: 'TimescaleDB · Continuous Aggregates',
    previewLine1: 'SELECT time_bucket("15m", reading_time) AS bucket,',
    previewLine2: '       calculate_oee(avail, perf, qual) AS oee_index',
    metricLabel: 'Dostupnosť & OEE',
    metricVal: 'OEE 88.4 % · MTBF 142 h',
  },
  'production-energy-planning': {
    accent: '#eab308',
    bg: 'linear-gradient(135deg, #2b1f0c 0%, #140e04 100%)',
    icon: Server,
    badge: 'MS Data API Builder · MS SQL',
    previewLine1: 'query GetProductionPlan($lineId: Int!, $shift: String!) {',
    previewLine2: '  productionPlans(filter: { lineId: { eq: $lineId } }) { ... }',
    metricLabel: 'Rozhranie & Bezpečnosť',
    metricVal: 'MS DAB + RS256 JWT',
  },
  'neighborhood-adventure-finder': {
    accent: '#14b8a6',
    bg: 'linear-gradient(135deg, #0e272c 0%, #051417 100%)',
    icon: MapPin,
    badge: 'PostGIS ST_DWithin · Leaflet OSM',
    previewLine1: 'SELECT id, title, category, location_geom',
    previewLine2: 'FROM adventures WHERE ST_DWithin(location_geom, point, 5000);',
    metricLabel: 'Geopriestorový rádius',
    metricVal: 'PostGIS ST_DWithin · 5 km',
  },
};

export function WorkPage({
  allProjects = [],
  categories = [],
  onBack,
  onSelectProject,
  surfaceTone,
  themeMode,
  onToggleSurfaceTone,
  onSelectThemeMode,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const tabsRef = useRef(null);
  const switcherRef = useRef(null);

  useSlidingTabsPill(tabsRef, selectedCategory);
  useSlidingTabsPill(switcherRef, themeMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const visibleProjects = filterProjects(allProjects, selectedCategory, searchQuery);
  const isDark = surfaceTone === 'atelier';

  return (
    <div className={`work-page-shell theme-${surfaceTone}`} data-testid="work-page">
      {/* MINIMAL TOP NAV */}
      <header className="work-header">
        <div className="shell-container work-header-inner">
          <button
            type="button"
            className="pdp-back-btn"
            onClick={onBack}
            aria-label="Späť na prehľad"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Späť na prehľad</span>
          </button>

          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onBack?.();
            }}
            className="brand-wordmark"
            aria-label="Milan Mičieta — Späť na úvod"
          >
            <img src={avatarImg} alt="Milan Mičieta" className="brand-avatar-img" />
            <span className="brand-name">Milan Mičieta</span>
            <span className="brand-meta">Moja práca</span>
          </a>

          {/* THEME SWITCHER */}
          <div
            ref={switcherRef}
            className="theme-pill-switcher t-tabs"
            role="group"
            aria-label="Výber farebného režimu"
          >
            <span className="t-tabs-pill" aria-hidden="true" />

            <button
              type="button"
              onClick={() =>
                onSelectThemeMode
                  ? onSelectThemeMode('paper')
                  : isDark && onToggleSurfaceTone?.()
              }
              aria-pressed={themeMode === 'paper'}
              className={`theme-pill-btn t-tab ${themeMode === 'paper' ? 'is-active' : ''}`}
              aria-label={isDark ? 'Prepnúť na svetlý papierový režim' : 'Svetlý režim'}
              title="Svetlý režim"
            >
              <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectThemeMode
                  ? onSelectThemeMode('atelier')
                  : !isDark && onToggleSurfaceTone?.()
              }
              aria-pressed={themeMode === 'atelier'}
              className={`theme-pill-btn t-tab ${themeMode === 'atelier' ? 'is-active' : ''}`}
              aria-label={!isDark ? 'Prepnúť na tmavý ateliérový režim' : 'Tmavý režim'}
              title="Tmavý režim"
            >
              <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onSelectThemeMode && onSelectThemeMode('auto')}
              aria-pressed={themeMode === 'auto'}
              className={`theme-pill-btn t-tab ${themeMode === 'auto' ? 'is-active' : ''}`}
              aria-label="Podľa nastavenia počítača (Systém)"
              title="Podľa nastavenia počítača (Systém)"
            >
              <Monitor size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* KSEN PANCHENKO SIGNATURE HERO */}
      <section className="work__head-section">
        <div className="shell-container">
          <div className="work__head">
            <h1 className="work__title">Moja práca</h1>
            <p className="work__intro">
              Kompletný zoznam inžinierskych systémov, priemyselných 3D platforiem, akademického
              výskumu na FEI TUKE a open-source softvéru — architektúra, backend, dátové toky a používateľské rozhrania.
            </p>
            <span className="work__count-tag">
              {String(visibleProjects.length).padStart(2, '0')} projektov
            </span>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div className="projects-toolbar work-toolbar">
            <div
              ref={tabsRef}
              className="category-tabs t-tabs"
              role="tablist"
              aria-label="Kategórie projektov"
            >
              <span className="t-tabs-pill" aria-hidden="true" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-tab t-tab ${selectedCategory === cat.id ? 'is-active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="search-box">
              <Search size={16} strokeWidth={1.5} className="search-icon" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hľadať projekt alebo technológiu..."
                aria-label="Hľadať projekt alebo technológiu"
                spellCheck={false}
                autoComplete="off"
                className="search-input"
              />
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`search-clear-btn ${searchQuery ? 'is-visible' : ''}`}
                aria-label="Vymazať vyhľadávanie"
                tabIndex={searchQuery ? 0 : -1}
              >
                <X size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KSEN PANCHENKO 12-COLUMN EDITORIAL WORK ROWS */}
      <main className="work__list-section">
        <div className="shell-container">
          {visibleProjects.length === 0 ? (
            <div className="empty-projects-state" role="status">
              <p>Pre zadaný filter sa nenašiel žiadny projekt.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="btn-secondary btn-compact"
              >
                Zobraziť všetky projekty
              </button>
            </div>
          ) : (
            <ol className="work__list">
              {visibleProjects.map((project) => {
                const conf = PROJECT_MEDIA_CONFIG[project.id] || {
                  accent: '#e0683b',
                  bg: 'linear-gradient(135deg, #1c1a17 0%, #100f0d 100%)',
                  icon: Code2,
                  badge: project.categoryLabel,
                  previewLine1: project.summary,
                  previewLine2: project.stack.join(' · '),
                  metricLabel: project.metrics?.primaryLabel || 'Status',
                  metricVal: project.metrics?.primaryValue || 'Aktívny',
                };
                const IconComponent = conf.icon;

                return (
                  <li
                    key={project.id}
                    className="wrow"
                    data-testid={`work-card-${project.id}`}
                  >
                    {/* LEFT 3 COLUMNS: META, TITLE, FACTS, VIEW CASE LINK */}
                    <div className="wrow__side">
                      <span className="wrow__num">{project.index}</span>

                      <h2 className="wrow__title">
                        <a
                          href={`#/project/${project.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectProject?.(project.id);
                          }}
                        >
                          {project.shortTitle || project.title}
                        </a>
                      </h2>

                      <dl className="wrow__facts">
                        <div>
                          <dt className="wrow__fact-tag">Rola</dt>
                          <dd className="wrow__fact-val">
                            {project.role || 'Full-Stack Software Engineer'}
                          </dd>
                        </div>
                        <div>
                          <dt className="wrow__fact-tag">Rok</dt>
                          <dd className="wrow__fact-val">{project.year}</dd>
                        </div>
                        <div>
                          <dt className="wrow__fact-tag">Technológie</dt>
                          <dd className="wrow__fact-val">
                            {project.stack.slice(0, 4).join(' · ')}
                          </dd>
                        </div>
                      </dl>

                      <a
                        className="wrow__view"
                        href={`#/project/${project.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProject?.(project.id);
                        }}
                        aria-label={`Zobraziť prípadovú štúdiu ${project.title}`}
                      >
                        <span>Prípadová štúdia</span>
                        <span className="wrow__arrow" aria-hidden="true">↗</span>
                      </a>
                    </div>

                    {/* RIGHT 9 COLUMNS: MEDIA GRID (HERO PREVIEW + SUB-CARD) & TAGLINE */}
                    <div className="wrow__main">
                      <a
                        className="wrow__media"
                        tabIndex={-1}
                        aria-hidden="true"
                        href={`#/project/${project.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProject?.(project.id);
                        }}
                      >
                        {/* 6-COLUMN HERO VISUAL CARD */}
                        <div
                          className="wrow__img wrow__img--6"
                          style={{ background: conf.bg }}
                        >
                          <div className="wrow__preview-window">
                            <div className="wrow__preview-topbar">
                              <span className="sw__bar-dots" aria-hidden="true">
                                <i /><i /><i />
                              </span>
                              <span className="wrow__preview-badge" style={{ color: conf.accent }}>
                                <IconComponent size={12} strokeWidth={2} />
                                <span>{conf.badge}</span>
                              </span>
                            </div>

                            <div className="wrow__preview-body">
                              <h3 className="wrow__preview-title">{project.title}</h3>
                              <pre className="wrow__preview-code">
                                <code>{conf.previewLine1}{'\n'}{conf.previewLine2}</code>
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* 3-COLUMN COMPANION CARD */}
                        <div
                          className="wrow__img wrow__img--3"
                          style={{
                            background: conf.bg,
                            borderLeft: `2px solid ${conf.accent}`,
                          }}
                        >
                          <div className="wrow__companion-inner">
                            <span className="wrow__companion-label">{conf.metricLabel}</span>
                            <span className="wrow__companion-value" style={{ color: conf.accent }}>
                              {conf.metricVal}
                            </span>
                            <div className="wrow__companion-tags">
                              {project.stack.slice(0, 3).map((tech) => (
                                <span key={tech} className="tech-tag">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </a>

                      <p className="wrow__tagline">{project.summary}</p>
                    </div>

                    {/* MOBILE CARD (Visible on screens < 860px) */}
                    <a
                      className="wcard"
                      href={`#/project/${project.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject?.(project.id);
                      }}
                    >
                      <div className="wcard__head">
                        <span className="wcard__title">{project.title.split('—')[0].trim()}</span>
                        <span className="wrow__num">{project.index}</span>
                      </div>
                      <p className="wcard__desc">{project.summary}</p>
                      <div className="wcard__facts">
                        <span>
                          <span className="wrow__fact-tag">Rola:</span>
                          <span className="wrow__fact-val">{project.role}</span>
                        </span>
                        <span>
                          <span className="wrow__fact-tag">Rok:</span>
                          <span className="wrow__fact-val">{project.year}</span>
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
