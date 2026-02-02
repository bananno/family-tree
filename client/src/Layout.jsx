import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { useFeaturedQuoteText } from 'misc/featured-quote/useFeaturedQuoteText';
import useSessionContext from 'session/useSessionContext';
import Button from 'shared/form/Button';
import useEnvironment from 'shared/useEnvironment';

import layoutClasses from './Layout.module.scss';

export default function Layout() {
  const { currentUser } = useSessionContext();

  return (
    <div className={layoutClasses.Layout}>
      <header className={layoutClasses.LayoutHeader}>
        <h1>Family Tree</h1>
        <EnvironmentButton />
        <span>{currentUser?.name}</span>
        <LayoutNavigation />
      </header>
      <main className={layoutClasses.LayoutContent1}>
        <div className={layoutClasses.LayoutContent2}>
          <Outlet />
        </div>
      </main>
      <footer className={layoutClasses.LayoutFooter}>
        <FeaturedQuote />
      </footer>
    </div>
  );
}

////////////////////

function EnvironmentButton() {
  const { isLocal, environment, toggleEnvironment } = useEnvironment();
  return isLocal ? (
    <Button text={environment} onClick={toggleEnvironment} />
  ) : null;
}

function FeaturedQuote() {
  const { currentUser } = useSessionContext();
  const { quote } = useFeaturedQuoteText();

  return currentUser?.admin ? (
    <Link to="/featured-quotes">{quote}</Link>
  ) : (
    <p>{quote}</p>
  );
}

function LayoutNavigation() {
  return (
    <div className={layoutClasses.LayoutNavigation}>
      <ul>
        <LayoutNavItem path="/" text="Home" isPublic />
        <LayoutNavItem path="/people" text="People" isPublic />
        <LayoutNavItem path="/stories" text="Stories" isPublic />
        <LayoutNavItem path="/sources" text="Sources" />
        <LayoutNavItem path="/events" text="Events" />
        <LayoutNavItem path="/notations" text="Notations" />
        <LayoutNavItem path="/map" text="Map" />
        <LayoutNavItem path="/checklists" text="Checklists" />
        <LayoutNavItem path="/tags" text="Tags" />
        <LayoutNavItem path="/utilities" text="Utilities" />
        <LayoutNavItem path="/files" text="Files" />
        <LayoutNavItem path="/account" text="Account" isPublic />
        <LayoutNavItem path="/users" text="Users" />
        <LayoutNavItem path="/404" text="404" />
        <LayoutNavItem path="http://localhost:9000/" text="old site" />
      </ul>
    </div>
  );
}

function LayoutNavItem({ path, text, isPublic }) {
  const { currentUser } = useSessionContext();
  return (
    (isPublic || currentUser?.admin) && (
      <li>
        {' '}
        <Link to={path}>{text}</Link>{' '}
      </li>
    )
  );
}
