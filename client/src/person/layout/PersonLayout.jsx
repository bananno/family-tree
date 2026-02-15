import clsx from 'clsx';
import partition from 'lodash/partition';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import { PersonProvider, usePersonContext } from 'person/PersonContext';
import AdminOnly from 'session/AdminOnly';
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

// "sharedUnlessLimited" views are public for fully-shared people,
// but private for limited people.
const allPersonViews = [
  { path: '', title: 'summary', shared: true },
  { path: 'photos', title: 'photos', shared: true },
  { path: 'timeline', title: 'timeline', shared: true },
  { path: 'links', title: 'links', sharedUnlessLimited: true },
  { path: 'citations', title: 'citations', sharedUnlessLimited: true },
  { path: 'edit', title: 'edit' },
  { path: 'tags', title: 'tags' },
  { path: 'technical', title: 'technical' },
  { path: 'checklist', title: 'checklist' },
];

function PersonOutlet() {
  const { person, loading, notFound } = usePersonContext();

  const birthYear = person?.birth?.date?.year;
  const deathYear = person?.death?.date?.year || (person?.living && 'living');

  return (
    <div className={classes.PersonLayout}>
      <aside className={clsx(classes.sidebar, 'flex-shrink-0')}>
        <div className={classes.header}>
          <PersonAvatar person={person} />
          <h1>
            {notFound && 'Person Not Found'}
            {loading && <>&nbsp;</>}
            {person?.name}
          </h1>
          {(birthYear || deathYear) && (
            <h2>
              {birthYear || '?'} - {deathYear}
            </h2>
          )}
        </div>
        {person && <PersonNavigation person={person} />}
      </aside>
      <main className={classes.content}>
        {!person && loading && 'Loading...'}
        {person && <Outlet />}
      </main>
    </div>
  );
}

function PersonNavigation({ person }) {
  const { pathname } = useLocation();
  const basePath = `/person/${person.id}`;

  const [publicPersonViews, adminPersonViews] = partition(
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
        {publicPersonViews.map(view => (
          <li key={view.path}>
            <LinkOrText to={`${basePath}/${view.path}`} pathname={pathname}>
              {view.title}
            </LinkOrText>
          </li>
        ))}
        <AdminOnly>
          <hr />
          {adminPersonViews.map(view => (
            <li key={view.path}>
              <LinkOrText to={`${basePath}/${view.path}`} pathname={pathname}>
                {view.title}
              </LinkOrText>
            </li>
          ))}
          <li>
            <ExternalLink
              to={`https://ancestry.annacpeterson.com/person/${person.id}`}
            >
              old site
            </ExternalLink>
          </li>
          <DevOnly>
            <li>
              <ExternalLink
                to={`https://tree.annabidstrup.com/person/${person.id}`}
              >
                production
              </ExternalLink>
            </li>
            <li>
              <Link to={`http://localhost:9000/person/${person.id}`}>
                ejs app
              </Link>
            </li>
          </DevOnly>
        </AdminOnly>
      </ul>
    </nav>
  );
}

function LinkOrText({ pathname, to, children }) {
  // Ignore trailing slashes when comparing paths.
  if (pathname.replace(/\/$/, '') === to.replace(/\/$/, '')) {
    return <>{children}</>;
  }
  return <Link to={to}>{children}</Link>;
}

function PersonAvatar() {
  const { person, personId } = usePersonContext();
  const { isDevelopment } = useEnvironment();

  if (isDevelopment) {
    return (
      <Link to={`/person/${personId}/avatar`}>
        <PersonProfileIcon person={person} large square />
      </Link>
    );
  }

  return <PersonProfileIcon person={person} large square />;
}
