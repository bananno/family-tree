import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import useFeaturedQuote from 'notation/hooks/useFeaturedQuote';

import layoutClasses from './Layout.module.scss';
import { useStaticDb } from './SETTINGS';

export default function Layout() {
  return (
    <div className={layoutClasses.Layout}>
      <header className={layoutClasses.LayoutHeader}>
        <h1>Family Tree {ENVIRONMENT === 'DEVELOPMENT' && '(development)'}</h1>
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

function FeaturedQuote() {
  const { quote } = useFeaturedQuote();
  return <p>{quote}</p>;
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
  if (!isPublic && useStaticDb) {
    return null;
  }
  return (
    <li>
      <Link to={path}>{text}</Link>
    </li>
  );
}
