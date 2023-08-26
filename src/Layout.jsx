import React from 'react';
import {Outlet, Link} from 'react-router-dom';

import globalClasses from './Global.module.scss';

const Layout = () => {
  return (
    <div>
      <h1>family history</h1>
      <ul className={globalClasses.mainNavigation}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/people">People</Link></li>
        <li><Link to="/stories">Stories</Link></li>
        <li><Link to="/sources">Sources</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/notations">Notations</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/checklists">Checklists</Link></li>
        <li><Link to="/tags">Tags</Link></li>
        <li><Link to="/utilities">Utilities</Link></li>
        <li><Link to="/404">404</Link></li>
      </ul>
      <Outlet/>
    </div>
  );
};

export default Layout;
