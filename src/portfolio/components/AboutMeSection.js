import React, { useRef } from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import { TiltCard } from './MotionPrimitives';

export function AboutMeSection({ aboutStory, focusAreas }) {
  const sectionRef = useRef(null);
  const revealed = useScrollReveal(sectionRef);

  return (
    <section
      id="o-mne"
      ref={sectionRef}
      className={`craft-section ${revealed ? 'is-revealed' : ''}`}
      aria-labelledby="about-main-heading"
    >
      <div className="shell-container">
        <div className="section-header-split stagger-item stagger-1">
          <div>
            <span className="section-kicker">{aboutStory.kicker}</span>
            <h2 id="about-main-heading" className="section-title">
              {aboutStory.title}
            </h2>
          </div>
          <p className="section-lead">{aboutStory.lead}</p>
        </div>

        <div className="about-bento-row stagger-item stagger-2">
          {focusAreas.map((area) => (
            <TiltCard
              key={area.id}
              innerClassName="about-focus-card"
              maxTilt={9}
            >
              <span className="focus-card-kicker">{area.kicker}</span>
              <h3 className="focus-card-title">{area.title}</h3>
              <p className="focus-card-desc">{area.description}</p>
              <div className="focus-card-chips">
                {area.chips.map((chip) => (
                  <span key={chip} className="focus-chip">
                    {chip}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
