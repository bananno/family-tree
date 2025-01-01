import React from 'react';
import { Outlet } from 'react-router-dom';

import { PersonProvider, usePersonContext } from 'person/PersonContext';

export default function PersonLayout() {
  return (
    <PersonProvider>
      <PersonOutlet />
    </PersonProvider>
  );
}

////////////////////

function PersonOutlet() {
  const { person, loading, notFound } = usePersonContext();

  if (notFound) {
    return <h1>Person Not Found</h1>;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Person: {person.name}</h1>
      <Outlet />
    </>
  );
}
