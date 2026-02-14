import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <h1>home page</h1>
      <p>
        for guests
      </p>
      <ul>
        <li>
          <Link to="/people">people</Link>
        </li>
        <li>
          <Link to="/cemeteries">cemeteries</Link>
        </li>
      </ul>
    </>
  );
}
