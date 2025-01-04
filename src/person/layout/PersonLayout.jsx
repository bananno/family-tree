import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { PersonProvider, usePersonContext } from 'person/PersonContext';

import { useStaticDb } from '../../SETTINGS';

import classes from './PersonLayout.module.scss';

export default function PersonLayout() {
  return (
    <PersonProvider>
      <PersonOutlet />
    </PersonProvider>
  );
}

////////////////////

const personViews = [
  { path: '', title: 'summary', shared: true },
  { path: 'edit', title: 'edit' },
  { path: 'checklist', title: 'checklist' },
  { path: 'timeline', title: 'timeline' },
  { path: 'sources', title: 'sources' },
  { path: 'notations', title: 'notations' },
  { path: 'nationality', title: 'nationality' },
  { path: 'relatives', title: 'relatives' },
  { path: 'connection', title: 'connection' },
  { path: 'wikitree', title: 'wikitree' },
  { path: 'descendants', title: 'descendants' },
  { path: 'mentions', title: 'mentions' },
  { path: 'children', title: 'children' },
].filter(view => view.shared || !useStaticDb);

function PersonOutlet() {
  const { person, loading, notFound } = usePersonContext();

  if (notFound) {
    return <h1>Person Not Found</h1>;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const basePath = `/person/${person.id}`;

  return (
    <div className={classes.PersonLayout}>
      <aside className={classes.sidebar}>
        <div className={classes.header}>
          <img
            src={person.profileImage}
            alt="Logo"
            className={classes.logo}
          />
          <h1 className={classes.title}>{person.name}</h1>
        </div>
        <nav className={classes.navigation}>
          <ul>
            {personViews.map(view => (
              <li key={view.path}>
                <Link to={`${basePath}/${view.path}`}>{view.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={classes.content}>
        <Outlet />
      </main>
    </div>
  );
}
