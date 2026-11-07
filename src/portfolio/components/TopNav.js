import React from 'react';
import { User, FolderGit2, Layers, Compass, Sun, Moon, Mail } from 'lucide-react';

export function TopNav({ surfaceTone, onToggleSurfaceTone }) {
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
          <button
            type="button"
            onClick={onToggleSurfaceTone}
            className="btn-secondary btn-compact"
            aria-label={isDark ? 'Prepnúť na svetlý papierový režim' : 'Prepnúť na tmavý ateliérový režim'}
          >
            {isDark ? (
              <Sun size={15} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            ) : (
              <Moon size={15} strokeWidth={1.5} className="nav-icon" aria-hidden="true" />
            )}
            <span>{isDark ? 'Svetlý režim' : 'Tmavý režim'}</span>
          </button>

          <a href="#kontakt" className="btn-primary btn-compact">
            <Mail size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Kontakt</span>
          </a>
        </div>
      </div>
    </header>
  );
}
