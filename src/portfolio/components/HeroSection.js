import React from 'react';
import { Layers } from 'lucide-react';
import { HeroAntigravityCanvas } from './HeroAntigravityCanvas';
import { TiltCard, LearnMoreChevron, TextMorph } from './MotionPrimitives';
import avatarImg from '../../assets/avatar.jpg';

const HERO_SPECIALIZATIONS = [
  'Full-Stack Software Engineer',
  '.NET & Blazor Architektúra',
  'Three.js 3D WebGL & Grafika',
  'Java Spring Boot & Výskum TUKE',
  'Offline-First PWA Inžinier',
];

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

          <div className="hero-morph-row stagger-item stagger-1">
            <TextMorph
              label="Kľúčové špecializácie"
              phrases={HERO_SPECIALIZATIONS}
            />
          </div>

          <h1 id="hero-heading" className="hero-headline stagger-item stagger-2">
            {identity.headline}
          </h1>

          <p className="hero-subhead stagger-item stagger-3">{identity.subhead}</p>

          <div className="hero-cta-row stagger-item stagger-4">
            <a href="#projekty" className="btn-primary btn-hero t-learn">
              <span>Zobraziť vybrané projekty</span>
              <LearnMoreChevron />
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
          <TiltCard
            className="specimen-frame stagger-item stagger-2"
            innerClassName="timeline-card-craft hero-trajectory-card"
            maxTilt={11}
            dataTestId="hero-tilt-card"
          >
            <div className="hero-card-header">
              <div className="hero-profile-row">
                <img
                  src={avatarImg}
                  alt="Milan Mičieta"
                  className="hero-avatar-img"
                />
                <div className="hero-profile-text">
                  <span className="hero-profile-name">Milan Mičieta</span>
                  <span className="hero-profile-handle">@milan-micieta</span>
                </div>
              </div>

              <a
                href="#skusenosti"
                className="specimen-pill specimen-pill-link t-learn"
              >
                <span>Celý životopis</span>
                <LearnMoreChevron />
              </a>
            </div>

            <div className="hero-trajectory-title-bar">
              <Layers size={14} strokeWidth={1.75} className="row-icon" aria-hidden="true" />
              <h2 className="skill-category-title">Trajektória a pôsobenie</h2>
            </div>

            <div className="trajectory-line-track is-compact">
              {timeline.map((item) => (
                <div key={item.role} className="trajectory-line-item">
                  <span className="trajectory-node-dot" aria-hidden="true" />
                  <div className="trajectory-node-content">
                    <strong className="trajectory-node-title">{item.role}</strong>
                    <span className="trajectory-node-line">{item.org}</span>
                    <span className="trajectory-node-year">{item.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
