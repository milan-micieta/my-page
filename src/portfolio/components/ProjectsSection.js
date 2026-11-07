import React, { useState, useRef } from 'react';
import { Search, ArrowUpRight, GitBranch, Layers } from 'lucide-react';
import { filterProjects } from '../utils/craftMath';
import { useScrollReveal } from '../utils/useScrollReveal';

function ProjectCaseCard({ project, indexOrder = 0 }) {
  const cardRef = useRef(null);
  const cardRevealed = useScrollReveal(cardRef, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  return (
    <article
      ref={cardRef}
      className={`project-case-card scroll-reveal-item ${cardRevealed ? 'is-visible' : ''}`}
      style={{ '--reveal-delay': `${Math.min(indexOrder * 55, 220)}ms` }}
      data-testid={`project-card-${project.id}`}
    >
      <div className="project-card-split">
        {/* ĽAVÁ STRANA: Informácie, sumár, stack a dole metrika s odkazom na repozitár */}
        <div className="project-left-col">
          <div className="project-meta-top">
            <div className="project-meta-left">
              <span className="project-index">{project.index}</span>
              <span className="project-category">{project.categoryLabel}</span>
            </div>
            <span className="project-year">{project.year}</span>
          </div>

          <h3 className="project-title">{project.title}</h3>
          <p className="project-summary">{project.summary}</p>

          <div className="project-stack-row" aria-label="Použité technológie">
            {project.stack.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          {/* Spodný riadok: Metriky a odkaz na GitHub dole */}
          <div className="project-bottom-row">
            {project.metrics && (
              <div className="metric-chip">
                <span className="metric-chip-label">{project.metrics.primaryLabel}:</span>
                <span className="metric-chip-value">{project.metrics.primaryValue}</span>
              </div>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="project-external-link"
                aria-label={`${project.title} — Repozitár`}
              >
                <GitBranch size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>GitHub / Repozitár</span>
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* PRAVÁ STRANA: Konkrétna inžinierska realizácia & architektonická špecifikácia */}
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

export function ProjectsSection({ projects, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sectionRef = useRef(null);
  const revealed = useScrollReveal(sectionRef);

  const visibleProjects = filterProjects(projects, selectedCategory, searchQuery);

  return (
    <section
      id="projekty"
      ref={sectionRef}
      className={`projects-section ${revealed ? 'is-revealed' : ''}`}
      aria-labelledby="projects-heading"
    >
      <div className="shell-container">
        <div className="section-header-split stagger-item stagger-1">
          <div>
            <span className="section-kicker">02 / VYBRANÉ PRÁCE &amp; PROJEKTY</span>
            <h2 id="projects-heading" className="section-title">
              Projekty a konkrétna inžinierska práca
            </h2>
          </div>
          <p className="section-lead">
            Prehľad {projects.length} projektov z akademického výskumu na FEI TUKE, open-source repozitárov a komerčnej praxe.
          </p>
        </div>

        <div className="projects-toolbar stagger-item stagger-2">
          <div className="category-tabs" role="tablist" aria-label="Kategórie projektov">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-tab ${selectedCategory === cat.id ? 'is-active' : ''}`}
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
              placeholder="Hľadať projekt alebo technológiu"
              aria-label="Hľadať projekt alebo technológiu"
              className="search-input"
            />
          </div>
        </div>

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
          <div className="projects-list stagger-item stagger-3">
            {visibleProjects.map((project, idx) => (
              <ProjectCaseCard key={project.id} project={project} indexOrder={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
