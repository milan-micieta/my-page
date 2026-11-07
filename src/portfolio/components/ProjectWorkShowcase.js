import React, { useState } from 'react';
import { Play, CheckCircle2, GitPullRequest, Database, Cpu, Wifi, WifiOff } from 'lucide-react';

export function ProjectWorkShowcase({ projectId }) {
  // State for interactive widgets
  const [dravenExecuted, setDravenExecuted] = useState(true);
  const [activeHall, setActiveHall] = useState('cnc');
  const [activePr, setActivePr] = useState('popover');
  const [streamSimulated, setStreamSimulated] = useState(false);
  const [isPwaOnline, setIsPwaOnline] = useState(true);
  const [activeMlFeature, setActiveMlFeature] = useState('dist');

  if (projectId === 'draven-sql-evaluation' || projectId === 'draven-sql-tester') {
    return (
      <div className="work-showcase-window ide-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">DataGrip · evaluate_submission.sql</span>
          <span className="window-badge">PostgreSQL Sandbox</span>
        </div>

        <div className="window-code-body">
          <pre className="code-editor-lines">
            <code>
              <span className="token-comment">-- Izolovaný sandbox: Read-Only transakcia s auto-rollbackom</span>{'\n'}
              <span className="token-keyword">SELECT</span> student_id, task_id, execution_time_ms{'\n'}
              <span className="token-keyword">FROM</span> evaluate_submission(attempt_no =&gt; <span className="token-number">1</span>);{'\n'}
              <span className="token-comment">-- Engine: Zhoda LinkedHashMap stĺpcov a hodnôt</span>
            </code>
          </pre>
        </div>

        <div className="window-toolbar">
          <button
            type="button"
            onClick={() => setDravenExecuted((prev) => !prev)}
            className="showcase-action-btn"
          >
            <Play size={13} strokeWidth={2} />
            <span>{dravenExecuted ? 'Spustiť znova' : 'Spustiť overovací test'}</span>
          </button>
          <div className="execution-result-pill">
            <CheckCircle2 size={13} strokeWidth={2} className="status-ok-icon" />
            <span>{dravenExecuted ? 'PASS · 8ms · 100% zhoda dát' : 'Pripravené na spustenie'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (projectId === 'industrial-digital-twin') {
    return (
      <div className="work-showcase-window 3d-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">Three.js · Izometrická WebGL scéna (3422 × 1382 px)</span>
          <span className="window-badge">60 FPS</span>
        </div>

        <div className="showcase-3d-viewport">
          <svg className="isometric-mesh-svg" viewBox="0 0 400 170" aria-label="3D model haly závodu">
            {/* Grid floor */}
            <path d="M200 20 L370 95 L200 165 L30 95 Z" fill="none" stroke="var(--hairline-strong)" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Procedural Hall Extrusion */}
            {activeHall === 'cnc' && (
              <g className="hall-geometry-group">
                <polygon points="120,70 200,35 280,70 200,105" fill="var(--bg-raised)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="120,70 200,105 200,135 120,100" fill="var(--bg-deep)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="280,70 200,105 200,135 280,100" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="200" cy="70" r="4" fill="var(--semantic-ok)" />
                <text x="200" y="60" textAnchor="middle" fontSize="10" fill="var(--ink-primary)" fontWeight="600">CNC Fréza #01 (Aktívna)</text>
              </g>
            )}

            {activeHall === 'robot' && (
              <g className="hall-geometry-group">
                <polygon points="140,60 200,30 260,60 200,90" fill="var(--bg-raised)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="140,60 200,90 200,120 140,90" fill="var(--bg-deep)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="260,60 200,90 200,120 260,90" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="200" cy="65" r="4" fill="var(--accent)" />
                <text x="200" y="55" textAnchor="middle" fontSize="10" fill="var(--ink-primary)" fontWeight="600">Robotické rameno (Zváranie)</text>
              </g>
            )}

            {activeHall === 'conveyor' && (
              <g className="hall-geometry-group">
                <polygon points="100,80 200,35 300,80 200,125" fill="var(--bg-raised)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="100,80 200,125 200,145 100,100" fill="var(--bg-deep)" stroke="var(--accent)" strokeWidth="1.5" />
                <polygon points="300,80 200,125 200,145 300,100" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="200" cy="80" r="4" fill="var(--semantic-ok)" />
                <text x="200" y="70" textAnchor="middle" fontSize="10" fill="var(--ink-primary)" fontWeight="600">Pásový dopravník (Plynulý chod)</text>
              </g>
            )}
          </svg>
        </div>

        <div className="window-toolbar">
          <div className="showcase-mini-tabs">
            {[
              { id: 'cnc', label: 'Hala CNC' },
              { id: 'robot', label: 'Robotika' },
              { id: 'conveyor', label: 'Dopravník' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveHall(tab.id)}
                className={`mini-tab-btn ${activeHall === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="viewport-coords-label">Ortho Zoom: 1.25x</span>
        </div>
      </div>
    );
  }

  if (projectId === 'mudblazor-oss') {
    return (
      <div className="work-showcase-window diff-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">MudBlazor · GitHub Pull Request</span>
          <span className="window-badge badge-merged">
            <GitPullRequest size={11} strokeWidth={2} /> Merged
          </span>
        </div>

        <div className="window-toolbar diff-toolbar">
          <div className="showcase-mini-tabs">
            <button
              type="button"
              onClick={() => setActivePr('popover')}
              className={`mini-tab-btn ${activePr === 'popover' ? 'is-active' : ''}`}
            >
              PR #14074 (Popover Zoom)
            </button>
            <button
              type="button"
              onClick={() => setActivePr('dialog')}
              className={`mini-tab-btn ${activePr === 'dialog' ? 'is-active' : ''}`}
            >
              PR #13946 (Dialog Lifecycle)
            </button>
          </div>
        </div>

        <div className="window-code-body diff-body">
          {activePr === 'popover' ? (
            <pre className="code-editor-lines">
              <code>
                <span className="diff-line diff-add">+ var zoom = await _jsRuntime.InvokeAsync&lt;double&gt;(&quot;mudWindow.getZoom&quot;);</span>{'\n'}
                <span className="diff-line diff-add">+ var left = (clientRect.Left / zoom) + windowScrollX;</span>{'\n'}
                <span className="diff-line diff-add">+ var maxWidth = (windowWidth / zoom) - left;</span>{'\n'}
                <span className="diff-line diff-neutral">{'// Korekcia pozície popoveru pri CSS body { zoom: 0.6 }'}</span>
              </code>
            </pre>
          ) : (
            <pre className="code-editor-lines">
              <code>
                <span className="diff-line diff-add">+ if (_isDisposed || ReferenceEquals(dialog, null)) return;</span>{'\n'}
                <span className="diff-line diff-add">+ await CleanUpDialogReferenceAsync();</span>{'\n'}
                <span className="diff-line diff-neutral">{'// Ošetrenie race-condition pri okamžitom znovuotvorení'}</span>
              </code>
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (projectId === 'stremio-streamcinema') {
    return (
      <div className="work-showcase-window edge-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">Vercel Edge · Serverless Stream Router</span>
          <span className="window-badge">&lt; 14 ms</span>
        </div>

        <div className="window-code-body">
          <pre className="code-editor-lines">
            <code>
              <span className="token-comment">{'// Bezstavové vyhodnotenie a priame HTTP 302 presmerovanie'}</span>{'\n'}
              <span className="token-keyword">GET</span> /:config/stream/movie/tt1375666.json{'\n'}
              <span className="token-keyword">HTTP/2 302 Found</span>{'\n'}
              <span className="token-string">Location: https://cdn.stream.internal/4k-hevc-hdr.mkv</span>
            </code>
          </pre>
        </div>

        <div className="window-toolbar">
          <button
            type="button"
            onClick={() => setStreamSimulated((prev) => !prev)}
            className="showcase-action-btn"
          >
            <Play size={13} strokeWidth={2} />
            <span>{streamSimulated ? 'Overiť znova' : 'Test CDN presmerovania'}</span>
          </button>
          <span className="execution-result-pill">
            <CheckCircle2 size={13} strokeWidth={2} className="status-ok-icon" />
            <span>4K HDR · HEVC · SK Dabing (11ms)</span>
          </span>
        </div>
      </div>
    );
  }

  if (projectId === 'enterprise-planning-pwa') {
    return (
      <div className="work-showcase-window pwa-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">ASP.NET Core &amp; Blazor · Offline-First PWA</span>
          <span className="window-badge">IndexedDB Sync</span>
        </div>

        <div className="pwa-sync-simulator">
          <div className="sync-status-row">
            <div className="sync-mode-indicator">
              {isPwaOnline ? (
                <>
                  <Wifi size={14} className="status-ok-icon" />
                  <span>Online · Živá synchronizácia výrobných liniek</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} className="status-warn-icon" />
                  <span>Offline · Lokálna IndexedDB fronta prestojov</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsPwaOnline((prev) => !prev)}
              className="showcase-action-btn btn-mini"
            >
              <span>{isPwaOnline ? 'Simulovať výpadok siete' : 'Obnoviť pripojenie'}</span>
            </button>
          </div>

          <div className="sync-events-box">
            <div className="sync-event-item">
              <span className="sync-badge">MES Event</span>
              <span className="sync-desc">
                {isPwaOnline
                  ? 'Zmena taktu linky #04 zapísaná priamo do centrálnej DB'
                  : 'Záznam prestoja lisu uložený lokálne do IndexedDB (čaká na sieť)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectId === 'ticketlake-data-platform') {
    return (
      <div className="work-showcase-window data-window">
        <div className="window-header">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">Kafka &amp; MQTT/TLS · Event-Driven Broker</span>
          <span className="window-badge">Playwright Workers</span>
        </div>

        <div className="kafka-stream-preview">
          <div className="kafka-event-row">
            <Database size={13} className="kafka-icon" />
            <span className="kafka-topic">flights.price.updated</span>
            <span className="kafka-payload">&#123; route: &quot;VIE-BTS&quot;, price: &quot;39.90€&quot; &#125;</span>
          </div>
          <div className="kafka-event-row">
            <Cpu size={13} className="kafka-icon" />
            <span className="kafka-topic">events.theatre.seats</span>
            <span className="kafka-payload">&#123; hall: &quot;SND&quot;, available: 42 &#125;</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Rails & Sails Graph ML
  return (
    <div className="work-showcase-window ml-window">
      <div className="window-header">
        <div className="window-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="window-title">NetworkX MultiGraph · 9 Topologických príznakov</span>
        <span className="window-badge">R² = 0.94</span>
      </div>

      <div className="ml-features-bars">
        {[
          { id: 'dist', label: 'Topologická vzdialenosť', val: '92%' },
          { id: 'degree', label: 'Stupeň uzla (Degree)', val: '78%' },
          { id: 'wharf', label: 'Námorné prístavy (Wharf)', val: '64%' },
          { id: 'multigraph', label: 'Paralelné hrany', val: '86%' },
        ].map((item) => (
          <div
            key={item.id}
            className={`ml-bar-item ${activeMlFeature === item.id ? 'is-active' : ''}`}
            onClick={() => setActiveMlFeature(item.id)}
          >
            <div className="ml-bar-header">
              <span className="ml-bar-label">{item.label}</span>
              <span className="ml-bar-val">{item.val}</span>
            </div>
            <div className="ml-bar-track">
              <div className="ml-bar-fill" style={{ width: item.val }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
