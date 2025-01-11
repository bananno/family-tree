import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import { PersonProvider, usePersonContext } from 'person/PersonContext';
import DevOnly from 'shared/DevOnly';
import ExternalLink from 'shared/ExternalLink';

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
  { path: 'timeline', title: 'timeline', shared: true },
  // The citations view is public for fully-shared people, but private for limited people.
  { path: 'citations', title: 'citations', sharedUnlessLimited: true },
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

  const birthYear = person?.birth?.date?.year;
  const deathYear = person?.death?.date?.year;

  return (
    <div className={classes.PersonLayout}>
      <aside className={classes.sidebar}>
        <div className={classes.header}>
          <PersonProfileIcon person={person} large square />
          <h1>
            {notFound && 'Person Not Found'}
            {loading && 'Loading...'}
            {person?.name}
          </h1>
          {(birthYear || deathYear) && (
            <h2>
              {birthYear || '?'}–{deathYear}
            </h2>
          )}
        </div>
        {person && <PersonNavigation person={person} />}
      </aside>
      <main className={classes.content}>{person && <Outlet />}</main>
    </div>
  );
}

function PersonNavigation({ person }) {
  const basePath = `/person/${person.id}`;

  const [productionPersonViews, developmentPersonViews] = _.partition(
    allPersonViews,
    view => {
      if (view.sharedUnlessLimited) {
        return !person.private;
      }
      return view.shared;
    },
  );

  return (
    <nav className={classes.navigation}>
      <ul>
        {productionPersonViews.map(view => (
          <li key={view.path}>
            <Link to={`${basePath}/${view.path}`}>{view.title}</Link>
          </li>
        ))}
        <DevOnly>
          <hr />
          {developmentPersonViews.map(view => (
            <li key={view.path}>
              <Link to={`${basePath}/${view.path}`}>{view.title}</Link>
            </li>
          ))}
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
          <li>
            <Link to={`http://localhost:9000/person/${person.id}`}>
              ejs app
            </Link>
          </li>
        </DevOnly>
      </ul>
    </nav>
  );
}
