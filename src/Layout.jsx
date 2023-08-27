import React from 'react';
import {Outlet, Link} from 'react-router-dom';

import {useStaticDb} from './SETTINGS';
import globalClasses from './Global.module.scss';

const Layout = () => {
  return (
    <div>
      <h1>family history ({ENVIRONMENT.toLowerCase()})</h1>
      <ul className={globalClasses.mainNavigation}>
        <LayoutNavItem path="/" text="Home" isPublic/>
        <LayoutNavItem path="/people" text="People" isPublic/>
        <LayoutNavItem path="/stories" text="Stories" isPublic/>
        <LayoutNavItem path="/sources" text="Sources"/>
        <LayoutNavItem path="/events" text="Events"/>
        <LayoutNavItem path="/notations" text="Notations"/>
        <LayoutNavItem path="/map" text="Map"/>
        <LayoutNavItem path="/checklists" text="Checklists"/>
        <LayoutNavItem path="/tags" text="Tags"/>
        <LayoutNavItem path="/utilities" text="Utilities"/>
        <LayoutNavItem path="/404" text="404"/>
      </ul>
      <Outlet/>
    </div>
  );
};

const LayoutNavItem = ({path, text, isPublic}) => {
  if (!isPublic && useStaticDb) {
    return null;
  }
  return <li><Link to={path}>{text}</Link></li>;
}

export default Layout;
