/**
 * Pure geometric, filtering, and telemetry utilities for the portfolio and Visual Craft Lab.
 * Enforces the 4px spacing scale and nested corner radius formula (R_inner = max(4, R_outer - padding)).
 */

export function snapToGrid(value, step = 4) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return 0;
  }
  const validStep = Number.isFinite(Number(step)) && Number(step) > 0 ? Number(step) : 4;
  return Math.round(num / validStep) * validStep;
}

export function computeNestedRadius(outerRadius, padding) {
  const outer = Number(outerRadius);
  const pad = Number(padding);

  if (!Number.isFinite(outer) || outer <= 4) {
    return 4;
  }
  if (!Number.isFinite(pad) || pad <= 0) {
    return Math.max(4, Math.round(outer));
  }

  return Math.max(4, Math.round(outer - pad));
}

export function filterProjects(projects, category = 'all', searchQuery = '') {
  if (!Array.isArray(projects)) {
    return [];
  }

  const normalizedCategory = (category || 'all').toString().trim().toLowerCase();
  const normalizedQuery = (searchQuery || '').toString().trim().toLowerCase();

  return projects.filter((project) => {
    if (!project || typeof project !== 'object') {
      return false;
    }

    const matchesCategory =
      normalizedCategory === 'all' ||
      (project.category && project.category.toLowerCase() === normalizedCategory);

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      project.title || '',
      project.summary || '',
      project.architectureNote || '',
      ...(Array.isArray(project.stack) ? project.stack : []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function formatMetricDelta(current, baseline, unit = '%', comparisonLabel = 'oproti základu') {
  const curr = Number(current);
  const base = Number(baseline);

  if (!Number.isFinite(curr) || !Number.isFinite(base)) {
    return `0${unit} ${comparisonLabel}`;
  }

  const diff = curr - base;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff}${unit} ${comparisonLabel}`;
}
