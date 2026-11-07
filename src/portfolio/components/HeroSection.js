import React, { useState } from 'react';
import { ArrowRight, Code2, Layers, Terminal, ExternalLink } from 'lucide-react';
import { HeroAntigravityCanvas } from './HeroAntigravityCanvas';

const DOSSIER_TABS = [
  {
    id: 'profile',
    label: 'Prehľad profilu',
    caption: 'Interaktívna 3D scéna · Enterprise .NET · Výskum FEI TUKE',
  },
  {
    id: 'stack',
    label: 'Pracovný stack',
    caption: '.NET & Blazor · Spring Boot · React · Three.js · Kafka',
  },
  {
    id: 'activity',
    label: 'Výsledky & PRs',
    caption: 'DRAVEN (SUS 84.5) · MudBlazor (#14074, #13946) · 3D Twin',
  },
];

const ISOMETRIC_HALLS = [
  {
    id: 'cnc',
    code: 'HALA 01',
    name: 'CNC & Laserové pracovisko',
    status: 'V norme · 60 fps WebGL',
    machines: '4× CNC centrum · 2× Laser',
  },
  {
    id: 'robot',
    code: 'HALA 02',
    name: 'Robotická montáž & Dopravníky',
    status: 'Aktívna linka · Raycasting',
    machines: '6× Robotické rameno · 3× Dopravník',
  },
  {
    id: 'press',
    code: 'HALA 03',
    name: 'Lisovňa & Regálový sklad',
    status: 'Synchronizované · PWA',
    machines: '3× Hydraulický lis · 8× Skladový blok',
  },
];

export function HeroSection({ identity }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedHall, setSelectedHall] = useState('cnc');
  const mousePosRef = React.useRef({ x: -9999, y: -9999, active: false });

  const currentHall = ISOMETRIC_HALLS.find((h) => h.id === selectedHall) || ISOMETRIC_HALLS[0];

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
            <div className="specimen-surface">
              <div className="specimen-header">
                <div className="specimen-title-group">
                  <span className="specimen-index">PROFILOVÝ DOKUMENT · MILAN MIČIETA</span>
                  <h2 className="specimen-title">{identity.role}</h2>
                </div>
                <a
                  href={identity.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="specimen-pill specimen-pill-link"
                >
                  <Code2 size={12} strokeWidth={1.5} aria-hidden="true" />
                  <span>GitHub</span>
                  <ExternalLink size={10} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>

              <div className="specimen-tabs" role="tablist" aria-label="Pohľad na profil">
                {DOSSIER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`specimen-tab ${activeTab === tab.id ? 'is-selected' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'profile' && (
                <div className="specimen-body" role="tabpanel">
                  <div className="iso-showcase-stage">
                    <div className="iso-stage-top">
                      <span className="iso-stage-badge">Digitálne dvojča závodu</span>
                      <span className="iso-stage-status">{currentHall.status}</span>
                    </div>

                    <svg
                      viewBox="0 0 480 185"
                      className="iso-hero-svg"
                      aria-label="3D Izometrický model výrobného závodu"
                    >
                      <polygon
                        points="240,16 460,94 240,174 20,94"
                        className="iso-floor-plate"
                      />
                      <line x1="136" y1="52" x2="344" y2="124" className="iso-road-line" />
                      <line x1="344" y1="52" x2="136" y2="124" className="iso-road-line" />

                      <g
                        className={`iso-building-group ${selectedHall === 'cnc' ? 'is-elevated' : ''}`}
                        onClick={() => setSelectedHall('cnc')}
                      >
                        <polygon points="156,44 216,66 156,88 96,66" className="iso-roof" />
                        <polygon points="96,66 156,88 156,112 96,90" className="iso-wall-left" />
                        <polygon points="216,66 156,88 156,112 216,90" className="iso-wall-right" />
                        <text x="156" y="69" textAnchor="middle" className="iso-hall-label">
                          HALA 01
                        </text>
                      </g>

                      <g
                        className={`iso-building-group ${selectedHall === 'robot' ? 'is-elevated' : ''}`}
                        onClick={() => setSelectedHall('robot')}
                      >
                        <polygon points="268,62 336,86 268,110 200,86" className="iso-roof" />
                        <polygon points="200,86 268,110 268,136 200,112" className="iso-wall-left" />
                        <polygon points="336,86 268,110 268,136 336,112" className="iso-wall-right" />
                        <text x="268" y="89" textAnchor="middle" className="iso-hall-label">
                          HALA 02
                        </text>
                      </g>

                      <g
                        className={`iso-building-group ${selectedHall === 'press' ? 'is-elevated' : ''}`}
                        onClick={() => setSelectedHall('press')}
                      >
                        <polygon points="354,42 406,60 354,78 302,60" className="iso-roof" />
                        <polygon points="302,60 354,78 354,100 302,82" className="iso-wall-left" />
                        <polygon points="406,60 354,78 354,100 406,82" className="iso-wall-right" />
                        <text x="354" y="63" textAnchor="middle" className="iso-hall-label">
                          HALA 03
                        </text>
                      </g>
                    </svg>

                    <div className="iso-hall-selector">
                      {ISOMETRIC_HALLS.map((hall) => (
                        <button
                          key={hall.id}
                          type="button"
                          onClick={() => setSelectedHall(hall.id)}
                          className={`iso-hall-btn ${selectedHall === hall.id ? 'is-active' : ''}`}
                        >
                          <span className="iso-btn-code">{hall.code}</span>
                          <span className="iso-btn-name">{hall.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="preview-layers-list">
                    <div className="layer-row is-highlighted">
                      <Layers size={14} strokeWidth={1.5} className="row-icon" aria-hidden="true" />
                      <span className="row-label">{currentHall.name}</span>
                      <span className="row-value">{currentHall.machines}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stack' && (
                <div className="specimen-body" role="tabpanel">
                  <div className="code-specimen-block">
                    <div className="code-specimen-bar">
                      <Terminal size={14} strokeWidth={1.5} className="row-icon" aria-hidden="true" />
                      <span className="code-filename">milan.profile.ts</span>
                      <span className="code-tag">Full-Stack &amp; 3D</span>
                    </div>
                    <pre className="code-pre">
                      <code>{`export const engineer = {
  name: 'Milan Mičieta',
  roles: ['Enterprise Full-Stack', '3D WebGL', 'EdTech Research'],
  backend: ['.NET / C#', 'Spring Boot 3', 'PostgreSQL', 'Kafka'],
  frontend: ['React 18', 'Blazor / MudBlazor', 'Three.js'],
  verifiedSUS: 84.5,
  openSourcePRs: ['MudBlazor #14074', 'MudBlazor #13946'],
};`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="specimen-body" role="tabpanel">
                  <div className="telemetry-bars">
                    <div className="telemetry-item">
                      <div className="telemetry-meta">
                        <span>DRAVEN — skóre použiteľnosti SUS (42 študentov)</span>
                        <span className="telemetry-num">84.5 / 100</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill is-accent" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="telemetry-item">
                      <div className="telemetry-meta">
                        <span>MudBlazor Core — schválené pull requesty</span>
                        <span className="telemetry-num">PR #14074 &amp; #13946</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div className="telemetry-item">
                      <div className="telemetry-meta">
                        <span>Záujem o opätovné použitie DRAVEN</span>
                        <span className="telemetry-num">90 % (n = 36)</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
