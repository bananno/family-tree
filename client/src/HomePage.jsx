import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from 'routePaths';

export default function HomePage() {
  return (
    <>
      <h1 className="text-3xl font-bold">home page</h1>
      <p>for guests:</p>
      <ul className="list-disc list-inside">
        <li>
          <Link to={ROUTE_PATHS.personIndex}>people</Link>
        </li>
        <li>
          <Link to={ROUTE_PATHS.cemeteryIndex}>cemeteries</Link>
        </li>
        <li>
          <Link to={ROUTE_PATHS.newspaperIndex}>newspapers</Link>
        </li>
        <li>
          <Link to={ROUTE_PATHS.specialCauseOfDeath}>cause of death</Link>
        </li>
      </ul>
    </>
  );
}
