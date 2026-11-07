import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { HeroAntigravityCanvas } from './HeroAntigravityCanvas';

export function HeroSection({ identity, timeline = [] }) {
  const mousePosRef = React.useRef({ x: -9999, y: -9999, active: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -9999, y: -9999, active: false };
  };

  return (
    <section
      id="top"
      className="hero-section"
      aria-labelledby="hero-heading"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Google Antigravity-style floating physics background */}
      <HeroAntigravityCanvas mousePosRef={mousePosRef} />

      <div className="shell-container hero-split">
        <div className="hero-copy-col is-revealed">
          <div className="hero-context-row stagger-item stagger-1">
            <span className="status-dot" aria-hidden="true" />
            <span className="context-meta">{identity.location}</span>
            <span className="context-divider" aria-hidden="true">
              /
            </span>
            <span className="context-mono">{identity.handle}</span>
          </div>

          <h1 id="hero-heading" className="hero-headline stagger-item stagger-2">
            {identity.headline}
          </h1>

          <p className="hero-subhead stagger-item stagger-3">{identity.subhead}</p>

          <div className="hero-cta-row stagger-item stagger-4">
            <a href="#projekty" className="btn-primary btn-hero">
              <span>Zobraziť vybrané projekty</span>
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="#o-mne" className="btn-secondary btn-hero">
              <span>O mne &amp; Prístup</span>
            </a>
          </div>

          <div className="hero-signature-note stagger-item stagger-4">
            <span className="signature-label">Hlavné domény:</span>
            <span className="signature-text">
              .NET &amp; Blazor · Java Spring Boot · Three.js WebGL · Open Source
            </span>
          </div>
        </div>

        <div className="hero-visual-col is-revealed">
          <div className="specimen-frame stagger-item stagger-2">
            <div className="timeline-card-craft hero-trajectory-card">
              <div className="specimen-header">
                <div className="skill-card-header">
                  <Layers size={16} strokeWidth={1.5} className="row-icon" aria-hidden="true" />
                  <h2 className="skill-category-title">Aktuálne pôsobenie</h2>
                </div>
                <a
                  href="#skusenosti"
                  className="specimen-pill specimen-pill-link"
                >
                  <span>Celý životopis</span>
                  <ArrowRight size={11} strokeWidth={1.5} aria-hidden="true" />
                </a>
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
        </div>
      </div>
    </section>
  );
}
