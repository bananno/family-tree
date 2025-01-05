import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { useFeaturedQuoteText } from 'misc/featured-quote/useFeaturedQuoteText';
import Button from 'shared/form/Button';
import useEnvironment from 'shared/useEnvironment';

import layoutClasses from './Layout.module.scss';

export default function Layout() {
  return (
    <div className={layoutClasses.Layout}>
      <header className={layoutClasses.LayoutHeader}>
        <h1>Family Tree</h1>
        <EnvironmentButton />
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
  const { quote } = useFeaturedQuoteText();
  const { isProduction } = useEnvironment();

  return isProduction ? (
    <p>{quote}</p>
  ) : (
    <Link to="/featured-quotes">{quote}</Link>
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
        <LayoutNavItem path="/404" text="404" />
      </ul>
    </div>
  );
}

function LayoutNavItem({ path, text, isPublic }) {
  const { isDevelopment } = useEnvironment();
  return (
    (isPublic || isDevelopment) && (
      <li>
        {' '}
        <Link to={path}>{text}</Link>{' '}
      </li>
    )
  );
}
