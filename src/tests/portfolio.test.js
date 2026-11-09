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
  beforeEach(() => {
    window.location.hash = '';
  });

  test('renders Milan Mičieta identity, grounded context, and exactly 4 selected home projects', () => {
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

    // 1. DRAVEN
    expect(
      screen.getByRole('heading', {
        name: /DRAVEN — Automatizované vyhodnocovanie SQL riešení v DataGripe/i,
      })
    ).toBeInTheDocument();

    // 2. 3D Digitálne dvojča
    expect(
      screen.getByRole('heading', {
        name: /Interaktívne 3D digitálne dvojča výrobného závodu/i,
      })
    ).toBeInTheDocument();

    // 3. Rails & Sails
    expect(
      screen.getByRole('heading', {
        name: /Rails & Sails — Predikcia bodových hodnôt v dopravnej sieti cez Graph ML/i,
      })
    ).toBeInTheDocument();

    // 4. Neighborhood Adventure Finder
    expect(
      screen.getByRole('heading', {
        name: /Neighborhood Adventure Finder — Komunitná geolokačná PWA/i,
      })
    ).toBeInTheDocument();

    // Verify other 6 projects were moved to dedicated WorkPage and are NOT in home Selected work
    expect(
      screen.queryByRole('heading', {
        name: /MudBlazor — Open-Source opravy komponentov MudPopover a MudDialog/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: /Systém prediktívnej údržby a OEE telemetrie \(TPM\)/i,
      })
    ).not.toBeInTheDocument();

    // Verify strict confidentiality
    const fullText = container.textContent;
    expect(fullText).not.toMatch(/SAKO|ISPA|CAMS|VOIS|Tatravagónka|MDJ/i);
  });

  test('renders Hero current roles and full CV Trajectory section from Srobarka to present', () => {
    const { container } = render(<App />);

    const headings = screen.getAllByRole('heading', {
      name: /Trajektória a pôsobenie/i,
    });
    expect(headings.length).toBeGreaterThanOrEqual(2);

    expect(
      screen.getByText(/Inžinierske štúdium \(Ing\.\) — Odbor Informatika/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bakalárske štúdium \(Bc\.\) — Odbor Informatika/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CCNA: Introduction to Networks/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cisco Networking Academy certifikát/i)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Gymnázium, Šrobárova 1, Košice/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/Full-Stack Software Engineer & 3D WebGL Architekt/i)
    ).toBeInTheDocument();

    const trajectoryDots = container.querySelectorAll('.trajectory-node-dot');
    expect(trajectoryDots.length).toBeGreaterThanOrEqual(10);
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

  test('filters projects by category and search input on WorkPage', () => {
    window.location.hash = '';
    render(<App />);

    const workLink = screen.getByRole('link', { name: /Moja práca/i });
    fireEvent.click(workLink);

    expect(screen.getByTestId('work-page')).toBeInTheDocument();

    const workTab = screen.getByRole('tab', { name: /^Priemysel & Enterprise$/i });
    fireEvent.click(workTab);

    expect(
      screen.getByRole('heading', {
        name: /3D Digitálne dvojča/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /DRAVEN/i,
      })
    ).not.toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', {
      name: /Hľadať projekt alebo technológiu/i,
    });
    fireEvent.change(searchInput, { target: { value: 'neexistujuci-projekt' } });

    expect(
      screen.getByText(/Pre zadaný filter sa nenašiel žiadny projekt/i)
    ).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', {
      name: /Vymazať vyhľadávanie/i,
    });
    expect(clearBtn).toHaveClass('is-visible');
    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');
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

    // Rails & Sails engineering solutions
    expect(
      screen.getByText(/Modelovanie hernej mapy ako neorientovaného multigrafu v NetworkX/i)
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

  test('wires transitions.dev motion primitives (sliding tabs pill, 3D card tilt, number pop-in, icon swap & learn-more hover)', () => {
    const { container } = render(<App />);

    // 1. Sliding tabs pills exist in theme switcher and contribution filter tabs
    const pills = container.querySelectorAll('.t-tabs-pill');
    expect(pills.length).toBeGreaterThanOrEqual(2);

    // 2. 3D Card Tilt responds to pointermove and resets on pointerleave
    const heroTilt = screen.getByTestId('hero-tilt-card');
    const innerCard = heroTilt.querySelector('.t-tilt-card');
    expect(innerCard).toBeInTheDocument();

    fireEvent.pointerMove(heroTilt, { clientX: 120, clientY: 80, pointerType: 'mouse' });
    expect(heroTilt).toHaveClass('is-hover');
    expect(innerCard).toHaveClass('is-tilting');

    fireEvent.pointerLeave(heroTilt, { pointerType: 'mouse' });
    expect(heroTilt).not.toHaveClass('is-hover');
    expect(innerCard).not.toHaveClass('is-tilting');

    // 3. Number Pop-In animates digits when switching Contribution Graph filter
    const enterpriseTab = screen.getByRole('tab', { name: /Enterprise GitLab/i });
    fireEvent.click(enterpriseTab);
    const animatingGroup = container.querySelector('.t-digit-group.is-animating');
    expect(animatingGroup).toBeInTheDocument();

    // 4. Learn-More Chevron hooks exist
    const learnChevrons = container.querySelectorAll('.t-learn-chevron .t-learn-arm');
    expect(learnChevrons.length).toBeGreaterThan(0);
  });

  test('navigates to dedicated project page on detail click and returns back to portfolio', () => {
    window.location.hash = '';
    render(<App />);

    // Find and click the button to open project detail page for the active project
    const openPageBtns = screen.getAllByRole('button', {
      name: /Zobraziť stránku projektu|Stránka projektu/i,
    });
    expect(openPageBtns.length).toBeGreaterThan(0);
    fireEvent.click(openPageBtns[0]);

    // Expect the dedicated project detail page view to be rendered
    expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Späť na vybrané práce/i })).toBeInTheDocument();

    // Click back button
    const backBtn = screen.getByRole('button', { name: /Späť na vybrané práce/i });
    fireEvent.click(backBtn);

    // Expect return to portfolio overview
    expect(screen.queryByTestId('project-detail-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('portfolio-shell')).toBeInTheDocument();
  });

  test('navigates to dedicated WorkPage ("Moja práca") displaying all 10 projects and returns back', () => {
    window.location.hash = '';
    render(<App />);

    // Click "Moja práca" link in navigation
    const workNavLink = screen.getByRole('link', { name: /Moja práca/i });
    expect(workNavLink).toBeInTheDocument();
    fireEvent.click(workNavLink);

    // Expect dedicated WorkPage to be rendered
    expect(screen.getByTestId('work-page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Moja práca/i })).toBeInTheDocument();

    // Verify all other projects are present on WorkPage (e.g. MudBlazor, TPM, Enterprise Planning)
    expect(
      screen.getByRole('heading', {
        name: /MudBlazor/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Podnikové systémy/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Prediktívna údržba/i,
      })
    ).toBeInTheDocument();

    // Click back button to return to home
    const backBtn = screen.getByRole('button', { name: /Späť na prehľad/i });
    fireEvent.click(backBtn);

    expect(screen.queryByTestId('work-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('portfolio-shell')).toBeInTheDocument();
  });
});
