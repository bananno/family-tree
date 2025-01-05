import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import { PersonProvider, usePersonContext } from 'person/PersonContext';
import DevOnly from 'shared/DevOnly';
import ExternalLink from 'shared/ExternalLink';
import useEnvironment from 'shared/useEnvironment';

import classes from './PersonLayout.module.scss';

export default function PersonLayout() {
  return (
    <PersonProvider>
      <PersonOutlet />
    </PersonProvider>
  );
}

////////////////////

const allPersonViews = [
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
];

function PersonOutlet() {
  const { person, loading, notFound } = usePersonContext();

  return (
    <div className={classes.PersonLayout}>
      <aside className={classes.sidebar}>
        <div className={classes.header}>
          <PersonProfileIcon person={person} large square />
          <h1 className={classes.title}>
            {notFound && 'Person Not Found'}
            {loading && 'Loading...'}
            {person?.name}
          </h1>
        </div>
        {person && <PersonNavigation person={person} />}
      </aside>
      <main className={classes.content}>{person && <Outlet />}</main>
    </div>
  );
}

function PersonNavigation({ person }) {
  const { isProduction } = useEnvironment();
  const basePath = `/person/${person.id}`;

  const personViews = isProduction
    ? allPersonViews.filter(view => view.shared)
    : allPersonViews;

  return (
    <nav className={classes.navigation}>
      <ul>
        {personViews.map(view => (
          <li key={view.path}>
            <Link to={`${basePath}/${view.path}`}>{view.title}</Link>
          </li>
        ))}
        <DevOnly>
          <li>
            <ExternalLink
              to={`https://tree.annabidstrup.com/person/${person.id}`}
            >
              new site
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              to={`https://ancestry.annacpeterson.com/person/${person.id}`}
            >
              old site
            </ExternalLink>
          </li>
        </DevOnly>
      </ul>
    </nav>
  );
}
