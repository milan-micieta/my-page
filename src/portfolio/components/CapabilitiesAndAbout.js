import React, { useRef } from 'react';
import { Mail, ArrowUpRight, Code2, Cpu, Compass, GraduationCap, Briefcase } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import { ContributionGraph } from './ContributionGraph';

function TrajectoryColumn({ kicker, title, icon: Icon, items = [], delay = 0 }) {
  const colRef = useRef(null);
  const colRevealed = useScrollReveal(colRef, {
    threshold: 0.1,
    rootMargin: '0px 0px -28px 0px',
  });

  return (
    <div
      ref={colRef}
      style={{ '--reveal-delay': `${delay}ms` }}
      className={`trajectory-column-card scroll-reveal-item ${colRevealed ? 'is-visible' : ''}`}
    >
      <div className="trajectory-column-header">
        <span className="trajectory-column-kicker">{kicker}</span>
        <div className="trajectory-column-title-row">
          <Icon size={18} strokeWidth={1.75} className="trajectory-column-icon" aria-hidden="true" />
          <h3 className="trajectory-column-title">{title}</h3>
        </div>
      </div>

      <div className="trajectory-line-track">
        {items.map((item) => (
          <div key={item.id} className="trajectory-line-item">
            <span className="trajectory-node-dot" aria-hidden="true" />
            <div className="trajectory-node-content">
              <strong className="trajectory-node-title">{item.title}</strong>
              {item.lines &&
                item.lines.map((line, idx) => (
                  <span key={idx} className="trajectory-node-line">
                    {line}
                  </span>
                ))}
              <span className="trajectory-node-year">{item.period}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CapabilitiesAndAbout({ skillMatrix, cvTrajectory = {}, identity }) {
  const sectionRef = useRef(null);
  const revealed = useScrollReveal(sectionRef);
  const trajectoryRef = useRef(null);
  const trajectoryRevealed = useScrollReveal(trajectoryRef);
  const footerRef = useRef(null);
  const footerRevealed = useScrollReveal(footerRef, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });

  const educationItems = cvTrajectory.education || [];
  const experienceItems = cvTrajectory.experience || [];

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
                    {cat.skills.map((s) => {
                      const isObj = typeof s === 'object' && s !== null;
                      const skillName = isObj ? s.name : s;
                      const skillTag = isObj ? s.tag : null;
                      const skillLevel = isObj && typeof s.level === 'number' ? s.level : 85;
                      return (
                        <div
                          key={skillName}
                          className="skill-chip-item has-meter"
                          title={`${skillName} · ${skillLevel}% úroveň & overená prax`}
                        >
                          <div className="skill-chip-top">
                            <span className="skill-chip-name">{skillName}</span>
                            {skillTag && <span className="skill-chip-tag">{skillTag}</span>}
                          </div>
                          <div className="skill-chip-meter" aria-hidden="true">
                            <div
                              className="skill-chip-meter-bar"
                              style={{ width: `${skillLevel}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
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
              Chronologická os môjho štúdia, certifikátov, akademického výskumu na FEI TUKE a priemyselnej praxe.
            </p>
          </div>

          <div className="trajectory-columns-grid">
            <TrajectoryColumn
              kicker="Akademická dráha & Certifikácie"
              title="Vzdelanie a štúdium"
              icon={GraduationCap}
              items={educationItems}
              delay={0}
            />
            <TrajectoryColumn
              kicker="Priemysel, Výskum & Open-Source"
              title="Pôsobenie a inžinierska prax"
              icon={Briefcase}
              items={experienceItems}
              delay={90}
            />
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
