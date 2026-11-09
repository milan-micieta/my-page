import React, { useRef } from 'react';
import { User, FolderGit2, Layers, Compass, Sun, Moon, Monitor, Mail } from 'lucide-react';
import { useSlidingTabsPill } from './MotionPrimitives';
import avatarImg from '../../assets/avatar.jpg';

export function TopNav({
  surfaceTone,
  themeMode = 'auto',
  onToggleSurfaceTone,
  onSelectThemeMode,
  onNavigateToWork,
}) {
  const isDark = surfaceTone === 'atelier';
  const switcherRef = useRef(null);
  useSlidingTabsPill(switcherRef, themeMode);

  return (
    <header className="top-nav" role="banner">
      <div className="shell-container top-nav-inner">
        <a href="#top" className="brand-wordmark" aria-label="Milan Mičieta — Úvod">
          <img
            src={avatarImg}
            alt="Milan Mičieta"
            className="brand-avatar-img"
          />
          <span className="brand-name">Milan Mičieta</span>
          <span className="brand-meta">Software Engineer</span>
        </a>

        <nav className="nav-links" aria-label="Hlavná navigácia">
          <a href="#o-mne" className="nav-item">
            <User size={16} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            <span>O mne</span>
          </a>
          <a href="#projekty" className="nav-item">
            <FolderGit2 size={16} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            <span>Vybrané</span>
          </a>
          <a
            href="#/work"
            className="nav-item nav-item-work"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToWork) {
                onNavigateToWork();
              } else if (typeof window !== 'undefined') {
                window.location.hash = '#/work';
              }
            }}
          >
            <Layers size={16} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            <span>Moja práca</span>
          </a>
          <a href="#schopnosti" className="nav-item">
            <Layers size={16} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            <span>Technológie</span>
          </a>
          <a href="#skusenosti" className="nav-item">
            <Compass size={16} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            <span>Skúsenosti</span>
          </a>
        </nav>

        <div className="nav-actions">
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
                  : isDark && onToggleSurfaceTone()
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
                  : !isDark && onToggleSurfaceTone()
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

          <a href="#kontakt" className="btn-primary btn-compact">
            <Mail size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Kontakt</span>
          </a>
        </div>
      </div>
    </header>
  );
}
