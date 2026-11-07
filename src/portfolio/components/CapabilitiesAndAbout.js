import React, { useRef } from 'react';
import { Mail, ArrowUpRight, Code2, Cpu, Compass, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import { ContributionGraph } from './ContributionGraph';

function CvMilestoneCard({ item, index }) {
  const cardRef = useRef(null);
  const cardRevealed = useScrollReveal(cardRef, {
    threshold: 0.12,
    rootMargin: '0px 0px -32px 0px',
  });

  return (
    <article
      ref={cardRef}
      style={{ '--reveal-delay': `${Math.min(index * 70, 280)}ms` }}
      className={`cv-milestone-card scroll-reveal-item ${cardRevealed ? 'is-visible' : ''}`}
    >
      <div className="cv-milestone-aside">
        <span className="cv-period-pill">{item.period}</span>
        <span className="cv-type-badge">{item.type}</span>
      </div>

      <div className="cv-milestone-main">
        <div className="cv-milestone-header">
          <h3 className="cv-milestone-title">{item.title}</h3>
          <span className="cv-milestone-institution">{item.institution}</span>
        </div>

        <p className="cv-milestone-summary">{item.summary}</p>

        {item.highlights && item.highlights.length > 0 && (
          <ul className="cv-highlights-list">
            {item.highlights.map((point, idx) => (
              <li key={idx} className="cv-highlight-item">
                <CheckCircle2
                  size={14}
                  strokeWidth={1.75}
                  className="cv-highlight-icon"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="cv-tags-row">
            {item.tags.map((tag) => (
              <span key={tag} className="cv-tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function CapabilitiesAndAbout({ skillMatrix, cvTrajectory = [], identity }) {
  const sectionRef = useRef(null);
  const revealed = useScrollReveal(sectionRef);
  const trajectoryRef = useRef(null);
  const trajectoryRevealed = useScrollReveal(trajectoryRef);
  const footerRef = useRef(null);
  const footerRevealed = useScrollReveal(footerRef, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });

  return (
    <>
      <section
        id="schopnosti"
        ref={sectionRef}
        className={`capabilities-section ${revealed ? 'is-revealed' : ''}`}
        aria-labelledby="capabilities-heading"
      >
        <div className="shell-container">
          <div className="section-header-split stagger-item stagger-1">
            <div>
              <span className="section-kicker">03 / TECHNOLÓGIE &amp; AKTIVITA</span>
              <h2 id="capabilities-heading" className="section-title">
                Technologický stack a overená prax
              </h2>
            </div>
            <p className="section-lead">
              Prehľad domén, v ktorých navrhujem produkčné riešenia — od systémového backendu po 3D WebGL grafiku.
            </p>
          </div>

          <div className="capabilities-grid stagger-item stagger-2">
            <div className="skill-matrix-column">
              {skillMatrix.map((cat) => (
                <div key={cat.category} className="skill-card-craft">
                  <div className="skill-card-header">
                    <Cpu size={16} strokeWidth={1.5} className="row-icon" aria-hidden="true" />
                    <h3 className="skill-category-title">{cat.category}</h3>
                  </div>
                  <div className="skill-items-list">
                    {cat.skills.map((s) => (
                      <span key={s} className="skill-chip-item">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ContributionGraph />
        </div>
      </section>

      <section
        id="skusenosti"
        ref={trajectoryRef}
        className={`cv-trajectory-section ${trajectoryRevealed ? 'is-revealed' : ''}`}
        aria-labelledby="trajectory-heading"
      >
        <div className="shell-container">
          <div className="section-header-split stagger-item stagger-1">
            <div>
              <span className="section-kicker">04 / ŽIVOTOPIS, VZDELANIE &amp; PRAX</span>
              <h2 id="trajectory-heading" className="section-title">
                Trajektória a pôsobenie
              </h2>
            </div>
            <p className="section-lead">
              Kompletný chronologický prehľad môjho vzdelania od gymnázia Šrobárka v Košiciach cez štúdium a výskum na FEI TUKE až po priemyselný vývoj a open-source.
            </p>
          </div>

          <div className="cv-timeline-list">
            {cvTrajectory.map((item, idx) => (
              <CvMilestoneCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <footer
        id="kontakt"
        ref={footerRef}
        className={`site-footer ${footerRevealed ? 'is-revealed' : ''}`}
        aria-labelledby="footer-heading"
      >
        <div className="shell-container">
          <div className="footer-card stagger-item stagger-1">
            <div className="footer-main-row">
              <div>
                <span className="section-kicker">05 / KONTAKT &amp; SPOLUPRÁCA</span>
                <h2 id="footer-heading" className="footer-title">
                  Otvorený pre technické výzvy a architektúru
                </h2>
              </div>
              <div className="footer-ctas">
                <a href={`mailto:${identity.email}`} className="btn-primary">
                  <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                  <span>{identity.email}</span>
                </a>
                <a
                  href={identity.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <Code2 size={16} strokeWidth={1.5} aria-hidden="true" />
                  <span>GitHub ({identity.handle})</span>
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="footer-bottom-row">
              <span>{identity.name} · {identity.location}</span>
              <span className="footer-trajectory-tag">
                <Compass size={13} strokeWidth={1.5} aria-hidden="true" />
                <span>Košice · Šrobárka → FEI TUKE → Enterprise &amp; OSS</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
