import React, { useRef } from 'react';
import { Mail, ArrowUpRight, Code2, Layers, Cpu } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import { ContributionGraph } from './ContributionGraph';

export function CapabilitiesAndAbout({ skillMatrix, timeline, identity }) {
  const sectionRef = useRef(null);
  const revealed = useScrollReveal(sectionRef);
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
              <span className="section-kicker">03 / TECHNOLÓGIE &amp; SKÚSENOSTI</span>
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

            <div id="skusenosti" className="timeline-card-craft">
              <div className="skill-card-header">
                <Layers size={16} strokeWidth={1.5} className="row-icon" aria-hidden="true" />
                <h3 className="skill-category-title">Trajektória a pôsobenie</h3>
              </div>
              <div className="timeline-items">
                {timeline.map((item) => (
                  <div key={item.period} className="timeline-item">
                    <div className="timeline-item-header">
                      <span className="timeline-year">{item.period}</span>
                      <span className="timeline-badge">{item.badge}</span>
                    </div>
                    <strong className="timeline-role">{item.role}</strong>
                    <span className="timeline-org">{item.org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ContributionGraph />
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
                <span className="section-kicker">04 / KONTAKT &amp; SPOLUPRÁCA</span>
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
              <span>Instrument Sans · Newsreader · JetBrains Mono</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
