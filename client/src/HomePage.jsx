import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <h1 className="text-3xl font-bold">home page</h1>
      <p>for guests:</p>
      <ul className="list-disc list-inside">
        <li>
          <Link to="/people">people</Link>
        </li>
        <li>
          <Link to="/cemeteries">cemeteries</Link>
        </li>
        <li>
          <Link to="/cause-of-death">cause of death</Link>
        </li>
      </ul>
    </>
  );
}
