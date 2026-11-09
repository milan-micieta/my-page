import React, { useState, useEffect } from 'react';
import './App.css';
import { PortfolioPage } from './portfolio/PortfolioPage';
import { ProjectDetailPage } from './portfolio/components/ProjectDetailPage';
import { WorkPage } from './portfolio/components/WorkPage';
import { PROFILE_DATA } from './portfolio/data/profileData';

function getRouteStateFromLocation() {
  if (typeof window === 'undefined') return { projectId: null, isWork: false };
  const hash = window.location.hash || '';
  if (hash === '#/work' || hash.startsWith('#/work')) {
    return { projectId: null, isWork: true };
  }
  const matchHash = hash.match(/^#\/project\/([a-zA-Z0-9_-]+)/);
  if (matchHash) return { projectId: matchHash[1], isWork: false };

  try {
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get('project');
    if (paramId) return { projectId: paramId, isWork: false };
    if (params.get('view') === 'work') return { projectId: null, isWork: true };
  } catch {
    // Ignore URL search parsing errors
  }

  return { projectId: null, isWork: false };
}

function App() {
  const [routeState, setRouteState] = useState(getRouteStateFromLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setRouteState(getRouteStateFromLocation());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleSelectProject = (projectId) => {
    if (projectId) {
      window.location.hash = `#/project/${projectId}`;
      setRouteState({ projectId, isWork: false });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      window.location.hash = '#projekty';
      setRouteState({ projectId: null, isWork: false });
    }
  };

  const handleNavigateToWork = () => {
    window.location.hash = '#/work';
    setRouteState({ projectId: null, isWork: true });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const activeProject = routeState.projectId
    ? PROFILE_DATA.projects.find((p) => p.id === routeState.projectId)
    : null;

  if (activeProject) {
    return (
      <ProjectDetailPage
        project={activeProject}
        allProjects={PROFILE_DATA.projects}
        onBack={() => handleSelectProject(null)}
        onSelectProject={handleSelectProject}
      />
    );
  }

  if (routeState.isWork) {
    return (
      <WorkPage
        allProjects={PROFILE_DATA.projects}
        categories={PROFILE_DATA.categories}
        onBack={() => handleSelectProject(null)}
        onSelectProject={handleSelectProject}
      />
    );
  }

  return (
    <PortfolioPage
      onSelectProject={handleSelectProject}
      onNavigateToWork={handleNavigateToWork}
    />
  );
}

export default App;
