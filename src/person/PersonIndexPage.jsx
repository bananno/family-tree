import React from 'react';

import PersonList from 'person/PersonList';
import usePersonList from 'person/usePersonList';

export default function PeoplePage() {
  const { people, isLoading } = usePersonList();

  return (
    <>
      <h1>People</h1>
      {isLoading && <p>loading...</p>}
      <PersonList people={people} />
    </>
  );
}
