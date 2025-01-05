import React from 'react';

import PersonList from 'person/components/PersonList';
import usePersonList from 'person/hooks/usePersonList';

export default function PersonIndexPage() {
  const { people, isLoading } = usePersonList();

  return (
    <>
      <h1>People</h1>
      {isLoading && <p>loading...</p>}
      <PersonList people={people} />
    </>
  );
}
