import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from './data/profileData';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { AboutMeSection } from './components/AboutMeSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CapabilitiesAndAbout } from './components/CapabilitiesAndAbout';

export function PortfolioPage() {
  const [surfaceTone, setSurfaceTone] = useState('paper');

  const handleToggleSurfaceTone = () =>
    setSurfaceTone((prev) => (prev === 'paper' ? 'atelier' : 'paper'));

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = `theme-${surfaceTone}`;
      document.documentElement.style.backgroundColor =
        surfaceTone === 'atelier' ? '#141311' : '#f7f4ee';
    }
  }, [surfaceTone]);

  return (
    <div
      className={`portfolio-shell theme-${surfaceTone}`}
      data-testid="portfolio-shell"
    >
      <TopNav
        surfaceTone={surfaceTone}
        onToggleSurfaceTone={handleToggleSurfaceTone}
      />

      <main>
        <HeroSection identity={PROFILE_DATA.identity} />

        <AboutMeSection
          aboutStory={PROFILE_DATA.aboutStory}
          focusAreas={PROFILE_DATA.focusAreas}
        />

        <ProjectsSection
          projects={PROFILE_DATA.projects}
          categories={PROFILE_DATA.categories}
        />

        <CapabilitiesAndAbout
          skillMatrix={PROFILE_DATA.skillMatrix}
          timeline={PROFILE_DATA.timeline}
          identity={PROFILE_DATA.identity}
        />
      </main>
    </div>
  );
}
