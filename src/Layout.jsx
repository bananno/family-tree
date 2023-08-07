import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>family history</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/people">People</Link></li>
        <li><Link to="/404">404</Link></li>
      </ul>
      <Outlet/>
    </div>
  );
};

export default HomePage;
