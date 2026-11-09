import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GitCommit } from 'lucide-react';
import { REAL_DAILY_CONTRIBUTIONS } from '../data/contributionsData';
import { useScrollReveal } from '../utils/useScrollReveal';
import { useSlidingTabsPill, AnimatedNumber } from './MotionPrimitives';

const MONTH_NAMES_SK = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Máj',
  'Jún',
  'Júl',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dec',
];

const SOURCE_FILTERS = [
  { id: 'all', label: 'Všetky repozitáre' },
  { id: 'enterprise', label: 'Enterprise GitLab' },
  { id: 'fei', label: 'FEI TUKE GitLab' },
  { id: 'github', label: 'GitHub & OSS' },
];

function formatDateIso(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getContributionLevel(count) {
  if (!count || count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export function ContributionGraph() {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [liveGithubMap, setLiveGithubMap] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);

  const cardRef = useRef(null);
  const filterTabsRef = useRef(null);
  const revealed = useScrollReveal(cardRef, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  useSlidingTabsPill(filterTabsRef, sourceFilter);

  // Live fetch from public GitHub contributions API to keep @milan-micieta public activity up-to-date
  useEffect(() => {
    let isMounted = true;
    if (typeof fetch !== 'function') return undefined;

    fetch('https://github-contributions-api.jogruber.de/v4/milan-micieta?y=last')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data || !Array.isArray(data.contributions)) return;
        const map = {};
        data.contributions.forEach((entry) => {
          if (entry && entry.date && entry.count > 0) {
            map[entry.date] = entry.count;
          }
        });
        setLiveGithubMap(map);
      })
      .catch(() => {
        // Fallback silently to bundled real git log data when offline or in tests
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { weeks, monthLabels, totalCount, activeDaysCount } = useMemo(() => {
    // Anchor end date to latest date in dataset or current date (2026-11-08)
    const endDate = new Date(2026, 10, 8);
    // Start 52 weeks earlier, aligned to Monday (row 0 = Monday, ..., row 6 = Sunday)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 364);
    const mondayOffset = (startDate.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    startDate.setDate(startDate.getDate() - mondayOffset);

    const weeksList = [];
    const monthsList = [];
    let lastMonth = -1;
    let sumTotal = 0;
    let sumActiveDays = 0;

    const cursor = new Date(startDate);
    for (let w = 0; w < 53; w += 1) {
      const days = [];
      for (let d = 0; d < 7; d += 1) {
        const iso = formatDateIso(cursor);
        const isFuture = cursor > endDate;
        const base = REAL_DAILY_CONTRIBUTIONS[iso] || { g: 0, f: 0, e: 0 };
        const liveG = liveGithubMap[iso] || 0;
        const gCount = Math.max(base.g, liveG);
        const fCount = base.f;
        const eCount = base.e;

        let count = 0;
        if (!isFuture) {
          if (sourceFilter === 'github') count = gCount;
          else if (sourceFilter === 'fei') count = fCount;
          else if (sourceFilter === 'enterprise') count = eCount;
          else count = gCount + fCount + eCount;
        }

        if (!isFuture && count > 0) {
          sumTotal += count;
          sumActiveDays += 1;
        }

        if (d === 0) {
          const m = cursor.getMonth();
          if (m !== lastMonth) {
            monthsList.push({ weekIndex: w, label: MONTH_NAMES_SK[m] });
            lastMonth = m;
          }
        }

        days.push({
          date: iso,
          displayDate: `${cursor.getDate()}. ${MONTH_NAMES_SK[cursor.getMonth()]} ${cursor.getFullYear()}`,
          count,
          level: isFuture ? -1 : getContributionLevel(count),
          breakdown: { g: gCount, f: fCount, e: eCount },
          isFuture,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
      weeksList.push(days);
    }

    return {
      weeks: weeksList,
      monthLabels: monthsList,
      totalCount: sumTotal,
      activeDaysCount: sumActiveDays,
    };
  }, [sourceFilter, liveGithubMap]);

  return (
    <div
      ref={cardRef}
      className={`contribution-graph-card scroll-reveal-item ${revealed ? 'is-visible' : ''}`}
      data-testid="contribution-graph-card"
    >
      <div className="contribution-header">
        <div className="contribution-title-group">
          <div className="contribution-headline-row">
            <GitCommit size={16} strokeWidth={2} className="contribution-icon" aria-hidden="true" />
            <h3 className="contribution-count-title">
              <AnimatedNumber value={totalCount} className="contribution-total-num" /> príspevkov za posledný rok
            </h3>
            <span className="contribution-active-badge">
              <AnimatedNumber value={activeDaysCount} /> aktívnych dní
            </span>
          </div>
          <p className="contribution-subtitle">
            Reálna aktivita naprieč repozitármi (GitHub @milan-micieta · FEI TUKE GitLab · Enterprise GitLab)
          </p>
        </div>

        <div
          ref={filterTabsRef}
          className="contribution-filter-pills t-tabs"
          role="tablist"
          aria-label="Filter zdroja príspevkov"
        >
          <span className="t-tabs-pill" aria-hidden="true" />
          {SOURCE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={sourceFilter === filter.id}
              onClick={() => setSourceFilter(filter.id)}
              className={`contribution-filter-btn t-tab ${sourceFilter === filter.id ? 'is-active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="contribution-grid-wrapper">
        <div className="contribution-months-row" aria-hidden="true">
          <span className="day-axis-spacer" />
          <div className="months-track">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                className="month-label"
                style={{ gridColumnStart: m.weekIndex + 1 }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div className="contribution-body-grid">
          <div className="contribution-day-labels" aria-hidden="true">
            <span>Pon</span>
            <span></span>
            <span>Str</span>
            <span></span>
            <span>Pia</span>
            <span></span>
            <span>Ned</span>
          </div>

          <div
            className="contribution-weeks-grid"
            role="grid"
            aria-label="Kalendár Git príspevkov za posledných 53 týždňov"
          >
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="contribution-week-col" role="row">
                {week.map((day) =>
                  day.isFuture ? (
                    <span
                      key={day.date}
                      className="contribution-cell is-future"
                      aria-hidden="true"
                    />
                  ) : (
                    <button
                      key={day.date}
                      type="button"
                      role="gridcell"
                      onMouseEnter={() => setHoveredDay(day)}
                      onFocus={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`contribution-cell level-${day.level}`}
                      aria-label={`${day.count} príspevkov dňa ${day.displayDate}`}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="contribution-footer">
        <div className="contribution-hover-status" aria-live="polite">
          {hoveredDay ? (
            <span>
              <strong>
                {hoveredDay.count}{' '}
                {hoveredDay.count === 1
                  ? 'príspevok'
                  : hoveredDay.count >= 2 && hoveredDay.count <= 4
                  ? 'príspevky'
                  : 'príspevkov'}
              </strong>{' '}
              · {hoveredDay.displayDate}
              {hoveredDay.count > 0 && (
                <span className="hover-breakdown">
                  {' '}
                  (Enterprise: {hoveredDay.breakdown.e} · FEI TUKE: {hoveredDay.breakdown.f} · GitHub:{' '}
                  {hoveredDay.breakdown.g})
                </span>
              )}
            </span>
          ) : (
            <span>Prejdi myšou nad políčko pre detailný rozpis dňa podľa zdroja</span>
          )}
        </div>

        <div className="contribution-legend" aria-hidden="true">
          <span className="legend-label">Menej</span>
          <span className="contribution-cell level-0" />
          <span className="contribution-cell level-1" />
          <span className="contribution-cell level-2" />
          <span className="contribution-cell level-3" />
          <span className="contribution-cell level-4" />
          <span className="legend-label">Viac</span>
        </div>
      </div>
    </div>
  );
}
