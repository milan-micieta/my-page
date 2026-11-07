import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from './data/profileData';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { AboutMeSection } from './components/AboutMeSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CapabilitiesAndAbout } from './components/CapabilitiesAndAbout';

const THEME_STORAGE_KEY = 'milan-portfolio-theme-mode';

function getSystemDarkPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialThemeMode() {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'paper' || saved === 'atelier' || saved === 'auto') {
      return saved;
    }
    if (saved === 'light') return 'paper';
    if (saved === 'dark') return 'atelier';
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return 'auto';
}

export function PortfolioPage() {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [systemIsDark, setSystemIsDark] = useState(getSystemDarkPreference);

  const surfaceTone =
    themeMode === 'auto'
      ? systemIsDark
        ? 'atelier'
        : 'paper'
      : themeMode;

  const handleToggleSurfaceTone = () => {
    setThemeMode((prev) => {
      const currentTone =
        prev === 'auto' ? (systemIsDark ? 'atelier' : 'paper') : prev;
      return currentTone === 'paper' ? 'atelier' : 'paper';
    });
  };

  const handleSelectThemeMode = (nextMode) => {
    setThemeMode(nextMode);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemIsDark(Boolean(e.matches));
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      } catch {
        // Ignore storage write errors
      }
    }

    if (typeof document !== 'undefined') {
      document.body.className = `theme-${surfaceTone}`;
      document.documentElement.setAttribute(
        'data-theme',
        surfaceTone === 'atelier' ? 'dark' : 'light'
      );
      document.documentElement.style.backgroundColor =
        surfaceTone === 'atelier' ? '#141311' : '#f7f4ee';
    }
  }, [themeMode, surfaceTone]);

  return (
    <div
      className={`portfolio-shell theme-${surfaceTone}`}
      data-testid="portfolio-shell"
    >
      <TopNav
        surfaceTone={surfaceTone}
        themeMode={themeMode}
        onToggleSurfaceTone={handleToggleSurfaceTone}
        onSelectThemeMode={handleSelectThemeMode}
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
