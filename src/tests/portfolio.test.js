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
    expect(all.length).toBe(7);

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

    // Verify strict confidentiality
    const fullText = container.textContent;
    expect(fullText).not.toMatch(/SAKO|ISPA|CAMS|VOIS|Tatravagónka|MDJ/i);
  });

  test('interacts with isometric 3D halls and switches hero dossier tabs', () => {
    render(<App />);

    const robotHallBtn = screen.getByRole('button', {
      name: /HALA 02 Robotická montáž & Dopravníky/i,
    });
    fireEvent.click(robotHallBtn);
    expect(screen.getByText(/6× Robotické rameno · 3× Dopravník/i)).toBeInTheDocument();

    const stackTab = screen.getByRole('tab', { name: /Pracovný stack/i });
    fireEvent.click(stackTab);
    expect(screen.getByText(/milan\.profile\.ts/i)).toBeInTheDocument();

    const activityTab = screen.getByRole('tab', { name: /Výsledky & PRs/i });
    fireEvent.click(activityTab);
    expect(
      screen.getByText(/DRAVEN — skóre použiteľnosti SUS \(42 študentov\)/i)
    ).toBeInTheDocument();
  });

  test('toggles between light paper and dark atelier themes', () => {
    render(<App />);

    const shell = screen.getByTestId('portfolio-shell');
    expect(shell).toHaveClass('theme-paper');

    const themeBtn = screen.getByRole('button', {
      name: /Prepnúť na tmavý ateliérový režim/i,
    });
    fireEvent.click(themeBtn);
    expect(shell).toHaveClass('theme-atelier');
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

  test('toggles project accordion to reveal what Milan did on the project', () => {
    render(<App />);

    const dravenAccordionBtn = screen.getByRole('button', {
      name: /DRAVEN — Automatizované vyhodnocovanie SQL riešení v DataGripe — Čo som na projekte robil/i,
    });
    expect(dravenAccordionBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(dravenAccordionBtn);
    expect(dravenAccordionBtn).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(/Vyhodnocovací engine porovnávajúci dátové množiny \(LinkedHashMap\)/i)
    ).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(dravenAccordionBtn);
    expect(dravenAccordionBtn).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText(/Vyhodnocovací engine porovnávajúci dátové množiny \(LinkedHashMap\)/i)
    ).not.toBeInTheDocument();
  });

  test('interacts with authentic project showcases (DataGrip IDE & MudBlazor PR diff)', () => {
    render(<App />);

    // DRAVEN DataGrip IDE runner interaction
    const dravenBtn = screen.getByRole('button', { name: /Spustiť znova/i });
    expect(screen.getByText(/PASS · 8ms · 100% zhoda dát/i)).toBeInTheDocument();
    fireEvent.click(dravenBtn);
    expect(screen.getByText(/Pripravené na spustenie/i)).toBeInTheDocument();
    fireEvent.click(dravenBtn);
    expect(screen.getByText(/PASS · 8ms · 100% zhoda dát/i)).toBeInTheDocument();

    // MudBlazor PR diff switcher
    const dialogPrBtn = screen.getByRole('button', { name: /PR #13946 \(Dialog Lifecycle\)/i });
    fireEvent.click(dialogPrBtn);
    expect(screen.getByText(/Ošetrenie race-condition pri okamžitom znovuotvorení/i)).toBeInTheDocument();

    const popoverPrBtn = screen.getByRole('button', { name: /PR #14074 \(Popover Zoom\)/i });
    fireEvent.click(popoverPrBtn);
    expect(screen.getByText(/Korekcia pozície popoveru pri CSS body/i)).toBeInTheDocument();
  });
});
