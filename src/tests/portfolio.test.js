import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import {
  computeNestedRadius,
  snapToGrid,
  filterProjects,
  formatMetricDelta,
} from '../portfolio/utils/craftMath';
import { PROFILE_DATA } from '../portfolio/data/profileData';

describe('craftMath geometric & filtering domain utilities', () => {
  test('computeNestedRadius enforces R_inner = max(4, R_outer - padding)', () => {
    expect(computeNestedRadius(20, 8)).toBe(12);
    expect(computeNestedRadius(16, 8)).toBe(8);
    expect(computeNestedRadius(12, 12)).toBe(4);
    expect(computeNestedRadius(12, 16)).toBe(4);
  });

  test('computeNestedRadius handles malformed and boundary values safely', () => {
    expect(computeNestedRadius(-10, 8)).toBe(4);
    expect(computeNestedRadius(null, 8)).toBe(4);
    expect(computeNestedRadius(16, -4)).toBe(16);
    expect(computeNestedRadius(16, 'invalid')).toBe(16);
  });

  test('snapToGrid aligns values to 4px architectural scale', () => {
    expect(snapToGrid(15, 4)).toBe(16);
    expect(snapToGrid(13, 4)).toBe(12);
    expect(snapToGrid(-5, 4)).toBe(0);
    expect(snapToGrid('abc', 4)).toBe(0);
  });

  test('filterProjects filters by category and case-insensitive search query', () => {
    const all = filterProjects(PROFILE_DATA.projects, 'all', '');
    expect(all.length).toBe(10);

    const ossOnly = filterProjects(PROFILE_DATA.projects, 'open-source', '');
    expect(ossOnly.length).toBe(3);

    const byStack = filterProjects(PROFILE_DATA.projects, 'all', 'three.js');
    expect(byStack.length).toBe(1);
    expect(byStack[0].id).toBe('industrial-digital-twin');

    const emptyResult = filterProjects(PROFILE_DATA.projects, 'all', 'nonexistent-xyz-token');
    expect(emptyResult).toEqual([]);
    expect(filterProjects(null, 'all', '')).toEqual([]);
  });

  test('formatMetricDelta formats comparison strings with sign', () => {
    expect(formatMetricDelta(96, 72, '%', 'oproti priemeru')).toBe('+24% oproti priemeru');
    expect(formatMetricDelta(140, 200, 'ms', 'vs štandard')).toBe('-60ms vs štandard');
    expect(formatMetricDelta('bad', 10, '%', 'vs základ')).toBe('0% vs základ');
  });
});

describe('PortfolioPage Authentic Craft Showcase (Confidentiality & Anti-Slop)', () => {
  test('renders Milan Mičieta identity, grounded context, and anonymized projects', () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /Tvorím premyslené digitálne produkty, 3D priemyselné rozhrania a spoľahlivú systémovú architektúru/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Zameranie, skúsenosti a technický kontext/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /DRAVEN — Automatizované vyhodnocovanie SQL riešení v DataGripe/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Interaktívne 3D digitálne dvojča výrobného závodu/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /MudBlazor — Open-Source opravy komponentov MudPopover a MudDialog/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Systém prediktívnej údržby a OEE telemetrie \(TPM\)/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Podnikový systém plánovania výroby a energetických tokov/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Neighborhood Adventure Finder — Komunitná geolokačná PWA/i,
      })
    ).toBeInTheDocument();

    // Verify strict confidentiality
    const fullText = container.textContent;
    expect(fullText).not.toMatch(/SAKO|ISPA|CAMS|VOIS|Tatravagónka|MDJ/i);
  });

  test('renders Hero current roles and full CV Trajectory section from Srobarka to present', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /Aktuálne pôsobenie/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Trajektória a pôsobenie/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Gymnázium, Šrobárova 1, Košice \(„Šrobárka“\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bakalárske štúdium Informatiky \(Bc\.\) & Výskum DRAVEN/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Full-Stack Software Engineer & 3D WebGL Architekt/i)
    ).toBeInTheDocument();
  });

  test('toggles between light paper, dark atelier, and system themes and persists in localStorage', () => {
    window.localStorage.clear();
    const { unmount } = render(<App />);

    const shell = screen.getByTestId('portfolio-shell');
    expect(shell).toHaveClass('theme-paper');

    const themeBtn = screen.getByRole('button', {
      name: /Prepnúť na tmavý ateliérový režim/i,
    });
    fireEvent.click(themeBtn);
    expect(shell).toHaveClass('theme-atelier');
    expect(window.localStorage.getItem('milan-portfolio-theme-mode')).toBe('atelier');

    // Simulate page refresh (unmount & re-render)
    unmount();
    render(<App />);
    const refreshedShell = screen.getByTestId('portfolio-shell');
    expect(refreshedShell).toHaveClass('theme-atelier');

    // Switch back to system default
    const systemBtn = screen.getByRole('button', {
      name: /Podľa nastavenia počítača \(Systém\)/i,
    });
    fireEvent.click(systemBtn);
    expect(window.localStorage.getItem('milan-portfolio-theme-mode')).toBe('auto');
  });

  test('filters projects by category and search input', () => {
    render(<App />);

    const workTab = screen.getByRole('tab', { name: /^Priemysel & Enterprise$/i });
    fireEvent.click(workTab);

    expect(
      screen.getByRole('heading', {
        name: /Interaktívne 3D digitálne dvojča výrobného závodu/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Podnikové systémy pre plánovanie výroby a správu aktív \(PWA\)/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /DRAVEN — Automatizované vyhodnocovanie SQL riešení v DataGripe/i,
      })
    ).not.toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', {
      name: /Hľadať projekt alebo technológiu/i,
    });
    fireEvent.change(searchInput, { target: { value: 'neexistujuci-projekt' } });

    expect(
      screen.getByText(/Pre zadaný filter sa nenašiel žiadny projekt/i)
    ).toBeInTheDocument();
  });

  test('renders engineering solutions directly on the right side of project cards', () => {
    render(<App />);

    // DRAVEN engineering solutions are directly visible
    expect(
      screen.getByText(/Vyhodnocovací engine porovnávajúci dátové množiny \(LinkedHashMap\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Izolovaný read-only sandbox s automatickým rollbackom/i)
    ).toBeInTheDocument();

    // 3D Digital Twin engineering solutions
    expect(
      screen.getByText(/Procedurálne generovanie hál z 2D polygónov so stavovou indikáciou/i)
    ).toBeInTheDocument();

    // MudBlazor engineering solutions
    expect(
      screen.getByText(/Výpočet left\/top pozície MudPopover s kompenzáciou CSS body \{ zoom \}/i)
    ).toBeInTheDocument();
  });

  test('renders real Git Contribution Graph and filters contributions by source', () => {
    render(<App />);

    const graphCard = screen.getByTestId('contribution-graph-card');
    expect(graphCard).toBeInTheDocument();
    expect(screen.getByText(/príspevkov za posledný rok/i)).toBeInTheDocument();

    // Filter by FEI TUKE GitLab
    const feiFilterBtn = screen.getByRole('tab', { name: /FEI TUKE GitLab/i });
    fireEvent.click(feiFilterBtn);
    expect(feiFilterBtn).toHaveAttribute('aria-selected', 'true');

    // Filter by GitHub & OSS
    const githubFilterBtn = screen.getByRole('tab', { name: /GitHub & OSS/i });
    fireEvent.click(githubFilterBtn);
    expect(githubFilterBtn).toHaveAttribute('aria-selected', 'true');
  });
});
