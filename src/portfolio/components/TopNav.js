import React from 'react';
import { User, FolderGit2, Layers, Compass, Sun, Moon, Monitor, Mail } from 'lucide-react';

export function TopNav({
  surfaceTone,
  themeMode = 'auto',
  onToggleSurfaceTone,
  onSelectThemeMode,
}) {
  const isDark = surfaceTone === 'atelier';

  return (
    <header className="top-nav" role="banner">
      <div className="shell-container top-nav-inner">
        <a href="#top" className="brand-wordmark" aria-label="Milan Mičieta — Úvod">
          <span className="brand-glyph" aria-hidden="true">
            M
          </span>
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
            <span>Projekty</span>
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
          <div className="theme-pill-switcher" role="group" aria-label="Výber farebného režimu">
            <button
              type="button"
              onClick={() =>
                onSelectThemeMode
                  ? onSelectThemeMode('paper')
                  : isDark && onToggleSurfaceTone()
              }
              className={`theme-pill-btn ${themeMode === 'paper' ? 'is-active' : ''}`}
              aria-label={isDark ? 'Prepnúť na svetlý papierový režim' : 'Svetlý režim'}
              title="Svetlý režim"
            >
              <Sun size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>Svetlý</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectThemeMode
                  ? onSelectThemeMode('atelier')
                  : !isDark && onToggleSurfaceTone()
              }
              className={`theme-pill-btn ${themeMode === 'atelier' ? 'is-active' : ''}`}
              aria-label={!isDark ? 'Prepnúť na tmavý ateliérový režim' : 'Tmavý režim'}
              title="Tmavý režim"
            >
              <Moon size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>Tmavý</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectThemeMode && onSelectThemeMode('auto')}
              className={`theme-pill-btn ${themeMode === 'auto' ? 'is-active' : ''}`}
              aria-label="Podľa nastavenia počítača (Systém)"
              title="Podľa nastavenia počítača (Systém)"
            >
              <Monitor size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>Systém</span>
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
